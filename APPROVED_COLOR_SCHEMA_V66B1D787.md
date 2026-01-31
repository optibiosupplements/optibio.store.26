# OptiBio Approved Color Schema - Version 66b1d787
## CRITICAL: These are the LOCKED brand colors - DO NOT MODIFY

**Last Updated:** December 29, 2025  
**Version:** 66b1d787  
**Focus:** Light Mode (Day Mode) Design  
**Status:** APPROVED & LOCKED

---

## 🎨 PRIMARY BRAND COLORS (Midnight Sophistication)

### 1. Deep Navy - PRIMARY COLOR
- **Hex Code:** `#1E3A5F`
- **OKLCH:** `oklch(0.32 0.08 240)`
- **Usage:** Headlines, primary text, buttons, navigation, trust signals
- **Psychology:** Professional, trustworthy, premium, pharmaceutical-grade
- **Accessibility:** WCAG AAA compliant for all text sizes

### 2. Navy Dark - SECONDARY NAVY
- **Hex Code:** `#152B45`
- **OKLCH:** `oklch(0.28 0.08 240)`
- **Usage:** Darker navy for gradients, sidebar, emphasis
- **Psychology:** Deeper authority, more sophisticated
- **Accessibility:** WCAG AAA compliant

### 3. Antique Gold - ACCENT COLOR
- **Hex Code:** `#C9A961`
- **OKLCH:** `oklch(0.72 0.08 75)`
- **Usage:** CTA buttons, highlights, premium accents, icons, hover states
- **Psychology:** Valuable, sophisticated, premium, luxury
- **Accessibility:** WCAG AA compliant on navy backgrounds

### 4. Gold Dark - SECONDARY GOLD
- **Hex Code:** `#B89651`
- **OKLCH:** `oklch(0.62 0.05 150)`
- **Usage:** Hover states, darker gold accents, gradients
- **Psychology:** Deeper luxury, more refined
- **Accessibility:** WCAG AAA compliant on navy backgrounds

---

## 🌅 LIGHT MODE (DAY MODE) BACKGROUND COLORS

### 5. Warm Ivory - PRIMARY BACKGROUND
- **Hex Code:** `#F7F4EF`
- **OKLCH:** `oklch(0.97 0.01 60)`
- **Usage:** Page background, warm neutral base
- **Psychology:** Elegant, premium, warm, approachable
- **Accessibility:** WCAG AAA compliant for all text

### 6. Soft White - CARD BACKGROUND
- **Hex Code:** `#FAFAF9`
- **OKLCH:** `oklch(0.98 0 0)`
- **Usage:** Card backgrounds, content containers, elevated surfaces
- **Psychology:** Clean, premium, organized
- **Accessibility:** WCAG AAA compliant for all text

### 7. Pure White - UTILITY
- **Hex Code:** `#FFFFFF`
- **Usage:** High-contrast elements, special emphasis
- **Psychology:** Clean, clinical, premium
- **Accessibility:** WCAG AAA compliant

---

## 📝 LIGHT MODE TEXT COLORS

### 8. Charcoal - PRIMARY TEXT
- **Hex Code:** `#2D2D2D`
- **OKLCH:** `oklch(0.22 0 0)`
- **Usage:** Body text, primary foreground, high contrast
- **Psychology:** Professional, readable, trustworthy
- **Accessibility:** 12.6:1 contrast ratio on ivory (WCAG AAA)

### 9. Light Gray - SECONDARY TEXT
- **Hex Code:** `#666666` (oklch(0.42 0 0))
- **Usage:** Muted text, secondary information, captions
- **Psychology:** Subtle, supporting information
- **Accessibility:** 4.5:1 contrast ratio on ivory (WCAG AA)

---

## 🌈 LIGHT MODE HERO GRADIENT (DAY MODE)
### Sky Blue Radial Gradient
```css
background: radial-gradient(ellipse at center, 
  #F8FCFE 0%,      /* Lightest sky blue - center */
  #EBF5FB 40%,     /* Light sky blue - mid */
  #D6EAF8 100%     /* Deeper sky blue - edges */
);
```
- **Psychology:** Calming, wellness, airy, clinical
- **Usage:** Hero sections, main backgrounds, large content areas
- **Accessibility:** Excellent contrast for all text colors

---

## 🎭 GRADIENT COMBINATIONS (Light Mode)

### Navy-to-Gold Gradient
```css
background: linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%);
```
- **Usage:** Premium CTAs, special emphasis
- **Psychology:** Luxury, premium, valuable

### Navy-to-Ivory Gradient
```css
background: linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%);
```
- **Usage:** Sections, transitions
- **Psychology:** Professional to approachable

### Navy-to-Navy Gradient
```css
background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%);
```
- **Usage:** Deep sections, emphasis
- **Psychology:** Depth, authority

---

## ✨ SHADOW SYSTEM (Light Mode)

### Premium Shadow
```css
box-shadow: 0 25px 50px -12px rgba(30, 58, 95, 0.25);
```
- **Usage:** Elevated cards, premium elements

### Navy Shadow
```css
box-shadow: 0 10px 25px rgba(30, 58, 95, 0.3);
```
- **Usage:** Standard card shadows

### Gold Glow
```css
box-shadow: 0 0 40px rgba(201, 169, 97, 0.4);
```
- **Usage:** Premium CTAs, special emphasis

### Ivory Shadow
```css
box-shadow: 0 4px 20px rgba(247, 244, 239, 0.3);
```
- **Usage:** Subtle shadows on light backgrounds

---

## 🎯 COLOR USAGE RULES (LIGHT MODE ONLY)

### Headlines & Primary Text
- **Color:** Deep Navy `#1E3A5F`
- **Font Weight:** Bold (600-700)
- **Size:** 24px+

### Body Text
- **Color:** Charcoal `#2D2D2D`
- **Font Weight:** Regular (400-500)
- **Size:** 14-16px

### Secondary Text / Captions
- **Color:** Light Gray `#666666`
- **Font Weight:** Regular (400)
- **Size:** 12-14px

### CTA Buttons
- **Background:** Deep Navy `#1E3A5F`
- **Text:** White `#FFFFFF`
- **Hover:** Antique Gold `#C9A961` background or border
- **Size:** 44px+ minimum (accessibility)

### Accent Elements
- **Color:** Antique Gold `#C9A961`
- **Usage:** Icons, highlights, hover states, badges
- **Never:** Use gold for body text (contrast issues)

### Cards & Containers
- **Background:** Soft White `#FAFAF9` or Pure White `#FFFFFF`
- **Border:** Light Gray `#E0E0E0` (optional)
- **Shadow:** Navy Shadow (0 10px 25px rgba(30, 58, 95, 0.3))

### Page Background
- **Color:** Warm Ivory `#F7F4EF`
- **Alternative:** Sky Blue Radial Gradient (hero sections)

---

## ⚠️ CRITICAL RULES - DO NOT VIOLATE

1. **NEVER use green, blue, yellow, purple, or orange** - Only Navy, Gold, Ivory, White, Charcoal
2. **NEVER change the hero gradient** - Must be sky blue radial (F8FCFE → EBF5FB → D6EAF8)
3. **NEVER use dark mode colors in light mode** - Light mode is the approved design
4. **NEVER modify text contrast ratios** - All text must meet WCAG AA minimum (4.5:1)
5. **NEVER add new brand colors** - Only use the 9 approved colors listed above
6. **NEVER use these colors for light mode:**
   - Dark mode navy (#0F1F30, #152B45 for dark mode only)
   - Beige/tan/brown (not part of brand)
   - Green/emerald (not part of brand)
   - Red/orange (only for errors)

---

## 🔒 OKLCH COLOR SYSTEM (Technical Reference)

All colors are defined in OKLCH color space for better accessibility and consistency:

| Color Name | OKLCH Value | Hex | Usage |
|---|---|---|---|
| Primary (Navy) | oklch(0.32 0.08 240) | #1E3A5F | Headlines, buttons |
| Primary Foreground | oklch(0.98 0 0) | #FFFFFF | Text on navy |
| Secondary (Gold) | oklch(0.72 0.08 75) | #C9A961 | Accents, CTAs |
| Background (Ivory) | oklch(0.97 0.01 60) | #F7F4EF | Page background |
| Foreground (Charcoal) | oklch(0.22 0 0) | #2D2D2D | Body text |
| Card | oklch(0.98 0 0) | #FAFAF9 | Card backgrounds |
| Muted Foreground | oklch(0.42 0 0) | #666666 | Secondary text |
| Border | oklch(0.88 0.005 80) | #E0E0E0 | Borders, dividers |
| Accent | oklch(0.72 0.08 75) | #C9A961 | Highlights |

---

## 📋 CHECKLIST FOR COLOR COMPLIANCE

Before deploying any changes, verify:

- [ ] All headlines are Deep Navy `#1E3A5F`
- [ ] All body text is Charcoal `#2D2D2D`
- [ ] All CTA buttons use Navy background with Gold hover
- [ ] Page background is Warm Ivory `#F7F4EF`
- [ ] Hero sections use Sky Blue Radial Gradient
- [ ] All cards use Soft White `#FAFAF9` background
- [ ] No green, blue, yellow, purple, or orange colors used
- [ ] All text meets WCAG AA contrast (4.5:1 minimum)
- [ ] Gold is only used for accents, not body text
- [ ] Dark mode colors are NOT used in light mode

---

## 🚨 EMERGENCY REFERENCE

**If you accidentally changed colors, revert to these EXACT values:**

```css
:root {
  --optibio-navy: #1E3A5F;
  --optibio-navy-dark: #152B45;
  --optibio-ivory: #F7F4EF;
  --optibio-gold: #C9A961;
  --optibio-gold-dark: #B89651;
  --optibio-charcoal: #2D2D2D;
  --optibio-white: #FFFFFF;
  
  --primary: oklch(0.32 0.08 240);
  --background: oklch(0.97 0.01 60);
  --foreground: oklch(0.22 0 0);
  --accent: oklch(0.72 0.08 75);
}

.bg-hero-gradient {
  background: radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%);
}
```

---

## 📞 QUESTIONS?

These colors are LOCKED and APPROVED. Do not modify without explicit user approval. All future design changes must use ONLY these 9 approved colors.

**Version:** 66b1d787  
**Locked:** December 29, 2025  
**Focus:** Light Mode (Day Mode) Only
