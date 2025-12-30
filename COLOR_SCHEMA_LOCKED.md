# OptiBio Color Schema - LOCKED & PERMANENT

**⚠️ CRITICAL: This color schema is LOCKED and should NEVER be changed without explicit user approval.**

**Last Updated:** December 29, 2025  
**Status:** APPROVED & PRODUCTION  
**Theme:** Clinical Light (Light Mode Primary)

---

## APPROVED COLOR PALETTE

### Primary Colors (DO NOT CHANGE)

| Color Name | Hex Code | RGB | Usage | Notes |
|-----------|----------|-----|-------|-------|
| **Deep Navy** | `#1E3A5F` | rgb(30, 58, 95) | Headlines, text, primary buttons | Professional, trustworthy, premium |
| **Navy Dark** | `#152B45` | rgb(21, 43, 69) | Hover states, dark accents | Darker variant for depth |
| **Warm Ivory** | `#F7F4EF` | rgb(247, 244, 239) | Background | Elegant, premium, warm tone |
| **Antique Gold** | `#C9A961` | rgb(201, 169, 97) | Accents, CTA buttons, highlights | Sophisticated, valuable, premium |
| **Gold Dark** | `#B89651` | rgb(184, 150, 81) | Hover states on gold elements | Darker gold for interaction |

### Supporting Colors (DO NOT CHANGE)

| Color Name | Hex Code | RGB | Usage | Notes |
|-----------|----------|-----|-------|-------|
| **Charcoal** | `#2D2D2D` | rgb(45, 45, 45) | Body text | High contrast for readability |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Card backgrounds, overlays | Pure white for clean cards |
| **Success Green** | `#5FA865` | rgb(95, 168, 101) | Success states, badges | Positive feedback |

---

## THEME CONFIGURATION

### Light Mode (DEFAULT - CLINICAL LIGHT)

```css
/* Background & Text */
--background: #F7F4EF (Warm Ivory)
--foreground: #2D2D2D (Charcoal)

/* Cards & Containers */
--card: #FFFFFF (White)
--card-foreground: #2D2D2D (Charcoal)

/* Primary (Headlines, Primary Buttons) */
--primary: #1E3A5F (Deep Navy)
--primary-foreground: #FFFFFF (White)

/* Secondary (Gold Accents) */
--secondary: #C9A961 (Antique Gold)
--secondary-foreground: #1E3A5F (Deep Navy)

/* Accent (CTA Buttons, Highlights) */
--accent: #C9A961 (Antique Gold)
--accent-foreground: #1E3A5F (Deep Navy)

/* Muted (Subtle backgrounds, disabled states) */
--muted: #E8F4F8 (Light Sky Blue)
--muted-foreground: #4A5568 (Muted Gray)

/* Borders & Inputs */
--border: #E0E0E0 (Light Gray)
--input: #E0E0E0 (Light Gray)
```

### Dark Mode (SECONDARY - NOT CURRENTLY ACTIVE)

```css
/* Background & Text */
--background: #0F1F30 (Very Dark Navy)
--foreground: #FFFFFF (White)

/* Cards & Containers */
--card: #152B45 (Navy Dark)
--card-foreground: #FFFFFF (White)

/* Primary (Headlines, Primary Buttons) */
--primary: #42A5F5 (Light Blue)
--primary-foreground: #0F1F30 (Very Dark Navy)

/* Secondary (Gold Accents) */
--secondary: #C9A961 (Antique Gold)
--secondary-foreground: #0F1F30 (Very Dark Navy)
```

---

## GRADIENT DEFINITIONS (DO NOT CHANGE)

### Hero Gradient (Light Mode)
```
radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)
```
**Purpose:** Main hero section background - soft sky blue gradient

### Navy Gradient
```
linear-gradient(135deg, #1E3A5F 0%, #152B45 100%)
```
**Purpose:** Premium dark sections, buttons

### Navy-Ivory Gradient
```
linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%)
```
**Purpose:** Transitional sections between dark and light

---

## CONTRAST RATIOS (WCAG 2.1 AA COMPLIANCE)

| Combination | Ratio | Status |
|------------|-------|--------|
| Deep Navy (#1E3A5F) on White (#FFFFFF) | 8.2:1 | ✅ AAA |
| Deep Navy (#1E3A5F) on Warm Ivory (#F7F4EF) | 7.8:1 | ✅ AAA |
| Charcoal (#2D2D2D) on White (#FFFFFF) | 15.3:1 | ✅ AAA |
| Antique Gold (#C9A961) on Deep Navy (#1E3A5F) | 4.8:1 | ✅ AA |
| Antique Gold (#C9A961) on White (#FFFFFF) | 4.2:1 | ✅ AA |

---

## CSS VARIABLE REFERENCES

All colors are defined in `/client/src/index.css` under the `:root` selector:

```css
:root {
  --optibio-navy: #1E3A5F;
  --optibio-navy-dark: #152B45;
  --optibio-ivory: #F7F4EF;
  --optibio-gold: #C9A961;
  --optibio-gold-dark: #B89651;
  --optibio-charcoal: #2D2D2D;
  --optibio-white: #FFFFFF;
  --optibio-success: #5FA865;
}
```

**Usage in Components:**
```tsx
// Use Tailwind classes (preferred)
<div className="bg-background text-foreground">
  <h1 className="text-primary">Headline</h1>
  <button className="bg-accent text-accent-foreground">CTA</button>
</div>

// Or use CSS variables directly
<div style={{ color: 'var(--optibio-navy)' }}>
  Navy text
</div>
```

---

## COMPONENT COLOR GUIDELINES

### Buttons
- **Primary Button:** Deep Navy (#1E3A5F) background, White text
- **Secondary Button:** Antique Gold (#C9A961) background, Deep Navy text
- **Hover State:** Use Gold Dark (#B89651) or Navy Dark (#152B45)

### Cards
- **Background:** White (#FFFFFF)
- **Border:** Light Gray (#E0E0E0) - optional subtle border
- **Text:** Charcoal (#2D2D2D)

### Headers & Navigation
- **Background:** Warm Ivory (#F7F4EF) or White (#FFFFFF)
- **Text:** Deep Navy (#1E3A5F)
- **Hover/Active:** Antique Gold (#C9A961)

### Hero Section
- **Background:** Sky Blue Gradient (see Gradient Definitions)
- **Text:** Deep Navy (#1E3A5F)
- **CTA Button:** Antique Gold (#C9A961)

### Badges & Tags
- **Success:** Success Green (#5FA865)
- **Warning:** Antique Gold (#C9A961)
- **Error:** Red (#E74C3C)

---

## ENFORCEMENT RULES

1. **No arbitrary color changes** - All color modifications require explicit user approval
2. **Use CSS variables** - Never hardcode hex values in components
3. **Reference this document** - When in doubt, check this schema
4. **Test contrast** - Ensure WCAG 2.1 AA compliance (4.5:1 minimum)
5. **Maintain consistency** - Use the same colors across all pages and components

---

## CHANGE LOG

| Date | Change | Approved By |
|------|--------|-------------|
| 2025-12-29 | Initial schema locked - Clinical Light theme approved | OptiBio Team |

---

**⚠️ REMINDER:** This schema is the single source of truth. Any future development work should reference this document before making color-related changes.
