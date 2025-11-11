# OptiBio E-Commerce Project TODO

## 🚀 CURRENT FOCUS: Coming Soon Mode Implementation

### FINAL PRICING STRATEGY
- Founder's Circle: $69 for 2 bottles (100 spots) - 25% off for life
- Early Believer: $49 for 1 bottle (500 spots) - 15% off for life  
- Pre-Launch: $54.99 for 1 bottle (unlimited) - 10% off for life
- Regular Price (post-launch): $59.99

### Phase 1: Coming Soon Mode (THIS WEEK)
- [x] Add pre-launch banner at top of site
- [x] Add countdown timer showing "Ships in 90 days"
- [x] Disable ALL "Add to Cart" buttons sitewide
- [x] Replace "Add to Cart" with "Reserve Your Spot" buttons
- [x] Build reservation modal/page with tier comparison
- [x] Create reservation form (name, email, tier selection)
- [x] Build reservation confirmation page
- [ ] Send confirmation email ("You're Founder #X")
- [ ] Track reservations in database
- [ ] Add social proof counter ("X people reserved")

### Phase 2: Payment Opens (WEEK 2 - Day 15)
- [ ] Email all reservations: "Payment is open"
- [ ] Build payment page for reserved customers
- [ ] Stripe checkout integration
- [ ] 48-hour hold timer on reservations
- [ ] Convert reservation → paid order
- [ ] Order confirmation email
- [ ] Admin dashboard for tracking conversions

### Phase 3: Manufacturing Updates (Days 15-90)
- [ ] Weekly email updates with photos
- [ ] Behind-the-scenes content hub
- [ ] Quality testing results shared
- [ ] Shipping timeline updates
- [ ] Customer portal with order status

### Phase 4: Shipping (Day 90)
- [ ] Send tracking numbers
- [ ] Ship all orders
- [ ] Activate lifetime discount codes
- [ ] Thank you email with reorder link

## ✅ COMPLETED FEATURES

### Pre-Launch Infrastructure
- [x] Manifesto section with industry truth
- [x] Waitlist email capture
- [x] Database schema for presale (waitlist, reservations, campaign)
- [x] tRPC procedures for waitlist and reservations
- [x] Presale database helper functions

### Brand & UX
- [x] Emotion-first hero section
- [x] Benefits with feeling → data pattern
- [x] Week-by-week timeline
- [x] Lifestyle photography
- [x] "Who This Is For" section
- [x] Wellness Plan Personalizer
- [x] Breadcrumb navigation

### Product Information
- [x] 300mg per capsule, 90 capsules, 45-day supply
- [x] Accurate supplement facts
- [x] 6 clinical study links
- [x] 4 quality documents
- [x] Batch verification

### Core E-Commerce (TO BE DISABLED FOR COMING SOON MODE)
- [x] Shopping cart (will disable)
- [x] Stripe payments (will use for reservations later)
- [x] Order management
- [x] Checkout flow (will replace with reservation flow)

## 🎯 REVENUE TARGETS

**Conservative:** $48,496
- 100 Founder's × $69 = $6,900
- 400 Early Believer × $49 = $19,600
- 400 Pre-Launch × $54.99 = $21,996

**Moderate:** $64,394
- 100 Founder's × $69 = $6,900
- 500 Early Believer × $49 = $24,500
- 600 Pre-Launch × $54.99 = $32,994

**Optimistic:** $86,390
- 100 Founder's × $69 = $6,900
- 500 Early Believer × $49 = $24,500
- 1,000 Pre-Launch × $54.99 = $54,990

**Realistic Target: $50,000-$70,000 in 90 days**
