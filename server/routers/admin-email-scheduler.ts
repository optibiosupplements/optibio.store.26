/**
 * Admin Email Scheduler Router
 * 
 * Provides admin endpoints to:
 * - View scheduler status and statistics
 * - Manually trigger email sequences
 * - View email logs and history
 */

import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { abandonedCarts, postPurchaseEmails } from "../../drizzle/schema";
import { sql, and, gte, lte, isNotNull, desc, eq } from "drizzle-orm";
import {
  getSchedulerStatus,
  triggerAbandonedCartEmails,
  triggerPostPurchaseEmails,
} from "../email-scheduler";

export const adminEmailSchedulerRouter = router({
  /**
   * Get scheduler status and statistics
   */
  getStatus: adminProcedure.query(async () => {
    const status = getSchedulerStatus();
    return status;
  }),

  /**
   * Get abandoned cart email statistics
   */
  getAbandonedCartStats: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalCarts: 0,
          recoveredCarts: 0,
          email1Sent: 0,
          email2Sent: 0,
          email3Sent: 0,
          recoveryRate: 0,
          pendingEmail1: 0,
          pendingEmail2: 0,
          pendingEmail3: 0,
        };
      }

      const conditions = [];
      if (input?.startDate) {
        conditions.push(gte(abandonedCarts.createdAt, new Date(input.startDate)));
      }
      if (input?.endDate) {
        conditions.push(lte(abandonedCarts.createdAt, new Date(input.endDate)));
      }

      // Total abandoned carts
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Recovered carts
      const [recoveredResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          conditions.length > 0
            ? and(...conditions, eq(abandonedCarts.isRecovered, true))
            : eq(abandonedCarts.isRecovered, true)
        );

      // Emails sent
      const [email1Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(abandonedCarts.firstEmailSentAt))
            : isNotNull(abandonedCarts.firstEmailSentAt)
        );

      const [email2Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(abandonedCarts.secondEmailSentAt))
            : isNotNull(abandonedCarts.secondEmailSentAt)
        );

      const [email3Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(abandonedCarts.thirdEmailSentAt))
            : isNotNull(abandonedCarts.thirdEmailSentAt)
        );

      // Pending emails (need to be sent)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

      const [pending1] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          and(
            eq(abandonedCarts.isRecovered, false),
            lte(abandonedCarts.createdAt, oneHourAgo),
            sql`${abandonedCarts.firstEmailSentAt} IS NULL`
          )
        );

      const [pending2] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          and(
            eq(abandonedCarts.isRecovered, false),
            lte(abandonedCarts.createdAt, twentyFourHoursAgo),
            isNotNull(abandonedCarts.firstEmailSentAt),
            sql`${abandonedCarts.secondEmailSentAt} IS NULL`
          )
        );

      const [pending3] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(abandonedCarts)
        .where(
          and(
            eq(abandonedCarts.isRecovered, false),
            lte(abandonedCarts.createdAt, fortyEightHoursAgo),
            isNotNull(abandonedCarts.secondEmailSentAt),
            sql`${abandonedCarts.thirdEmailSentAt} IS NULL`
          )
        );

      const totalCarts = Number(totalResult?.count || 0);
      const recoveredCarts = Number(recoveredResult?.count || 0);

      return {
        totalCarts,
        recoveredCarts,
        email1Sent: Number(email1Result?.count || 0),
        email2Sent: Number(email2Result?.count || 0),
        email3Sent: Number(email3Result?.count || 0),
        recoveryRate: totalCarts > 0 ? (recoveredCarts / totalCarts) * 100 : 0,
        pendingEmail1: Number(pending1?.count || 0),
        pendingEmail2: Number(pending2?.count || 0),
        pendingEmail3: Number(pending3?.count || 0),
      };
    }),

  /**
   * Get post-purchase email statistics
   */
  getPostPurchaseStats: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalOrders: 0,
          day7Sent: 0,
          day21Sent: 0,
          day60Sent: 0,
          day90Sent: 0,
          reorders: 0,
          subscriptions: 0,
          reviews: 0,
          reorderRate: 0,
          subscriptionRate: 0,
          reviewRate: 0,
        };
      }

      const conditions = [];
      if (input?.startDate) {
        conditions.push(gte(postPurchaseEmails.purchaseDate, new Date(input.startDate)));
      }
      if (input?.endDate) {
        conditions.push(lte(postPurchaseEmails.purchaseDate, new Date(input.endDate)));
      }

      // Total orders tracked
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Emails sent
      const [day7Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(postPurchaseEmails.day7EmailSentAt))
            : isNotNull(postPurchaseEmails.day7EmailSentAt)
        );

      const [day21Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(postPurchaseEmails.day21EmailSentAt))
            : isNotNull(postPurchaseEmails.day21EmailSentAt)
        );

      const [day60Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(postPurchaseEmails.day60EmailSentAt))
            : isNotNull(postPurchaseEmails.day60EmailSentAt)
        );

      const [day90Result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, isNotNull(postPurchaseEmails.day90EmailSentAt))
            : isNotNull(postPurchaseEmails.day90EmailSentAt)
        );

      // Engagement metrics
      const [reorderResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, eq(postPurchaseEmails.hasReordered, true))
            : eq(postPurchaseEmails.hasReordered, true)
        );

      const [subscriptionResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, eq(postPurchaseEmails.hasSubscribed, true))
            : eq(postPurchaseEmails.hasSubscribed, true)
        );

      const [reviewResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postPurchaseEmails)
        .where(
          conditions.length > 0
            ? and(...conditions, eq(postPurchaseEmails.hasReviewed, true))
            : eq(postPurchaseEmails.hasReviewed, true)
        );

      const totalOrders = Number(totalResult?.count || 0);
      const reorders = Number(reorderResult?.count || 0);
      const subscriptions = Number(subscriptionResult?.count || 0);
      const reviews = Number(reviewResult?.count || 0);

      return {
        totalOrders,
        day7Sent: Number(day7Result?.count || 0),
        day21Sent: Number(day21Result?.count || 0),
        day60Sent: Number(day60Result?.count || 0),
        day90Sent: Number(day90Result?.count || 0),
        reorders,
        subscriptions,
        reviews,
        reorderRate: totalOrders > 0 ? (reorders / totalOrders) * 100 : 0,
        subscriptionRate: totalOrders > 0 ? (subscriptions / totalOrders) * 100 : 0,
        reviewRate: totalOrders > 0 ? (reviews / totalOrders) * 100 : 0,
      };
    }),

  /**
   * Get recent abandoned carts
   */
  getRecentAbandonedCarts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const limit = input?.limit || 20;

      const carts = await db
        .select({
          id: abandonedCarts.id,
          email: abandonedCarts.email,
          totalValue: abandonedCarts.totalValue,
          isRecovered: abandonedCarts.isRecovered,
          createdAt: abandonedCarts.createdAt,
          firstEmailSentAt: abandonedCarts.firstEmailSentAt,
          secondEmailSentAt: abandonedCarts.secondEmailSentAt,
          thirdEmailSentAt: abandonedCarts.thirdEmailSentAt,
        })
        .from(abandonedCarts)
        .orderBy(desc(abandonedCarts.createdAt))
        .limit(limit);

      return carts.map((cart) => ({
        ...cart,
        totalValueFormatted: `$${(cart.totalValue / 100).toFixed(2)}`,
        emailsSent: [
          cart.firstEmailSentAt ? 1 : null,
          cart.secondEmailSentAt ? 2 : null,
          cart.thirdEmailSentAt ? 3 : null,
        ].filter(Boolean),
      }));
    }),

  /**
   * Manually trigger abandoned cart emails
   */
  triggerAbandonedCartEmails: adminProcedure
    .input(
      z.object({
        emailNumber: z.enum(["1", "2", "3", "all"]),
      })
    )
    .mutation(async ({ input }) => {
      const emailNum = input.emailNumber === "all" 
        ? undefined 
        : (parseInt(input.emailNumber) as 1 | 2 | 3);
      
      const result = await triggerAbandonedCartEmails(emailNum);
      
      return {
        success: true,
        ...result,
        message: `Processed ${result.sent} emails (${result.failed} failed)`,
      };
    }),

  /**
   * Manually trigger post-purchase emails
   */
  triggerPostPurchaseEmails: adminProcedure
    .input(
      z.object({
        dayNumber: z.enum(["7", "21", "60", "90", "all"]),
      })
    )
    .mutation(async ({ input }) => {
      const dayNum = input.dayNumber === "all" 
        ? undefined 
        : (parseInt(input.dayNumber) as 7 | 21 | 60 | 90);
      
      const result = await triggerPostPurchaseEmails(dayNum);
      
      return {
        success: true,
        ...result,
        message: `Processed ${result.sent} emails (${result.failed} failed)`,
      };
    }),
});
