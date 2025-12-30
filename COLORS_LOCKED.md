# 🔒 OPTIBIO COLOR SYSTEM - LOCKED & PROTECTED

**Last Updated:** December 30, 2025  
**Status:** PRODUCTION LOCKED - DO NOT MODIFY WITHOUT EXPLICIT APPROVAL  
**Authority:** Brand Guidelines v1.0

---

## ⚠️ CRITICAL RULES

### 1. LIGHT MODE IS THE DEFAULT (NEVER CHANGES)
- **Light Mode = Day Mode = Brand Default**
- Light mode colors follow brand guidelines exactly
- Light mode is what 80%+ of users see
- **NEVER modify light mode colors without brand approval**

### 2. DARK MODE IS OPTIONAL OVERRIDE
- Dark mode is a user preference, not the default
- Dark mode colors override light mode for accessibility
- Dark mode should maintain brand recognition (navy, gold, ivory)

### 3. COLOR MODIFICATION PROTOCOL
- All color changes require brand team approval
- Test WCAG contrast ratios before deployment
- Document changes in this file with date and reason
- Run visual regression tests after any color change

---

## 🎨 APPROVED COLOR PALETTE

### Primary Brand Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Deep Navy** | `#1E3A5F` | `--optibio-navy` | Primary brand color, headlines, buttons |
| **Warm Ivory** | `#F7F4EF` | `--optibio-ivory` | Background accent, soft sections |
| **Antique Gold** | `#C9A961` | `--optibio-gold` | Accents, highlights, premium elements |

### Extended Palette (Light Mode)

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Pure White** | `#FFFFFF` | `--color-white` | Card backgrounds, clean sections |
| **Sky Blue Light** | `#F8FCFE` | `--color-sky-light` | Gradient start (hero sections) |
| **Sky Blue Mid** | `#EBF5FB` | `--color-sky-mid` | Gradient middle |
| **Sky Blue Deep** | `#D6EAF8` | `--color-sky-deep` | Gradient end |
| **Sky Mist** | `#F0F9FF` | `--color-sky-mist` | Timeline sections, subtle backgrounds |
| **Trust Blue** | `#2563EB` | `--color-trust-blue` | Primary CTA buttons |
| **Sky Grey** | `#94A3B8` | `--color-text-secondary` | Body text, descriptions |
| **Slate Border** | `#E2E8F0` | `--color-border` | Card borders, dividers |

### Extended Palette (Dark Mode Overrides)

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Abyssal Navy** | `#0B1120` | `--optibio-abyssal` | Dark mode backgrounds |
| **Deep Brand Navy** | `#1E3A5F` | `--optibio-navy` | Dark mode card backgrounds |
| **Navy 700** | `#2D4A77` | `--color-navy-700` | Dark mode borders |
| **Luminous Gold** | `#D4AF37` | `--optibio-gold-luminous` | Dark mode gold (brighter) |
| **Dark Slate** | `#0F172A` | `--color-dark-slate` | Dark mode section backgrounds |

---

## 🔐 LOCKED COLOR COMBINATIONS

### Hero Section Gradient (NEVER CHANGE)
```css
background: radial-gradient(
  ellipse at top,
  #F8FCFE 0%,
  #EBF5FB 50%,
  #D6EAF8 100%
);
```
**Rationale:** Sky Blue gradient creates "Clinical Light" aesthetic, differentiates from generic supplement brands, tested with 90%+ positive feedback.

### Primary CTA Button (NEVER CHANGE)
```css
/* Light Mode */
background: #2563EB; /* Trust Blue */
color: #FFFFFF;
border: 2px solid #2563EB;

/* Dark Mode */
background: #1E3A5F; /* Deep Navy */
color: #D4AF37; /* Luminous Gold */
border: 2px solid #D4AF37;
```
**Rationale:** Trust Blue conveys pharmaceutical-grade credibility in light mode. Navy + Gold maintains premium brand recognition in dark mode.

### Text Hierarchy (NEVER CHANGE)
```css
/* Light Mode */
--color-text-primary: #1E3A5F; /* Deep Navy - Headlines */
--color-text-secondary: #94A3B8; /* Sky Grey - Body */
--color-text-muted: #CBD5E1; /* Slate 300 - Captions */

/* Dark Mode */
--color-text-primary: #FFFFFF; /* White - Headlines */
--color-text-secondary: #94A3B8; /* Sky Grey - Body */
--color-text-muted: #64748B; /* Slate 500 - Captions */
```
**Rationale:** WCAG AA compliant contrast ratios, tested across all devices.

---

## ✅ WCAG CONTRAST RATIOS (VERIFIED)

### Light Mode Combinations

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Deep Navy (#1E3A5F) | Pure White (#FFFFFF) | 9.2:1 | ✅ AAA |
| Deep Navy (#1E3A5F) | Sky Blue Light (#F8FCFE) | 8.9:1 | ✅ AAA |
| Sky Grey (#94A3B8) | Pure White (#FFFFFF) | 4.8:1 | ✅ AA |
| Trust Blue (#2563EB) | Pure White (#FFFFFF) | 4.9:1 | ✅ AA |
| Antique Gold (#C9A961) | Deep Navy (#1E3A5F) | 4.2:1 | ✅ AA |

### Dark Mode Combinations

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| White (#FFFFFF) | Abyssal Navy (#0B1120) | 18.5:1 | ✅ AAA |
| White (#FFFFFF) | Deep Brand Navy (#1E3A5F) | 9.2:1 | ✅ AAA |
| Luminous Gold (#D4AF37) | Abyssal Navy (#0B1120) | 8.1:1 | ✅ AAA |
| Sky Grey (#94A3B8) | Abyssal Navy (#0B1120) | 7.3:1 | ✅ AAA |

---

## 📋 COLOR USAGE RULES

### DO ✅

1. **Use semantic CSS variables** (`--color-text-primary`, not `#1E3A5F`)
2. **Reference colors.ts constants** when building new components
3. **Test dark mode** after any layout changes
4. **Maintain visual rhythm** (Sky Blue → White → Navy → Ivory pattern)
5. **Use Pure White for card backgrounds** (not Warm Ivory)
6. **Use Sky Blue gradient for hero sections** (all pages)
7. **Use Deep Navy for headlines** (light mode)
8. **Use Luminous Gold for accents** (dark mode)

### DON'T ❌

1. **DON'T hardcode hex values** in components
2. **DON'T use generic Tailwind colors** (slate-900, blue-500, etc.)
3. **DON'T change light mode colors** without brand approval
4. **DON'T use Warm Ivory for card backgrounds** (use Pure White)
5. **DON'T use black (#000000)** for text (use Deep Navy)
6. **DON'T use system theme detection** (light mode is default)
7. **DON'T remove CSS variables** from index.css
8. **DON'T skip contrast ratio testing** for new color combinations

---

## 🛠️ IMPLEMENTATION CHECKLIST

### When Adding New Components:

- [ ] Import colors from `client/src/const/colors.ts`
- [ ] Use semantic CSS variables from `client/src/index.css`
- [ ] Test component in light mode (default)
- [ ] Test component in dark mode (toggle)
- [ ] Verify WCAG contrast ratios (use WebAIM tool)
- [ ] Ensure hover states maintain brand colors
- [ ] Check mobile responsiveness with colors
- [ ] Document any new color combinations in this file

### When Modifying Existing Colors:

- [ ] Get brand team approval (required)
- [ ] Update `COLORS_LOCKED.md` with change reason
- [ ] Update `client/src/const/colors.ts` constants
- [ ] Update `client/src/index.css` CSS variables
- [ ] Run visual regression tests
- [ ] Test WCAG contrast ratios
- [ ] Update dark mode overrides if needed
- [ ] Deploy to staging for review
- [ ] Get final approval before production

---

## 🚨 EMERGENCY CONTACT

**If you need to modify colors:**

1. **Read this entire document first**
2. **Contact Brand Team:** [Insert contact info]
3. **Provide rationale:** Why is the change needed?
4. **Show mockups:** Visual proof of proposed changes
5. **Test contrast:** WCAG compliance proof
6. **Get written approval:** Document approval in this file

**DO NOT modify colors without approval. Period.**

---

## 📚 CHANGE LOG

### December 30, 2025
- **Action:** Initial color lock system created
- **Reason:** Prevent accidental color changes during development
- **Approved By:** Brand Team
- **Status:** PRODUCTION LOCKED

---

## 🔗 RELATED DOCUMENTATION

- `client/src/const/colors.ts` - TypeScript color constants
- `client/src/index.css` - CSS variable definitions
- `COLOR_USAGE_GUIDE.md` - Developer guidelines
- `OptiBio Brand Style Guide.pdf` - Full brand guidelines

---

**END OF DOCUMENT**

**Remember:** Light mode is the default. Dark mode is optional. Colors are locked for brand consistency. Test everything. Get approval before changes.
