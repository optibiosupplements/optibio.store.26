# OptiBio Hero Section Specification Discrepancy Report
## Three-Way Comparison for Decision Making

**Date:** January 21, 2026  
**Purpose:** Identify all discrepancies between three specification documents so the user can select the correct value for each element before implementation.

---

## Document Sources

| Document | Source | Pages |
|----------|--------|-------|
| **Doc A** | Manus AI | 17 pages |
| **Doc B** | ChatGPT | 8 pages |
| **Doc C** | NotebookLLM | 8 pages |

---

## 1. Overall Layout Structure

### 1.1 Grid Split / Column Proportions

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Grid System** | 60% / 40% (Left wider) | 45% / 30% / 25% (3-column) | 50% / 50% (2-column equal) |
| **Column Definition** | Left: Content, Right: Product Card | Left: Text, Center: Product, Right: Offer | Left: Content + Price Card, Right: Product Image |

**YOUR CHOICE:**
- [ ] **Option A:** 60/40 two-column (Left content, Right product card with all purchase elements)
- [ ] **Option B:** 45/30/25 three-column (Text | Product | Offer card separate)
- [ ] **Option C:** 50/50 two-column (Content + Price card on left, Product image on right)

---

### 1.2 Container Max Width

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Max Width** | `max-w-7xl` (~1280px) | Not specified | 1440px |

**YOUR CHOICE:**
- [ ] **Option A:** 1280px (max-w-7xl)
- [ ] **Option C:** 1440px

---

### 1.3 Section Padding

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Desktop Padding** | `py-12 lg:py-16` (48-64px) | 96px top / 64px sides | 80px top/bottom, 20px sides |
| **Tablet Padding** | Not specified | 64px / 40px | Not specified |
| **Mobile Padding** | Not specified | 40px / 24px | Not specified |

**YOUR CHOICE:**
- [ ] **Option A:** 48-64px vertical padding
- [ ] **Option B:** 96px top / 64px sides (most spacious)
- [ ] **Option C:** 80px vertical / 20px horizontal

---

### 1.4 Background Gradient

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Gradient Type** | Radial (ellipse at top) | Radial | Linear (180deg) |
| **Start Color** | `#F8FCFE` (Pale Ice Blue) | `#F8FCFE` (Center) | `#D4E4F7` (Pale Sky Blue) |
| **End Color** | `#D6EAF8` (Soft Blue) | `#D6EAF8` (Edges) | `#E8F1FA` |

**YOUR CHOICE:**
- [ ] **Option A/B:** Radial gradient `#F8FCFE` → `#EBF5FB` → `#D6EAF8`
- [ ] **Option C:** Linear gradient 180deg `#D4E4F7` → `#E8F1FA`

---

## 2. Top Badge

### 2.1 Badge Text

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "SCIENCE-BACKED • THIRD-PARTY TESTED" | "Science-Backed • Third-Party Tested" | "Science-Backed • Third-Party Tested" |
| **Case** | UPPERCASE | Title Case | Title Case |
| **Icon** | None | None | Shield emoji (🛡️) before text |

**YOUR CHOICE:**
- [ ] **Option A:** UPPERCASE, no icon
- [ ] **Option B/C:** Title Case
- [ ] **Option C:** Include shield icon before text

---

### 2.2 Badge Background Color

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Background** | `#1E3A5F` (Deep Navy) | Deep Navy | `#2C4A6B` (Navy Dark) |

**YOUR CHOICE:**
- [ ] **Option A/B:** `#1E3A5F` (Deep Navy)
- [ ] **Option C:** `#2C4A6B` (Navy Dark - slightly lighter)

---

### 2.3 Badge Styling

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Font Size** | 12px (text-xs) | 13px | 14px |
| **Padding** | `px-4 py-1.5` | 8px 14px | 10px 20px |
| **Border Radius** | `rounded-full` (999px) | 999px | 24px |
| **Shadow** | None | 0 4px 12px rgba(0,0,0,0.08) | None |

**YOUR CHOICE:**
- [ ] **Option A:** 12px font, px-4 py-1.5 padding, no shadow
- [ ] **Option B:** 13px font, 8px 14px padding, subtle shadow
- [ ] **Option C:** 14px font, 10px 20px padding, no shadow

---

## 3. Main Headline

### 3.1 Headline Text & Line Breaks

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Line 1** | "Feel Like" | "Feel Like" | "Feel Like" |
| **Line 2** | "Yourself" | "Yourself Again" (2 lines total) | "Yourself Again" (2 lines total) |
| **Line 3** | "Again" | — | — |

**YOUR CHOICE:**
- [ ] **Option A:** 3 lines: "Feel Like" / "Yourself" / "Again"
- [ ] **Option B/C:** 2 lines: "Feel Like" / "Yourself Again"

---

### 3.2 Headline Font Size

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Desktop** | 48-60px (text-4xl to text-6xl) | 52-56px | 64px |
| **Mobile** | text-4xl (36px) | Not specified | Not specified |

**YOUR CHOICE:**
- [ ] **Option A:** 48-60px responsive
- [ ] **Option B:** 52-56px
- [ ] **Option C:** 64px (largest)

---

### 3.3 Headline Color

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Color** | `#1E3A5F` (Deep Navy) | `#1E3A5F` | `#1A2F4D` (Navy Darker) |

**YOUR CHOICE:**
- [ ] **Option A/B:** `#1E3A5F` (Deep Navy)
- [ ] **Option C:** `#1A2F4D` (Navy Darker - slightly darker)

---

## 4. Subheadline / Description

### 4.1 Subheadline Text

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "Our clinically-proven Ashwagandha KSM-66 helps you manage stress, improve sleep quality, and reclaim your natural energy." | "Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life." | Same as ChatGPT + "Wake up calm. Work with focus. Sleep deeply." |
| **Additional Line** | None | "Wake up calm. Work with focus. Sleep deeply." (separate) | Included in same paragraph |

**YOUR CHOICE:**
- [ ] **Option A:** Longer description mentioning KSM-66 specifically
- [ ] **Option B:** Shorter, punchier copy with separate outcome line
- [ ] **Option C:** Combined paragraph with outcome line included

---

### 4.2 Subheadline Color

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Color** | `#2D2D2D` (Charcoal) | `#4B5563` (Cool Grey) | `#4B5563` (Navy Darker for subcopy) |

**YOUR CHOICE:**
- [ ] **Option A:** `#2D2D2D` (Charcoal - darker)
- [ ] **Option B/C:** `#4B5563` (Cool Grey - lighter)

---

## 5. Trust Indicator Badges

### 5.1 Number of Badges

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Count** | 3 badges | 3 badges | 3 badges |
| **Badges** | Third-Party Tested, GMP Certified, Non-GMO & Organic | Same | Same |

**All documents agree on 3 badges with same content.**

---

### 5.2 Badge Icon Style

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Icon Type** | Lucide icons (Shield, Award, Leaf) | Not specified | Emoji icons (🛡️, 🎖️, 🍂) |
| **Icon Color** | `#C9A961` (Antique Gold) | `#C9A961` (Antique Gold) | `#C9A961` (Gold Primary) |
| **Icon Size** | w-6 h-6 (24px) | Not specified | 24px |

**YOUR CHOICE:**
- [ ] **Option A:** Lucide React icons (Shield, Award, Leaf)
- [ ] **Option C:** Emoji icons (🛡️, 🎖️, 🍂)

---

### 5.3 Badge Text Structure

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Structure** | Single line text only | Single line with label | Two lines: Title + Subtitle |
| **Example** | "Third-Party Tested" | "Third-Party Tested" | "Third-Party Tested" + "for purity" |

**YOUR CHOICE:**
- [ ] **Option A/B:** Single line text only
- [ ] **Option C:** Two-line format with subtitle (e.g., "for purity", "facility", "ingredients")

---

## 6. Product Card Container

### 6.1 Card Position

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Position** | Right column (contains ALL purchase elements) | Center column (product only) | Right column (product image only) |
| **Contains** | Image + Timer + Pricing + CTA + Social Proof | Product image only | Product image only |

**YOUR CHOICE:**
- [ ] **Option A:** Single unified card with ALL elements (image, pricing, CTA, etc.)
- [ ] **Option B/C:** Product image separate from pricing/CTA card

---

### 6.2 Card Background

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Card BG** | `#FFFFFF` (Pure White) | `#FFFFFF` | `#FFFFFF` |
| **Image Container BG** | Gradient `#F7F4EF` → `#FFFFFF` | `#F7F4EF` (Warm Ivory) | Not specified |

**All documents agree: White card, Warm Ivory image container.**

---

### 6.3 Card Border & Shadow

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Border** | 2px solid rgba(201, 169, 97, 0.2) (Gold tint) | Not specified | None specified |
| **Border Radius** | 24px (rounded-3xl) | 20px | 24px |
| **Shadow** | shadow-2xl | Soft elevation | 0 8px 32px rgba(30, 58, 95, 0.12) |

**YOUR CHOICE:**
- [ ] **Option A:** 24px radius, gold-tinted border, shadow-2xl
- [ ] **Option B:** 20px radius, soft elevation
- [ ] **Option C:** 24px radius, specific shadow value

---

## 7. Countdown Timer

### 7.1 Timer Background

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Background** | Gradient `#FEF2F2` → `#FFF7ED` (Pink to Peach) | `#FDECEC` (Light Red) | Gradient `#FEF2F2` → `#FEE2E2` (Red Tint) |
| **Border** | 2px solid `#FECACA` | 1px solid `#F5B5B5` | 1px solid `#FECACA` |

**YOUR CHOICE:**
- [ ] **Option A:** Pink-to-peach gradient with 2px border
- [ ] **Option B:** Solid light red background
- [ ] **Option C:** Red tint gradient with 1px border

---

### 7.2 Timer Label Text

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "Pre-orders close in:" | Not specified | "SALE ENDS IN:" |
| **Color** | `#DC2626` (Alert Red) | `#7F1D1D` | `#7C2D12` (Timer Text) |

**YOUR CHOICE:**
- [ ] **Option A:** "Pre-orders close in:" in Alert Red `#DC2626`
- [ ] **Option C:** "SALE ENDS IN:" in Deep Brown `#7C2D12`

---

### 7.3 Timer Number Color

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Color** | `#7C2D12` (Deep Brown) | Not specified | `#7C2D12` (Timer Text) |

**All documents that specify agree: `#7C2D12`**

---

## 8. Pricing Section

### 8.1 Current Price

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Price** | $49.99 | $49.99 | $49.99 |
| **Font Size** | 36-48px (text-4xl to text-5xl) | 36px | 48px |
| **Color** | `#1E3A5F` (Deep Navy) | Black | `#1A2F4D` (Navy Darker) |

**YOUR CHOICE:**
- [ ] **Option A:** 36-48px, Deep Navy `#1E3A5F`
- [ ] **Option B:** 36px, Black
- [ ] **Option C:** 48px, Navy Darker `#1A2F4D`

---

### 8.2 Original Price (Strikethrough)

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Price** | $69.99 | $69.99 | $95.00 |
| **Font Size** | 24px (text-2xl) | Not specified | 20px |

**YOUR CHOICE:**
- [ ] **Option A/B:** $69.99 (29% discount)
- [ ] **Option C:** $95.00 (46% discount)

---

### 8.3 Discount Badge

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "Save 29%" | "Save 46%" | "Save 46%" |
| **Background** | `#DC2626` (Alert Red) | Red pill | `#DC2626` |
| **Padding** | px-4 py-1.5 | Not specified | 4px 8px |

**YOUR CHOICE:**
- [ ] **Option A:** "Save 29%" (based on $69.99 original)
- [ ] **Option B/C:** "Save 46%" (based on $95.00 original)

---

## 9. Pre-Order / Guarantee Box

### 9.1 Box Presence & Style

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Style** | Inline text badges (no box) | Not a separate box | **Yellow Box** with border |
| **Background** | `#FEF3C7` (Light Amber) for shipping badge only | Not specified | `#FFFBEB` (Pale Yellow) |
| **Border** | 1px solid `#FDE68A` | Not specified | 1px solid `#FDE68A` |

**YOUR CHOICE:**
- [ ] **Option A:** Separate inline badges (Pre-Order Special + Free Shipping as separate elements)
- [ ] **Option C:** Combined yellow box containing both Pre-Order info and Free Shipping

---

### 9.2 Shipping Threshold

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Threshold** | $75+ | $75+ | $75+ |

**All documents agree: Free shipping on $75+**

---

## 10. Primary CTA Button

### 10.1 Button Text

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "Pre-Order Now - Save 29%" | "Pre-Order Now – Save 46%" | "Pre-Order Now - Save 46%" |
| **Arrow Icon** | ArrowRight (Lucide) | Not specified | Arrow (→) |

**YOUR CHOICE:**
- [ ] **Option A:** "Pre-Order Now - Save 29%"
- [ ] **Option B/C:** "Pre-Order Now - Save 46%"

---

### 10.2 Button Styling

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Background** | `#2563EB` (Electric Blue) | `#2563EB` (Royal Blue) | `#2563EB` (Blue CTA) |
| **Hover** | `#1D4ED8` | Slightly darker blue | `#1D4ED8` + translateY(-2px) |
| **Height** | py-7 (56px) | 56px | 18px padding (approx 54px) |
| **Border Radius** | Default (8px) | 14px | 12px |
| **Shadow** | shadow-lg → shadow-xl | Not specified | 0 4px 16px rgba(37, 99, 235, 0.3) |

**YOUR CHOICE:**
- [ ] **Option A:** py-7 padding, default radius, shadow-lg
- [ ] **Option B:** 56px height, 14px radius
- [ ] **Option C:** 18px padding, 12px radius, specific shadow

---

### 10.3 Button Hover Effect

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Transform** | scale(1.02) | Slight inset | translateY(-2px) |
| **Transition** | 300ms all | Not specified | 0.2s |

**YOUR CHOICE:**
- [ ] **Option A:** Scale up on hover (scale 1.02)
- [ ] **Option B:** Inset effect
- [ ] **Option C:** Lift up on hover (translateY -2px)

---

## 11. Trust Footer (Below CTA)

### 11.1 Trust Items

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Items** | Secure checkout, Free shipping $75+, 90-day guarantee | Secure checkout, Free shipping $75+, 30-day guarantee | Secure checkout, 90-day guarantee |
| **Guarantee Period** | 90-day | 30-day | 90-day |

**YOUR CHOICE:**
- [ ] **Option A/C:** 90-day guarantee
- [ ] **Option B:** 30-day guarantee

---

### 11.2 Trust Icons

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Lock Icon** | 🔒 emoji | Green lock only | Green checkmark (✔) |

**YOUR CHOICE:**
- [ ] **Option A:** Lock emoji (🔒)
- [ ] **Option B:** Green lock icon
- [ ] **Option C:** Green checkmarks (✔)

---

## 12. Social Proof Section

### 12.1 Star Rating

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Rating** | 4.9/5 | 4.9/5 | 4.9/5 |
| **Star Color** | `#C9A961` (Antique Gold) | Gold | `#FBBF24` (Bright Gold) |

**YOUR CHOICE:**
- [ ] **Option A:** Antique Gold `#C9A961` (muted, luxurious)
- [ ] **Option C:** Bright Gold `#FBBF24` (vibrant, attention-grabbing)

---

### 12.2 Customer Count

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Count** | 5,247 happy customers | 1,247 happy customers | 12,000+ reviews |
| **Format** | "X happy customers" | "X happy customers" | "Based on X reviews" |

**YOUR CHOICE:**
- [ ] **Option A:** "5,247 happy customers"
- [ ] **Option B:** "1,247 happy customers"
- [ ] **Option C:** "Based on 12,000+ reviews"

---

### 12.3 Recent Sales

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Text** | "127 bottles sold in last 24 hours" | "127 bottles sold in last 24 hours" | Not specified |

**YOUR CHOICE:**
- [ ] **Option A/B:** Include "127 bottles sold in last 24 hours"
- [ ] **Option C:** Omit recent sales line

---

### 12.4 Social Proof Background

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Background** | `#F0FDF4` (Mint Green) | `#ECFDF5` | Gradient `#F0FDF4` → `#DCFCE7` |
| **Border** | 2px solid `#BBF7D0` | Not specified | 1px solid `#BBF7D0` |

**YOUR CHOICE:**
- [ ] **Option A:** Solid mint green with 2px border
- [ ] **Option B:** Slightly different mint shade
- [ ] **Option C:** Gradient mint green with 1px border

---

### 12.5 Avatar Display

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Avatars** | Not included | Not specified | 4 overlapping avatars |

**YOUR CHOICE:**
- [ ] **Option A/B:** No avatars
- [ ] **Option C:** Include 4 overlapping customer avatars

---

## 13. Urgency Indicators

### 13.1 Stock Alert

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Included** | Yes | No | No |
| **Text** | "Only 43 left in stock" | — | — |
| **Background** | `#FFF7ED` (Light Orange) | — | — |

**YOUR CHOICE:**
- [ ] **Option A:** Include stock urgency indicator
- [ ] **Option B/C:** Omit stock indicator

---

### 13.2 Viewers Alert

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Included** | Yes | No | No |
| **Text** | "18 people viewing this right now" | — | — |
| **Background** | `#EFF6FF` (Light Blue) | — | — |

**YOUR CHOICE:**
- [ ] **Option A:** Include viewers indicator
- [ ] **Option B/C:** Omit viewers indicator

---

## 14. Quality Badges Grid (Bottom)

### 14.1 Grid Presence

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Included** | Yes (2x2 grid at bottom of card) | No | No |
| **Badges** | Third-Party Tested, GMP Certified, Non-GMO Organic, 20+ Studies Proven | — | — |

**YOUR CHOICE:**
- [ ] **Option A:** Include 2x2 quality badges grid at bottom of card
- [ ] **Option B/C:** Omit bottom badges grid (trust badges only at top)

---

## 15. Quantity Selector

### 15.1 Quantity Selector Presence

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Included** | Yes | No | No |
| **Style** | +/- buttons with number display | — | — |

**YOUR CHOICE:**
- [ ] **Option A:** Include quantity selector with +/- buttons
- [ ] **Option B/C:** Omit quantity selector (single item purchase)

---

## 16. Typography

### 16.1 Font Families

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Headings** | Sora | Inter / System | Sora |
| **Body** | Inter | Not specified | Inter |

**YOUR CHOICE:**
- [ ] **Option A/C:** Sora for headings, Inter for body
- [ ] **Option B:** Inter / System for all text

---

## 17. Behavioral Rules

### 17.1 Countdown Timer

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Real vs Fake** | Not specified | Must be REAL, not fake | Not specified |

**YOUR CHOICE:**
- [ ] **Option B:** Countdown must be real (connected to actual deadline)
- [ ] **Other:** Static/decorative countdown

---

### 17.2 Page Load Performance

| Specification | Doc A (Manus) | Doc B (ChatGPT) | Doc C (NotebookLLM) |
|---------------|---------------|-----------------|---------------------|
| **Target** | Not specified | < 1 second | Not specified |

**YOUR CHOICE:**
- [ ] **Option B:** Optimize for < 1 second load time
- [ ] **Other:** Standard optimization

---

## Summary: Key Decisions Required

### Critical Layout Decision
1. **Grid Structure:** 60/40 two-column (A) vs 45/30/25 three-column (B) vs 50/50 two-column (C)

### Critical Pricing Decision
2. **Original Price:** $69.99 (A/B) vs $95.00 (C)
3. **Discount Percentage:** 29% (A) vs 46% (B/C)

### Critical Visual Decisions
4. **Headline Lines:** 3 lines (A) vs 2 lines (B/C)
5. **Star Color:** Antique Gold #C9A961 (A) vs Bright Gold #FBBF24 (C)
6. **Customer Count:** 5,247 (A) vs 1,247 (B) vs 12,000+ (C)
7. **Guarantee Period:** 90-day (A/C) vs 30-day (B)

### Optional Elements Decision
8. **Urgency Indicators:** Include stock/viewers (A) vs Omit (B/C)
9. **Quality Badges Grid:** Include 2x2 grid (A) vs Omit (B/C)
10. **Quantity Selector:** Include (A) vs Omit (B/C)
11. **Customer Avatars:** Omit (A/B) vs Include (C)

---

**Document Status:** Complete  
**Author:** Manus AI  
**Date:** January 21, 2026

---

## Instructions

Please review each discrepancy above and mark your choice by checking the appropriate option. Once all decisions are made, I will implement the hero section with your exact specifications.
