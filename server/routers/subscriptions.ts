import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { subscriptions, subscriptionPlans, products, productVariants } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { stripe } from "../stripe";

export const subscriptionsRouter = router({
  /**
   * Get all subscriptions for current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const userSubscriptions = await db
      .select({
        subscription: subscriptions,
        plan: subscriptionPlans,
        product: products,
        variant: productVariants,
      })
      .from(subscriptions)
      .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.id))
      .leftJoin(products, eq(subscriptions.productId, products.id))
      .leftJoin(productVariants, eq(subscriptions.variantId, productVariants.id))
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt));

    return userSubscriptions;
  }),

  /**
   * Get subscription details by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const result = await db
        .select({
          subscription: subscriptions,
          plan: subscriptionPlans,
          product: products,
          variant: productVariants,
        })
        .from(subscriptions)
        .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.id))
        .leftJoin(products, eq(subscriptions.productId, products.id))
        .leftJoin(productVariants, eq(subscriptions.variantId, productVariants.id))
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      return result[0];
    }),

  /**
   * Pause subscription
   */
  pause: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (sub[0].status !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only active subscriptions can be paused",
        });
      }

      // Pause in Stripe
      if (sub[0].stripeSubscriptionId) {
        await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
          pause_collection: {
            behavior: "keep_as_draft",
          },
        });
      }

      // Update database
      await db
        .update(subscriptions)
        .set({
          status: "paused",
          pausedAt: new Date(),
        })
        .where(eq(subscriptions.id, input.id));

      return { success: true };
    }),

  /**
   * Resume subscription
   */
  resume: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (sub[0].status !== "paused") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only paused subscriptions can be resumed",
        });
      }

      // Resume in Stripe
      if (sub[0].stripeSubscriptionId) {
        await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
          pause_collection: null as any,
        });
      }

      // Update database
      await db
        .update(subscriptions)
        .set({
          status: "active",
          pausedAt: null,
        })
        .where(eq(subscriptions.id, input.id));

      return { success: true };
    }),

  /**
   * Cancel subscription
   */
  cancel: protectedProcedure
    .input(z.object({ 
      id: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (sub[0].status === "cancelled") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is already cancelled",
        });
      }

      // Cancel in Stripe (at period end to allow current period to complete)
      if (sub[0].stripeSubscriptionId) {
        await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
          cancel_at_period_end: true,
          cancellation_details: {
            comment: input.reason || "Customer requested cancellation",
          },
        });
      }

      // Update database
      await db
        .update(subscriptions)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
        })
        .where(eq(subscriptions.id, input.id));

      return { success: true };
    }),

  /**
   * Update payment method
   */
  updatePaymentMethod: protectedProcedure
    .input(z.object({
      subscriptionId: z.number(),
      paymentMethodId: z.string(), // Stripe payment method ID
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.subscriptionId),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (!sub[0].stripeSubscriptionId || !sub[0].stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is not linked to Stripe",
        });
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(input.paymentMethodId, {
        customer: sub[0].stripeCustomerId,
      });

      // Set as default payment method for customer
      await stripe.customers.update(sub[0].stripeCustomerId, {
        invoice_settings: {
          default_payment_method: input.paymentMethodId,
        },
      });

      // Update subscription to use new payment method
      await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
        default_payment_method: input.paymentMethodId,
      });

      return { success: true };
    }),

  /**
   * Get payment method setup intent for updating payment
   */
  createSetupIntent: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.subscriptionId),
            eq(subscriptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (!sub[0].stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is not linked to Stripe customer",
        });
      }

      // Create setup intent
      const setupIntent = await stripe.setupIntents.create({
        customer: sub[0].stripeCustomerId,
        payment_method_types: ["card"],
      });

      return {
        clientSecret: setupIntent.client_secret,
      };
    }),

  /**
   * Skip next delivery (extends billing cycle by one period)
   */
  skipNextDelivery: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get subscription by Stripe ID
      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, input.subscriptionId))
        .limit(1);

      if (sub.length === 0 || sub[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      // Get the Stripe subscription
      const response = await stripe.subscriptions.retrieve(input.subscriptionId);
      const stripeSubscription = response as any; // Type assertion for Stripe SDK
      
      // Calculate new billing date (skip one cycle = add 1 month to current period end)
      const currentPeriodEnd = stripeSubscription.current_period_end;
      const skipToTimestamp = currentPeriodEnd + (30 * 24 * 60 * 60); // Add ~30 days
      
      // Use trial_end to skip the next billing cycle
      await stripe.subscriptions.update(input.subscriptionId, {
        trial_end: skipToTimestamp,
        proration_behavior: "none",
      });

      const newBillingDate = new Date(skipToTimestamp * 1000);

      // Update database with new billing date
      await db
        .update(subscriptions)
        .set({
          nextBillingDate: newBillingDate,
        })
        .where(eq(subscriptions.stripeSubscriptionId, input.subscriptionId));

      return { success: true, newBillingDate };
    }),

  /**
   * Create Stripe billing portal session for payment method updates
   */
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    // Get user's subscriptions to find their Stripe customer ID
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (userSubs.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No subscriptions found" });
    }

    const customerId = userSubs[0].stripeCustomerId;
    if (!customerId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No Stripe customer found" });
    }

    const origin = ctx.req.headers.origin || "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account/subscriptions`,
    });

    return { url: session.url };
  }),
});
