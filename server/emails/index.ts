/**
 * Email Templates - Midnight Sophistication Palette
 * Navy (#1E3A5F), Ivory (#F7F4EF), Gold (#C9A961)
 * 
 * All email templates are designed with:
 * - Mobile-responsive design
 * - High contrast for accessibility
 * - Consistent brand colors
 * - Clear CTAs
 */

export { generateOrderConfirmationEmail, type OrderConfirmationData } from './orderConfirmation';
export { generateShippingNotificationEmail, type ShippingNotificationData } from './shippingNotification';

/**
 * Usage Example:
 * 
 * ```typescript
 * import { generateOrderConfirmationEmail } from './server/emails';
 * 
 * const emailHtml = generateOrderConfirmationEmail({
 *   orderNumber: 'ORD-12345',
 *   customerName: 'John Doe',
 *   orderDate: '2025-01-15',
 *   items: [
 *     { name: 'OptiBio Ashwagandha KSM-66® (60 capsules)', quantity: 2, price: 5500 }
 *   ],
 *   subtotal: 11000,
 *   shipping: 0,
 *   tax: 880,
 *   total: 11880,
 *   shippingAddress: {
 *     street: '123 Main St',
 *     city: 'New York',
 *     state: 'NY',
 *     zip: '10001'
 *   }
 * });
 * 
 * // Send via your email service (Resend, SendGrid, etc.)
 * await sendEmail({
 *   to: 'customer@example.com',
 *   subject: 'Order Confirmation - OptiBio',
 *   html: emailHtml
 * });
 * ```
 */
