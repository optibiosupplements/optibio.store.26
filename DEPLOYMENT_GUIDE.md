# OptiBio E-Commerce Deployment Guide

## 🚀 Quick Start: Publishing Your Website

Your OptiBio e-commerce website is **production-ready** and can be deployed immediately using Manus Built-in Hosting.

### Step 1: Create a Checkpoint (Required Before Publishing)

A checkpoint must be created before you can publish. This checkpoint will be used as the deployment version.

**To create a checkpoint:**
1. In the Manus interface, I will create a checkpoint for you
2. The checkpoint captures the current state of your website
3. Once created, the "Publish" button will be enabled

### Step 2: Publish via Manus UI

**After the checkpoint is created:**
1. Click the **"Publish"** button in the Management UI header (top-right)
2. Your website will be deployed to Manus hosting
3. You'll receive a public URL (e.g., `optibio.manus.space`)

### Step 3: Configure Custom Domain (Optional)

**To use your own domain (e.g., optibio.com):**
1. Navigate to **Settings → Domains** in the Management UI
2. Options available:
   - **Modify auto-generated domain**: Change the prefix (e.g., `optibio.manus.space`)
   - **Purchase new domain**: Buy a domain directly within Manus
   - **Bind existing domain**: Connect a domain you already own

**For existing domains:**
- Add the provided DNS records to your domain registrar
- Manus will handle SSL certificates automatically
- Changes typically propagate within 24-48 hours

---

## 🔐 Stripe Configuration

Your Stripe integration is **already configured** in test mode. Before accepting real payments, you must:

### Current Status
- ✅ Stripe test sandbox created
- ⚠️ **Action Required**: Claim your test sandbox before **Jan 10, 2026**
- 🔗 Claim URL: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1M0WlhESGVndkVlS1ZYLDE3NjM0NDA4MjEv1007pWaQbfw

### Switching to Live Mode

**Step 1: Claim Your Stripe Test Sandbox**
1. Visit the claim URL above
2. Complete the Stripe account setup
3. Verify your business information

**Step 2: Get Your Live API Keys**
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle from "Test mode" to "Live mode" (top-right)
3. Navigate to **Developers → API Keys**
4. Copy your **Live Secret Key** (starts with `sk_live_`)
5. Copy your **Live Publishable Key** (starts with `pk_live_`)

**Step 3: Update Secrets in Manus**
1. Go to **Management UI → Settings → Secrets**
2. Update these environment variables:
   - `STRIPE_SECRET_KEY` → Your live secret key
   - `VITE_STRIPE_PUBLISHABLE_KEY` → Your live publishable key
3. Save changes

**Step 4: Configure Webhook for Live Mode**
1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Update `STRIPE_WEBHOOK_SECRET` in Manus Secrets

**Step 5: Test Live Payment**
1. Make a small test purchase ($1-5) using a real credit card
2. Verify the order appears in your admin dashboard
3. Check that the payment shows in Stripe Dashboard
4. Confirm you receive the order confirmation email

---

## 📊 Analytics & Tracking

### Google Analytics 4 (GA4)

**Current Status**: GA4 tracking code is implemented but needs your Measurement ID.

**Setup Steps:**
1. Create a GA4 property at [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to **Management UI → Settings → Secrets**:
   - Key: `VITE_GA4_MEASUREMENT_ID`
   - Value: Your Measurement ID

**What's Tracked:**
- Page views (all pages)
- Add to cart events
- Checkout initiation
- Purchase completion
- CTA clicks (mid-page vs footer)
- Form submissions

### Facebook Pixel (Optional)

**Setup Steps:**
1. Create a Facebook Pixel in [Meta Events Manager](https://business.facebook.com/events_manager)
2. Get your Pixel ID (15-digit number)
3. Add to **Management UI → Settings → Secrets**:
   - Key: `VITE_FACEBOOK_PIXEL_ID`
   - Value: Your Pixel ID

**What's Tracked:**
- Page views
- Add to cart
- Initiate checkout
- Purchase events
- View content events

---

## 📧 Email Configuration

### Current Email System

**Built-in Notification System** (Currently Active):
- Uses Manus notification API
- Sends order confirmations to customers
- Sends admin notifications to project owner
- **Limitation**: Basic transactional emails only

### Recommended: Professional Email Service

For production, integrate a professional email service for:
- Branded email templates
- Abandoned cart recovery sequences
- Post-purchase follow-up campaigns
- Email list management

**Recommended Services:**
1. **SendGrid** (Free tier: 100 emails/day)
2. **Mailgun** (Free tier: 5,000 emails/month)
3. **Postmark** (Free tier: 100 emails/month)

**Integration Steps** (Example: SendGrid):
1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your sender domain
3. Create an API key
4. Add to Manus Secrets:
   - Key: `SENDGRID_API_KEY`
   - Value: Your API key
5. Update email templates in `/server/email/` directory

---

## 🛡️ Pre-Launch Checklist

### Essential Tasks

- [ ] **Claim Stripe test sandbox** (before Jan 10, 2026)
- [ ] **Test checkout flow** with Stripe test card (4242 4242 4242 4242)
- [ ] **Verify order confirmation emails** are sent
- [ ] **Check admin dashboard** shows orders correctly
- [ ] **Test on mobile devices** (60%+ of traffic will be mobile)
- [ ] **Add GA4 Measurement ID** for analytics tracking
- [ ] **Update countdown timer** target date (currently Jan 15, 2026)
- [ ] **Verify shipping date** messaging (currently Jan 20-27, 2026)
- [ ] **Set up custom domain** (optional but recommended)
- [ ] **Switch to Stripe live mode** (when ready for real payments)

### Content Review

- [ ] **Product descriptions** are accurate
- [ ] **Pricing** is correct ($49.99 with 46% discount)
- [ ] **Shipping policy** is clear
- [ ] **Return policy** (90-day guarantee) is accurate
- [ ] **Legal pages** (Privacy, Terms) are reviewed
- [ ] **Contact information** is correct
- [ ] **Social media links** are added (if applicable)

### Performance Optimization

- [ ] **Test page load speed** (target: <2 seconds)
- [ ] **Verify mobile responsiveness** on multiple devices
- [ ] **Check all images load** correctly
- [ ] **Test all navigation links** work
- [ ] **Verify forms submit** properly
- [ ] **Test cart functionality** (add, remove, update quantities)

---

## 🎯 Launch Day Checklist

### Morning of Launch (Before 9 AM)

1. **Final Stripe Check**
   - [ ] Confirm live mode is active
   - [ ] Test one live transaction
   - [ ] Verify webhook is receiving events

2. **Analytics Verification**
   - [ ] Confirm GA4 is tracking
   - [ ] Check Facebook Pixel (if using)
   - [ ] Test event tracking (add to cart, purchase)

3. **Email Testing**
   - [ ] Send test order confirmation
   - [ ] Verify admin notifications work
   - [ ] Check email deliverability

4. **Content Final Check**
   - [ ] Countdown timer is accurate
   - [ ] Shipping dates are correct
   - [ ] All CTAs work
   - [ ] Mobile view is perfect

### Launch Announcement

**Channels to Announce:**
- Email list (if you have one)
- Social media (Instagram, Facebook, Twitter)
- Friends & family
- Relevant online communities
- Paid ads (if budget allows)

**Sample Announcement Copy:**
```
🎉 PRE-ORDERS ARE LIVE! 🎉

OptiBio Ashwagandha KSM-66 is finally here.

✅ Clinically-proven stress relief
✅ Better sleep & sustained energy
✅ 90-day money-back guarantee

Pre-order now and save 46%: [your-domain.com]

Ships Jan 20-27. Pre-orders close Jan 15.

Limited quantities available.
```

---

## 📈 Post-Launch Monitoring

### Daily Tasks (First Week)

1. **Check Orders Dashboard**
   - Review new orders
   - Process payments
   - Respond to customer inquiries

2. **Monitor Analytics**
   - Traffic sources
   - Conversion rate (target: 4-6%)
   - Cart abandonment rate
   - Top-performing pages

3. **Customer Support**
   - Respond to emails within 2 hours
   - Address any technical issues
   - Collect testimonials from happy customers

### Weekly Tasks

1. **Review Metrics**
   - Total pre-orders (target: 250-500)
   - Revenue generated
   - Customer acquisition cost (CAC)
   - Average order value (AOV)

2. **Optimize Based on Data**
   - A/B test headlines
   - Adjust ad targeting
   - Improve low-performing pages
   - Add urgency indicators if needed

3. **Content Updates**
   - Add customer testimonials
   - Update stock levels
   - Adjust countdown timer
   - Post social proof (orders, reviews)

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Orders not appearing in dashboard**
- Check Stripe webhook is configured correctly
- Verify webhook secret matches in Manus Secrets
- Check server logs for errors

**Issue: Emails not sending**
- Verify SMTP credentials (if using external service)
- Check spam folder
- Confirm email templates are configured

**Issue: Payment failing**
- Ensure Stripe is in live mode (not test mode)
- Verify API keys are correct
- Check customer's card is valid

**Issue: Slow page load**
- Optimize images (use WebP format)
- Enable CDN (Manus handles this automatically)
- Minimize custom scripts

**Issue: Mobile layout broken**
- Test on multiple devices
- Check responsive breakpoints
- Verify images scale correctly

---

## 📞 Support Resources

### Manus Support
- Documentation: https://docs.manus.im
- Help Center: https://help.manus.im
- Community: https://community.manus.im

### Stripe Support
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

### General E-Commerce Resources
- Shopify Blog: https://www.shopify.com/blog
- ConversionXL: https://conversionxl.com
- Baymard Institute: https://baymard.com

---

## 🎊 Success Metrics

### Target Goals (January 2026)

**Pre-Orders**: 250-500 orders
**Revenue**: $12,500 - $25,000
**Conversion Rate**: 4-6%
**Customer Acquisition Cost**: $20-40
**Return on Ad Spend**: 2.5x+

### Key Performance Indicators (KPIs)

1. **Traffic**: 6,667-11,117 visitors needed
2. **Add to Cart Rate**: 15-20%
3. **Cart Abandonment Rate**: <70%
4. **Email Capture Rate**: 10-15%
5. **Customer Satisfaction**: 90%+ positive reviews

---

## 🚀 Next Steps After Launch

1. **Fulfill Pre-Orders** (Jan 20-27)
   - Process orders in admin dashboard
   - Update order status to "shipped"
   - Add tracking numbers
   - Send shipping confirmation emails

2. **Collect Testimonials**
   - Email customers 2 weeks after delivery
   - Ask for reviews
   - Offer incentive (10% off next order)
   - Add reviews to homepage

3. **Plan Next Product Launch**
   - Analyze what worked
   - Gather customer feedback
   - Expand product line
   - Build email list for next launch

---

## ✅ You're Ready to Launch!

Your OptiBio e-commerce website is production-ready with:
- ✅ Premium branding & design
- ✅ Complete product catalog
- ✅ Stripe payment integration
- ✅ Shopping cart & checkout
- ✅ Order management system
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Analytics tracking
- ✅ Mobile-responsive design
- ✅ Conversion optimization features

**Next immediate action**: Create a checkpoint and click "Publish" in the Manus UI.

Good luck with your launch! 🎉
