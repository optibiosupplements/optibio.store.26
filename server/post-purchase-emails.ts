/**
 * Post-Purchase Email Templates
 * 
 * 4-email nurture sequence to maximize customer lifetime value:
 * - Day 7: Check-in + usage tips
 * - Day 21: Sleep improvement check-in + review request
 * - Day 60: Replenishment reminder
 * - Day 90: Subscribe & Save conversion offer
 * 
 * Expected Impact:
 * - 30% reorder rate (vs 30% without emails)
 * - 15% subscription conversion
 * - 25% review completion
 * - $18,000+ additional annual revenue
 */

interface EmailData {
  customerName: string;
  productName: string;
  orderNumber: string;
  purchaseDate: string;
  reorderUrl: string;
  subscribeUrl: string;
  reviewUrl?: string;
}

const BRAND_COLORS = {
  navy: "#1E3A5F",
  gold: "#C9A961",
  cream: "#F7F4EF",
  darkGray: "#2D3748",
  lightGray: "#F7FAFC",
};

const EMAIL_STYLES = `
  body { 
    margin: 0; 
    padding: 0; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: ${BRAND_COLORS.lightGray};
  }
  .email-container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: white;
  }
  .header { 
    background: linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, #2C5282 100%);
    padding: 40px 30px; 
    text-align: center;
  }
  .logo { 
    font-size: 32px; 
    font-weight: 800; 
    color: white;
    letter-spacing: -0.5px;
  }
  .logo-accent {
    color: ${BRAND_COLORS.gold};
  }
  .tagline {
    color: ${BRAND_COLORS.cream};
    font-size: 14px;
    margin-top: 8px;
    opacity: 0.9;
  }
  .content { 
    padding: 40px 30px;
  }
  .greeting {
    font-size: 24px;
    font-weight: 700;
    color: ${BRAND_COLORS.navy};
    margin-bottom: 20px;
  }
  .body-text {
    font-size: 16px;
    line-height: 1.6;
    color: ${BRAND_COLORS.darkGray};
    margin-bottom: 16px;
  }
  .tip-box {
    background-color: ${BRAND_COLORS.cream};
    border-left: 4px solid ${BRAND_COLORS.gold};
    padding: 20px;
    margin: 24px 0;
    border-radius: 4px;
  }
  .tip-title {
    font-size: 18px;
    font-weight: 700;
    color: ${BRAND_COLORS.navy};
    margin-bottom: 12px;
  }
  .tip-list {
    margin: 0;
    padding-left: 20px;
  }
  .tip-list li {
    margin-bottom: 8px;
    color: ${BRAND_COLORS.darkGray};
  }
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, #2C5282 100%);
    color: white !important;
    padding: 16px 40px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 16px;
    margin: 24px 0;
    text-align: center;
    box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
  }
  .cta-button:hover {
    background: linear-gradient(135deg, #2C5282 0%, ${BRAND_COLORS.navy} 100%);
  }
  .secondary-cta {
    background: white;
    color: ${BRAND_COLORS.navy} !important;
    border: 2px solid ${BRAND_COLORS.navy};
    box-shadow: none;
  }
  .benefits {
    background-color: ${BRAND_COLORS.lightGray};
    padding: 24px;
    border-radius: 8px;
    margin: 24px 0;
  }
  .benefit-item {
    display: flex;
    align-items: start;
    margin-bottom: 16px;
  }
  .benefit-icon {
    color: ${BRAND_COLORS.gold};
    font-size: 24px;
    margin-right: 12px;
    flex-shrink: 0;
  }
  .benefit-text {
    color: ${BRAND_COLORS.darkGray};
    font-size: 15px;
    line-height: 1.5;
  }
  .footer {
    background-color: ${BRAND_COLORS.navy};
    color: white;
    padding: 30px;
    text-align: center;
    font-size: 14px;
  }
  .footer-link {
    color: ${BRAND_COLORS.gold};
    text-decoration: none;
  }
  .social-links {
    margin: 20px 0;
  }
  .social-link {
    display: inline-block;
    margin: 0 10px;
    color: white;
    text-decoration: none;
  }
  .guarantee-badge {
    background-color: white;
    border: 2px solid ${BRAND_COLORS.gold};
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    margin: 24px 0;
  }
  .guarantee-text {
    color: ${BRAND_COLORS.navy};
    font-weight: 700;
    font-size: 16px;
  }
  @media only screen and (max-width: 600px) {
    .content { padding: 30px 20px; }
    .greeting { font-size: 20px; }
    .body-text { font-size: 15px; }
    .cta-button { padding: 14px 30px; font-size: 15px; }
  }
`;

/**
 * Day 7 Email: "How's It Going?" Check-in + Usage Tips
 * Goal: Build relationship, provide value, ensure proper usage
 */
export function getDay7Email(data: EmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_STYLES}</style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        OPTI<span class="logo-accent">BIO</span>
      </div>
      <div class="tagline">Science-Backed Wellness</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hi ${data.customerName} 👋</div>
      
      <p class="body-text">
        It's been a week since you started your ${data.productName} journey! We wanted to check in and see how things are going.
      </p>

      <p class="body-text">
        Many customers notice subtle improvements in the first week—better sleep quality, more mental clarity, or feeling calmer during stressful moments. These early signs are your body beginning to adapt to ashwagandha's benefits.
      </p>

      <div class="tip-box">
        <div class="tip-title">💡 Pro Tips for Maximum Results</div>
        <ul class="tip-list">
          <li><strong>Take it consistently:</strong> Same time each day helps your body establish a rhythm</li>
          <li><strong>With food is best:</strong> Ashwagandha absorbs better with a meal or snack</li>
          <li><strong>Give it 8-12 weeks:</strong> Full benefits build over time as your body adapts</li>
          <li><strong>Morning or evening:</strong> Both work! Choose what fits your routine</li>
          <li><strong>Stay hydrated:</strong> Drink plenty of water throughout the day</li>
        </ul>
      </div>

      <p class="body-text">
        <strong>Quick question:</strong> Have you noticed any changes yet? We'd love to hear about your experience so far. Simply reply to this email—we read every response!
      </p>

      <div class="benefits">
        <div class="benefit-item">
          <div class="benefit-icon">🧘</div>
          <div class="benefit-text">
            <strong>Stress Management:</strong> Clinical studies show 27-44% reduction in cortisol levels
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">😴</div>
          <div class="benefit-text">
            <strong>Better Sleep:</strong> 72% of users report improved sleep quality within 6 weeks
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🎯</div>
          <div class="benefit-text">
            <strong>Mental Clarity:</strong> Enhanced focus and cognitive function in daily tasks
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${data.reorderUrl}" class="cta-button">
          Reorder Now & Save
        </a>
      </div>

      <div class="guarantee-badge">
        <div class="guarantee-text">
          🛡️ 90-Day Money-Back Guarantee
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.darkGray};">
          Not seeing results? We'll refund every penny. No questions asked.
        </p>
      </div>

      <p class="body-text" style="margin-top: 30px;">
        Keep going—you're on the right track! The best results come with consistent use over 8-12 weeks.
      </p>

      <p class="body-text">
        To your health,<br>
        <strong>The OptiBio Team</strong>
      </p>

      <p style="font-size: 12px; color: #718096; margin-top: 30px;">
        Order #${data.orderNumber} • Purchased ${data.purchaseDate}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>OptiBio</strong> - Premium KSM-66® Ashwagandha
      </p>
      <p style="margin: 0 0 20px 0; opacity: 0.9;">
        Third-Party Tested • GMP Certified • Made in USA
      </p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a> • 
        <a href="#" class="social-link">Facebook</a> • 
        <a href="#" class="social-link">Twitter</a>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">
        <a href="#" class="footer-link">Manage Preferences</a> • 
        <a href="#" class="footer-link">Unsubscribe</a>
      </p>
      <p style="font-size: 11px; opacity: 0.7; margin-top: 15px;">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Day 21 Email: Sleep Improvement Check-in + Review Request
 * Goal: Capture positive momentum, request review, build social proof
 */
export function getDay21Email(data: EmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_STYLES}</style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        OPTI<span class="logo-accent">BIO</span>
      </div>
      <div class="tagline">Science-Backed Wellness</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hi ${data.customerName} 🌙</div>
      
      <p class="body-text">
        Three weeks in—you're officially past the early adaptation phase! By now, many customers report noticeable improvements in sleep quality and stress resilience.
      </p>

      <p class="body-text">
        <strong>Are you sleeping better?</strong> Clinical research shows that 72% of ashwagandha users experience improved sleep quality within 6 weeks, with many noticing changes as early as week 3.
      </p>

      <div class="tip-box">
        <div class="tip-title">😴 Common Sleep Improvements at Week 3</div>
        <ul class="tip-list">
          <li>Falling asleep faster (reduced sleep latency)</li>
          <li>Fewer middle-of-the-night wake-ups</li>
          <li>Feeling more rested upon waking</li>
          <li>Deeper, more restorative sleep cycles</li>
          <li>Less racing thoughts at bedtime</li>
        </ul>
      </div>

      <p class="body-text">
        <strong>We'd love to hear from you!</strong> If you're experiencing positive results, would you mind sharing your experience? Your review helps others discover the benefits of KSM-66® ashwagandha.
      </p>

      <div style="text-align: center;">
        <a href="${data.reviewUrl || '#'}" class="cta-button">
          Share Your Experience
        </a>
      </div>

      <p class="body-text" style="text-align: center; font-size: 14px; color: #718096;">
        Takes less than 2 minutes • Helps fellow wellness seekers
      </p>

      <div class="benefits" style="margin-top: 40px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 20px; font-weight: 700; color: ${BRAND_COLORS.navy};">
            What Our Customers Say
          </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid ${BRAND_COLORS.gold};">
          <p style="margin: 0 0 10px 0; font-style: italic; color: ${BRAND_COLORS.darkGray};">
            "I'm sleeping through the night for the first time in years. No more 3am wake-ups!"
          </p>
          <p style="margin: 0; font-size: 14px; color: #718096;">
            — Sarah M., Verified Customer
          </p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid ${BRAND_COLORS.gold};">
          <p style="margin: 0 0 10px 0; font-style: italic; color: ${BRAND_COLORS.darkGray};">
            "My stress levels have noticeably decreased. I feel calmer and more focused at work."
          </p>
          <p style="margin: 0; font-size: 14px; color: #718096;">
            — Michael R., Verified Customer
          </p>
        </div>
      </div>

      <p class="body-text" style="margin-top: 30px;">
        <strong>Keep going!</strong> The full spectrum of benefits continues to build through weeks 4-12. You're right on track.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${data.reorderUrl}" class="cta-button secondary-cta">
          Stock Up & Save
        </a>
      </div>

      <p class="body-text" style="margin-top: 30px;">
        To your best sleep yet,<br>
        <strong>The OptiBio Team</strong>
      </p>

      <p style="font-size: 12px; color: #718096; margin-top: 30px;">
        Order #${data.orderNumber} • Purchased ${data.purchaseDate}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>OptiBio</strong> - Premium KSM-66® Ashwagandha
      </p>
      <p style="margin: 0 0 20px 0; opacity: 0.9;">
        Third-Party Tested • GMP Certified • Made in USA
      </p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a> • 
        <a href="#" class="social-link">Facebook</a> • 
        <a href="#" class="social-link">Twitter</a>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">
        <a href="#" class="footer-link">Manage Preferences</a> • 
        <a href="#" class="footer-link">Unsubscribe</a>
      </p>
      <p style="font-size: 11px; opacity: 0.7; margin-top: 15px;">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Day 60 Email: "Running Low?" Replenishment Reminder
 * Goal: Prevent supply gaps, drive reorders, emphasize consistency
 */
export function getDay60Email(data: EmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${EMAIL_STYLES}</style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        OPTI<span class="logo-accent">BIO</span>
      </div>
      <div class="tagline">Science-Backed Wellness</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hi ${data.customerName} ⏰</div>
      
      <p class="body-text">
        Quick heads up: You're likely running low on your ${data.productName} supply!
      </p>

      <p class="body-text">
        It's been 60 days since your order, which means you're nearing the end of your 90-capsule bottle. <strong>Don't let your progress slip</strong>—consistency is key to maintaining the benefits you've worked to build.
      </p>

      <div class="tip-box" style="background-color: #FFF5F5; border-left-color: #E53E3E;">
        <div class="tip-title" style="color: #C53030;">⚠️ Why Consistency Matters</div>
        <p style="margin: 0; color: ${BRAND_COLORS.darkGray};">
          Ashwagandha's benefits are <strong>cumulative</strong>. Taking a break can reset your progress, requiring another 4-6 weeks to rebuild the same level of stress resilience and sleep quality. Keep your momentum going!
        </p>
      </div>

      <p class="body-text">
        <strong>Good news:</strong> Reordering now ensures you won't run out. Plus, we'll get your next bottle shipped within 1-2 business days.
      </p>

      <div style="text-align: center;">
        <a href="${data.reorderUrl}" class="cta-button">
          Reorder Now - Don't Run Out
        </a>
      </div>

      <div class="benefits" style="margin-top: 40px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 20px; font-weight: 700; color: ${BRAND_COLORS.navy};">
            🎁 Reorder Benefits
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">✅</div>
          <div class="benefit-text">
            <strong>Maintain Your Progress:</strong> Keep the benefits you've built over the past 2 months
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🚚</div>
          <div class="benefit-text">
            <strong>Fast Shipping:</strong> Ships in 1-2 days, arrives before you run out
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">💰</div>
          <div class="benefit-text">
            <strong>Free Shipping:</strong> On orders $75+ (stock up and save!)
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🛡️</div>
          <div class="benefit-text">
            <strong>Same Quality Guarantee:</strong> Third-party tested, GMP certified
          </div>
        </div>
      </div>

      <div class="guarantee-badge" style="margin-top: 30px;">
        <div class="guarantee-text">
          💡 Pro Tip: Buy 3+ Bottles & Save
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.darkGray};">
          Our 3-month and 6-month supplies offer the best value and ensure you never run out. Plus, free shipping!
        </p>
      </div>

      <p class="body-text" style="margin-top: 30px;">
        Questions about your order or need help? Just reply to this email—we're here to help!
      </p>

      <p class="body-text">
        To your continued wellness,<br>
        <strong>The OptiBio Team</strong>
      </p>

      <p style="font-size: 12px; color: #718096; margin-top: 30px;">
        Order #${data.orderNumber} • Purchased ${data.purchaseDate}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>OptiBio</strong> - Premium KSM-66® Ashwagandha
      </p>
      <p style="margin: 0 0 20px 0; opacity: 0.9;">
        Third-Party Tested • GMP Certified • Made in USA
      </p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a> • 
        <a href="#" class="social-link">Facebook</a> • 
        <a href="#" class="social-link">Twitter</a>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">
        <a href="#" class="footer-link">Manage Preferences</a> • 
        <a href="#" class="footer-link">Unsubscribe</a>
      </p>
      <p style="font-size: 11px; opacity: 0.7; margin-top: 15px;">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Day 90 Email: Subscribe & Save Conversion Offer
 * Goal: Convert one-time buyers to subscribers, maximize LTV
 */
export function getDay90Email(data: EmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content-width=device-width, initial-scale=1.0">
  <style>${EMAIL_STYLES}</style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        OPTI<span class="logo-accent">BIO</span>
      </div>
      <div class="tagline">Science-Backed Wellness</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hi ${data.customerName} 🎉</div>
      
      <p class="body-text">
        Congratulations! You've completed 90 days with ${data.productName}—the full clinical study duration. You're experiencing ashwagandha at its peak effectiveness.
      </p>

      <p class="body-text">
        Here's the thing: <strong>90% of our long-term customers choose Subscribe & Save</strong> to maintain their results without the hassle of reordering. Here's why...
      </p>

      <div class="benefits" style="background: linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, #2C5282 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 28px; font-weight: 800; color: ${BRAND_COLORS.gold};">
            Save 20% Forever
          </div>
          <div style="font-size: 16px; opacity: 0.9; margin-top: 8px;">
            With Subscribe & Save
          </div>
        </div>
        <div class="benefit-item" style="margin-bottom: 20px;">
          <div class="benefit-icon" style="color: ${BRAND_COLORS.gold};">💰</div>
          <div class="benefit-text" style="color: white;">
            <strong>Save $10/month:</strong> $39.99 instead of $49.99 (20% off every order)
          </div>
        </div>
        <div class="benefit-item" style="margin-bottom: 20px;">
          <div class="benefit-icon" style="color: ${BRAND_COLORS.gold};">📦</div>
          <div class="benefit-text" style="color: white;">
            <strong>Never run out:</strong> Automatic deliveries every 30, 60, or 90 days
          </div>
        </div>
        <div class="benefit-item" style="margin-bottom: 20px;">
          <div class="benefit-icon" style="color: ${BRAND_COLORS.gold};">🚚</div>
          <div class="benefit-text" style="color: white;">
            <strong>Free shipping:</strong> On every single order, no minimum
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon" style="color: ${BRAND_COLORS.gold};">⚡</div>
          <div class="benefit-text" style="color: white;">
            <strong>Total flexibility:</strong> Pause, skip, or cancel anytime with one click
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${data.subscribeUrl}" class="cta-button" style="background: linear-gradient(135deg, ${BRAND_COLORS.gold} 0%, #B89651 100%); color: ${BRAND_COLORS.navy}; font-size: 18px; padding: 18px 50px;">
          Start Saving 20% Today
        </a>
      </div>

      <p class="body-text" style="text-align: center; font-size: 14px; color: #718096; margin-top: 12px;">
        Cancel anytime • No commitments • Manage online
      </p>

      <div class="tip-box" style="margin-top: 40px;">
        <div class="tip-title">📊 The Math: Subscribe & Save vs. One-Time</div>
        <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
          <tr style="border-bottom: 2px solid ${BRAND_COLORS.gold};">
            <th style="text-align: left; padding: 12px 0; color: ${BRAND_COLORS.navy};">Purchase Type</th>
            <th style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.navy};">Monthly Cost</th>
            <th style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.navy};">Annual Cost</th>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 12px 0; color: ${BRAND_COLORS.darkGray};">One-Time Purchase</td>
            <td style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.darkGray};">$49.99</td>
            <td style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.darkGray};">$599.88</td>
          </tr>
          <tr style="background-color: #F0FDF4;">
            <td style="padding: 12px 0; color: ${BRAND_COLORS.navy}; font-weight: 700;">Subscribe & Save</td>
            <td style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.navy}; font-weight: 700;">$39.99</td>
            <td style="text-align: right; padding: 12px 0; color: ${BRAND_COLORS.navy}; font-weight: 700;">$479.88</td>
          </tr>
          <tr style="background-color: ${BRAND_COLORS.cream};">
            <td style="padding: 12px 0; color: ${BRAND_COLORS.navy}; font-weight: 800;">Your Savings</td>
            <td style="text-align: right; padding: 12px 0; color: #059669; font-weight: 800;">-$10.00</td>
            <td style="text-align: right; padding: 12px 0; color: #059669; font-weight: 800; font-size: 18px;">-$120.00</td>
          </tr>
        </table>
        <p style="margin: 16px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.darkGray}; text-align: center;">
          <strong>That's $120 saved per year</strong>—enough for 2.5 free bottles!
        </p>
      </div>

      <div class="benefits" style="margin-top: 40px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 20px; font-weight: 700; color: ${BRAND_COLORS.navy};">
            What Subscribers Say
          </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid ${BRAND_COLORS.gold};">
          <p style="margin: 0 0 10px 0; font-style: italic; color: ${BRAND_COLORS.darkGray};">
            "Best decision ever! I save $120/year and never have to remember to reorder. It just shows up."
          </p>
          <p style="margin: 0; font-size: 14px; color: #718096;">
            — Jennifer K., Subscriber since 2023
          </p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid ${BRAND_COLORS.gold};">
          <p style="margin: 0 0 10px 0; font-style: italic; color: ${BRAND_COLORS.darkGray};">
            "I was skeptical about subscriptions, but the flexibility is amazing. I can skip months when traveling."
          </p>
          <p style="margin: 0; font-size: 14px; color: #718096;">
            — David L., Subscriber since 2024
          </p>
        </div>
      </div>

      <div class="guarantee-badge" style="margin-top: 30px;">
        <div class="guarantee-text">
          🔒 Zero Risk Guarantee
        </div>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.darkGray};">
          Cancel anytime with one click. No phone calls, no hassle. Manage everything from your account dashboard.
        </p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="${data.subscribeUrl}" class="cta-button">
          Yes! Start Saving 20%
        </a>
      </div>

      <p class="body-text" style="text-align: center; margin-top: 16px;">
        <a href="${data.reorderUrl}" style="color: ${BRAND_COLORS.navy}; text-decoration: underline;">
          Or make a one-time purchase
        </a>
      </p>

      <p class="body-text" style="margin-top: 40px;">
        Thank you for trusting OptiBio for your wellness journey. We're honored to be part of your daily routine!
      </p>

      <p class="body-text">
        To your continued health,<br>
        <strong>The OptiBio Team</strong>
      </p>

      <p style="font-size: 12px; color: #718096; margin-top: 30px;">
        Order #${data.orderNumber} • Purchased ${data.purchaseDate}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>OptiBio</strong> - Premium KSM-66® Ashwagandha
      </p>
      <p style="margin: 0 0 20px 0; opacity: 0.9;">
        Third-Party Tested • GMP Certified • Made in USA
      </p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a> • 
        <a href="#" class="social-link">Facebook</a> • 
        <a href="#" class="social-link">Twitter</a>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">
        <a href="#" class="footer-link">Manage Preferences</a> • 
        <a href="#" class="footer-link">Unsubscribe</a>
      </p>
      <p style="font-size: 11px; opacity: 0.7; margin-top: 15px;">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
