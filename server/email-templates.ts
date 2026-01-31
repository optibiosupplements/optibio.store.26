/**
 * Email templates for pre-sale campaign
 */

interface ReservationEmailData {
  name: string;
  email: string;
  tier: "founders" | "early_adopter" | "pre_launch";
  position: number;
  price: string;
}

export function getReservationConfirmationEmail(data: ReservationEmailData) {
  const tierNames = {
    founders: "Founder's Circle",
    early_adopter: "Early Believer",
    pre_launch: "Pre-Launch"
  };

  const tierName = tierNames[data.tier];
  const tierNumber = data.tier === "founders" ? `Founder #${data.position}` :
                     data.tier === "early_adopter" ? `Early Believer #${data.position}` :
                     `Pre-Launch #${data.position}`;

  const subject = `You're Reserved! ${tierNumber} - OptiBio`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🎉 You're Reserved!
              </h1>
              <p style="margin: 10px 0 0; color: #fbbf24; font-size: 20px; font-weight: 600;">
                ${tierNumber}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Hi ${data.name},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Welcome to the movement! You've successfully reserved your spot as <strong>${tierName}</strong> member.
              </p>

              <!-- Reservation Details Box -->
              <table role="presentation" style="width: 100%; background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; font-size: 18px; color: #1e293b;">Your Reservation Details</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Tier:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">${tierName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Position:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">#${data.position}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Price:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">$${data.price}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">${data.email}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Timeline -->
              <h3 style="margin: 30px 0 20px; font-size: 20px; color: #1e293b;">What Happens Next</h3>
              
              <table role="presentation" style="width: 100%;">
                <!-- Day 1-7 -->
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: start;">
                      <div style="min-width: 40px; height: 40px; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="color: #ffffff; font-weight: 700; font-size: 16px;">1</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 5px; font-size: 16px; color: #1e293b; font-weight: 600;">Days 1-7: Behind the Scenes</h4>
                        <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                          We'll share exclusive photos from our supplier visits, quality testing results, and manufacturing updates. You'll see exactly how OptiBio is made.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Day 15 -->
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: start;">
                      <div style="min-width: 40px; height: 40px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="color: #ffffff; font-weight: 700; font-size: 16px;">2</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 5px; font-size: 16px; color: #1e293b; font-weight: 600;">Day 15: Payment Opens</h4>
                        <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                          We'll send you an exclusive payment link to complete your order. Your spot is held for 48 hours. No payment required today—this is just your reservation.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Day 90 -->
                <tr>
                  <td style="padding: 15px 0;">
                    <div style="display: flex; align-items: start;">
                      <div style="min-width: 40px; height: 40px; background-color: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="color: #1e293b; font-weight: 700; font-size: 16px;">3</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 5px; font-size: 16px; color: #1e293b; font-weight: 600;">Day 90: Your Order Ships</h4>
                        <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                          Your OptiBio Ashwagandha KSM-66 ships directly to your door with tracking. You'll receive your lifetime discount code for all future orders.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Important Note -->
              <div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.5;">
                  <strong>📌 Important:</strong> No payment is required today. This is just your reservation. We'll email you on Day 15 with your exclusive payment link.
                </p>
              </div>

              <!-- CTA -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://optibio.manus.space" style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                Questions? Reply to this email or contact us at <a href="mailto:support@optibio.com" style="color: #1e40af; text-decoration: none;">support@optibio.com</a>
              </p>

              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                Welcome to the movement,<br>
                <strong style="color: #1e293b;">The OptiBio Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #94a3b8;">
                © 2025 OptiBio. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Premium Ashwagandha KSM-66 Supplements
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
You're Reserved! ${tierNumber} - OptiBio

Hi ${data.name},

Welcome to the movement! You've successfully reserved your spot as ${tierName} member.

YOUR RESERVATION DETAILS:
- Tier: ${tierName}
- Position: #${data.position}
- Price: $${data.price}
- Email: ${data.email}

WHAT HAPPENS NEXT:

Days 1-7: Behind the Scenes
We'll share exclusive photos from our supplier visits, quality testing results, and manufacturing updates. You'll see exactly how OptiBio is made.

Day 15: Payment Opens
We'll send you an exclusive payment link to complete your order. Your spot is held for 48 hours. No payment required today—this is just your reservation.

Day 90: Your Order Ships
Your OptiBio Ashwagandha KSM-66 ships directly to your door with tracking. You'll receive your lifetime discount code for all future orders.

IMPORTANT: No payment is required today. This is just your reservation. We'll email you on Day 15 with your exclusive payment link.

Questions? Reply to this email or contact us at support@optibio.com

Welcome to the movement,
The OptiBio Team

---
© 2025 OptiBio. All rights reserved.
Premium Ashwagandha KSM-66 Supplements
  `.trim();

  return {
    subject,
    html,
    text
  };
}


/**
 * Subscription welcome email template
 */
interface SubscriptionWelcomeData {
  name: string;
  email: string;
  founderTier: "founders" | "early_adopter" | "pre_launch" | "regular";
  lifetimeDiscountPercent: number;
  priceInCents: number;
  nextBillingDate: Date;
}

export function getSubscriptionWelcomeEmail(data: SubscriptionWelcomeData) {
  const tierNames = {
    founders: "Founder's Circle",
    early_adopter: "Early Believer",
    pre_launch: "Pre-Launch",
    regular: "Regular"
  };

  const tierName = tierNames[data.founderTier];
  const monthlyPrice = (data.priceInCents / 100).toFixed(2);
  const nextBilling = data.nextBillingDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const subject = `Welcome to OptiBio! Your ${tierName} Subscription is Active`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                🎉 Welcome to OptiBio!
              </h1>
              <p style="margin: 15px 0 0; color: #fbbf24; font-size: 20px; font-weight: 600;">
                Your ${tierName} Subscription is Active
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Hi ${data.name},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Thank you for subscribing to OptiBio! Your monthly wellness routine starts now. 🌿
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
                As a <strong>${tierName}</strong> member, you've locked in <strong>${data.lifetimeDiscountPercent}% off for life</strong>. This discount will apply to every future order automatically.
              </p>

              <!-- Subscription Details Box -->
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #0ea5e9;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px; font-size: 20px; color: #0c4a6e; text-align: center;">Your Subscription Details</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 10px 0; font-size: 15px; color: #0369a1;">Founder Tier:</td>
                        <td style="padding: 10px 0; font-size: 15px; color: #0c4a6e; font-weight: 700; text-align: right;">${tierName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-size: 15px; color: #0369a1;">Lifetime Discount:</td>
                        <td style="padding: 10px 0; font-size: 15px; color: #059669; font-weight: 700; text-align: right;">${data.lifetimeDiscountPercent}% OFF FOREVER</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-size: 15px; color: #0369a1;">Monthly Price:</td>
                        <td style="padding: 10px 0; font-size: 18px; color: #0c4a6e; font-weight: 700; text-align: right;">$${monthlyPrice}/month</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-size: 15px; color: #0369a1;">Next Billing Date:</td>
                        <td style="padding: 10px 0; font-size: 15px; color: #0c4a6e; font-weight: 700; text-align: right;">${nextBilling}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <h3 style="margin: 40px 0 20px; font-size: 22px; color: #1e293b; text-align: center;">What to Expect</h3>
              
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px; font-size: 16px; color: #1e293b; font-weight: 600;">📦 Monthly Deliveries</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                      Your OptiBio Ashwagandha KSM-66 will ship automatically every month. No need to reorder!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px; font-size: 16px; color: #1e293b; font-weight: 600;">💳 Automatic Billing</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                      Your card will be charged $${monthlyPrice} on ${nextBilling} and every month thereafter.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                    <h4 style="margin: 0 0 10px; font-size: 16px; color: #1e293b; font-weight: 600;">⚙️ Manage Anytime</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                      Pause, skip, or cancel your subscription anytime from your account dashboard.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin: 40px 0;">
                <tr>
                  <td align="center">
                    <a href="https://optibio.com/account/subscriptions" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                      Manage My Subscription
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <p style="margin: 40px 0 0; font-size: 14px; line-height: 1.6; color: #64748b; text-align: center;">
                Questions? We're here to help!<br>
                Email us at <a href="mailto:support@optibio.com" style="color: #2563eb; text-decoration: none;">support@optibio.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #64748b;">
                Thank you for choosing OptiBio
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} OptiBio. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Welcome to OptiBio!

Hi ${data.name},

Thank you for subscribing to OptiBio! Your monthly wellness routine starts now.

As a ${tierName} member, you've locked in ${data.lifetimeDiscountPercent}% off for life. This discount will apply to every future order automatically.

YOUR SUBSCRIPTION DETAILS:
- Founder Tier: ${tierName}
- Lifetime Discount: ${data.lifetimeDiscountPercent}% OFF FOREVER
- Monthly Price: $${monthlyPrice}/month
- Next Billing Date: ${nextBilling}

WHAT TO EXPECT:
📦 Monthly Deliveries - Your OptiBio Ashwagandha KSM-66 will ship automatically every month.
💳 Automatic Billing - Your card will be charged $${monthlyPrice} on ${nextBilling} and every month thereafter.
⚙️ Manage Anytime - Pause, skip, or cancel your subscription anytime from your account dashboard.

Manage your subscription: https://optibio.com/account/subscriptions

Questions? Email us at support@optibio.com

Thank you for choosing OptiBio!
© ${new Date().getFullYear()} OptiBio. All rights reserved.
  `;

  return { subject, html, text };
}
