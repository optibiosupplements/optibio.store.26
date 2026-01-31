import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { 
  createAbandonedCart,
  generateRecoveryToken,
  getAbandonedCartByToken,
  markAbandonedCartRecovered,
  updateAbandonedCartEmailSent,
  getAbandonedCartsForEmail
} from "../db";
import { cartItems, products, productVariants } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";
import { 
  getFirstAbandonedCartEmail,
  getSecondAbandonedCartEmail,
  getThirdAbandonedCartEmail,
  type CartItem as EmailCartItem
} from "../abandoned-cart-emails";

/**
 * Abandoned Cart Router
 * Handles cart abandonment tracking and recovery
 */
export const abandonedCartRouter = router({
  /**
   * Track abandoned cart when user leaves checkout
   * Called when user navigates away from checkout with items in cart
   */
  trackAbandonment: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }

      try {
        // Get user's cart items
        const userCartItems = await db
          .select({
            cartItem: cartItems,
            product: products,
            variant: productVariants,
          })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
          .where(eq(cartItems.userId, ctx.user.id));

        if (userCartItems.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No items in cart" });
        }

        // Calculate total value
        const totalValue = userCartItems.reduce((sum, item) => {
          const price = item.variant?.priceInCents || item.product?.priceInCents || 0;
          return sum + (price * item.cartItem.quantity);
        }, 0);

        // Prepare cart data for storage
        const cartData = JSON.stringify(userCartItems.map(item => ({
          productId: item.cartItem.productId,
          variantId: item.cartItem.variantId,
          quantity: item.cartItem.quantity,
          isSubscription: item.cartItem.isSubscription,
          subscriptionPlanId: item.cartItem.subscriptionPlanId,
          productName: item.product?.name,
          variantName: item.variant?.name,
          priceInCents: item.variant?.priceInCents || item.product?.priceInCents,
          imageUrl: item.product?.imageUrl,
        })));

        // Generate recovery token
        const recoveryToken = generateRecoveryToken();

        // Create abandoned cart record
        const abandonedCart = await createAbandonedCart({
          userId: ctx.user.id,
          sessionId: null,
          email: input.email,
          cartData,
          totalValue,
          recoveryToken,
        });

        if (!abandonedCart) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create abandoned cart" });
        }

        // Notify owner
        await notifyOwner({
          title: "🛒 Cart Abandoned",
          content: `Customer ${ctx.user.name || input.email} abandoned cart worth $${(totalValue / 100).toFixed(2)} with ${userCartItems.length} items.`,
        });

        return {
          success: true,
          abandonedCartId: abandonedCart.id,
        };
      } catch (error) {
        console.error("[AbandonedCart] Failed to track abandonment:", error);
        throw error;
      }
    }),

  /**
   * Get abandoned cart by recovery token
   * Used when user clicks recovery link in email
   */
  getByToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const abandonedCart = await getAbandonedCartByToken(input.token);

        if (!abandonedCart) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found or already recovered" });
        }

        if (abandonedCart.isRecovered) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This cart has already been recovered" });
        }

        // Parse cart data
        const cartData = JSON.parse(abandonedCart.cartData);

        return {
          id: abandonedCart.id,
          email: abandonedCart.email,
          cartItems: cartData,
          totalValue: abandonedCart.totalValue,
          createdAt: abandonedCart.createdAt,
        };
      } catch (error) {
        console.error("[AbandonedCart] Failed to get cart by token:", error);
        throw error;
      }
    }),

  /**
   * Restore abandoned cart items to user's cart
   * Called when user clicks recovery link and is logged in
   */
  restoreCart: protectedProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }

      try {
        const abandonedCart = await getAbandonedCartByToken(input.token);

        if (!abandonedCart) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });
        }

        if (abandonedCart.isRecovered) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This cart has already been recovered" });
        }

        // Parse cart data
        const cartData = JSON.parse(abandonedCart.cartData);

        // Clear user's current cart
        await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));

        // Restore cart items
        for (const item of cartData) {
          await db.insert(cartItems).values({
            userId: ctx.user.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            isSubscription: item.isSubscription,
            subscriptionPlanId: item.subscriptionPlanId,
          });
        }

        return {
          success: true,
          itemsRestored: cartData.length,
        };
      } catch (error) {
        console.error("[AbandonedCart] Failed to restore cart:", error);
        throw error;
      }
    }),

  /**
   * Send abandoned cart recovery emails
   * This would typically be called by a cron job or scheduled task
   * For now, it can be manually triggered or called from a webhook
   */
  sendRecoveryEmails: publicProcedure
    .input(z.object({
      emailNumber: z.enum(["1", "2", "3"]),
    }))
    .mutation(async ({ input }) => {
      try {
        const emailNum = parseInt(input.emailNumber) as 1 | 2 | 3;
        const abandonedCarts = await getAbandonedCartsForEmail(emailNum);

        console.log(`[AbandonedCart] Found ${abandonedCarts.length} carts for email ${emailNum}`);

        let sentCount = 0;

        for (const cart of abandonedCarts) {
          try {
            // Parse cart data
            const cartData = JSON.parse(cart.cartData);

            // Prepare email data
            const emailCartItems: EmailCartItem[] = cartData.map((item: any) => ({
              productName: item.productName || "Product",
              variantName: item.variantName,
              quantity: item.quantity,
              priceInCents: item.priceInCents,
              imageUrl: item.imageUrl,
            }));

            // Generate recovery link
            const recoveryLink = `https://optibiosupplements.com/cart/recover?token=${cart.recoveryToken}`;

            // Generate discount code for emails 2 and 3
            let discountCode: string | undefined;
            let discountPercent: number | undefined;
            if (emailNum >= 2) {
              discountCode = `CART${cart.id}SAVE5`;
              discountPercent = 5;
            }

            // Skip if no email
            if (!cart.email) {
              console.warn(`[AbandonedCart] Skipping cart ${cart.id} - no email`);
              continue;
            }

            const emailData = {
              email: cart.email,
              cartItems: emailCartItems,
              totalValue: cart.totalValue,
              recoveryLink,
              discountCode,
              discountPercent,
            };

            // Get appropriate email template
            let emailHtml: string;
            let emailSubject: string;

            if (emailNum === 1) {
              emailHtml = getFirstAbandonedCartEmail(emailData);
              emailSubject = "You Left Something Behind";
            } else if (emailNum === 2) {
              emailHtml = getSecondAbandonedCartEmail(emailData);
              emailSubject = `Special ${discountPercent}% Discount Inside`;
            } else {
              emailHtml = getThirdAbandonedCartEmail(emailData);
              emailSubject = "Last Chance - Your Cart Expires Soon";
            }

            // Send email via owner notification (temporary - should use proper email service)
            await notifyOwner({
              title: `📧 Abandoned Cart Email ${emailNum} - ${cart.email}`,
              content: `Sending recovery email to ${cart.email}\n\nSubject: ${emailSubject}\n\nRecovery Link: ${recoveryLink}\n\nCart Value: $${(cart.totalValue / 100).toFixed(2)}`,
            });

            // Update email sent timestamp
            await updateAbandonedCartEmailSent(cart.id, emailNum);

            sentCount++;
          } catch (error) {
            console.error(`[AbandonedCart] Failed to send email for cart ${cart.id}:`, error);
          }
        }

        return {
          success: true,
          emailsSent: sentCount,
          cartsProcessed: abandonedCarts.length,
        };
      } catch (error) {
        console.error("[AbandonedCart] Failed to send recovery emails:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send emails" });
      }
    }),
});
