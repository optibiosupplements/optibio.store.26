# 🎨 OptiBio Color Usage Guide for Developers

**Last Updated:** December 30, 2025  
**For:** Frontend Developers, Designers, Contributors  
**Status:** PRODUCTION LOCKED

---

## 📚 Quick Links

- **[COLORS_LOCKED.md](./COLORS_LOCKED.md)** - Full color system documentation
- **[client/src/const/colors.ts](./client/src/const/colors.ts)** - TypeScript color constants
- **[client/src/index.css](./client/src/index.css)** - CSS variable definitions
- **[OptiBio Brand Style Guide.pdf](./OptiBio%20Brand%20Style%20Guide.pdf)** - Brand guidelines

---

## ⚠️ CRITICAL RULES (READ FIRST)

### 1. Light Mode is the Default (NEVER CHANGES)
```tsx
// ✅ CORRECT: Light mode is always the default
<ThemeProvider defaultTheme="light" switchable>

// ❌ WRONG: Never change the default theme
<ThemeProvider defaultTheme="dark" switchable>
<ThemeProvider defaultTheme="system" switchable>
```

**Why?** Light mode is the brand default. 80%+ of users see light mode. Dark mode is optional.

### 2. Use Semantic CSS Variables (NOT Hex Codes)
```tsx
// ✅ CORRECT: Use CSS variables
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">

// ❌ WRONG: Never hardcode hex values
<div className="bg-[#FFFFFF] text-[#1E3A5F]">
```

**Why?** CSS variables automatically switch between light/dark mode. Hex codes don't.

### 3. Import Colors from colors.ts (NOT Inline)
```tsx
// ✅ CORRECT: Import from colors.ts
import { OPTIBIO_COLORS, LIGHT_THEME } from '@/const/colors';
const buttonColor = OPTIBIO_COLORS.navy;

// ❌ WRONG: Never hardcode colors
const buttonColor = '#1E3A5F';
```

**Why?** Centralized color management. Easy to update. Type-safe.

### 4. Test Both Light and Dark Mode
```bash
# ✅ CORRECT: Test both modes before committing
1. Open dev tools
2. Toggle theme button
3. Verify colors look correct in both modes
4. Check WCAG contrast ratios

# ❌ WRONG: Only testing light mode
```

**Why?** Dark mode users deserve a great experience too.

---

## 🚀 Quick Start Guide

### Step 1: Import Color Constants
```tsx
import { 
  OPTIBIO_COLORS,      // Primary brand colors
  LIGHT_THEME,         // Light mode theme
  DARK_THEME,          // Dark mode theme
  GRADIENTS,           // Approved gradients
  SHADOWS,             // Approved shadows
  COMPONENT_COLORS     // Component-specific colors
} from '@/const/colors';
```

### Step 2: Use Semantic CSS Variables
```tsx
// Background colors
className="bg-[var(--color-background)]"           // Main background
className="bg-[var(--color-card)]"                 // Card background
className="bg-[var(--color-background-accent)]"    // Accent background

// Text colors
className="text-[var(--color-text-primary)]"       // Headlines
className="text-[var(--color-text-secondary)]"     // Body text
className="text-[var(--color-text-muted)]"         // Captions

// Borders
className="border-[var(--color-border)]"           // Standard border
```

### Step 3: Use Brand Colors for Components
```tsx
// Buttons
import { COMPONENT_COLORS } from '@/const/colors';

<button
  style={{
    backgroundColor: COMPONENT_COLORS.button.primary.background,
    color: COMPONENT_COLORS.button.primary.foreground,
  }}
>
  Shop Now
</button>

// Cards
<div
  style={{
    backgroundColor: COMPONENT_COLORS.card.background,
    border: `1px solid ${COMPONENT_COLORS.card.border}`,
    boxShadow: COMPONENT_COLORS.card.shadow,
  }}
>
  Card content
</div>
```

### Step 4: Use Approved Gradients
```tsx
import { GRADIENTS } from '@/const/colors';

// Hero section gradient
<section
  style={{ background: GRADIENTS.heroGradient }}
  className="py-20"
>
  Hero content
</section>

// Navy to Gold gradient
<div
  style={{ background: GRADIENTS.navyToGold }}
  className="p-8"
>
  Premium content
</div>
```

---

## 📋 Common Use Cases

### Use Case 1: Creating a New Button Component
```tsx
import { OPTIBIO_COLORS } from '@/const/colors';
import { useTheme } from '@/contexts/ThemeContext';

function PrimaryButton({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <button
      className={`
        px-6 py-3 rounded-lg font-semibold
        transition-all duration-200
        ${theme === 'light' 
          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' 
          : 'bg-[var(--optibio-navy)] text-[var(--optibio-gold-luminous)] border-2 border-[var(--optibio-gold-luminous)]'
        }
      `}
    >
      {children}
    </button>
  );
}
```

### Use Case 2: Creating a New Card Component
```tsx
import { COMPONENT_COLORS } from '@/const/colors';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6 transition-all duration-200 hover:shadow-xl"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  );
}
```

### Use Case 3: Creating a Hero Section
```tsx
import { GRADIENTS } from '@/const/colors';

function HeroSection() {
  return (
    <section
      className="py-20 px-4"
      style={{ background: GRADIENTS.heroGradient }}
    >
      <div className="container mx-auto">
        <h1 className="text-[var(--color-text-primary)] text-5xl font-bold">
          Feel Like Yourself Again
        </h1>
        <p className="text-[var(--color-text-secondary)] text-xl mt-4">
          Premium Ashwagandha KSM-66 for stress relief
        </p>
      </div>
    </section>
  );
}
```

### Use Case 4: Adding Dark Mode Overrides
```tsx
function Section() {
  const { theme } = useTheme();
  
  return (
    <section
      className={`
        py-20 px-4
        ${theme === 'light' 
          ? 'bg-white' 
          : 'bg-[var(--optibio-abyssal)]'
        }
      `}
    >
      <h2 className="text-[var(--color-text-primary)]">
        Section Title
      </h2>
    </section>
  );
}
```

---

## 🎨 Available CSS Variables

### Background Colors
```css
--color-background          /* Main background (white/abyssal navy) */
--color-background-accent   /* Accent background (ivory/dark slate) */
--color-card                /* Card background (white/deep navy) */
```

### Text Colors
```css
--color-text-primary        /* Headlines (deep navy/white) */
--color-text-secondary      /* Body text (sky grey) */
--color-text-muted          /* Captions (slate 300/slate 500) */
```

### Brand Colors
```css
--optibio-navy              /* Deep Navy (#1E3A5F) */
--optibio-ivory             /* Warm Ivory (#F7F4EF) */
--optibio-gold              /* Antique Gold (#C9A961) */
--optibio-gold-luminous     /* Luminous Gold (#D4AF37) - dark mode only */
--optibio-abyssal           /* Abyssal Navy (#0B1120) - dark mode only */
```

### Border Colors
```css
--color-border              /* Standard border (slate 200/navy 700) */
```

---

## ✅ DO's and ❌ DON'Ts

### DO ✅

1. **Use semantic CSS variables**
   ```tsx
   <div className="bg-[var(--color-background)]">
   ```

2. **Import colors from colors.ts**
   ```tsx
   import { OPTIBIO_COLORS } from '@/const/colors';
   ```

3. **Test both light and dark mode**
   ```bash
   # Toggle theme button and verify colors
   ```

4. **Use approved gradients**
   ```tsx
   style={{ background: GRADIENTS.heroGradient }}
   ```

5. **Check WCAG contrast ratios**
   ```bash
   # Use WebAIM Contrast Checker
   # https://webaim.org/resources/contrastchecker/
   ```

6. **Document new color combinations**
   ```markdown
   # Add to COLORS_LOCKED.md if creating new combinations
   ```

### DON'T ❌

1. **Don't hardcode hex values**
   ```tsx
   // ❌ WRONG
   <div className="bg-[#FFFFFF]">
   ```

2. **Don't use generic Tailwind colors**
   ```tsx
   // ❌ WRONG
   <div className="bg-slate-900 text-blue-500">
   ```

3. **Don't change light mode colors**
   ```tsx
   // ❌ WRONG - requires brand approval
   export const OPTIBIO_COLORS = {
     navy: '#000000', // Changed from #1E3A5F
   };
   ```

4. **Don't skip contrast testing**
   ```tsx
   // ❌ WRONG - always test contrast
   <div className="bg-[#C9A961] text-[#F7F4EF]"> // Low contrast!
   ```

5. **Don't use system theme detection**
   ```tsx
   // ❌ WRONG
   <ThemeProvider defaultTheme="system">
   ```

6. **Don't remove CSS variables**
   ```css
   /* ❌ WRONG - never delete these */
   /* --color-background: ... */
   ```

---

## 🧪 Testing Checklist

Before committing color changes:

- [ ] Import colors from `colors.ts` (not hardcoded)
- [ ] Use semantic CSS variables (not hex codes)
- [ ] Test component in light mode
- [ ] Test component in dark mode
- [ ] Verify WCAG contrast ratios (use WebAIM tool)
- [ ] Check hover states in both modes
- [ ] Test on mobile (responsive design)
- [ ] Document any new color combinations in `COLORS_LOCKED.md`
- [ ] Get brand approval if modifying existing colors
- [ ] Run `npm run build` to ensure no TypeScript errors

---

## 🛠️ Troubleshooting

### Problem: Colors look wrong in dark mode
**Solution:** Use semantic CSS variables instead of hardcoded colors.
```tsx
// ❌ WRONG
<div className="bg-white text-[#1E3A5F]">

// ✅ CORRECT
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
```

### Problem: Text is invisible on background
**Solution:** Check WCAG contrast ratios and use approved color combinations.
```bash
# Use WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/

# Minimum ratios:
# - Normal text: 4.5:1 (AA)
# - Large text: 3:1 (AA)
# - Headlines: 7:1 (AAA preferred)
```

### Problem: Theme toggle doesn't work
**Solution:** Ensure `ThemeProvider` has `switchable` prop and `defaultTheme="light"`.
```tsx
// ✅ CORRECT
<ThemeProvider defaultTheme="light" switchable>
```

### Problem: Colors don't match brand guidelines
**Solution:** Use colors from `colors.ts`, not custom values.
```tsx
// ❌ WRONG
const navy = '#123456';

// ✅ CORRECT
import { OPTIBIO_COLORS } from '@/const/colors';
const navy = OPTIBIO_COLORS.navy;
```

---

## 📞 Need Help?

### Before Modifying Colors:
1. Read `COLORS_LOCKED.md` completely
2. Check if color combination already exists
3. Test WCAG contrast ratios
4. Get brand team approval (if changing existing colors)

### Resources:
- **Color System Documentation:** `COLORS_LOCKED.md`
- **TypeScript Constants:** `client/src/const/colors.ts`
- **CSS Variables:** `client/src/index.css`
- **Brand Guidelines:** `OptiBio Brand Style Guide.pdf`
- **WCAG Contrast Checker:** https://webaim.org/resources/contrastchecker/

### Emergency Contact:
If you need to modify colors without approval, **DON'T**. Contact the brand team first.

---

## 🎓 Best Practices

### 1. Centralized Color Management
All colors should be defined in `colors.ts` and referenced throughout the codebase.

### 2. Semantic Naming
Use descriptive names like `--color-text-primary` instead of `--color-navy`.

### 3. Theme-Aware Components
Components should automatically adapt to light/dark mode using CSS variables.

### 4. Accessibility First
Always test WCAG contrast ratios before deploying color changes.

### 5. Documentation
Document all new color combinations in `COLORS_LOCKED.md` with rationale.

---

## 📝 Change Request Template

If you need to modify colors, use this template:

```markdown
## Color Change Request

**Date:** [Date]
**Requested By:** [Your Name]
**Component/Page:** [Where the change is needed]

### Current Color
- Hex: [Current hex code]
- Usage: [Where it's currently used]

### Proposed Color
- Hex: [Proposed hex code]
- Rationale: [Why the change is needed]

### WCAG Compliance
- Contrast Ratio: [X.X:1]
- Status: [AA/AAA]
- Tool Used: [WebAIM Contrast Checker]

### Mockups
[Attach screenshots or Figma links]

### Approval
- [ ] Brand Team Approved
- [ ] Contrast Tested
- [ ] Documentation Updated
- [ ] Visual Regression Tests Passed
```

---

**END OF GUIDE**

**Remember:** Light mode is the default. Use semantic CSS variables. Test both modes. Get approval before changes.
