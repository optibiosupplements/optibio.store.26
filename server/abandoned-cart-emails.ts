/**
 * Abandoned Cart Email Templates
 * 3-email sequence to recover abandoned carts
 */

export interface CartItem {
  productName: string;
  variantName?: string;
  quantity: number;
  priceInCents: number;
  imageUrl?: string;
}

export interface AbandonedCartEmailData {
  customerName?: string;
  email: string;
  cartItems: CartItem[];
  totalValue: number;
  recoveryLink: string;
  discountCode?: string;
  discountPercent?: number;
}

/**
 * Email 1: Sent 1 hour after abandonment
 * Gentle reminder with cart contents
 */
export function getFirstAbandonedCartEmail(data: AbandonedCartEmailData): string {
  const { customerName, cartItems, totalValue, recoveryLink } = data;
  const greeting = customerName ? `Hi ${customerName}` : "Hi there";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Left Something Behind</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F7F4EF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EF; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #C9A961; font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">You Left Something Behind</h1>
              <p style="color: #F7F4EF; font-size: 16px; margin: 0;">Your wellness journey is waiting</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${greeting},</p>
              
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We noticed you left some items in your cart. We've saved them for you!
              </p>

              <!-- Cart Items -->
              <div style="background-color: #F7F4EF; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1E3A5F; font-size: 18px; margin: 0 0 20px 0;">Your Cart:</h3>
                ${cartItems.map(item => `
                  <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #EDE9E3;">
                    <div style="flex: 1;">
                      <p style="color: #2D2D2D; font-size: 16px; font-weight: 600; margin: 0 0 5px 0;">${item.productName}</p>
                      ${item.variantName ? `<p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">${item.variantName}</p>` : ''}
                      <p style="color: #666; font-size: 14px; margin: 0;">Quantity: ${item.quantity}</p>
                    </div>
                    <div style="text-align: right;">
                      <p style="color: #C9A961; font-size: 18px; font-weight: 700; margin: 0;">$${(item.priceInCents * item.quantity / 100).toFixed(2)}</p>
                    </div>
                  </div>
                `).join('')}
                
                <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #1E3A5F;">
                  <p style="color: #1E3A5F; font-size: 20px; font-weight: 700; margin: 0;">Total: $${(totalValue / 100).toFixed(2)}</p>
                </div>
              </div>

              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Complete your order now and start your journey to better sleep, reduced stress, and improved focus.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #C9A961 0%, #B89651 100%); color: #2D2D2D; font-size: 18px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(201, 169, 97, 0.3);">
                  Complete My Order
                </a>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                Questions? Reply to this email or visit our <a href="https://optibiosupplements.com/faq" style="color: #C9A961; text-decoration: none;">FAQ page</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1E3A5F; padding: 30px; text-align: center;">
              <p style="color: #F7F4EF; font-size: 14px; margin: 0 0 10px 0;">
                <strong>OptiBio</strong> - Science-Backed Wellness
              </p>
              <p style="color: #C9A961; font-size: 12px; margin: 0;">
                90-Day Money-Back Guarantee • Free Shipping Over $75 • Third-Party Tested
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Email 2: Sent 24 hours after abandonment
 * Includes 5% discount incentive
 */
export function getSecondAbandonedCartEmail(data: AbandonedCartEmailData): string {
  const { customerName, cartItems, totalValue, recoveryLink, discountCode, discountPercent } = data;
  const greeting = customerName ? `Hi ${customerName}` : "Hi there";
  const discount = discountPercent || 5;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special ${discount}% Discount Inside</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F7F4EF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EF; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #C9A961 0%, #B89651 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #1E3A5F; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">${discount}% Off Your Order</h1>
              <p style="color: #2D2D2D; font-size: 18px; margin: 0; font-weight: 600;">Exclusive offer just for you</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${greeting},</p>
              
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We really want you to experience the life-changing benefits of OptiBio Ashwagandha KSM-66®.
              </p>

              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                So here's a special <strong style="color: #C9A961;">${discount}% discount</strong> on your order — just for you.
              </p>

              <!-- Discount Code Box -->
              <div style="background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: #F7F4EF; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Discount Code</p>
                <p style="color: #C9A961; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">${discountCode}</p>
                <p style="color: #F7F4EF; font-size: 14px; margin: 0;">Automatically applied at checkout</p>
              </div>

              <!-- Cart Items -->
              <div style="background-color: #F7F4EF; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1E3A5F; font-size: 18px; margin: 0 0 20px 0;">Your Saved Cart:</h3>
                ${cartItems.map(item => `
                  <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #EDE9E3;">
                    <p style="color: #2D2D2D; font-size: 16px; font-weight: 600; margin: 0 0 5px 0;">${item.productName}</p>
                    ${item.variantName ? `<p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">${item.variantName}</p>` : ''}
                    <p style="color: #666; font-size: 14px; margin: 0;">Quantity: ${item.quantity} × $${(item.priceInCents / 100).toFixed(2)}</p>
                  </div>
                `).join('')}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #1E3A5F;">
                  <p style="color: #666; font-size: 16px; margin: 0 0 5px 0; text-decoration: line-through;">Original: $${(totalValue / 100).toFixed(2)}</p>
                  <p style="color: #C9A961; font-size: 24px; font-weight: 700; margin: 0;">With ${discount}% Off: $${((totalValue * (100 - discount)) / 10000).toFixed(2)}</p>
                  <p style="color: #1E3A5F; font-size: 14px; margin: 10px 0 0 0; font-weight: 600;">You Save: $${((totalValue * discount) / 10000).toFixed(2)}</p>
                </div>
              </div>

              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                <strong>Why OptiBio?</strong><br>
                ✓ 20+ clinical studies backing KSM-66®<br>
                ✓ Third-party tested for purity & potency<br>
                ✓ 90-day money-back guarantee<br>
                ✓ Free shipping on orders over $75
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #C9A961 0%, #B89651 100%); color: #2D2D2D; font-size: 18px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(201, 169, 97, 0.3);">
                  Claim My ${discount}% Discount
                </a>
              </div>

              <p style="color: #D4745F; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center; font-weight: 600;">
                ⏰ This offer expires in 24 hours
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1E3A5F; padding: 30px; text-align: center;">
              <p style="color: #F7F4EF; font-size: 14px; margin: 0 0 10px 0;">
                <strong>OptiBio</strong> - Science-Backed Wellness
              </p>
              <p style="color: #C9A961; font-size: 12px; margin: 0;">
                Questions? Email us at support@optibio.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Email 3: Sent 48 hours after abandonment
 * Final reminder with urgency
 */
export function getThirdAbandonedCartEmail(data: AbandonedCartEmailData): string {
  const { customerName, cartItems, totalValue, recoveryLink, discountCode, discountPercent } = data;
  const greeting = customerName ? `Hi ${customerName}` : "Hi there";
  const discount = discountPercent || 5;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last Chance - Your Cart Expires Soon</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F7F4EF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EF; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4745F 0%, #C96850 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">⏰ Last Chance</h1>
              <p style="color: #FFFFFF; font-size: 16px; margin: 0;">Your cart and ${discount}% discount expire soon</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${greeting},</p>
              
              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                This is your <strong>final reminder</strong> — your saved cart and exclusive ${discount}% discount will expire in a few hours.
              </p>

              <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Don't miss out on starting your wellness journey with OptiBio Ashwagandha KSM-66®.
              </p>

              <!-- Urgency Box -->
              <div style="background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; border: 3px solid #D4745F;">
                <p style="color: #D4745F; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">⚠️ Expiring Soon</p>
                <p style="color: #C9A961; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">${discountCode}</p>
                <p style="color: #F7F4EF; font-size: 14px; margin: 0;">${discount}% off your order</p>
              </div>

              <!-- Quick Cart Summary -->
              <div style="background-color: #F7F4EF; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1E3A5F; font-size: 18px; margin: 0 0 15px 0;">Your Cart (${cartItems.length} item${cartItems.length > 1 ? 's' : ''}):</h3>
                ${cartItems.map(item => `
                  <p style="color: #2D2D2D; font-size: 14px; margin: 0 0 10px 0;">
                    <strong>${item.productName}</strong> ${item.variantName ? `- ${item.variantName}` : ''} (×${item.quantity})
                  </p>
                `).join('')}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #1E3A5F; text-align: right;">
                  <p style="color: #666; font-size: 14px; margin: 0 0 5px 0; text-decoration: line-through;">$${(totalValue / 100).toFixed(2)}</p>
                  <p style="color: #C9A961; font-size: 24px; font-weight: 700; margin: 0;">$${((totalValue * (100 - discount)) / 10000).toFixed(2)}</p>
                </div>
              </div>

              <!-- Benefits Reminder -->
              <div style="background-color: #F7F4EF; border-left: 4px solid #C9A961; padding: 20px; margin: 30px 0;">
                <p style="color: #1E3A5F; font-size: 16px; font-weight: 700; margin: 0 0 15px 0;">What You're Missing:</p>
                <p style="color: #2D2D2D; font-size: 14px; line-height: 1.8; margin: 0;">
                  ✓ Reduced stress & anxiety (44% improvement in studies)<br>
                  ✓ Better sleep quality (72% improvement)<br>
                  ✓ Improved focus & mental clarity<br>
                  ✓ Natural energy without crashes<br>
                  ✓ 90-day money-back guarantee
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #C9A961 0%, #B89651 100%); color: #2D2D2D; font-size: 18px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(201, 169, 97, 0.3);">
                  Complete My Order Now
                </a>
              </div>

              <p style="color: #D4745F; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center; font-weight: 700;">
                ⏰ Cart expires in a few hours • Discount code will be deactivated
              </p>

              <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                If you've already completed your order, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1E3A5F; padding: 30px; text-align: center;">
              <p style="color: #F7F4EF; font-size: 14px; margin: 0 0 10px 0;">
                <strong>OptiBio</strong> - Science-Backed Wellness
              </p>
              <p style="color: #C9A961; font-size: 12px; margin: 0;">
                Need help? Email support@optibio.com or visit our FAQ page
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
