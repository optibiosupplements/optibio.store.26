# Complete Purchase Flow Testing Guide

## Overview

This guide provides step-by-step instructions for testing your OptiBio e-commerce store's complete purchase flow, including one-time purchases, subscriptions, and order management.

---

## 🧪 Test 1: One-Time Purchase (No Subscription)

### Step 1: Add Product to Cart

1. Navigate to: https://3000-iiriq2ohyefytkkpf59r0-6ed7d24f.us2.manus.computer/shop
2. Click on the Ashwagandha KSM-66 product
3. **Select variant:** Choose "180 Capsules (3-Month Supply)" - $127.49
4. **Verify pricing shows:** $127.49 (was $149.97, Save 15%)
5. **Leave "Subscribe & Save" UNCHECKED**
6. **Quantity:** Leave at 1
7. Click "Add to Cart"

**Expected Result:**
- ✅ Success message appears
- ✅ Cart icon shows "1" item
- ✅ Product added to cart

### Step 2: Review Cart

1. Click the cart icon (top-right)
2. Verify cart shows:
   - Product: Ashwagandha KSM-66 (180 Capsules)
   - Quantity: 1
   - Price: $127.49
   - Subtotal: $127.49
   - Shipping: FREE (over $75)
   - Total: $127.49

**Expected Result:**
- ✅ All details are correct
- ✅ Free shipping progress bar shows "You've unlocked free shipping!"

### Step 3: Proceed to Checkout

1. Click "Proceed to Checkout" button
2. You'll be redirected to Stripe Checkout

**Expected Result:**
- ✅ Stripe Checkout page loads
- ✅ Shows OptiBio branding
- ✅ Shows correct product and price

### Step 4: Fill Shipping Information

Enter test shipping address:
```
Email: test@optibio.com
Name: Test Customer
Address Line 1: 123 Test Street
City: New York
State: NY
ZIP: 10001
Country: United States
```

**Expected Result:**
- ✅ Form accepts all information
- ✅ No validation errors

### Step 5: Enter Payment Information

Use Stripe test card:
```
Card Number: 4242 4242 4242 4242
Expiry Date: 12/25 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

**Expected Result:**
- ✅ Card is accepted
- ✅ No errors

### Step 6: Complete Payment

1. Click "Pay" button
2. Wait for payment processing

**Expected Result:**
- ✅ Payment succeeds
- ✅ Redirected to success page
- ✅ Order confirmation displayed

### Step 7: Verify Order in Database

Run this SQL query:
```sql
SELECT * FROM orders ORDER BY createdAt DESC LIMIT 1;
```

**Expected Result:**
- ✅ New order exists
- ✅ Status: "paid" or "processing"
- ✅ Total: 12749 (cents)
- ✅ Customer email: test@optibio.com

### Step 8: Check Order in User Account

1. Navigate to: https://3000-iiriq2ohyefytkkpf59r0-6ed7d24f.us2.manus.computer/orders
2. Verify order appears in list

**Expected Result:**
- ✅ Order shows in account
- ✅ Correct product and price
- ✅ Status displayed correctly

---

## 🧪 Test 2: Subscription Purchase

### Step 1: Add Subscription to Cart

1. Navigate to product page
2. **Select variant:** Choose "90 Capsules (1-Month Supply)" - $49.99
3. **CHECK "Subscribe & Save"**
4. **Verify price changes to:** $42.49 (15% off)
5. Click "Add to Cart"

**Expected Result:**
- ✅ Cart shows subscription price: $42.49
- ✅ Subscription indicator visible

### Step 2: Complete Checkout

Follow same steps as Test 1 (Steps 2-6)

Use different test email: `subscription@optibio.com`

**Expected Result:**
- ✅ Stripe Checkout shows "Subscription" or "Recurring"
- ✅ Shows billing frequency (monthly)
- ✅ Payment succeeds

### Step 3: Verify Subscription in Database

Run this SQL query:
```sql
SELECT * FROM subscriptions ORDER BY createdAt DESC LIMIT 1;
```

**Expected Result:**
- ✅ New subscription exists
- ✅ Status: "active"
- ✅ Price: 4249 (cents)
- ✅ Stripe subscription ID populated

### Step 4: Check Subscription in User Account

1. Navigate to: https://3000-iiriq2ohyefytkkpf59r0-6ed7d24f.us2.manus.computer/subscriptions
2. Verify subscription appears

**Expected Result:**
- ✅ Subscription card displayed
- ✅ Status: Active
- ✅ Next billing date shown
- ✅ Management buttons visible (Skip, Pause, Cancel)

---

## 🧪 Test 3: Subscription Management

### Test 3a: Skip Next Delivery

1. On subscriptions page, find your active subscription
2. Click "Skip Next Delivery" button
3. Confirm action

**Expected Result:**
- ✅ Success message appears
- ✅ Next billing date updates to following month
- ✅ Status remains "Active"

### Test 3b: Pause Subscription

1. Click "Pause Subscription" button
2. Confirm action

**Expected Result:**
- ✅ Success message appears
- ✅ Status changes to "Paused"
- ✅ "Resume" button appears

### Test 3c: Resume Subscription

1. Click "Resume Subscription" button
2. Confirm action

**Expected Result:**
- ✅ Success message appears
- ✅ Status changes back to "Active"
- ✅ Next billing date shown

### Test 3d: Cancel Subscription

1. Click "Cancel Subscription" button
2. Confirm cancellation

**Expected Result:**
- ✅ Cancellation confirmation dialog appears
- ✅ After confirming, status changes to "Canceled"
- ✅ Subscription ends at period end (not immediately)

---

## 🧪 Test 4: Failed Payment Scenarios

### Test 4a: Declined Card

Use Stripe test card for declined payment:
```
Card Number: 4000 0000 0000 0002
```

**Expected Result:**
- ✅ Payment fails with clear error message
- ✅ User can try again
- ✅ No order created in database

### Test 4b: Insufficient Funds

Use Stripe test card:
```
Card Number: 4000 0000 0000 9995
```

**Expected Result:**
- ✅ Payment fails with "insufficient funds" message
- ✅ User can update payment method

---

## 🧪 Test 5: Edge Cases

### Test 5a: Multiple Items in Cart

1. Add 90-capsule variant to cart (quantity: 2)
2. Add 180-capsule variant to cart (quantity: 1)
3. Proceed to checkout

**Expected Result:**
- ✅ Cart shows all items
- ✅ Total calculated correctly
- ✅ Checkout processes all items

### Test 5b: Apply Discount Code

1. Add product to cart
2. Enter discount code: "SAVE10" (from exit-intent popup)
3. Apply code
4. Complete checkout

**Expected Result:**
- ✅ Discount applied correctly
- ✅ Total reduced by 10%
- ✅ Order shows discount in database

### Test 5c: Free Shipping Threshold

1. Add 90-capsule variant ($49.99) to cart
2. Verify shipping NOT free (under $75)
3. Add another 90-capsule variant
4. Verify shipping IS free (over $75)

**Expected Result:**
- ✅ Free shipping progress bar updates correctly
- ✅ Shipping charge appears/disappears appropriately

---

## 🧪 Test 6: Email Notifications

After completing purchases, check for these emails:

### One-Time Purchase
- ✅ Order confirmation email
- ✅ Shipping confirmation email (when shipped)

### Subscription
- ✅ Subscription confirmation email
- ✅ Upcoming renewal reminder (before next billing)
- ✅ Successful renewal confirmation
- ✅ Failed payment notification (if payment fails)
- ✅ Cancellation confirmation

**Note:** In test mode, emails may go to Stripe dashboard instead of actual inbox.

---

## 🧪 Test 7: Stripe Dashboard Verification

### Check Stripe Dashboard

1. Go to: https://dashboard.stripe.com
2. Navigate to "Payments" tab
3. Verify test payments appear

**Expected Result:**
- ✅ All test payments listed
- ✅ Correct amounts
- ✅ Status: "Succeeded"

### Check Subscriptions

1. Navigate to "Subscriptions" tab in Stripe
2. Verify test subscriptions appear

**Expected Result:**
- ✅ Active subscriptions listed
- ✅ Correct billing schedule
- ✅ Customer information correct

---

## 🧪 Test 8: Refund Process

### Issue a Refund

1. Go to Stripe Dashboard → Payments
2. Find a test payment
3. Click "Refund" button
4. Enter refund amount
5. Confirm refund

**Expected Result:**
- ✅ Refund processes successfully
- ✅ Order status updates in database
- ✅ Customer receives refund confirmation

---

## 📋 Testing Checklist

### One-Time Purchase Flow
- [ ] Product page loads correctly
- [ ] Variant selection works
- [ ] Add to cart succeeds
- [ ] Cart displays correctly
- [ ] Checkout redirects to Stripe
- [ ] Payment form accepts test card
- [ ] Payment processes successfully
- [ ] Order created in database
- [ ] Order appears in user account
- [ ] Confirmation email sent

### Subscription Flow
- [ ] Subscribe & Save checkbox works
- [ ] Subscription price displays correctly
- [ ] Stripe shows recurring payment
- [ ] Subscription created in database
- [ ] Subscription appears in user account
- [ ] Skip delivery works
- [ ] Pause subscription works
- [ ] Resume subscription works
- [ ] Cancel subscription works
- [ ] Subscription emails sent

### Error Handling
- [ ] Declined card shows error
- [ ] Insufficient funds handled
- [ ] Network errors handled gracefully
- [ ] Invalid form data rejected

### Edge Cases
- [ ] Multiple items in cart
- [ ] Discount codes apply correctly
- [ ] Free shipping threshold works
- [ ] Quantity updates work
- [ ] Remove from cart works

---

## 🐛 Common Issues & Solutions

### Issue: Payment Fails with "Invalid API Key"
**Solution:** Verify `STRIPE_SECRET_KEY` is set correctly in environment variables

### Issue: Webhook Events Not Received
**Solution:** 
1. Check webhook endpoint is accessible
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Test webhook in Stripe dashboard

### Issue: Subscription Not Created
**Solution:**
1. Check Stripe subscription product exists
2. Verify price IDs are correct in database
3. Check Stripe logs for errors

### Issue: Order Not Appearing in Account
**Solution:**
1. Verify user is logged in
2. Check order `userId` matches logged-in user
3. Refresh page

---

## 📊 Expected Database State After Tests

### Orders Table
```sql
SELECT 
  id, 
  status, 
  totalInCents, 
  customerEmail,
  isSubscription,
  createdAt
FROM orders
ORDER BY createdAt DESC
LIMIT 5;
```

**Expected:** 2-3 orders (one-time + subscription)

### Subscriptions Table
```sql
SELECT 
  id,
  status,
  priceInCents,
  stripeSubscriptionId,
  nextBillingDate,
  createdAt
FROM subscriptions
ORDER BY createdAt DESC
LIMIT 5;
```

**Expected:** 1-2 subscriptions with various statuses

---

## ✅ Success Criteria

Your store is ready for production when:

- ✅ All one-time purchase tests pass
- ✅ All subscription tests pass
- ✅ Error handling works correctly
- ✅ Orders appear in database and user account
- ✅ Subscriptions can be managed
- ✅ Stripe dashboard shows all transactions
- ✅ Email notifications are sent
- ✅ Refunds process correctly

---

## 🚀 Next Steps After Testing

1. **Switch to Live Mode:**
   - Get live API keys from Stripe
   - Update environment variables
   - Set up live webhooks
   - Test with real credit card (small amount)
   - Refund test transaction

2. **Monitor First Real Orders:**
   - Watch Stripe dashboard closely
   - Verify orders process correctly
   - Check email notifications
   - Monitor for any errors

3. **Set Up Alerts:**
   - Failed payment notifications
   - Subscription cancellation alerts
   - Low inventory warnings
   - Error monitoring

---

## 📞 Support

If you encounter issues during testing:

1. **Check Stripe Logs:** https://dashboard.stripe.com/logs
2. **Review Server Logs:** Check your application logs for errors
3. **Test Webhooks:** Use Stripe CLI to test webhook events
4. **Contact Support:** https://help.manus.im

---

*Last updated: December 26, 2025*
