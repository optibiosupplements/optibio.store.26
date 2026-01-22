# Hero Section V2 Discrepancy Report

**Date:** January 21, 2026  
**Author:** Manus AI  
**Purpose:** Document all differences between current implementation (v2.png) and approved design

---

## Executive Summary

The current implementation has **13 critical discrepancies** that deviate from the approved design. The most severe issues involve structural layout problems, incorrect pricing, duplicate elements, and missing container styling.

---

## Discrepancy Analysis

### 🚨 CRITICAL STRUCTURAL ERRORS

| # | Element | Approved Design | Current Implementation (v2) | Action Required |
|---|---------|-----------------|----------------------------|-----------------|
| 1 | **White Offer Card** | Timer, Price, Yellow Box, CTA grouped in a single WHITE card with rounded corners and shadow | Elements floating on blue background with NO white container | **CREATE** white card wrapper with `bg-white`, `rounded-3xl`, `shadow-xl` |
| 2 | **Timer Placement** | Inside the White Offer Card as a pink strip at the top | Floating separately with outline box styling | **MOVE** timer inside white card, **RESTYLE** as solid pink strip |
| 3 | **Social Proof Location** | Floating OUTSIDE the white card, below it with visible blue gap | Inside the same floating stack, no separation | **MOVE** outside white card with `mt-4` gap |

---

### ❌ PRICING & DISCOUNT ERRORS

| # | Element | Approved Design | Current Implementation (v2) | Action Required |
|---|---------|-----------------|----------------------------|-----------------|
| 4 | **Original Price** | **$95.00** (strikethrough) | $89.00 | **CHANGE** to $95.00 |
| 5 | **Discount Badge** | **SAVE 46%** | SAVE 29% | **UPDATE** to 46% |
| 6 | **CTA Button Text** | "Pre-Order Now - Save Extra 25%" | "Pre-Order Now • Save 29%" | **UPDATE** button text |

---

### ⚠️ TIMER STYLING ERRORS

| # | Element | Approved Design | Current Implementation (v2) | Action Required |
|---|---------|-----------------|----------------------------|-----------------|
| 7 | **Timer Background** | Solid pink strip (`#FEF2F2`) | Orange/peach gradient with border | **CHANGE** to solid pink |
| 8 | **Timer Label** | Single label: "Sale Ends In:" | DUPLICATE: "Pre-orders close in:" appears TWICE (above and inside box) | **DELETE** duplicate label |
| 9 | **Timer Container** | No border, integrated into card | Outlined box with separate styling | **REMOVE** border, integrate into card |

---

### 🔄 DUPLICATE/REDUNDANT ELEMENTS

| # | Element | Approved Design | Current Implementation (v2) | Action Required |
|---|---------|-----------------|----------------------------|-----------------|
| 10 | **Bottom Icon Row** | NOT present in hero | 5 gold icons at bottom (Third-Party, GMP, Non-GMO, Clinically, 90-Day) | **DELETE** entire row - already shown in trust badges above |
| 11 | **Trust Badges** | 3 badges with "Verified" text under each | 3 badges without "Verified" subtext | **ADD** "Verified" text under each badge |

---

### 📊 SOCIAL PROOF DATA ERRORS

| # | Element | Approved Design | Current Implementation (v2) | Action Required |
|---|---------|-----------------|----------------------------|-----------------|
| 12 | **Customer Count** | "12,000+ Happy Customers" | "1,247 happy customers" + "83,423 bottles sold" | **CHANGE** to "12,000+ Happy Customers", **REMOVE** bottles sold |
| 13 | **Rating Display** | "4.9/5" | "4.63" | **UPDATE** to 4.9/5 |

---

## Visual Comparison Summary

```
APPROVED DESIGN                          CURRENT V2 (WRONG)
─────────────────                        ──────────────────

[Navy Badge]                             [Navy Badge] ✅
                                         
Feel Like                                Feel Like ✅
Yourself                                 Yourself
Again                                    Again

[Subheadline]                            [Subheadline] ✅

[Trust Badges with "Verified"]           [Trust Badges - NO "Verified"] ❌

┌─────────────────────────┐              [Timer - FLOATING] ❌
│ PINK TIMER STRIP        │              [Price - FLOATING] ❌
│ $49.99  $95.00  46%     │              [Yellow Box - FLOATING] ❌
│ [Yellow Info Box]       │              [CTA - FLOATING] ❌
│ [CTA BUTTON]            │              
│ [Trust Footer]          │              NO WHITE CARD WRAPPER ❌
└─────────────────────────┘              

~ blue gap ~                             [Social Proof - NO GAP] ❌

┌─────────────────────────┐              [5 Icon Row - SHOULD NOT EXIST] ❌
│ GREEN SOCIAL PROOF      │              
│ 4.9/5 • 12,000+         │              
└─────────────────────────┘              
```

---

## Action Plan (Priority Order)

### Phase 1: Structural Fix (CRITICAL)
1. Create white card wrapper around Timer, Price, Yellow Box, CTA, Trust Footer
2. Move Social Proof card outside the white card with visible gap
3. Delete the bottom 5-icon row entirely

### Phase 2: Timer Fix
4. Restyle timer as solid pink strip at top of white card
5. Remove duplicate "Pre-orders close in:" label
6. Remove timer border/outline styling

### Phase 3: Pricing Fix
7. Change original price from $89.00 to $95.00
8. Update discount badge from 29% to 46%
9. Update CTA button text

### Phase 4: Social Proof Fix
10. Change customer count to "12,000+ Happy Customers"
11. Remove "bottles sold" text
12. Update rating from 4.63 to 4.9/5

### Phase 5: Trust Badge Fix
13. Add "Verified" subtext under each trust badge

---

## Implementation Checklist

```
[ ] 1. Wrap purchase elements in white card container
[ ] 2. Move Social Proof outside white card
[ ] 3. Delete bottom 5-icon row
[ ] 4. Restyle timer as pink strip (no border)
[ ] 5. Remove duplicate timer label
[ ] 6. Change price to $95.00 strikethrough
[ ] 7. Update discount to 46%
[ ] 8. Update CTA text to "Pre-Order Now - Save Extra 25%"
[ ] 9. Change to "12,000+ Happy Customers"
[ ] 10. Remove "bottles sold" text
[ ] 11. Update rating to 4.9/5
[ ] 12. Add "Verified" under trust badges
```

---

**Total Discrepancies:** 13  
**Critical (Structural):** 3  
**High (Pricing/Data):** 6  
**Medium (Styling):** 4
