import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  createPostPurchaseEmailTracking,
  getOrdersNeedingPostPurchaseEmail,
  updatePostPurchaseEmailSent,
  markCustomerReordered,
  markCustomerSubscribed,
  markCustomerReviewed,
} from "../db";
import {
  getDay7Email,
  getDay21Email,
  getDay60Email,
  getDay90Email,
} from "../post-purchase-emails";
import { notifyOwner } from "../_core/notification";

export const postPurchaseRouter = router({
  /**
   * Track a new purchase for post-purchase email sequence
   * Called when an order is completed
   */
  trackPurchase: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        userId: z.number().nullable(),
        email: z.string().email(),
        productId: z.number(),
        purchaseDate: z.date().or(z.string().transform((str) => new Date(str))),
      })
    )
    .mutation(async ({ input }) => {
      const record = await createPostPurchaseEmailTracking({
        orderId: input.orderId,
        userId: input.userId,
        email: input.email,
        productId: input.productId,
        purchaseDate: input.purchaseDate instanceof Date ? input.purchaseDate : new Date(input.purchaseDate),
      });

      if (record) {
        console.log(`[PostPurchase] Tracking created for order #${input.orderId}`);
      }

      return { success: !!record };
    }),

  /**
   * Send post-purchase emails for specific day (7, 21, 60, or 90)
   * Called by scheduler
   */
  sendPostPurchaseEmails: publicProcedure
    .input(
      z.object({
        dayNumber: z.union([z.literal(7), z.literal(21), z.literal(60), z.literal(90)]),
      })
    )
    .mutation(async ({ input }) => {
      const { dayNumber } = input;
      console.log(`[PostPurchase] Checking for Day ${dayNumber} emails...`);

      const orders = await getOrdersNeedingPostPurchaseEmail(dayNumber);
      console.log(`[PostPurchase] Found ${orders.length} orders needing Day ${dayNumber} email`);

      if (orders.length === 0) {
        return {
          success: true,
          sent: 0,
          message: `No orders need Day ${dayNumber} email at this time`,
        };
      }

      let sentCount = 0;
      let failedCount = 0;

      for (const order of orders) {
        try {
          // Generate email HTML based on day number
          let emailHtml: string;
          const emailData = {
            customerName: order.email.split("@")[0], // Use email prefix as name
            productName: "OptiBio Ashwagandha KSM-66",
            orderNumber: `#${order.orderId}`,
            purchaseDate: order.purchaseDate.toLocaleDateString(),
            reorderUrl: `https://optibiosupplements.com/product/ashwagandha-ksm-66`,
            subscribeUrl: `https://optibiosupplements.com/product/ashwagandha-ksm-66?subscribe=true`,
            reviewUrl: `https://optibiosupplements.com/product/ashwagandha-ksm-66#reviews`,
          };

          if (dayNumber === 7) {
            emailHtml = getDay7Email(emailData);
          } else if (dayNumber === 21) {
            emailHtml = getDay21Email(emailData);
          } else if (dayNumber === 60) {
            emailHtml = getDay60Email(emailData);
          } else {
            emailHtml = getDay90Email(emailData);
          }

          // Send email via notification system (temporary - replace with real email service)
          const emailSubject = 
            dayNumber === 7 ? "How's Your OptiBio Journey Going?" :
            dayNumber === 21 ? "Are You Sleeping Better?" :
            dayNumber === 60 ? "Running Low on OptiBio?" :
            "Save 15% Forever with Subscribe & Save";

          // For now, use notifyOwner as placeholder
          // TODO: Replace with real email service (SendGrid, Mailgun, etc.)
          const sent = await notifyOwner({
            title: `[Day ${dayNumber} Email] Order #${order.orderId}`,
            content: `Would send to: ${order.email}\nSubject: ${emailSubject}\n\n(Email HTML generated but not sent - integrate email service)`,
          });

          if (sent) {
            // Update email sent timestamp
            await updatePostPurchaseEmailSent(order.id, dayNumber);
            sentCount++;
            console.log(`[PostPurchase] Day ${dayNumber} email sent to ${order.email}`);
          } else {
            failedCount++;
            console.error(`[PostPurchase] Failed to send Day ${dayNumber} email to ${order.email}`);
          }
        } catch (error) {
          failedCount++;
          console.error(`[PostPurchase] Error sending email to ${order.email}:`, error);
        }
      }

      // Notify owner of results
      await notifyOwner({
        title: `Post-Purchase Day ${dayNumber} Emails Sent`,
        content: `Sent: ${sentCount}\nFailed: ${failedCount}\nTotal: ${orders.length}`,
      });

      return {
        success: true,
        sent: sentCount,
        failed: failedCount,
        total: orders.length,
      };
    }),

  /**
   * Mark customer as reordered
   * Called when customer makes a repeat purchase
   */
  markReordered: publicProcedure
    .input(
      z.object({
        originalOrderId: z.number(),
        reorderOrderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await markCustomerReordered(
        input.originalOrderId,
        input.reorderOrderId
      );

      if (success) {
        console.log(`[PostPurchase] Marked order #${input.originalOrderId} as reordered`);
      }

      return { success };
    }),

  /**
   * Mark customer as subscribed
   * Called when customer converts to subscription
   */
  markSubscribed: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await markCustomerSubscribed(input.orderId);

      if (success) {
        console.log(`[PostPurchase] Marked order #${input.orderId} as subscribed`);
      }

      return { success };
    }),

  /**
   * Mark customer as reviewed
   * Called when customer leaves a review
   */
  markReviewed: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await markCustomerReviewed(input.orderId);

      if (success) {
        console.log(`[PostPurchase] Marked order #${input.orderId} as reviewed`);
      }

      return { success };
    }),
});
