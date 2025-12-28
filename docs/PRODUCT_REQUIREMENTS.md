# Product Requirements Document: OptiBio E-Commerce Platform

**Document Version**: 1.0**Last Updated**: November 11, 2025**Author**: Manus AI**Status**: Active Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)

1. [Product Vision & Goals](#product-vision--goals)

1. [Current State](#current-state)

1. [Technical Architecture](#technical-architecture)

1. [User Flows & Features](#user-flows--features)

1. [Business Requirements](#business-requirements)

1. [Success Metrics & KPIs](#success-metrics--kpis)

1. [Future Roadmap](#future-roadmap)

1. [Appendix](#appendix)

---

## Executive Summary

OptiBio is a direct-to-consumer e-commerce platform specializing in premium KSM-66 Ashwagandha supplements. The platform differentiates itself through radical transparency, third-party testing, and science-backed wellness positioning. Built on modern web technologies with a focus on conversion optimization and recurring revenue through subscriptions, OptiBio targets health-conscious consumers aged 25-45 seeking authentic, clinically-proven supplements.

The platform launched in November 2025 with core e-commerce functionality including product catalog, shopping cart, Stripe payment processing, subscription management, and a pre-sale campaign system. The current technical stack leverages React 19, TypeScript, tRPC for type-safe APIs, MySQL for data persistence, and integrates with Stripe for payments and Manus OAuth for authentication.

**Key Achievements to Date:**

- Fully functional e-commerce platform with checkout and payment processing

- Subscription system with multiple billing intervals (monthly, quarterly, annual)

- Pre-sale campaign infrastructure with tiered pricing and referral tracking

- Responsive design optimized for mobile and desktop

- Integrated notification system for customer feedback and owner alerts

- Third-party testing verification system with batch traceability

**Primary Objectives:**

- Achieve $50,000 in monthly recurring revenue (MRR) within 6 months

- Convert 40% of customers to subscription model

- Maintain customer acquisition cost (CAC) below $30

- Build email list of 10,000+ engaged subscribers within first year

---

## Product Vision & Goals

### Vision Statement

OptiBio exists to restore trust in the supplement industry by providing radically transparent, science-backed wellness products that deliver measurable results. We believe consumers deserve to know exactly what they are putting in their bodies, backed by third-party testing and clinical research.

### Mission

To become the most trusted source for premium ashwagandha supplements by prioritizing quality, transparency, and customer education over profit margins.

### Target Market

**Primary Audience:**

- **Demographics**: Adults aged 25-55, college-educated, household income $60,000+

- **Psychographics**: Health-conscious, skeptical of traditional supplement marketing, values science and transparency

- **Behaviors**: Researches products before purchase, reads reviews, active on wellness communities (Reddit r/Supplements, health forums)

- **Pain Points**: Frustrated by misleading supplement claims, concerned about heavy metals and contaminants, seeking stress management solutions

**Secondary Audience:**

- Fitness enthusiasts seeking natural performance enhancement

- Professionals experiencing burnout and chronic stress

- Biohackers optimizing cognitive performance

### Product Goals

**Short-term (0-6 months):**

- Launch with single hero product (KSM-66 Ashwagandha 600mg)

- Establish brand credibility through third-party testing transparency

- Build initial customer base of 1,000+ active subscribers

- Achieve profitability on unit economics

**Medium-term (6-12 months):**

- Expand product line to 3-5 complementary supplements

- Implement customer reviews and testimonials system

- Build content marketing engine (blog, educational resources)

- Establish partnerships with wellness influencers

**Long-term (12-24 months):**

- Become category leader in transparent supplement e-commerce

- Launch mobile app for subscription management and health tracking

- Expand to international markets (Canada, UK, Australia)

- Explore retail partnerships with premium health food stores

---

## Current State

### Features Implemented

The OptiBio platform currently includes the following functional modules:

#### Core E-Commerce

**Product Catalog Management:**

The system supports comprehensive product information including name, description, pricing, inventory tracking, and rich media galleries. Each product can have multiple variants (different sizes, quantities) with independent pricing and stock levels. Products are organized with SKU tracking, featured product flags, and active/inactive status controls.

**Shopping Cart:**

Customers can add products to cart with quantity selection and variant choice. The cart persists across sessions using either user authentication or anonymous session IDs. Cart items support both one-time purchases and subscription selections, with real-time price calculations including discounts and shipping estimates.

**Checkout Flow:**

The checkout process collects shipping and billing addresses with validation, integrates Stripe for secure payment processing, supports discount code application, and calculates tax and shipping costs. Upon successful payment, customers receive order confirmation emails and are redirected to a success page with order details.

**Order Management:**

Orders are tracked with unique order numbers and support multiple status states (pending, processing, shipped, delivered, cancelled, refunded). Each order stores complete customer information, itemized product details with prices at time of purchase, payment status and transaction IDs, and shipping tracking information.

#### Subscription System

**Subscription Plans:**

Three subscription tiers are available: Monthly (15% discount), Quarterly (20% discount), and Annual (25% discount). Each plan supports automatic recurring billing through Stripe subscriptions, with configurable billing intervals and discount percentages.

**Subscription Management:**

Customers can view active subscriptions, pause or cancel subscriptions, update payment methods, and modify delivery addresses. The system tracks next billing dates, subscription status (active, paused, cancelled, expired), and integrates with Stripe for payment processing.

**Subscription Analytics:**

The platform tracks subscription metrics including monthly recurring revenue (MRR), churn rate, lifetime value (LTV), and renewal success rates.

#### Pre-Sale Campaign System

**Tiered Pricing:**

The pre-sale system offers three tiers with different benefits:

- **Founders Tier** ($89): 25% lifetime discount, founder badge, early access, limited to 500 spots

- **Early Adopter Tier** ($69): 15% lifetime discount, early access, limited to 2,000 spots

- **Pre-Launch Tier** ($59): 10% lifetime discount, priority shipping

**Referral Program:**

Each pre-sale customer receives a unique referral code, earns $10 credit per successful referral, and can track referral count and credits earned. Referred customers receive additional benefits and priority positioning.

**Waitlist Management:**

The system captures email addresses before pre-sale launch, tracks conversion from waitlist to reservation, and sends notification emails when pre-sale opens.

#### User Authentication & Profiles

**Manus OAuth Integration:**

Users authenticate through Manus OAuth with support for multiple login methods (email, social). The system tracks user roles (admin, user), maintains session persistence, and handles secure token management.

**User Profiles:**

Customers can view order history, manage saved addresses, update payment methods, and track subscription status. Admin users have access to order management, inventory control, and customer data.

#### Payment Processing

**Stripe Integration:**

The platform uses Stripe Checkout for secure payment collection, supports credit/debit cards and digital wallets (Apple Pay, Google Pay), handles subscription billing automatically, and processes webhooks for payment events (successful charges, failed payments, subscription renewals).

**Discount Codes:**

The system supports percentage-based and fixed-amount discounts, minimum purchase requirements, usage limits (total and per customer), expiration dates, and automatic validation at checkout.

#### Notification System

**Customer Notifications:**

Toast notifications provide instant feedback for cart actions, checkout success, and error handling. The notifications are non-intrusive, auto-dismiss after 5 seconds, and support custom styling.

**Owner Notifications:**

The platform sends real-time alerts to the owner for new orders (with customer details, items, total, location), subscription renewals (with next billing date), and failed payments (with error reasons). Notifications are delivered through the Manus notification API.

**Promotional Banner:**

A dismissible banner at the top of the site promotes free shipping thresholds and founder pricing countdown. The banner uses localStorage to remember dismissal state and features responsive design for mobile devices.

#### Product Quality & Transparency

**Batch Tracking:**

Each product batch is tracked with unique lot numbers, manufacture and expiry dates, and links to third-party test results (Certificate of Analysis, heavy metals testing, microbial testing, potency verification).

**Test Results Display:**

Customers can view batch-specific test results, download PDF certificates, and see key metrics (purity percentage, contaminant levels) directly on product pages.

### Technology Stack

**Frontend:**

- **Framework**: React 19 with TypeScript for type safety

- **Styling**: Tailwind CSS 4 with custom design system

- **UI Components**: shadcn/ui component library

- **Routing**: Wouter (lightweight client-side routing)

- **State Management**: TanStack Query (React Query) for server state

- **Forms**: React Hook Form with Zod validation

**Backend:**

- **Runtime**: Node.js 22 with Express 4

- **API Layer**: tRPC 11 for end-to-end type safety

- **Database ORM**: Drizzle ORM with MySQL dialect

- **Authentication**: Manus OAuth with JWT sessions

- **Payment Processing**: Stripe SDK for Node.js

**Database:**

- **Primary Database**: MySQL 8.0 (currently Manus-managed, migrating to Railway)

- **Schema Management**: Drizzle Kit for migrations

- **Connection Pooling**: mysql2 with connection pooling

**Infrastructure:**

- **Current Hosting**: Manus platform (dev server + database + deployment)

- **Planned Migration**: Vercel (hosting) + Railway (database)

- **Version Control**: GitHub (optibiosupplements/optibio-ecommerce)

- **Domain**: optibiosupplements.com (DNS configured via GoDaddy)

**Third-Party Integrations:**

- **Payments**: Stripe (checkout, subscriptions, webhooks)

- **Authentication**: Manus OAuth

- **Notifications**: Manus notification API

- **Email**: (To be implemented - SendGrid or Resend)

- **Analytics**: (To be implemented - Vercel Analytics + Google Analytics)

### Current Limitations

**Missing Features:**

- Email marketing automation (abandoned cart recovery, post-purchase sequences)

- Customer reviews and ratings system

- Product recommendations and upsells

- Blog and content management system

- Advanced analytics dashboard

- Mobile app

- Multi-currency support

- International shipping

**Technical Debt:**

- Dev server experiencing file watcher limits (EMFILE errors)

- No automated testing suite

- Limited error tracking (Sentry not yet integrated)

- No CI/CD pipeline (manual deployments)

- Database not optimized for high traffic (no read replicas, caching)

**Operational Gaps:**

- No customer support system (live chat, ticketing)

- Manual inventory management

- No automated email notifications for order status

- Limited admin dashboard functionality

- No fraud detection or prevention

---

## Technical Architecture

### System Overview

OptiBio follows a modern full-stack architecture with clear separation between frontend presentation, backend business logic, and data persistence layers. The system is designed for scalability, maintainability, and developer productivity.

**Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  React 19 + TypeScript + Tailwind CSS + shadcn/ui          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │   Contexts   │     │
│  │  (Routes)    │  │   (UI Kit)   │  │   (State)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                 │                 │             │
│           └─────────────────┴─────────────────┘             │
│                         │                                    │
│                    tRPC Client                              │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          │ HTTP/JSON
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                         │         Backend                     │
│                    tRPC Server                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routers    │  │   Database   │  │  Webhooks    │     │
│  │  (Procedures)│  │   Helpers    │  │   (Stripe)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                 │                 │             │
│           └─────────────────┴─────────────────┘             │
│                         │                                    │
│                    Drizzle ORM                              │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          │ MySQL Protocol
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    MySQL Database                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Users     │  │   Products   │  │    Orders    │     │
│  │  Addresses   │  │   Variants   │  │  OrderItems  │     │
│  │Subscriptions │  │    Batches   │  │   CartItems  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Stripe    │  │ Manus OAuth  │  │ Manus Notify │
│  (Payments)  │  │    (Auth)    │  │   (Alerts)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Database Schema

The database consists of 14 tables organized into logical domains:

**User Management:**

- `users`: Core user accounts with authentication, roles, and founder tier tracking

- `addresses`: Shipping and billing addresses linked to users

**Product Catalog:**

- `products`: Main product information (name, description, pricing, inventory)

- `productVariants`: Size/quantity variations with independent pricing and stock

- `productBatches`: Batch tracking with lot numbers and third-party test results

**Order Processing:**

- `orders`: Order headers with customer info, totals, and status tracking

- `orderItems`: Line items within each order (products, quantities, prices)

- `cartItems`: Shopping cart persistence (user or session-based)

**Subscriptions:**

- `subscriptionPlans`: Recurring billing plans with intervals and discounts

- `subscriptions`: Active customer subscriptions linked to Stripe

**Marketing:**

- `discountCodes`: Promo codes with usage limits and expiration

- `presale_reservations`: Pre-sale orders with tier, referrals, and payment tracking

- `presale_campaign`: Campaign configuration and real-time stats

- `waitlist`: Email capture before pre-sale launch

**Entity Relationships:**

- Users → Addresses (one-to-many)

- Users → Orders (one-to-many)

- Users → Subscriptions (one-to-many)

- Users → CartItems (one-to-many)

- Products → ProductVariants (one-to-many)

- Products → ProductBatches (one-to-many)

- Orders → OrderItems (one-to-many)

- SubscriptionPlans → Subscriptions (one-to-many)

### API Design

The platform uses tRPC for type-safe API communication between frontend and backend. All procedures are organized into routers by domain.

**Router Structure:**

```typescript
appRouter
├── auth
│   ├── me (query) - Get current user
│   └── logout (mutation) - Clear session
├── products
│   ├── list (query) - Get all products
│   ├── getBySlug (query) - Get single product
│   └── getVariants (query) - Get product variants
├── cart
│   ├── get (query) - Get cart items
│   ├── add (mutation) - Add item to cart
│   ├── update (mutation) - Update quantity
│   └── remove (mutation) - Remove item
├── checkout
│   ├── createSession (mutation) - Create Stripe checkout
│   └── getOrder (query) - Get order details
├── subscriptions
│   ├── list (query) - Get user subscriptions
│   ├── cancel (mutation) - Cancel subscription
│   └── updatePayment (mutation) - Update payment method
└── system
    └── notifyOwner (mutation) - Send owner notification
```

**Authentication Flow:**

All procedures are either `publicProcedure` (accessible to anyone) or `protectedProcedure` (requires authentication). Protected procedures automatically inject `ctx.user` with the authenticated user's data.

### Security Considerations

**Authentication:**

- OAuth 2.0 flow through Manus with secure token exchange

- JWT sessions stored in HTTP-only cookies

- CSRF protection enabled

- Session expiration after 30 days of inactivity

**Payment Security:**

- PCI compliance through Stripe (no card data touches our servers)

- Webhook signature verification for all Stripe events

- HTTPS enforced for all traffic

- Environment variables for sensitive keys (never committed to Git)

**Data Protection:**

- Passwords not stored (OAuth-only authentication)

- Personal data encrypted at rest (database-level encryption)

- SQL injection prevention through parameterized queries (Drizzle ORM)

- XSS protection through React's built-in escaping

**Rate Limiting:**

- (To be implemented) API rate limiting per IP address

- (To be implemented) Brute force protection on login attempts

- (To be implemented) DDoS mitigation through Vercel edge network

### Performance Optimization

**Frontend:**

- Code splitting by route (lazy loading)

- Image optimization with responsive sizes

- CSS purging (unused Tailwind classes removed)

- Minification and compression (Vite production build)

**Backend:**

- Database connection pooling (reuse connections)

- Query optimization (indexed columns for common lookups)

- Response caching for static data (product catalog)

- (To be implemented) CDN caching for static assets

**Database:**

- Indexes on frequently queried columns (email, orderNumber, slug)

- Efficient data types (INT for prices in cents, avoiding DECIMAL)

- (To be implemented) Read replicas for analytics queries

- (To be implemented) Redis caching for hot data

---

## User Flows & Features

### Customer Journey Map

**Discovery Phase:**

A potential customer discovers OptiBio through organic search, Reddit recommendations, or wellness influencer content. They land on the homepage and are immediately presented with the value proposition: "The Supplement Industry Is Broken - 70% of supplements don't contain what their labels claim." The hero section emphasizes radical transparency and third-party testing.

**Research Phase:**

The customer navigates to the product page for KSM-66 Ashwagandha. They read the detailed description highlighting clinical research, view the supplement facts panel, and explore the "Science" section with links to peer-reviewed studies. The batch verification section allows them to view third-party test results (Certificate of Analysis, heavy metals testing) for the specific lot they will receive.

**Decision Phase:**

Convinced by the transparency and quality, the customer selects a product variant (60 capsules vs 120 capsules). They see the Subscribe & Save option prominently displayed, showing potential savings (15-25% off). A comparison table helps them choose between one-time purchase and subscription.

**Purchase Phase:**

The customer adds the product to cart and proceeds to checkout. They enter shipping and billing information, apply a discount code if available, and review the order summary. Payment is processed securely through Stripe Checkout. Upon successful payment, they receive an order confirmation with tracking information.

**Post-Purchase Phase:**

The customer receives email updates as their order is processed and shipped. For subscription customers, they receive reminder emails before each billing cycle with options to skip, pause, or modify their subscription. After product delivery, they are invited to leave a review and share their experience.

### Feature Specifications

#### Homepage

**Hero Section:**

The hero section occupies the full viewport on desktop with a bold headline addressing the industry problem: "The Supplement Industry Is Broken." A subheadline provides context: "70% of supplements don't contain what their labels claim. Companies use cheap extracts, hide behind proprietary blends, and prioritize profit over purity." Two prominent CTAs are displayed: "Start Your Journey" (primary) and "See the Science" (secondary).

**Trust Badges:**

Below the hero, three trust indicators are displayed with icons:

- Third-party tested (lab flask icon)

- No proprietary blends (shield icon)

- Money-back guarantee (checkmark icon)

Each badge includes a "Verified" label and links to detailed information.

**Social Proof:**

A testimonial section showcases customer reviews with star ratings, photos, and specific results ("Reduced stress by 40% in 8 weeks"). A counter displays "5,000+ customers trust OptiBio" with real-time updates.

**Product Showcase:**

Featured products are displayed in a grid with high-quality images, pricing, and quick-add buttons. Each product card shows:

- Product image

- Name and variant options

- Price with compare-at price (showing savings)

- Star rating and review count

- "Add to Cart" button

**Educational Content:**

A section titled "Why KSM-66?" explains the difference between ashwagandha extracts, highlighting full-spectrum vs. isolated compounds, standardized withanolide content, and clinical research backing.

#### Product Page

**Product Gallery:**

A large image carousel displays product photos from multiple angles, lifestyle images showing usage, and close-ups of the label. Thumbnails below allow quick navigation. Zoom functionality enables detailed inspection.

**Product Information:**

The product name, SKU, and star rating are prominently displayed. A short description (2-3 sentences) summarizes key benefits. Pricing shows both regular and subscription prices with savings percentage highlighted.

**Variant Selection:**

Customers choose between product variants (60 capsules, 120 capsules) using large, tappable cards. Each card displays:

- Variant name

- Price per unit

- Total price

- Stock status

The selected variant is highlighted with a colored border.

**Subscribe & Save Toggle:**

A large toggle switch allows customers to opt into subscription. When enabled, the price updates to show subscription discount, and a dropdown appears to select billing frequency (monthly, quarterly, annual). A savings calculator shows total annual savings.

**Add to Cart:**

A prominent "Add to Cart" button is always visible (sticky on mobile). Quantity can be adjusted with +/- buttons. Upon adding to cart, a toast notification confirms the action and offers a quick link to checkout.

**Product Details Tabs:**

Tabbed content organizes detailed information:

- **Description**: Full product description with benefits, ingredients, and usage instructions

- **Science**: Links to clinical studies, research summaries, and expert endorsements

- **Batch Verification**: Lot number lookup, test result PDFs, and purity metrics

- **FAQ**: Common questions about dosage, side effects, and shipping

**Reviews Section:**

Customer reviews are displayed with star ratings, verified purchase badges, and helpful/not helpful voting. Filters allow sorting by rating, most recent, or most helpful. A "Write a Review" button encourages feedback.

#### Shopping Cart

**Cart Summary:**

The cart page displays all items with product images, names, variants, quantities, and line totals. Customers can update quantities or remove items with inline controls. A running subtotal is displayed with itemized discounts.

**Discount Code:**

An input field allows entering promo codes. Upon applying a valid code, the discount is shown as a line item with the code name and amount saved. Invalid codes display an error message.

**Shipping Estimate:**

Based on the cart total, a message indicates whether free shipping is available ("Add $15 more for free shipping!"). A progress bar visualizes proximity to the free shipping threshold.

**Checkout Button:**

A large, prominent "Proceed to Checkout" button is always visible. The button displays the order total and is disabled if the cart is empty.

#### Checkout Flow

**Step 1: Shipping Information:**

Customers enter their shipping address with fields for name, address, city, state, ZIP code, and phone number. Address validation ensures correct formatting. An option to save the address for future orders is provided.

**Step 2: Billing Information:**

Customers can choose "Same as shipping address" or enter a different billing address. The form mirrors the shipping address fields.

**Step 3: Payment:**

Stripe Checkout is embedded in the page, allowing customers to enter credit card information securely. Supported payment methods include credit/debit cards, Apple Pay, and Google Pay. A "Place Order" button finalizes the purchase.

**Order Review:**

A sidebar (desktop) or collapsible section (mobile) displays the order summary with items, quantities, prices, discounts, shipping, tax, and total. This summary is visible throughout the checkout process.

**Security Indicators:**

Trust badges (SSL encryption, PCI compliance, money-back guarantee) are displayed at the bottom of the checkout page to reassure customers.

#### Order Confirmation

**Thank You Message:**

After successful payment, customers are redirected to an order confirmation page with a personalized thank you message. The order number is prominently displayed.

**Order Summary:**

A detailed breakdown shows all items purchased, shipping address, billing address, payment method (last 4 digits), and order total.

**Next Steps:**

Instructions inform customers what to expect next: "You'll receive a shipping confirmation email within 24 hours with tracking information."

**Account Creation:**

For guest checkouts, an option to create an account is offered: "Save your order details and track shipments by creating an account."

#### Subscription Management

**Subscription Dashboard:**

Authenticated customers can view all active subscriptions with product names, billing frequency, next billing date, and subscription status. Each subscription card includes action buttons: "Pause," "Cancel," "Update Payment Method," and "Modify Delivery Address."

**Pause Subscription:**

Clicking "Pause" opens a modal asking for the pause duration (1 month, 2 months, 3 months, indefinitely). The next billing date is updated accordingly.

**Cancel Subscription:**

Clicking "Cancel" triggers a retention flow: "Are you sure? You'll lose your 15% discount." Options are provided to pause instead or confirm cancellation. Upon cancellation, a feedback survey asks for the reason.

**Update Payment Method:**

Customers can update their credit card information through a Stripe-hosted form. The new payment method is immediately saved for future charges.

**Billing History:**

A table displays past invoices with dates, amounts, payment status, and download links for receipts.

#### Admin Dashboard

**Order Management:**

Admins can view all orders in a sortable, filterable table with columns for order number, customer name, date, total, and status. Clicking an order opens a detail view with full customer information, items, and fulfillment controls (mark as shipped, add tracking number, refund).

**Inventory Management:**

A table displays all products and variants with current stock levels, low stock warnings, and quick-edit controls to adjust quantities. Admins can mark products as active/inactive and update pricing.

**Customer Management:**

A searchable list of all customers shows names, emails, order counts, lifetime value, and subscription status. Clicking a customer opens their profile with order history and contact information.

**Analytics Dashboard:**

Key metrics are displayed in cards: total revenue, order count, average order value, subscription MRR, and conversion rate. Charts visualize revenue trends, top-selling products, and customer acquisition sources.

---

## Business Requirements

### Revenue Model

OptiBio operates on a direct-to-consumer (DTC) e-commerce model with two primary revenue streams:

**One-Time Purchases:**

Customers can buy products without commitment at full retail price. This stream provides immediate cash flow but has lower lifetime value compared to subscriptions. One-time purchases are expected to represent 60% of initial sales, declining to 40% as the subscription base grows.

**Subscription Revenue:**

The subscription model offers customers automatic recurring deliveries at discounted prices (15-25% off retail). This creates predictable monthly recurring revenue (MRR) and significantly increases customer lifetime value (LTV). Subscriptions are projected to grow from 40% of sales at launch to 60% within 12 months.

**Pricing Strategy:**

- **Retail Price**: $49 per bottle (60 capsules, 30-day supply)

- **Subscription Prices**:
  - Monthly: $41.65 (15% off)
  - Quarterly: $39.20 (20% off)
  - Annual: $36.75 (25% off)

**Unit Economics:**

| Metric | Value |
| --- | --- |
| **Average Order Value (AOV)** | $65 (including upsells) |
| **Cost of Goods Sold (COGS)** | $12 per unit (manufacturing, packaging, shipping) |
| **Gross Margin** | 75% |
| **Customer Acquisition Cost (CAC)** | $30 (target) |
| **Lifetime Value (LTV)** | $180 (one-time), $450 (subscription) |
| **LTV:CAC Ratio** | 6:1 (one-time), 15:1 (subscription) |

**Pre-Sale Campaign:**

The pre-sale campaign generates upfront capital while building a committed customer base. Three tiers offer different benefits:

- **Founders Tier** ($89): Limited to 500 spots, 25% lifetime discount

- **Early Adopter Tier** ($69): Limited to 2,000 spots, 15% lifetime discount

- **Pre-Launch Tier** ($59): Unlimited, 10% lifetime discount

**Projected Pre-Sale Revenue**: $100,000-150,000 (assuming 1,500-2,000 reservations)

### Target Metrics

**Launch Phase (Months 1-3):**

- **Monthly Revenue**: $25,000

- **Orders**: 500/month

- **Subscription Rate**: 30%

- **Conversion Rate**: 2.5%

- **Email List**: 3,000 subscribers

**Growth Phase (Months 4-6):**

- **Monthly Revenue**: $50,000

- **Orders**: 1,000/month

- **Subscription Rate**: 40%

- **Conversion Rate**: 3.5%

- **Email List**: 7,000 subscribers

**Scale Phase (Months 7-12):**

- **Monthly Revenue**: $100,000

- **Orders**: 2,000/month

- **Subscription Rate**: 50%

- **Conversion Rate**: 4.5%

- **Email List**: 15,000 subscribers

### Competitive Positioning

**Direct Competitors:**

- **Transparent Labs**: Similar transparency focus, higher pricing ($59/bottle)

- **Nootropics Depot**: Strong Reddit presence, technical audience

- **Momentous**: Premium positioning, athlete endorsements

**Competitive Advantages:**

- **Radical Transparency**: Full third-party test results for every batch (most competitors don't provide this)

- **Pricing**: Competitive pricing with subscription discounts

- **Education**: Science-backed content explaining ingredient quality

- **Customer Experience**: Modern, intuitive e-commerce platform

**Differentiation Strategy:**

OptiBio positions itself as the "anti-supplement company" - calling out industry problems while demonstrating a better way. Marketing emphasizes what OptiBio *doesn't* do (proprietary blends, misleading claims, cheap extracts) as much as what it does.

### Marketing Strategy

**Content Marketing:**

- **Blog**: Educational articles on ashwagandha research, supplement quality, stress management

- **Reddit Engagement**: Active participation in r/Supplements, r/Nootropics, r/Biohacking

- **YouTube**: Video content explaining third-party testing, factory tours, ingredient sourcing

**Paid Acquisition:**

- **Google Ads**: Targeting high-intent keywords ("best ashwagandha supplement," "KSM-66 where to buy")

- **Facebook/Instagram Ads**: Targeting health-conscious audiences with creative emphasizing transparency

- **Reddit Ads**: Sponsored posts in relevant subreddits with authentic, non-salesy messaging

**Influencer Partnerships:**

- **Micro-Influencers**: Partner with 10-20 wellness influencers (10k-100k followers) for authentic reviews

- **Affiliate Program**: Offer 20% commission for referrals with unique discount codes

- **Expert Endorsements**: Seek endorsements from registered dietitians, functional medicine practitioners

**Email Marketing:**

- **Welcome Series**: 5-email sequence educating new subscribers about ashwagandha and OptiBio's quality standards

- **Abandoned Cart**: 3-email sequence recovering abandoned carts with incentives (free shipping, 10% off)

- **Post-Purchase**: Follow-up sequence asking for reviews, providing usage tips, offering subscription upgrade

**Retention Marketing:**

- **Subscription Perks**: Exclusive content, early access to new products, VIP customer support

- **Referral Program**: Reward customers for referring friends with store credit

- **Loyalty Program**: (Future) Points system rewarding repeat purchases

### Regulatory Compliance

**FDA Compliance:**

Supplements are regulated as foods, not drugs, under the Dietary Supplement Health and Education Act (DSHEA). OptiBio must:

- Ensure all claims are substantiated and not disease-related

- Include required disclaimer: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease."

- Follow Good Manufacturing Practices (GMP)

- Accurately label all ingredients and allergens

**FTC Compliance:**

The Federal Trade Commission regulates advertising claims. OptiBio must:

- Ensure all marketing claims are truthful and substantiated

- Disclose material connections with influencers and affiliates

- Avoid deceptive pricing practices (fake discounts)

**State Regulations:**

Some states have additional supplement regulations. OptiBio will:

- Register with California's Office of Environmental Health Hazard Assessment (OEHHA) for Prop 65 compliance

- Comply with New York's supplement testing requirements

- Monitor state-specific regulations as they evolve

---

## Success Metrics & KPIs

### Primary Metrics

**Revenue Metrics:**

- **Monthly Recurring Revenue (MRR)**: Target $30,000 by month 6, $60,000 by month 12

- **Total Revenue**: Target $50,000/month by month 6, $100,000/month by month 12

- **Average Order Value (AOV)**: Target $65 (including upsells and multi-bottle purchases)

- **Customer Lifetime Value (LTV)**: Target $450 for subscription customers, $180 for one-time buyers

**Conversion Metrics:**

- **Website Conversion Rate**: Target 3.5% (industry average is 2-3%)

- **Subscription Conversion Rate**: Target 40% of customers choosing subscription

- **Cart Abandonment Rate**: Target <70% (industry average is 70-80%)

- **Checkout Completion Rate**: Target >80%

**Customer Acquisition:**

- **Customer Acquisition Cost (CAC)**: Target <$30 per customer

- **LTV:CAC Ratio**: Target 15:1 for subscription customers

- **Organic Traffic**: Target 60% of traffic from organic sources (SEO, word-of-mouth)

- **Paid Traffic ROI**: Target 3:1 return on ad spend (ROAS)

**Retention Metrics:**

- **Subscription Churn Rate**: Target <5% monthly churn

- **Repeat Purchase Rate**: Target 30% of one-time customers making second purchase within 90 days

- **Net Promoter Score (NPS)**: Target >50 (excellent for e-commerce)

- **Customer Satisfaction (CSAT)**: Target >4.5/5 stars

### Secondary Metrics

**Engagement Metrics:**

- **Email Open Rate**: Target 25-30% (industry average is 20-25%)

- **Email Click-Through Rate**: Target 3-5%

- **Time on Site**: Target >3 minutes (indicates content engagement)

- **Pages per Session**: Target >3 pages

**Product Metrics:**

- **Product Page Conversion Rate**: Target 5-7%

- **Add-to-Cart Rate**: Target 10-15% of product page visitors

- **Average Items per Order**: Target 1.3 (indicates successful upselling)

**Operational Metrics:**

- **Order Fulfillment Time**: Target <24 hours from order to shipment

- **Shipping Time**: Target 3-5 days for domestic orders

- **Return Rate**: Target <2% (low for supplements)

- **Customer Support Response Time**: Target <2 hours for email, <1 minute for live chat

### Analytics Implementation

**Tracking Tools:**

- **Vercel Analytics**: Page views, unique visitors, bounce rate, top pages

- **Google Analytics 4**: Detailed user behavior, conversion funnels, traffic sources

- **Stripe Dashboard**: Revenue, subscription metrics, payment success rates

- **Custom Dashboard**: Built into admin panel for real-time business metrics

**Event Tracking:**

Key user actions are tracked as events:

- `product_viewed`: User views product page

- `add_to_cart`: User adds item to cart

- `checkout_started`: User begins checkout process

- `purchase_completed`: Successful order placement

- `subscription_created`: User subscribes

- `subscription_cancelled`: User cancels subscription

**Conversion Funnels:**

Three primary funnels are monitored:

**Purchase Funnel:**

1. Homepage visit → Product page → Add to cart → Checkout → Purchase

1. Target conversion: 3.5% overall

**Subscription Funnel:**

1. Product page → Subscribe toggle → Add to cart → Checkout → Subscription created

1. Target conversion: 40% of purchasers

**Email Capture Funnel:**

1. Homepage visit → Email popup → Email submitted → Welcome email opened → First purchase

1. Target conversion: 15% email-to-purchase

### A/B Testing Roadmap

**High-Priority Tests (Months 1-3):**

- **Subscription Toggle Placement**: Test toggle above vs. below product description

- **Pricing Display**: Test showing monthly price vs. total annual savings

- **Hero Headline**: Test problem-focused vs. solution-focused messaging

- **CTA Button Color**: Test sage green vs. gold vs. terracotta

**Medium-Priority Tests (Months 4-6):**

- **Product Page Layout**: Test single-column vs. two-column layout

- **Review Placement**: Test reviews above vs. below product description

- **Discount Code Prominence**: Test inline vs. collapsible discount field

- **Shipping Threshold**: Test $75 vs. $50 free shipping minimum

**Low-Priority Tests (Months 7-12):**

- **Navigation Structure**: Test top nav vs. sidebar nav

- **Product Gallery**: Test carousel vs. grid layout

- **Checkout Steps**: Test single-page vs. multi-step checkout

- **Email Frequency**: Test weekly vs. bi-weekly email cadence

---

## Future Roadmap

### Phase 1: Foundation (Months 1-3) - CURRENT

**Status**: In Progress

**Objectives:**

- Launch core e-commerce platform with single product

- Establish brand credibility through transparency

- Build initial customer base and gather feedback

- Achieve profitability on unit economics

**Key Features:**

- ✅ Product catalog with variant support

- ✅ Shopping cart and checkout

- ✅ Stripe payment processing

- ✅ Subscription system (monthly, quarterly, annual)

- ✅ Pre-sale campaign with tiered pricing

- ✅ Batch tracking and third-party test results

- ✅ Basic notification system

- ⏳ Email marketing automation (in progress)

- ⏳ Customer reviews system (planned)

**Success Criteria:**

- 500+ orders in first month

- 30% subscription conversion rate

- <$30 customer acquisition cost

- 4.5+ star average rating

### Phase 2: Growth (Months 4-6)

**Objectives:**

- Scale customer acquisition through paid marketing

- Expand product line to 3 SKUs

- Implement advanced retention features

- Optimize conversion funnel

**Key Features:**

**Email Marketing Automation:**

- Abandoned cart recovery (3-email sequence)

- Post-purchase follow-up (5-email sequence)

- Subscription renewal reminders

- Win-back campaigns for churned customers

**Customer Reviews & Testimonials:**

- Star rating system on product pages

- Verified purchase badges

- Photo/video review uploads

- Review incentive program (discount for reviews)

**Product Recommendations:**

- "Frequently Bought Together" upsells

- "You May Also Like" cross-sells

- Personalized recommendations based on purchase history

**Advanced Analytics:**

- Custom admin dashboard with real-time metrics

- Cohort analysis for retention tracking

- Customer segmentation (high-value, at-risk, etc.)

- Funnel visualization with drop-off analysis

**Content Management System:**

- Blog with SEO-optimized articles

- Educational resource library

- Video content integration

- Author profiles for credibility

**Loyalty Program:**

- Points system for purchases and referrals

- Tiered rewards (bronze, silver, gold)

- Exclusive perks for VIP customers

- Birthday rewards and anniversary bonuses

**Success Criteria:**

- $50,000 monthly revenue

- 40% subscription conversion rate

- 25% repeat purchase rate

- 10,000+ email subscribers

### Phase 3: Scale (Months 7-12)

**Objectives:**

- Reach $100,000 monthly revenue

- Expand product line to 5-7 SKUs

- Build community and brand advocacy

- Optimize operations for efficiency

**Key Features:**

**Product Line Expansion:**

- Ashwagandha + L-Theanine (stress + focus)

- Magnesium Glycinate (sleep support)

- Omega-3 (inflammation + heart health)

- Vitamin D3 + K2 (immune + bone health)

- Multi-vitamin (foundational health)

**Mobile App:**

- iOS and Android native apps

- Subscription management

- Order tracking

- Health tracking integration (Apple Health, Google Fit)

- Push notifications for order updates

**Community Features:**

- User forum for discussions

- Private Facebook group for customers

- Monthly Q&A sessions with founder

- Customer success stories and case studies

**Advanced Personalization:**

- Quiz to recommend products based on health goals

- Personalized supplement stacks

- Custom dosing recommendations

- AI-powered chatbot for product questions

**Inventory Management:**

- Automated reorder points

- Supplier integration for real-time stock updates

- Demand forecasting based on historical data

- Multi-warehouse support for faster shipping

**International Expansion:**

- Shipping to Canada, UK, Australia

- Multi-currency support

- Localized pricing and promotions

- International payment methods (PayPal, local cards)

**Success Criteria:**

- $100,000 monthly revenue

- 50% subscription conversion rate

- <3% monthly churn rate

- 15,000+ email subscribers

### Phase 4: Maturity (Months 13-24)

**Objectives:**

- Establish OptiBio as category leader

- Expand to retail partnerships

- Launch B2B wholesale channel

- Explore acquisition opportunities

**Key Features:**

**Retail Partnerships:**

- Placement in Whole Foods, Sprouts, Vitamin Shoppe

- Co-branded products with wellness brands

- Pop-up shops in major cities

**B2B Wholesale:**

- Wholesale portal for gyms, wellness centers, clinics

- Bulk pricing and custom packaging

- White-label options for practitioners

**Subscription Enhancements:**

- Flexible subscription customization (skip, swap, delay)

- Subscription gifting

- Auto-refill based on usage patterns

- Subscription analytics for customers (track savings, usage)

**Advanced Testing & Transparency:**

- Live-stream factory tours

- Real-time batch testing updates

- Blockchain-based supply chain tracking

- Customer-requested testing (allergens, specific contaminants)

**Partnerships & Integrations:**

- Integration with health apps (MyFitnessPal, Cronometer)

- Partnerships with functional medicine practitioners

- Corporate wellness programs

- Insurance reimbursement eligibility

**Success Criteria:**

- $200,000+ monthly revenue

- 60% subscription conversion rate

- <2% monthly churn rate

- 25,000+ email subscribers

- Retail presence in 500+ stores

---

## Appendix

### Glossary

**AOV (Average Order Value)**: The average dollar amount spent per order.

**CAC (Customer Acquisition Cost)**: The total cost of acquiring a new customer, including marketing and sales expenses.

**Churn Rate**: The percentage of customers who cancel their subscription within a given period.

**COGS (Cost of Goods Sold)**: The direct costs of producing products, including materials, manufacturing, and shipping.

**Conversion Rate**: The percentage of website visitors who complete a desired action (e.g., make a purchase).

**LTV (Lifetime Value)**: The total revenue expected from a customer over their entire relationship with the business.

**MRR (Monthly Recurring Revenue)**: The predictable revenue generated from subscriptions each month.

**NPS (Net Promoter Score)**: A metric measuring customer loyalty based on likelihood to recommend.

**SKU (Stock Keeping Unit)**: A unique identifier for each distinct product or variant.

**tRPC**: TypeScript Remote Procedure Call - a library for building type-safe APIs.

### Technical Dependencies

**Production Dependencies:**

```json
{
  "@stripe/stripe-js": "^4.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@trpc/client": "^11.0.0",
  "@trpc/react-query": "^11.0.0",
  "@trpc/server": "^11.0.0",
  "drizzle-orm": "^0.33.0",
  "express": "^4.18.0",
  "mysql2": "^3.6.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "stripe": "^16.0.0",
  "superjson": "^2.2.0",
  "wouter": "^3.0.0",
  "zod": "^3.22.0"
}
```

**Development Dependencies:**

```json
{
  "@types/node": "^24.0.0",
  "@types/react": "^19.0.0",
  "@vitejs/plugin-react": "^4.3.0",
  "drizzle-kit": "^0.24.0",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.6.0",
  "vite": "^7.1.0"
}
```

### Environment Variables Reference

**Required for Production:**

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=Your Name

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Application
VITE_APP_TITLE=OptiBio - Premium Ashwagandha KSM-66 Supplements
VITE_APP_LOGO=/optibio-logo-v3.png
VITE_APP_ID=your-app-id
```

**Optional (Manus Features ):**

```bash
# Manus Built-in Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

### Contact & Support

**Project Owner**: Panna Nahar**Development Team**: Manus AI + GPT Codex (planned )**GitHub Repository**: [optibiosupplements/optibio-ecommerce](https://github.com/optibiosupplements/optibio-ecommerce)**Production URL**: [optibiosupplements.com](https://optibiosupplements.com)

**Support Channels**:

- GitHub Issues for technical bugs

- Email: [support@optibiosupplements.com](mailto:support@optibiosupplements.com) (to be set up)

- Live chat on website (to be implemented)

---

**Document History:**

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 1.0 | Nov 11, 2025 | Manus AI | Initial comprehensive PRD created |

---

**End of Document**

