import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { orders, orderItems, users } from "../../drizzle/schema";
import { auditLogs } from "../../drizzle/admin-schema";
import { eq, desc, asc, like, and, or, sql, count, gte, lte } from "drizzle-orm";
import { stripe } from "../stripe";

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
    resourceType: "order",
    resourceId: resourceId || undefined,
    resourceName: resourceName || undefined,
    previousValue: previousValue ? JSON.stringify(previousValue) : undefined,
    newValue: newValue ? JSON.stringify(newValue) : undefined,
    changeDescription,
  });
}

export const adminOrdersRouter = router({
  // List all orders with pagination, search, and filters
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      status: z.enum(["all", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("all"),
      paymentStatus: z.enum(["all", "pending", "paid", "failed", "refunded"]).default("all"),
      sortBy: z.enum(["createdAt", "total", "status"]).default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status = "all", 
        paymentStatus = "all",
        sortBy = "createdAt", 
        sortOrder = "desc",
        startDate,
        endDate
      } = input || {};
      
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(orders.orderNumber, `%${search}%`),
            like(orders.email, `%${search}%`),
            like(orders.shippingFirstName, `%${search}%`),
            like(orders.shippingLastName, `%${search}%`)
          )
        );
      }
      if (status !== "all") {
        conditions.push(eq(orders.status, status));
      }
      if (paymentStatus !== "all") {
        conditions.push(eq(orders.paymentStatus, paymentStatus));
      }
      if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(orders.createdAt, new Date(endDate)));
      }
      
      // Build order by
      const orderByMap: Record<string, any> = {
        createdAt: orders.createdAt,
        total: orders.totalInCents,
        status: orders.status,
      };
      const orderByColumn = orderByMap[sortBy];
      const orderByDirection = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      // Get orders
      const orderList = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          email: orders.email,
          status: orders.status,
          paymentStatus: orders.paymentStatus,
          subtotalInCents: orders.subtotalInCents,
          shippingInCents: orders.shippingInCents,
          taxInCents: orders.taxInCents,
          discountInCents: orders.discountInCents,
          totalInCents: orders.totalInCents,
          shippingFirstName: orders.shippingFirstName,
          shippingLastName: orders.shippingLastName,
          shippingCity: orders.shippingCity,
          shippingState: orders.shippingState,
          trackingNumber: orders.trackingNumber,
          shippingCarrier: orders.shippingCarrier,
          createdAt: orders.createdAt,
          paidAt: orders.paidAt,
        })
        .from(orders)
        .where(whereClause)
        .orderBy(orderByDirection)
        .limit(limit)
        .offset(offset);
      
      // Get total count
      const countResult = await db
        .select({ count: count() })
        .from(orders)
        .where(whereClause);
      const total = countResult[0]?.count || 0;
      
      return {
        orders: orderList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single order with full details
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const order = await db.select().from(orders).where(eq(orders.id, input.id)).limit(1);
      if (!order[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Get order items
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      
      // Get customer info if userId exists
      let customer = null;
      if (order[0].userId) {
        const customerResult = await db.select().from(users).where(eq(users.id, order[0].userId)).limit(1);
        customer = customerResult[0] || null;
      }
      
      return {
        ...order[0],
        items,
        customer,
      };
    }),

  // Update order status
  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      trackingNumber: z.string().optional(),
      shippingCarrier: z.string().optional(),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, status, trackingNumber, shippingCarrier, adminNotes } = input;
      
      // Get current order
      const current = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        pending: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered", "cancelled"],
        delivered: [], // Cannot change from delivered
        cancelled: [], // Cannot change from cancelled
        refunded: [], // Cannot change from refunded
      };
      
      if (!validTransitions[current[0].status]?.includes(status)) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: `Cannot change status from ${current[0].status} to ${status}` 
        });
      }
      
      // Build update data
      const updateData: any = { status };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (shippingCarrier) updateData.shippingCarrier = shippingCarrier;
      if (adminNotes) {
        updateData.adminNotes = current[0].adminNotes 
          ? `${current[0].adminNotes}\n\n[${new Date().toISOString()}] ${adminNotes}`
          : `[${new Date().toISOString()}] ${adminNotes}`;
      }
      
      // Update order
      await db.update(orders).set(updateData).where(eq(orders.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        status === "shipped" ? "ship" : "update",
        id,
        current[0].orderNumber,
        { status: current[0].status },
        { status, trackingNumber, shippingCarrier },
        `Updated order ${current[0].orderNumber} status from ${current[0].status} to ${status}`
      );
      
      return { message: `Order status updated to ${status}` };
    }),

  // Cancel order
  cancel: adminProcedure
    .input(z.object({
      id: z.number(),
      reason: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, reason } = input;
      
      // Get current order
      const current = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Check if order can be cancelled
      if (["delivered", "cancelled", "refunded"].includes(current[0].status)) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: `Cannot cancel order with status: ${current[0].status}` 
        });
      }
      
      // Update order
      const adminNotes = current[0].adminNotes 
        ? `${current[0].adminNotes}\n\n[${new Date().toISOString()}] CANCELLED: ${reason}`
        : `[${new Date().toISOString()}] CANCELLED: ${reason}`;
      
      await db.update(orders).set({ 
        status: "cancelled",
        adminNotes,
      }).where(eq(orders.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "cancel",
        id,
        current[0].orderNumber,
        { status: current[0].status },
        { status: "cancelled", reason },
        `Cancelled order ${current[0].orderNumber}: ${reason}`
      );
      
      return { message: "Order cancelled successfully" };
    }),

  // Process refund
  refund: adminProcedure
    .input(z.object({
      id: z.number(),
      reason: z.string().min(1),
      amountInCents: z.number().optional(), // Optional for partial refunds
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, reason, amountInCents } = input;
      
      // Get current order
      const current = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Check if order can be refunded
      if (current[0].paymentStatus !== "paid") {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: `Cannot refund order with payment status: ${current[0].paymentStatus}` 
        });
      }
      
      if (current[0].status === "refunded") {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Order has already been refunded" 
        });
      }
      
      const refundAmount = amountInCents || current[0].totalInCents;
      
      // Process Stripe refund if transaction ID exists
      if (current[0].transactionId) {
        try {
          await stripe.refunds.create({
            payment_intent: current[0].transactionId,
            amount: refundAmount,
            reason: "requested_by_customer",
          });
        } catch (error: any) {
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: `Stripe refund failed: ${error.message}` 
          });
        }
      }
      
      // Update order
      const adminNotes = current[0].adminNotes 
        ? `${current[0].adminNotes}\n\n[${new Date().toISOString()}] REFUNDED $${(refundAmount / 100).toFixed(2)}: ${reason}`
        : `[${new Date().toISOString()}] REFUNDED $${(refundAmount / 100).toFixed(2)}: ${reason}`;
      
      await db.update(orders).set({ 
        status: "refunded",
        paymentStatus: "refunded",
        adminNotes,
      }).where(eq(orders.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "refund",
        id,
        current[0].orderNumber,
        { status: current[0].status, paymentStatus: current[0].paymentStatus },
        { status: "refunded", paymentStatus: "refunded", refundAmount },
        `Refunded $${(refundAmount / 100).toFixed(2)} for order ${current[0].orderNumber}: ${reason}`
      );
      
      return { message: `Refund of $${(refundAmount / 100).toFixed(2)} processed successfully` };
    }),

  // Add admin note to order
  addNote: adminProcedure
    .input(z.object({
      id: z.number(),
      note: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, note } = input;
      
      // Get current order
      const current = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Update admin notes
      const adminNotes = current[0].adminNotes 
        ? `${current[0].adminNotes}\n\n[${new Date().toISOString()}] ${ctx.user!.name || 'Admin'}: ${note}`
        : `[${new Date().toISOString()}] ${ctx.user!.name || 'Admin'}: ${note}`;
      
      await db.update(orders).set({ adminNotes }).where(eq(orders.id, id));
      
      return { message: "Note added successfully" };
    }),

  // Get order statistics
  getStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date(todayStart);
      monthStart.setMonth(monthStart.getMonth() - 1);
      
      // Get counts by status
      const [pending] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "pending"));
      const [processing] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "processing"));
      const [shipped] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "shipped"));
      const [delivered] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "delivered"));
      const [cancelled] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "cancelled"));
      const [refunded] = await db.select({ count: count() }).from(orders).where(eq(orders.status, "refunded"));
      
      // Get today's orders
      const [todayOrders] = await db
        .select({ count: count() })
        .from(orders)
        .where(gte(orders.createdAt, todayStart));
      
      // Get today's revenue
      const [todayRevenue] = await db
        .select({ total: sql<number>`COALESCE(SUM(${orders.totalInCents}), 0)` })
        .from(orders)
        .where(and(gte(orders.createdAt, todayStart), eq(orders.paymentStatus, "paid")));
      
      return {
        byStatus: {
          pending: pending?.count || 0,
          processing: processing?.count || 0,
          shipped: shipped?.count || 0,
          delivered: delivered?.count || 0,
          cancelled: cancelled?.count || 0,
          refunded: refunded?.count || 0,
        },
        todayOrders: todayOrders?.count || 0,
        todayRevenueInCents: Number(todayRevenue?.total || 0),
      };
    }),
});
