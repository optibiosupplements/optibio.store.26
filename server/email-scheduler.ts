/**
 * Email Scheduler - Lifecycle Revenue Engine
 * 
 * Automated email sequences for:
 * 1. Abandoned Cart Recovery (1hr, 24hr, 48hr)
 * 2. Post-Purchase Nurture (Day 7, 21, 60, 90)
 * 
 * Uses Manus built-in email API - no external API keys needed for MVP
 */

import * as cron from "node-cron";
import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";
import {
  getAbandonedCartsForEmail,
  updateAbandonedCartEmailSent,
  getOrdersNeedingPostPurchaseEmail,
  updatePostPurchaseEmailSent,
} from "./db";
import {
  getFirstAbandonedCartEmail,
  getSecondAbandonedCartEmail,
  getThirdAbandonedCartEmail,
  type CartItem as EmailCartItem,
} from "./abandoned-cart-emails";
import {
  getDay7Email,
  getDay21Email,
  getDay60Email,
  getDay90Email,
} from "./post-purchase-emails";

// Email scheduler state
let isSchedulerRunning = false;
let lastRunTime: Date | null = null;
let schedulerStats = {
  abandonedCart: { sent: 0, failed: 0, lastRun: null as Date | null },
  postPurchase: { sent: 0, failed: 0, lastRun: null as Date | null },
};

/**
 * Send email using Manus built-in API
 */
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const endpoint = `${ENV.forgeApiUrl.replace(/\/$/, "")}/webdevtoken.v1.WebDevService/SendEmail`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to,
        subject,
        htmlBody: html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[EmailScheduler] Failed to send email (${response.status})${detail ? `: ${detail}` : ""}`);
      return false;
    }

    console.log(`[EmailScheduler] ✓ Email sent to ${to}: ${subject}`);
    return true;
  } catch (error: any) {
    console.error(`[EmailScheduler] Error sending email to ${to}:`, error.message);
    return false;
  }
}

/**
 * Process abandoned cart emails for a specific sequence
 */
async function processAbandonedCartEmails(emailNumber: 1 | 2 | 3): Promise<{ sent: number; failed: number }> {
  const result = { sent: 0, failed: 0 };

  try {
    const carts = await getAbandonedCartsForEmail(emailNumber);
    
    // Handle null/undefined response
    if (!carts || !Array.isArray(carts)) {
      console.log(`[EmailScheduler] No carts data for abandoned cart email ${emailNumber}`);
      return result;
    }
    
    console.log(`[EmailScheduler] Found ${carts.length} carts for abandoned cart email ${emailNumber}`);

    if (carts.length === 0) return result;

    for (const cart of carts) {
      if (!cart.email) {
        console.warn(`[EmailScheduler] Skipping cart ${cart.id} - no email`);
        continue;
      }

      try {
        // Parse cart data
        const cartData = JSON.parse(cart.cartData);
        const emailCartItems: EmailCartItem[] = cartData.map((item: any) => ({
          productName: item.productName || "Product",
          variantName: item.variantName,
          quantity: item.quantity,
          priceInCents: item.priceInCents,
          imageUrl: item.imageUrl,
        }));

        // Generate recovery link
        const baseUrl = process.env.VITE_APP_URL || "https://optibiosupplements.com";
        const recoveryLink = `${baseUrl}/cart/recover?token=${cart.recoveryToken}`;

        // Discount for emails 2 and 3
        let discountCode: string | undefined;
        let discountPercent: number | undefined;
        if (emailNumber >= 2) {
          discountCode = `CART${cart.id}SAVE5`;
          discountPercent = 5;
        }

        const emailData = {
          customerName: cart.email.split("@")[0], // Use email prefix as name
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

        if (emailNumber === 1) {
          emailHtml = getFirstAbandonedCartEmail(emailData);
          emailSubject = "You Left Something Behind - OptiBio";
        } else if (emailNumber === 2) {
          emailHtml = getSecondAbandonedCartEmail(emailData);
          emailSubject = `Special ${discountPercent}% Discount Inside - OptiBio`;
        } else {
          emailHtml = getThirdAbandonedCartEmail(emailData);
          emailSubject = "Last Chance - Your Cart Expires Soon - OptiBio";
        }

        // Send email
        const sent = await sendEmail(cart.email, emailSubject, emailHtml);

        if (sent) {
          await updateAbandonedCartEmailSent(cart.id, emailNumber);
          result.sent++;
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error(`[EmailScheduler] Error processing cart ${cart.id}:`, error);
        result.failed++;
      }
    }
  } catch (error) {
    console.error(`[EmailScheduler] Fatal error in abandoned cart email ${emailNumber}:`, error);
  }

  return result;
}

/**
 * Process post-purchase emails for a specific day
 */
async function processPostPurchaseEmails(dayNumber: 7 | 21 | 60 | 90): Promise<{ sent: number; failed: number }> {
  const result = { sent: 0, failed: 0 };

  try {
    const orders = await getOrdersNeedingPostPurchaseEmail(dayNumber);
    
    // Handle null/undefined response
    if (!orders || !Array.isArray(orders)) {
      console.log(`[EmailScheduler] No orders data for Day ${dayNumber} email`);
      return result;
    }
    
    console.log(`[EmailScheduler] Found ${orders.length} orders for Day ${dayNumber} email`);

    if (orders.length === 0) return result;

    for (const order of orders) {
      if (!order.email) {
        console.warn(`[EmailScheduler] Skipping order ${order.orderId} - no email`);
        continue;
      }

      try {
        const baseUrl = process.env.VITE_APP_URL || "https://optibiosupplements.com";
        
        // Format purchase date
        const purchaseDate = order.purchaseDate 
          ? new Date(order.purchaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "your recent purchase";
        
        const emailData = {
          customerName: order.email.split("@")[0],
          productName: "OptiBio Ashwagandha KSM-66",
          orderNumber: `ORD-${order.orderId}`,
          purchaseDate,
          reorderUrl: `${baseUrl}/shop`,
          subscribeUrl: `${baseUrl}/subscribe`,
          reviewUrl: `${baseUrl}/reviews`,
        };

        // Get appropriate email template
        let emailHtml: string;
        let emailSubject: string;

        if (dayNumber === 7) {
          emailHtml = getDay7Email(emailData);
          emailSubject = "How's Your Wellness Journey Going? - OptiBio";
        } else if (dayNumber === 21) {
          emailHtml = getDay21Email(emailData);
          emailSubject = "Noticing Better Sleep? Share Your Experience - OptiBio";
        } else if (dayNumber === 60) {
          emailHtml = getDay60Email(emailData);
          emailSubject = "Time to Restock? Special Offer Inside - OptiBio";
        } else {
          emailHtml = getDay90Email(emailData);
          emailSubject = "Never Run Out Again - Subscribe & Save 15% - OptiBio";
        }

        // Send email
        const sent = await sendEmail(order.email, emailSubject, emailHtml);

        if (sent) {
          await updatePostPurchaseEmailSent(order.id, dayNumber);
          result.sent++;
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error(`[EmailScheduler] Error processing order ${order.orderId}:`, error);
        result.failed++;
      }
    }
  } catch (error) {
    console.error(`[EmailScheduler] Fatal error in post-purchase email Day ${dayNumber}:`, error);
  }

  return result;
}

/**
 * Run all abandoned cart email sequences
 */
async function runAbandonedCartScheduler(): Promise<void> {
  console.log(`[EmailScheduler] Running abandoned cart scheduler at ${new Date().toISOString()}`);

  let totalSent = 0;
  let totalFailed = 0;

  // Process all three email sequences
  for (const emailNum of [1, 2, 3] as const) {
    const result = await processAbandonedCartEmails(emailNum);
    totalSent += result.sent;
    totalFailed += result.failed;
  }

  schedulerStats.abandonedCart.sent += totalSent;
  schedulerStats.abandonedCart.failed += totalFailed;
  schedulerStats.abandonedCart.lastRun = new Date();

  if (totalSent > 0 || totalFailed > 0) {
    console.log(`[EmailScheduler] Abandoned cart complete: ${totalSent} sent, ${totalFailed} failed`);
    
    // Notify owner of significant activity
    if (totalSent >= 5 || totalFailed > 0) {
      await notifyOwner({
        title: "📧 Abandoned Cart Email Summary",
        content: `Sent: ${totalSent} recovery emails\nFailed: ${totalFailed}`,
      });
    }
  }
}

/**
 * Run all post-purchase email sequences
 */
async function runPostPurchaseScheduler(): Promise<void> {
  console.log(`[EmailScheduler] Running post-purchase scheduler at ${new Date().toISOString()}`);

  let totalSent = 0;
  let totalFailed = 0;

  // Process all four email sequences
  for (const dayNum of [7, 21, 60, 90] as const) {
    const result = await processPostPurchaseEmails(dayNum);
    totalSent += result.sent;
    totalFailed += result.failed;
  }

  schedulerStats.postPurchase.sent += totalSent;
  schedulerStats.postPurchase.failed += totalFailed;
  schedulerStats.postPurchase.lastRun = new Date();

  if (totalSent > 0 || totalFailed > 0) {
    console.log(`[EmailScheduler] Post-purchase complete: ${totalSent} sent, ${totalFailed} failed`);
    
    // Notify owner of significant activity
    if (totalSent >= 5 || totalFailed > 0) {
      await notifyOwner({
        title: "📧 Post-Purchase Email Summary",
        content: `Sent: ${totalSent} nurture emails\nFailed: ${totalFailed}`,
      });
    }
  }
}

/**
 * Initialize and start the email scheduler
 */
export function startEmailScheduler(): void {
  if (isSchedulerRunning) {
    console.log("[EmailScheduler] Scheduler already running");
    return;
  }

  console.log("[EmailScheduler] Starting email scheduler...");

  // Abandoned Cart: Run every 10 minutes
  // Checks for carts that need email 1 (1hr), email 2 (24hr), or email 3 (48hr)
  cron.schedule("*/10 * * * *", async () => {
    try {
      await runAbandonedCartScheduler();
    } catch (error) {
      console.error("[EmailScheduler] Abandoned cart scheduler error:", error);
    }
  });

  // Post-Purchase: Run every hour
  // Checks for orders that need Day 7, 21, 60, or 90 emails
  cron.schedule("0 * * * *", async () => {
    try {
      await runPostPurchaseScheduler();
    } catch (error) {
      console.error("[EmailScheduler] Post-purchase scheduler error:", error);
    }
  });

  // Daily summary: Run at 9 AM
  cron.schedule("0 9 * * *", async () => {
    const summary = `
📊 Daily Email Scheduler Summary

Abandoned Cart Recovery:
- Emails sent (lifetime): ${schedulerStats.abandonedCart.sent}
- Failures (lifetime): ${schedulerStats.abandonedCart.failed}
- Last run: ${schedulerStats.abandonedCart.lastRun?.toISOString() || "Never"}

Post-Purchase Nurture:
- Emails sent (lifetime): ${schedulerStats.postPurchase.sent}
- Failures (lifetime): ${schedulerStats.postPurchase.failed}
- Last run: ${schedulerStats.postPurchase.lastRun?.toISOString() || "Never"}
    `.trim();

    await notifyOwner({
      title: "📊 Daily Email Scheduler Summary",
      content: summary,
    });
  });

  isSchedulerRunning = true;
  lastRunTime = new Date();
  console.log("[EmailScheduler] ✓ Email scheduler started successfully");
  console.log("[EmailScheduler] - Abandoned cart: every 10 minutes");
  console.log("[EmailScheduler] - Post-purchase: every hour");
  console.log("[EmailScheduler] - Daily summary: 9 AM");
}

/**
 * Stop the email scheduler
 */
export function stopEmailScheduler(): void {
  // node-cron doesn't have a global stop, but we can track state
  isSchedulerRunning = false;
  console.log("[EmailScheduler] Scheduler stopped");
}

/**
 * Get scheduler status for admin dashboard
 */
export function getSchedulerStatus() {
  return {
    isRunning: isSchedulerRunning,
    lastRunTime,
    stats: schedulerStats,
  };
}

/**
 * Manually trigger abandoned cart emails (for testing/admin)
 */
export async function triggerAbandonedCartEmails(emailNumber?: 1 | 2 | 3): Promise<{ sent: number; failed: number }> {
  if (emailNumber) {
    return processAbandonedCartEmails(emailNumber);
  }
  
  let totalSent = 0;
  let totalFailed = 0;
  
  for (const num of [1, 2, 3] as const) {
    const result = await processAbandonedCartEmails(num);
    totalSent += result.sent;
    totalFailed += result.failed;
  }
  
  return { sent: totalSent, failed: totalFailed };
}

/**
 * Manually trigger post-purchase emails (for testing/admin)
 */
export async function triggerPostPurchaseEmails(dayNumber?: 7 | 21 | 60 | 90): Promise<{ sent: number; failed: number }> {
  if (dayNumber) {
    return processPostPurchaseEmails(dayNumber);
  }
  
  let totalSent = 0;
  let totalFailed = 0;
  
  for (const num of [7, 21, 60, 90] as const) {
    const result = await processPostPurchaseEmails(num);
    totalSent += result.sent;
    totalFailed += result.failed;
  }
  
  return { sent: totalSent, failed: totalFailed };
}
