# 🔒 OptiBio Color System - Quick Reference

**Status:** PRODUCTION LOCKED  
**Last Updated:** December 30, 2025

---

## 🚨 CRITICAL RULES (30-Second Version)

1. **Light Mode = Default (NEVER CHANGE)**
2. **Dark Mode = Optional (User Preference)**
3. **Use CSS Variables (NOT Hex Codes)**
4. **Import from colors.ts (NOT Inline)**
5. **Test Both Modes (Light + Dark)**
6. **Get Approval Before Changes**

---

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **[COLORS_LOCKED.md](./COLORS_LOCKED.md)** | Full color system documentation | Before ANY color changes |
| **[COLOR_USAGE_GUIDE.md](./COLOR_USAGE_GUIDE.md)** | Developer usage guide | When building new components |
| **[client/src/const/colors.ts](./client/src/const/colors.ts)** | TypeScript color constants | When importing colors |
| **[client/src/index.css](./client/src/index.css)** | CSS variable definitions | When using CSS variables |

---

## 🎨 Quick Color Reference

### Primary Brand Colors
```typescript
OPTIBIO_NAVY = '#1E3A5F'  // Primary brand color
OPTIBIO_IVORY = '#F7F4EF' // Background accent
OPTIBIO_GOLD = '#C9A961'  // Premium accents
```

### Light Mode (DEFAULT)
```css
--color-background: #FFFFFF           /* Main background */
--color-text-primary: #1E3A5F         /* Headlines (Deep Navy) */
--color-text-secondary: #94A3B8       /* Body text (Sky Grey) */
--color-border: #E2E8F0               /* Borders */
```

### Dark Mode (OPTIONAL)
```css
--color-background: #0B1120           /* Abyssal Navy */
--color-text-primary: #FFFFFF         /* White */
--color-text-secondary: #94A3B8       /* Sky Grey */
--color-border: #2D4A77               /* Navy 700 */
```

---

## ✅ Quick Usage Examples

### Example 1: Using CSS Variables
```tsx
// ✅ CORRECT
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
  Content
</div>

// ❌ WRONG
<div className="bg-white text-[#1E3A5F]">
  Content
</div>
```

### Example 2: Importing Colors
```tsx
// ✅ CORRECT
import { OPTIBIO_COLORS } from '@/const/colors';
const buttonColor = OPTIBIO_COLORS.navy;

// ❌ WRONG
const buttonColor = '#1E3A5F';
```

### Example 3: Hero Gradient
```tsx
// ✅ CORRECT
import { GRADIENTS } from '@/const/colors';
<section style={{ background: GRADIENTS.heroGradient }}>

// ❌ WRONG
<section className="bg-gradient-to-r from-blue-100 to-blue-200">
```

---

## 🛠️ Implementation Checklist

When building new components:

- [ ] Import colors from `colors.ts`
- [ ] Use semantic CSS variables
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Check WCAG contrast ratios
- [ ] Document new color combinations

---

## 🚫 Common Mistakes to Avoid

### Mistake 1: Hardcoding Hex Values
```tsx
// ❌ WRONG
<div className="bg-[#FFFFFF] text-[#1E3A5F]">

// ✅ CORRECT
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
```

### Mistake 2: Using Generic Tailwind Colors
```tsx
// ❌ WRONG
<div className="bg-slate-900 text-blue-500">

// ✅ CORRECT
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
```

### Mistake 3: Changing Default Theme
```tsx
// ❌ WRONG
<ThemeProvider defaultTheme="dark">
<ThemeProvider defaultTheme="system">

// ✅ CORRECT
<ThemeProvider defaultTheme="light" switchable>
```

### Mistake 4: Skipping Dark Mode Testing
```bash
# ❌ WRONG: Only testing light mode

# ✅ CORRECT: Test both modes
1. Open dev tools
2. Toggle theme button
3. Verify colors in both modes
```

---

## 📞 Need Help?

### Quick Links:
- **Full Documentation:** [COLORS_LOCKED.md](./COLORS_LOCKED.md)
- **Usage Guide:** [COLOR_USAGE_GUIDE.md](./COLOR_USAGE_GUIDE.md)
- **TypeScript Constants:** [client/src/const/colors.ts](./client/src/const/colors.ts)
- **CSS Variables:** [client/src/index.css](./client/src/index.css)

### Before Modifying Colors:
1. Read `COLORS_LOCKED.md` completely
2. Get brand team approval
3. Test WCAG contrast ratios
4. Update documentation

---

## 🎯 Key Takeaways

1. **Light mode is the brand default** - 80%+ of users see this
2. **Dark mode is optional** - Users can manually toggle
3. **Use semantic CSS variables** - Automatic theme switching
4. **Import from colors.ts** - Centralized color management
5. **Test both modes** - Ensure great experience for all users
6. **Get approval before changes** - Maintain brand consistency

---

**For detailed information, read [COLORS_LOCKED.md](./COLORS_LOCKED.md) and [COLOR_USAGE_GUIDE.md](./COLOR_USAGE_GUIDE.md)**

---

## 🔐 Color Lock System Files

```
optibio-ecommerce/
├── COLORS_LOCKED.md              # Full color system documentation
├── COLOR_USAGE_GUIDE.md          # Developer usage guide
├── COLOR_SYSTEM_README.md        # This file (quick reference)
├── client/
│   ├── src/
│   │   ├── const/
│   │   │   └── colors.ts         # TypeScript color constants
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx  # Theme system (light mode locked)
│   │   ├── index.css             # CSS variable definitions
│   │   └── App.tsx               # Theme provider (defaultTheme="light")
```

---

**END OF QUICK REFERENCE**

**Remember:** Light mode is the default. Use CSS variables. Test both modes. Get approval before changes.
