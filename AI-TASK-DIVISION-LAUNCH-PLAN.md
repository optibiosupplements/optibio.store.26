# OptiBio Launch: AI Task Division & Collaboration Plan

**Created:** February 4, 2026  
**Goal:** Launch OptiBio as quickly as possible without cutting corners  
**Strategy:** Divide tasks by AI platform specialty for maximum efficiency

---

## 📊 Current Status Summary

### ✅ COMPLETED (Ready for Launch)
- E-commerce core (Stripe, subscriptions, checkout)
- Admin dashboard with sidebar navigation
- Products, Orders, Discounts, Customers management
- Shipping integration (EasyPost) with label generation
- Content management (Pages, Blog, FAQ)
- Abandoned cart & post-purchase email sequences (templates ready)
- Analytics dashboards (Revenue, Traffic, Conversions)
- Security (Admin auth protection, audit logging)
- Design system (Clinical Light Mode, CSS variables)

### 🔴 CRITICAL REMAINING (Must Complete Before Launch)
1. **Email Scheduler Cron Jobs** - Automated abandoned cart & post-purchase emails
2. **Test Order Flow** - Complete end-to-end test with Stripe test card
3. **Production Email Service** - SendGrid/Mailgun integration
4. **GA4 & Facebook Pixel** - Tracking IDs configuration
5. **Warehouse Address Verification** - Confirm shipping origin
6. **Final QA Testing** - All critical flows

---

## 🤖 AI PLATFORM SPECIALTIES

| Platform | Strengths | Best For |
|----------|-----------|----------|
| **Manus** | Full-stack coding, sandbox environment, file system access, database operations, deployment | Backend development, integrations, testing, deployment |
| **ChatGPT** | Strategy, copywriting, documentation, complex reasoning, research | Marketing copy, email templates, documentation, business strategy |
| **Gemini** | Visual design, UI/UX analysis, image understanding, creative direction | Design reviews, visual QA, creative assets, UI polish |

---

## 📋 TASK ASSIGNMENTS

### 🟢 MANUS (Primary Developer) - Backend & Integration

**Priority 1: Email Automation (2-3 hours)**
```
[ ] Create email scheduler cron job system
    - server/jobs/email-scheduler.ts
    - Abandoned cart: 1hr, 24hr, 48hr after cart creation
    - Post-purchase: Day 1, 7, 21, 60, 90 after order
    - Use existing email templates in server/email.ts
[ ] Add scheduler endpoints to admin dashboard
[ ] Test email delivery with test accounts
```

**Priority 2: Test Order Flow (1 hour)**
```
[ ] Place test order with Stripe card 4242 4242 4242 4242
[ ] Verify order appears in /admin/orders
[ ] Generate shipping label in /admin/shipping
[ ] Verify email notifications sent
[ ] Test refund flow
```

**Priority 3: Production Configuration (1 hour)**
```
[ ] Wire adminDashboard.getMetrics to Admin.tsx homepage
[ ] Verify all admin pages have consistent styling
[ ] Run full test suite (pnpm test)
[ ] Create pre-launch checkpoint
```

**Priority 4: Monitoring & Alerts (30 min)**
```
[ ] Add low-stock email alerts to owner
[ ] Add new order notification to owner
[ ] Verify error logging is working
```

---

### 🔵 CHATGPT (Strategy & Content) - Copy & Documentation

**Priority 1: Email Sequence Optimization (1-2 hours)**
```
[ ] Review and optimize abandoned cart email copy
    - Email 1 (1hr): Gentle reminder
    - Email 2 (24hr): Social proof + urgency
    - Email 3 (48hr): Final offer with discount
[ ] Review and optimize post-purchase email copy
    - Order confirmation
    - Shipping notification
    - Delivery confirmation
    - Review request (Day 21)
    - Reorder reminder (Day 60)
    - Subscribe & Save pitch (Day 90)
[ ] Create A/B test variants for subject lines
```

**Priority 2: Launch Checklist Documentation (1 hour)**
```
[ ] Create pre-launch QA checklist
[ ] Create launch day runbook
[ ] Create post-launch monitoring guide
[ ] Document rollback procedures
```

**Priority 3: Marketing Copy Review (1 hour)**
```
[ ] Review homepage copy for conversion optimization
[ ] Review product descriptions
[ ] Review FAQ answers for completeness
[ ] Suggest urgency/scarcity copy improvements
```

**Priority 4: Legal & Compliance Review (30 min)**
```
[ ] Review Privacy Policy for GDPR/CCPA compliance
[ ] Review Terms of Service
[ ] Review supplement disclaimer language
[ ] Verify FDA compliance statements
```

---

### 🟡 GEMINI (Design & Visual QA) - UI Polish

**Priority 1: Visual QA Audit (1-2 hours)**
```
[ ] Screenshot all public pages and review for:
    - Color consistency (Sky Blue gradient, Navy, Gold)
    - Typography hierarchy
    - Spacing and alignment
    - Mobile responsiveness
[ ] Screenshot all admin pages and review for:
    - Consistent styling
    - Readable tables
    - Proper form layouts
[ ] Document any visual issues found
```

**Priority 2: Conversion Optimization Review (1 hour)**
```
[ ] Review hero section for conversion best practices
[ ] Review product page layout
[ ] Review checkout flow UX
[ ] Review cart abandonment touchpoints
[ ] Suggest micro-interaction improvements
```

**Priority 3: Accessibility Audit (30 min)**
```
[ ] Check color contrast ratios
[ ] Verify focus states on interactive elements
[ ] Check alt text on images
[ ] Verify keyboard navigation
```

---

## 🔄 COLLABORATION WORKFLOW

### Step 1: Manus Implements → ChatGPT Reviews → Gemini Polishes

```
1. MANUS: Implements email scheduler cron jobs
2. CHATGPT: Reviews email copy, suggests improvements
3. MANUS: Updates email templates with ChatGPT's copy
4. GEMINI: Reviews email template visual design
5. MANUS: Applies Gemini's visual fixes
6. ALL: Sign off on email system
```

### Step 2: Parallel Execution

While Manus works on backend tasks, ChatGPT and Gemini can work in parallel:

```
MANUS (Backend)          | CHATGPT (Content)       | GEMINI (Design)
-------------------------|-------------------------|------------------
Email scheduler          | Email copy review       | Visual QA audit
Test order flow          | Launch documentation    | Mobile responsiveness
Production config        | Marketing copy review   | Accessibility check
```

### Step 3: Integration Points

**Handoff from ChatGPT to Manus:**
- Optimized email copy → Update server/email.ts templates
- Launch checklist → Create todo items in todo.md

**Handoff from Gemini to Manus:**
- Visual issues list → Fix CSS/components
- Accessibility issues → Update ARIA labels, focus states

---

## 📅 SUGGESTED TIMELINE

### Day 1 (Today)
| Time | Manus | ChatGPT | Gemini |
|------|-------|---------|--------|
| Hour 1-2 | Email scheduler implementation | Email copy optimization | Visual QA - Public pages |
| Hour 3 | Test order flow | Launch documentation | Visual QA - Admin pages |
| Hour 4 | Apply copy/design fixes | Marketing copy review | Accessibility audit |

### Day 2
| Time | Manus | ChatGPT | Gemini |
|------|-------|---------|--------|
| Hour 1 | Final fixes from reviews | A/B test variants | Final visual polish |
| Hour 2 | Full test suite | Legal review | Mobile testing |
| Hour 3 | Pre-launch checkpoint | Runbook finalization | Sign-off |

### Day 3: LAUNCH
- Morning: Final smoke tests
- Afternoon: Publish site
- Evening: Monitor analytics

---

## 📝 COPY-PASTE PROMPTS FOR EACH AI

### For ChatGPT:
```
I'm launching an e-commerce site for OptiBio (premium ashwagandha supplements).
I need you to review and optimize the following email sequences:

1. ABANDONED CART SEQUENCE (3 emails: 1hr, 24hr, 48hr)
2. POST-PURCHASE SEQUENCE (6 emails: Day 1, 7, 21, 60, 90)

For each email, provide:
- Optimized subject line (with A/B variant)
- Email body copy
- CTA button text

Brand voice: Clinical authority + warm wellness
Target audience: Health-conscious adults 30-55
Key differentiators: KSM-66 certified, 5% withanolides, 90-day guarantee
```

### For Gemini:
```
I need a visual QA audit of my e-commerce site OptiBio.
Please review the following screenshots and identify:

1. Color consistency issues (should use Sky Blue gradient, Deep Navy #1E3A5F, Antique Gold #C9A961)
2. Typography hierarchy problems
3. Spacing/alignment issues
4. Mobile responsiveness concerns
5. Accessibility issues (contrast, focus states)

Design system: Clinical Light Mode (Apple Health aesthetic)
Brand: Premium pharmaceutical-grade supplements
```

---

## ✅ COMPLETION CHECKLIST

Before launch, all three AIs must confirm:

### Manus Confirms:
- [ ] Email scheduler running and tested
- [ ] Test order completed successfully
- [ ] All admin pages functional
- [ ] All tests passing
- [ ] Checkpoint saved

### ChatGPT Confirms:
- [ ] Email copy optimized and approved
- [ ] Launch documentation complete
- [ ] Legal/compliance reviewed
- [ ] Marketing copy approved

### Gemini Confirms:
- [ ] Visual QA passed
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Design system consistent

---

## 🚀 LAUNCH COMMAND

Once all confirmations received:
1. Manus creates final checkpoint
2. User clicks "Publish" in Management UI
3. Monitor analytics dashboard for first 24 hours
4. Celebrate! 🎉

---

*Document created by Manus for OptiBio launch coordination*
