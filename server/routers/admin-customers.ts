import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, orders, subscriptions, addresses, auditLogs } from "../../drizzle/schema";
import { eq, desc, like, and, or, sql, count } from "drizzle-orm";

// Helper to check if user has admin access (staff, admin, or owner)
const hasAdminAccess = (role: string | null | undefined) => {
  return role === "staff" || role === "admin" || role === "owner";
};

// Admin procedure that requires staff+ access
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!hasAdminAccess(ctx.user?.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminCustomersRouter = router({
  // List all customers with pagination and search
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      role: z.enum(["all", "user", "staff", "admin", "owner"]).default("all"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { page = 1, limit = 20, search, role = "all" } = input || {};
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }
      if (role !== "all") {
        conditions.push(eq(users.role, role));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      // Get customers with order count
      const customerList = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          founderTier: users.founderTier,
          lifetimeDiscountPercent: users.lifetimeDiscountPercent,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Get order counts for each customer
      const customersWithStats = await Promise.all(
        customerList.map(async (customer) => {
          const orderCount = await db
            .select({ count: count() })
            .from(orders)
            .where(eq(orders.userId, customer.id));
          
          const totalSpent = await db
            .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
            .from(orders)
            .where(
              and(
                eq(orders.userId, customer.id),
                eq(orders.paymentStatus, "paid")
              )
            );
          
          return {
            ...customer,
            orderCount: orderCount[0]?.count || 0,
            totalSpentInCents: totalSpent[0]?.total || 0,
          };
        })
      );
      
      // Get total count
      const countResult = await db
        .select({ count: count() })
        .from(users)
        .where(whereClause);
      const total = countResult[0]?.count || 0;
      
      return {
        customers: customersWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single customer with full details
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const customer = await db.select().from(users).where(eq(users.id, input.id)).limit(1);
      if (!customer[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Customer not found" });
      }
      
      // Get customer orders
      const customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, input.id))
        .orderBy(desc(orders.createdAt))
        .limit(10);
      
      // Get customer subscriptions
      const customerSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, input.id))
        .orderBy(desc(subscriptions.createdAt));
      
      // Get customer addresses
      const customerAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, input.id));
      
      // Calculate stats
      const totalOrders = await db
        .select({ count: count() })
        .from(orders)
        .where(eq(orders.userId, input.id));
      
      const totalSpent = await db
        .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
        .from(orders)
        .where(
          and(
            eq(orders.userId, input.id),
            eq(orders.paymentStatus, "paid")
          )
        );
      
      return {
        ...customer[0],
        orders: customerOrders,
        subscriptions: customerSubscriptions,
        addresses: customerAddresses,
        stats: {
          totalOrders: totalOrders[0]?.count || 0,
          totalSpentInCents: totalSpent[0]?.total || 0,
          activeSubscriptions: customerSubscriptions.filter(s => s.status === "active").length,
        },
      };
    }),

  // Update customer role (admin/owner only)
  updateRole: adminProcedure
    .input(z.object({
      id: z.number(),
      role: z.enum(["user", "staff", "admin", "owner"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Only admin and owner can change roles
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admin or owner can change user roles" });
      }
      
      // Only owner can create other owners or admins
      if ((input.role === "owner" || input.role === "admin") && ctx.user?.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can assign admin or owner roles" });
      }
      
      // Cannot change own role
      if (ctx.user?.id === input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot change your own role" });
      }
      
      const current = await db.select().from(users).where(eq(users.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "role_change",
        resourceType: "user",
        resourceId: input.id,
        resourceName: current[0].name || current[0].email || undefined,
        previousValue: JSON.stringify({ role: current[0].role }),
        newValue: JSON.stringify({ role: input.role }),
        changeDescription: `Changed role from ${current[0].role} to ${input.role} for ${current[0].name || current[0].email}`,
      });
      
      return { message: "Role updated successfully" };
    }),

  // Add admin note to customer
  addNote: adminProcedure
    .input(z.object({
      customerId: z.number(),
      note: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const customer = await db.select().from(users).where(eq(users.id, input.customerId)).limit(1);
      if (!customer[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Customer not found" });
      }
      
      // Log as audit entry (using audit log as note system)
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "update",
        resourceType: "customer",
        resourceId: input.customerId,
        resourceName: customer[0].name || customer[0].email || undefined,
        changeDescription: `Admin note: ${input.note}`,
      });
      
      return { message: "Note added successfully" };
    }),

  // Get customer activity (audit log entries)
  getActivity: adminProcedure
    .input(z.object({
      customerId: z.number(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const activity = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.resourceType, "customer"),
            eq(auditLogs.resourceId, input.customerId)
          )
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(input.limit);
      
      return activity;
    }),

  // Get customer stats summary
  getStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const totalCustomers = await db.select({ count: count() }).from(users);
      
      const newCustomersThisMonth = await db
        .select({ count: count() })
        .from(users)
        .where(
          sql`${users.createdAt} >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
        );
      
      const customersWithOrders = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${orders.userId})` })
        .from(orders)
        .where(eq(orders.paymentStatus, "paid"));
      
      const activeSubscribers = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${subscriptions.userId})` })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"));
      
      return {
        totalCustomers: totalCustomers[0]?.count || 0,
        newCustomersThisMonth: newCustomersThisMonth[0]?.count || 0,
        customersWithOrders: customersWithOrders[0]?.count || 0,
        activeSubscribers: activeSubscribers[0]?.count || 0,
      };
    }),
});
