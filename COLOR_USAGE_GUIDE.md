# OptiBio Color Usage Guide

**⚠️ IMPORTANT:** This guide explains how to use the locked color schema. Read this before styling any component.

---

## Quick Start

### Import Colors in Your Component

```tsx
import { OPTIBIO_COLORS, COMPONENT_COLORS, GRADIENTS } from '@/const/colors';

export default function MyComponent() {
  return (
    <div style={{ color: OPTIBIO_COLORS.navy }}>
      Navy text
    </div>
  );
}
```

### Use Tailwind Classes (Preferred)

```tsx
export default function MyComponent() {
  return (
    <div className="bg-background text-foreground">
      <h1 className="text-primary">Headline</h1>
      <button className="bg-accent text-accent-foreground">CTA</button>
    </div>
  );
}
```

---

## Color Categories

### 1. Primary Colors (Most Common)

| Color | Hex | Tailwind Class | Usage |
|-------|-----|-----------------|-------|
| Deep Navy | #1E3A5F | `text-primary` | Headlines, primary buttons, main text |
| Antique Gold | #C9A961 | `text-accent` | CTA buttons, highlights, accents |
| Warm Ivory | #F7F4EF | `bg-background` | Page background |
| White | #FFFFFF | `bg-white` | Card backgrounds |
| Charcoal | #2D2D2D | `text-foreground` | Body text, standard text |

### 2. Component-Specific Colors

#### Primary Button
```tsx
<button className="bg-primary text-primary-foreground hover:bg-opacity-90">
  Primary Action
</button>
```

#### Secondary Button (Gold)
```tsx
<button className="bg-accent text-accent-foreground hover:bg-opacity-90">
  Secondary Action
</button>
```

#### Card Container
```tsx
<div className="bg-card text-card-foreground rounded-lg shadow-premium">
  Card content
</div>
```

#### Hero Section
```tsx
<section className="bg-hero-gradient">
  <h1 className="text-primary">Hero Headline</h1>
  <p className="text-foreground">Hero subtitle</p>
</section>
```

---

## Tailwind CSS Color Mapping

The following Tailwind classes are configured to use OptiBio colors:

| Tailwind Class | OptiBio Color | Hex Code |
|---|---|---|
| `bg-background` | Warm Ivory | #F7F4EF |
| `text-foreground` | Charcoal | #2D2D2D |
| `bg-card` | White | #FFFFFF |
| `text-card-foreground` | Charcoal | #2D2D2D |
| `text-primary` | Deep Navy | #1E3A5F |
| `bg-primary` | Deep Navy | #1E3A5F |
| `text-primary-foreground` | White | #FFFFFF |
| `text-accent` | Antique Gold | #C9A961 |
| `bg-accent` | Antique Gold | #C9A961 |
| `text-accent-foreground` | Deep Navy | #1E3A5F |
| `text-muted-foreground` | Muted Gray | #4A5568 |
| `bg-muted` | Light Sky Blue | #E8F4F8 |
| `border-border` | Light Gray | #E0E0E0 |

---

## Common Patterns

### Hero Section with Gradient Background
```tsx
<section className="bg-hero-gradient py-20">
  <div className="container">
    <h1 className="text-5xl font-bold text-primary mb-4">
      Headline
    </h1>
    <p className="text-lg text-foreground mb-8">
      Subtitle with proper contrast
    </p>
    <button className="bg-accent text-accent-foreground px-8 py-3 rounded-lg">
      Call to Action
    </button>
  </div>
</section>
```

### Card with Premium Shadow
```tsx
<div className="bg-card text-card-foreground rounded-lg shadow-premium p-6">
  <h3 className="text-primary font-semibold mb-2">Card Title</h3>
  <p className="text-foreground">Card description</p>
</div>
```

### Navigation Bar
```tsx
<nav className="bg-white border-b border-border">
  <div className="container flex items-center justify-between">
    <span className="text-primary font-bold">OptiBio</span>
    <ul className="flex gap-6">
      <li><a href="#" className="text-foreground hover:text-accent">Link</a></li>
    </ul>
  </div>
</nav>
```

### Button Group
```tsx
<div className="flex gap-4">
  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg">
    Primary
  </button>
  <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg">
    Secondary
  </button>
  <button className="border border-border text-primary px-6 py-2 rounded-lg hover:bg-muted">
    Outline
  </button>
</div>
```

### Badge/Tag
```tsx
<span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
  Badge
</span>
```

---

## Gradients

### Hero Gradient (Light Mode)
```tsx
<div className="bg-hero-gradient">
  // Soft sky blue radial gradient
</div>
```

### Navy Gradient (Premium Dark Sections)
```tsx
<div style={{ background: GRADIENTS.navy }}>
  // Linear gradient from navy to darker navy
</div>
```

### Text Gradient
```tsx
<h1 style={{ backgroundImage: GRADIENTS.textPremium }} className="bg-clip-text text-transparent">
  Gradient Text
</h1>
```

---

## Shadows

### Premium Shadow (Cards, Elevated Elements)
```tsx
<div className="shadow-premium">
  // Large, soft shadow for premium feel
</div>
```

### Navy Shadow (Subtle Depth)
```tsx
<div className="shadow-navy">
  // Medium shadow with navy tint
</div>
```

### Glow Effects
```tsx
<div className="shadow-glow-navy">
  // Navy glow effect
</div>

<div className="shadow-glow-gold">
  // Gold glow effect
</div>
```

---

## Accessibility Checklist

Before using any color combination, verify:

- [ ] Text contrast is at least 4.5:1 (WCAG AA)
- [ ] Navy text on white/ivory background ✅ (8.2:1)
- [ ] Gold text on navy background ✅ (4.8:1)
- [ ] Charcoal text on white background ✅ (15.3:1)
- [ ] Don't rely on color alone to convey information
- [ ] Use focus states for interactive elements

---

## Custom Colors (Avoid!)

**DO NOT** use custom colors outside the approved palette. If you need a color not listed here:

1. **Check the approved palette first** - Is there a similar color you can use?
2. **Ask the team** - Post in the project chat before adding new colors
3. **Update this guide** - If approved, add it to the schema and this guide

---

## Common Mistakes to Avoid

### ❌ Don't: Hardcode hex values
```tsx
// BAD - Colors can drift over time
<div style={{ color: '#1e3a5f' }}>Text</div>
```

### ✅ Do: Use CSS variables or imports
```tsx
// GOOD - Centralized color management
import { OPTIBIO_COLORS } from '@/const/colors';
<div style={{ color: OPTIBIO_COLORS.navy }}>Text</div>
```

### ❌ Don't: Use arbitrary Tailwind colors
```tsx
// BAD - Creates color inconsistency
<div className="bg-blue-500 text-red-600">Text</div>
```

### ✅ Do: Use configured Tailwind classes
```tsx
// GOOD - Uses approved palette
<div className="bg-primary text-primary-foreground">Text</div>
```

### ❌ Don't: Ignore contrast requirements
```tsx
// BAD - Gold text on white has poor contrast
<div className="bg-white text-accent">Text</div>
```

### ✅ Do: Pair colors with sufficient contrast
```tsx
// GOOD - Navy text on white has excellent contrast
<div className="bg-white text-primary">Text</div>
```

---

## Questions?

If you're unsure about color usage:

1. Check `COLOR_SCHEMA_LOCKED.md` for the approved palette
2. Review this guide for common patterns
3. Look at existing components for examples
4. Ask the team before making changes

**Remember:** Colors are locked to maintain brand consistency. When in doubt, use the primary colors (Navy, Gold, Ivory).
