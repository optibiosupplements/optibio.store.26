# Stripe Production Setup Guide

## Overview
This guide walks you through configuring Stripe for production use with your OptiBio e-commerce store. Follow these steps carefully to ensure secure payment processing and subscription management.

---

## Prerequisites

- ✅ Stripe account created
- ✅ Business information verified
- ✅ Bank account connected for payouts
- ✅ Domain configured (optibiosupplements.com)
- ✅ SSL certificate active (handled by Manus)

---

## Step 1: Claim Your Stripe Sandbox

**IMPORTANT:** Your test sandbox expires on **January 10, 2026**

1. Visit: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1M0WlhESGVndkVlS1ZYLDE3NjM0NDA4MjEv1007pWaQbfw
2. Sign in or create a Stripe account
3. Complete business verification:
   - Business name: OptiBio
   - Business type: E-commerce
   - Product description: Dietary supplements
   - Website: optibiosupplements.com
4. Connect your bank account for payouts

---

## Step 2: Get Your API Keys

### Test Mode Keys (for development)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Live Mode Keys (for production)
1. Switch to Live mode in Stripe dashboard (toggle in top-right)
2. Go to: https://dashboard.stripe.com/apikeys
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Copy your **Secret key** (starts with `sk_live_`)

**⚠️ NEVER commit API keys to git or share them publicly!**

---

## Step 3: Configure Environment Variables

Your Manus project already has these environment variables configured for test mode. To switch to production:

1. Go to your Manus project Settings → Secrets
2. Update these variables with your **Live** API keys:

```
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
```

3. Keep `STRIPE_WEBHOOK_SECRET` empty for now (we'll set it in Step 5)

---

## Step 4: Create Products in Stripe

You need to create products and prices in Stripe that match your website products.

### Product 1: Ashwagandha KSM-66 (90 Capsules)

1. Go to: https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in:
   - **Name:** OptiBio Ashwagandha KSM-66 - 90 Capsules
   - **Description:** Premium full-spectrum Ashwagandha root extract with KSM-66®
   - **Image:** Upload product image
   - **Pricing:**
     - **One-time payment:** $49.99 USD
     - **Recurring payment:** $42.49 USD (monthly subscription, 15% off)

4. Click "Save product"
5. **Copy the Price IDs** (you'll need these):
   - One-time price ID: `price_xxx...`
   - Subscription price ID: `price_xxx...`

### Product 2: Ashwagandha KSM-66 (180 Capsules)

Repeat the same process:
- **Name:** OptiBio Ashwagandha KSM-66 - 180 Capsules
- **One-time:** $127.49 USD
- **Subscription:** $108.37 USD (monthly)

### Product 3: Ashwagandha KSM-66 (270 Capsules)

- **Name:** OptiBio Ashwagandha KSM-66 - 270 Capsules
- **One-time:** $187.49 USD
- **Subscription:** $159.37 USD (monthly)

---

## Step 5: Set Up Webhooks

Webhooks allow Stripe to notify your website when events occur (payments, subscription changes, etc.).

### Create Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://optibiosupplements.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click "Add endpoint"
6. **Copy the Signing secret** (starts with `whsec_`)

### Add Webhook Secret to Environment

1. Go to Manus project Settings → Secrets
2. Update:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

---

## Step 6: Configure Stripe Settings

### Customer Portal

The customer portal allows customers to manage their subscriptions and payment methods.

1. Go to: https://dashboard.stripe.com/settings/billing/portal
2. Enable the portal
3. Configure settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to pause subscriptions (optional)
   - ✅ Show subscription history
4. Set cancellation behavior:
   - **Cancel at period end** (recommended - customers keep access until billing period ends)
5. Save settings

### Email Receipts

1. Go to: https://dashboard.stripe.com/settings/emails
2. Enable:
   - ✅ Successful payments
   - ✅ Failed payments
   - ✅ Refunds
   - ✅ Subscription confirmations
3. Customize email branding:
   - Upload OptiBio logo
   - Set brand color: `#1E3A5F`
   - Add company address

### Tax Settings (if applicable)

1. Go to: https://dashboard.stripe.com/settings/tax
2. Enable Stripe Tax if you need automatic tax calculation
3. Configure tax rates for your jurisdiction

---

## Step 7: Test in Production

Before going live, test the complete flow in production mode:

### Test Checkout Flow

1. Add product to cart on your live site
2. Proceed to checkout
3. Use a **real credit card** (you'll be charged, but you can refund it)
4. Complete the purchase
5. Verify:
   - ✅ Payment appears in Stripe dashboard
   - ✅ Order created in your database
   - ✅ Customer receives email confirmation
   - ✅ Webhook events processed correctly

### Test Subscription Flow

1. Subscribe to a product
2. Verify subscription created in Stripe
3. Test subscription management:
   - Skip next delivery
   - Pause subscription
   - Resume subscription
   - Update payment method
   - Cancel subscription
4. Verify all actions work correctly

### Test Refunds

1. Go to Stripe dashboard → Payments
2. Find a test payment
3. Click "Refund"
4. Process full refund
5. Verify customer receives refund confirmation

---

## Step 8: Monitor and Maintain

### Daily Monitoring

Check Stripe dashboard daily for:
- Failed payments
- Disputed charges
- Subscription cancellations
- Revenue metrics

### Weekly Tasks

- Review subscription churn rate
- Check for payment failures
- Update product pricing if needed
- Review customer feedback

### Monthly Tasks

- Reconcile Stripe payouts with bank deposits
- Review and respond to disputes
- Analyze revenue trends
- Update tax settings if regulations change

---

## Security Best Practices

### API Key Security

- ✅ Never expose secret keys in client-side code
- ✅ Use environment variables for all keys
- ✅ Rotate keys if compromised
- ✅ Use separate keys for test and live modes

### Webhook Security

- ✅ Always verify webhook signatures
- ✅ Use HTTPS for webhook endpoints
- ✅ Implement idempotency to handle duplicate events
- ✅ Log all webhook events for debugging

### PCI Compliance

- ✅ Never store credit card numbers
- ✅ Use Stripe's hosted checkout or Elements
- ✅ Keep Stripe.js library up to date
- ✅ Review Stripe's security documentation annually

---

## Troubleshooting

### Payments Failing

**Symptom:** Customers report payment failures

**Solutions:**
1. Check Stripe dashboard for error messages
2. Verify API keys are correct
3. Check webhook endpoint is accessible
4. Review Stripe logs for detailed error info

### Webhooks Not Working

**Symptom:** Orders not created after payment

**Solutions:**
1. Verify webhook URL is correct: `https://optibiosupplements.com/api/webhooks/stripe`
2. Check webhook secret is set correctly
3. Review webhook logs in Stripe dashboard
4. Test webhook endpoint manually using Stripe CLI

### Subscription Issues

**Symptom:** Subscriptions not renewing

**Solutions:**
1. Check customer payment method is valid
2. Verify subscription is active in Stripe
3. Review failed payment emails
4. Check webhook events for subscription updates

---

## Support Resources

### Stripe Documentation
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Webhooks: https://stripe.com/docs/webhooks

### Stripe Support
- Email: support@stripe.com
- Chat: Available in dashboard (bottom-right)
- Phone: Available for verified accounts

### Manus Support
- Help Center: https://help.manus.im
- Submit ticket for technical issues

---

## Checklist: Pre-Launch

Before accepting real payments, verify:

- [ ] Stripe account fully verified
- [ ] Bank account connected for payouts
- [ ] Live API keys configured in Manus
- [ ] Products created in Stripe with correct pricing
- [ ] Webhook endpoint configured and tested
- [ ] Customer portal enabled
- [ ] Email receipts configured
- [ ] Test purchase completed successfully
- [ ] Test subscription created and managed
- [ ] Refund process tested
- [ ] SSL certificate active on domain
- [ ] Privacy policy and terms of service published
- [ ] Customer support email configured

---

## Checklist: Post-Launch

After going live:

- [ ] Monitor first 10 transactions closely
- [ ] Verify webhook events processing correctly
- [ ] Check email notifications are sending
- [ ] Test customer support flow
- [ ] Review Stripe dashboard daily for first week
- [ ] Set up fraud detection rules
- [ ] Configure payout schedule (daily/weekly/monthly)
- [ ] Enable Stripe Radar for fraud prevention

---

*This guide ensures your OptiBio store is configured correctly for secure, reliable payment processing with Stripe.*
