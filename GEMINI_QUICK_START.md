# Gemini AI Quick Start Guide

## TL;DR
Your repo is **685MB**, Gemini limit is **100MB**. Solution: Export only source code (64MB).

---

## 3-Step Process

### 1. Create Export
```bash
python3 export-for-gemini.py
```

**Output:** `optibio-for-gemini-[timestamp].zip` (64MB ✅)

### 2. Upload to Gemini
- Open Gemini Code Assist
- Upload the zip file
- Done! Gemini now has full access to your source code

### 3. Work with Gemini
Ask Gemini to:
- Review code
- Fix bugs
- Add features
- Optimize performance
- Write documentation

---

## What's In the Export?

✅ **Included (64MB)**
- All source code (`client/src/`, `server/`, `drizzle/`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`todo.md`, `README.md`, `docs/`)
- Essential branding (logo, favicon)

❌ **Excluded (621MB)**
- Product images (558MB) - in S3
- Build outputs (291MB) - regenerable
- Marketing assets (26MB) - in full repo
- node_modules - install with `pnpm install`

---

## Common Tasks

### Code Review
> "Review `client/src/pages/Checkout.tsx` and suggest improvements"

### Bug Fix
> "Fix TypeScript error in `server/routers.ts` line 145: [paste error]"

### New Feature
> "Add subscription feature. Review database schema and suggest tables needed"

### Performance
> "Optimize `client/src/pages/Shop.tsx` for faster load times"

---

## Keeping Updated

```bash
# Regenerate export after major changes
python3 export-for-gemini.py

# Upload new zip to Gemini
```

---

## Files Created

- ✅ `.geminiignore` - Exclusion rules
- ✅ `export-for-gemini.py` - Export script (Python)
- ✅ `cleanup-old-files.sh` - Remove old files
- ✅ `GEMINI_WORKFLOW_GUIDE.md` - Detailed guide
- ✅ `GEMINI_QUICK_START.md` - This file

---

## Results

| Metric | Before | After |
|--------|--------|-------|
| Full repo size | 1.3GB | 685MB |
| Export size | N/A | 64MB ✅ |
| Gemini limit | 100MB | 100MB |
| Status | ❌ Too large | ✅ Ready |

---

## Questions?

See `GEMINI_WORKFLOW_GUIDE.md` for detailed instructions and troubleshooting.
