# OptiBio Hero Section - FINAL LOCKED SPECIFICATION
## Ready for Implementation

**Version:** 2.0 (LOCKED)  
**Date:** January 21, 2026  
**Status:** ✅ ALL DECISIONS CONFIRMED

---

## 1. Layout Structure

### Grid Configuration
| Property | Value |
|----------|-------|
| **Grid Split** | 60% / 40% |
| **Left Column** | Floating text + Separate white "Offer Card" |
| **Right Column** | Product image card (vertically centered) |
| **Container Max Width** | `max-w-7xl` (~1280px) |
| **Background** | Radial gradient: `#F8FCFE` → `#EBF5FB` → `#D6EAF8` |

### Complete "Twin-Card" Layout Diagram

This design consists of a **Left Column Stack** (Text + Offer Card + Social Card) and a **Right Column** (Product Card). The Product Card is **vertically centered** against the left column content.

```text
       GLOBAL PAGE BACKGROUND: Light Blue Gradient (#F8FCFE → #EBF5FB → #D6EAF8)
_________________________________________________________________________________
|                                                                               |
|  [ LEFT COLUMN ] (60% - Flex Stack)       [ RIGHT COLUMN ] (40% - Flex Center)|
|  Vertical Align: Top                      Vertical Align: Center              |
|________________________________________   ____________________________________|
|                                        | |                                    |
|  1. [NAVY PILL BADGE]                  | |                                    |
|     (Dark Navy Bg #1E3A5F, White Text) | |                                    |
|     "SCIENCE-BACKED • THIRD-PARTY..." | |                                    |
|                                        | |                                    |
|  2. [HEADLINE H1]                      | |  ┌──────────────────────────────┐  |
|     "Feel Like"                        | |  │  [PRODUCT CARD]              │  |
|     "Yourself"                         | |  │  (White Background #FFFFFF)  │  |
|     "Again"                            | |  │  (Rounded Corners: 24px)     │  |
|     (Deep Navy: #1E3A5F)               | |  │  (Drop Shadow: shadow-2xl)   │  |
|                                        | |  │  (Gold-tinted border)        │  |
|  3. [SUBHEAD PARAGRAPH]                | |  │                              │  |
|     "Our clinically-proven..."         | |  │     ┌──────────────────┐    │  |
|     (Charcoal: #2D2D2D)                | |  │     │                  │    │  |
|                                        | |  │     │                  │    │  |
|  4. [ICON ROW - Trust Badges]          | |  │     │    [PRODUCT]     │    │  |
|     (Gold Icons #C9A961)               | |  │     │     BOTTLE       │    │  |
|     🛡️ Third-Party | 🏆 GMP | 🌿 Organic| |  │     │   (Black/Gold)   │    │  |
|                                        | |  │     │                  │    │  |
|  5. [OFFER CARD] (White Container)     | |  │     │                  │    │  |
|     (Bg: White, Radius: 20px)          | |  │     └──────────────────┘    │  |
|     (Shadow: Soft)                     | |  │                              │  |
|     ┌──────────────────────────────┐ | |  └──────────────────────────────┘  |
|     │ [TIMER STRIP]                  │ | |                                    |
|     │ Bg: Light Pink (#FEF2F2)       │ | |                                    |
|     │ Border: Red (#FECACA)          │ | |                                    |
|     │ "Pre-orders close in: 00:00"   │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ [PRICE ROW]                    │ | |                                    |
|     │ $37.79  ~~$69.99~~  [SAVE 46%] │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ [YELLOW INFO BOX]              │ | |                                    |
|     │ Bg: Pale Yellow (#FFFBEB)      │ | |                                    |
|     │ Border: Gold (#FDE68A)         │ | |                                    |
|     │ ✨ Pre-Order Special            │ | |                                    |
|     │ 📦 Ships Feb 14th, 2026        │ | |                                    |
|     │ 🚚 Free Shipping $75+          │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ + Extra 25% Off at Checkout    │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ [CTA BUTTON]                   │ | |                                    |
|     │ Color: Blue (#2563EB)          │ | |                                    |
|     │ "Pre-Order Now - Save 25%" →   │ | |                                    |
|     │ Width: 100% Fill               │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ [TRUST FOOTER]                 │ | |                                    |
|     │ 🔒 Secure • 90-day Guarantee    │ | |                                    |
|     ├──────────────────────────────┤ | |                                    |
|     │ [STOCK URGENCY]                │ | |                                    |
|     │ 🔥 Only [40-50] left in stock   │ | |                                    |
|     └──────────────────────────────┘ | |                                    |
|                                        | |                                    |
|     ~ gap (blue bg visible) ~          | |                                    |
|                                        | |                                    |
|  6. [SOCIAL PROOF CARD] (FLOATING)     | |                                    |
|     (Bg: Mint Green #F0FDF4)           | |                                    |
|     (Border: #BBF7D0)                  | |                                    |
|     (Radius: 16px)                     | |                                    |
|     ┌──────────────────────────────┐ | |                                    |
|     │ 👤👤👤👤  ★★★★★ 4.9/5        │ | |                                    |
|     │ 5,247 happy customers          │ | |                                    |
|     └──────────────────────────────┘ | |                                    |
|________________________________________|____________________________________|_
```

### Critical Details for Implementation

1. **The "Twin-Card" Structure:**
   - **Left Column:** Text content floats on blue background, then White Offer Card, then Mint Social Card (separate)
   - **Right Column:** Product image is **INSIDE a White Card** (not floating on blue). Creates balanced "Card vs. Card" look.

2. **Product Card Vertical Centering:**
   - The Product Card starts around the **Subheadline** level
   - The Product Card ends around the **CTA Button** level
   - Use `items-center` on the right column flex container

3. **Social Proof Separation:**
   - Element 6 (Mint Green Card) is **completely outside** Element 5 (White Offer Card)
   - There is a visible gap of blue background between them (`mt-4` spacing)

4. **Visual Hierarchy in Offer Card (Element 5):**
   - **Timer** is at the very top (Light Pink background)
   - **Price** is second
   - **Yellow Box** (Pre-order info) is third
   - **Bonus Text** ("+ Extra 25%...") is fourth
   - **Blue CTA Button** is fifth
   - **Trust Footer** is sixth
   - **Stock Urgency** is seventh (bottom)

---

## 2. Pricing System (TIERED - SME RECOMMENDED)

### Visible Pricing Display
| Element | Value | Styling |
|---------|-------|---------|
| **Current Price** | $37.79 | `text-4xl font-bold text-[#1E3A5F]` |
| **Original Price** | $69.99 | `text-2xl text-muted-foreground line-through` |
| **Discount Badge** | "SAVE 46%" | Red badge `#DC2626` |

### Gamified Incentive Layer
| Element | Value | Position |
|---------|-------|----------|
| **Bonus Text** | "Plus Extra 25% Off at Checkout" | Near CTA button |
| **Coupon Code** | `PREORDER25` | Auto-applied on click |
| **Final Checkout Price** | ~$28.34 | Revealed after intent |

### CTA Button
| Property | Value |
|----------|-------|
| **Text** | "Pre-Order Now - Save Extra 25%" |
| **Background** | `#2563EB` (Electric Blue) |
| **Hover** | `#1D4ED8` |
| **Icon** | ArrowRight (Lucide) |
| **Behavior** | Auto-applies `PREORDER25` coupon |

---

## 3. Countdown Timer

### Placement
- **Location:** Inside the white Offer Card
- **Position:** Above the price (first element in card)
- **Style:** Urgency alert (not banner)

### Styling
| Property | Value |
|----------|-------|
| **Background** | Gradient `#FEF2F2` → `#FFF7ED` |
| **Border** | 2px solid `#FECACA` |
| **Border Radius** | `rounded-xl` (12px) |
| **Label Text** | "Pre-orders close in:" |
| **Label Color** | `#DC2626` (Alert Red) |
| **Numbers Color** | `#7C2D12` (Deep Brown) |
| **Format** | DD : HH : MM : SS |

---

## 4. Yellow Guarantee Box (COMBO)

### Contents
| Element | Value |
|---------|-------|
| **Header** | "Pre-Order Special:" with Sparkles icon |
| **Ship Date** | "Ships Feb 14th, 2026" |
| **Shipping** | "Free shipping on orders $75+" |

### Styling
| Property | Value |
|----------|-------|
| **Background** | `#FFFBEB` (Pale Yellow) |
| **Border** | 1px solid `#FDE68A` |
| **Border Radius** | `rounded-lg` |
| **Icon Color** | `#C9A961` (Antique Gold) |

---

## 5. Trust Footer (Below CTA)

### Items (NO shipping repetition)
1. 🔒 Secure checkout
2. • (separator)
3. 90-day guarantee

### Styling
| Property | Value |
|----------|-------|
| **Font Size** | `text-xs` |
| **Color** | `text-muted-foreground` |
| **Border Top** | `border-t border-[#C9A961]/20` |

---

## 6. Social Proof Section

**IMPORTANT:** This section floats OUTSIDE the white Offer Card as a separate element.

### Position
| Property | Value |
|----------|-------|
| **Location** | Below the white Offer Card (NOT inside it) |
| **Container** | Independent floating card |
| **Spacing** | `mt-4` gap from Offer Card above |

### Customer Avatars
| Property | Value |
|----------|-------|
| **Include** | ✅ Yes |
| **Count** | 4 overlapping faces |
| **Position** | Left side of social proof card |

### Content
| Element | Value |
|---------|-------|
| **Stars** | 5 filled stars (Antique Gold `#C9A961`) |
| **Rating** | "4.9/5" |
| **Customer Count** | "5,247 happy customers" |

### Styling
| Property | Value |
|----------|-------|
| **Background** | `#F0FDF4` (Mint Green) |
| **Border** | 2px solid `#BBF7D0` |
| **Border Radius** | `rounded-xl` |

---

## 7. Urgency Indicator

### Configuration
| Property | Value |
|----------|-------|
| **Type** | Stock-based ONLY (no viewers) |
| **Text** | "Only [X] left in stock" |
| **Dynamic Range** | Randomizes 40-50 on reload |
| **Icon** | 🔥 (animated pulse) |

### Styling
| Property | Value |
|----------|-------|
| **Background** | `#FFF7ED` (Light Orange) |
| **Border** | 1px solid `#FED7AA` |
| **Text Color** | `#C2410C` (Orange) |
| **Font Size** | `text-xs font-semibold` |

---

## 8. Trust Badges Density

### Hero Section (Top)
- **Location:** Below subheadline, above Offer Card
- **Count:** 3 badges (horizontal row)
- **Badges:** Third-Party Tested, GMP Certified, Non-GMO & Organic
- **Icon Color:** `#C9A961` (Antique Gold)

### Below Fold (Science Section)
- **Location:** Science/Research section
- **Count:** 4 badges (2×2 grid)
- **Badges:** Third-Party Tested, GMP Certified, Non-GMO Organic, 20+ Studies Proven

---

## 9. Product Image Container

### Configuration
| Property | Value |
|----------|-------|
| **Background** | Pure White `#FFFFFF` |
| **Border** | 2px solid `rgba(201, 169, 97, 0.2)` |
| **Border Radius** | `rounded-3xl` (24px) |
| **Shadow** | `shadow-2xl` |
| **Alignment** | Vertically centered to left column |

### Product Image
| Property | Value |
|----------|-------|
| **Source** | `/product-card-hero-transparent-optimized.png` |
| **Object Fit** | `object-contain` |
| **Drop Shadow** | `drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))` |

---

## 10. Elements NOT in Hero

| Element | Location |
|---------|----------|
| Quantity Selector | ❌ Omitted (single bottle focus) |
| Quality Badges Grid (2×2) | Below fold (Science section) |
| Viewers Indicator | ❌ Omitted |

---

## 11. Complete Color Reference

### Primary Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Deep Navy | `#1E3A5F` | Headlines, primary text |
| Antique Gold | `#C9A961` | Icons, accents, borders |
| Pure White | `#FFFFFF` | Card backgrounds |
| Charcoal | `#2D2D2D` | Body text |

### Conversion Colors
| Name | Hex | Usage |
|------|-----|-------|
| Electric Blue | `#2563EB` | CTA button |
| Alert Red | `#DC2626` | Discount badge, timer label |
| Timer Brown | `#7C2D12` | Countdown numbers |

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Pale Yellow | `#FFFBEB` | Yellow guarantee box |
| Mint Green | `#F0FDF4` | Social proof |
| Light Orange | `#FFF7ED` | Stock urgency |
| Light Pink | `#FEF2F2` | Countdown timer |

---

## 12. Implementation Checklist

### Left Column (Floating)
- [ ] Navy pill badge "SCIENCE-BACKED • THIRD-PARTY TESTED"
- [ ] 3-line headline "Feel Like / Yourself / Again"
- [ ] Subheadline with KSM-66® mention
- [ ] 3 horizontal trust badges (gold icons)

### Left Column (White Offer Card)
- [ ] Countdown timer (urgency alert style, above price)
- [ ] Pricing: $37.79 / ~~$69.99~~ / SAVE 46%
- [ ] Yellow combo box (Pre-Order Special + Ship Date + Free Shipping)
- [ ] "Plus Extra 25% Off at Checkout" text
- [ ] CTA: "Pre-Order Now - Save Extra 25%"
- [ ] Trust footer: Secure checkout • 90-day guarantee
- [ ] Stock urgency (dynamic 40-50)

### Left Column (Floating Below Offer Card)
- [ ] Social proof card (OUTSIDE offer card, floating independently)
- [ ] 4 overlapping avatars + stars + 5,247 customer count
- [ ] Mint green background with green border

### Right Column
- [ ] Pure white product card
- [ ] Product bottle image with drop shadow
- [ ] Vertically centered alignment

### System Behavior
- [ ] CTA auto-applies `PREORDER25` coupon
- [ ] Stock number randomizes 40-50 on reload
- [ ] Countdown timer is functional (not static)

---

**SPECIFICATION STATUS: LOCKED**  
**Ready for Implementation**

---

**Author:** Manus AI  
**Date:** January 21, 2026
