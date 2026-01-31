# Shopify to Manus Migration Guide

**Complete step-by-step guide for migrating optibiosupplements.com from Shopify to Manus platform**

---

## 📋 Migration Overview

**Current Setup:**
- Domain: `optibiosupplements.com` (hosted on Shopify)
- Platform: Shopify e-commerce
- Products: Ashwagandha supplements

**Target Setup:**
- Domain: `optibiosupplements.com` (migrated to Manus)
- Platform: Custom Manus web application
- Features: Subscription system, founder tier pricing, admin analytics

**Migration Timeline:** 2-3 days (recommended)

---

## ⚠️ Pre-Migration Checklist

Before starting the migration, ensure you have:

- [ ] **Backup access to Shopify admin** - You'll need this throughout the process
- [ ] **Domain registrar access** - To update DNS records
- [ ] **Customer communication plan** - Email customers about the transition
- [ ] **Downtime window** - Plan for 15-30 minutes of potential downtime during DNS cutover
- [ ] **Rollback plan** - Know how to revert DNS if needed
- [ ] **Test the new Manus site** - Ensure everything works before switching

---

## Phase 1: Data Export from Shopify

### Step 1.1: Export Customer Data

**Location:** Shopify Admin → Customers → Export

**What to export:**
- Customer names
- Email addresses
- Phone numbers
- Addresses (shipping/billing)
- Order history
- Customer tags
- Account creation dates

**Export format:** CSV

**File location:** Save as `shopify_customers_export.csv`

**Important fields to map:**
```
Shopify Field          → Manus Field
-------------------------------------------
First Name             → users.name (first part)
Last Name              → users.name (last part)
Email                  → users.email
Phone                  → (add phone field if needed)
Created At             → users.createdAt
Total Spent            → (calculate from orders)
```

---

### Step 1.2: Export Product Data

**Location:** Shopify Admin → Products → Export

**What to export:**
- Product titles
- Descriptions
- Prices
- SKUs
- Inventory quantities
- Product images
- Variants
- Tags/categories

**Export format:** CSV

**File location:** Save as `shopify_products_export.csv`

**Important fields to map:**
```
Shopify Field          → Manus Field
-------------------------------------------
Title                  → products.name
Body (HTML)            → products.description
Price                  → products.priceInCents (convert to cents)
SKU                    → products.sku
Inventory Quantity     → products.stockQuantity
Image Src              → products.imageUrl
Variant Title          → productVariants.name
Variant Price          → productVariants.priceInCents
```

---

### Step 1.3: Export Order History

**Location:** Shopify Admin → Orders → Export

**What to export:**
- Order numbers
- Order dates
- Customer information
- Line items
- Prices
- Payment status
- Fulfillment status

**Export format:** CSV

**File location:** Save as `shopify_orders_export.csv`

**Important fields to map:**
```
Shopify Field          → Manus Field
-------------------------------------------
Name (Order #)         → orders.orderNumber
Created At             → orders.createdAt
Email                  → (lookup user by email)
Financial Status       → orders.paymentStatus
Fulfillment Status     → orders.status
Total                  → orders.totalInCents (convert to cents)
Lineitem Name          → orderItems.productName
Lineitem Quantity      → orderItems.quantity
Lineitem Price         → orderItems.priceInCents
```

---

### Step 1.4: Export Subscription Data (if applicable)

**If using Shopify subscriptions:**

**Location:** Shopify Admin → Apps → [Subscription App] → Export

**What to export:**
- Subscription IDs
- Customer emails
- Products subscribed to
- Billing frequency
- Next billing dates
- Subscription status

**Important:** You'll need to recreate subscriptions in Stripe/Manus system

---

## Phase 2: Data Import to Manus

### Step 2.1: Create Data Import Scripts

Create a Node.js script to import data from Shopify CSVs to Manus database.

**File:** `/home/ubuntu/optibio-ecommerce/scripts/import-from-shopify.mjs`

```javascript
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { getDb } from '../server/db.js';
import { users, products, orders } from '../drizzle/schema.js';

// Import customers
async function importCustomers() {
  const csv = readFileSync('./shopify_customers_export.csv', 'utf-8');
  const records = parse(csv, { columns: true });
  
  const db = await getDb();
  
  for (const record of records) {
    await db.insert(users).values({
      name: `${record['First Name']} ${record['Last Name']}`,
      email: record['Email'],
      role: 'user',
      createdAt: new Date(record['Created At']),
      // Note: Shopify customers don't have openId, you'll need to handle this
      openId: `shopify_${record['Email']}`, // Temporary - they'll need to log in with Manus OAuth
    });
  }
  
  console.log(`Imported ${records.length} customers`);
}

// Import products
async function importProducts() {
  const csv = readFileSync('./shopify_products_export.csv', 'utf-8');
  const records = parse(csv, { columns: true });
  
  const db = await getDb();
  
  for (const record of records) {
    // Convert price from dollars to cents
    const priceInCents = Math.round(parseFloat(record['Variant Price']) * 100);
    
    await db.insert(products).values({
      name: record['Title'],
      description: record['Body (HTML)'],
      priceInCents: priceInCents,
      sku: record['SKU'],
      stockQuantity: parseInt(record['Inventory Quantity']),
      imageUrl: record['Image Src'],
      category: record['Product Type'],
      isActive: true,
    });
  }
  
  console.log(`Imported ${records.length} products`);
}

// Import orders
async function importOrders() {
  const csv = readFileSync('./shopify_orders_export.csv', 'utf-8');
  const records = parse(csv, { columns: true });
  
  const db = await getDb();
  
  for (const record of records) {
    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, record['Email'])).limit(1);
    
    if (user.length === 0) {
      console.log(`User not found for order ${record['Name']}`);
      continue;
    }
    
    const totalInCents = Math.round(parseFloat(record['Total']) * 100);
    
    await db.insert(orders).values({
      userId: user[0].id,
      orderNumber: record['Name'],
      totalInCents: totalInCents,
      paymentStatus: record['Financial Status'].toLowerCase(),
      status: record['Fulfillment Status'].toLowerCase(),
      createdAt: new Date(record['Created At']),
    });
  }
  
  console.log(`Imported ${records.length} orders`);
}

// Run imports
async function main() {
  console.log('Starting Shopify data import...');
  await importCustomers();
  await importProducts();
  await importOrders();
  console.log('Import complete!');
}

main();
```

---

### Step 2.2: Run Import Scripts

```bash
cd /home/ubuntu/optibio-ecommerce
node scripts/import-from-shopify.mjs
```

**Verify imports:**
```sql
-- Check customer count
SELECT COUNT(*) FROM users WHERE role = 'user';

-- Check product count
SELECT COUNT(*) FROM products;

-- Check order count
SELECT COUNT(*) FROM orders;
```

---

### Step 2.3: Handle Shopify Subscriptions

**Important:** Shopify subscriptions cannot be directly migrated to Stripe.

**Recommended approach:**

1. **Export active Shopify subscriptions** to CSV
2. **Email customers** with migration instructions:
   ```
   Subject: Important: Your OptiBio Subscription is Moving to Our New Platform
   
   Hi [Customer Name],
   
   We're excited to announce that OptiBio is moving to a new, improved platform!
   
   Your current Shopify subscription will be cancelled on [DATE].
   To continue your subscription with no interruption:
   
   1. Visit: https://optibiosupplements.com/migrate-subscription
   2. Use code: MIGRATE2024 for 1 month free
   3. Your founder tier discount (25% off) will be automatically applied
   
   Questions? Reply to this email or visit our FAQ.
   
   Thank you for being a valued customer!
   OptiBio Team
   ```
3. **Create migration landing page** (`/migrate-subscription`) with:
   - Pre-filled email field (from URL parameter)
   - One-click subscription setup
   - Automatic founder tier assignment
   - Special migration offer (1 month free)

---

## Phase 3: Domain Configuration

### Step 3.1: Configure Custom Domain in Manus

**Instructions for user:**

1. **Open Management UI** (right panel in Manus interface)
2. **Navigate to Settings → Domains**
3. **Click "Add Custom Domain"**
4. **Enter domain:** `optibiosupplements.com`
5. **Click "Add Domain"**

**Manus will provide DNS records like:**
```
Type: A
Name: @
Value: [IP address provided by Manus]

Type: CNAME  
Name: www
Value: [domain provided by Manus]
```

**Copy these records** - you'll need them in the next step.

---

### Step 3.2: Update DNS Records

**Where to do this:** Your domain registrar (where you bought optibiosupplements.com)

**Common registrars:**
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare

**Steps:**

1. **Log in to your domain registrar**
2. **Find DNS settings** (usually called "DNS Management" or "DNS Records")
3. **Add the A record:**
   - Type: `A`
   - Name: `@` (or leave blank for root domain)
   - Value: [IP from Manus]
   - TTL: `3600` (or "Automatic")
4. **Add the CNAME record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: [domain from Manus]
   - TTL: `3600`
5. **Remove old Shopify DNS records** (if any exist)
6. **Save changes**

**DNS Propagation:** Takes 5-15 minutes (sometimes up to 48 hours)

---

### Step 3.3: Verify Domain Configuration

**Check DNS propagation:**
```bash
# Check A record
dig optibiosupplements.com +short

# Check CNAME record
dig www.optibiosupplements.com +short
```

**Or use online tools:**
- https://dnschecker.org
- https://www.whatsmydns.net

**Test the site:**
1. Visit `https://optibiosupplements.com` in incognito mode
2. Verify it loads the new Manus site (not Shopify)
3. Check SSL certificate is valid (green padlock)
4. Test a purchase flow

---

## Phase 4: Shopify Transition

### Step 4.1: Prepare Shopify for Shutdown

**Before switching DNS:**

1. **Export final data** - Get latest customers/orders/products
2. **Download all product images** - Ensure they're backed up
3. **Cancel Shopify subscriptions** (the app subscriptions, not customer subscriptions)
4. **Set up order forwarding** - Forward Shopify admin emails to your new email

**After DNS switch:**

1. **Monitor Shopify for 7 days** - Some customers may still have old DNS cached
2. **Put Shopify in "Coming Soon" mode** - Prevents new orders on old site
3. **Add redirect** - If possible, redirect Shopify store to new domain

---

### Step 4.2: Customer Communication Plan

**Timeline:**

**7 days before migration:**
- Email all customers about upcoming changes
- Highlight new features (subscriptions, founder pricing)
- Provide FAQ link

**1 day before migration:**
- Send reminder email
- Announce maintenance window
- Provide support contact

**Day of migration:**
- Send "We're live!" email
- Offer migration discount code
- Thank customers for patience

**7 days after migration:**
- Send follow-up survey
- Address any issues
- Celebrate successful launch

---

### Step 4.3: Post-Migration Checklist

**Verify everything works:**

- [ ] Homepage loads correctly
- [ ] All products display properly
- [ ] Product images load
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] Payment processing works (test with real card)
- [ ] Order confirmation emails sent
- [ ] Subscription creation works
- [ ] Admin dashboard accessible
- [ ] Analytics tracking works
- [ ] Mobile responsiveness
- [ ] SSL certificate valid

**Monitor for issues:**

- [ ] Check error logs daily for first week
- [ ] Monitor customer support emails
- [ ] Track conversion rates vs. Shopify baseline
- [ ] Verify no broken links
- [ ] Test all email templates

---

## Phase 5: Shopify Cancellation

### Step 5.1: When to Cancel Shopify

**Recommended timeline:**

- **Week 1-2:** Keep Shopify active as backup
- **Week 3-4:** Monitor new site performance
- **Week 5+:** If everything stable, cancel Shopify

**Before cancelling:**

- [ ] Verify all data exported and imported
- [ ] Confirm no customers using old site
- [ ] Download final backup of Shopify data
- [ ] Export all analytics/reports
- [ ] Cancel Shopify apps first
- [ ] Then cancel Shopify plan

---

### Step 5.2: Cancel Shopify Subscription

**Location:** Shopify Admin → Settings → Plan

**Steps:**

1. Click "Deactivate store"
2. Select reason: "Migrating to another platform"
3. Confirm cancellation
4. Download final data export
5. Save confirmation email

**Billing:** Shopify will prorate your final month

---

## 🚨 Emergency Rollback Plan

**If something goes wrong during migration:**

### Option 1: Revert DNS (Quick - 5 minutes)

1. **Log in to domain registrar**
2. **Change A record back to Shopify IP:**
   ```
   Type: A
   Name: @
   Value: 23.227.38.65 (Shopify's IP - verify current IP first)
   ```
3. **Change CNAME back to Shopify:**
   ```
   Type: CNAME
   Name: www
   Value: shops.myshopify.com
   ```
4. **Wait 5-15 minutes for DNS propagation**
5. **Verify Shopify site loads**

### Option 2: Use Shopify Subdomain (Immediate)

While fixing issues, direct customers to:
```
https://[your-store].myshopify.com
```

This always works regardless of DNS settings.

---

## 📊 Migration Success Metrics

**Track these metrics to measure migration success:**

### Week 1 Post-Migration

- **Uptime:** Target 99.9%
- **Page load time:** <3 seconds
- **Checkout completion rate:** Match or exceed Shopify baseline
- **Customer support tickets:** <10 migration-related issues
- **Conversion rate:** Within 10% of Shopify baseline

### Month 1 Post-Migration

- **Subscription adoption:** Target 40% of customers
- **Founder tier distribution:**
  - Founders (25%): 20% of customers
  - Early Believer (15%): 30% of customers
  - Pre-Launch (10%): 50% of customers
- **MRR growth:** Target 2x vs. Shopify subscriptions
- **Customer satisfaction:** >4.5/5 rating

---

## 🛠️ Troubleshooting Common Issues

### Issue 1: "Site not loading after DNS change"

**Cause:** DNS not propagated yet  
**Solution:** 
- Wait 15-30 minutes
- Clear browser cache
- Try incognito mode
- Check DNS with `dig` command

### Issue 2: "SSL certificate error"

**Cause:** Certificate not provisioned yet  
**Solution:**
- Wait 15 minutes for automatic provisioning
- Verify domain is correctly configured in Manus
- Contact Manus support if persists >1 hour

### Issue 3: "Customers can't log in"

**Cause:** Shopify customers don't have Manus OAuth accounts  
**Solution:**
- Implement "Forgot Password" flow
- Send password reset emails to all migrated customers
- Or: Use email-based magic link login

### Issue 4: "Product images not loading"

**Cause:** Images still pointing to Shopify CDN  
**Solution:**
- Re-upload images to Manus S3 storage
- Update product `imageUrl` fields in database
- Use import script to batch update

### Issue 5: "Subscriptions not working"

**Cause:** Stripe not configured or webhook not set up  
**Solution:**
- Verify Stripe API keys in environment variables
- Check webhook endpoint configured in Stripe dashboard
- Test webhook with Stripe CLI

---

## 📞 Support Resources

**Manus Support:**
- Help Center: https://help.manus.im
- Documentation: Check DATABASE_SCHEMA.md and TESTING_GUIDE.md

**Shopify Export Help:**
- Shopify Help Center: https://help.shopify.com
- Export Guide: https://help.shopify.com/en/manual/shopify-admin/duplicate-store

**DNS Help:**
- DNS Checker: https://dnschecker.org
- DNS Propagation: https://www.whatsmydns.net

---

## ✅ Final Migration Checklist

**Pre-Migration:**
- [ ] Export all Shopify data (customers, products, orders)
- [ ] Create data import scripts
- [ ] Test import on staging database
- [ ] Backup Shopify data locally
- [ ] Prepare customer communication emails
- [ ] Test new Manus site thoroughly

**Migration Day:**
- [ ] Run final Shopify data export
- [ ] Import data to Manus
- [ ] Configure custom domain in Manus
- [ ] Update DNS records at registrar
- [ ] Wait for DNS propagation (15-30 min)
- [ ] Verify new site loads on custom domain
- [ ] Test checkout flow with real payment
- [ ] Send "We're live!" email to customers

**Post-Migration:**
- [ ] Monitor error logs for 7 days
- [ ] Respond to customer support tickets
- [ ] Track conversion metrics
- [ ] Verify all features working
- [ ] Keep Shopify active for 2 weeks as backup
- [ ] Cancel Shopify subscription after verification

---

**Migration Timeline Summary:**

| Day | Task |
|-----|------|
| Day 1 | Export Shopify data, create import scripts |
| Day 2 | Import data to Manus, test thoroughly |
| Day 3 | Configure domain, update DNS, go live |
| Day 4-10 | Monitor, fix issues, support customers |
| Day 11-30 | Verify stability, track metrics |
| Day 31+ | Cancel Shopify if all stable |

---

**Last Updated:** November 11, 2025  
**Version:** 1.0  
**Domain:** optibiosupplements.com  
**Migration Status:** Ready to begin
