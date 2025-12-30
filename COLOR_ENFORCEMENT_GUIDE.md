# Color System Enforcement Guide

## 🚨 CRITICAL RULE: NO HARDCODED COLORS

**Every color change must use semantic tokens from `index.css`. Period.**

## How to Prevent Color Drift

### 1. Before Making ANY Changes

Run the color lint check:
```bash
pnpm run color:lint
```

This will catch hardcoded colors before they get committed.

### 2. Allowed Color Patterns

✅ **ALWAYS USE THESE:**
- `text-foreground` (primary text)
- `text-muted-foreground` (secondary text)
- `text-primary` (brand navy)
- `text-secondary` (brand gold)
- `bg-background` (page background)
- `bg-card` (card backgrounds)
- `bg-muted` (subtle backgrounds)
- `bg-primary` (brand navy backgrounds)
- `bg-secondary` (brand gold backgrounds)
- `border-border` (default borders)
- `bg-hero-gradient` (hero section background)
- `text-gradient-optibio` (gold gradient text)

### 3. NEVER Use These

❌ **FORBIDDEN PATTERNS:**
- `text-[#1E3A5F]` → Use `text-primary` instead
- `bg-[#F7F4EF]` → Use `bg-background` or `bg-card` instead
- `from-[#...]` → Use semantic gradient classes instead
- `text-slate-700` → Use `text-muted-foreground` instead
- `bg-blue-500` → Use `bg-primary` or `bg-secondary` instead
- ANY hex value in className
- ANY generic Tailwind color (slate, gray, blue, etc.)

### 4. Common Mistakes & Fixes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `text-[#1E3A5F]` | `text-primary` |
| `bg-[#F7F4EF]` | `bg-background` |
| `text-slate-700` | `text-muted-foreground` |
| `border-[#C9A961]` | `border-secondary` |
| `from-[#F7F4EF] to-[#EDE9E3]` | `bg-card` |
| `text-white dark:text-slate-200` | `text-foreground` |

### 5. How Semantic Tokens Work

Semantic tokens automatically adapt to light/dark mode:

```tsx
// ❌ BAD: Hardcoded colors that don't adapt
<div className="bg-[#F7F4EF] dark:bg-[#1E3A5F]">

// ✅ GOOD: Semantic token adapts automatically
<div className="bg-card">
```

The `bg-card` token resolves to:
- Light mode: `#FAFAF9` (soft white)
- Dark mode: `#15233E` (navy card)

### 6. Validation Workflow

1. **Before coding:** Check `index.css` for available tokens
2. **While coding:** Use ONLY semantic tokens
3. **Before committing:** Run `pnpm run color:lint`
4. **Fix violations:** Replace hardcoded values with semantic tokens
5. **Test both modes:** Toggle light/dark to verify

### 7. What If I Need a New Color?

**DON'T add it inline.** Instead:

1. Add the color to `index.css` as a semantic token:
```css
:root {
  --color-new-feature: oklch(0.72 0.08 75);
}
```

2. Use the new token:
```tsx
<div className="text-[var(--color-new-feature)]">
```

Or better yet, extend Tailwind config to make it a utility class.

### 8. Emergency Override

If you ABSOLUTELY MUST use a hardcoded color (e.g., third-party integration):

1. Add a comment explaining why:
```tsx
{/* Stripe requires exact brand color #1E3A5F */}
<div className="text-[#1E3A5F]">
```

2. Document it in this file
3. Run `pnpm run color:lint` and accept the violation

## Summary

**The rule is simple: If you see a hex value or generic Tailwind color in your code, you're doing it wrong.**

Use semantic tokens. Always. No exceptions.
