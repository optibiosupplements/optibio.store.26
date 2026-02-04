import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { auditLogs } from "../../drizzle/schema";
import { eq, desc, and, or, like, sql, gte, lte } from "drizzle-orm";

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

export const adminAuditRouter = router({
  // List audit logs with filtering
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
      userId: z.number().optional(),
      action: z.enum(["create", "update", "delete", "view", "login", "logout", "password_change", "role_change", "refund", "cancel", "ship", "fulfill", "export", "import"]).optional(),
      resourceType: z.enum(["product", "order", "customer", "discount", "content", "settings", "user", "inventory"]).optional(),
      search: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { page = 1, limit = 50, userId, action, resourceType, search, startDate, endDate } = input || {};
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [];
      if (userId) {
        conditions.push(eq(auditLogs.userId, userId));
      }
      if (action) {
        conditions.push(eq(auditLogs.action, action));
      }
      if (resourceType) {
        conditions.push(eq(auditLogs.resourceType, resourceType));
      }
      if (search) {
        conditions.push(
          or(
            like(auditLogs.resourceName, `%${search}%`),
            like(auditLogs.changeDescription, `%${search}%`),
            like(auditLogs.userName, `%${search}%`)
          )
        );
      }
      if (startDate) {
        conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const logs = await db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(auditLogs)
        .where(whereClause);
      const total = countResult[0]?.count || 0;
      
      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single audit log entry
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const log = await db.select().from(auditLogs).where(eq(auditLogs.id, input.id)).limit(1);
      if (!log[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Audit log not found" });
      }
      
      return log[0];
    }),

  // Get audit stats
  getStats: adminProcedure
    .input(z.object({
      days: z.number().min(1).max(90).default(30),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { days = 30 } = input || {};
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get action counts
      const actionCounts = await db
        .select({
          action: auditLogs.action,
          count: sql<number>`count(*)`,
        })
        .from(auditLogs)
        .where(gte(auditLogs.createdAt, startDate))
        .groupBy(auditLogs.action);
      
      // Get resource type counts
      const resourceCounts = await db
        .select({
          resourceType: auditLogs.resourceType,
          count: sql<number>`count(*)`,
        })
        .from(auditLogs)
        .where(gte(auditLogs.createdAt, startDate))
        .groupBy(auditLogs.resourceType);
      
      // Get top users by activity
      const topUsers = await db
        .select({
          userId: auditLogs.userId,
          userName: auditLogs.userName,
          count: sql<number>`count(*)`,
        })
        .from(auditLogs)
        .where(gte(auditLogs.createdAt, startDate))
        .groupBy(auditLogs.userId, auditLogs.userName)
        .orderBy(desc(sql`count(*)`))
        .limit(10);
      
      // Get daily activity
      const dailyActivity = await db
        .select({
          date: sql<string>`DATE(${auditLogs.createdAt})`,
          count: sql<number>`count(*)`,
        })
        .from(auditLogs)
        .where(gte(auditLogs.createdAt, startDate))
        .groupBy(sql`DATE(${auditLogs.createdAt})`)
        .orderBy(sql`DATE(${auditLogs.createdAt})`);
      
      return {
        actionCounts: actionCounts.reduce((acc, { action, count }) => {
          if (action) acc[action] = count;
          return acc;
        }, {} as Record<string, number>),
        resourceCounts: resourceCounts.reduce((acc, { resourceType, count }) => {
          if (resourceType) acc[resourceType] = count;
          return acc;
        }, {} as Record<string, number>),
        topUsers,
        dailyActivity,
        period: { days, startDate, endDate: new Date() },
      };
    }),

  // Get activity for specific resource
  getResourceActivity: adminProcedure
    .input(z.object({
      resourceType: z.enum(["product", "order", "customer", "discount", "content", "settings", "user", "inventory"]),
      resourceId: z.number(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const logs = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.resourceType, input.resourceType),
            eq(auditLogs.resourceId, input.resourceId)
          )
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(input.limit);
      
      return logs;
    }),
});
