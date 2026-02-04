/**
 * Packing Slip Generation
 * 
 * Generates professional packing slips for order fulfillment.
 * Returns HTML that can be printed or converted to PDF.
 */

import { Order, OrderItem } from '../drizzle/schema';

interface PackingSlipData {
  order: Order;
  items: OrderItem[];
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

/**
 * Format price from cents to dollars
 */
function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format date for display
 */
function formatDate(date: Date | string | null): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate HTML packing slip
 */
export function generatePackingSlipHTML(data: PackingSlipData): string {
  const { order, items, companyInfo } = data;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.productName}</strong>
        ${item.variantName ? `<br><span style="color: #6b7280; font-size: 14px;">${item.variantName}</span>` : ''}
        ${item.sku ? `<br><span style="color: #9ca3af; font-size: 12px;">SKU: ${item.sku}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.priceInCents)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.totalInCents)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Packing Slip - ${order.orderNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #10b981;
    }
    .company-info h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #10b981;
    }
    .company-info p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
    .order-info {
      text-align: right;
    }
    .order-info h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #374151;
    }
    .order-info p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
    .addresses {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
    }
    .address-box {
      flex: 1;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
    }
    .address-box h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    .address-box p {
      margin: 0;
      font-size: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) {
      text-align: center;
    }
    th:nth-child(3), th:nth-child(4) {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      font-weight: bold;
      font-size: 18px;
      border-bottom: none;
      padding-top: 12px;
      color: #10b981;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
    .notes {
      background: #fef3c7;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .notes h4 {
      margin: 0 0 8px 0;
      color: #92400e;
    }
    .notes p {
      margin: 0;
      color: #78350f;
    }
    .checklist {
      margin-top: 30px;
      padding: 20px;
      background: #f0fdf4;
      border-radius: 8px;
    }
    .checklist h4 {
      margin: 0 0 12px 0;
      color: #166534;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid #10b981;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      ${companyInfo.logo ? `<img src="${companyInfo.logo}" alt="${companyInfo.name}" style="height: 50px; margin-bottom: 8px;">` : ''}
      <h1>${companyInfo.name}</h1>
      <p>${companyInfo.address}</p>
      <p>${companyInfo.phone} | ${companyInfo.email}</p>
    </div>
    <div class="order-info">
      <h2>PACKING SLIP</h2>
      <p><strong>Order:</strong> ${order.orderNumber}</p>
      <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
      <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
    </div>
  </div>

  <div class="addresses">
    <div class="address-box">
      <h3>Ship To</h3>
      <p>
        <strong>${order.shippingFirstName} ${order.shippingLastName}</strong><br>
        ${order.shippingAddress1}<br>
        ${order.shippingAddress2 ? `${order.shippingAddress2}<br>` : ''}
        ${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}<br>
        ${order.shippingCountry}
        ${order.shippingPhone ? `<br>Phone: ${order.shippingPhone}` : ''}
      </p>
    </div>
    <div class="address-box">
      <h3>Bill To</h3>
      <p>
        <strong>${order.billingFirstName} ${order.billingLastName}</strong><br>
        ${order.billingAddress1}<br>
        ${order.billingAddress2 ? `${order.billingAddress2}<br>` : ''}
        ${order.billingCity}, ${order.billingState} ${order.billingZipCode}<br>
        ${order.billingCountry}
      </p>
    </div>
  </div>

  ${order.customerNotes ? `
  <div class="notes">
    <h4>Customer Notes</h4>
    <p>${order.customerNotes}</p>
  </div>
  ` : ''}

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatPrice(order.subtotalInCents)}</span>
    </div>
    ${order.discountInCents > 0 ? `
    <div class="totals-row">
      <span>Discount</span>
      <span>-${formatPrice(order.discountInCents)}</span>
    </div>
    ` : ''}
    <div class="totals-row">
      <span>Shipping</span>
      <span>${order.shippingInCents === 0 ? 'FREE' : formatPrice(order.shippingInCents)}</span>
    </div>
    <div class="totals-row">
      <span>Tax</span>
      <span>${formatPrice(order.taxInCents)}</span>
    </div>
    <div class="totals-row total">
      <span>Total</span>
      <span>${formatPrice(order.totalInCents)}</span>
    </div>
  </div>

  <div class="checklist">
    <h4>Fulfillment Checklist</h4>
    ${items.map(item => `
    <div class="checklist-item">
      <div class="checkbox"></div>
      <span>${item.quantity}x ${item.productName}${item.variantName ? ` (${item.variantName})` : ''}</span>
    </div>
    `).join('')}
    <div class="checklist-item">
      <div class="checkbox"></div>
      <span>Include thank you card</span>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <span>Verify package weight</span>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your order!</p>
    <p>Questions? Contact us at ${companyInfo.email}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Default company info for OptiBio
 */
export const OPTIBIO_COMPANY_INFO = {
  name: 'OptiBio Supplements',
  address: '131 Heartland Blvd, Edgewood, NY 11717',
  phone: '(555) 123-4567', // TODO: Update with actual phone
  email: 'support@optibio.com',
  logo: undefined, // TODO: Add logo URL if available
};

/**
 * Generate packing slip for an order
 */
export function generatePackingSlip(order: Order, items: OrderItem[]): string {
  return generatePackingSlipHTML({
    order,
    items,
    companyInfo: OPTIBIO_COMPANY_INFO,
  });
}

export default {
  generatePackingSlip,
  generatePackingSlipHTML,
  OPTIBIO_COMPANY_INFO,
};
