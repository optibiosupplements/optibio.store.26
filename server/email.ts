import { ENV } from "./_core/env";

/**
 * Email service for sending order confirmation and transactional emails
 * Uses the built-in Manus notification API
 */

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    priceInCents: number;
  }>;
  subtotalInCents: number;
  shippingInCents: number;
  taxInCents: number;
  totalInCents: number;
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

/**
 * Format price in cents to USD string
 */
function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const itemsList = data.items
      .map(
        (item) =>
          `- ${item.productName}${item.variantName ? ` (${item.variantName})` : ""} x${item.quantity} - ${formatPrice(item.priceInCents * item.quantity)}`
      )
      .join("\n");

    const emailContent = `
Order Confirmation - OptiBio

Thank you for your order, ${data.customerName}!

Your order has been confirmed and is being processed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: ${data.orderNumber}
Order Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

ITEMS ORDERED:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Subtotal:        ${formatPrice(data.subtotalInCents)}
Shipping:        ${formatPrice(data.shippingInCents)}
Tax:             ${formatPrice(data.taxInCents)}
─────────────────────────────────────────
TOTAL:           ${formatPrice(data.totalInCents)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.shippingAddress.name}
${data.shippingAddress.address1}
${data.shippingAddress.address2 ? data.shippingAddress.address2 + "\n" : ""}${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
${data.shippingAddress.country}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ORDER PROCESSING (1-2 business days)
   We're preparing your OptiBio Ashwagandha KSM-66 for shipment.

2. SHIPPING (3-5 business days)
   You'll receive a tracking number via email once shipped.

3. DELIVERY
   Your premium supplements will arrive at your door.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY GUARANTEE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 100% Money-Back Guarantee (90 days)
✓ Third-Party Tested for Purity & Potency
✓ Premium KSM-66® Ashwagandha
✓ Made in USA - GMP Certified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Contact us at support@optibio.com

Thank you for choosing OptiBio!
Your wellness journey starts here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OptiBio - Premium Supplements for Modern Living
https://optibio.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Send email using built-in notification API
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `Order Confirmation - ${data.orderNumber} - OptiBio`,
        text: emailContent,
        from: "OptiBio <orders@optibio.com>",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Email Service] Failed to send email:", response.status, errorText);
      return false;
    }

    console.log("[Email Service] Order confirmation email sent to:", data.customerEmail);
    return true;
  } catch (error: any) {
    console.error("[Email Service] Error sending email:", error.message);
    return false;
  }
}

/**
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string
): Promise<boolean> {
  try {
    const emailContent = `
Shipping Notification - OptiBio

Great news, ${customerName}!

Your OptiBio order has shipped and is on its way to you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHIPPING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: ${orderNumber}
Carrier: ${carrier}
Tracking Number: ${trackingNumber}

Track your package:
[Tracking information will be available within 24 hours]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTIMATED DELIVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your order should arrive within 3-5 business days.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Contact us at support@optibio.com

Thank you for choosing OptiBio!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OptiBio - Premium Supplements for Modern Living
https://optibio.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Your OptiBio Order Has Shipped - ${orderNumber}`,
        text: emailContent,
        from: "OptiBio <orders@optibio.com>",
      }),
    });

    if (!response.ok) {
      console.error("[Email Service] Failed to send shipping notification:", response.status);
      return false;
    }

    console.log("[Email Service] Shipping notification sent to:", customerEmail);
    return true;
  } catch (error: any) {
    console.error("[Email Service] Error sending shipping notification:", error.message);
    return false;
  }
}

/**
 * Send reservation confirmation email
 */
export async function sendReservationConfirmationEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Email] Forge API not configured");
    return false;
  }

  // Build endpoint URL for email service
  const endpoint = `${ENV.forgeApiUrl.replace(/\/$/, "")}/webdevtoken.v1.WebDevService/SendEmail`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "authorization": `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to,
        subject,
        htmlBody: html,
        textBody: text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send reservation confirmation (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    console.log(`[Email] Reservation confirmation sent to ${to}`);
    return true;
  } catch (error) {
    console.warn("[Email] Error sending reservation confirmation:", error);
    return false;
  }
}


/**
 * Send subscription welcome email to customer
 */
export async function sendSubscriptionWelcomeEmail(
  email: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    // For now, log the email (in production, integrate with email service)
    console.log("[Email] Sending subscription welcome email to:", email);
    console.log("[Email] Subject:", subject);
    console.log("[Email] Text preview:", text.substring(0, 200));
    
    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // For development, we'll just log it
    
    return true;
  } catch (error) {
    console.error("[Email] Failed to send subscription welcome email:", error);
    return false;
  }
}
