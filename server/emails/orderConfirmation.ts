/**
 * Order Confirmation Email Template
 * Midnight Sophistication Palette: Navy (#1E3A5F), Ivory (#F7F4EF), Gold (#C9A961)
 */

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingUrl?: string;
}

export function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - OptiBio</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #F7F4EF;
      color: #2D2D2D;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
    }
    .header {
      background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFFFFF;
      margin: 0;
    }
    .tagline {
      color: #F7F4EF;
      font-size: 14px;
      margin-top: 8px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .success-badge {
      background-color: #C9A961;
      color: #1E3A5F;
      padding: 12px 24px;
      border-radius: 8px;
      display: inline-block;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 24px;
    }
    h1 {
      color: #1E3A5F;
      font-size: 28px;
      margin: 0 0 16px 0;
    }
    .order-number {
      color: #C9A961;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      color: #1E3A5F;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #C9A961;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #F7F4EF;
    }
    .item-name {
      font-weight: 600;
      color: #2D2D2D;
    }
    .item-qty {
      color: #666;
      font-size: 14px;
    }
    .item-price {
      font-weight: bold;
      color: #1E3A5F;
    }
    .totals {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px solid #1E3A5F;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.final {
      font-size: 20px;
      font-weight: bold;
      color: #1E3A5F;
      padding-top: 16px;
      border-top: 2px solid #C9A961;
    }
    .address-box {
      background-color: #F7F4EF;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #C9A961;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #C9A961 0%, #B89651 100%);
      color: #1E3A5F;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      margin: 24px 0;
    }
    .info-box {
      background-color: #F7F4EF;
      border: 2px solid #C9A961;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .footer {
      background-color: #1E3A5F;
      color: #F7F4EF;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #C9A961;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">OptiBio</h1>
      <p class="tagline">Premium Ashwagandha KSM-66® Supplements</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="success-badge">✓ Order Confirmed</div>
      
      <h1>Thank You, ${data.customerName}!</h1>
      <p class="order-number">Order #${data.orderNumber}</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #666;">
        We've received your order and are preparing it for shipment. You'll receive a shipping confirmation email with tracking information once your order is on its way.
      </p>

      <!-- Order Items -->
      <div class="section">
        <div class="section-title">Order Details</div>
        ${data.items.map(item => `
          <div class="item">
            <div>
              <div class="item-name">${item.name}</div>
              <div class="item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
          </div>
        `).join('')}
        
        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatPrice(data.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span>${data.shipping === 0 ? '<span style="color: #C9A961;">FREE</span>' : formatPrice(data.shipping)}</span>
          </div>
          <div class="total-row">
            <span>Tax</span>
            <span>${formatPrice(data.tax)}</span>
          </div>
          <div class="total-row final">
            <span>Total</span>
            <span>${formatPrice(data.total)}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Address -->
      <div class="section">
        <div class="section-title">Shipping Address</div>
        <div class="address-box">
          <strong>${data.customerName}</strong><br>
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
        </div>
      </div>

      <!-- Track Order CTA -->
      ${data.trackingUrl ? `
        <div style="text-align: center;">
          <a href="${data.trackingUrl}" class="cta-button">Track Your Order</a>
        </div>
      ` : ''}

      <!-- Info Box -->
      <div class="info-box">
        <strong style="color: #1E3A5F;">What's Next?</strong>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #666;">
          <li>Your order will ship within 1-2 business days</li>
          <li>You'll receive tracking information via email</li>
          <li>Delivery typically takes 3-5 business days</li>
          <li>Questions? Reply to this email or contact support@optibio.com</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        <strong>90-Day Money-Back Guarantee:</strong> Try OptiBio risk-free. If you're not satisfied, we'll refund every penny—no questions asked.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 16px 0;">
        <strong>OptiBio</strong><br>
        Premium Ashwagandha KSM-66® Supplements
      </p>
      <p style="margin: 0 0 16px 0;">
        <a href="https://optibio.com">Visit Website</a> | 
        <a href="https://optibio.com/account/orders">My Orders</a> | 
        <a href="mailto:support@optibio.com">Support</a>
      </p>
      <p style="font-size: 12px; opacity: 0.8; margin: 0;">
        © ${new Date().getFullYear()} OptiBio. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
