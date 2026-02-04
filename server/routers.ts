import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import * as presaleDb from "./presale-db";
import * as analyticsDb from "./analytics-db";
import { stripe } from "./stripe";
import { ENV } from "./_core/env";
import { sendReservationConfirmationEmail } from "./email";
import { getReservationConfirmationEmail } from "./email-templates";
import { reviewsRouter } from "./routers/reviews";
import { newsletterRouter } from "./routers/newsletter";
import { referralRouter } from "./routers/referral";
import { subscriptionsRouter } from "./routers/subscriptions";
import { abandonedCartRouter } from "./routers/abandoned-cart";
import { postPurchaseRouter } from "./routers/post-purchase";
import { analyticsRouter } from "./routers/analytics";
import { eventsRouter } from "./routers/events";
import { shippingRouter } from "./routers/shipping";
import { adminProductsRouter } from "./routers/admin-products";
import { adminCustomersRouter } from "./routers/admin-customers";
import { adminContentRouter } from "./routers/admin-content";
import { adminAuditRouter } from "./routers/admin-audit";

export const appRouter = router({
  system: systemRouter,
  abandonedCart: abandonedCartRouter,
  postPurchase: postPurchaseRouter,
  revenueAnalytics: analyticsRouter,
  events: eventsRouter,
  shipping: shippingRouter,
  adminProducts: adminProductsRouter,
  adminCustomers: adminCustomersRouter,
  adminContent: adminContentRouter,
  adminAudit: adminAuditRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product routes
  products: router({
    list: publicProcedure.query(async () => {
      return db.getAllProducts();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (!product) return null;
        
        const variants = await db.getProductVariants(product.id);
        const subscriptionPlans = await db.getSubscriptionPlans();
        
        return {
          ...product,
          variants,
          subscriptionPlans,
        };
      }),
  }),

  // Cart routes
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getCartItems(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        productId: z.number(),
        variantId: z.number().optional(),
        quantity: z.number().min(1),
        isSubscription: z.boolean().optional(),
        subscriptionPlanId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToCart({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        await db.updateCartItem(input.id, input.quantity);
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeCartItem(input.id);
        return { success: true };
      }),
    
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // Order routes
  orders: router({
    create: protectedProcedure
      .input(z.object({
        shippingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          address1: z.string(),
          address2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          country: z.string(),
          phone: z.string().optional(),
        }),
        billingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          address1: z.string(),
          address2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          country: z.string(),
        }),
        items: z.array(z.object({
          productId: z.number(),
          variantId: z.number().optional(),
          productName: z.string(),
          variantName: z.string().optional(),
          sku: z.string().optional(),
          quantity: z.number(),
          priceInCents: z.number(),
        })),
        subtotalInCents: z.number(),
        shippingInCents: z.number(),
        taxInCents: z.number(),
        discountInCents: z.number(),
        totalInCents: z.number(),
        discountCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Generate unique order number
        const orderNumber = `OPT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        // Create order
        const orderResult = await db.createOrder({
          orderNumber,
          userId: ctx.user.id,
          email: ctx.user.email || '',
          subtotalInCents: input.subtotalInCents,
          shippingInCents: input.shippingInCents,
          taxInCents: input.taxInCents,
          discountInCents: input.discountInCents,
          totalInCents: input.totalInCents,
          shippingFirstName: input.shippingAddress.firstName,
          shippingLastName: input.shippingAddress.lastName,
          shippingAddress1: input.shippingAddress.address1,
          shippingAddress2: input.shippingAddress.address2 || null,
          shippingCity: input.shippingAddress.city,
          shippingState: input.shippingAddress.state,
          shippingZipCode: input.shippingAddress.zipCode,
          shippingCountry: input.shippingAddress.country,
          shippingPhone: input.shippingAddress.phone || null,
          billingFirstName: input.billingAddress.firstName,
          billingLastName: input.billingAddress.lastName,
          billingAddress1: input.billingAddress.address1,
          billingAddress2: input.billingAddress.address2 || null,
          billingCity: input.billingAddress.city,
          billingState: input.billingAddress.state,
          billingZipCode: input.billingAddress.zipCode,
          billingCountry: input.billingAddress.country,
        });
        
        const orderId = (orderResult as any).insertId;
        
        // Create order items
        const orderItemsData = input.items.map(item => ({
          orderId,
          productId: item.productId,
          variantId: item.variantId || null,
          productName: item.productName,
          variantName: item.variantName || null,
          sku: item.sku || null,
          quantity: item.quantity,
          priceInCents: item.priceInCents,
          totalInCents: item.priceInCents * item.quantity,
        }));
        
        await db.createOrderItems(orderItemsData);
        
        // Update discount code usage if applicable
        if (input.discountCode) {
          const code = await db.getDiscountCode(input.discountCode);
          if (code) {
            await db.incrementDiscountCodeUsage(code.id);
          }
        }
        
        // Clear cart
        await db.clearCart(ctx.user.id);
        
        return {
          success: true,
          orderNumber,
          orderId,
        };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrdersByUser(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) return null;
        
        const items = await db.getOrderItems(input.id);
        
        return {
          ...order,
          items,
        };
      }),
  }),

  // Stripe checkout
  stripe: router({
    createSubscription: protectedProcedure
      .input(z.object({
        productId: z.number(),
        variantId: z.number().optional(),
        planId: z.number(),
        priceInCents: z.number(),
        founderTier: z.enum(["founders", "early_adopter", "pre_launch", "regular"]),
        lifetimeDiscountPercent: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create or retrieve Stripe customer
        const customers = await stripe.customers.list({
          email: ctx.user.email || undefined,
          limit: 1,
        });

        let customerId: string;
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              userId: ctx.user.id.toString(),
              founderTier: input.founderTier,
              lifetimeDiscountPercent: input.lifetimeDiscountPercent.toString(),
            },
          });
          customerId = customer.id;
        }

        // Create Stripe price for this subscription
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: input.priceInCents,
          recurring: {
            interval: "month",
            interval_count: 1,
          },
          product_data: {
            name: `OptiBio Ashwagandha KSM-66 Subscription (${input.founderTier})`,
          },
        });

        // Create Stripe subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: price.id }],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
          metadata: {
            userId: ctx.user.id.toString(),
            productId: input.productId.toString(),
            variantId: input.variantId?.toString() || "",
            planId: input.planId.toString(),
            founderTier: input.founderTier,
            lifetimeDiscountPercent: input.lifetimeDiscountPercent.toString(),
          },
        });

        // Update user's founder tier and lifetime discount
        await db.updateUserFounderTier(ctx.user.id, input.founderTier, input.lifetimeDiscountPercent);

        // Store subscription in database
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        await db.createSubscription({
          userId: ctx.user.id,
          planId: input.planId,
          productId: input.productId,
          variantId: input.variantId,
          priceInCents: input.priceInCents,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: customerId,
          stripePriceId: price.id,
          nextBillingDate,
        });

        const invoice = subscription.latest_invoice as any;
        const paymentIntent = invoice?.payment_intent as any;

        return {
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret,
        };
      }),

    createCheckoutSession: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          variantId: z.number().optional(),
          variantName: z.string().optional(),
          quantity: z.number(),
          priceInCents: z.number(),
        })),
        creditsToApply: z.number().optional().default(0),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const successUrl = input.successUrl || `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = input.cancelUrl || `${origin}/cart`;

        // Create line items for Stripe
        const lineItems = input.items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName,
              description: item.variantName || undefined,
              images: [`${origin}/products/optibio-90cap-bottle-front.jpg`],
            },
            unit_amount: item.priceInCents,
          },
          quantity: item.quantity,
        }));

        // Add referral credits as discount if provided
        const discounts = [];
        if (input.creditsToApply && input.creditsToApply > 0) {
          // Create a one-time coupon for the credit amount
          const coupon = await stripe.coupons.create({
            amount_off: input.creditsToApply,
            currency: "usd",
            duration: "once",
            name: "Referral Credits",
          });
          discounts.push({ coupon: coupon.id });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: lineItems,
          ...(discounts.length > 0 && { discounts }),
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            credits_applied: input.creditsToApply?.toString() || "0",
          },
          allow_promotion_codes: true,
          shipping_address_collection: {
            allowed_countries: ["US"],
          },
          phone_number_collection: {
            enabled: true,
          },
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      }),
  }),

  // Discount code validation
  discounts: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const code = await db.getDiscountCode(input.code);
        
        if (!code) {
          return { valid: false, message: "Invalid discount code" };
        }
        
        // Check if expired
        if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
          return { valid: false, message: "This discount code has expired" };
        }
        
        // Check if max uses reached
        if (code.maxUsesTotal && (code.usedCount ?? 0) >= code.maxUsesTotal) {
          return { valid: false, message: "This discount code has reached its usage limit" };
        }
        
        return {
          valid: true,
          code: {
            id: code.id,
            code: code.code,
            discountType: code.discountType,
            discountValue: code.discountValue,
            minPurchaseInCents: code.minPurchaseInCents,
          },
        };
      }),
  }),

  // Pre-sale system
  presale: router({ 
    joinWaitlist: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await presaleDb.addToWaitlist(input);
        return { success: true };
      }),
    
    getWaitlistCount: publicProcedure.query(async () => {
      return presaleDb.getWaitlistCount();
    }),
    
    getCampaign: publicProcedure.query(async () => {
      const campaign = await presaleDb.getCampaign();
      if (!campaign) {
        await presaleDb.initializeCampaign();
        return presaleDb.getCampaign();
      }
      return campaign;
    }),
    
    getReservationCount: publicProcedure.query(async () => {
      return presaleDb.getReservationCount();
    }),
    
    createReservation: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        tier: z.enum(["founders", "early_adopter", "pre_launch"]),
        price: z.string(),
        referredBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const reservation = await presaleDb.createReservation(input);
        
        // Track referral if applicable
        if (input.referredBy) {
          await presaleDb.trackReferral(input.referredBy, reservation.insertId);
        }
        
        // Send confirmation email
        try {
          const emailData = getReservationConfirmationEmail({
            name: input.name,
            email: input.email,
            tier: input.tier,
            position: reservation.insertId || 0,
            price: input.price,
          });
          
          await sendReservationConfirmationEmail(
            input.email,
            emailData.subject,
            emailData.html,
            emailData.text
          );
        } catch (emailError) {
          console.error("[Reservation] Failed to send confirmation email:", emailError);
          // Don't fail the reservation if email fails
        }
        
        return { success: true, reservation };
      }),
    
    getStats: publicProcedure.query(async () => {
      return presaleDb.getReservationStats();
    }),
  }),

  // Batch verification
  batches: router({
    verify: publicProcedure
      .input(z.object({ lotNumber: z.string().min(1) }))
      .query(async ({ input }) => {
        const batch = await db.getBatchByLotNumber(input.lotNumber);
        
        if (!batch) {
          return { found: false, message: "Batch not found. Please check your lot number and try again." };
        }
        
        return {
          found: true,
          batch: {
            lotNumber: batch.lotNumber,
            manufactureDate: batch.manufactureDate,
            expiryDate: batch.expiryDate,
            coaUrl: batch.coaUrl,
            heavyMetalsTestUrl: batch.heavyMetalsTestUrl,
            microbialTestUrl: batch.microbialTestUrl,
            potencyTestUrl: batch.potencyTestUrl,
            testResults: batch.testResults ? JSON.parse(batch.testResults) : null,
          },
        };
      }),
  }),

  // Analytics (Admin only)
  analytics: router({
    getOverview: adminProcedure.query(async () => {
      const [mrr, activeSubscriptions, churnRate, totalRevenue] = await Promise.all([
        analyticsDb.getMRR(),
        analyticsDb.getActiveSubscriptionsCount(),
        analyticsDb.getChurnRate(),
        analyticsDb.getTotalRevenue(),
      ]);

      return {
        mrr,
        activeSubscriptions,
        churnRate,
        totalRevenue,
      };
    }),

    getMetricsByTier: adminProcedure.query(async () => {
      return analyticsDb.getMetricsByTier();
    }),

    getConversionMetrics: adminProcedure.query(async () => {
      return analyticsDb.getConversionMetrics();
    }),

    getRevenueBreakdown: adminProcedure.query(async () => {
      return analyticsDb.getRevenueBreakdown();
    }),
  }),

  // Reviews
  reviews: reviewsRouter,

  // Newsletter
  newsletter: newsletterRouter,

  // Referral Program
  referral: referralRouter,

  // Subscriptions
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;
