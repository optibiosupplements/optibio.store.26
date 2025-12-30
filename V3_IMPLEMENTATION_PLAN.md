# OptiBio V3 Design System Implementation Plan
**Date:** December 30, 2025  
**Authority:** OPTIBIO_UNIFIED_DESIGN_SYSTEM_v3.md  
**Status:** IN PROGRESS

---

## 🎯 OBJECTIVE
Systematically update the entire OptiBio e-commerce site to match the v3 Unified Design System specifications exactly.

---

## 📋 CORE BRAND PALETTE VERIFICATION

### Colors to Verify/Update:
1. **Deep Navy (#1E3A5F)** - Primary text & headings
   - [ ] All major headlines
   - [ ] Navigation links
   - [ ] Body text (where appropriate)
   
2. **Pure White (#FFFFFF)** - Cards & containers
   - [ ] Product cards
   - [ ] Buy box background
   - [ ] Section cards
   
3. **Antique Gold (#C9A961)** - Accents only
   - [ ] Icons
   - [ ] Borders (subtle)
   - [ ] 5-star ratings
   
4. **Sky Gradient** - Hero sections
   - [ ] Homepage hero
   - [ ] Shop page hero
   - [ ] Science page hero
   - [ ] About page hero
   - [ ] FAQ page hero
   - **Exact CSS:** `radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)`

---

## 🎨 CONVERSION PALETTE IMPLEMENTATION

### Component 1: Countdown Timer
**Current Status:** Need to verify
**Required Styling:**
```css
background: linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%);
border: 1px solid #FED7AA;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(194, 65, 12, 0.1);
color: #7C2D12; /* Deep Rust */
```

**Files to Update:**
- [ ] BuyBox.tsx (countdown timer component)
- [ ] Home.tsx (if countdown appears elsewhere)

### Component 2: Social Proof Cards
**Current Status:** Need to verify
**Required Styling:**
```css
background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
border: 1px solid #BBF7D0;
border-radius: 16px;
box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
color: #16A34A; /* Success Green */
```

**Files to Update:**
- [ ] BuyBox.tsx (social proof indicators: "127 sold", "43 left", "18 viewing")
- [ ] Home.tsx (testimonial cards)
- [ ] Any review/rating components

### Component 3: Primary CTA Button
**Current Status:** Need to verify
**Required Styling:**
```css
background: #2563EB; /* Electric Blue */
color: #FFFFFF;
border-radius: 12px;
box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);

/* Hover state */
background: #1D4ED8;
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
```

**Files to Update:**
- [ ] BuyBox.tsx ("Pre-Order Now" button)
- [ ] Home.tsx (all CTA buttons)
- [ ] Shop.tsx (CTA buttons)
- [ ] ProductDetail.tsx (Add to Cart button)

---

## 🔍 PAGE-BY-PAGE AUDIT

### Homepage (Home.tsx)
- [ ] Hero section: Sky Gradient background
- [ ] Headline: Deep Navy (#1E3A5F)
- [ ] Buy box: Pure White background
- [ ] Countdown timer: Peach gradient
- [ ] Social proof cards: Green gradient
- [ ] Primary CTA: Electric Blue (#2563EB)
- [ ] Trust badges: Antique Gold accents
- [ ] Benefits section cards: Pure White
- [ ] 90-Day Guarantee: Deep Navy background
- [ ] Timeline cards: Pure White with proper styling
- [ ] Testimonial cards: Green gradient (social proof)
- [ ] Footer CTA: Electric Blue

### Shop Page (Shop.tsx)
- [ ] Hero section: Sky Gradient
- [ ] "The Protocol" headline: Deep Navy
- [ ] Product card: Pure White
- [ ] CTA button: Electric Blue
- [ ] Trust badges: Antique Gold accents

### Science Page (Science.tsx)
- [ ] Hero section: Sky Gradient
- [ ] Headline: Deep Navy
- [ ] Stat cards: Pure White
- [ ] Comparison table: Pure White cards
- [ ] CTA buttons: Electric Blue

### About Page (About.tsx)
- [ ] Hero section: Sky Gradient
- [ ] Mission cards: Pure White
- [ ] Section backgrounds: Proper alternation
- [ ] Team cards: Pure White

### FAQ Page (FAQ.tsx)
- [ ] Hero section: Sky Gradient
- [ ] Accordion cards: Pure White
- [ ] Section backgrounds: Clean and consistent

### BuyBox Component (BuyBox.tsx)
- [ ] Card background: Pure White
- [ ] Countdown timer: Peach gradient
- [ ] Social proof indicators: Green gradient
- [ ] Primary CTA: Electric Blue
- [ ] Trust badges: Antique Gold accents

---

## 🚫 COLORS TO REMOVE

### Generic Tailwind Colors (Replace with v3 palette):
- ❌ `bg-slate-50`, `bg-slate-100`, `bg-slate-900`
- ❌ `text-slate-600`, `text-slate-700`, `text-slate-900`
- ❌ `bg-blue-50`, `bg-blue-500`, `bg-blue-600`
- ❌ `border-slate-200`, `border-gray-200`
- ❌ Generic gray shadows: `shadow-md`, `shadow-lg`

### Replace With:
- ✅ Deep Navy (#1E3A5F) for text
- ✅ Pure White (#FFFFFF) for cards
- ✅ Antique Gold (#C9A961) for accents
- ✅ Colored shadows (green/peach/blue glows)

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Core Palette Update
- [ ] Update index.css with v3 color variables
- [ ] Add Sky Gradient class
- [ ] Add Peach Gradient class
- [ ] Add Green Gradient class
- [ ] Remove generic Tailwind colors

### Phase 2: Component Updates
- [ ] Update BuyBox component
- [ ] Update countdown timer styling
- [ ] Update social proof cards
- [ ] Update primary CTA buttons
- [ ] Update trust badges

### Phase 3: Page Updates
- [ ] Update Homepage
- [ ] Update Shop page
- [ ] Update Science page
- [ ] Update About page
- [ ] Update FAQ page

### Phase 4: Verification
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Verify WCAG AA contrast ratios
- [ ] Test mobile responsive
- [ ] Compare against reference designs

---

## 🎯 SUCCESS CRITERIA

**The site will be considered v3-compliant when:**
1. ✅ All hero sections use Sky Gradient (not solid beige)
2. ✅ All primary headings use Deep Navy (#1E3A5F)
3. ✅ All cards use Pure White (#FFFFFF) background
4. ✅ Countdown timer uses Peach gradient
5. ✅ Social proof uses Green gradient
6. ✅ Primary CTAs use Electric Blue (#2563EB)
7. ✅ No generic Tailwind colors in brand areas
8. ✅ All shadows use colored glows
9. ✅ Typography uses Sora + Inter
10. ✅ WCAG AA contrast ratios met

---

**NEXT STEP:** Begin systematic implementation starting with index.css color variables.
