# OptiBio Hero Section Specification
## Complete Recreation Guide for Exact Visual Match

**Version:** 1.0  
**Date:** January 21, 2026  
**Purpose:** Detailed specification for recreating the hero section exactly as shown in the reference design

---

## 1. Overall Layout Structure

### Container Specifications

The hero section uses a **two-column asymmetric grid layout** with the following proportions:

| Property | Value | Notes |
|----------|-------|-------|
| **Grid Split** | 60% / 40% | Left column wider, right column narrower |
| **Container Max Width** | `max-w-7xl` | ~1280px |
| **Container Padding** | `px-4 sm:px-6 lg:px-8` | Responsive horizontal padding |
| **Vertical Padding** | `py-12 lg:py-16` | Top and bottom spacing |
| **Column Gap** | `gap-8 lg:gap-12` | Space between columns |
| **Vertical Alignment** | `items-center` | Both columns vertically centered |

### Background

The entire hero section sits on a **Sky Blue Radial Gradient** background:

```css
background: radial-gradient(ellipse at top, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%);
```

| Gradient Stop | Color | Hex Code | Position |
|---------------|-------|----------|----------|
| Start | Pale Ice Blue | `#F8FCFE` | 0% (top center) |
| Middle | Light Sky Blue | `#EBF5FB` | 40% |
| End | Soft Blue | `#D6EAF8` | 100% (edges) |

---

## 2. Left Column Content (60% Width)

### 2.1 Top Badge

A small pill-shaped badge appears at the top of the content:

| Property | Value |
|----------|-------|
| **Text** | "SCIENCE-BACKED • THIRD-PARTY TESTED" |
| **Background** | `#1E3A5F` (Deep Navy) |
| **Text Color** | White |
| **Font Size** | `text-xs` (12px) |
| **Font Weight** | `font-semibold` |
| **Letter Spacing** | `tracking-wider` |
| **Padding** | `px-4 py-1.5` |
| **Border Radius** | `rounded-full` |
| **Text Transform** | Uppercase |

### 2.2 Main Headline

The headline is displayed on **three separate lines** for visual impact:

```
Feel Like
Yourself
Again
```

| Property | Value |
|----------|-------|
| **Font Family** | Sora (or system sans-serif fallback) |
| **Font Size** | `text-4xl sm:text-5xl lg:text-6xl` |
| **Font Weight** | `font-bold` (700) |
| **Line Height** | `leading-tight` (1.1) |
| **Text Color** | `#1E3A5F` (Deep Navy) |
| **Margin Bottom** | `mb-4` |

### 2.3 Subheadline / Description

| Property | Value |
|----------|-------|
| **Text** | "Our clinically-proven Ashwagandha KSM-66 helps you manage stress, improve sleep quality, and reclaim your natural energy." |
| **Font Size** | `text-lg` (18px) |
| **Font Weight** | `font-normal` (400) |
| **Text Color** | `#2D2D2D` (Charcoal) or `text-muted-foreground` |
| **Line Height** | `leading-relaxed` |
| **Max Width** | `max-w-lg` (~512px) |
| **Margin Bottom** | `mb-6` |

### 2.4 Trust Indicator Badges (Horizontal Row)

Three trust badges displayed in a **horizontal row** with gold circular icons:

| Badge | Icon | Text |
|-------|------|------|
| 1 | Shield (Lucide) | "Third-Party Tested" |
| 2 | Award (Lucide) | "GMP Certified" |
| 3 | Leaf (Lucide) | "Non-GMO & Organic" |

**Badge Styling:**

| Property | Value |
|----------|-------|
| **Layout** | `flex items-center gap-2` |
| **Container Gap** | `gap-4 sm:gap-6` |
| **Icon Size** | `w-6 h-6` |
| **Icon Color** | `#C9A961` (Antique Gold) |
| **Icon Background** | None (icon only) |
| **Text Color** | `#1E3A5F` (Deep Navy) |
| **Text Size** | `text-sm` (14px) |
| **Text Weight** | `font-medium` |

---

## 3. Right Column - Product Card (40% Width)

### 3.1 Card Container

The product card is a **unified white card** containing the product image and all purchase elements:

| Property | Value |
|----------|-------|
| **Background** | `#FFFFFF` (Pure White) |
| **Border** | `2px solid rgba(201, 169, 97, 0.2)` (Gold tint at 20% opacity) |
| **Border Radius** | `rounded-3xl` (24px) |
| **Box Shadow** | `shadow-2xl` |
| **Padding** | `p-6 sm:p-8` |
| **Max Width** | ~400px (constrained by grid) |

### 3.2 Product Image Container

The product bottle sits in a **warm beige gradient container**:

| Property | Value |
|----------|-------|
| **Background** | `linear-gradient(to bottom-right, #F7F4EF, #FFFFFF)` |
| **Border Radius** | `rounded-2xl` (16px) |
| **Padding** | `p-8` |
| **Box Shadow** | `shadow-lg` |
| **Height** | `h-64 sm:h-80` (256px - 320px) |

**Product Image:**

| Property | Value |
|----------|-------|
| **Source** | `/product-card-hero-transparent-optimized.png` |
| **Alt Text** | "OptiBio Ashwagandha KSM-66 - Premium Blue Bottle" |
| **Object Fit** | `object-contain` |
| **Size** | `w-full h-full` |
| **Drop Shadow** | `filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))` |

### 3.3 Countdown Timer Module

Positioned below the product image, showing pre-order deadline:

| Property | Value |
|----------|-------|
| **Background** | `linear-gradient(to right, #FEF2F2, #FFF7ED)` (Light pink to peach) |
| **Border** | `2px solid #FECACA` (Light red/pink) |
| **Border Radius** | `rounded-xl` (12px) |
| **Padding** | `p-4` |

**Timer Label:**

| Property | Value |
|----------|-------|
| **Text** | "Pre-orders close in:" |
| **Color** | `#DC2626` (Alert Red) |
| **Font Size** | `text-sm` (14px) |
| **Font Weight** | `font-semibold` |
| **Alignment** | Center |

**Timer Numbers:**

| Property | Value |
|----------|-------|
| **Font Family** | Sora |
| **Font Size** | `text-2xl` (24px) |
| **Font Weight** | `font-bold` (700) |
| **Color** | `#7C2D12` (Deep Brown) |
| **Format** | DD : HH : MM : SS |

### 3.4 Pricing Section

| Element | Value | Styling |
|---------|-------|---------|
| **Current Price** | $49.99 | `text-4xl sm:text-5xl font-bold text-[#1E3A5F]` |
| **Original Price** | $69.99 | `text-2xl text-muted-foreground line-through` |
| **Discount Badge** | "Save 29%" | Red badge (see below) |

**Discount Badge:**

| Property | Value |
|----------|-------|
| **Background** | `#DC2626` (Alert Red) |
| **Text Color** | White |
| **Font Size** | `text-base` (16px) |
| **Font Weight** | `font-bold` |
| **Padding** | `px-4 py-1.5` |
| **Border Radius** | Default badge radius |
| **Box Shadow** | `shadow-md` |

### 3.5 Pre-Order Special Badge

| Property | Value |
|----------|-------|
| **Icon** | Sparkles (Lucide) |
| **Icon Color** | `#C9A961` (Antique Gold) |
| **Label** | "Pre-Order Special:" |
| **Label Color** | `#1E3A5F` (Deep Navy) |
| **Label Weight** | `font-semibold` |
| **Shipping Text** | "Ships Jan 20-27, 2026" |
| **Shipping Color** | `text-muted-foreground` |

### 3.6 Free Shipping Badge

| Property | Value |
|----------|-------|
| **Background** | `#FEF3C7` (Light Amber/Yellow) |
| **Border** | `1px solid #FDE68A` |
| **Border Radius** | `rounded-lg` |
| **Padding** | `px-3 py-2` |
| **Icon** | ⏱️ (emoji, animated pulse) |
| **Text** | "Free shipping on orders $75+" |
| **Text Color** | `#92400E` (Amber Brown) |
| **Font Weight** | `font-semibold` |

### 3.7 Quantity Selector

| Property | Value |
|----------|-------|
| **Label** | "Quantity" |
| **Label Color** | `#1E3A5F` (Deep Navy) |
| **Label Size** | `text-sm font-semibold` |
| **Button Style** | Outline variant, `h-10 w-10` |
| **Button Border** | `2px solid rgba(201, 169, 97, 0.3)` |
| **Icons** | Minus / Plus (Lucide) |
| **Number Display** | `text-2xl font-bold text-[#1E3A5F]` |

### 3.8 Primary CTA Button

| Property | Value |
|----------|-------|
| **Text** | "Pre-Order Now - Save 29%" |
| **Background** | `#2563EB` (Electric Blue) |
| **Hover Background** | `#1D4ED8` (Darker Blue) |
| **Text Color** | White |
| **Font Size** | `text-lg` (18px) |
| **Font Weight** | `font-bold` |
| **Padding** | `py-7` (28px vertical) |
| **Width** | `w-full` (100%) |
| **Border** | `2px solid #2563EB` |
| **Box Shadow** | `shadow-lg` → `shadow-xl` on hover |
| **Hover Transform** | `scale(1.02)` |
| **Transition** | `300ms all` |
| **Icon** | ArrowRight (Lucide), `ml-2 w-5 h-5` |

### 3.9 Trust Footer (Below CTA)

Small text row with security indicators:

| Property | Value |
|----------|-------|
| **Font Size** | `text-xs` |
| **Text Color** | `text-muted-foreground` |
| **Layout** | `flex items-center justify-center gap-2 flex-wrap` |
| **Border Top** | `border-t border-[#C9A961]/20` |
| **Padding Top** | `pt-2` |

**Items:**
1. 🔒 Secure checkout (with lock icon)
2. • (separator)
3. Free shipping on $75+
4. • (separator)
5. 90-day guarantee

### 3.10 Social Proof Section

| Property | Value |
|----------|-------|
| **Background** | `#F0FDF4` (Mint Green) |
| **Border** | `2px solid #BBF7D0` (Light Green) |
| **Border Radius** | `rounded-xl` |
| **Padding** | `p-4` |

**Star Rating:**

| Property | Value |
|----------|-------|
| **Stars** | 5 filled stars |
| **Star Color** | `#C9A961` (Antique Gold) |
| **Star Size** | `w-5 h-5` |
| **Rating Text** | "4.9/5" |
| **Rating Style** | `text-sm font-bold text-[#1E3A5F]` |

**Customer Count:**

| Property | Value |
|----------|-------|
| **Text** | "5,247 happy customers" |
| **Number Style** | `font-bold text-[#1E3A5F]` |
| **Text Style** | `text-sm text-muted-foreground` |

**Recent Sales:**

| Property | Value |
|----------|-------|
| **Text** | "✅ 127 bottles sold in last 24 hours" |
| **Color** | `text-green-700` |
| **Font Size** | `text-xs` |
| **Font Weight** | `font-semibold` |

### 3.11 Urgency Indicators

Two small alert boxes below social proof:

**Stock Alert:**

| Property | Value |
|----------|-------|
| **Background** | `#FFF7ED` (Light Orange) |
| **Border** | `1px solid #FED7AA` |
| **Icon** | 🔥 (animated pulse) |
| **Text** | "Only 43 left in stock" |
| **Text Color** | `#C2410C` (Orange) |
| **Font Size** | `text-xs font-semibold` |

**Viewers Alert:**

| Property | Value |
|----------|-------|
| **Background** | `#EFF6FF` (Light Blue) |
| **Border** | `1px solid #BFDBFE` |
| **Icon** | 👀 |
| **Text** | "18 people viewing this right now" |
| **Text Color** | `#1D4ED8` (Blue) |
| **Font Size** | `text-xs font-semibold` |

### 3.12 Quality Badges Grid (Bottom of Card)

A 2x2 grid of quality certification badges:

| Badge | Icon | Title | Subtitle |
|-------|------|-------|----------|
| 1 | Shield | "Third-Party" | "Tested" |
| 2 | Award | "GMP" | "Certified" |
| 3 | CheckCircle2 | "Non-GMO" | "Organic" |
| 4 | TrendingUp | "20+ Studies" | "Proven" |

**Badge Styling:**

| Property | Value |
|----------|-------|
| **Grid** | `grid grid-cols-2 gap-3` |
| **Icon Size** | `w-6 h-6` |
| **Icon Color** | `#C9A961` (Antique Gold) |
| **Title** | `text-xs font-semibold text-[#1E3A5F]` |
| **Subtitle** | `text-xs text-muted-foreground` |
| **Alignment** | `flex flex-col items-center text-center` |
| **Border Top** | `border-t border-[#C9A961]/20` |
| **Padding Top** | `pt-4` |

---

## 4. Complete Color Reference

### Primary Brand Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Deep Navy | `#1E3A5F` | Headlines, primary text, buttons |
| Antique Gold | `#C9A961` | Icons, accents, badges, borders |
| Pure White | `#FFFFFF` | Card backgrounds, text on dark |
| Charcoal | `#2D2D2D` | Body text |

### Conversion Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Electric Blue | `#2563EB` | Primary CTA button |
| Hover Blue | `#1D4ED8` | CTA hover state |
| Alert Red | `#DC2626` | Discount badges |
| Timer Brown | `#7C2D12` | Countdown numbers |

### Background Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Sky Gradient Start | `#F8FCFE` | Hero background (top) |
| Sky Gradient Mid | `#EBF5FB` | Hero background (middle) |
| Sky Gradient End | `#D6EAF8` | Hero background (edges) |
| Warm Beige | `#F7F4EF` | Product image container |
| Mint Green | `#F0FDF4` | Social proof background |
| Light Amber | `#FEF3C7` | Free shipping badge |
| Light Pink | `#FEF2F2` | Countdown timer |

---

## 5. Typography Specifications

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Main Headline | Sora | 48-60px | 700 (Bold) | 1.1 |
| Subheadline | Inter | 18px | 400 | 1.6 |
| Price (Current) | Sora | 36-48px | 700 | 1.2 |
| Price (Original) | Inter | 24px | 400 | 1.2 |
| Badge Text | Inter | 12px | 600 | 1.4 |
| Body Text | Inter | 14-16px | 400 | 1.5 |
| Small Text | Inter | 12px | 500 | 1.4 |

---

## 6. Spacing System

| Spacing | Value | Usage |
|---------|-------|-------|
| Section Padding | 48-64px | Top/bottom of hero section |
| Card Padding | 24-32px | Inside product card |
| Element Gap | 16-24px | Between major elements |
| Small Gap | 8-12px | Between related items |
| Icon Gap | 8px | Between icon and text |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked layout |
| Tablet | 640-1024px | Two columns, reduced spacing |
| Desktop | > 1024px | Full two-column 60/40 split |

### Mobile Adaptations

1. **Grid**: Changes from `grid-cols-2` to `grid-cols-1`
2. **Headline**: Reduces from `text-6xl` to `text-4xl`
3. **Product Image**: Reduces height from 320px to 256px
4. **Trust Badges**: Stack vertically instead of horizontal row
5. **Padding**: Reduces from `p-8` to `p-6`

---

## 8. Animation & Interactions

| Element | Animation |
|---------|-----------|
| CTA Button Hover | `scale(1.02)`, `shadow-xl`, `300ms ease` |
| Urgency Icons | `animate-pulse` (CSS pulse animation) |
| Card Hover | Optional subtle lift effect |
| Page Load | Fade in from bottom (optional) |

---

## 9. Implementation Checklist

### Structure
- [ ] Two-column grid (60/40 split)
- [ ] Sky blue radial gradient background
- [ ] Left column: Badge, headline, description, trust badges
- [ ] Right column: Product card with all purchase elements

### Left Column
- [ ] Top badge with navy background
- [ ] Three-line headline "Feel Like / Yourself / Again"
- [ ] Descriptive subheadline
- [ ] Three horizontal trust badges with gold icons

### Right Column (Product Card)
- [ ] White card with gold-tinted border
- [ ] Beige gradient product image container
- [ ] Product bottle image with drop shadow
- [ ] Countdown timer with pink/peach styling
- [ ] Pricing with strikethrough and discount badge
- [ ] Pre-order special badge
- [ ] Free shipping badge
- [ ] Quantity selector
- [ ] Electric blue CTA button
- [ ] Trust footer text
- [ ] Green social proof section
- [ ] Urgency indicators (stock, viewers)
- [ ] Quality badges grid (2x2)

### Colors
- [ ] Deep Navy `#1E3A5F` for headlines
- [ ] Antique Gold `#C9A961` for icons
- [ ] Electric Blue `#2563EB` for CTA
- [ ] Alert Red `#DC2626` for discount badge
- [ ] All background colors as specified

### Typography
- [ ] Sora font for headlines and prices
- [ ] Inter font for body text
- [ ] Correct font sizes and weights

### Responsive
- [ ] Mobile layout (single column)
- [ ] Tablet layout (adjusted spacing)
- [ ] Desktop layout (full 60/40 split)

---

## 10. Code Reference

The current implementation can be found in:
- **Component**: `/client/src/components/BuyBox.tsx`
- **Page**: `/client/src/pages/Home.tsx`
- **Styles**: `/client/src/index.css`

---

**Document Status:** Complete  
**Author:** Manus AI  
**Last Updated:** January 21, 2026
