# Subscription System Implementation Plan

## Overview
Implement a complete subscription management system that allows customers to subscribe to regular deliveries of OptiBio Ashwagandha with flexible frequency options and full self-service management.

---

## Features to Implement

### 1. Subscription Frequency Selector (Product Page)
**Location:** ProductDetail.tsx  
**UI Elements:**
- Radio buttons for frequency selection:
  - Every 30 days (1 month)
  - Every 60 days (2 months)
  - Every 90 days (3 months)
- Subscription discount badge (15% off)
- "Subscribe & Save" toggle
- Display subscription price vs one-time price

**Backend:**
- Store subscription frequency in cart
- Calculate subscription discount
- Create Stripe subscription on checkout

---

### 2. Customer Subscription Portal
**Location:** New page `/account/subscriptions`  
**Features:**
- List all active subscriptions
- Show next delivery date
- Display billing amount and frequency
- Quick actions for each subscription

**UI Components:**
- Subscription card showing:
  - Product name and image
  - Variant (90/180/270 capsules)
  - Frequency (every X days)
  - Next billing date
  - Subscription status (active/paused/cancelled)
  - Action buttons

---

### 3. Subscription Management Actions

#### Skip Next Delivery
- Button to skip upcoming delivery
- Pushes next billing date forward by one cycle
- Shows confirmation dialog
- Updates Stripe subscription schedule

#### Change Frequency
- Dropdown to select new frequency (30/60/90 days)
- Updates Stripe subscription interval
- Shows new next billing date
- Confirmation dialog

#### Pause Subscription
- Temporarily pause deliveries
- Set resume date (optional)
- Maintains subscription in Stripe
- Can resume anytime

#### Cancel Subscription
- Multi-step cancellation flow:
  1. Confirm cancellation intent
  2. Show retention offer (e.g., "Get 20% off next order")
  3. Collect cancellation reason
  4. Final confirmation
- Cancels in Stripe immediately
- Send cancellation confirmation email

---

### 4. Stripe Integration

#### Subscription Creation
```typescript
// When user checks out with subscription
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{
    price: stripePriceId,
    quantity: 1,
  }],
  billing_cycle_anchor: 'now',
  proration_behavior: 'none',
  metadata: {
    userId: user.id,
    productId: product.id,
    variantId: variant.id,
    frequency: '30', // days
  },
});
```

#### Webhook Events to Handle
- `customer.subscription.created` - Save subscription to database
- `customer.subscription.updated` - Update subscription details
- `customer.subscription.deleted` - Mark as cancelled
- `invoice.payment_succeeded` - Create order, send confirmation
- `invoice.payment_failed` - Send payment failure email
- `customer.subscription.trial_will_end` - Send reminder (if using trials)

---

### 5. Database Schema

#### subscriptions table
```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  variantId INT,
  stripeSubscriptionId VARCHAR(255) UNIQUE NOT NULL,
  stripeCustomerId VARCHAR(255) NOT NULL,
  status ENUM('active', 'paused', 'cancelled', 'past_due') NOT NULL,
  frequency INT NOT NULL, -- days between deliveries
  nextBillingDate DATETIME NOT NULL,
  lastBillingDate DATETIME,
  priceInCents INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  cancelledAt DATETIME,
  cancellationReason TEXT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (variantId) REFERENCES productVariants(id)
);
```

---

## Implementation Steps

### Step 1: Update Database Schema
1. Create subscriptions table migration
2. Add subscription-related fields to orders table
3. Run migration

### Step 2: Backend API (tRPC)
1. Create subscription router in `server/routers.ts`
2. Add procedures:
   - `subscriptions.create` - Create new subscription
   - `subscriptions.list` - Get user's subscriptions
   - `subscriptions.get` - Get single subscription
   - `subscriptions.skip` - Skip next delivery
   - `subscriptions.changeFrequency` - Update frequency
   - `subscriptions.pause` - Pause subscription
   - `subscriptions.resume` - Resume subscription
   - `subscriptions.cancel` - Cancel subscription

### Step 3: Stripe Webhook Handler
1. Create webhook endpoint `/api/webhooks/stripe`
2. Verify webhook signature
3. Handle subscription events
4. Update database accordingly

### Step 4: Frontend Components
1. Update ProductDetail.tsx with subscription toggle
2. Create SubscriptionCard component
3. Create SubscriptionsList page
4. Add to user account navigation

### Step 5: Testing
1. Test subscription creation
2. Test each management action
3. Test webhook handling
4. Verify email notifications

---

## Pricing Strategy

### Subscription Discount
- **15% off** all subscription orders
- Applied automatically at checkout
- Shown clearly on product page

### Frequency Pricing (Same for all)
- 30 days: 15% off regular price
- 60 days: 15% off regular price
- 90 days: 15% off regular price

### Example Pricing
**90 Capsules (1-Month Supply)**
- One-time: $49.99
- Subscribe & Save: $42.49 (15% off)

**180 Capsules (3-Month Supply)**
- One-time: $127.49
- Subscribe & Save: $108.37 (15% off)

**270 Capsules (6-Month Supply)**
- One-time: $187.49
- Subscribe & Save: $159.37 (15% off)

---

## User Experience Flow

### Subscribe Flow
1. Customer lands on product page
2. Sees "Subscribe & Save 15%" option
3. Toggles subscription on
4. Selects frequency (30/60/90 days)
5. Adds to cart
6. Proceeds to checkout
7. Completes payment
8. Subscription created in Stripe
9. Receives confirmation email with subscription details

### Manage Flow
1. Customer logs into account
2. Navigates to "My Subscriptions"
3. Sees list of active subscriptions
4. Clicks "Manage" on a subscription
5. Can skip, change frequency, pause, or cancel
6. Receives confirmation of changes

---

## Email Notifications

### Subscription Confirmation
- Sent when subscription is created
- Includes: Product, frequency, next billing date, manage link

### Upcoming Delivery Reminder
- Sent 3 days before next billing
- Includes: Delivery date, amount, option to skip

### Payment Success
- Sent after successful billing
- Includes: Receipt, tracking info (when available)

### Payment Failed
- Sent if payment fails
- Includes: Update payment method link, retry date

### Subscription Cancelled
- Sent when subscription is cancelled
- Includes: Cancellation confirmation, reactivation offer

---

## Technical Notes

- Use Stripe's subscription schedule API for skipping deliveries
- Store subscription metadata in Stripe for easy reference
- Implement idempotency for webhook handlers
- Use database transactions for subscription state changes
- Cache subscription data to reduce Stripe API calls
- Implement retry logic for failed webhook processing

---

*This plan provides a complete subscription system that will drive recurring revenue and improve customer lifetime value.*
