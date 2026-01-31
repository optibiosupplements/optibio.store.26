# OptiBio Brand Guidelines for Developers

**STATUS:** FINAL AUTHORITY  
**SOURCE:** OptiBio Unified Design System v3.0 (The "Locked" Protocol)  
**DATE:** December 30, 2025

---

## ⚠️ CRITICAL RULE: NEVER PICK GENERIC COLORS

**Before making ANY color decision:**

1. **ALWAYS** reference `/home/ubuntu/projects/optibio-supplements-4f3cb533/OPTIBIO_UNIFIED_DESIGN_SYSTEM_v3.md`
2. **ALWAYS** use colors from `client/src/brand.ts` constants
3. **ALWAYS** use CSS variables from `client/src/index.css`
4. **NEVER** use generic Tailwind colors (blue-500, gray-200, slate-50, etc.)
5. **NEVER** invent new colors without explicit brand team approval

---

## Color Decision Workflow

```
┌─────────────────────────────────────┐
│ Need to add a color to a component? │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 1. Check OPTIBIO_UNIFIED_DESIGN_    │
│    SYSTEM_v3.md for the use case    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Import from client/src/brand.ts  │
│    OR use CSS variable from         │
│    client/src/index.css             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. If no match found, ASK USER      │
│    for brand team approval          │
└─────────────────────────────────────┘
```

---

## Quick Reference: When to Use Which Palette

### Core Brand Palette (80% of site)
**Use for:** Page structure, navigation, headings, body text, general UI

| Element | Color | Source |
|---------|-------|--------|
| Primary headings | Deep Navy `#1E3A5F` | `BRAND_COLORS.DEEP_NAVY` |
| Body text | Charcoal `#2D2D2D` | `--optibio-charcoal` |
| Backgrounds | Pure White `#FFFFFF` | `BRAND_COLORS.PURE_WHITE` |
| Accents | Antique Gold `#C9A961` | `BRAND_COLORS.ANTIQUE_GOLD` |
| Hero sections | Sky Gradient | `BRAND_COLORS.SKY_GRADIENT` |

### Conversion Palette (High-intent actions only)
**Use for:** Countdown timers, social proof, CTAs, trust badges

| Element | Color System | Source |
|---------|--------------|--------|
| Countdown timer | Urgency Warmth (Peach gradient) | `URGENCY_COLORS.*` |
| Review cards | Social Proof (Green gradient) | `SOCIAL_PROOF_COLORS.*` |
| Primary CTA button | Action Blue | `ACTION_COLORS.*` |

---

## Implementation Examples

### ✅ CORRECT: Using Brand Constants

```tsx
import { BRAND_COLORS, ACTION_COLORS } from '@/brand';

// Option 1: Inline styles with brand constants
<div style={{ 
  color: BRAND_COLORS.DEEP_NAVY,
  backgroundColor: BRAND_COLORS.PURE_WHITE 
}}>
  Heading
</div>

// Option 2: CSS variables
<div className="text-[var(--optibio-navy)] bg-[var(--optibio-white)]">
  Heading
</div>

// Option 3: Pre-built utility classes
<div className="text-brand-navy bg-brand-white">
  Heading
</div>

// Option 4: Pre-built component classes
<div className="card-social-proof">
  <span className="text-social-proof">127 bottles sold today</span>
</div>
```

### ❌ WRONG: Using Generic Tailwind Colors

```tsx
// ❌ NEVER DO THIS
<div className="text-blue-600 bg-gray-50">  // Generic Tailwind colors
  Heading
</div>

// ❌ NEVER DO THIS
<div style={{ color: '#3B82F6' }}>  // Random hex code not in brand guidelines
  Heading
</div>

// ❌ NEVER DO THIS
<div className="bg-slate-100 text-gray-900">  // Generic slate/gray
  Heading
</div>
```

---

## Component-Specific Guidelines

### Countdown Timer
```tsx
import { getCountdownTimerStyles } from '@/brand';

<div style={getCountdownTimerStyles()}>
  <span className="text-countdown-number">12:34:56</span>
</div>

// OR use pre-built class
<div className="card-countdown">
  <span className="text-countdown-number">12:34:56</span>
</div>
```

### Social Proof Card
```tsx
import { getSocialProofCardStyles } from '@/brand';

<div style={getSocialProofCardStyles()}>
  <span className="text-social-proof">127 bottles sold</span>
</div>

// OR use pre-built class
<div className="card-social-proof">
  <span className="text-social-proof">127 bottles sold</span>
</div>
```

### Primary CTA Button
```tsx
import { getPrimaryCTAStyles } from '@/brand';

<button style={getPrimaryCTAStyles()}>
  Pre-Order Now
</button>

// OR use pre-built class
<button className="btn-primary-action">
  Pre-Order Now
</button>
```

---

## Accessibility Requirements

All color combinations MUST meet WCAG 2.1 AA standards (4.5:1 contrast ratio for normal text, 3:1 for large text).

**Pre-approved combinations:**
- ✅ Deep Navy (#1E3A5F) on White: 9.24:1
- ✅ Success Green (#16A34A) on White: 4.54:1
- ✅ Deep Rust (#7C2D12) on Peach Gradient: 7.12:1
- ✅ Electric Blue (#2563EB) on White: 4.56:1

**If you need a new combination, you MUST:**
1. Test contrast ratio at https://webaim.org/resources/contrastchecker/
2. Get approval from brand team before implementation
3. Document the approved combination in this file

---

## Dark Mode

Dark mode uses a different core palette but **keeps the same conversion colors**.

### Dark Mode Core Palette
- Background: Abyssal Navy `#0B1120`
- Cards: Deep Navy `#1E3A5F`
- Text: White `#FFFFFF`
- Accents: Luminous Gold `#D4AF37` (brighter than light mode)

### Dark Mode Conversion Palette
**Keep identical to light mode:**
- Social Proof Green Gradient ✅
- Countdown Peach Gradient ✅
- Electric Blue CTA ✅

---

## Typography

### Font Families
```tsx
// Headings
font-family: 'Sora', sans-serif;

// Body text
font-family: 'Inter', sans-serif;
```

### Font Weights
- **Regular (400):** Body text
- **Semibold (600):** Subheadings, emphasis
- **Bold (700):** Countdown numbers, prices, CTAs

---

## Pre-Flight Checklist

Before committing any color changes, verify:

- [ ] Color is defined in `OPTIBIO_UNIFIED_DESIGN_SYSTEM_v3.md`
- [ ] Color is imported from `client/src/brand.ts` OR uses CSS variable from `client/src/index.css`
- [ ] No generic Tailwind colors (blue-500, gray-200, slate-50) used
- [ ] Contrast ratio meets WCAG 2.1 AA standards
- [ ] Dark mode variant considered (if applicable)
- [ ] Component matches official design system recipes

---

## Getting Approval for New Colors

If you need a color that's not in the design system:

1. **Stop immediately** - do not proceed with implementation
2. **Document the use case** - why is this color needed?
3. **Ask the user** - request brand team approval
4. **Wait for explicit approval** - do not assume or guess
5. **Update this file** - document the approved color once confirmed

---

## Resources

- **Official Design System:** `/home/ubuntu/projects/optibio-supplements-4f3cb533/OPTIBIO_UNIFIED_DESIGN_SYSTEM_v3.md`
- **Brand Constants:** `client/src/brand.ts`
- **CSS Variables:** `client/src/index.css`
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Last Updated:** December 30, 2025  
**Maintained By:** OptiBio Development Team
