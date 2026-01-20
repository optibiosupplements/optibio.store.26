import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { trackAnalyticsEvent, updateConversionFunnel, getSessionEvents, getSessionFunnel } from "../db";
import { eq } from "drizzle-orm";

/**
 * Event tracking router
 * Handles all user interaction events from the frontend
 */
export const eventsRouter = router({
  /**
   * Track a generic analytics event
   * Used for page views, clicks, searches, filters, etc.
   */
  track: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        eventType: z.string(), // e.g., "page_view", "add_to_cart", "checkout_started"
        eventCategory: z.string(), // e.g., "engagement", "conversion", "error"
        eventLabel: z.string().optional(),
        pagePath: z.string(),
        eventData: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: input.eventType,
          eventCategory: input.eventCategory,
          eventLabel: input.eventLabel,
          pagePath: input.pagePath,
          eventData: input.eventData,
        });

        return {
          success: true,
          message: "Event tracked successfully",
        };
      } catch (error) {
        console.error("[Events] Error tracking event:", error);
        return {
          success: false,
          message: "Error tracking event",
        };
      }
    }),

  /**
   * Track a page view event
   */
  pageView: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        pagePath: z.string(),
        pageTitle: z.string().optional(),
        deviceType: z.enum(["mobile", "tablet", "desktop"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "page_view",
          eventCategory: "engagement",
          eventLabel: input.pageTitle,
          pagePath: input.pagePath,
          eventData: {
            deviceType: input.deviceType,
          },
        });

        // Update funnel if on homepage
        if (input.pagePath === "/" || input.pagePath.includes("home")) {
          await updateConversionFunnel({
            sessionId: input.sessionId,
            userId: input.userId,
            step: "homepage",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking page view:", error);
        return { success: false };
      }
    }),

  /**
   * Track product view event
   */
  productView: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        productId: z.number(),
        productName: z.string(),
        productPrice: z.number(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "product_viewed",
          eventCategory: "engagement",
          eventLabel: input.productName,
          pagePath: input.pagePath,
          eventData: {
            productId: input.productId,
            productName: input.productName,
            productPrice: input.productPrice,
          },
        });

        // Update funnel
        await updateConversionFunnel({
          sessionId: input.sessionId,
          userId: input.userId,
          step: "product",
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking product view:", error);
        return { success: false };
      }
    }),

  /**
   * Track add-to-cart event
   */
  addToCart: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        productId: z.number(),
        variantId: z.number(),
        quantity: z.number(),
        price: z.number(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "add_to_cart",
          eventCategory: "conversion",
          pagePath: input.pagePath,
          eventData: {
            productId: input.productId,
            variantId: input.variantId,
            quantity: input.quantity,
            price: input.price,
          },
        });

        // Update funnel
        await updateConversionFunnel({
          sessionId: input.sessionId,
          userId: input.userId,
          step: "cart",
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking add to cart:", error);
        return { success: false };
      }
    }),

  /**
   * Track checkout started event
   */
  checkoutStarted: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        cartTotal: z.number(),
        itemCount: z.number(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "checkout_started",
          eventCategory: "conversion",
          pagePath: input.pagePath,
          eventData: {
            cartTotal: input.cartTotal,
            itemCount: input.itemCount,
          },
        });

        // Update funnel
        await updateConversionFunnel({
          sessionId: input.sessionId,
          userId: input.userId,
          step: "checkout",
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking checkout started:", error);
        return { success: false };
      }
    }),

  /**
   * Track purchase completed event
   */
  purchaseCompleted: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        orderId: z.number(),
        orderTotal: z.number(),
        itemCount: z.number(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "purchase_completed",
          eventCategory: "conversion",
          pagePath: input.pagePath,
          eventData: {
            orderId: input.orderId,
            orderTotal: input.orderTotal,
            itemCount: input.itemCount,
          },
        });

        // Update funnel
        await updateConversionFunnel({
          sessionId: input.sessionId,
          userId: input.userId,
          step: "purchase",
          orderId: input.orderId,
          orderValue: input.orderTotal,
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking purchase completed:", error);
        return { success: false };
      }
    }),

  /**
   * Track search event
   */
  search: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        searchQuery: z.string(),
        resultsCount: z.number(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "search",
          eventCategory: "engagement",
          pagePath: input.pagePath,
          eventData: {
            searchQuery: input.searchQuery,
            resultsCount: input.resultsCount,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking search:", error);
        return { success: false };
      }
    }),

  /**
   * Track filter applied event
   */
  filterApplied: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.number().optional(),
        filterType: z.string(),
        filterValue: z.string(),
        pagePath: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          userId: input.userId,
          eventType: "filter_applied",
          eventCategory: "engagement",
          pagePath: input.pagePath,
          eventData: {
            filterType: input.filterType,
            filterValue: input.filterValue,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("[Events] Error tracking filter applied:", error);
        return { success: false };
      }
    }),

  /**
   * Get all events for a session
   */
  getSessionEvents: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const events = await getSessionEvents(input.sessionId);
        return {
          success: true,
          events,
        };
      } catch (error) {
        console.error("[Events] Error getting session events:", error);
        return {
          success: false,
          events: [],
        };
      }
    }),

  /**
   * Get conversion funnel for a session
   */
  getSessionFunnel: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const funnel = await getSessionFunnel(input.sessionId);
        return {
          success: true,
          funnel,
        };
      } catch (error) {
        console.error("[Events] Error getting session funnel:", error);
        return {
          success: false,
          funnel: null,
        };
      }
    }),
});
