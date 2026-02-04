# Phase 2: SME Agent Implementation Plan

**Document Version:** 1.0  
**Date:** February 3, 2026  
**Project:** OptiBio Supplements E-Commerce Platform  
**Domain:** optibiosupplements.com  
**Methodology:** B-MAD (Build-Measure-Analyze-Decide)

---

## Executive Summary

Phase 2 transforms the 21 identified SME roles into actionable implementation sprints. The plan is organized into **5 sequential waves** over an estimated **4-6 week timeline**, with each wave building upon the previous to create a fully operational e-commerce business capable of processing payments, fulfilling orders, and running paid advertising campaigns.

---

## Implementation Architecture

### Wave Structure Overview

| Wave | Focus | Duration | SME Agents | Outcome |
|------|-------|----------|------------|---------|
| **Wave 1** | Foundation | Week 1-2 | 6 agents | Site functional, payments working |
| **Wave 2** | Fulfillment | Week 2-3 | 4 agents | Orders can be shipped |
| **Wave 3** | Marketing | Week 3-4 | 4 agents | Ad platforms configured |
| **Wave 4** | Experience | Week 4-5 | 4 agents | UX polished, copy optimized |
| **Wave 5** | Operations | Week 5-6 | 3 agents | Full business operations |

---

## Wave 1: Foundation (Critical Infrastructure)

**Objective:** Establish core technical infrastructure, payment processing, and legal compliance to enable the site to legally accept orders.

### Sprint 1.1: Technical Foundation

#### Agent 1.1.1: Full-Stack Web Developer

**Activation Prompt:**
```
You are the Lead Full-Stack Web Developer for OptiBio Supplements. Your expertise spans React 19, TypeScript, tRPC, Tailwind CSS 4, and Node.js/Express. You are responsible for ensuring the codebase is production-ready, performant, and maintainable.
```

**Review Checklist:**
- [ ] Audit all React components for proper error boundaries
- [ ] Verify TypeScript strict mode compliance (no `any` types)
- [ ] Review tRPC router structure and procedure organization
- [ ] Audit API response times (target: <200ms for all endpoints)
- [ ] Verify responsive breakpoints (mobile, tablet, desktop)
- [ ] Check Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Review error handling and user-facing error messages
- [ ] Audit console for warnings/errors in production build

**Implementation Tasks:**
1. Run Lighthouse audit and fix all critical issues
2. Implement proper loading states for all async operations
3. Add error boundaries around critical components
4. Optimize images (WebP format, lazy loading)
5. Implement proper SEO meta tags on all pages

**Deliverables:**
- [ ] Lighthouse score >90 for Performance, Accessibility, SEO
- [ ] Zero TypeScript errors in strict mode
- [ ] All pages render correctly on mobile (375px) to desktop (1920px)

---

#### Agent 1.1.2: Database Administrator

**Activation Prompt:**
```
You are the Database Administrator for OptiBio Supplements. You specialize in MySQL/TiDB, Drizzle ORM, and database optimization. You ensure data integrity, query performance, and proper backup procedures.
```

**Review Checklist:**
- [ ] Audit schema for proper normalization
- [ ] Verify all foreign key relationships
- [ ] Check index coverage for common queries
- [ ] Review connection pooling configuration
- [ ] Audit for N+1 query problems
- [ ] Verify PII encryption at rest

**Implementation Tasks:**
1. Create database schema documentation
2. Implement automated daily backups
3. Add indexes for order lookup, user lookup, product queries
4. Create database migration rollback procedures
5. Set up query performance monitoring

**Deliverables:**
- [ ] Schema diagram with all relationships documented
- [ ] Backup verification test completed
- [ ] Query response times <50ms for common operations

---

#### Agent 1.1.3: Security Engineer

**Activation Prompt:**
```
You are the Security Engineer for OptiBio Supplements. You specialize in application security, PCI DSS compliance, and data protection. You ensure the platform is secure against common attack vectors and compliant with privacy regulations.
```

**Review Checklist:**
- [ ] OWASP Top 10 vulnerability scan
- [ ] SQL injection testing on all inputs
- [ ] XSS vulnerability testing
- [ ] CSRF token implementation verification
- [ ] Session management security audit
- [ ] API rate limiting implementation
- [ ] HTTPS enforcement verification
- [ ] Cookie security flags (HttpOnly, Secure, SameSite)

**Implementation Tasks:**
1. Implement Content Security Policy headers
2. Add rate limiting to authentication endpoints
3. Implement account lockout after failed attempts
4. Add security headers (X-Frame-Options, X-Content-Type-Options)
5. Create security incident response procedure

**Deliverables:**
- [ ] Security audit report with all findings addressed
- [ ] PCI DSS self-assessment questionnaire completed
- [ ] Penetration test results (no critical/high findings)

---

### Sprint 1.2: Payment Infrastructure

#### Agent 1.2.1: Payment Systems Architect

**Activation Prompt:**
```
You are the Payment Systems Architect for OptiBio Supplements. You are an expert in Stripe integration, payment flows, webhook handling, and PCI compliance. You ensure all payment processing is secure, reliable, and properly tracked.
```

**Review Checklist:**
- [ ] Stripe Checkout session creation with all required metadata
- [ ] Webhook endpoint security (signature verification)
- [ ] Test event handling (`evt_test_*` returns `{verified: true}`)
- [ ] `checkout.session.completed` event processing
- [ ] `payment_intent.succeeded` event processing
- [ ] `charge.refunded` event handling
- [ ] Customer ID storage and retrieval
- [ ] Proper error handling for failed payments
- [ ] Idempotency key implementation for retries

**Implementation Tasks:**
1. **Checkout Flow Implementation:**
   ```typescript
   // Required checkout session parameters
   {
     mode: 'payment',
     customer_email: user.email,
     client_reference_id: user.id.toString(),
     metadata: {
       user_id: user.id,
       customer_email: user.email,
       customer_name: user.name,
       order_type: 'pre-order'
     },
     line_items: [...],
     success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${origin}/order/cancelled`,
     allow_promotion_codes: true
   }
   ```

2. **Webhook Handler Implementation:**
   ```typescript
   // Critical webhook events to handle
   - checkout.session.completed → Create order record
   - payment_intent.succeeded → Update payment status
   - charge.refunded → Process refund
   - customer.subscription.created → Future subscription support
   ```

3. **Order Creation Flow:**
   - Receive webhook → Verify signature
   - Extract session data → Create order in database
   - Link to user via client_reference_id
   - Send order confirmation email
   - Update inventory

4. **Refund Workflow:**
   - Admin initiates refund → Call Stripe API
   - Webhook confirms refund → Update order status
   - Send refund confirmation email

**Deliverables:**
- [ ] Complete test mode payment flow (place order, receive confirmation)
- [ ] Webhook endpoint passing Stripe CLI testing
- [ ] Refund flow tested and documented
- [ ] Live mode configuration documented (for when Stripe sandbox is claimed)

---

#### Agent 1.2.2: Financial Controller / CPA

**Activation Prompt:**
```
You are the Financial Controller and CPA for OptiBio Supplements. You ensure proper revenue recognition, tax compliance, and financial reporting. You integrate payment data with accounting systems and maintain audit trails.
```

**Review Checklist:**
- [ ] Revenue recognition policy documented
- [ ] Sales tax configuration (Stripe Tax or manual)
- [ ] Chart of accounts mapped for e-commerce
- [ ] Transaction reconciliation process
- [ ] Refund accounting treatment
- [ ] Pre-order revenue deferral handling

**Implementation Tasks:**
1. Define revenue recognition for pre-orders (recognize on shipment)
2. Configure sales tax collection by state
3. Create daily sales reconciliation report
4. Set up Xero integration for transaction sync
5. Document accounting treatment for:
   - Successful orders
   - Refunds
   - Chargebacks
   - Shipping revenue/cost

**Deliverables:**
- [ ] Revenue recognition policy document
- [ ] Tax nexus configuration completed
- [ ] Xero chart of accounts mapped
- [ ] Daily reconciliation report template

---

### Sprint 1.3: Legal Compliance

#### Agent 1.3.1: E-Commerce Legal Counsel

**Activation Prompt:**
```
You are the E-Commerce Legal Counsel for OptiBio Supplements. You specialize in e-commerce law, consumer protection, and supplement industry regulations. You ensure all legal documents protect the business while maintaining customer trust.
```

**Review Checklist:**
- [ ] Terms of Service comprehensive and enforceable
- [ ] Privacy Policy GDPR/CCPA compliant
- [ ] Return/Refund Policy clear and fair
- [ ] Shipping Policy with delivery estimates
- [ ] Cookie consent mechanism implemented
- [ ] Age verification (if required)
- [ ] Subscription terms (for future use)

**Implementation Tasks:**
1. **Terms of Service** must include:
   - Purchase terms and conditions
   - Payment terms
   - Shipping and delivery
   - Returns and refunds
   - Limitation of liability
   - Dispute resolution
   - Governing law

2. **Privacy Policy** must include:
   - Data collected (personal, payment, usage)
   - How data is used
   - Third-party sharing (Stripe, shipping carriers, analytics)
   - Data retention periods
   - User rights (access, deletion, portability)
   - Cookie policy
   - Contact information

3. **Return Policy** must include:
   - 90-day money-back guarantee terms
   - Condition requirements for returns
   - Refund processing timeline
   - Return shipping responsibility
   - Exclusions (opened products, etc.)

**Deliverables:**
- [ ] Terms of Service page live
- [ ] Privacy Policy page live
- [ ] Return Policy page live
- [ ] Cookie consent banner implemented
- [ ] All policies linked in footer

---

#### Agent 1.3.2: Regulatory Compliance Officer

**Activation Prompt:**
```
You are the Regulatory Compliance Officer for OptiBio Supplements. You specialize in FDA regulations for dietary supplements, FTC advertising guidelines, and state-specific requirements. You ensure all product claims and marketing are compliant.
```

**Review Checklist:**
- [ ] FDA disclaimer present on all product pages
- [ ] No disease claims in marketing copy
- [ ] Structure/function claims properly worded
- [ ] "Clinically studied" claims substantiated
- [ ] Testimonial disclaimers present
- [ ] "Results may vary" disclaimer visible
- [ ] Supplement Facts panel accurate

**Implementation Tasks:**
1. Add FDA disclaimer to product pages:
   > *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.*

2. Review all marketing claims against FTC guidelines:
   - Remove any disease treatment claims
   - Ensure "clinically studied" references actual studies
   - Add "individual results may vary" to testimonials

3. Verify Supplement Facts accuracy:
   - Serving size matches label
   - Ingredient amounts accurate
   - Daily value percentages correct

**Deliverables:**
- [ ] FDA disclaimer on all product pages
- [ ] Marketing copy compliance audit completed
- [ ] Testimonial disclaimers added
- [ ] Supplement Facts verified against label

---

## Wave 2: Fulfillment Infrastructure

**Objective:** Enable complete order fulfillment from label generation to delivery confirmation.

### Sprint 2.1: Shipping Integration

#### Agent 2.1.1: Shipping & Logistics Manager

**Activation Prompt:**
```
You are the Shipping & Logistics Manager for OptiBio Supplements. You are an expert in carrier API integrations (FedEx, UPS, USPS), shipping rate optimization, and logistics workflows. You ensure orders can be efficiently shipped with proper tracking.
```

**Implementation Tasks:**

1. **Carrier API Integration Architecture:**

   ```
   ┌─────────────────────────────────────────────────────────┐
   │                    Shipping Service                      │
   ├─────────────────────────────────────────────────────────┤
   │  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
   │  │  FedEx  │    │   UPS   │    │  USPS   │             │
   │  │   API   │    │   API   │    │   API   │             │
   │  └────┬────┘    └────┬────┘    └────┬────┘             │
   │       │              │              │                   │
   │       └──────────────┼──────────────┘                   │
   │                      ▼                                  │
   │              ┌───────────────┐                          │
   │              │ Rate Shopping │                          │
   │              │    Engine     │                          │
   │              └───────┬───────┘                          │
   │                      ▼                                  │
   │              ┌───────────────┐                          │
   │              │Label Generator│                          │
   │              └───────┬───────┘                          │
   │                      ▼                                  │
   │              ┌───────────────┐                          │
   │              │   Tracking    │                          │
   │              │   Webhook     │                          │
   │              └───────────────┘                          │
   └─────────────────────────────────────────────────────────┘
   ```

2. **Shipping Options to Support:**

   | Carrier | Service | Typical Delivery | Use Case |
   |---------|---------|------------------|----------|
   | USPS | Priority Mail | 2-3 days | Default for most orders |
   | USPS | First Class | 3-5 days | Lightweight/economy |
   | UPS | Ground | 3-5 days | Heavier packages |
   | UPS | 2-Day | 2 days | Expedited |
   | FedEx | Ground | 3-5 days | Alternative ground |
   | FedEx | Express | 1-2 days | Urgent orders |

3. **Label Generation Requirements:**
   - 4x6 thermal label format (ZPL or PDF)
   - Include: Ship from, ship to, tracking barcode, service type
   - Support batch label generation for multiple orders
   - Store label PDF in S3 for reprinting

4. **Rate Shopping Logic:**
   ```typescript
   async function getBestRate(shipment: Shipment): Promise<Rate[]> {
     const rates = await Promise.all([
       getFedExRates(shipment),
       getUPSRates(shipment),
       getUSPSRates(shipment)
     ]);
     
     return rates
       .flat()
       .filter(r => r.deliveryDays <= shipment.maxDays)
       .sort((a, b) => a.price - b.price);
   }
   ```

**Deliverables:**
- [ ] FedEx API integration (Ship, Rate, Track)
- [ ] UPS API integration (Ship, Rate, Track)
- [ ] USPS API integration (Ship, Rate, Track)
- [ ] Rate shopping endpoint returning best options
- [ ] Label generation producing 4x6 thermal labels
- [ ] Tracking webhook receiving carrier updates

---

#### Agent 2.1.2: Warehouse Operations Specialist

**Activation Prompt:**
```
You are the Warehouse Operations Specialist for OptiBio Supplements. You design efficient fulfillment workflows, packing slip formats, and inventory management systems. You ensure orders are picked, packed, and shipped accurately.
```

**Implementation Tasks:**

1. **Admin Order Management Dashboard:**
   - Order queue with status filters (New, Processing, Shipped, Delivered)
   - Batch selection for bulk operations
   - Quick actions: Print label, Print packing slip, Mark shipped

2. **Packing Slip Design:**
   ```
   ┌────────────────────────────────────────────────────────┐
   │  [OPTIBIO LOGO]                    PACKING SLIP        │
   │                                                        │
   │  Order #: OPT-2026-00001          Date: Feb 3, 2026   │
   │  ─────────────────────────────────────────────────────│
   │                                                        │
   │  SHIP TO:                                              │
   │  John Smith                                            │
   │  123 Main Street                                       │
   │  New York, NY 10001                                    │
   │                                                        │
   │  ─────────────────────────────────────────────────────│
   │  ITEMS ORDERED:                                        │
   │  ─────────────────────────────────────────────────────│
   │  QTY   SKU           DESCRIPTION                       │
   │  3     ASH-KSM-90    Ashwagandha KSM-66 (90 caps)     │
   │                                                        │
   │  ─────────────────────────────────────────────────────│
   │  SPECIAL INSTRUCTIONS:                                 │
   │  [None]                                                │
   │                                                        │
   │  ─────────────────────────────────────────────────────│
   │  Thank you for your order!                             │
   │                                                        │
   │  Questions? support@optibiosupplements.com             │
   │                                                        │
   │  [BARCODE: OPT-2026-00001]                            │
   │                                                        │
   │  90-Day Money-Back Guarantee                           │
   │  Returns: optibiosupplements.com/returns               │
   └────────────────────────────────────────────────────────┘
   ```

3. **Fulfillment Workflow:**
   ```
   New Order → Pick List Generated → Items Picked → 
   Packing Slip Printed → Items Packed → Label Generated → 
   Package Scanned → Carrier Pickup → Tracking Active
   ```

4. **Inventory Management:**
   - Real-time stock levels
   - Low stock alerts (threshold: 50 units)
   - Reorder point notifications
   - Stock adjustment logging

**Deliverables:**
- [ ] Admin order management page with filters and bulk actions
- [ ] Packing slip PDF generation (branded, professional)
- [ ] Pick list generation for batch fulfillment
- [ ] Inventory tracking with low-stock alerts

---

#### Agent 2.1.3: Customer Communications Specialist

**Activation Prompt:**
```
You are the Customer Communications Specialist for OptiBio Supplements. You design transactional email templates, SMS notifications, and customer touchpoint workflows. You ensure customers are informed at every stage of their order.
```

**Implementation Tasks:**

1. **Email Template Suite:**

   | Trigger | Email | Timing |
   |---------|-------|--------|
   | Order placed | Order Confirmation | Immediate |
   | Label created | Shipping Confirmation | Immediate |
   | Package in transit | Shipping Update | On carrier scan |
   | Out for delivery | Delivery Alert | Morning of delivery |
   | Delivered | Delivery Confirmation | On delivery |
   | 7 days post-delivery | Review Request | Scheduled |

2. **Order Confirmation Email:**
   - Subject: "Your OptiBio Order #OPT-2026-00001 is Confirmed!"
   - Content: Order summary, items, total, shipping address
   - Estimated delivery window
   - Link to order status page
   - Support contact information

3. **Shipping Confirmation Email:**
   - Subject: "Your OptiBio Order is On Its Way!"
   - Content: Tracking number (clickable link)
   - Carrier name and service
   - Estimated delivery date
   - What to expect next

4. **Delivery Confirmation Email:**
   - Subject: "Your OptiBio Order Has Arrived!"
   - Content: Delivery confirmation
   - How to use the product
   - Link to leave a review
   - Referral program mention

**Deliverables:**
- [ ] Order confirmation email template
- [ ] Shipping confirmation email template
- [ ] Delivery confirmation email template
- [ ] Review request email template
- [ ] Email sending integration (SendGrid/Resend)

---

### Sprint 2.2: Returns & Customer Service

#### Agent 2.2.1: Customer Service Manager

**Activation Prompt:**
```
You are the Customer Service Manager for OptiBio Supplements. You design support workflows, help center content, and escalation procedures. You ensure customers can easily get help and issues are resolved quickly.
```

**Implementation Tasks:**

1. **Help Center / FAQ Page:**
   - Shipping & Delivery questions
   - Returns & Refunds process
   - Product usage instructions
   - Account management
   - Contact options

2. **Return/Refund Workflow:**
   ```
   Customer Request → RMA Created → Return Label Sent →
   Package Received → Inspection → Refund Processed →
   Confirmation Email
   ```

3. **Support Channels:**
   - Email: support@optibiosupplements.com
   - Contact form on website
   - Response SLA: 24 hours

4. **Escalation Matrix:**
   | Issue Type | First Response | Escalation |
   |------------|----------------|------------|
   | Order status | Auto-reply with tracking | Agent if >48h |
   | Refund request | Agent within 24h | Manager if disputed |
   | Product issue | Agent within 24h | Quality team |
   | Billing dispute | Agent within 4h | Finance team |

**Deliverables:**
- [ ] FAQ/Help Center page live
- [ ] Contact form with ticket creation
- [ ] Return request workflow implemented
- [ ] Support email configured and monitored

---

## Wave 3: Marketing Infrastructure

**Objective:** Configure all advertising platforms for paid campaign readiness.

### Sprint 3.1: Google Ads Configuration

#### Agent 3.1.1: Google Ads Specialist

**Activation Prompt:**
```
You are the Google Ads Specialist for OptiBio Supplements. You are an expert in Google Tag Manager, conversion tracking, Google Merchant Center, and Shopping campaigns. You ensure all tracking is accurate and campaigns can be launched immediately.
```

**Implementation Tasks:**

1. **Google Tag Manager Setup:**
   ```javascript
   // GTM Container Installation
   <!-- Google Tag Manager -->
   <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
   <!-- End Google Tag Manager -->
   
   // Data Layer Events
   dataLayer.push({
     'event': 'purchase',
     'ecommerce': {
       'transaction_id': 'OPT-2026-00001',
       'value': 76.55,
       'currency': 'USD',
       'items': [{
         'item_id': 'ASH-KSM-90',
         'item_name': 'Ashwagandha KSM-66',
         'price': 25.52,
         'quantity': 3
       }]
     }
   });
   ```

2. **Conversion Actions to Configure:**
   | Conversion | Trigger | Value |
   |------------|---------|-------|
   | Purchase | Order confirmation page | Dynamic (order total) |
   | Add to Cart | Add to cart click | $5 (estimated) |
   | Begin Checkout | Checkout page load | $10 (estimated) |
   | Newsletter Signup | Form submission | $1 |

3. **Enhanced Conversions Setup:**
   - Hash and send customer email on purchase
   - Hash and send phone number if provided
   - Improves attribution accuracy by 5-15%

4. **Google Merchant Center:**
   - Product feed with required attributes
   - Domain verification
   - Policy compliance check
   - Shopping campaign readiness

**Deliverables:**
- [ ] GTM container installed on all pages
- [ ] Purchase conversion tracking verified
- [ ] Add to Cart event tracking verified
- [ ] Begin Checkout event tracking verified
- [ ] Enhanced conversions configured
- [ ] Google Merchant Center product feed submitted
- [ ] GA4 linked to Google Ads

---

### Sprint 3.2: Meta Ads Configuration

#### Agent 3.2.1: Meta Ads Specialist

**Activation Prompt:**
```
You are the Meta Ads Specialist for OptiBio Supplements. You are an expert in Meta Pixel, Conversions API (CAPI), product catalogs, and dynamic ads. You ensure accurate tracking across iOS 14+ devices and campaign readiness.
```

**Implementation Tasks:**

1. **Meta Pixel Installation:**
   ```javascript
   // Base Pixel Code
   fbq('init', 'PIXEL_ID');
   fbq('track', 'PageView');
   
   // Standard Events
   fbq('track', 'ViewContent', {
     content_ids: ['ASH-KSM-90'],
     content_type: 'product',
     value: 25.52,
     currency: 'USD'
   });
   
   fbq('track', 'AddToCart', {...});
   fbq('track', 'InitiateCheckout', {...});
   fbq('track', 'Purchase', {
     content_ids: ['ASH-KSM-90'],
     content_type: 'product',
     value: 76.55,
     currency: 'USD',
     num_items: 3
   });
   ```

2. **Conversions API (Server-Side):**
   ```typescript
   // Server-side event for Purchase
   await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
     method: 'POST',
     body: JSON.stringify({
       data: [{
         event_name: 'Purchase',
         event_time: Math.floor(Date.now() / 1000),
         event_id: order.id, // For deduplication
         user_data: {
           em: hashSHA256(user.email),
           ph: hashSHA256(user.phone),
           client_ip_address: req.ip,
           client_user_agent: req.headers['user-agent']
         },
         custom_data: {
           currency: 'USD',
           value: order.total,
           content_ids: order.items.map(i => i.sku)
         }
       }],
       access_token: META_ACCESS_TOKEN
     })
   });
   ```

3. **Event Deduplication:**
   - Use same `event_id` for browser and server events
   - Meta automatically deduplicates matching events
   - Ensures accurate conversion counts

4. **Product Catalog:**
   - Create catalog in Commerce Manager
   - Upload product feed (CSV or API)
   - Enable dynamic ads capability

**Deliverables:**
- [ ] Meta Pixel installed and verified
- [ ] ViewContent event firing on product pages
- [ ] AddToCart event firing correctly
- [ ] InitiateCheckout event firing correctly
- [ ] Purchase event firing with correct value
- [ ] Conversions API sending server-side events
- [ ] Event Match Quality score > 6.0
- [ ] Product catalog created and synced

---

### Sprint 3.3: Analytics & Attribution

#### Agent 3.3.1: Analytics & Attribution Specialist

**Activation Prompt:**
```
You are the Analytics & Attribution Specialist for OptiBio Supplements. You ensure accurate data collection across all platforms, proper UTM tracking, and meaningful reporting dashboards.
```

**Implementation Tasks:**

1. **GA4 Enhanced E-commerce:**
   - View item list
   - Select item
   - View item
   - Add to cart
   - Remove from cart
   - Begin checkout
   - Add shipping info
   - Add payment info
   - Purchase
   - Refund

2. **UTM Parameter Standards:**
   | Parameter | Convention | Example |
   |-----------|------------|---------|
   | utm_source | Platform | google, facebook, email |
   | utm_medium | Channel type | cpc, social, email |
   | utm_campaign | Campaign name | launch_feb2026 |
   | utm_content | Ad variant | headline_a |
   | utm_term | Keyword | ashwagandha_ksm66 |

3. **Dashboard Requirements:**
   - Real-time sales dashboard
   - Traffic sources breakdown
   - Conversion funnel visualization
   - Campaign performance comparison
   - Customer acquisition cost tracking

**Deliverables:**
- [ ] GA4 enhanced e-commerce fully implemented
- [ ] UTM parameter handling documented
- [ ] Custom dashboard in GA4/Looker Studio
- [ ] Cross-platform attribution model configured

---

## Wave 4: Experience Optimization

**Objective:** Polish the user experience, optimize conversion elements, and finalize all copy.

### Sprint 4.1: UX/UI Polish

#### Agent 4.1.1: UX/UI Designer

**Activation Prompt:**
```
You are the UX/UI Designer for OptiBio Supplements. You specialize in e-commerce design, conversion optimization, and premium brand aesthetics. You ensure the site feels luxurious, trustworthy, and easy to use.
```

**Review Checklist:**
- [ ] Visual hierarchy guides eye to CTA
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Loading states for all async actions
- [ ] Error states are helpful, not frustrating
- [ ] Empty states guide user to action
- [ ] Micro-interactions feel premium
- [ ] Animations are smooth (60fps)

**Implementation Tasks:**
1. Audit and fix all accessibility issues
2. Add skeleton loaders for content
3. Implement smooth page transitions
4. Polish hover/focus states
5. Ensure consistent spacing system

**Deliverables:**
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] All interactive elements have proper states
- [ ] Mobile experience optimized for thumb zones
- [ ] Premium aesthetic achieved throughout

---

#### Agent 4.1.2: CRO Specialist

**Activation Prompt:**
```
You are the Conversion Rate Optimization Specialist for OptiBio Supplements. You analyze user behavior, identify friction points, and implement evidence-based improvements to maximize conversion rates.
```

**Review Checklist:**
- [ ] Above-fold contains value prop, price, CTA
- [ ] Trust signals visible before CTA
- [ ] Social proof near purchase decision
- [ ] Urgency elements (countdown, stock) present
- [ ] Checkout flow is minimal friction
- [ ] Cart abandonment recovery in place
- [ ] Exit intent strategy implemented

**Implementation Tasks:**
1. Heat map analysis of key pages
2. Funnel drop-off analysis
3. A/B test setup for key elements
4. Cart abandonment email sequence
5. Exit intent popup optimization

**Deliverables:**
- [ ] Conversion funnel documented with benchmarks
- [ ] Top 3 friction points identified and fixed
- [ ] Cart abandonment sequence active
- [ ] Exit intent popup configured

---

### Sprint 4.2: Content & Copy

#### Agent 4.2.1: Copywriter / Content Strategist

**Activation Prompt:**
```
You are the Copywriter and Content Strategist for OptiBio Supplements. You craft compelling, benefit-driven copy that converts browsers into buyers while maintaining regulatory compliance.
```

**Review Checklist:**
- [ ] Headlines are benefit-driven, not feature-driven
- [ ] CTAs use action verbs and create urgency
- [ ] Product descriptions address objections
- [ ] Testimonials feel authentic and specific
- [ ] FAQ answers common purchase hesitations
- [ ] Email copy matches brand voice

**Implementation Tasks:**
1. Audit and rewrite all headlines
2. Optimize CTA button copy
3. Expand product description with benefits
4. Write compelling email sequences
5. Create FAQ content addressing objections

**Deliverables:**
- [ ] All page headlines optimized
- [ ] CTA copy tested and finalized
- [ ] Product description expanded
- [ ] Email templates written
- [ ] FAQ content complete

---

## Wave 5: Operations & Launch

**Objective:** Finalize all operational systems and prepare for launch.

### Sprint 5.1: Business Operations

#### Agent 5.1.1: Inventory & Supply Chain Manager

**Activation Prompt:**
```
You are the Inventory & Supply Chain Manager for OptiBio Supplements. You ensure proper stock management, reorder processes, and supply chain visibility.
```

**Implementation Tasks:**
1. Set up inventory tracking system
2. Configure low-stock alerts
3. Create reorder point calculations
4. Document supplier lead times
5. Set up purchase order workflow

**Deliverables:**
- [ ] Inventory system tracking all SKUs
- [ ] Low-stock alerts configured (50 unit threshold)
- [ ] Reorder process documented
- [ ] Supplier contact list maintained

---

#### Agent 5.1.2: Business Intelligence Analyst

**Activation Prompt:**
```
You are the Business Intelligence Analyst for OptiBio Supplements. You create reporting systems, track KPIs, and provide actionable insights for business decisions.
```

**Implementation Tasks:**
1. Define key performance indicators
2. Create daily sales report
3. Build customer analytics dashboard
4. Set up automated reporting
5. Create executive summary template

**KPIs to Track:**
| Metric | Target | Frequency |
|--------|--------|-----------|
| Daily Revenue | Track trend | Daily |
| Conversion Rate | >3% | Weekly |
| Average Order Value | >$60 | Weekly |
| Customer Acquisition Cost | <$30 | Monthly |
| Customer Lifetime Value | >$100 | Monthly |
| Return Rate | <5% | Monthly |

**Deliverables:**
- [ ] KPI dashboard live
- [ ] Daily sales report automated
- [ ] Weekly executive summary template
- [ ] Monthly business review format

---

### Sprint 5.2: Launch Readiness

#### Agent 5.2.1: DevOps/Infrastructure Engineer

**Activation Prompt:**
```
You are the DevOps/Infrastructure Engineer for OptiBio Supplements. You ensure the site is production-ready, monitored, and can handle launch traffic.
```

**Implementation Tasks:**
1. Production environment verification
2. SSL certificate validation
3. CDN configuration
4. Uptime monitoring setup
5. Error alerting configuration
6. Backup verification
7. Load testing

**Launch Checklist:**
- [ ] Production environment stable
- [ ] SSL certificate valid and auto-renewing
- [ ] CDN caching optimized
- [ ] Uptime monitoring active (Pingdom/UptimeRobot)
- [ ] Error tracking active (Sentry)
- [ ] Database backups verified
- [ ] Load test passed (100 concurrent users)

**Deliverables:**
- [ ] Production environment signed off
- [ ] Monitoring dashboard configured
- [ ] Incident response procedure documented
- [ ] Rollback procedure tested

---

## Implementation Timeline

```
Week 1: ████████████████████████████████████████
        Wave 1: Foundation (Tech, Security, Payments)
        
Week 2: ████████████████████████████████████████
        Wave 1 continued + Wave 2 Start (Shipping)
        
Week 3: ████████████████████████████████████████
        Wave 2: Fulfillment (Labels, Packing, Emails)
        
Week 4: ████████████████████████████████████████
        Wave 3: Marketing (Google Ads, Meta Ads)
        
Week 5: ████████████████████████████████████████
        Wave 4: Experience (UX, CRO, Copy)
        
Week 6: ████████████████████████████████████████
        Wave 5: Operations + Launch Readiness
```

---

## Quality Gates

Each wave must pass quality gates before proceeding:

### Wave 1 Gate: Foundation Ready
- [ ] Site loads in <3 seconds
- [ ] Test payment completes successfully
- [ ] All legal pages live
- [ ] Security audit passed

### Wave 2 Gate: Fulfillment Ready
- [ ] Can generate shipping label
- [ ] Packing slip prints correctly
- [ ] Tracking updates received
- [ ] Emails sending correctly

### Wave 3 Gate: Marketing Ready
- [ ] Google Ads conversion tracking verified
- [ ] Meta Pixel events verified
- [ ] Product feeds approved
- [ ] Analytics data flowing

### Wave 4 Gate: Experience Ready
- [ ] Mobile experience polished
- [ ] All copy finalized
- [ ] Accessibility audit passed
- [ ] Conversion elements optimized

### Wave 5 Gate: Launch Ready
- [ ] All systems operational
- [ ] Monitoring active
- [ ] Team trained
- [ ] Rollback plan tested

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|------------|-------|
| Stripe integration issues | Test mode thorough testing, Stripe support escalation path | Payment Architect |
| Carrier API downtime | Multi-carrier fallback, manual label option | Shipping Manager |
| Ad platform rejection | Pre-submission compliance review | Marketing Specialists |
| Launch traffic spike | Load testing, CDN caching, auto-scaling | DevOps Engineer |
| Payment fraud | Stripe Radar rules, manual review workflow | Fraud Specialist |

---

## Success Metrics

**Phase 2 Complete When:**
1. ✅ Customer can complete purchase end-to-end
2. ✅ Order can be fulfilled with printed label and packing slip
3. ✅ Customer receives all transactional emails
4. ✅ Google Ads campaigns can be launched
5. ✅ Meta Ads campaigns can be launched
6. ✅ All legal/compliance requirements met
7. ✅ Admin can manage orders, inventory, and customers
8. ✅ Analytics tracking all key events accurately

---

**Document Prepared By:** Manus AI  
**Methodology:** B-MAD (Build-Measure-Analyze-Decide)  
**Next Step:** Begin Wave 1 implementation upon approval
