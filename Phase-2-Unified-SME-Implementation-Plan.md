# Phase 2: Unified SME Implementation Plan
## The OptiBio Digital Corporation Blueprint

**Document Version:** 2.0 (Unified)  
**Date:** February 3, 2026  
**Project:** OptiBio Supplements E-Commerce Platform  
**Domain:** optibiosupplements.com  
**Methodology:** B-MAD (Build-Measure-Analyze-Decide)

---

## Executive Summary

This unified plan synthesizes three expert frameworks into a single, comprehensive implementation strategy. The goal is not to build a "pretty website" but to construct a **Digital Corporation**—a fully autonomous, revenue-generating, scalable e-commerce operation capable of reaching 9-figure valuation with a lean team.

### Source Framework Analysis

| Framework | Focus | Key Insight | Unique Contribution |
|-----------|-------|-------------|---------------------|
| **Council of 6** | Lean efficiency | "Perfect Skeleton before Organs" | Prioritizes Systems Architect + Brand Guardian first |
| **High-Risk YMYL** | Regulatory safety | Stripe is a risk for supplements | High-risk gateway alternatives (NMI/Authorize.net) |
| **18-SME Operator** | Comprehensive coverage | "Growth without ops = chaos" | Detailed authority/inputs/outputs per role |

### The Unified Model: 8 Core Agents

By consolidating overlapping roles and eliminating redundancy, we arrive at **8 Core Agents** organized into **3 Tiers** based on deployment priority:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE OPTIBIO COUNCIL OF 8                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TIER 1: FOUNDATION (Deploy First)                              │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ 1. SYSTEMS      │  │ 2. COMPLIANCE   │                       │
│  │    ARCHITECT    │  │    GUARDIAN     │                       │
│  │ (Code+Security) │  │ (Legal+FDA/FTC) │                       │
│  └─────────────────┘  └─────────────────┘                       │
│                                                                  │
│  TIER 2: REVENUE ENGINE (Deploy Second)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ 3. FINANCIAL    │  │ 4. AD-TECH      │  │ 5. BRAND        │ │
│  │    CONTROLLER   │  │    ENGINEER     │  │    GUARDIAN     │ │
│  │ (Stripe+Fraud)  │  │ (Pixels+CAPI)   │  │ (UX+CRO+Copy)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│  TIER 3: OPERATIONS (Deploy Third)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ 6. LOGISTICS    │  │ 7. CUSTOMER     │  │ 8. PROGRAM      │ │
│  │    ARCHITECT    │  │    SUCCESS      │  │    DIRECTOR     │ │
│  │ (Ship+Fulfill)  │  │ (CX+Lifecycle)  │  │ (Coordination)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tier 1: Foundation Agents

> **Philosophy:** "Build the Perfect Skeleton before plugging in the Organs"

These agents must complete their work before any revenue flows through the system. A failure here means frozen funds, banned accounts, or legal action.

---

### Agent 1: The Systems Architect

**Consolidated From:** Systems Architect (Council of 6), Full-Stack Security Engineer (YMYL), Frontend Engineer + Backend Engineer + DevOps (18-SME)

**Primary Mission:** Ensure the codebase is production-ready, secure, and won't crash under ad load.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Code Quality** | TypeScript strict mode, error boundaries, no `any` types |
| **Database Integrity** | Prevent overselling, inventory locking, RLS policies |
| **Security** | OWASP Top 10, API key protection, admin role-based access |
| **Performance** | Core Web Vitals, <3s load time, 60fps animations |
| **Infrastructure** | CI/CD, environment separation, rollback procedures |

#### Critical Review Tasks

**1. Stripe Integration Deep Dive**
```typescript
// Webhook reliability check - CRITICAL
// Must handle: checkout.session.completed, payment_intent.succeeded, 
// charge.refunded, charge.dispute.created

// Test event handling (REQUIRED for verification)
if (event.id.startsWith('evt_test_')) {
  return res.json({ verified: true });
}
```

**2. Inventory Oversell Protection**
```typescript
// Database transaction with row locking
await db.transaction(async (tx) => {
  const product = await tx.query.products.findFirst({
    where: eq(products.id, productId),
    for: 'update' // Row lock
  });
  
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  
  await tx.update(products)
    .set({ stock: product.stock - quantity })
    .where(eq(products.id, productId));
});
```

**3. Security Audit Checklist**
- [ ] All API keys in environment variables (not frontend code)
- [ ] Admin panel protected with role-based access
- [ ] SQL injection testing on all inputs
- [ ] XSS vulnerability testing
- [ ] CSRF tokens on all forms
- [ ] Rate limiting on authentication endpoints
- [ ] Session management with HttpOnly, Secure, SameSite cookies

**4. Checkout Stress Test**
- Simulate 100 concurrent checkout attempts
- Verify inventory doesn't go negative
- Confirm no duplicate orders created
- Test payment failure recovery

#### Inputs Required
- Current codebase access
- Database schema documentation
- Stripe API keys (test mode)
- Server access for load testing

#### Outputs Delivered
- [ ] Security audit report (all critical/high findings resolved)
- [ ] Performance benchmark report (Lighthouse >90)
- [ ] Database integrity verification
- [ ] Stress test results
- [ ] Rollback procedure documentation

#### Success Metrics
| Metric | Target |
|--------|--------|
| Lighthouse Performance | >90 |
| Time to First Byte | <200ms |
| Zero TypeScript errors | ✓ |
| Security vulnerabilities | 0 critical/high |
| Checkout success rate | >99.5% |

---

### Agent 2: The Compliance Guardian

**Consolidated From:** Compliance Officer (Council of 6), FDA/DSHEA Expert + Legal Counsel (YMYL), Regulatory Compliance (18-SME)

**Primary Mission:** Protect the business from FDA warning letters, FTC action, ad account bans, and payment processor freezes.

> **Critical Warning:** One non-compliant sentence can get ads banned, trigger FDA warning letters, or freeze Stripe funds.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **FDA/DSHEA** | Claims audit, disclaimer placement, structure/function compliance |
| **FTC** | Testimonial substantiation, "results may vary" disclaimers |
| **Ad Platforms** | Google/Meta health & wellness policy compliance |
| **Stripe** | Nutraceutical merchant requirements |
| **Legal Documents** | Terms, Privacy Policy, Refund Policy, Cookie Consent |

#### Critical Review Tasks

**1. Claims Audit Matrix**

| Claim Type | Allowed? | Example |
|------------|----------|---------|
| Structure/Function | ✅ YES | "Supports healthy stress response" |
| Disease Treatment | ❌ NO | "Treats anxiety" |
| Disease Prevention | ❌ NO | "Prevents insomnia" |
| Cure Claims | ❌ NO | "Cures depression" |
| Clinical Reference | ⚠️ CAREFUL | "Clinically studied ingredient" (must cite study) |

**2. Mandatory Disclaimer Injection**

Every product page and checkout must display:

> *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.*

**3. Testimonial Compliance**

All testimonials must include:
- "Individual results may vary"
- No disease claims in customer quotes
- Verified buyer status indicated

**4. Legal Document Requirements**

| Document | Key Elements | Placement |
|----------|--------------|-----------|
| **Terms of Service** | Purchase terms, limitation of liability, dispute resolution, governing law | Footer link, checkout |
| **Privacy Policy** | Data collected, third-party sharing (Stripe, carriers, analytics), GDPR/CCPA rights | Footer link, checkout |
| **Refund Policy** | 90-day guarantee terms, condition requirements, processing timeline | Footer link, product page, checkout |
| **Shipping Policy** | Delivery estimates, carrier options, international restrictions | Footer link, checkout |
| **Cookie Policy** | Tracking disclosure, consent mechanism | Banner, footer link |

**5. Stripe Nutraceutical Compliance**

Stripe has specific requirements for supplement merchants:
- Clear product descriptions (no vague health claims)
- Visible contact information
- Clear refund policy
- No auto-ship without explicit consent
- Proper subscription cancellation flow

**6. Ad Platform Policy Pre-Check**

| Platform | Policy | Pre-Launch Audit |
|----------|--------|------------------|
| Google Ads | Healthcare & Medicines | Landing page claims review |
| Meta Ads | Health & Wellness | Ad copy + landing page review |
| Google Merchant | Prohibited Products | Product feed compliance |

#### Inputs Required
- All website copy (homepage, product pages, checkout)
- All email templates
- All ad copy drafts
- Product labels/Supplement Facts

#### Outputs Delivered
- [ ] Claims audit report with required changes
- [ ] FDA disclaimer implementation verified
- [ ] All legal pages drafted and live
- [ ] Ad platform pre-submission compliance report
- [ ] Stripe merchant compliance checklist completed

#### Success Metrics
| Metric | Target |
|--------|--------|
| Disease claims found | 0 |
| FDA disclaimers present | 100% of pages |
| Legal pages live | All 5 |
| Ad account ban risk | Low |

---

## Tier 2: Revenue Engine Agents

> **Philosophy:** "If tracking is wrong, everything downstream is wrong"

These agents directly influence how much money you make. Deploy after Tier 1 is complete.

---

### Agent 3: The Financial Controller

**Consolidated From:** Financial Controller (Council of 6), High-Risk Payment Architect (YMYL), Payment & Fraud Specialist (18-SME)

**Primary Mission:** Secure stable payment infrastructure, prevent chargebacks, and ensure every dollar is tracked.

> **Critical Warning:** Stripe frequently terminates supplement accounts without warning. This agent implements protective measures.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Payment Gateway** | Stripe configuration, webhook reliability, backup gateway consideration |
| **Fraud Prevention** | Stripe Radar rules, 3D Secure, AVS/CVV verification |
| **Chargeback Defense** | Evidence collection, dispute workflow, prevention rules |
| **Unit Economics** | Real profit per order after fees, shipping, discounts |
| **Subscription** | Future Subscribe & Save compliance (Visa/MC rules) |

#### Critical Review Tasks

**1. Stripe Configuration Audit**

```typescript
// Checkout session with all protective metadata
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  customer_email: user.email,
  client_reference_id: user.id.toString(),
  metadata: {
    user_id: user.id.toString(),
    customer_email: user.email,
    customer_name: user.name,
    order_type: 'pre-order',
    ip_address: req.ip, // For fraud evidence
  },
  payment_intent_data: {
    metadata: {
      user_id: user.id.toString(),
      order_id: orderId,
    },
    statement_descriptor: 'OPTIBIO SUPPL', // 22 char max
    statement_descriptor_suffix: 'KSM66', // 22 char max
  },
  line_items: [...],
  allow_promotion_codes: true,
  billing_address_collection: 'required', // For fraud prevention
  shipping_address_collection: {
    allowed_countries: ['US'],
  },
  success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/order/cancelled`,
});
```

**2. Fraud Prevention Rules (Stripe Radar)**

| Rule | Action | Rationale |
|------|--------|-----------|
| Billing/shipping ZIP mismatch | Review | Common fraud indicator |
| Card country ≠ IP country | Review | International fraud |
| >3 failed attempts same card | Block | Card testing |
| Order >$500 first purchase | Review | High-value fraud |
| Disposable email domain | Review | Fraud indicator |

**3. Chargeback Defense Workflow**

```
Dispute Received → Auto-collect evidence → 
Submit within 7 days → Track outcome → 
Update Radar rules if pattern detected
```

Evidence to auto-collect:
- Order confirmation email (with timestamp)
- Shipping confirmation with tracking
- Delivery confirmation
- Customer IP address and device fingerprint
- Billing/shipping address match

**4. Unit Economics Calculator**

| Line Item | Amount |
|-----------|--------|
| Sale Price (3-bottle) | $76.55 |
| - Stripe Fee (2.9% + $0.30) | -$2.52 |
| - Product Cost | -$XX.XX |
| - Shipping Cost | -$X.XX |
| - Packaging | -$X.XX |
| **= Gross Profit** | **$XX.XX** |
| Gross Margin | XX% |

**5. High-Risk Gateway Consideration**

> **Advisory:** While Stripe is currently configured, monitor for account warnings. If Stripe shows risk signals, have backup gateway ready:
> - **NMI** - High-risk friendly, supplement experience
> - **Authorize.net** - Established, supplement-tolerant
> - **PayKickstart** - Built for supplement/info products

#### Inputs Required
- Stripe account access
- Historical chargeback data (if any)
- Product costs and margins
- Shipping cost estimates

#### Outputs Delivered
- [ ] Stripe Radar rules configured
- [ ] Webhook handlers for all payment events
- [ ] Chargeback evidence auto-collection system
- [ ] Unit economics spreadsheet
- [ ] Refund workflow tested
- [ ] Backup gateway research document

#### Success Metrics
| Metric | Target |
|--------|--------|
| Payment success rate | >98% |
| Chargeback rate | <0.5% |
| Fraud rate | <0.1% |
| Refund processing time | <48 hours |

---

### Agent 4: The Ad-Tech Engineer

**Consolidated From:** Ad-Tech Engineer (Council of 6), Technical SEO & Ad-Tech Specialist (YMYL), Tracking Engineer + Performance Marketer (18-SME)

**Primary Mission:** Ensure every dollar spent on Google/Meta is measured accurately, and the site is ready for aggressive ad scaling.

> **Critical Warning:** If you run ads without this exact setup, you are burning money.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Google Tag Manager** | Container setup, event triggers, data layer |
| **GA4** | Enhanced e-commerce, custom events, audiences |
| **Meta Pixel** | Browser-side events, deduplication |
| **Meta CAPI** | Server-side tracking (iOS 14+ recovery) |
| **Google Ads** | Conversion actions, enhanced conversions |
| **Merchant Center** | Product feed, policy compliance |
| **Schema Markup** | Product, Review, FAQ structured data |

#### Critical Review Tasks

**1. Google Tag Manager Data Layer**

```javascript
// Purchase event (CRITICAL - must fire on order confirmation)
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'OPT-2026-00001',
    'value': 76.55,
    'tax': 0,
    'shipping': 0,
    'currency': 'USD',
    'items': [{
      'item_id': 'ASH-KSM-90',
      'item_name': 'Ashwagandha KSM-66 90 Capsules',
      'item_brand': 'OptiBio',
      'item_category': 'Supplements',
      'price': 25.52,
      'quantity': 3
    }]
  }
});
```

**2. Meta Pixel + CAPI Dual Implementation**

```javascript
// Browser-side (Pixel)
fbq('track', 'Purchase', {
  content_ids: ['ASH-KSM-90'],
  content_type: 'product',
  value: 76.55,
  currency: 'USD',
  content_name: 'Ashwagandha KSM-66',
  num_items: 3,
  event_id: 'purchase_OPT-2026-00001' // For deduplication
});
```

```typescript
// Server-side (CAPI) - CRITICAL for iOS 14+ accuracy
const response = await fetch(
  `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: 'purchase_OPT-2026-00001', // Same as browser for dedup
        event_source_url: orderConfirmationUrl,
        action_source: 'website',
        user_data: {
          em: [hashSHA256(user.email.toLowerCase())],
          ph: [hashSHA256(user.phone)],
          fn: [hashSHA256(user.firstName.toLowerCase())],
          ln: [hashSHA256(user.lastName.toLowerCase())],
          ct: [hashSHA256(user.city.toLowerCase())],
          st: [hashSHA256(user.state.toLowerCase())],
          zp: [hashSHA256(user.zip)],
          country: [hashSHA256('us')],
          client_ip_address: req.ip,
          client_user_agent: req.headers['user-agent'],
          fbc: req.cookies._fbc,
          fbp: req.cookies._fbp,
        },
        custom_data: {
          currency: 'USD',
          value: 76.55,
          content_ids: ['ASH-KSM-90'],
          content_type: 'product',
          num_items: 3,
        }
      }],
      access_token: META_ACCESS_TOKEN
    })
  }
);
```

**3. Event Tracking Matrix**

| Event | GTM Trigger | Meta Pixel | Meta CAPI | Google Ads |
|-------|-------------|------------|-----------|------------|
| Page View | All pages | ✅ | ✅ | - |
| View Content | Product page | ✅ | ✅ | - |
| Add to Cart | Cart button click | ✅ | ✅ | ✅ |
| Begin Checkout | Checkout page load | ✅ | ✅ | ✅ |
| Purchase | Order confirmation | ✅ | ✅ | ✅ |

**4. Google Merchant Center Product Feed**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" 
      xmlns:g="http://base.google.com/ns/1.0">
  <entry>
    <g:id>ASH-KSM-90</g:id>
    <g:title>OptiBio Ashwagandha KSM-66 - 90 Capsules</g:title>
    <g:description>Premium KSM-66 Ashwagandha root extract...</g:description>
    <g:link>https://optibiosupplements.com/product/ashwagandha</g:link>
    <g:image_link>https://optibiosupplements.com/images/product.jpg</g:image_link>
    <g:availability>preorder</g:availability>
    <g:price>28.35 USD</g:price>
    <g:sale_price>28.35 USD</g:sale_price>
    <g:brand>OptiBio</g:brand>
    <g:condition>new</g:condition>
    <g:product_type>Health > Supplements > Herbal</g:product_type>
  </entry>
</feed>
```

**5. Schema Markup Implementation**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "OptiBio Ashwagandha KSM-66",
  "image": "https://optibiosupplements.com/images/product.jpg",
  "description": "Premium KSM-66 Ashwagandha root extract...",
  "brand": {
    "@type": "Brand",
    "name": "OptiBio"
  },
  "offers": {
    "@type": "Offer",
    "price": "28.35",
    "priceCurrency": "USD",
    "availability": "https://schema.org/PreOrder",
    "priceValidUntil": "2026-02-21"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2847"
  }
}
```

#### Inputs Required
- GTM container ID
- GA4 property ID
- Meta Pixel ID
- Meta CAPI access token
- Google Ads conversion IDs
- Merchant Center account

#### Outputs Delivered
- [ ] GTM container with all events configured
- [ ] GA4 enhanced e-commerce verified
- [ ] Meta Pixel events firing correctly
- [ ] Meta CAPI sending server-side events
- [ ] Event Match Quality score >6.0
- [ ] Google Merchant Center feed approved
- [ ] Schema markup validated
- [ ] Conversion tracking verification report

#### Success Metrics
| Metric | Target |
|--------|--------|
| Meta Event Match Quality | >6.0 |
| GA4 purchase events | 100% accuracy |
| Google Ads conversion tracking | Verified |
| Merchant Center status | Approved |

---

### Agent 5: The Brand Guardian

**Consolidated From:** Brand Guardian (Council of 6), CRO Specialist + Copywriter (18-SME)

**Primary Mission:** Enforce the "Clinical Luxury" aesthetic and ensure every pixel drives conversion.

> **Philosophy:** "Design ≠ Conversion. CRO is behavioral psychology + data."

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Visual QA** | Color consistency, typography, spacing system |
| **Mobile Responsiveness** | Thumb zones, touch targets, mobile stack |
| **Conversion Elements** | CTA placement, trust signals, urgency |
| **Copy** | Headlines, product descriptions, CTAs, emails |
| **Consistency** | Same look across all pages and touchpoints |

#### Critical Review Tasks

**1. Design System Enforcement**

| Element | Specification | Verification |
|---------|---------------|--------------|
| Primary Navy | #1A2840 | Headlines, CTAs |
| Accent Gold | #C9A961 | Trust badges, icons |
| Background Blue | #F5FAFD → #E8F4FC | Hero gradient |
| Headline Font | Playfair Display | Serif, elegant |
| Body Font | Inter | Sans-serif, readable |
| CTA Button | Navy with hover state | 44px+ height |

**2. Mobile Responsiveness Audit**

```
Mobile Stack Order (375px):
1. Trust Badge ("Science-Backed")
2. Headline
3. Subheadline
4. Product Image (with glow)
5. Bundle Selector
6. Price + CTA
7. Trust Icons
8. Social Proof
```

**3. Conversion Element Checklist**

- [ ] Above-fold contains: Value prop, price, CTA
- [ ] Trust signals visible before CTA
- [ ] Social proof near purchase decision
- [ ] Urgency element (countdown) present
- [ ] Price anchoring clear ($69.99 → $28.35)
- [ ] Guarantee prominent (90-day badge)
- [ ] "See the science" link for research buyers

**4. Copy Audit Matrix**

| Element | Current | Optimized | Why |
|---------|---------|-----------|-----|
| Headline | Feature-driven | Benefit-driven | Emotional connection |
| CTA | "Buy Now" | "Start Your Ritual" | Aspirational |
| Subhead | Generic | Specific outcome | Clarity |
| Testimonials | Generic praise | Specific results | Credibility |

**5. Consistency Check**

| Element | Homepage | Product Page | Cart | Checkout |
|---------|----------|--------------|------|----------|
| Yellow Guarantee Box | ✓ | ✓ | ✓ | ✓ |
| Green Social Proof | ✓ | ✓ | - | - |
| Trust Badges | ✓ | ✓ | ✓ | ✓ |
| Navy CTA | ✓ | ✓ | ✓ | ✓ |

#### Inputs Required
- Design system documentation
- Current page screenshots (desktop + mobile)
- Competitor analysis
- Customer feedback/reviews

#### Outputs Delivered
- [ ] Visual QA report with fixes applied
- [ ] Mobile responsiveness verified (375px-1920px)
- [ ] All copy optimized for conversion
- [ ] Consistency audit passed
- [ ] A/B test recommendations documented

#### Success Metrics
| Metric | Target |
|--------|--------|
| Mobile Lighthouse score | >90 |
| Touch targets | 44px+ |
| Design consistency | 100% |
| Copy compliance | FDA/FTC safe |

---

## Tier 3: Operations Agents

> **Philosophy:** "Growth without ops = chaos"

These agents ensure the business can scale without breaking. Deploy after Tiers 1 and 2 are complete.

---

### Agent 6: The Logistics Architect

**Consolidated From:** Logistics Architect (Council of 6), Shipping Integration Specialist (YMYL), Shipping & Operations (18-SME)

**Primary Mission:** Build the internal fulfillment workflow so orders ship with one click.

> **Critical Warning:** Without this agent, you will be copy-pasting addresses manually 500 times a day.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Carrier APIs** | FedEx, UPS, USPS integration via EasyPost/Shippo |
| **Label Generation** | 4x6 thermal labels, batch printing |
| **Packing Slips** | Branded, professional, with order details |
| **Rate Shopping** | Auto-select cheapest carrier for delivery window |
| **Tracking** | Auto-update orders, webhook from carriers |

#### Critical Review Tasks

**1. Shipping Aggregator Selection**

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **EasyPost** | Simple API, good rates | Less carrier options | ✅ Recommended |
| **Shippo** | More carriers, good UI | Slightly higher rates | Alternative |
| **ShipStation** | Full-featured | Monthly fee, overkill for single product | Not needed |

**2. Carrier Integration Architecture**

```typescript
// EasyPost integration example
import EasyPost from '@easypost/api';

const client = new EasyPost(process.env.EASYPOST_API_KEY);

// Create shipment and get rates
const shipment = await client.Shipment.create({
  from_address: {
    company: 'OptiBio Supplements',
    street1: '84 Bonita Vista Road',
    city: 'Mount Vernon',
    state: 'NY',
    zip: '10552',
    country: 'US',
    phone: '555-555-5555',
  },
  to_address: {
    name: order.customerName,
    street1: order.shippingAddress.street1,
    street2: order.shippingAddress.street2,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    zip: order.shippingAddress.zip,
    country: 'US',
    phone: order.customerPhone,
  },
  parcel: {
    length: 6,
    width: 4,
    height: 4,
    weight: 8, // ounces
  },
});

// Rate shop - get cheapest option
const cheapestRate = shipment.lowestRate(['USPS', 'UPS', 'FedEx']);

// Buy label
const purchasedShipment = await client.Shipment.buy(
  shipment.id,
  cheapestRate
);

// Get label URL and tracking number
const labelUrl = purchasedShipment.postage_label.label_url;
const trackingNumber = purchasedShipment.tracking_code;
```

**3. Packing Slip Template**

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  [OPTIBIO LOGO]                         PACKING SLIP       │
│                                                            │
│  Order #: OPT-2026-00001                                   │
│  Date: February 3, 2026                                    │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  SHIP TO:                                                  │
│  John Smith                                                │
│  123 Main Street, Apt 4B                                   │
│  New York, NY 10001                                        │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  ITEMS:                                                    │
│  ┌──────┬─────────────┬────────────────────────┬────────┐ │
│  │ QTY  │ SKU         │ DESCRIPTION            │ STATUS │ │
│  ├──────┼─────────────┼────────────────────────┼────────┤ │
│  │  3   │ ASH-KSM-90  │ Ashwagandha KSM-66     │   ✓    │ │
│  │      │             │ 90 Capsules            │        │ │
│  └──────┴─────────────┴────────────────────────┴────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  Thank you for choosing OptiBio!                           │
│                                                            │
│  Questions? support@optibiosupplements.com                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 90-DAY MONEY-BACK GUARANTEE                          │ │
│  │ Not satisfied? Return for a full refund.             │ │
│  │ Visit: optibiosupplements.com/returns                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [BARCODE: OPT-2026-00001]                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**4. Admin Fulfillment Dashboard**

| Feature | Description |
|---------|-------------|
| Order Queue | Filter by status: New, Processing, Shipped, Delivered |
| Batch Select | Select multiple orders for bulk label generation |
| One-Click Ship | Generate label + packing slip + mark shipped |
| Print Queue | Send labels to thermal printer |
| Tracking Sync | Auto-update from carrier webhooks |

**5. Inventory Protection**

```typescript
// Prevent overselling
const processOrder = async (orderId: string) => {
  await db.transaction(async (tx) => {
    // Lock inventory row
    const inventory = await tx.query.inventory.findFirst({
      where: eq(inventory.sku, 'ASH-KSM-90'),
      for: 'update'
    });
    
    if (inventory.quantity < orderQuantity) {
      throw new Error('INSUFFICIENT_STOCK');
    }
    
    // Decrement immediately
    await tx.update(inventory)
      .set({ quantity: inventory.quantity - orderQuantity })
      .where(eq(inventory.sku, 'ASH-KSM-90'));
  });
};
```

#### Inputs Required
- EasyPost/Shippo API key
- Ship-from address
- Product dimensions and weights
- Thermal printer specifications

#### Outputs Delivered
- [ ] Carrier API integration (FedEx, UPS, USPS)
- [ ] Rate shopping returning cheapest option
- [ ] Label generation (4x6 thermal PDF)
- [ ] Packing slip generation (branded PDF)
- [ ] Admin fulfillment dashboard
- [ ] Tracking webhook integration
- [ ] Inventory sync on order placement

#### Success Metrics
| Metric | Target |
|--------|--------|
| Label generation time | <3 seconds |
| Rate accuracy | 100% |
| Tracking updates | Real-time |
| Oversell incidents | 0 |

---

### Agent 7: The Customer Success Architect

**Consolidated From:** Customer Communications (Council of 6), CX Systems Expert + Email/SMS Marketer (18-SME)

**Primary Mission:** Ensure customers are informed at every stage and issues are resolved quickly.

> **Insight:** Email/SMS often drives 30-40% of total revenue through lifecycle marketing.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Transactional Emails** | Order confirmation, shipping, delivery |
| **Lifecycle Marketing** | Abandoned cart, review requests, reorder |
| **Support System** | Help center, contact form, ticket management |
| **Communication Triggers** | Automated workflows based on order status |

#### Critical Review Tasks

**1. Transactional Email Suite**

| Trigger | Email | Timing | Content |
|---------|-------|--------|---------|
| Order Placed | Order Confirmation | Immediate | Order summary, estimated delivery |
| Label Created | Shipping Confirmation | Immediate | Tracking number, carrier, ETA |
| In Transit | Shipping Update | On carrier scan | Current location, updated ETA |
| Out for Delivery | Delivery Alert | Morning of | Expect today notification |
| Delivered | Delivery Confirmation | On delivery | Confirmation + how to use |
| 7 Days Post-Delivery | Review Request | Scheduled | Ask for review + referral |
| 30 Days Post-Delivery | Reorder Reminder | Scheduled | Running low? Reorder now |

**2. Abandoned Cart Recovery**

```
Trigger: Cart created but no purchase within 1 hour

Email 1 (1 hour): "You left something behind"
- Show cart contents
- Include product image
- CTA: Complete your order

Email 2 (24 hours): "Still thinking about it?"
- Social proof (reviews)
- Guarantee reminder
- CTA: Complete your order

Email 3 (72 hours): "Last chance"
- Urgency (limited stock)
- Optional: Small discount
- CTA: Complete your order
```

**3. Help Center Structure**

| Category | Articles |
|----------|----------|
| **Orders** | Track my order, Cancel order, Modify order |
| **Shipping** | Delivery times, International shipping, Lost package |
| **Returns** | Return policy, Start a return, Refund status |
| **Product** | How to take, Ingredients, Side effects |
| **Account** | Create account, Reset password, Update info |
| **Billing** | Payment methods, Invoice request, Promo codes |

**4. Support Workflow**

```
Customer Contact → Auto-categorize → 
Route to appropriate queue → 
SLA timer starts → Agent response → 
Resolution → Satisfaction survey
```

| Category | SLA | Escalation |
|----------|-----|------------|
| Order status | 4 hours | Auto if >24h |
| Refund request | 24 hours | Manager if disputed |
| Product issue | 24 hours | Quality team |
| Billing dispute | 4 hours | Finance team |

#### Inputs Required
- Email service provider (SendGrid/Resend)
- SMS provider (Twilio) - optional
- Help desk platform (or build custom)
- Email templates brand guidelines

#### Outputs Delivered
- [ ] All transactional emails designed and tested
- [ ] Abandoned cart sequence active
- [ ] Help center/FAQ page live
- [ ] Contact form with ticket creation
- [ ] Support email configured
- [ ] Review request automation
- [ ] Reorder reminder automation

#### Success Metrics
| Metric | Target |
|--------|--------|
| Email delivery rate | >98% |
| Abandoned cart recovery | >10% |
| Support response time | <24 hours |
| Customer satisfaction | >4.5/5 |

---

### Agent 8: The Program Director

**Consolidated From:** E-Commerce Program Manager (18-SME)

**Primary Mission:** Coordinate all SME agents, prevent conflicting implementations, and maintain single source of truth.

> **Critical Role:** Without this, SMEs work against each other.

#### Authority & Scope

| Domain | Responsibility |
|--------|----------------|
| **Coordination** | Ensure agents don't conflict |
| **Documentation** | Maintain single source of truth |
| **Scope Control** | Prevent scope creep |
| **Quality Gates** | Verify each tier before proceeding |
| **Timeline** | Keep implementation on schedule |

#### Critical Review Tasks

**1. Implementation Dependency Map**

```
                    ┌─────────────────┐
                    │ TIER 1: FOUNDATION │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   │
┌─────────────────┐ ┌─────────────────┐         │
│ 1. Systems      │ │ 2. Compliance   │         │
│    Architect    │ │    Guardian     │         │
└────────┬────────┘ └────────┬────────┘         │
         │                   │                   │
         └─────────┬─────────┘                   │
                   │                             │
                   ▼                             │
         ┌─────────────────┐                     │
         │ QUALITY GATE 1  │                     │
         │ Site functional │                     │
         │ Legal compliant │                     │
         └────────┬────────┘                     │
                  │                              │
                  ▼                              │
         ┌─────────────────┐                     │
         │ TIER 2: REVENUE │                     │
         └────────┬────────┘                     │
                  │                              │
    ┌─────────────┼─────────────┐               │
    │             │             │               │
    ▼             ▼             ▼               │
┌────────┐ ┌──────────┐ ┌────────────┐         │
│ 3. Fin │ │ 4. AdTech│ │ 5. Brand   │         │
│ Control│ │ Engineer │ │ Guardian   │         │
└───┬────┘ └────┬─────┘ └─────┬──────┘         │
    │           │             │                 │
    └───────────┼─────────────┘                 │
                │                               │
                ▼                               │
       ┌─────────────────┐                      │
       │ QUALITY GATE 2  │                      │
       │ Payments work   │                      │
       │ Tracking works  │                      │
       │ Design polished │                      │
       └────────┬────────┘                      │
                │                               │
                ▼                               │
       ┌─────────────────┐                      │
       │ TIER 3: OPS     │                      │
       └────────┬────────┘                      │
                │                               │
    ┌───────────┼───────────┐                   │
    │           │           │                   │
    ▼           ▼           ▼                   │
┌────────┐ ┌────────┐ ┌──────────┐             │
│ 6. Log │ │ 7. CX  │ │ 8. Prog  │◄────────────┘
│ Archit │ │ Archit │ │ Director │ (Coordinates all)
└───┬────┘ └───┬────┘ └──────────┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│ QUALITY GATE 3  │
│ Orders ship     │
│ Customers happy │
│ Business runs   │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │ LAUNCH  │
    └─────────┘
```

**2. Quality Gate Definitions**

| Gate | Requirements | Verification |
|------|--------------|--------------|
| **Gate 1** | Site loads <3s, security audit passed, legal pages live, FDA disclaimers present | Lighthouse + manual review |
| **Gate 2** | Test payment completes, all tracking events verified, design consistency 100% | End-to-end test + pixel debugger |
| **Gate 3** | Label generates, packing slip prints, emails send, support system works | Full order simulation |

**3. Single Source of Truth**

| Document | Location | Owner |
|----------|----------|-------|
| Codebase | GitHub repo | Systems Architect |
| Design System | design-system.md | Brand Guardian |
| Legal Docs | /legal folder | Compliance Guardian |
| API Keys | Environment secrets | Systems Architect |
| Tracking IDs | GTM container | Ad-Tech Engineer |
| Shipping Config | Admin settings | Logistics Architect |

**4. Conflict Resolution Matrix**

| Conflict | Resolution | Escalation |
|----------|------------|------------|
| Design vs Performance | Performance wins (CWV) | Program Director |
| Legal vs Marketing | Legal wins (compliance) | Compliance Guardian |
| Feature vs Timeline | Timeline wins (MVP) | Program Director |
| Cost vs Quality | Quality wins (brand) | Program Director |

#### Inputs Required
- All agent status reports
- Timeline and milestones
- Resource constraints
- Business priorities

#### Outputs Delivered
- [ ] Implementation timeline with milestones
- [ ] Agent coordination schedule
- [ ] Quality gate checklists
- [ ] Risk register with mitigations
- [ ] Status dashboard
- [ ] Launch readiness checklist

#### Success Metrics
| Metric | Target |
|--------|--------|
| Milestones on time | >90% |
| Agent conflicts | 0 unresolved |
| Quality gates passed | All 3 |
| Launch date | On schedule |

---

## Implementation Timeline

```
WEEK 1-2: TIER 1 (FOUNDATION)
├── Day 1-3:   Systems Architect - Security audit, code review
├── Day 4-7:   Systems Architect - Performance optimization
├── Day 8-10:  Compliance Guardian - Claims audit, legal docs
├── Day 11-14: Compliance Guardian - Stripe compliance, ad policy
└── QUALITY GATE 1 ✓

WEEK 2-3: TIER 2 (REVENUE ENGINE)
├── Day 15-17: Financial Controller - Stripe config, fraud rules
├── Day 18-21: Ad-Tech Engineer - GTM, Pixel, CAPI
├── Day 22-24: Ad-Tech Engineer - Merchant Center, Schema
├── Day 25-28: Brand Guardian - Visual QA, copy optimization
└── QUALITY GATE 2 ✓

WEEK 4-5: TIER 3 (OPERATIONS)
├── Day 29-32: Logistics Architect - Carrier APIs, labels
├── Day 33-35: Logistics Architect - Admin dashboard, inventory
├── Day 36-38: Customer Success - Emails, help center
├── Day 39-42: Program Director - Final coordination, launch prep
└── QUALITY GATE 3 ✓

WEEK 6: LAUNCH
├── Day 43-44: Final testing, soft launch
├── Day 45:    LAUNCH DAY
└── Day 46-49: Post-launch monitoring and fixes
```

---

## Agent Deployment Matrix

| Agent | AI-First? | Human Review | Estimated Hours |
|-------|-----------|--------------|-----------------|
| 1. Systems Architect | ✅ Yes | Code review | 20-30 |
| 2. Compliance Guardian | ⚠️ Partial | Legal review | 15-20 |
| 3. Financial Controller | ✅ Yes | Stripe test | 10-15 |
| 4. Ad-Tech Engineer | ✅ Yes | Pixel verify | 15-20 |
| 5. Brand Guardian | ✅ Yes | Visual QA | 15-20 |
| 6. Logistics Architect | ✅ Yes | Ship test | 15-20 |
| 7. Customer Success | ✅ Yes | Email test | 10-15 |
| 8. Program Director | ✅ Yes | Milestone review | Ongoing |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Stripe account freeze | Medium | Critical | Backup gateway research, compliance-first |
| Ad account ban | Medium | High | Pre-submission compliance review |
| Carrier API downtime | Low | Medium | Multi-carrier fallback |
| Launch traffic spike | Medium | Medium | Load testing, CDN caching |
| Chargeback spike | Low | High | Fraud rules, evidence collection |
| Inventory oversell | Low | High | Database locking, real-time sync |

---

## Success Criteria

**Phase 2 is complete when:**

1. ✅ Customer can complete purchase end-to-end (Stripe test mode)
2. ✅ Order can be fulfilled with printed label and packing slip
3. ✅ Customer receives all transactional emails with tracking
4. ✅ Google Ads campaigns can be launched (tracking verified)
5. ✅ Meta Ads campaigns can be launched (CAPI verified)
6. ✅ All legal/compliance requirements met (FDA, FTC, Stripe)
7. ✅ Admin can manage orders, inventory, and customers
8. ✅ Analytics tracking all key events accurately
9. ✅ Site loads <3 seconds with Lighthouse >90
10. ✅ All quality gates passed

---

## Next Steps

Upon approval of this unified plan:

1. **Initialize Agent 1 (Systems Architect)** to begin security audit and code review
2. **Initialize Agent 2 (Compliance Guardian)** in parallel to begin claims audit
3. Progress through tiers sequentially, passing quality gates
4. Program Director coordinates throughout

---

**Document Prepared By:** Manus AI  
**Methodology:** B-MAD (Build-Measure-Analyze-Decide)  
**Sources Integrated:** Council of 6, High-Risk YMYL Framework, 18-SME Operator Model  
**Ready for:** Phase 2 Execution
