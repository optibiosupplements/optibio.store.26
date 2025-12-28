import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { abandonedCarts, postPurchaseEmails, orders } from "../../drizzle/schema";
import { sql, and, gte, lte, eq, isNotNull } from "drizzle-orm";

export const analyticsRouter = router({
  /**
   * Get abandoned cart recovery metrics
   * Shows cart abandonment rate, recovery rate, and revenue recovered
   */
  getAbandonedCartMetrics: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalAbandoned: 0,
          totalRecovered: 0,
          recoveryRate: 0,
          revenueRecovered: 0,
          email1Sent: 0,
          email2Sent: 0,
          email3Sent: 0,
        };
      }

      try {
        // Build date filter
        const conditions = [];
        if (input.startDate) {
          conditions.push(gte(abandonedCarts.createdAt, new Date(input.startDate)));
        }
        if (input.endDate) {
          conditions.push(lte(abandonedCarts.createdAt, new Date(input.endDate)));
        }

        // Get total abandoned carts
        const [totalResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(abandonedCarts)
          .where(conditions.length > 0 ? and(...conditions) : undefined);

        const totalAbandoned = Number(totalResult?.count || 0);

        // Get recovered carts
        const recoveredConditions = [...conditions, eq(abandonedCarts.isRecovered, true)];
        const [recoveredResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(abandonedCarts)
          .where(and(...recoveredConditions));

        const totalRecovered = Number(recoveredResult?.count || 0);

        // Get revenue recovered (sum of cart values for recovered carts)
        const [revenueResult] = await db
          .select({ 
            total: sql<number>`SUM(CAST(JSON_EXTRACT(${abandonedCarts.cartData}, '$.total') AS DECIMAL(10,2)))` 
          })
          .from(abandonedCarts)
          .where(and(...recoveredConditions));

        const revenueRecovered = Number(revenueResult?.total || 0);

        // Get email sent counts
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

        return {
          totalAbandoned,
          totalRecovered,
          recoveryRate: totalAbandoned > 0 ? (totalRecovered / totalAbandoned) * 100 : 0,
          revenueRecovered,
          email1Sent: Number(email1Result?.count || 0),
          email2Sent: Number(email2Result?.count || 0),
          email3Sent: Number(email3Result?.count || 0),
        };
      } catch (error) {
        console.error("[Analytics] Error getting abandoned cart metrics:", error);
        throw error;
      }
    }),

  /**
   * Get post-purchase email performance metrics
   * Shows email sent counts, engagement rates, and conversion metrics
   */
  getPostPurchaseMetrics: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalTracked: 0,
          day7Sent: 0,
          day21Sent: 0,
          day60Sent: 0,
          day90Sent: 0,
          reorderCount: 0,
          reorderRate: 0,
          subscriptionCount: 0,
          subscriptionRate: 0,
          reviewCount: 0,
          reviewRate: 0,
        };
      }

      try {
        // Build date filter
        const conditions = [];
        if (input.startDate) {
          conditions.push(gte(postPurchaseEmails.purchaseDate, new Date(input.startDate)));
        }
        if (input.endDate) {
          conditions.push(lte(postPurchaseEmails.purchaseDate, new Date(input.endDate)));
        }

        // Get total tracked purchases
        const [totalResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(postPurchaseEmails)
          .where(conditions.length > 0 ? and(...conditions) : undefined);

        const totalTracked = Number(totalResult?.count || 0);

        // Get email sent counts
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

        // Get engagement metrics
        const reorderConditions = [...conditions, eq(postPurchaseEmails.hasReordered, true)];
        const [reorderResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(postPurchaseEmails)
          .where(and(...reorderConditions));

        const subscriptionConditions = [...conditions, eq(postPurchaseEmails.hasSubscribed, true)];
        const [subscriptionResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(postPurchaseEmails)
          .where(and(...subscriptionConditions));

        const reviewConditions = [...conditions, eq(postPurchaseEmails.hasReviewed, true)];
        const [reviewResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(postPurchaseEmails)
          .where(and(...reviewConditions));

        const reorderCount = Number(reorderResult?.count || 0);
        const subscriptionCount = Number(subscriptionResult?.count || 0);
        const reviewCount = Number(reviewResult?.count || 0);

        return {
          totalTracked,
          day7Sent: Number(day7Result?.count || 0),
          day21Sent: Number(day21Result?.count || 0),
          day60Sent: Number(day60Result?.count || 0),
          day90Sent: Number(day90Result?.count || 0),
          reorderCount,
          reorderRate: totalTracked > 0 ? (reorderCount / totalTracked) * 100 : 0,
          subscriptionCount,
          subscriptionRate: totalTracked > 0 ? (subscriptionCount / totalTracked) * 100 : 0,
          reviewCount,
          reviewRate: totalTracked > 0 ? (reviewCount / totalTracked) * 100 : 0,
        };
      } catch (error) {
        console.error("[Analytics] Error getting post-purchase metrics:", error);
        throw error;
      }
    }),

  /**
   * Get revenue impact summary
   * Shows estimated revenue impact from all optimization efforts
   */
  getRevenueImpact: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          cartRecoveryRevenue: 0,
          reorderRevenue: 0,
          subscriptionRevenue: 0,
          totalRevenue: 0,
        };
      }

      try {
        // Build date filter
        const conditions = [];
        if (input.startDate) {
          conditions.push(gte(abandonedCarts.createdAt, new Date(input.startDate)));
        }
        if (input.endDate) {
          conditions.push(lte(abandonedCarts.createdAt, new Date(input.endDate)));
        }

        // Get cart recovery revenue
        const recoveredConditions = [...conditions, eq(abandonedCarts.isRecovered, true)];
        const [cartRevenueResult] = await db
          .select({
            total: sql<number>`SUM(CAST(JSON_EXTRACT(${abandonedCarts.cartData}, '$.total') AS DECIMAL(10,2)))`,
          })
          .from(abandonedCarts)
          .where(and(...recoveredConditions));

        const cartRecoveryRevenue = Number(cartRevenueResult?.total || 0);

        // Get reorder revenue (from post-purchase funnel)
        const reorderConditions = [];
        if (input.startDate) {
          reorderConditions.push(gte(postPurchaseEmails.reorderDate, new Date(input.startDate)));
        }
        if (input.endDate) {
          reorderConditions.push(lte(postPurchaseEmails.reorderDate, new Date(input.endDate)));
        }
        reorderConditions.push(eq(postPurchaseEmails.hasReordered, true));
        reorderConditions.push(isNotNull(postPurchaseEmails.reorderOrderId));

        const [reorderRevenueResult] = await db
          .select({
            total: sql<number>`SUM(${orders.totalInCents})`,
          })
          .from(postPurchaseEmails)
          .leftJoin(orders, eq(postPurchaseEmails.reorderOrderId, orders.id))
          .where(and(...reorderConditions));

        const reorderRevenue = Number(reorderRevenueResult?.total || 0) / 100; // Convert cents to dollars

        // Get subscription revenue (estimated based on subscription conversions)
        // Assume average subscription value of $39.99/month for 12 months = $479.88
        const subscriptionConditions = [];
        if (input.startDate) {
          subscriptionConditions.push(gte(postPurchaseEmails.subscribedAt, new Date(input.startDate)));
        }
        if (input.endDate) {
          subscriptionConditions.push(lte(postPurchaseEmails.subscribedAt, new Date(input.endDate)));
        }
        subscriptionConditions.push(eq(postPurchaseEmails.hasSubscribed, true));

        const [subscriptionResult] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(postPurchaseEmails)
          .where(and(...subscriptionConditions));

        const subscriptionCount = Number(subscriptionResult?.count || 0);
        const subscriptionRevenue = subscriptionCount * 479.88; // Annual subscription value

        return {
          cartRecoveryRevenue,
          reorderRevenue,
          subscriptionRevenue,
          totalRevenue: cartRecoveryRevenue + reorderRevenue + subscriptionRevenue,
        };
      } catch (error) {
        console.error("[Analytics] Error getting revenue impact:", error);
        throw error;
      }
    }),


});
