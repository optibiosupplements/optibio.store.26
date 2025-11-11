# OptiBio E-Commerce Database Schema

**Complete database architecture for subscription-based supplement e-commerce with founder tier system**

---

## 📊 Schema Overview

The database consists of **14 core tables** organized into 5 functional groups:

1. **User Management** - Authentication and founder tier tracking
2. **Product Catalog** - Products, variants, and subscription plans
3. **Order Management** - Orders, order items, and fulfillment
4. **Subscription System** - Recurring billing and Stripe integration
5. **Supporting Systems** - Cart, discounts, addresses, batch tracking

---

## 1. User Management

### `users` Table
**Purpose:** Core user authentication and founder tier tracking

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-increment primary key |
| `openId` | VARCHAR(64) UNIQUE | Manus OAuth identifier |
| `name` | TEXT | User's full name |
| `email` | VARCHAR(320) | Email address |
| `loginMethod` | VARCHAR(64) | OAuth provider (e.g., "google", "email") |
| `role` | ENUM | `user` or `admin` - for access control |
| **`founderTier`** | ENUM | `founders`, `early_adopter`, `pre_launch`, `regular` |
| **`lifetimeDiscountPercent`** | INT | 0-25% lifetime discount locked in |
| `createdAt` | TIMESTAMP | Account creation date |
| `updatedAt` | TIMESTAMP | Last profile update |
| `lastSignedIn` | TIMESTAMP | Last login timestamp |

**Key Features:**
- ✅ **Founder Tier System**: Automatically assigned on first purchase based on cart total
- ✅ **Lifetime Discounts**: Once set, discount percentage never changes
- ✅ **Role-Based Access**: Admin users can access analytics dashboard

**Founder Tier Assignment Logic:**
```
Cart Total >= $69  → founders (25% lifetime discount)
Cart Total $49-68  → early_adopter (15% lifetime discount)
Cart Total < $49   → pre_launch (10% lifetime discount)
Regular pricing    → regular (0% discount)
```

---

## 2. Product Catalog

### `products` Table
**Purpose:** Main product information

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Product ID |
| `name` | VARCHAR(255) | Product name |
| `slug` | VARCHAR(255) UNIQUE | URL-friendly identifier |
| `description` | TEXT | Short description |
| `longDescription` | TEXT | Full product details |
| `priceInCents` | INT | Base price (e.g., 5999 = $59.99) |
| `compareAtPriceInCents` | INT | Original price for "was/now" display |
| `sku` | VARCHAR(100) UNIQUE | Stock keeping unit |
| `stockQuantity` | INT | Current inventory |
| `lowStockThreshold` | INT | Alert threshold (default: 10) |
| `imageUrl` | VARCHAR(500) | Primary product image |
| `galleryImages` | TEXT (JSON) | Array of additional images |
| `isActive` | BOOLEAN | Product visibility |
| `isFeatured` | BOOLEAN | Show on homepage |
| `servingSize` | VARCHAR(100) | e.g., "2 capsules" |
| `servingsPerContainer` | INT | e.g., 30 servings |
| `ingredients` | TEXT | Full ingredient list |
| `supplementFacts` | TEXT (JSON) | Structured nutrition data |
| `warnings` | TEXT | Safety warnings |
| `directions` | TEXT | Usage instructions |

**Why prices are in cents:** Avoids floating-point precision errors in financial calculations.

### `productVariants` Table
**Purpose:** Different sizes/quantities of the same product

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Variant ID |
| `productId` | INT (FK) | Links to `products.id` |
| `name` | VARCHAR(255) | e.g., "60 Capsules", "120 Capsules" |
| `sku` | VARCHAR(100) UNIQUE | Variant-specific SKU |
| `priceInCents` | INT | Variant price |
| `compareAtPriceInCents` | INT | Original price |
| `stockQuantity` | INT | Variant inventory |
| `isActive` | BOOLEAN | Variant availability |
| `sortOrder` | INT | Display order |

### `subscriptionPlans` Table
**Purpose:** Define recurring billing intervals

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Plan ID |
| `name` | VARCHAR(255) | e.g., "Monthly Subscription" |
| `description` | TEXT | Plan benefits |
| `intervalType` | ENUM | `monthly`, `quarterly`, `annual` |
| `intervalCount` | INT | e.g., 1 = every month, 3 = every 3 months |
| `discountPercentage` | INT | Base subscription discount (before founder discount) |
| `isActive` | BOOLEAN | Plan availability |

**Example Plans:**
- Monthly: `intervalType: "monthly"`, `intervalCount: 1`, `discountPercentage: 10`
- Quarterly: `intervalType: "monthly"`, `intervalCount: 3`, `discountPercentage: 15`

---

## 3. Order Management

### `orders` Table
**Purpose:** Customer purchase records

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Order ID |
| `orderNumber` | VARCHAR(50) UNIQUE | Human-readable order # (e.g., "ORD-1234567") |
| `userId` | INT (FK) | Links to `users.id` (NULL for guest checkout) |
| `email` | VARCHAR(320) | Customer email |
| `status` | ENUM | `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded` |
| `subtotalInCents` | INT | Sum of all items |
| `shippingInCents` | INT | Shipping cost |
| `taxInCents` | INT | Sales tax |
| `discountInCents` | INT | Total discounts applied |
| `totalInCents` | INT | Final amount charged |
| `shipping*` | VARCHAR | Shipping address fields (firstName, lastName, address1, etc.) |
| `billing*` | VARCHAR | Billing address fields |
| `paymentMethod` | VARCHAR(50) | e.g., "card", "paypal" |
| `paymentStatus` | ENUM | `pending`, `paid`, `failed`, `refunded` |
| `transactionId` | VARCHAR(255) | Stripe payment intent ID |
| `trackingNumber` | VARCHAR(255) | Shipment tracking |
| `shippingCarrier` | VARCHAR(100) | e.g., "USPS", "FedEx" |
| `customerNotes` | TEXT | Customer order notes |
| `adminNotes` | TEXT | Internal notes |
| `paidAt` | TIMESTAMP | Payment completion time |
| `shippedAt` | TIMESTAMP | Shipment time |
| `deliveredAt` | TIMESTAMP | Delivery time |

### `orderItems` Table
**Purpose:** Line items in each order

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Item ID |
| `orderId` | INT (FK) | Links to `orders.id` |
| `productId` | INT (FK) | Links to `products.id` |
| `variantId` | INT (FK) | Links to `productVariants.id` (optional) |
| `productName` | VARCHAR(255) | Snapshot of product name at purchase time |
| `variantName` | VARCHAR(255) | Snapshot of variant name |
| `sku` | VARCHAR(100) | SKU at purchase time |
| `quantity` | INT | Number of units |
| `priceInCents` | INT | Price per unit at purchase time |
| `totalInCents` | INT | `quantity * priceInCents` |

**Why snapshot names/prices:** Product details may change over time, but order history must remain accurate.

---

## 4. Subscription System

### `subscriptions` Table
**Purpose:** Recurring billing management with Stripe integration

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Subscription ID |
| `userId` | INT (FK) | Links to `users.id` |
| `planId` | INT (FK) | Links to `subscriptionPlans.id` |
| `productId` | INT (FK) | Product being subscribed to |
| `variantId` | INT (FK) | Variant (if applicable) |
| `status` | ENUM | `active`, `paused`, `cancelled`, `expired` |
| `quantity` | INT | Number of units per delivery |
| `priceInCents` | INT | **Final price after all discounts** |
| **`stripeSubscriptionId`** | VARCHAR(255) UNIQUE | Stripe subscription object ID |
| **`stripeCustomerId`** | VARCHAR(255) | Stripe customer ID |
| **`stripePriceId`** | VARCHAR(255) | Stripe price ID |
| `nextBillingDate` | TIMESTAMP | When next charge occurs |
| `lastBillingDate` | TIMESTAMP | Last successful charge |
| `cancelledAt` | TIMESTAMP | Cancellation timestamp |
| `pausedAt` | TIMESTAMP | Pause timestamp |

**Subscription Lifecycle:**
1. **Created** → `status: "active"`, Stripe subscription created
2. **First Payment** → Webhook `invoice.payment_succeeded` → Welcome email sent
3. **Recurring Payments** → Webhook creates new order every billing cycle
4. **Skip Delivery** → `nextBillingDate` pushed forward by 1 month
5. **Pause** → `status: "paused"`, Stripe subscription paused
6. **Cancel** → `status: "cancelled"`, subscription ends at period end

**Stripe Integration Flow:**
```
User subscribes
  → Create Stripe Customer (if new)
  → Create Stripe Price (with founder discount)
  → Create Stripe Subscription
  → Store stripeSubscriptionId, stripeCustomerId, stripePriceId
  → Stripe sends invoice.payment_succeeded webhook
  → Create order in database
  → Send welcome email
```

---

## 5. Supporting Systems

### `cartItems` Table
**Purpose:** Shopping cart (both guest and logged-in users)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Cart item ID |
| `userId` | INT (FK) | For logged-in users |
| `sessionId` | VARCHAR(255) | For guest users (browser session) |
| `productId` | INT (FK) | Product in cart |
| `variantId` | INT (FK) | Variant (if applicable) |
| `quantity` | INT | Number of units |
| **`isSubscription`** | BOOLEAN | One-time or subscription purchase |
| **`subscriptionPlanId`** | INT (FK) | Links to `subscriptionPlans.id` if subscription |

**Key Feature:** `isSubscription` flag determines checkout flow (one-time vs recurring).

### `addresses` Table
**Purpose:** Saved customer addresses

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Address ID |
| `userId` | INT (FK) | Links to `users.id` |
| `type` | ENUM | `shipping` or `billing` |
| `firstName` | VARCHAR(100) | First name |
| `lastName` | VARCHAR(100) | Last name |
| `company` | VARCHAR(255) | Company name (optional) |
| `address1` | VARCHAR(255) | Street address |
| `address2` | VARCHAR(255) | Apt/Suite (optional) |
| `city` | VARCHAR(100) | City |
| `state` | VARCHAR(100) | State/Province |
| `zipCode` | VARCHAR(20) | Postal code |
| `country` | VARCHAR(100) | Country (default: "United States") |
| `phone` | VARCHAR(20) | Phone number |
| `isDefault` | BOOLEAN | Default address for this type |

### `discountCodes` Table
**Purpose:** Promo codes and coupons

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Code ID |
| `code` | VARCHAR(50) UNIQUE | Promo code (e.g., "SAVE20") |
| `description` | TEXT | Internal description |
| `discountType` | ENUM | `percentage` or `fixed` |
| `discountValue` | INT | Percentage (0-100) or cents |
| `minPurchaseInCents` | INT | Minimum cart value |
| `maxUsesTotal` | INT | Total usage limit |
| `maxUsesPerCustomer` | INT | Per-customer limit |
| `usedCount` | INT | Current usage count |
| `isActive` | BOOLEAN | Code availability |
| `startsAt` | TIMESTAMP | Activation date |
| `expiresAt` | TIMESTAMP | Expiration date |

### `productBatches` Table
**Purpose:** Quality control and batch verification

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Batch ID |
| `productId` | INT (FK) | Links to `products.id` |
| `lotNumber` | VARCHAR(100) UNIQUE | Batch lot number |
| `manufactureDate` | TIMESTAMP | Production date |
| `expiryDate` | TIMESTAMP | Expiration date |
| `coaUrl` | VARCHAR(500) | Certificate of Analysis PDF |
| `heavyMetalsTestUrl` | VARCHAR(500) | Heavy metals test results |
| `microbialTestUrl` | VARCHAR(500) | Microbial test results |
| `potencyTestUrl` | VARCHAR(500) | Potency test results |
| `testResults` | TEXT (JSON) | Key test metrics for quick display |
| `isActive` | BOOLEAN | Batch availability |

---

## 🔗 Key Relationships

### User → Subscriptions (One-to-Many)
- A user can have multiple active subscriptions
- Each subscription belongs to one user
- `subscriptions.userId` → `users.id`

### User → Orders (One-to-Many)
- A user can have multiple orders
- Each order belongs to one user (or NULL for guest)
- `orders.userId` → `users.id`

### Subscription → Stripe (One-to-One)
- Each subscription has one Stripe subscription
- Stripe subscription ID stored in `stripeSubscriptionId`
- Stripe customer ID stored in `stripeCustomerId`

### Order → OrderItems (One-to-Many)
- Each order contains multiple line items
- Each line item belongs to one order
- `orderItems.orderId` → `orders.id`

### Product → Variants (One-to-Many)
- A product can have multiple variants (sizes)
- Each variant belongs to one product
- `productVariants.productId` → `products.id`

### Cart → User/Session (Many-to-One)
- Multiple cart items per user/session
- `cartItems.userId` → `users.id` OR `cartItems.sessionId` for guests

---

## 💡 Business Logic Highlights

### Founder Tier System
**Automatic Assignment on First Purchase:**
```sql
-- When user completes first purchase
UPDATE users 
SET founderTier = CASE 
  WHEN cart_total >= 6900 THEN 'founders'
  WHEN cart_total >= 4900 THEN 'early_adopter'
  ELSE 'pre_launch'
END,
lifetimeDiscountPercent = CASE 
  WHEN cart_total >= 6900 THEN 25
  WHEN cart_total >= 4900 THEN 15
  ELSE 10
END
WHERE id = ? AND founderTier IS NULL;
```

**Lifetime Discount Application:**
- Stored in `users.lifetimeDiscountPercent`
- Applied to ALL future subscription prices
- Never changes after first purchase
- Stacks with subscription plan discounts

### Subscription Pricing Calculation
```
Base Price: $59.99/bottle
Subscription Discount: 10% (from plan)
Founder Discount: 25% (from user.lifetimeDiscountPercent)

Final Price = $59.99 × (1 - 0.10) × (1 - 0.25)
            = $59.99 × 0.90 × 0.75
            = $40.49/month
```

### Webhook-Driven Order Creation
**When Stripe sends `invoice.payment_succeeded`:**
1. Check `billing_reason`:
   - `subscription_create` → Send welcome email
   - `subscription_cycle` → Create renewal order
2. Create order in `orders` table
3. Update `subscriptions.lastBillingDate` and `nextBillingDate`
4. Send confirmation email

---

## 📈 Analytics Queries

### Monthly Recurring Revenue (MRR)
```sql
SELECT SUM(priceInCents) as mrr
FROM subscriptions
WHERE status = 'active';
```

### Churn Rate (Last 30 Days)
```sql
SELECT 
  (COUNT(CASE WHEN status = 'cancelled' AND updatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) / 
   COUNT(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END)) * 100 as churn_rate
FROM subscriptions;
```

### LTV by Founder Tier
```sql
SELECT 
  u.founderTier,
  AVG(o.totalInCents) as avg_ltv
FROM users u
JOIN orders o ON u.id = o.userId
GROUP BY u.founderTier;
```

### Conversion Rate (One-Time → Subscription)
```sql
SELECT 
  (COUNT(DISTINCT s.userId) / COUNT(DISTINCT o.userId)) * 100 as conversion_rate
FROM orders o
LEFT JOIN subscriptions s ON o.userId = s.userId;
```

---

## 🔒 Security Considerations

1. **Prices in Cents:** Prevents floating-point errors in financial calculations
2. **Unique Constraints:** `orderNumber`, `stripeSubscriptionId`, `code` prevent duplicates
3. **Role-Based Access:** `users.role` controls admin dashboard access
4. **Snapshot Data:** Order items store product names/prices at purchase time
5. **Stripe IDs:** Stored for webhook verification and subscription management

---

## 🚀 Scalability Notes

- **Indexes:** Add indexes on `userId`, `stripeSubscriptionId`, `orderNumber` for fast lookups
- **Archiving:** Consider archiving old orders (>2 years) to separate table
- **Caching:** Cache active subscription count, MRR for analytics dashboard
- **Partitioning:** Partition `orders` table by year if volume exceeds 1M rows

---

**Schema Version:** 1.0  
**Last Updated:** November 11, 2025  
**Database:** MySQL/TiDB compatible
