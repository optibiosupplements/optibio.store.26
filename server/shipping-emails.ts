/**
 * Shipping Notification Email Templates
 * 
 * Email templates for shipping-related notifications:
 * - Order shipped notification
 * - Delivery confirmation
 * - Tracking update
 */

import { Order, OrderItem } from '../drizzle/schema';

interface ShippingEmailData {
  order: Order;
  items: OrderItem[];
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery?: string;
}

/**
 * Format price from cents to dollars
 */
function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Generate order shipped email HTML
 */
export function getOrderShippedEmail(data: ShippingEmailData): { subject: string; html: string; text: string } {
  const { order, items, trackingNumber, trackingUrl, carrier, estimatedDelivery } = data;

  const itemsList = items.map(item => 
    `${item.quantity}x ${item.productName}${item.variantName ? ` (${item.variantName})` : ''}`
  ).join(', ');

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.productName}${item.variantName ? `<br><span style="color: #6b7280; font-size: 14px;">${item.variantName}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
    </tr>
  `).join('');

  const subject = `Your OptiBio order has shipped! 📦`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px;">Your Order Has Shipped!</h1>
      <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">It's on its way to you</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
        Hi ${order.shippingFirstName},
      </p>
      <p style="margin: 0 0 30px 0; font-size: 16px; color: #374151; line-height: 1.6;">
        Great news! Your OptiBio order <strong>#${order.orderNumber}</strong> has been shipped and is on its way to you.
      </p>

      <!-- Tracking Box -->
      <div style="background: #f0fdf4; padding: 24px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #bbf7d0;">
        <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 18px;">📦 Tracking Information</h3>
        <p style="margin: 0 0 8px 0; color: #374151;">
          <strong>Carrier:</strong> ${carrier}
        </p>
        <p style="margin: 0 0 8px 0; color: #374151;">
          <strong>Tracking Number:</strong> ${trackingNumber}
        </p>
        ${estimatedDelivery ? `
        <p style="margin: 0 0 16px 0; color: #374151;">
          <strong>Estimated Delivery:</strong> ${estimatedDelivery}
        </p>
        ` : ''}
        <a href="${trackingUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Track Your Package →
        </a>
      </div>

      <!-- Items -->
      <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px;">Items in This Shipment</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr>
            <th style="padding: 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">Product</th>
            <th style="padding: 12px; text-align: center; background: #f9fafb; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Shipping Address -->
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="margin: 0 0 12px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Shipping To</h4>
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          ${order.shippingFirstName} ${order.shippingLastName}<br>
          ${order.shippingAddress1}<br>
          ${order.shippingAddress2 ? `${order.shippingAddress2}<br>` : ''}
          ${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}<br>
          ${order.shippingCountry}
        </p>
      </div>

      <!-- Help Section -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          Questions about your order?
        </p>
        <a href="mailto:support@optibio.com" style="color: #10b981; text-decoration: none; font-weight: 600;">
          Contact our support team
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 14px;">
        OptiBio Supplements
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        Premium Ashwagandha KSM-66 for optimal wellness
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your OptiBio Order Has Shipped!

Hi ${order.shippingFirstName},

Great news! Your OptiBio order #${order.orderNumber} has been shipped and is on its way to you.

TRACKING INFORMATION
Carrier: ${carrier}
Tracking Number: ${trackingNumber}
${estimatedDelivery ? `Estimated Delivery: ${estimatedDelivery}` : ''}
Track your package: ${trackingUrl}

ITEMS IN THIS SHIPMENT
${itemsList}

SHIPPING TO
${order.shippingFirstName} ${order.shippingLastName}
${order.shippingAddress1}
${order.shippingAddress2 ? order.shippingAddress2 + '\n' : ''}${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}
${order.shippingCountry}

Questions? Contact us at support@optibio.com

Thank you for choosing OptiBio!
  `.trim();

  return { subject, html, text };
}

/**
 * Generate delivery confirmation email HTML
 */
export function getDeliveryConfirmationEmail(data: ShippingEmailData): { subject: string; html: string; text: string } {
  const { order, items } = data;

  const subject = `Your OptiBio order has been delivered! ✅`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
      <h1 style="margin: 0; color: white; font-size: 28px;">Delivered!</h1>
      <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your order has arrived</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
        Hi ${order.shippingFirstName},
      </p>
      <p style="margin: 0 0 30px 0; font-size: 16px; color: #374151; line-height: 1.6;">
        Your OptiBio order <strong>#${order.orderNumber}</strong> has been delivered! We hope you love your new supplements.
      </p>

      <!-- CTA Box -->
      <div style="background: #fef3c7; padding: 24px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
        <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 18px;">How was your experience?</h3>
        <p style="margin: 0 0 16px 0; color: #78350f; font-size: 14px;">
          We'd love to hear your feedback! Leave a review and help others discover OptiBio.
        </p>
        <a href="https://optibio.com/reviews" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Leave a Review ⭐
        </a>
      </div>

      <!-- Tips Section -->
      <div style="background: #f0fdf4; padding: 24px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 18px;">💡 Getting Started Tips</h3>
        <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; line-height: 1.8;">
          <li>Take 1-2 capsules daily with food for best absorption</li>
          <li>Consistency is key - take at the same time each day</li>
          <li>Results typically appear within 2-4 weeks of daily use</li>
          <li>Store in a cool, dry place away from direct sunlight</li>
        </ul>
      </div>

      <!-- Help Section -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          Questions or concerns?
        </p>
        <a href="mailto:support@optibio.com" style="color: #10b981; text-decoration: none; font-weight: 600;">
          We're here to help
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 14px;">
        OptiBio Supplements
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        Premium Ashwagandha KSM-66 for optimal wellness
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your OptiBio Order Has Been Delivered!

Hi ${order.shippingFirstName},

Your OptiBio order #${order.orderNumber} has been delivered! We hope you love your new supplements.

HOW WAS YOUR EXPERIENCE?
We'd love to hear your feedback! Leave a review at: https://optibio.com/reviews

GETTING STARTED TIPS
- Take 1-2 capsules daily with food for best absorption
- Consistency is key - take at the same time each day
- Results typically appear within 2-4 weeks of daily use
- Store in a cool, dry place away from direct sunlight

Questions? Contact us at support@optibio.com

Thank you for choosing OptiBio!
  `.trim();

  return { subject, html, text };
}

export default {
  getOrderShippedEmail,
  getDeliveryConfirmationEmail,
};
