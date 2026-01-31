# OptiBio® Master Color Specification

**Version:** 2.0  
**Status:** LOCKED & APPROVED  
**Last Updated:** December 30, 2025  
**Authority:** Single Source of Truth for All OptiBio Brand Colors

---

## 🔒 ENFORCEMENT POLICY

This document is the **permanent, immutable color specification** for OptiBio. All colors listed here are APPROVED and LOCKED. Any deviation from these specifications requires written approval from brand management.

**Key Principle:** Global > Component > Inline. Never use inline color styles when these global tokens exist.

---

## 📋 COMPLETE COLOR INVENTORY

### PRIMARY COLORS (Brand Identity)

| Color Name | Hex Code | RGB | HSL | CMYK (Print) | CSS Variable | Tailwind Class | Usage |
|------------|----------|-----|-----|--------------|--------------|----------------|-------|
| **Deep Navy** | `#1E3A5F` | 30, 58, 95 | 207°, 52%, 25% | 100, 85, 35, 25 | `--primary` | `text-primary`, `bg-primary` | Headlines, nav links, primary buttons, text emphasis. The "voice" of the brand. |
| **Navy Dark** | `#152B45` | 21, 43, 69 | 207°, 53%, 18% | N/A | `--sidebar-primary` | `text-slate-900` | Hover states, accents, deeper authority |
| **Pure White** | `#FFFFFF` | 255, 255, 255 | 0°, 0%, 100% | 0, 0, 0, 0 | `--popover` | `bg-white` | Card backgrounds, containers, clean spaces. The "canvas." |
| **Warm Ivory** | `#F7F4EF` | 247, 244, 239 | 30°, 43%, 95% | 2, 3, 5, 0 | `--background` | `bg-background` | Section backgrounds, warmth, testimonial sections |
| **Antique Gold** | `#C9A961` | 201, 169, 97 | 39°, 49%, 58% | 20, 30, 70, 0 | `--accent` | `text-accent`, `bg-accent` | 5-star ratings, icons, borders, premium badges, accents |
| **Gold Dark** | `#B89651` | 184, 150, 81 | 39°, 42%, 52% | N/A | N/A | `text-yellow-700` | Hover states on gold elements |

---

### LOGO GRADIENT COLORS

| Element | Gradient Type | Color Stops | Hex Codes | Usage |
|---------|---------------|-------------|-----------|-------|
| **OPTI** | Vertical Gradient | Light Blue → Gold | `#87CEEB` → `#FFD700` | Primary logo text |
| **bio** | Diagonal Gradient | Navy → Amber | `#1E3ABA` → `#F59E0B` | Secondary logo text |
| **Leaf** | Gradient | Deep Blue base with Golden highlight | N/A | Logo accent element |

**Logo Monotone Variations:**
- **Gold Foil:** Pantone 871 C (Hot Foil Stamp) / `#C9A961` (Digital)
- **Pure White:** White ink / `#FFFFFF` (Digital)
- **Deep Navy:** Pantone 533 C / `#1E3A5F` (Digital)

---

### BACKGROUND COLORS (Light Mode)

| Color Name | Hex Code | RGB | CSS Variable | Tailwind Class | Psychology | Usage |
|------------|----------|-----|--------------|----------------|------------|-------|
| **Warm Ivory** | `#F7F4EF` | 247, 244, 239 | `--background` | `bg-background` | Elegant, Premium, Warm | Page backgrounds, testimonial sections |
| **Ivory Light** | `#EDE9E3` | 237, 233, 227 | N/A | `bg-slate-100` | Subtle contrast | Hover states, subtle separators |
| **Soft White** | `#FAFAF9` | 250, 250, 249 | `--card` | `bg-card` | Clean, Premium, Organized | Card backgrounds |
| **Pure White** | `#FFFFFF` | 255, 255, 255 | `--popover` | `bg-white` | Maximum contrast | Modals, overlays, elevated cards |
| **Sky Mist** | `#F0F9FF` | 240, 249, 255 | N/A | `bg-blue-50` | Clean, Clinical, Trust | Timeline sections, subtle blue tint |

---

### SKY BLUE GRADIENT (Hero Sections)

**Clinical Light Mode Gradient - APPROVED**

```css
background: radial-gradient(ellipse at center,
  #F8FCFE 0%,
  #EBF5FB 40%,
  #D6EAF8 100%
);
```

**Color Stops:**
- Center: `#F8FCFE` (Near White with Sky Tint)
- Mid: `#EBF5FB` (Sky Mist)
- Edge: `#D6EAF8` (Sky Blue)

**Usage:** Page backgrounds, hero sections, calming atmosphere

**Psychology:** Clean, clinical, pharmaceutical-grade, Apple Health aesthetic

---

### TEXT COLORS

| Color Name | Hex Code | RGB | CSS Variable | Tailwind Class | Usage |
|------------|----------|-----|--------------|----------------|-------|
| **Charcoal** | `#2D2D2D` | 45, 45, 45 | `--foreground` | `text-foreground` | Primary body text, maximum contrast |
| **Slate Grey** | `#475569` | 71, 85, 105 | N/A | `text-slate-600` | Body paragraphs, secondary text (never use pure black) |
| **Light Gray** | `#666666` | 102, 102, 102 | N/A | `text-muted-foreground` | Secondary text, captions, disabled states |
| **Muted Gray** | `#A0A0A0` | 160, 160, 160 | `--muted-foreground` | `text-muted-foreground` | Placeholder text, hints |

---

### ACCENT & INTERACTIVE COLORS

| Color Name | Hex Code | RGB | CSS Variable | Tailwind Class | Usage |
|------------|----------|-----|--------------|----------------|-------|
| **Electric Blue** | `#2563EB` | 37, 99, 235 | N/A | `text-blue-600` | Hover states, hyperlinks, interactive elements |
| **Trust Blue** | `#2563EB` | 37, 99, 235 | N/A | `bg-blue-600` | Primary CTA buttons (alternative to Navy) |
| **Success Green** | `#5FA865` | 95, 168, 101 | `--chart-1` | `text-green-600` | Positive actions, confirmations, checkmarks |
| **Error Red** | `oklch(0.55 0.22 25)` | ~RGB(191, 82, 73) | `--destructive` | `text-red-600` | Error states, warnings, X marks |

---

### DARK MODE COLORS (Optional - For Future Use)

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Abyssal Navy** | `#0B1120` | 11, 17, 32 | Dark mode background |
| **Deep Brand Navy** | `#1E3A5F` | 30, 58, 95 | Dark mode cards |
| **Navy-700** | `#2D4A77` | 45, 74, 119 | Dark mode borders |
| **Luminous Gold** | `#D4AF37` | 212, 175, 55 | Dark mode gold accents |
| **Sky Grey** | `#94A3B8` | 148, 163, 184 | Dark mode body text |
| **Dark Slate** | `#0F172A` | 15, 23, 42 | Dark mode review section |

**Note:** OptiBio is a **Light Mode brand** by default. Dark mode is NOT currently implemented but colors are reserved for future use.

---

## 🎨 COLOR COMBINATIONS (WCAG AA Compliant)

| Combination | Primary | Secondary | Usage | Contrast Ratio |
|-------------|---------|-----------|-------|----------------|
| **Navy + White** | `#1E3A5F` | `#FFFFFF` | Primary CTA buttons, headlines | 10.48:1 (AAA) |
| **Navy + Charcoal** | `#1E3A5F` | `#2D2D2D` | Headlines + body text | 2.8:1 (AA) |
| **Gold + Navy** | `#C9A961` | `#1E3A5F` | Premium accents, highlights | 5.12:1 (AA) |
| **Navy + Ivory** | `#1E3A5F` | `#F7F4EF` | Warm sections, testimonials | 9.2:1 (AAA) |
| **Sky Blue Gradient** | Radial | N/A | Hero sections, page backgrounds | Excellent readability |

---

## 🚫 FORBIDDEN COLORS

The following colors are **BANNED** from OptiBio brand usage:

| Color | Hex Code | Reason |
|-------|----------|--------|
| **Pure Black** | `#000000` | Too aggressive, not on-brand for clinical/premium aesthetic |
| **Dark Mode Backgrounds** | Any | OptiBio is a Light Mode brand (non-negotiable) |
| **Neon Colors** | Any | Not premium, not clinical |
| **Saturated Reds** | `#FF0000` | Too aggressive (use Error Red `oklch(0.55 0.22 25)` instead) |

---

## 📐 UI COMPONENT SPECIFICATIONS

### Buttons

| Button Type | Background | Text | Border | Hover State |
|-------------|------------|------|--------|-------------|
| **Primary (Buy)** | Deep Navy `#1E3A5F` | White | None | Darker Navy `#0D1B2A`, lift effect |
| **Secondary (Learn)** | White | Navy | Navy 2px | Navy background, white text |
| **Tertiary (Link)** | Transparent | Navy | None | Electric Blue `#2563EB`, underline |
| **Disabled** | Light Grey | Grey | None | No hover effect |

### Cards

- **Background:** Pure White `#FFFFFF`
- **Border:** Subtle 1px `#E0E0E0`
- **Shadow:** `shadow-xl` (0 20px 25px -5px rgba(0, 0, 0, 0.1))
- **Border Radius:** `rounded-2xl` (16px)
- **Padding:** 24px-32px
- **Hover Effect:** Subtle lift `translateY(-2px)` + enhanced shadow

### Form Inputs

- **Background:** Pure White
- **Border:** 1px Slate Grey
- **Focus State:** 2px Navy border + shadow
- **Text:** Charcoal
- **Placeholder:** Slate Grey (lighter)

### Badges

- **Background:** Gold `#C9A961` with 10% opacity
- **Text:** Gold `#C9A961` (darker)
- **Border:** 1px Gold
- **Padding:** 4px 12px
- **Border Radius:** 20px (pill-shaped)

---

## 🔍 SHADOW SYSTEM

| Level | CSS | Usage |
|-------|-----|-------|
| **sm** | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| **md** | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Cards, buttons |
| **lg** | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, dropdowns |
| **xl** | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Card hover, emphasis |
| **2xl** | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | Hero elements, focus |

---

## 📏 SPACING SYSTEM (8px Base Unit)

| Size | Pixels | Usage |
|------|--------|-------|
| **xs** | 4px | Micro spacing, icon gaps |
| **sm** | 8px | Padding, margins, gaps |
| **md** | 16px | Card padding, section spacing |
| **lg** | 24px | Section margins |
| **xl** | 32px | Major section spacing |
| **2xl** | 48px | Hero section padding |

---

## 🎯 SOCIAL MEDIA COLOR RULE (60-30-10)

Every social media post should follow this color ratio for visual balance:

- **60% White/Sky Blue:** Negative space, backgrounds, brightness
- **30% Deep Navy:** Text overlays, strong graphical elements
- **10% Gold:** Accents, CTAs, premium touches

---

## ✅ VALIDATION CHECKLIST

Before deploying any design, verify:

- [ ] All colors match this specification exactly (no approximations)
- [ ] No pure black `#000000` backgrounds in main content sections
- [ ] Sky Blue Gradient uses exact CSS from this document
- [ ] Text contrast ratios meet WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Buttons use approved color combinations
- [ ] Cards use Pure White `#FFFFFF` background
- [ ] Gold accents use `#C9A961` (not yellow or orange)
- [ ] No dark mode themes applied (OptiBio is Light Mode only)

---

## 🔐 ENFORCEMENT MECHANISM

This specification is enforced through:

1. **CSS Variables** in `client/src/index.css` (Lines 51-155)
2. **TypeScript Constants** in `client/src/const/colors.ts` (Lines 51-143)
3. **Automated Validation Script** (runs on pre-commit)
4. **Design System Audit Document** (APPROVED_COLOR_SCHEMA_V66B1D787.md)

Any changes to colors MUST:
1. Update this document first
2. Update CSS variables in `index.css`
3. Update TypeScript constants in `const/colors.ts`
4. Run validation script to verify compliance
5. Document reason for change in version history

---

## 📚 REFERENCE DOCUMENTS

- **Master Brand Guidelines v2.0** (OPTIBIO_MASTER_BRAND_GUIDELINES_v2.pdf)
- **Design System Audit Document** (OptiBio_Design_System_Audit_Document.pdf)
- **Brand Implementation Guide** (OptiBio®_Brand_Implementation_Guide.pdf)
- **Brand Standards Checklist** (OptiBio®_Brand_Standards_Checklist.pdf)

---

## 📝 VERSION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 2.0 | Dec 30, 2025 | Complete color lock system created. Consolidated all colors from 6 brand documents. Added enforcement mechanisms. | OptiBio Design Team |
| 1.0 | Dec 2025 | Initial brand guidelines published | OptiBio Design Team |

---

**END OF SPECIFICATION**

*This document is the single source of truth for OptiBio brand colors. Any deviation requires written approval from brand management.*
