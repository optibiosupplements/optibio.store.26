# OptiBio E-Commerce SME Expert Review List

**Document Version:** 1.0  
**Date:** February 3, 2026  
**Purpose:** Comprehensive list of Subject Matter Experts required to review and implement all aspects of optibiosupplements.com as a fully operational e-commerce business

---

## Executive Summary

This document outlines **21 SME roles** organized into **7 functional domains** required to build, review, and operate a complete e-commerce business. Each expert is responsible for specific deliverables that ensure the website functions as a professional, compliant, and high-converting online store.

---

## Domain 1: Technology & Development

### 1.1 Full-Stack Web Developer
**Responsibility:** Core website architecture, performance, and functionality

| Review Area | Deliverables |
|-------------|--------------|
| Frontend Architecture | React/TypeScript code quality, component structure, responsive design |
| Backend Architecture | tRPC API design, database schema, server performance |
| Security Implementation | HTTPS, CORS, XSS/CSRF protection, input validation |
| Performance Optimization | Core Web Vitals, lazy loading, caching strategies |
| Code Quality | Testing coverage, error handling, logging |

### 1.2 Database Administrator (DBA)
**Responsibility:** Data integrity, performance, and backup systems

| Review Area | Deliverables |
|-------------|--------------|
| Schema Design | Normalized tables, proper indexing, relationships |
| Query Optimization | Efficient queries, connection pooling |
| Backup & Recovery | Automated backups, disaster recovery plan |
| Data Security | Encryption at rest, access controls, PII handling |

### 1.3 DevOps/Infrastructure Engineer
**Responsibility:** Deployment, monitoring, and system reliability

| Review Area | Deliverables |
|-------------|--------------|
| CI/CD Pipeline | GitHub Actions, automated testing, deployment workflows |
| Server Configuration | Environment variables, SSL certificates, domain setup |
| Monitoring & Alerting | Uptime monitoring, error tracking, performance alerts |
| Scalability | Load balancing, auto-scaling configuration |

### 1.4 Security Engineer
**Responsibility:** Application security and compliance

| Review Area | Deliverables |
|-------------|--------------|
| Vulnerability Assessment | OWASP Top 10 audit, penetration testing |
| Authentication & Authorization | Session management, role-based access control |
| PCI DSS Compliance | Payment data handling, secure transmission |
| Privacy Compliance | GDPR/CCPA data handling, cookie consent |

---

## Domain 2: Payment & Financial Operations

### 2.1 Payment Systems Architect
**Responsibility:** Stripe integration and payment flow

| Review Area | Deliverables |
|-------------|--------------|
| Stripe Checkout Integration | Session creation, webhook handling, error recovery |
| Payment Methods | Credit cards, Apple Pay, Google Pay configuration |
| Subscription/Recurring Payments | Future subscription model architecture |
| Refund & Dispute Handling | Automated refund workflows, chargeback procedures |
| Test Mode Verification | Complete payment flow testing with test cards |

**Critical Stripe Checklist:**
- [ ] Checkout session creation with proper metadata
- [ ] Webhook endpoint at `/api/stripe/webhook` with signature verification
- [ ] Test event handling (`evt_test_*` returns `{verified: true}`)
- [ ] `payment_intent.succeeded` event processing
- [ ] `checkout.session.completed` event processing
- [ ] Customer ID storage and retrieval
- [ ] Proper error handling and logging
- [ ] Live mode key configuration path documented

### 2.2 Financial Controller / CPA
**Responsibility:** Accounting integration and financial compliance

| Review Area | Deliverables |
|-------------|--------------|
| Revenue Recognition | Proper booking of sales, deferred revenue handling |
| Tax Configuration | Sales tax calculation, tax-exempt handling |
| Financial Reporting | Daily/weekly/monthly sales reports |
| Accounting Integration | Xero/QuickBooks sync for transactions |
| Audit Trail | Complete transaction history, reconciliation |

### 2.3 Fraud Prevention Specialist
**Responsibility:** Payment fraud detection and prevention

| Review Area | Deliverables |
|-------------|--------------|
| Stripe Radar Configuration | Risk rules, block lists, velocity checks |
| Address Verification | AVS/CVV enforcement settings |
| High-Risk Order Flagging | Manual review workflow for suspicious orders |
| Chargeback Prevention | 3D Secure implementation, clear billing descriptors |

---

## Domain 3: Shipping & Fulfillment Operations

### 3.1 Shipping & Logistics Manager
**Responsibility:** Carrier integration and shipping workflow

| Review Area | Deliverables |
|-------------|--------------|
| **Carrier API Integration** | |
| - FedEx | Ship API, rate quotes, tracking, label generation |
| - UPS | Shipping API, rate shopping, tracking webhooks |
| - USPS | Web Tools API, Priority Mail, tracking |
| **Shipping Workflow** | |
| Rate Shopping | Real-time rate comparison across carriers |
| Label Generation | Print-ready shipping labels (4x6 thermal) |
| Packing Slip Generation | Order details, return instructions, branding |
| Tracking Integration | Automatic tracking number capture and storage |

**Shipping Label Requirements:**
- [ ] Generate labels for FedEx Ground, Express, Home Delivery
- [ ] Generate labels for UPS Ground, 2-Day, Next Day
- [ ] Generate labels for USPS Priority Mail, First Class
- [ ] Support for residential vs commercial addresses
- [ ] Signature confirmation options
- [ ] Insurance options for high-value orders

### 3.2 Warehouse Operations Specialist
**Responsibility:** Internal fulfillment workflow

| Review Area | Deliverables |
|-------------|--------------|
| Order Queue Management | Prioritized pick list, batch processing |
| Packing Slip Design | Professional branded slip with order details |
| Inventory Management | Stock levels, low-stock alerts, reorder points |
| Returns Processing | RMA workflow, return label generation |
| Quality Control | Order verification checklist before shipping |

**Packing Slip Requirements:**
- [ ] Order number and date
- [ ] Customer shipping address
- [ ] Item details (SKU, name, quantity)
- [ ] Special instructions field
- [ ] Return policy summary
- [ ] Brand logo and contact info
- [ ] Barcode for scanning

### 3.3 Customer Communications Specialist
**Responsibility:** Transactional email workflow

| Review Area | Deliverables |
|-------------|--------------|
| Order Confirmation Email | Immediate send after purchase, order details |
| Shipping Confirmation Email | Carrier, tracking number, estimated delivery |
| Tracking Updates | Automated updates at key milestones |
| Delivery Confirmation | "Your order has arrived" notification |
| Review Request | Post-delivery review solicitation |

**Email Trigger Points:**
1. Order placed → Order Confirmation
2. Label created → Shipping Confirmation with tracking
3. Package picked up → "On the way" update
4. Out for delivery → "Arriving today" notification
5. Delivered → Delivery confirmation + review request

---

## Domain 4: Marketing & Advertising

### 4.1 Google Ads Specialist
**Responsibility:** Google Ads configuration and tracking

| Review Area | Deliverables |
|-------------|--------------|
| **Google Tag Manager Setup** | |
| GTM Container | Properly configured container on all pages |
| Google Ads Tag | Conversion tracking tag installed |
| Enhanced Conversions | Customer data (email, phone) passed securely |
| **Conversion Tracking** | |
| Purchase Conversion | Transaction value, order ID, currency |
| Add to Cart Event | Product data, value |
| Begin Checkout Event | Cart contents, value |
| **Google Merchant Center** | |
| Product Feed | Structured data for Shopping ads |
| Merchant Center Verification | Domain ownership, policy compliance |

**Google Ads Checklist:**
- [ ] GTM container installed on all pages
- [ ] Google Ads conversion tag firing on purchase
- [ ] Enhanced conversions configured with hashed email
- [ ] Remarketing tag for audience building
- [ ] Google Analytics 4 linked to Google Ads
- [ ] Product feed submitted to Merchant Center
- [ ] Conversion value tracking accurate

### 4.2 Meta Ads Specialist (Facebook/Instagram)
**Responsibility:** Meta Pixel and Conversions API setup

| Review Area | Deliverables |
|-------------|--------------|
| **Meta Pixel Setup** | |
| Base Pixel | Installed on all pages, verified |
| Standard Events | ViewContent, AddToCart, InitiateCheckout, Purchase |
| Custom Events | Product-specific events as needed |
| **Conversions API (CAPI)** | |
| Server-Side Tracking | Redundant tracking for iOS 14+ accuracy |
| Event Deduplication | Prevent double-counting browser + server events |
| **Product Catalog** | |
| Catalog Setup | Product feed for dynamic ads |
| Catalog Sync | Automated inventory/price updates |

**Meta Ads Checklist:**
- [ ] Meta Pixel installed and verified
- [ ] ViewContent event on product pages
- [ ] AddToCart event on add to cart action
- [ ] InitiateCheckout event on checkout start
- [ ] Purchase event with value, currency, content_ids
- [ ] Conversions API sending server-side events
- [ ] Event Match Quality score > 6.0
- [ ] Product catalog connected and synced

### 4.3 Analytics & Attribution Specialist
**Responsibility:** Data tracking and reporting accuracy

| Review Area | Deliverables |
|-------------|--------------|
| Google Analytics 4 | Enhanced ecommerce tracking, custom dimensions |
| UTM Parameter Handling | Consistent campaign tracking |
| Attribution Modeling | Cross-channel attribution setup |
| Dashboard Creation | Real-time sales, traffic, conversion dashboards |
| A/B Test Tracking | Event tagging for variant analysis |

---

## Domain 5: User Experience & Design

### 5.1 UX/UI Designer
**Responsibility:** User experience and interface design

| Review Area | Deliverables |
|-------------|--------------|
| Visual Hierarchy | Clear information architecture, F-pattern optimization |
| Mobile Experience | Touch targets, thumb zones, responsive breakpoints |
| Accessibility | WCAG 2.1 AA compliance, screen reader compatibility |
| Micro-interactions | Hover states, loading states, transitions |
| Brand Consistency | Color palette, typography, imagery alignment |

### 5.2 Conversion Rate Optimization (CRO) Specialist
**Responsibility:** Conversion funnel optimization

| Review Area | Deliverables |
|-------------|--------------|
| Funnel Analysis | Drop-off points, friction identification |
| Trust Elements | Social proof placement, guarantee visibility |
| CTA Optimization | Button copy, color, placement testing |
| Checkout Optimization | Form fields, progress indicators, error handling |
| Exit Intent Strategy | Popup timing, offer optimization |

### 5.3 Copywriter / Content Strategist
**Responsibility:** Persuasive copy and content

| Review Area | Deliverables |
|-------------|--------------|
| Headlines & CTAs | Benefit-driven, action-oriented copy |
| Product Descriptions | Feature-benefit mapping, objection handling |
| Email Copy | Transactional email templates, subject lines |
| Legal Copy | Terms of service, privacy policy, disclaimers |
| SEO Content | Meta titles, descriptions, alt text |

---

## Domain 6: Legal & Compliance

### 6.1 E-Commerce Legal Counsel
**Responsibility:** Legal compliance and risk mitigation

| Review Area | Deliverables |
|-------------|--------------|
| Terms of Service | Purchase terms, liability limitations |
| Privacy Policy | Data collection, usage, sharing disclosures |
| Return/Refund Policy | Clear conditions, timeframes, process |
| Supplement Disclaimers | FDA compliance statements |
| Cookie Policy | Consent mechanism, tracking disclosures |

### 6.2 Regulatory Compliance Officer
**Responsibility:** Industry-specific compliance

| Review Area | Deliverables |
|-------------|--------------|
| FDA Compliance | Supplement labeling, claims verification |
| FTC Compliance | Advertising claims, testimonial disclosures |
| State Regulations | State-specific supplement sale requirements |
| International Shipping | Export restrictions, customs documentation |

---

## Domain 7: Business Operations

### 7.1 Customer Service Manager
**Responsibility:** Customer support infrastructure

| Review Area | Deliverables |
|-------------|--------------|
| Support Channels | Email, chat, phone configuration |
| FAQ/Help Center | Self-service knowledge base |
| Ticket System | Issue tracking, response SLAs |
| Escalation Procedures | Complex issue handling workflow |

### 7.2 Inventory & Supply Chain Manager
**Responsibility:** Stock management and procurement

| Review Area | Deliverables |
|-------------|--------------|
| Inventory Tracking | Real-time stock levels, SKU management |
| Reorder Automation | Low-stock alerts, purchase order generation |
| Supplier Management | Lead times, backup supplier contacts |
| Demand Forecasting | Sales velocity analysis, seasonal planning |

### 7.3 Business Intelligence Analyst
**Responsibility:** Reporting and insights

| Review Area | Deliverables |
|-------------|--------------|
| Sales Reporting | Daily/weekly/monthly revenue reports |
| Customer Analytics | LTV, acquisition cost, cohort analysis |
| Product Performance | Best sellers, conversion by product |
| Operational Metrics | Fulfillment time, shipping costs, return rates |

---

## Implementation Priority Matrix

| Priority | Domain | SME Roles | Rationale |
|----------|--------|-----------|-----------|
| **P0 - Critical** | Payment | Payment Systems Architect, Financial Controller | Cannot operate without payments |
| **P0 - Critical** | Shipping | Shipping Manager, Warehouse Ops | Cannot fulfill without shipping |
| **P0 - Critical** | Legal | Legal Counsel, Compliance Officer | Legal exposure risk |
| **P1 - High** | Marketing | Google Ads, Meta Ads Specialists | Revenue generation |
| **P1 - High** | Technology | Full-Stack Dev, Security Engineer | Site functionality & security |
| **P2 - Medium** | UX/Design | UX Designer, CRO Specialist | Conversion optimization |
| **P2 - Medium** | Operations | Customer Service, Inventory Manager | Operational efficiency |
| **P3 - Enhancement** | Analytics | BI Analyst, Attribution Specialist | Insights & optimization |

---

## Phase 2 Preparation: SME Agent Implementation

Each SME agent will be created with:

1. **Domain Expertise Prompt** - Detailed knowledge of their specialty
2. **Review Checklist** - Specific items to audit
3. **Implementation Authority** - Ability to make changes within scope
4. **Quality Gates** - Verification criteria before sign-off
5. **Handoff Protocol** - Documentation for cross-functional dependencies

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total SME Roles | 21 |
| Functional Domains | 7 |
| Critical (P0) Roles | 6 |
| High Priority (P1) Roles | 5 |
| Medium Priority (P2) Roles | 6 |
| Enhancement (P3) Roles | 4 |

---

**Document Prepared By:** Manus AI  
**Next Step:** Phase 2 - Create SME agents and begin systematic review of optibiosupplements.com
