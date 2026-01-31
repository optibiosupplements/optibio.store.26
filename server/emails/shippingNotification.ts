/**
 * Shipping Notification Email Template
 * Midnight Sophistication Palette: Navy (#1E3A5F), Ivory (#F7F4EF), Gold (#C9A961)
 */

export interface ShippingNotificationData {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export function generateShippingNotificationEmail(data: ShippingNotificationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped - OptiBio</title>
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
    .shipping-badge {
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
    .tracking-box {
      background: linear-gradient(135deg, #F7F4EF 0%, #FFFFFF 100%);
      border: 2px solid #C9A961;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .tracking-number {
      font-size: 24px;
      font-weight: bold;
      color: #1E3A5F;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin: 16px 0;
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
      margin: 16px 0;
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
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #F7F4EF;
    }
    .info-label {
      color: #666;
      font-weight: 600;
    }
    .info-value {
      color: #1E3A5F;
      font-weight: bold;
    }
    .item {
      padding: 8px 0;
      color: #666;
    }
    .address-box {
      background-color: #F7F4EF;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #C9A961;
    }
    .timeline {
      margin: 24px 0;
    }
    .timeline-step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .timeline-icon {
      width: 40px;
      height: 40px;
      background-color: #C9A961;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #1E3A5F;
      flex-shrink: 0;
      margin-right: 16px;
    }
    .timeline-content {
      flex: 1;
    }
    .timeline-title {
      font-weight: bold;
      color: #1E3A5F;
      margin-bottom: 4px;
    }
    .timeline-desc {
      font-size: 14px;
      color: #666;
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
      <div class="shipping-badge">📦 Order Shipped</div>
      
      <h1>Your Order is On the Way!</h1>
      <p class="order-number">Order #${data.orderNumber}</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #666;">
        Great news, ${data.customerName}! Your OptiBio order has been shipped and is on its way to you.
      </p>

      <!-- Tracking Box -->
      <div class="tracking-box">
        <div style="color: #1E3A5F; font-weight: bold; margin-bottom: 8px;">Tracking Number</div>
        <div class="tracking-number">${data.trackingNumber}</div>
        <a href="${data.trackingUrl}" class="cta-button">Track Your Package</a>
      </div>

      <!-- Shipping Details -->
      <div class="section">
        <div class="section-title">Shipping Details</div>
        <div class="info-row">
          <span class="info-label">Carrier</span>
          <span class="info-value">${data.carrier}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Estimated Delivery</span>
          <span class="info-value">${data.estimatedDelivery}</span>
        </div>
      </div>

      <!-- Items Shipped -->
      <div class="section">
        <div class="section-title">Items in This Shipment</div>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong> × ${item.quantity}
          </div>
        `).join('')}
      </div>

      <!-- Shipping Address -->
      <div class="section">
        <div class="section-title">Delivery Address</div>
        <div class="address-box">
          <strong>${data.customerName}</strong><br>
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
        </div>
      </div>

      <!-- Timeline -->
      <div class="section">
        <div class="section-title">What Happens Next</div>
        <div class="timeline">
          <div class="timeline-step">
            <div class="timeline-icon">✓</div>
            <div class="timeline-content">
              <div class="timeline-title">Order Processed</div>
              <div class="timeline-desc">Your order has been packed and handed to ${data.carrier}</div>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-icon">🚚</div>
            <div class="timeline-content">
              <div class="timeline-title">In Transit</div>
              <div class="timeline-desc">Your package is on its way to you</div>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-icon">📬</div>
            <div class="timeline-content">
              <div class="timeline-title">Out for Delivery</div>
              <div class="timeline-desc">Your package will be delivered by ${data.estimatedDelivery}</div>
            </div>
          </div>
        </div>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6; background-color: #F7F4EF; padding: 16px; border-radius: 8px;">
        <strong style="color: #1E3A5F;">Getting Started with OptiBio:</strong><br>
        Once your order arrives, start with 2 capsules daily (600mg KSM-66®). Take consistently for 8-12 weeks to experience the full benefits. Results typically begin within 2-4 weeks.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 16px 0;">
        <strong>OptiBio</strong><br>
        Premium Ashwagandha KSM-66® Supplements
      </p>
      <p style="margin: 0 0 16px 0;">
        <a href="${data.trackingUrl}">Track Order</a> | 
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
