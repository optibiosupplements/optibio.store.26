# OptiBio Hero Section Specification - Alignment Analysis

**Date:** January 21, 2026  
**Purpose:** Compare updated Manus specification document against reference image to identify misalignments and ambiguities

---

## Executive Summary

After reviewing the updated specification document against your reference image, I've identified **5 misalignments** and **4 ambiguities** that need clarification before implementation.

---

## ✅ ALIGNED - Confirmed Correct

The following elements in the specification **match** the reference image:

| Element | Spec Value | Reference Image | Status |
|---------|------------|-----------------|--------|
| Grid Layout | 60/40 two-column | ✓ Matches | ✅ Aligned |
| Background | Sky blue radial gradient | ✓ Matches | ✅ Aligned |
| Top Badge | "SCIENCE-BACKED • THIRD-PARTY TESTED" navy pill | ✓ Matches | ✅ Aligned |
| Headline | "Feel Like / Yourself / Again" (3 lines) | ✓ Matches | ✅ Aligned |
| Headline Color | Deep Navy #1E3A5F | ✓ Matches | ✅ Aligned |
| Trust Badges | 3 gold icons (Shield, Award, Leaf) | ✓ Matches | ✅ Aligned |
| Product Card | White card, right column, product only | ✓ Matches | ✅ Aligned |
| CTA Button | Electric Blue #2563EB | ✓ Matches | ✅ Aligned |

---

## ❌ MISALIGNMENTS - Spec Does NOT Match Reference Image

### Misalignment #1: Pricing Math Inconsistency

**In the Spec (Page 6 & 17):**
> Current Price: $37.79  
> Original Price: $69.99  
> Discount Badge: "Save 46%"

**In the Reference Image:**
> Shows: $49.99 (current) with strikethrough price

**The Math Problem:**
- $69.99 × 46% off = $37.79 ✓ (This math is correct)
- But the CTA says "Save 25%" (Page 8)
- And the reference image shows $49.99, not $37.79

**CLARIFICATION NEEDED:**
| Option | Original | Discount | Final Price | CTA Text |
|--------|----------|----------|-------------|----------|
| A | $69.99 | 46% | $37.79 | "Save 46%" |
| B | $69.99 | 29% | $49.70 | "Save 29%" |
| C | $95.00 | 46% | $51.30 | "Save 46%" |

**Your Note Says:** "$69.99 original, 46% off = $37.79, then Pre-order additional 25% off"

**Question:** Is there a TWO-TIER discount system?
- Tier 1: Regular sale price $37.79 (46% off $69.99)
- Tier 2: Pre-order special additional 25% off the $37.79?

If yes, the final pre-order price would be: **$37.79 × 0.75 = $28.34**

---

### Misalignment #2: CTA Button Text Inconsistency

**In the Spec (Page 8):**
> Text: "Pre-Order Now - Save 25%"

**In the Spec (Page 17 - Your Notes):**
> Discount Badge: "Save 46%"

**In the Reference Image:**
> Shows a blue CTA button (text not fully legible)

**CLARIFICATION NEEDED:**
- [ ] **Option A:** "Pre-Order Now - Save 46%" (matches discount badge)
- [ ] **Option B:** "Pre-Order Now - Save 25%" (additional pre-order discount)
- [ ] **Option C:** "Pre-Order Now - $28.34" (show final price)

---

### Misalignment #3: Product Image Container Background

**In the Spec (Page 5):**
> Background: linear-gradient(should be white background)

**Note:** This is written as a comment/note, not an actual CSS value.

**In the Reference Image:**
> The product sits on what appears to be a **warm cream/ivory** background, not pure white

**CLARIFICATION NEEDED:**
- [ ] **Option A:** Pure white `#FFFFFF`
- [ ] **Option B:** Warm ivory gradient `#F7F4EF` → `#FFFFFF` (original spec)
- [ ] **Option C:** Soft cream `#FDFBF7`

---

### Misalignment #4: Quantity Selector Presence

**In the Spec (Page 17 - Your Notes):**
> Quantity Selector: ✅ Included

**In the Spec Body (Pages 1-16):**
> Section 3.7 (Quantity Selector) is **MISSING** - jumps from 3.6 to 3.8

**In the Reference Image:**
> No quantity selector visible in the hero section

**CLARIFICATION NEEDED:**
- [ ] **Option A:** Include quantity selector (+/- buttons)
- [ ] **Option B:** Omit quantity selector (single item purchase in hero)

---

### Misalignment #5: Customer Avatars

**In the Spec (Page 17 - Your Notes):**
> Customer Avatars: ✅ 4 avatars

**In the Spec Body (Pages 1-16):**
> No mention of customer avatars in the Social Proof section

**In the Reference Image:**
> No avatars visible in the reference image

**CLARIFICATION NEEDED:**
- [ ] **Option A:** Include 4 overlapping customer avatars in social proof
- [ ] **Option B:** Omit avatars (text-only social proof)

---

## ⚠️ AMBIGUITIES - Need Clarification

### Ambiguity #1: Yellow Guarantee Box

**In the Spec (Page 17 - Your Notes):**
> Yellow Guarantee Box: ✅ Yellow box

**In the Spec Body:**
> Section 3.6 describes "Free Shipping Badge" with Light Amber background `#FEF3C7`
> But there's no dedicated "Yellow Guarantee Box" component defined

**In the Reference Image:**
> Shows what appears to be a yellow/amber info box

**CLARIFICATION NEEDED:**
What should the Yellow Guarantee Box contain?
- [ ] **Option A:** Just the Free Shipping badge (already in spec)
- [ ] **Option B:** Combined box with: Pre-Order Special + Free Shipping + Ships Date
- [ ] **Option C:** Separate yellow box with guarantee/return policy info

---

### Ambiguity #2: Layout of Purchase Elements

**In the Spec (Page 4):**
> "The product card is a unified white card containing the product image ONLY. ALL purchase elements are on the left side on a separate card."

**In the Spec (Page 15 - Checklist):**
> Left column includes: "Countdown timer, Pricing, CTA, Social proof, Urgency indicators, Quality badges"

**Question:** Should the left column have TWO cards?
1. **Card 1:** Badge + Headline + Subhead + Trust Badges (no background)
2. **Card 2:** White card with Countdown + Pricing + CTA + Social Proof + Urgency + Quality Badges

Or is everything on the left in ONE unified card?

---

### Ambiguity #3: Shipping Date

**In the Spec (Page 7):**
> Shipping Text: "Ships Feb 14th, 2026"

**In the Reference Image:**
> Text not fully legible

**CLARIFICATION NEEDED:**
- [ ] **Option A:** "Ships Feb 14th, 2026" (Valentine's Day)
- [ ] **Option B:** "Ships Jan 20-27, 2026" (from earlier spec)
- [ ] **Option C:** Dynamic date (calculated from current date)

---

### Ambiguity #4: Urgency Indicator Numbers

**In the Spec (Page 11):**
> Stock Alert: "Only 43 left in stock"
> Viewers Alert: "18 people viewing this right now"

**Question:** Should these be:
- [ ] **Option A:** Static numbers (always 43 and 18)
- [ ] **Option B:** Dynamic/randomized within a range
- [ ] **Option C:** Connected to real inventory/analytics data

---

## Summary: Decisions Needed Before Implementation

### Critical Pricing Decision
| Question | Your Answer |
|----------|-------------|
| Original Price | $69.99 |
| Discount Percentage | 46% |
| Sale Price | $37.79 |
| Pre-Order Additional Discount | 25% off $37.79? |
| Final Pre-Order Price | $28.34? |
| CTA Button Text | "Save 46%" or "Save 25%"? |

### Layout Decisions
| Question | Your Answer |
|----------|-------------|
| Product image background | White or Ivory? |
| Include quantity selector? | Yes / No |
| Include customer avatars? | Yes / No |
| Yellow box contents? | What goes inside? |
| Left column card structure? | One card or two? |

### Content Decisions
| Question | Your Answer |
|----------|-------------|
| Shipping date | Feb 14th or Jan 20-27? |
| Urgency numbers | Static or dynamic? |

---

**Please provide your decisions for each item above, and I'll implement the hero section exactly as specified.**

---

**Document Status:** Awaiting User Decisions  
**Author:** Manus AI  
**Date:** January 21, 2026
