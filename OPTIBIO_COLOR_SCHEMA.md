# OptiBio Color Schema Reference Guide

**Brand:** OptiBio® Supplements  
**Design Theme:** Midnight Sophistication + Wellness Serenity  
**Last Updated:** December 28, 2025

---

## 🌅 Background Gradients

### Sky Blue Radial Gradient (Primary Background - Updated Dec 28, 2025)
**Usage:** Homepage hero, product pages, content pages  
**Type:** Radial gradient (ellipse at center)  
**Description:** Light, airy wellness aesthetic - almost white at center

| Stop | Color Name | Hex Code | RGB | Description |
|------|------------|----------|-----|-------------|
| 0% | Cloud White | `#F8FCFE` | rgb(248, 252, 254) | Almost pure white - center |
| 40% | Sky Mist | `#EBF5FB` | rgb(235, 245, 251) | Very light sky blue |
| 100% | Powder Blue | `#D6EAF8` | rgb(214, 234, 248) | Light blue edges |

**CSS Implementation:**
```css
background: radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%);
```

---

## 🎨 Primary Brand Colors

### Deep Navy (Primary Brand Color)
**Usage:** Headers, CTAs, trust badges, navigation  
**Emotion:** Professional, trustworthy, premium, pharmaceutical-grade

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Deep Navy | `#1E3A5F` | rgb(30, 58, 95) | Primary buttons, headers |
| Dark | Navy Dark | `#152B45` | rgb(21, 43, 69) | Hover states, depth |
| OKLCH | - | `oklch(0.32 0.08 240)` | - | CSS variable format |

### Antique Gold (Secondary Brand Color)
**Usage:** Accents, highlights, premium indicators, badges  
**Emotion:** Sophisticated, valuable, premium, natural

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Antique Gold | `#C9A961` | rgb(201, 169, 97) | Badges, icons, accents |
| Dark | Gold Dark | `#B89651` | rgb(184, 150, 81) | Hover states, shadows |
| OKLCH | - | `oklch(0.72 0.08 75)` | - | CSS variable format |

### Warm Ivory (Background/Canvas)
**Usage:** Card backgrounds, sections, soft contrast  
**Emotion:** Elegant, premium, warm, inviting

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Warm Ivory | `#F7F4EF` | rgb(247, 244, 239) | Card backgrounds |
| Light | Ivory Light | `#EDE9E3` | rgb(237, 233, 227) | Subtle gradients |
| OKLCH | - | `oklch(0.97 0.01 60)` | - | CSS variable format |

---

## 🖤 Neutral Colors

### Charcoal (Text/Foreground)
**Usage:** Primary text, headlines, body copy

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Charcoal | `#2D2D2D` | rgb(45, 45, 45) | Headlines, primary text |
| OKLCH | - | `oklch(0.22 0 0)` | - | CSS variable format |

### Pure White
**Usage:** Text on dark backgrounds, card surfaces

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Pure White | `#FFFFFF` | rgb(255, 255, 255) | Light text, backgrounds |
| Soft White | Soft White | `#FAFAF9` | rgb(250, 250, 249) | Card surfaces |

---

## ✅ Semantic/UI Colors

### Success Green
**Usage:** Success messages, checkmarks, positive indicators

| Variant | Name | Hex Code | RGB | Usage |
|---------|------|----------|-----|-------|
| Standard | Success Green | `#5FA865` | rgb(95, 168, 101) | Success states |

### Muted Gray
**Usage:** Secondary text, subtle elements

| Variant | Name | Hex Code | RGB | WCAG Contrast |
|---------|------|----------|-----|---------------|
| Standard | Muted Gray | - | - | 0.42 (OKLCH) - AA compliant |
| OKLCH | - | `oklch(0.42 0 0)` | - | 4.5:1 contrast ratio |

---

## 🎭 Gradient Combinations

### Navy to Ivory (Vertical)
**Usage:** Section dividers, premium backgrounds
```css
background: linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%);
```

### Gold Shimmer (Animation)
**Usage:** Premium CTAs, special buttons
```css
background: linear-gradient(90deg, #C9A961 0%, #D4B76E 50%, #C9A961 100%);
background-size: 200% auto;
animation: gold-shimmer 3s linear infinite;
```

### Navy Gradient (Depth)
**Usage:** Buttons, badges, premium elements
```css
background: linear-gradient(135deg, #1E3A5F 0%, #152B45 100%);
```

### Ivory Gradient (Soft Sections)
**Usage:** Section backgrounds, soft contrast
```css
background: linear-gradient(135deg, #F7F4EF 0%, #EDE9E3 100%);
```

---

## 📊 Color Usage Guidelines

### Hierarchy
1. **Primary:** Deep Navy (#1E3A5F) - Main CTAs, navigation
2. **Secondary:** Antique Gold (#C9A961) - Accents, highlights
3. **Background:** Sky Blue Gradient or Warm Ivory
4. **Text:** Charcoal (#2D2D2D) on light, White (#FFFFFF) on dark

### Contrast Requirements
- **Body text:** Minimum 4.5:1 (WCAG AA)
- **Large text:** Minimum 3:1 (WCAG AA)
- **Interactive elements:** Minimum 3:1 for focus states

### Accessibility Notes
- Muted gray updated to `oklch(0.42 0 0)` for WCAG AA compliance
- All text on sky blue gradient maintains excellent contrast
- Focus rings use Deep Navy (#1E3A5F) with 3px width

---

## 🎨 Color Psychology & Brand Alignment

### Deep Navy (#1E3A5F)
- **Emotion:** Trust, professionalism, stability
- **Association:** Pharmaceutical-grade, medical, scientific
- **Use Case:** Establishes credibility and premium positioning

### Antique Gold (#C9A961)
- **Emotion:** Sophistication, value, natural wellness
- **Association:** Premium supplements, natural ingredients
- **Use Case:** Highlights quality and premium positioning

### Sky Blue Gradient (New - Dec 28, 2025)
- **Emotion:** Calm, serenity, wellness, clarity
- **Association:** Clear sky, fresh air, mental clarity
- **Use Case:** Creates airy, premium wellness atmosphere

### Warm Ivory (#F7F4EF)
- **Emotion:** Warmth, comfort, elegance
- **Association:** Natural, organic, premium paper
- **Use Case:** Softens harsh whites, adds premium feel

---

## 💾 Implementation Reference

### CSS Variables (index.css)
```css
:root {
  /* Brand Colors */
  --optibio-navy: #1E3A5F;
  --optibio-navy-dark: #152B45;
  --optibio-ivory: #F7F4EF;
  --optibio-gold: #C9A961;
  --optibio-gold-dark: #B89651;
  --optibio-charcoal: #2D2D2D;
  --optibio-white: #FFFFFF;
  --optibio-success: #5FA865;
  
  /* Sky Blue Gradient Colors */
  --sky-cloud-white: #F8FCFE;
  --sky-mist: #EBF5FB;
  --sky-powder-blue: #D6EAF8;
}
```

### Inline Gradient (React/TSX)
```tsx
<div style={{ 
  background: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)' 
}}>
  {/* Content */}
</div>
```

---

## 📱 Responsive Considerations

### Mobile
- Sky blue gradient works beautifully on small screens
- Maintain high contrast for readability
- Gold accents remain visible and premium

### Desktop
- Gradient creates depth and space
- Navy elements provide strong visual anchors
- Ivory sections break up content effectively

---

## 🔄 Version History

### v2.0 - December 28, 2025
- **Updated:** Sky blue gradient to much lighter tones
- **Changed:** Center from #E8F2F8 → #F8FCFE (almost white)
- **Changed:** Mid from #C8DFF0 → #EBF5FB (very light blue)
- **Changed:** Edge from #7A9BB5 → #D6EAF8 (powder blue)
- **Reason:** User requested brighter, lighter, more airy aesthetic

### v1.0 - December 2025
- **Initial:** Midnight Sophistication palette
- **Colors:** Navy, Gold, Ivory foundation
- **Gradient:** Darker sky blue tones

---

## 📋 Quick Reference Chart

| Color Name | Hex Code | RGB | Use Case |
|------------|----------|-----|----------|
| Cloud White | #F8FCFE | 248, 252, 254 | Gradient center |
| Sky Mist | #EBF5FB | 235, 245, 251 | Gradient mid |
| Powder Blue | #D6EAF8 | 214, 234, 248 | Gradient edge |
| Deep Navy | #1E3A5F | 30, 58, 95 | Primary brand |
| Navy Dark | #152B45 | 21, 43, 69 | Hover states |
| Antique Gold | #C9A961 | 201, 169, 97 | Accents |
| Gold Dark | #B89651 | 184, 150, 81 | Gold hover |
| Warm Ivory | #F7F4EF | 247, 244, 239 | Backgrounds |
| Ivory Light | #EDE9E3 | 237, 233, 227 | Subtle contrast |
| Charcoal | #2D2D2D | 45, 45, 45 | Text |
| Pure White | #FFFFFF | 255, 255, 255 | Light text |
| Success Green | #5FA865 | 95, 168, 101 | Success states |

---

**End of Color Schema Reference**  
For questions or updates, refer to this document as the single source of truth for OptiBio brand colors.
