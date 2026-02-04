import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { discountCodes } from "../../drizzle/schema";
import { auditLogs } from "../../drizzle/admin-schema";
import { eq, desc, asc, like, and, or, sql, count, gte, lte } from "drizzle-orm";

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

// Log audit action
async function logAudit(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: number,
  userName: string | null,
  userRole: string,
  action: string,
  resourceId: number | null,
  resourceName: string | null,
  previousValue: any,
  newValue: any,
  changeDescription: string
) {
  if (!db) return;
  
  await db.insert(auditLogs).values({
    userId,
    userName: userName || undefined,
    userRole,
    action: action as any,
    resourceType: "discount",
    resourceId: resourceId || undefined,
    resourceName: resourceName || undefined,
    previousValue: previousValue ? JSON.stringify(previousValue) : undefined,
    newValue: newValue ? JSON.stringify(newValue) : undefined,
    changeDescription,
  });
}

export const adminDiscountsRouter = router({
  // List all discount codes with pagination and search
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      status: z.enum(["all", "active", "inactive", "expired"]).default("all"),
      type: z.enum(["all", "percentage", "fixed"]).default("all"),
      sortBy: z.enum(["code", "createdAt", "usedCount", "expiresAt"]).default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status = "all", 
        type = "all",
        sortBy = "createdAt", 
        sortOrder = "desc"
      } = input || {};
      
      const offset = (page - 1) * limit;
      const now = new Date();
      
      // Build where conditions
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(discountCodes.code, `%${search}%`),
            like(discountCodes.description, `%${search}%`)
          )
        );
      }
      if (status === "active") {
        conditions.push(eq(discountCodes.isActive, true));
        conditions.push(or(
          sql`${discountCodes.expiresAt} IS NULL`,
          gte(discountCodes.expiresAt, now)
        ));
      } else if (status === "inactive") {
        conditions.push(eq(discountCodes.isActive, false));
      } else if (status === "expired") {
        conditions.push(lte(discountCodes.expiresAt, now));
      }
      if (type !== "all") {
        conditions.push(eq(discountCodes.discountType, type));
      }
      
      // Build order by
      const orderByMap: Record<string, any> = {
        code: discountCodes.code,
        createdAt: discountCodes.createdAt,
        usedCount: discountCodes.usedCount,
        expiresAt: discountCodes.expiresAt,
      };
      const orderByColumn = orderByMap[sortBy];
      const orderByDirection = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      // Get discount codes
      const codeList = await db
        .select()
        .from(discountCodes)
        .where(whereClause)
        .orderBy(orderByDirection)
        .limit(limit)
        .offset(offset);
      
      // Get total count
      const countResult = await db
        .select({ count: count() })
        .from(discountCodes)
        .where(whereClause);
      const total = countResult[0]?.count || 0;
      
      return {
        discounts: codeList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single discount code
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const discount = await db.select().from(discountCodes).where(eq(discountCodes.id, input.id)).limit(1);
      if (!discount[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Discount code not found" });
      }
      
      return discount[0];
    }),

  // Create new discount code
  create: adminProcedure
    .input(z.object({
      code: z.string().min(1).max(50).transform(s => s.toUpperCase()),
      description: z.string().optional(),
      discountType: z.enum(["percentage", "fixed"]),
      discountValue: z.number().min(1), // Percentage (1-100) or cents
      minPurchaseInCents: z.number().min(0).default(0),
      maxUsesTotal: z.number().min(1).optional(),
      maxUsesPerCustomer: z.number().min(1).default(1),
      isActive: z.boolean().default(true),
      startsAt: z.string().optional(), // ISO date string
      expiresAt: z.string().optional(), // ISO date string
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check for duplicate code
      const existing = await db.select().from(discountCodes).where(eq(discountCodes.code, input.code)).limit(1);
      if (existing[0]) {
        throw new TRPCError({ code: "CONFLICT", message: "A discount code with this code already exists" });
      }
      
      // Validate percentage
      if (input.discountType === "percentage" && (input.discountValue < 1 || input.discountValue > 100)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Percentage must be between 1 and 100" });
      }
      
      const result = await db.insert(discountCodes).values({
        code: input.code,
        description: input.description || undefined,
        discountType: input.discountType,
        discountValue: input.discountValue,
        minPurchaseInCents: input.minPurchaseInCents,
        maxUsesTotal: input.maxUsesTotal || undefined,
        maxUsesPerCustomer: input.maxUsesPerCustomer,
        isActive: input.isActive,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      });
      
      const discountId = Number(result[0].insertId);
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "create",
        discountId,
        input.code,
        null,
        input,
        `Created discount code: ${input.code}`
      );
      
      return { id: discountId, message: "Discount code created successfully" };
    }),

  // Update discount code
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      code: z.string().min(1).max(50).transform(s => s.toUpperCase()).optional(),
      description: z.string().nullable().optional(),
      discountType: z.enum(["percentage", "fixed"]).optional(),
      discountValue: z.number().min(1).optional(),
      minPurchaseInCents: z.number().min(0).optional(),
      maxUsesTotal: z.number().min(1).nullable().optional(),
      maxUsesPerCustomer: z.number().min(1).optional(),
      isActive: z.boolean().optional(),
      startsAt: z.string().nullable().optional(),
      expiresAt: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      // Get current discount
      const current = await db.select().from(discountCodes).where(eq(discountCodes.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Discount code not found" });
      }
      
      // Check for duplicate code if updating
      if (updates.code && updates.code !== current[0].code) {
        const existing = await db.select().from(discountCodes).where(eq(discountCodes.code, updates.code)).limit(1);
        if (existing[0]) {
          throw new TRPCError({ code: "CONFLICT", message: "A discount code with this code already exists" });
        }
      }
      
      // Validate percentage
      const discountType = updates.discountType || current[0].discountType;
      const discountValue = updates.discountValue || current[0].discountValue;
      if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Percentage must be between 1 and 100" });
      }
      
      // Build update data
      const updateData: any = {};
      if (updates.code !== undefined) updateData.code = updates.code;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.discountType !== undefined) updateData.discountType = updates.discountType;
      if (updates.discountValue !== undefined) updateData.discountValue = updates.discountValue;
      if (updates.minPurchaseInCents !== undefined) updateData.minPurchaseInCents = updates.minPurchaseInCents;
      if (updates.maxUsesTotal !== undefined) updateData.maxUsesTotal = updates.maxUsesTotal;
      if (updates.maxUsesPerCustomer !== undefined) updateData.maxUsesPerCustomer = updates.maxUsesPerCustomer;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
      if (updates.startsAt !== undefined) updateData.startsAt = updates.startsAt ? new Date(updates.startsAt) : null;
      if (updates.expiresAt !== undefined) updateData.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;
      
      await db.update(discountCodes).set(updateData).where(eq(discountCodes.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "update",
        id,
        current[0].code,
        current[0],
        updates,
        `Updated discount code: ${current[0].code}`
      );
      
      return { message: "Discount code updated successfully" };
    }),

  // Delete (deactivate) discount code
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(discountCodes).where(eq(discountCodes.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Discount code not found" });
      }
      
      // Soft delete - set inactive
      await db.update(discountCodes).set({ isActive: false }).where(eq(discountCodes.id, input.id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "delete",
        input.id,
        current[0].code,
        current[0],
        { isActive: false },
        `Deactivated discount code: ${current[0].code}`
      );
      
      return { message: "Discount code deactivated successfully" };
    }),

  // Get discount statistics
  getStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const now = new Date();
      
      // Total codes
      const [total] = await db.select({ count: count() }).from(discountCodes);
      
      // Active codes
      const [active] = await db
        .select({ count: count() })
        .from(discountCodes)
        .where(and(
          eq(discountCodes.isActive, true),
          or(
            sql`${discountCodes.expiresAt} IS NULL`,
            gte(discountCodes.expiresAt, now)
          )
        ));
      
      // Expired codes
      const [expired] = await db
        .select({ count: count() })
        .from(discountCodes)
        .where(lte(discountCodes.expiresAt, now));
      
      // Total uses
      const [totalUses] = await db
        .select({ total: sql<number>`COALESCE(SUM(${discountCodes.usedCount}), 0)` })
        .from(discountCodes);
      
      // Most used codes
      const mostUsed = await db
        .select({
          code: discountCodes.code,
          usedCount: discountCodes.usedCount,
          discountType: discountCodes.discountType,
          discountValue: discountCodes.discountValue,
        })
        .from(discountCodes)
        .orderBy(desc(discountCodes.usedCount))
        .limit(5);
      
      return {
        totalCodes: total?.count || 0,
        activeCodes: active?.count || 0,
        expiredCodes: expired?.count || 0,
        totalUses: Number(totalUses?.total || 0),
        mostUsed,
      };
    }),
});
