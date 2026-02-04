import { z } from "zod";
import { eq, desc, gte, and, sql, count } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { orders, users, products } from "../../drizzle/schema";
import { auditLogs } from "../../drizzle/admin-schema";

// Helper to check admin access
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminDashboardRouter = router({
  // Get comprehensive dashboard metrics
  getMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        sales: { today: 0, week: 0, month: 0, allTime: 0 },
        customers: { today: 0, week: 0, month: 0, total: 0 },
        orders: { pending: 0, processing: 0, shipped: 0, delivered: 0 },
        recentOrders: [],
        lowStockProducts: [],
        recentActivity: [],
      };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setMonth(monthStart.getMonth() - 1);

    // Sales metrics
    const [salesToday] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
      .from(orders)
      .where(and(gte(orders.createdAt, todayStart), eq(orders.paymentStatus, "paid")));

    const [salesWeek] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
      .from(orders)
      .where(and(gte(orders.createdAt, weekStart), eq(orders.paymentStatus, "paid")));

    const [salesMonth] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
      .from(orders)
      .where(and(gte(orders.createdAt, monthStart), eq(orders.paymentStatus, "paid")));

    const [salesAllTime] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "paid"));

    // Customer metrics
    const [customersToday] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, todayStart));

    const [customersWeek] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, weekStart));

    const [customersMonth] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, monthStart));

    const [customersTotal] = await db.select({ count: count() }).from(users);

    // Order status counts
    const [pendingOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));

    const [processingOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "processing"));

    const [shippedOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "shipped"));

    const [deliveredOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    // Recent orders (last 10)
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        totalInCents: orders.totalInCents,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        shippingFirstName: orders.shippingFirstName,
        shippingLastName: orders.shippingLastName,
        customerEmail: orders.email,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    // Low stock products (stockQuantity < lowStockThreshold)
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
      })
      .from(products)
      .where(sql`${products.stockQuantity} < COALESCE(${products.lowStockThreshold}, 10)`)
      .orderBy(products.stockQuantity)
      .limit(5);

    // Recent activity (last 10 audit logs)
    const recentActivity = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resourceType: auditLogs.resourceType,
        resourceId: auditLogs.resourceId,
        resourceName: auditLogs.resourceName,
        changeDescription: auditLogs.changeDescription,
        createdAt: auditLogs.createdAt,
        userName: auditLogs.userName,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return {
      sales: {
        today: Number(salesToday?.total || 0),
        week: Number(salesWeek?.total || 0),
        month: Number(salesMonth?.total || 0),
        allTime: Number(salesAllTime?.total || 0),
      },
      customers: {
        today: customersToday?.count || 0,
        week: customersWeek?.count || 0,
        month: customersMonth?.count || 0,
        total: customersTotal?.count || 0,
      },
      orders: {
        pending: pendingOrders?.count || 0,
        processing: processingOrders?.count || 0,
        shipped: shippedOrders?.count || 0,
        delivered: deliveredOrders?.count || 0,
      },
      recentOrders,
      lowStockProducts,
      recentActivity,
    };
  }),
});
