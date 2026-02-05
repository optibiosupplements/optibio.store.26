/**
 * Abandoned Cart Email Scheduler
 * 
 * This script sends abandoned cart recovery emails in a 3-email sequence:
 * - Email 1: 1 hour after abandonment (gentle reminder)
 * - Email 2: 24 hours after abandonment (5% discount incentive)
 * - Email 3: 48 hours after abandonment (final urgency push)
 * 
 * Usage:
 * - Run manually: `tsx server/abandoned-cart-scheduler.ts`
 * - Run as cron job: Add to crontab to run every hour
 * - Run via Manus scheduler: Use schedule tool with cron expression
 */

import { getAbandonedCartsForEmail, updateAbandonedCartEmailSent } from "./db";
import { 
  getFirstAbandonedCartEmail,
  getSecondAbandonedCartEmail,
  getThirdAbandonedCartEmail,
  type CartItem as EmailCartItem
} from "./abandoned-cart-emails";
import { notifyOwner } from "./_core/notification";

interface CartItemData {
  productName: string;
  variantName?: string;
  quantity: number;
  priceInCents: number;
  imageUrl?: string;
}

/**
 * Send abandoned cart emails for a specific sequence number
 */
async function sendAbandonedCartEmails(emailNumber: 1 | 2 | 3): Promise<void> {
  console.log(`[AbandonedCartScheduler] Starting email sequence ${emailNumber}...`);

  try {
    // Get carts that need this email
    const abandonedCarts = await getAbandonedCartsForEmail(emailNumber);
    console.log(`[AbandonedCartScheduler] Found ${abandonedCarts.length} carts for email ${emailNumber}`);

    if (abandonedCarts.length === 0) {
      console.log(`[AbandonedCartScheduler] No carts to process for email ${emailNumber}`);
      return;
    }

    let sentCount = 0;
    let errorCount = 0;

    for (const cart of abandonedCarts) {
      try {
        // Skip if no email
        if (!cart.email) {
          console.warn(`[AbandonedCartScheduler] Skipping cart ${cart.id} - no email`);
          continue;
        }

        // Parse cart data - handle both array and object formats
        let parsedCartData = JSON.parse(cart.cartData);
        if (!Array.isArray(parsedCartData)) {
          parsedCartData = parsedCartData.items || [parsedCartData];
        }
        const cartData: CartItemData[] = parsedCartData;

        // Prepare email data
        const emailCartItems: EmailCartItem[] = cartData.map((item) => ({
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
        if (emailNumber >= 2) {
          discountCode = `CART${cart.id}SAVE5`;
          discountPercent = 5;
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

        if (emailNumber === 1) {
          emailHtml = getFirstAbandonedCartEmail(emailData);
          emailSubject = "You Left Something Behind";
        } else if (emailNumber === 2) {
          emailHtml = getSecondAbandonedCartEmail(emailData);
          emailSubject = `Special ${discountPercent}% Discount Inside`;
        } else {
          emailHtml = getThirdAbandonedCartEmail(emailData);
          emailSubject = "Last Chance - Your Cart Expires Soon";
        }

        // Send email via owner notification (temporary - should use proper email service)
        // TODO: Replace with proper email service (SendGrid, Mailgun, etc.)
        await notifyOwner({
          title: `📧 Abandoned Cart Email ${emailNumber} - ${cart.email}`,
          content: `Sending recovery email to ${cart.email}\n\nSubject: ${emailSubject}\n\nRecovery Link: ${recoveryLink}\n\nCart Value: $${(cart.totalValue / 100).toFixed(2)}\n\nItems: ${cartData.length}`,
        });

        // Update email sent timestamp
        await updateAbandonedCartEmailSent(cart.id, emailNumber);

        sentCount++;
        console.log(`[AbandonedCartScheduler] ✓ Sent email ${emailNumber} to ${cart.email} (cart ${cart.id})`);
      } catch (error) {
        errorCount++;
        console.error(`[AbandonedCartScheduler] ✗ Failed to send email for cart ${cart.id}:`, error);
      }
    }

    console.log(`[AbandonedCartScheduler] Email ${emailNumber} complete: ${sentCount} sent, ${errorCount} errors`);

    // Send summary notification
    if (sentCount > 0) {
      await notifyOwner({
        title: `📊 Abandoned Cart Email ${emailNumber} Summary`,
        content: `Sent ${sentCount} recovery emails\nErrors: ${errorCount}\nTotal carts processed: ${abandonedCarts.length}`,
      });
    }
  } catch (error) {
    console.error(`[AbandonedCartScheduler] Fatal error in email sequence ${emailNumber}:`, error);
    throw error;
  }
}

/**
 * Main scheduler function - runs all three email sequences
 */
async function runScheduler(): Promise<void> {
  console.log(`[AbandonedCartScheduler] Starting scheduler at ${new Date().toISOString()}`);

  try {
    // Send all three email sequences
    await sendAbandonedCartEmails(1); // 1 hour after abandonment
    await sendAbandonedCartEmails(2); // 24 hours after abandonment
    await sendAbandonedCartEmails(3); // 48 hours after abandonment

    console.log(`[AbandonedCartScheduler] Scheduler completed successfully`);
  } catch (error) {
    console.error(`[AbandonedCartScheduler] Scheduler failed:`, error);
    
    // Notify owner of scheduler failure
    await notifyOwner({
      title: "🚨 Abandoned Cart Scheduler Error",
      content: `The abandoned cart email scheduler encountered an error:\n\n${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Run scheduler if executed directly
if (require.main === module) {
  runScheduler()
    .then(() => {
      console.log("[AbandonedCartScheduler] Exiting...");
      process.exit(0);
    })
    .catch((error) => {
      console.error("[AbandonedCartScheduler] Fatal error:", error);
      process.exit(1);
    });
}

// Export for use in other modules
export { runScheduler, sendAbandonedCartEmails };
