# OptiBio Subscription Testing Guide

**Complete end-to-end testing procedures for subscription purchase flow, founder tier assignment, and webhook verification**

---

## 🎯 Testing Objectives

1. ✅ Verify subscription checkout works with Stripe Elements
2. ✅ Confirm founder tier assignment based on cart total
3. ✅ Test webhook handlers create orders on renewals
4. ✅ Validate welcome email delivery
5. ✅ Test subscription management features (pause/resume/cancel/skip)

---

## 🔧 Prerequisites

### 1. Stripe Test Mode Setup

**Status:** Stripe sandbox created but not claimed yet

**Action Required:**
- Claim Stripe sandbox at: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1M0WlhESGVndkVlS1ZYLDE3NjM0NDA4MjEv1007pWaQbfw
- Deadline: 2026-01-10T04:40:21.000Z
- Once claimed, you'll have access to test API keys

**Stripe Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

**Expiry:** Any future date (e.g., 12/25)  
**CVC:** Any 3 digits (e.g., 123)  
**ZIP:** Any 5 digits (e.g., 12345)

### 2. Publish the Site

**Current Status:** Site is in preview mode  
**Action Required:** Click "Publish" button in the management UI

### 3. Email Configuration

**Status:** Email system configured  
**Test:** Welcome emails will be sent to the email address used during checkout

---

## 📋 Test Scenarios

### Test 1: One-Time Purchase (Baseline)

**Purpose:** Verify standard checkout works before testing subscriptions

**Steps:**
1. Navigate to `/shop`
2. Click "View Details" on any product
3. Select variant (e.g., "90 Capsules - $59.99")
4. **Do NOT toggle "Subscribe & Save"**
5. Click "Add to Cart"
6. Go to cart → Click "Checkout"
7. Fill shipping information
8. Click "Place Order"
9. Enter Stripe test card: `4242 4242 4242 4242`
10. Complete payment

**Expected Results:**
- ✅ Redirected to order success page
- ✅ Order created in database
- ✅ Order confirmation email sent
- ✅ No subscription created
- ✅ Founder tier NOT assigned (one-time purchase doesn't qualify)

---

### Test 2: Subscription Purchase - Founder's Circle Tier

**Purpose:** Test subscription checkout with automatic founder tier assignment (25% discount)

**Cart Total Required:** $69+ (to qualify for Founder's Circle)

**Steps:**
1. Navigate to `/shop`
2. Click "View Details" on "OptiBio Ashwagandha KSM-66"
3. Select "90 Capsules - $59.99"
4. **Toggle "Subscribe & Save" ON**
5. Click "Add to Cart"
6. Add another item to cart (to reach $69+ total)
   - OR select "180 Capsules - $109.99" variant
7. Go to cart → Click "Checkout"
8. Fill shipping information:
   ```
   First Name: Test
   Last Name: Founder
   Email: test.founder@example.com
   Address: 123 Test St
   City: San Francisco
   State: CA
   ZIP: 94102
   ```
9. Click "Place Order"
10. **Stripe Elements payment form appears**
11. Enter test card details:
    ```
    Card: 4242 4242 4242 4242
    Expiry: 12/25
    CVC: 123
    ZIP: 12345
    ```
12. Click "Confirm Payment"

**Expected Results:**
- ✅ Subscription created in database with `status: "active"`
- ✅ `stripeSubscriptionId`, `stripeCustomerId`, `stripePriceId` populated
- ✅ User's `founderTier` set to `"founders"`
- ✅ User's `lifetimeDiscountPercent` set to `25`
- ✅ Subscription price calculated as:
  ```
  Base: $59.99
  Subscription discount (15%): -$9.00
  Founder discount (25%): -$12.75
  Final monthly price: $38.24
  ```
- ✅ Redirected to `/account/subscriptions?success=true`
- ✅ Subscription appears in management page
- ✅ Welcome email sent to `test.founder@example.com`

**Welcome Email Should Include:**
- ✅ "Welcome to OptiBio!" subject
- ✅ Founder's Circle badge
- ✅ "25% off for life" messaging
- ✅ Next billing date
- ✅ Monthly price ($38.24)
- ✅ Link to manage subscription

---

### Test 3: Subscription Purchase - Early Believer Tier

**Purpose:** Test 15% lifetime discount tier

**Cart Total Required:** $49-$68

**Steps:**
1. Navigate to `/shop`
2. Select product with price $49-$68
3. Toggle "Subscribe & Save" ON
4. Complete checkout (same as Test 2)

**Expected Results:**
- ✅ `founderTier` = `"early_adopter"`
- ✅ `lifetimeDiscountPercent` = `15`
- ✅ Subscription price includes 15% founder discount + 15% subscription discount

---

### Test 4: Subscription Purchase - Pre-Launch Tier

**Purpose:** Test 10% lifetime discount tier

**Cart Total Required:** <$49

**Steps:**
1. Navigate to `/shop`
2. Select cheapest product variant
3. Toggle "Subscribe & Save" ON
4. Complete checkout

**Expected Results:**
- ✅ `founderTier` = `"pre_launch"`
- ✅ `lifetimeDiscountPercent` = `10`
- ✅ Subscription price includes 10% founder discount + 15% subscription discount

---

### Test 5: Webhook - First Subscription Payment

**Purpose:** Verify `invoice.payment_succeeded` webhook creates order and sends welcome email

**Trigger:** Automatically triggered when Test 2 completes

**How to Verify:**
1. Check Stripe Dashboard → Webhooks → Events
2. Look for `invoice.payment_succeeded` event with `billing_reason: "subscription_create"`
3. Check database:
   ```sql
   SELECT * FROM orders WHERE userId = [test_user_id] ORDER BY createdAt DESC LIMIT 1;
   ```
4. Check email inbox for welcome email

**Expected Results:**
- ✅ Order created with:
  - `orderNumber` = auto-generated (e.g., "ORD-1234567")
  - `totalInCents` = subscription price
  - `paymentStatus` = "paid"
  - `status` = "processing"
- ✅ Subscription `lastBillingDate` updated
- ✅ Subscription `nextBillingDate` set to +1 month
- ✅ Welcome email sent

---

### Test 6: Webhook - Subscription Renewal Payment

**Purpose:** Verify recurring payments create new orders

**Trigger:** Manually trigger using Stripe CLI or wait for next billing cycle

**Using Stripe CLI:**
```bash
stripe trigger invoice.payment_succeeded \
  --add invoice:billing_reason=subscription_cycle \
  --add invoice:subscription=sub_xxxxx
```

**Expected Results:**
- ✅ New order created in database
- ✅ Order confirmation email sent (NOT welcome email)
- ✅ Subscription `lastBillingDate` updated
- ✅ Subscription `nextBillingDate` pushed forward by 1 month

---

### Test 7: Subscription Management - Pause

**Purpose:** Test pausing active subscription

**Steps:**
1. Log in as user with active subscription
2. Navigate to `/account/subscriptions`
3. Click "Pause Subscription" button
4. Confirm pause

**Expected Results:**
- ✅ Subscription `status` changed to `"paused"`
- ✅ Subscription `pausedAt` timestamp set
- ✅ Stripe subscription paused
- ✅ No charges until resumed
- ✅ Toast notification: "Subscription paused"

---

### Test 8: Subscription Management - Resume

**Purpose:** Test resuming paused subscription

**Steps:**
1. Navigate to `/account/subscriptions`
2. Find paused subscription
3. Click "Resume Subscription" button

**Expected Results:**
- ✅ Subscription `status` changed to `"active"`
- ✅ Subscription `pausedAt` cleared
- ✅ Stripe subscription resumed
- ✅ Next billing date calculated
- ✅ Toast notification: "Subscription resumed"

---

### Test 9: Subscription Management - Skip Next Delivery

**Purpose:** Test skipping one delivery without cancelling

**Steps:**
1. Navigate to `/account/subscriptions`
2. Find active subscription
3. Click "Skip Next Delivery" button
4. Confirm skip

**Expected Results:**
- ✅ Subscription `nextBillingDate` pushed forward by 1 month
- ✅ Stripe subscription trial period extended
- ✅ Toast notification shows new billing date
- ✅ Subscription remains `status: "active"`

**Example:**
```
Current next billing: Dec 11, 2025
After skip: Jan 11, 2026
```

---

### Test 10: Subscription Management - Cancel

**Purpose:** Test cancelling subscription at period end

**Steps:**
1. Navigate to `/account/subscriptions`
2. Find active subscription
3. Click "Cancel Subscription" button
4. Confirm cancellation

**Expected Results:**
- ✅ Subscription `status` changed to `"cancelled"`
- ✅ Subscription `cancelledAt` timestamp set
- ✅ Stripe subscription cancelled at period end
- ✅ User can still access product until next billing date
- ✅ No future charges
- ✅ Toast notification: "Subscription cancelled"

---

### Test 11: Founder Tier Persistence

**Purpose:** Verify founder tier discount applies to ALL future subscriptions

**Steps:**
1. Complete Test 2 (Founder's Circle tier assigned)
2. Log out
3. Log back in
4. Subscribe to a DIFFERENT product
5. Check subscription price

**Expected Results:**
- ✅ User's `founderTier` remains `"founders"`
- ✅ User's `lifetimeDiscountPercent` remains `25`
- ✅ New subscription automatically gets 25% founder discount
- ✅ Discount applies even if cart total is <$69

**Example:**
```
First subscription: Cart total $109 → Founder tier assigned (25%)
Second subscription: Cart total $49 → STILL gets 25% founder discount
```

---

### Test 12: Admin Analytics Dashboard

**Purpose:** Verify analytics calculations are correct

**Prerequisites:** Complete Tests 2-4 to have subscription data

**Steps:**
1. Log in as admin user
2. Navigate to `/admin/analytics`
3. Review metrics

**Expected Results:**
- ✅ **MRR (Monthly Recurring Revenue):**
  ```
  Sum of all active subscription prices
  Example: 3 subscriptions at $38.24 each = $114.72 MRR
  ```
- ✅ **Active Subscriptions:** Count of `status: "active"` subscriptions
- ✅ **Churn Rate:** 
  ```
  (Cancelled last 30 days / Created last 30 days) × 100
  ```
- ✅ **Total Revenue:** Sum of all paid orders
- ✅ **Tier Breakdown:**
  - Founders: Count, MRR, LTV
  - Early Adopter: Count, MRR, LTV
  - Pre-Launch: Count, MRR, LTV
- ✅ **Conversion Rate:**
  ```
  (Users with subscriptions / Users with orders) × 100
  ```

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: "Stripe publishable key not found"

**Cause:** Stripe keys not configured  
**Solution:** 
1. Claim Stripe sandbox
2. Copy publishable key from Stripe Dashboard
3. Add to environment variables: `VITE_STRIPE_PUBLISHABLE_KEY`

### Issue 2: Webhook not triggering

**Cause:** Webhook endpoint not configured in Stripe  
**Solution:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.manus.space/api/webhooks/stripe`
3. Select events:
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Add to environment: `STRIPE_WEBHOOK_SECRET`

### Issue 3: Welcome email not sent

**Cause:** Email service not configured or webhook not triggering  
**Solution:**
1. Check webhook logs in Stripe Dashboard
2. Verify `billing_reason === "subscription_create"`
3. Check server logs for email sending errors
4. Verify email service credentials

### Issue 4: Founder tier not assigned

**Cause:** Cart total calculation incorrect  
**Solution:**
1. Check cart total in checkout
2. Verify logic in `server/routers.ts` → `createSubscription`
3. Ensure cart total includes all items before discount

### Issue 5: Subscription price incorrect

**Cause:** Discount calculation error  
**Solution:**
1. Verify formula:
   ```javascript
   const basePrice = 5999; // $59.99 in cents
   const subscriptionDiscount = 0.15; // 15%
   const founderDiscount = 0.25; // 25% for Founders
   
   const finalPrice = basePrice * (1 - subscriptionDiscount) * (1 - founderDiscount);
   // = 5999 * 0.85 * 0.75
   // = 3824 cents = $38.24
   ```
2. Check Stripe price object creation
3. Verify database stores correct price

---

## 📊 Test Results Template

Use this template to document your test results:

```markdown
## Test Results - [Date]

### Test 1: One-Time Purchase
- ✅ Status: PASS
- Order ID: ORD-1234567
- Payment: Successful
- Email: Sent
- Notes: None

### Test 2: Subscription Purchase - Founder's Circle
- ✅ Status: PASS
- Subscription ID: sub_xxxxx
- Founder Tier: founders (25%)
- Monthly Price: $38.24
- Welcome Email: Sent
- Notes: None

[Continue for all tests...]
```

---

## 🚀 Next Steps After Testing

1. **Review test results** - Ensure all tests pass
2. **Fix any issues** - Address failures before launch
3. **Test with real Stripe account** - Move from test mode to production
4. **Set up monitoring** - Track subscription metrics
5. **Launch!** - Publish site and start accepting real payments

---

**Testing Checklist:**
- [ ] Stripe sandbox claimed
- [ ] Site published
- [ ] Test 1: One-time purchase
- [ ] Test 2: Founder's Circle subscription
- [ ] Test 3: Early Believer subscription
- [ ] Test 4: Pre-Launch subscription
- [ ] Test 5: First payment webhook
- [ ] Test 6: Renewal payment webhook
- [ ] Test 7: Pause subscription
- [ ] Test 8: Resume subscription
- [ ] Test 9: Skip next delivery
- [ ] Test 10: Cancel subscription
- [ ] Test 11: Founder tier persistence
- [ ] Test 12: Admin analytics

---

**Last Updated:** November 11, 2025  
**Version:** 1.0
