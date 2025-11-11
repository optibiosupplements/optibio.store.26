import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { stripe } from "./stripe";
import { ENV } from "./_core/env";

export const appRouter = router({
  system: systemRouter,
  
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

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: lineItems,
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
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
});

export type AppRouter = typeof appRouter;
