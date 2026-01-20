import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

/**
 * Events Router - Handles analytics event tracking
 * All procedures are public to allow tracking for anonymous visitors
 */
export const eventsRouter = router({
  /**
   * Track a generic event
   */
  track: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      eventType: z.string(),
      eventCategory: z.string(),
      eventLabel: z.string().optional(),
      pagePath: z.string(),
      eventData: z.string().optional(), // JSON string
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: input.eventType,
        eventCategory: input.eventCategory,
        eventLabel: input.eventLabel,
        pagePath: input.pagePath,
        eventData: input.eventData,
      });
      return { success: true };
    }),

  /**
   * Track a page view
   */
  pageView: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      pagePath: z.string(),
      pageTitle: z.string().optional(),
      referrer: z.string().optional(),
      userAgent: z.string().optional(),
      deviceType: z.enum(["mobile", "tablet", "desktop"]),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackPageView({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        pagePath: input.pagePath,
        pageTitle: input.pageTitle,
        referrer: input.referrer,
        userAgent: input.userAgent,
        deviceType: input.deviceType,
      });
      
      // Also update conversion funnel if on homepage
      if (input.pagePath === "/" || input.pagePath === "") {
        await db.updateConversionFunnelStep(input.sessionId, "viewedHomepage");
      }
      
      return { success: true };
    }),

  /**
   * Track product view
   */
  productView: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      productId: z.number(),
      productName: z.string(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "product_view",
        eventCategory: "engagement",
        eventLabel: input.productName,
        pagePath: input.pagePath,
        eventData: JSON.stringify({ productId: input.productId }),
      });
      
      // Update conversion funnel
      await db.updateConversionFunnelStep(input.sessionId, "viewedProduct");
      
      return { success: true };
    }),

  /**
   * Track add to cart
   */
  addToCart: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      productId: z.number(),
      productName: z.string(),
      variantId: z.number().optional(),
      quantity: z.number(),
      priceInCents: z.number(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "add_to_cart",
        eventCategory: "conversion",
        eventLabel: input.productName,
        pagePath: input.pagePath,
        eventData: JSON.stringify({
          productId: input.productId,
          variantId: input.variantId,
          quantity: input.quantity,
          priceInCents: input.priceInCents,
        }),
      });
      
      // Update conversion funnel
      await db.updateConversionFunnelStep(input.sessionId, "addedToCart");
      
      return { success: true };
    }),

  /**
   * Track checkout started
   */
  checkoutStarted: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      cartTotal: z.number(),
      itemCount: z.number(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "checkout_started",
        eventCategory: "conversion",
        pagePath: input.pagePath,
        eventData: JSON.stringify({
          cartTotal: input.cartTotal,
          itemCount: input.itemCount,
        }),
      });
      
      // Update conversion funnel
      await db.updateConversionFunnelStep(input.sessionId, "startedCheckout");
      
      return { success: true };
    }),

  /**
   * Track purchase completed
   */
  purchaseCompleted: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      orderId: z.number(),
      orderTotal: z.number(),
      itemCount: z.number(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "purchase_completed",
        eventCategory: "conversion",
        pagePath: input.pagePath,
        eventData: JSON.stringify({
          orderId: input.orderId,
          orderTotal: input.orderTotal,
          itemCount: input.itemCount,
        }),
      });
      
      // Update conversion funnel with order data
      await db.updateConversionFunnelStep(input.sessionId, "completedPurchase", {
        orderId: input.orderId,
        orderValue: input.orderTotal,
      });
      
      return { success: true };
    }),

  /**
   * Track search
   */
  search: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      searchQuery: z.string(),
      resultsCount: z.number(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "search",
        eventCategory: "engagement",
        eventLabel: input.searchQuery,
        pagePath: input.pagePath,
        eventData: JSON.stringify({ resultsCount: input.resultsCount }),
      });
      
      return { success: true };
    }),

  /**
   * Track filter applied
   */
  filterApplied: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      filterType: z.string(),
      filterValue: z.string(),
      pagePath: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.trackEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: "filter_applied",
        eventCategory: "engagement",
        eventLabel: `${input.filterType}: ${input.filterValue}`,
        pagePath: input.pagePath,
        eventData: JSON.stringify({
          filterType: input.filterType,
          filterValue: input.filterValue,
        }),
      });
      
      return { success: true };
    }),

  /**
   * Get session events (for debugging/admin)
   */
  getSessionEvents: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      const { analyticsEvents } = await import("../../drizzle/schema");
      const dbInstance = await db.getDb();
      if (!dbInstance) return [];
      
      const { eq, desc } = await import("drizzle-orm");
      return dbInstance.select()
        .from(analyticsEvents)
        .where(eq(analyticsEvents.sessionId, input.sessionId))
        .orderBy(desc(analyticsEvents.createdAt))
        .limit(100);
    }),

  /**
   * Get session funnel (for debugging/admin)
   */
  getSessionFunnel: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      const { conversionFunnel } = await import("../../drizzle/schema");
      const dbInstance = await db.getDb();
      if (!dbInstance) return null;
      
      const { eq } = await import("drizzle-orm");
      const result = await dbInstance.select()
        .from(conversionFunnel)
        .where(eq(conversionFunnel.sessionId, input.sessionId))
        .limit(1);
      
      return result.length > 0 ? result[0] : null;
    }),
});
