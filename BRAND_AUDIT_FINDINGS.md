# OptiBio Brand Audit Findings

## Brand Guidelines Summary (from Style Guide PDF)

### Color Palette

**Primary Colors:**
- Deep Navy: `#1E3A5F` rgb(30, 58, 95) - Headers, CTAs, trust signals
- Warm Ivory: `#F7F4EF` rgb(247, 244, 239) - Backgrounds, cards, light sections
- Antique Gold: `#C9A961` rgb(201, 169, 97) - Accent, success states, premium highlights

**Supporting Colors:**
- Navy Dark: `#152B45` - Hover states, deep shadows, dark gradients
- Gold Dark: `#B89651` - Gold hover states, gradient endpoints
- Charcoal: `#2D2D2D` - Body text, high-contrast headlines
- Slate Gray: `#64748B` - Secondary text, subtle elements

**Semantic Colors:**
- Success: Antique Gold `#C9A961`
- Error: Terracotta `#D4745F`
- Warning: Amber `#F59E0B`
- Info: Deep Navy `#1E3A5F`

### Typography System

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Type Scale:**
- Hero H1: 48-64px, 700 (Bold), 1.1 line-height
- H1: 36-48px, 700 (Bold), 1.2 line-height
- H2: 30-36px, 700 (Bold), 1.3 line-height
- H3: 24-28px, 600 (Semibold), 1.4 line-height
- H4: 20-24px, 600 (Semibold), 1.4 line-height
- Body Large: 18-20px, 400 (Regular), 1.6 line-height
- Body: 16px, 400 (Regular), 1.6 line-height
- Body Small: 14px, 400 (Regular), 1.5 line-height
- Label: 12-14px, 600 (Semibold), 1.4 line-height

**Typography Guidelines:**
- Headlines: Deep Navy (#1E3A5F) or Charcoal (#2D2D2D) for maximum impact
- Body text: Charcoal (#2D2D2D) or Slate Gray (#64748B) on Warm Ivory backgrounds
- NEVER use navy for body text (insufficient contrast)
- NEVER use gold for large headlines (reduces readability)
- Emphasis: Bold weight (600-700), Gold color for pricing/discounts, Larger size for important statements
- Line length: Max 75 characters (600-700px) for optimal readability

### Color Usage Guidelines

**Deep Navy (#1E3A5F):**
- Primary navigation headers
- Section headings
- CTA button backgrounds (with white text)
- Trust badges and certifications
- Footer backgrounds

**Warm Ivory (#F7F4EF):**
- Page backgrounds
- Card backgrounds
- Section dividers
- Email backgrounds
- Light overlays

**Antique Gold (#C9A961):**
- Primary CTA buttons (with navy text for AAA contrast)
- Success indicators and checkmarks
- Pricing highlights
- Founder's Circle tier emphasis
- Discount badges

### Accessibility Standards

**WCAG 2.1 Level AAA compliance:**
- Charcoal on Ivory: 12.5:1 (AAA)
- Navy on Ivory: 8.2:1 (AAA)
- Gold on Navy: 4.8:1 (AA Large Text)
- White on Navy: 9.1:1 (AAA)

**CRITICAL:** For CTA buttons using gold backgrounds, always use charcoal (#2D2D2D) text instead of navy to achieve AAA compliance (contrast ratio 7.1:1).

---

## Current Site Issues to Fix

### 1. Typography Issues
- [ ] Verify system font stack is being used (not Sora/Inter)
- [ ] Check if hero headlines are 48-64px with 700 weight
- [ ] Ensure body text is Charcoal (#2D2D2D), not navy
- [ ] Verify line-height values match brand guidelines

### 2. Color Issues
- [ ] Check if Deep Navy is exactly #1E3A5F (currently using #1E3A5F ✓)
- [ ] Verify Warm Ivory is #F7F4EF (currently using #F7F4EF ✓)
- [ ] Ensure Antique Gold is #C9A961 (currently using #C9A961 ✓)
- [ ] Audit all CTA buttons for proper text color (gold bg = charcoal text)

### 3. Logo Usage
- [ ] Verify logo is using gradient version on appropriate backgrounds
- [ ] Check logo sizing and clear space requirements

---

## Next Steps

1. Audit all pages for brand guideline compliance
2. Fix typography (font stack, sizes, weights, line-heights)
3. Fix color usage (especially body text and CTA buttons)
4. Update logo implementation if needed
5. Test accessibility compliance


## Logo Gradient Specifications

### OPTI Text Gradient
- **Direction:** Vertical (Top to Bottom), 180deg
- **Type:** Linear
- **Color Flow:** Light Blue → Medium Blue → Gold
  - Start: #87CEEB (Sky Blue) at 0%
  - Mid: #4682B4 (Steel Blue) at 50%
  - End: #FFD700 (Gold) at 100%
- **CSS:** `background: linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #FFD700 100%);`

### bio Text Gradient
- **Direction:** Diagonal (Bottom-left to Top-right), 45deg
- **Type:** Linear
- **Color Flow:** Navy Blue → Blue → Gold
  - Start: #1E3A8A (Navy Blue) at 0%
  - Mid: #3B82F6 (Blue) at 50%
  - End: #F59E0B (Amber) at 100%
- **CSS:** `background: linear-gradient(45deg, #1E3A8A 0%, #3B82F6 50%, #F59E0B 100%);`

### Leaf Element
- **Base Color:** Deep Blue (#1E3A8A)
- **Highlight:** Golden accent (#F59E0B)
- **Style:** Solid with gradient highlight

### Usage Guidelines
- Always maintain gradient integrity when scaling
- Ensure sufficient contrast with background colors
- Use vector format (SVG) for scalability
- Maintain minimum size requirements for readability
- Consider simplified version for very small applications
- **Recommended backgrounds:** Black (#000000) or White (#FFFFFF)
- **Accent Gold:** #D4AF37 (matches gradient gold tones)
- **Text:** White (#FFFFFF) on dark backgrounds, Navy (#1E3A8A) on light backgrounds

