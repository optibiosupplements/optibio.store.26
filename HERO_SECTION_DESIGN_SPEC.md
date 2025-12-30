# OptiBio Hero Section Design Specification
**Version 1.0** | **Date: December 30, 2025**

This document provides complete specifications for recreating the OptiBio homepage hero section with pixel-perfect accuracy.

---

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography System](#typography-system)
3. [Layout Structure](#layout-structure)
4. [Component Specifications](#component-specifications)
5. [Button Design System](#button-design-system)
6. [Badge & Icon Specifications](#badge--icon-specifications)
7. [Spacing & Grid System](#spacing--grid-system)
8. [Effects & Animations](#effects--animations)

---

## Color Palette

### Primary Colors
```css
--hero-background: #D4E4F7;        /* Soft powder blue background */
--navy-primary: #1E3A5F;           /* Deep navy (brand primary) */
--navy-dark: #2C4A6B;              /* Darker navy variant */
--navy-darker: #1A2F4D;            /* Darkest navy for text */
```

### Accent Colors
```css
--gold-primary: #C9A961;           /* Antique gold (brand accent) */
--gold-light: #D4B76E;             /* Light gold variant */
--gold-badge: #C8A85E;             /* Gold for badges */
```

### Neutral Colors
```css
--white: #FFFFFF;                  /* Pure white */
--cream: #F7F4EF;                  /* Warm ivory (brand neutral) */
--cream-light: #FEF9F3;            /* Lighter cream */
--beige-light: #FFF5E8;            /* Very light beige */
```

### Status & Accent Colors
```css
--blue-primary: #2563EB;           /* Bright blue (CTA button) */
--blue-hover: #1D4ED8;             /* Blue hover state */
--red-accent: #DC2626;             /* Red for "Save 46%" badge */
--green-success: #16A34A;          /* Green for checkmarks */
--green-light: #F0FDF4;            /* Light green background */
```

### Text Colors
```css
--text-primary: #1A2F4D;           /* Primary text (navy-darker) */
--text-secondary: #4B5563;         /* Secondary text (gray) */
--text-muted: #6B7280;             /* Muted text */
--text-light: #9CA3AF;             /* Light text */
```

---

## Typography System

### Font Families
```css
--font-heading: 'Sora', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Font Sizes & Weights

#### Headline: "Feel Like Yourself Again"
```css
font-family: 'Sora', sans-serif;
font-size: 64px;
font-weight: 700;
line-height: 1.1;
letter-spacing: -0.02em;
color: #1A2F4D;
```

#### Badge: "Science-Backed • Third-Party Tested"
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
line-height: 1.4;
letter-spacing: 0.01em;
color: #FFFFFF;
```

#### Body Copy (Subheadline)
```css
font-family: 'Inter', sans-serif;
font-size: 18px;
font-weight: 400;
line-height: 1.6;
letter-spacing: 0;
color: #1A2F4D;
```

#### Certification Labels
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
line-height: 1.4;
color: #1A2F4D;
```

#### Certification Subtext
```css
font-family: 'Inter', sans-serif;
font-size: 12px;
font-weight: 400;
line-height: 1.4;
color: #6B7280;
```

#### Price Display
```css
/* Current Price */
font-family: 'Sora', sans-serif;
font-size: 56px;
font-weight: 700;
line-height: 1;
color: #1A2F4D;

/* Original Price (Strikethrough) */
font-family: 'Inter', sans-serif;
font-size: 24px;
font-weight: 500;
line-height: 1;
color: #9CA3AF;
text-decoration: line-through;
```

#### Countdown Timer
```css
/* Numbers */
font-family: 'Sora', sans-serif;
font-size: 32px;
font-weight: 700;
line-height: 1;
color: #7C2D12; /* Dark brown/red */

/* Labels (DAYS, HRS, MIN) */
font-family: 'Inter', sans-serif;
font-size: 10px;
font-weight: 600;
line-height: 1;
letter-spacing: 0.05em;
color: #7C2D12;
text-transform: uppercase;
```

---

## Layout Structure

### Hero Section Container
```css
width: 100%;
max-width: 1440px;
margin: 0 auto;
padding: 80px 64px;
background: linear-gradient(180deg, #D4E4F7 0%, #E8F1FA 100%);
```

### Two-Column Grid
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 80px;
align-items: center;
```

#### Left Column (Content)
```css
max-width: 560px;
display: flex;
flex-direction: column;
gap: 32px;
```

#### Right Column (Product Image)
```css
display: flex;
justify-content: center;
align-items: center;
```

---

## Component Specifications

### 1. Top Badge: "Science-Backed • Third-Party Tested"

**Container:**
```css
display: inline-flex;
align-items: center;
gap: 8px;
padding: 10px 20px;
background: #2C4A6B;
border-radius: 24px;
box-shadow: 0 2px 8px rgba(30, 58, 95, 0.15);
```

**Icon (Shield Checkmark):**
```css
width: 16px;
height: 16px;
color: #FFFFFF;
```

**Text:**
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
color: #FFFFFF;
letter-spacing: 0.01em;
```

**Bullet Separator:**
```css
content: "•";
color: #FFFFFF;
opacity: 0.6;
```

---

### 2. Headline: "Feel Like Yourself Again"

```css
font-family: 'Sora', sans-serif;
font-size: 64px;
font-weight: 700;
line-height: 1.1;
letter-spacing: -0.02em;
color: #1A2F4D;
margin: 0;
```

---

### 3. Subheadline Copy

```css
font-family: 'Inter', sans-serif;
font-size: 18px;
font-weight: 400;
line-height: 1.6;
color: #1A2F4D;
max-width: 480px;
```

**Text Content:**
"Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply."

---

### 4. Certification Badges Row

**Container:**
```css
display: flex;
gap: 24px;
flex-wrap: wrap;
```

**Individual Badge:**
```css
display: flex;
align-items: center;
gap: 10px;
```

**Icon Container:**
```css
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
```

**Badge 1: Third-Party Tested (Gold Shield)**
```css
/* Icon */
color: #C9A961;
width: 32px;
height: 32px;

/* Text */
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
color: #1A2F4D;

/* Subtext */
font-size: 12px;
font-weight: 400;
color: #6B7280;
```

**Badge 2: GMP Certified (Gold Medal)**
```css
/* Icon */
color: #C9A961;
width: 32px;
height: 32px;

/* Text */
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
color: #1A2F4D;

/* Subtext */
font-size: 12px;
font-weight: 400;
color: #6B7280;
```

**Badge 3: Non-GMO & Organic (Orange Checkmark)**
```css
/* Icon */
color: #EA580C; /* Orange */
width: 32px;
height: 32px;

/* Text */
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
color: #1A2F4D;

/* Subtext */
font-size: 12px;
font-weight: 400;
color: #6B7280;
```

---

### 5. Price Card Container

**Outer Container:**
```css
background: #FFFFFF;
border-radius: 24px;
padding: 32px;
box-shadow: 0 8px 32px rgba(30, 58, 95, 0.12);
max-width: 400px;
```

---

### 6. Countdown Timer Component

**Container:**
```css
background: linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%);
border: 1px solid #FED7AA;
border-radius: 16px;
padding: 16px 20px;
display: flex;
align-items: center;
gap: 16px;
```

**Label Section:**
```css
display: flex;
align-items: center;
gap: 8px;
```

**Clock Icon:**
```css
width: 20px;
height: 20px;
color: #7C2D12;
```

**Label Text:**
```css
font-family: 'Inter', sans-serif;
font-size: 13px;
font-weight: 600;
color: #7C2D12;
```

**Timer Display:**
```css
display: flex;
gap: 12px;
align-items: center;
```

**Time Unit Container:**
```css
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
```

**Number:**
```css
font-family: 'Sora', sans-serif;
font-size: 32px;
font-weight: 700;
line-height: 1;
color: #7C2D12;
```

**Unit Label (DAYS, HRS, MIN):**
```css
font-family: 'Inter', sans-serif;
font-size: 10px;
font-weight: 600;
line-height: 1;
letter-spacing: 0.05em;
color: #7C2D12;
text-transform: uppercase;
```

**Separator (Colon):**
```css
font-family: 'Sora', sans-serif;
font-size: 24px;
font-weight: 700;
color: #7C2D12;
opacity: 0.5;
```

---

### 7. Price Display

**Container:**
```css
display: flex;
align-items: baseline;
gap: 12px;
margin: 20px 0;
```

**Current Price:**
```css
font-family: 'Sora', sans-serif;
font-size: 56px;
font-weight: 700;
line-height: 1;
color: #1A2F4D;
```

**Original Price:**
```css
font-family: 'Inter', sans-serif;
font-size: 24px;
font-weight: 500;
line-height: 1;
color: #9CA3AF;
text-decoration: line-through;
```

**Save Badge:**
```css
display: inline-flex;
padding: 4px 10px;
background: #DC2626;
border-radius: 6px;
font-family: 'Inter', sans-serif;
font-size: 13px;
font-weight: 700;
color: #FFFFFF;
```

---

### 8. Pre-Order Info Rows

**Container:**
```css
display: flex;
flex-direction: column;
gap: 12px;
margin: 20px 0;
```

**Info Row:**
```css
display: flex;
align-items: center;
gap: 8px;
```

**Icon:**
```css
width: 16px;
height: 16px;
color: #2563EB; /* Blue for rocket icon */
```

**Text:**
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 500;
color: #4B5563;
```

**Highlight Text:**
```css
font-weight: 600;
color: #1A2F4D;
```

**Row 1: Pre-Order Special**
- Icon: Rocket (blue)
- Text: "Pre-Order Special: Ships Jan 20-27, 2026"

**Row 2: Free Shipping**
- Icon: Truck (green)
- Text: "Free shipping on orders $75+"

---

### 9. Trust Indicators Footer

**Container:**
```css
display: flex;
align-items: center;
gap: 16px;
padding-top: 16px;
border-top: 1px solid #E5E7EB;
font-family: 'Inter', sans-serif;
font-size: 12px;
font-weight: 500;
color: #6B7280;
```

**Items:**
```css
display: flex;
align-items: center;
gap: 6px;
```

**Icon:**
```css
width: 14px;
height: 14px;
color: #16A34A; /* Green checkmark */
```

**Separator:**
```css
content: "•";
color: #D1D5DB;
```

**Text Items:**
1. "Secure checkout"
2. "Free shipping on $75+"
3. "90-day guarantee"

---

### 10. Social Proof Card (Bottom)

**Container:**
```css
background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
border: 1px solid #BBF7D0;
border-radius: 16px;
padding: 20px 24px;
display: flex;
align-items: center;
gap: 16px;
margin-top: 24px;
```

**Avatar Group:**
```css
display: flex;
margin-left: -8px; /* Overlap effect */
```

**Individual Avatar:**
```css
width: 40px;
height: 40px;
border-radius: 50%;
background: #2C4A6B; /* Navy circles */
border: 3px solid #F0FDF4;
margin-left: -8px;
```

**Content Section:**
```css
display: flex;
flex-direction: column;
gap: 4px;
```

**Star Rating:**
```css
display: flex;
gap: 2px;
```

**Star Icon:**
```css
width: 16px;
height: 16px;
color: #FBBF24; /* Gold star */
```

**Rating Text:**
```css
font-family: 'Inter', sans-serif;
font-size: 16px;
font-weight: 700;
color: #1A2F4D;
margin-left: 8px;
```

**Customer Count:**
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 500;
color: #4B5563;
```

**Sales Indicator:**
```css
display: flex;
align-items: center;
gap: 6px;
font-family: 'Inter', sans-serif;
font-size: 12px;
font-weight: 600;
color: #16A34A;
```

**Green Checkmark Icon:**
```css
width: 14px;
height: 14px;
color: #16A34A;
```

---

## Button Design System

### Button 1: Primary CTA - "Pre-Order Now - Save 46%"

**Complete Specifications:**

```css
/* Container */
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
padding: 18px 32px;
width: 100%;
max-width: 400px;

/* Background & Border */
background: #2563EB;
border: none;
border-radius: 12px;
box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);

/* Typography */
font-family: 'Inter', sans-serif;
font-size: 16px;
font-weight: 700;
letter-spacing: 0.01em;
color: #FFFFFF;
text-align: center;

/* Cursor */
cursor: pointer;

/* Transition */
transition: all 0.2s ease-in-out;
```

**Hover State:**
```css
background: #1D4ED8;
box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
transform: translateY(-2px);
```

**Active State:**
```css
background: #1E40AF;
box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
transform: translateY(0);
```

**Focus State:**
```css
outline: 3px solid rgba(37, 99, 235, 0.3);
outline-offset: 2px;
```

**Icon (Arrow Right):**
```css
width: 18px;
height: 18px;
color: #FFFFFF;
margin-left: 4px;
```

**Color Specifications:**
- **Base Background:** `#2563EB` (RGB: 37, 99, 235)
- **Hover Background:** `#1D4ED8` (RGB: 29, 78, 216)
- **Active Background:** `#1E40AF` (RGB: 30, 64, 175)
- **Text Color:** `#FFFFFF` (RGB: 255, 255, 255)
- **Shadow Base:** `rgba(37, 99, 235, 0.3)`
- **Shadow Hover:** `rgba(37, 99, 235, 0.4)`
- **Focus Outline:** `rgba(37, 99, 235, 0.3)`

**Special Effects:**
- **Glow Effect:** Box shadow with blue tint creates a subtle glow
- **Lift Effect:** Hover state moves button up 2px with increased shadow
- **Press Effect:** Active state returns to original position with reduced shadow
- **Focus Ring:** 3px outline with 2px offset for accessibility

**Border Details:**
- **Border Width:** None (0px)
- **Border Radius:** 12px (rounded corners)
- **Border Color:** N/A

**Layout Details:**
- **Full Width:** Stretches to container width (max 400px)
- **Height:** Auto (determined by padding)
- **Padding Vertical:** 18px
- **Padding Horizontal:** 32px
- **Gap Between Text & Icon:** 8px

---

### Button 2: Top Badge - "Science-Backed • Third-Party Tested"

**Complete Specifications:**

```css
/* Container */
display: inline-flex;
align-items: center;
gap: 8px;
padding: 10px 20px;

/* Background & Border */
background: #2C4A6B;
border: none;
border-radius: 24px;
box-shadow: 0 2px 8px rgba(30, 58, 95, 0.15);

/* Typography */
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
letter-spacing: 0.01em;
color: #FFFFFF;

/* Cursor */
cursor: default; /* Not clickable */
```

**Icon (Shield with Checkmark):**
```css
width: 16px;
height: 16px;
color: #FFFFFF;
```

**Bullet Separator:**
```css
content: "•";
color: #FFFFFF;
opacity: 0.6;
font-size: 14px;
```

**Color Specifications:**
- **Background:** `#2C4A6B` (RGB: 44, 74, 107) - Darker navy
- **Text Color:** `#FFFFFF` (RGB: 255, 255, 255)
- **Icon Color:** `#FFFFFF` (RGB: 255, 255, 255)
- **Bullet Color:** `#FFFFFF` with 60% opacity
- **Shadow:** `rgba(30, 58, 95, 0.15)`

**Special Effects:**
- **Subtle Shadow:** Creates slight elevation without being prominent
- **No Hover State:** Badge is informational, not interactive

**Border Details:**
- **Border Width:** None (0px)
- **Border Radius:** 24px (pill shape)
- **Border Color:** N/A

**Layout Details:**
- **Width:** Auto (fits content)
- **Height:** Auto (determined by padding)
- **Padding Vertical:** 10px
- **Padding Horizontal:** 20px
- **Gap Between Elements:** 8px

---

### Button 3: "Save 46%" Badge

**Complete Specifications:**

```css
/* Container */
display: inline-flex;
align-items: center;
justify-content: center;
padding: 4px 10px;

/* Background & Border */
background: #DC2626;
border: none;
border-radius: 6px;
box-shadow: none;

/* Typography */
font-family: 'Inter', sans-serif;
font-size: 13px;
font-weight: 700;
letter-spacing: 0.01em;
color: #FFFFFF;

/* Cursor */
cursor: default; /* Not clickable */
```

**Color Specifications:**
- **Background:** `#DC2626` (RGB: 220, 38, 38) - Bright red
- **Text Color:** `#FFFFFF` (RGB: 255, 255, 255)

**Special Effects:**
- **No Shadow:** Flat design for emphasis
- **No Hover State:** Badge is informational

**Border Details:**
- **Border Width:** None (0px)
- **Border Radius:** 6px (slightly rounded)
- **Border Color:** N/A

**Layout Details:**
- **Width:** Auto (fits content)
- **Height:** Auto (determined by padding)
- **Padding Vertical:** 4px
- **Padding Horizontal:** 10px
- **Inline Display:** Appears inline with price

---

## Spacing & Grid System

### Vertical Spacing (Top to Bottom)
```css
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 80px;
```

**Component Spacing:**
1. Top Badge → Headline: 32px
2. Headline → Subheadline: 24px
3. Subheadline → Certification Badges: 32px
4. Certification Badges → Price Card: 40px
5. Price Card Internal Padding: 32px
6. Countdown Timer → Price: 20px
7. Price → Info Rows: 20px
8. Info Rows → CTA Button: 24px
9. CTA Button → Trust Indicators: 16px
10. Trust Indicators → Social Proof: 24px

### Horizontal Spacing
- **Grid Gap:** 80px between left and right columns
- **Badge Gap:** 24px between certification badges
- **Icon-Text Gap:** 8px-10px throughout

---

## Effects & Animations

### Shadows
```css
/* Card Shadow */
box-shadow: 0 8px 32px rgba(30, 58, 95, 0.12);

/* Button Shadow */
box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);

/* Button Hover Shadow */
box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);

/* Badge Shadow */
box-shadow: 0 2px 8px rgba(30, 58, 95, 0.15);
```

### Gradients
```css
/* Hero Background */
background: linear-gradient(180deg, #D4E4F7 0%, #E8F1FA 100%);

/* Countdown Timer Background */
background: linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%);

/* Social Proof Background */
background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
```

### Transitions
```css
/* Button Transition */
transition: all 0.2s ease-in-out;

/* Hover Transform */
transform: translateY(-2px);
```

### Border Radius Scale
```css
--radius-sm: 6px;   /* Small badges */
--radius-md: 12px;  /* Buttons */
--radius-lg: 16px;  /* Cards, timers */
--radius-xl: 24px;  /* Large cards, pill badges */
--radius-full: 50%; /* Avatars */
```

---

## Product Image Specifications

### Container
```css
background: #FFFFFF;
border-radius: 24px;
padding: 48px;
box-shadow: 0 12px 48px rgba(30, 58, 95, 0.15);
max-width: 600px;
```

### Image
```css
width: 100%;
max-width: 400px;
height: auto;
object-fit: contain;
```

---

## Responsive Breakpoints

### Desktop (1440px+)
- Use full layout as specified above

### Laptop (1024px - 1439px)
```css
padding: 60px 48px;
gap: 60px;
```

### Tablet (768px - 1023px)
```css
grid-template-columns: 1fr;
padding: 48px 32px;
gap: 48px;

/* Stack product image below content */
```

### Mobile (< 768px)
```css
padding: 32px 20px;
gap: 32px;

/* Headline */
font-size: 40px;

/* Price */
font-size: 40px;

/* Countdown Numbers */
font-size: 24px;
```

---

## Implementation Checklist

### Colors
- [ ] All color variables defined in CSS
- [ ] Navy primary (#1E3A5F) used consistently
- [ ] Gold accent (#C9A961) used for certifications
- [ ] Blue CTA (#2563EB) matches specification
- [ ] Background gradient applied correctly

### Typography
- [ ] Sora font loaded for headings
- [ ] Inter font loaded for body text
- [ ] Font sizes match specifications
- [ ] Font weights correct (700 for bold, 600 for semibold, 400 for regular)
- [ ] Line heights and letter spacing applied

### Layout
- [ ] Two-column grid implemented
- [ ] Spacing between elements matches specifications
- [ ] Max-width constraints applied
- [ ] Responsive breakpoints configured

### Buttons
- [ ] Primary CTA button matches all specifications
- [ ] Hover states functional
- [ ] Focus states accessible
- [ ] Shadow effects correct
- [ ] Icon placement accurate

### Components
- [ ] Countdown timer functional and styled correctly
- [ ] Certification badges positioned properly
- [ ] Social proof card displays correctly
- [ ] Price display with strikethrough implemented
- [ ] Trust indicators footer complete

### Effects
- [ ] Shadows match specifications
- [ ] Gradients applied correctly
- [ ] Transitions smooth (0.2s ease-in-out)
- [ ] Hover effects functional
- [ ] Border radius consistent

### Accessibility
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Alt text for images
- [ ] Semantic HTML structure
- [ ] Keyboard navigation functional

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --hero-bg: #D4E4F7;
  --navy-primary: #1E3A5F;
  --navy-dark: #2C4A6B;
  --gold-primary: #C9A961;
  --blue-cta: #2563EB;
  --blue-hover: #1D4ED8;
  --red-accent: #DC2626;
  --green-success: #16A34A;
  --white: #FFFFFF;
  --cream: #F7F4EF;
  
  /* Typography */
  --font-heading: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(30, 58, 95, 0.15);
  --shadow-md: 0 4px 16px rgba(37, 99, 235, 0.3);
  --shadow-lg: 0 8px 32px rgba(30, 58, 95, 0.12);
  --shadow-xl: 0 12px 48px rgba(30, 58, 95, 0.15);
}
```

---

## Notes for Developers

1. **Color Accuracy:** Use exact hex values provided. Do not approximate or use similar colors.
2. **Font Loading:** Ensure Sora and Inter fonts are loaded via Google Fonts before rendering.
3. **Shadow Precision:** Box shadows use specific rgba values for brand consistency.
4. **Spacing System:** Use the spacing scale consistently throughout the design.
5. **Button States:** All interactive elements must have hover, active, and focus states.
6. **Accessibility:** Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
7. **Responsive Design:** Test all breakpoints to ensure layout adapts correctly.
8. **Performance:** Optimize images and use CSS transforms for animations (not position changes).

---

**End of Specification Document**
