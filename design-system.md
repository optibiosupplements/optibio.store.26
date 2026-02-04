# OptiBio Design System
## Premium Clinical Wellness Aesthetic

**Design Philosophy:** Merge clinical credibility with luxury wellness to create a brand that feels like "if Apple made supplements" — clean, trustworthy, premium, and effortlessly modern.

---

## 1. COLOR PALETTE

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Clinical White** | #FFFFFF | Primary backgrounds, cards, clean space |
| **Sky Mist** | #F8FCFE | Hero gradient center, light backgrounds |
| **Serenity Blue** | #E8F4FC | Hero gradient mid-tone, subtle accents |
| **Clinical Blue** | #D6EAF8 | Hero gradient edges, section dividers |

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Deep Navy** | #1E3A5F | Headlines, primary text, CTAs |
| **Trust Navy** | #2563EB | Links, interactive elements, buttons |
| **Midnight** | #0F172A | Footer, dark sections |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Luminous Gold** | #C9A961 | Premium accents, badges, trust icons |
| **Warm Gold** | #D4AF37 | Highlights, star ratings |
| **Soft Gold** | #F5E6C8 | Offer card backgrounds, subtle warmth |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Success Green** | #10B981 | Checkmarks, positive indicators |
| **Alert Coral** | #E74C3C | Urgency, sale badges, countdown |
| **Neutral Gray** | #64748B | Secondary text, captions |

---

## 2. TYPOGRAPHY

### Font Stack
- **Headlines:** `'Playfair Display', Georgia, serif` — Elegant, premium, editorial
- **Body:** `'Inter', -apple-system, sans-serif` — Clean, modern, highly readable
- **Accent:** `'Sora', sans-serif` — Tech-forward for badges and labels

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Hero H1 | 56px / 3.5rem | 600 | 1.1 | -0.02em |
| Section H2 | 40px / 2.5rem | 600 | 1.2 | -0.01em |
| Card H3 | 24px / 1.5rem | 600 | 1.3 | 0 |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Caption | 14px / 0.875rem | 500 | 1.4 | 0.01em |
| Badge | 12px / 0.75rem | 600 | 1 | 0.05em |

---

## 3. SPACING SYSTEM

### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, icon gaps |
| sm | 8px | Inline elements |
| md | 16px | Component padding |
| lg | 24px | Section padding |
| xl | 32px | Card padding |
| 2xl | 48px | Section gaps |
| 3xl | 64px | Major section dividers |
| 4xl | 96px | Hero padding |

---

## 4. COMPONENT STYLES

### Hero Section
```css
/* Background: Radial gradient creating clinical spotlight effect */
background: radial-gradient(
  ellipse 80% 60% at 50% 40%,
  #FFFFFF 0%,
  #F8FCFE 25%,
  #E8F4FC 50%,
  #D6EAF8 100%
);

/* Product glow effect */
.product-glow {
  filter: drop-shadow(0 0 60px rgba(201, 169, 97, 0.4));
}

.product-glow::before {
  content: '';
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.3) 0%,
    rgba(201, 169, 97, 0.15) 40%,
    transparent 70%
  );
  z-index: -1;
}
```

### Trust Badge (Science-Backed)
```css
/* Option A: Premium Gold on Navy */
.trust-badge {
  background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
  color: #C9A961;
  font-family: 'Sora', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 100px;
  border: 1px solid rgba(201, 169, 97, 0.3);
}

/* Option B: Clinical White with Navy text */
.trust-badge-clinical {
  background: rgba(255, 255, 255, 0.95);
  color: #1E3A5F;
  border: 1px solid #D6EAF8;
  backdrop-filter: blur(10px);
}
```

### Offer Card
```css
.offer-card {
  background: linear-gradient(180deg, #FFFDF8 0%, #FFF9F0 100%);
  border: 1px solid rgba(201, 169, 97, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(201, 169, 97, 0.1);
  padding: 24px;
}

.offer-card:hover {
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(201, 169, 97, 0.2);
  transform: translateY(-2px);
}
```

### Primary CTA Button
```css
.cta-primary {
  background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  box-shadow: 
    0 4px 14px rgba(30, 58, 95, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.cta-primary:hover {
  background: linear-gradient(135deg, #2D4A6F 0%, #3D5A7F 100%);
  box-shadow: 
    0 6px 20px rgba(30, 58, 95, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}
```

### Price Display
```css
.price-current {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #1E3A5F;
  letter-spacing: -0.02em;
}

.price-original {
  font-size: 20px;
  color: #94A3B8;
  text-decoration: line-through;
}

.price-badge {
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 6px;
}
```

### Bundle Selector
```css
.bundle-option {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bundle-option:hover {
  border-color: #C9A961;
  background: #FFFDF8;
}

.bundle-option.selected {
  border-color: #C9A961;
  background: linear-gradient(180deg, #FFFDF8 0%, #FFF5E6 100%);
  box-shadow: 0 0 0 3px rgba(201, 169, 97, 0.15);
}

.bundle-best-value {
  background: linear-gradient(135deg, #C9A961 0%, #D4AF37 100%);
  color: #1E3A5F;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 100px;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}
```

### Trust Icons Row
```css
.trust-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  font-size: 14px;
}

.trust-icon svg {
  width: 20px;
  height: 20px;
  color: #C9A961;
}
```

---

## 5. VISUAL HIERARCHY RULES

### Z-Index Scale
| Layer | Z-Index | Elements |
|-------|---------|----------|
| Base | 0 | Background, sections |
| Content | 10 | Cards, images |
| Floating | 20 | Badges, tooltips |
| Sticky | 30 | Sticky header |
| Modal | 40 | Modals, overlays |
| Toast | 50 | Notifications |

### Shadow Scale
| Level | Shadow | Usage |
|-------|--------|-------|
| Subtle | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, subtle lift |
| Card | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)` | Cards, containers |
| Elevated | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)` | Hover states |
| Floating | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` | Dropdowns, modals |

---

## 6. ANIMATION PRINCIPLES

### Timing
- **Micro-interactions:** 150ms ease-out
- **State changes:** 200ms ease
- **Page transitions:** 300ms ease-in-out
- **Reveals:** 400ms ease-out

### Motion Values
```css
/* Hover lift */
transform: translateY(-2px);

/* Button press */
transform: scale(0.98);

/* Card hover */
transform: translateY(-4px);
box-shadow: /* elevated shadow */;

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 7. RESPONSIVE BREAKPOINTS

| Name | Width | Usage |
|------|-------|-------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | Two columns, adjusted spacing |
| Desktop | 1024px - 1440px | Full layout |
| Wide | > 1440px | Max-width container, centered |

### Container Widths
- **Max content width:** 1280px
- **Hero max width:** 1440px
- **Narrow content:** 720px (for reading)

---

## 8. ACCESSIBILITY

### Color Contrast
- All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Interactive elements have visible focus states
- No information conveyed by color alone

### Focus States
```css
:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## 9. DESIGN PRINCIPLES

1. **Clinical Credibility** — Use white space, clean lines, and precise typography to convey pharmaceutical-grade quality

2. **Warm Premium** — Balance clinical coldness with warm gold accents and soft gradients to feel approachable yet luxurious

3. **Trust Through Transparency** — Show certifications, studies, and guarantees prominently without cluttering

4. **Conversion Without Pressure** — Create urgency through scarcity and value, not aggressive tactics

5. **Mobile-First Luxury** — Every element must feel premium on mobile, not just desktop

---

## 10. IMPLEMENTATION CHECKLIST

### Hero Section
- [ ] Sky blue radial gradient background
- [ ] Gold text on navy trust badge
- [ ] Playfair Display headline in Deep Navy
- [ ] Product with golden glow effect
- [ ] Cream offer card with gold border accent
- [ ] Navy CTA with hover state
- [ ] Trust icons with gold accents

### Global Elements
- [ ] Sticky header with glassmorphism
- [ ] Footer with navy gradient
- [ ] Consistent card styling
- [ ] Unified button styles
- [ ] Typography scale applied
- [ ] Spacing system implemented
