# Working with Gemini AI - OptiBio Repository Guide

## Problem
- **Full repository size**: 685MB (after cleanup, was 1.3GB)
- **Gemini AI limit**: 100MB
- **Solution**: Selective export strategy that preserves all source code while excluding large assets

---

## Quick Start

### Option 1: Automated Export (Recommended)
```bash
# Run the export script
./export-for-gemini.sh

# This creates:
# - optibio-gemini-export/ folder (<100MB)
# - optibio-for-gemini-[timestamp].zip archive
```

### Option 2: Manual GitHub Clone with Sparse Checkout
```bash
# Clone only specific directories
git clone --filter=blob:none --sparse https://github.com/optibiosupplements/optibio.store.26.git
cd optibio.store.26
git sparse-checkout set client/src server drizzle shared docs
```

---

## What's Included in Gemini Export

### ✅ Source Code (Full Access)
- `client/src/` - React frontend components
- `server/` - Express + tRPC backend
- `drizzle/` - Database schema and migrations
- `shared/` - Shared types and constants

### ✅ Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Design system tokens
- `vite.config.ts` - Build configuration
- `.env.example` - Environment template

### ✅ Essential Documentation
- `todo.md` - Current feature tracking
- `README.md` - Project overview
- `docs/` - Technical documentation
- Key strategy files (brand guidelines, launch strategy, etc.)

### ✅ Minimal Branding Assets
- Logo files (favicon, header logo)
- Essential brand assets only

### ❌ Excluded (Available in Full Repo)
- `dist/` - Build outputs (291MB) - regenerable
- `client/public/products/*.png` - Product images (558MB total)
- `client/public/products/*.jpg` - Product photos
- `marketing-assets/` - Marketing creative (26MB)
- `node_modules/` - Dependencies (install with `pnpm install`)
- Old documentation files (100+ audit/status reports)

---

## Repository Size Breakdown

### Before Cleanup (1.3GB)
- `dist/` (build output): 291MB
- `client/` (including images): 276MB
- `marketing-assets/`: 26MB
- Old documentation: ~100MB
- Source code: ~20MB

### After Cleanup (685MB)
- `client/` (including images): 276MB
- `marketing-assets/`: 26MB
- Source code: ~20MB
- Essential docs: ~10MB
- **Removed**: 291MB dist/ + 100MB old docs = 391MB saved

### Gemini Export (<100MB)
- Source code: ~20MB
- Essential docs: ~10MB
- Configuration: ~2MB
- Minimal branding: ~5MB
- **Total**: ~37MB ✅

---

## Workflow: Using Gemini with OptiBio

### Step 1: Create Export
```bash
cd /path/to/optibio-ecommerce
./export-for-gemini.sh
```

**Output:**
- `optibio-gemini-export/` folder
- `optibio-for-gemini-[timestamp].zip` archive (~37MB)

### Step 2: Upload to Gemini
1. Open Gemini Code Assist
2. Upload `optibio-for-gemini-[timestamp].zip`
3. Gemini now has full access to:
   - All source code
   - Database schema
   - Configuration files
   - Documentation

### Step 3: Work with Gemini
Gemini can now help you with:
- **Code reviews** - Analyze React components, backend logic
- **Bug fixes** - Debug TypeScript errors, logic issues
- **Feature development** - Generate new components, API endpoints
- **Refactoring** - Improve code structure, performance
- **Documentation** - Explain complex code, write docs

### Step 4: Apply Changes Back to Full Repo
```bash
# After Gemini suggests changes, apply them to your full repo
cd /path/to/optibio-ecommerce

# Make the changes Gemini suggested
# Test locally
pnpm dev

# Commit and push
git add .
git commit -m "Applied Gemini suggestions: [description]"
git push
```

---

## What Gemini CAN Do (with Export)

✅ **Code Analysis**
- Review React components (`client/src/pages/*.tsx`)
- Analyze backend logic (`server/routers.ts`)
- Check database schema (`drizzle/schema.ts`)
- Review TypeScript types and interfaces

✅ **Feature Development**
- Generate new React components
- Create tRPC procedures
- Design database migrations
- Write utility functions

✅ **Bug Fixes**
- Debug TypeScript errors
- Fix logic issues
- Resolve type mismatches
- Optimize performance

✅ **Documentation**
- Explain code architecture
- Write API documentation
- Create setup guides
- Generate code comments

---

## What Gemini CANNOT Do (Missing from Export)

❌ **Visual/Design Work**
- Cannot see product images (not in export)
- Cannot analyze marketing creative
- Cannot review UI screenshots
- **Solution**: Describe visually or share screenshots separately

❌ **Build Output Analysis**
- Cannot analyze `dist/` folder (not in export)
- **Solution**: Run builds locally, share error logs

❌ **Large Asset Management**
- Cannot optimize product images
- Cannot compress marketing assets
- **Solution**: Use image optimization tools separately

---

## Common Gemini Use Cases

### 1. Code Review
**Upload:** `optibio-for-gemini.zip`
**Ask:**
> "Review the checkout flow in `client/src/pages/Checkout.tsx` and suggest improvements for conversion rate optimization."

### 2. Bug Fixing
**Upload:** `optibio-for-gemini.zip`
**Ask:**
> "I'm getting a TypeScript error in `server/routers.ts` line 145. Here's the error: [paste error]. How do I fix it?"

### 3. Feature Development
**Upload:** `optibio-for-gemini.zip`
**Ask:**
> "I need to add a subscription feature. Review the current database schema in `drizzle/schema.ts` and suggest the tables and fields I need to add."

### 4. Performance Optimization
**Upload:** `optibio-for-gemini.zip`
**Ask:**
> "Analyze the product listing page (`client/src/pages/Shop.tsx`) and suggest performance optimizations to improve load time."

### 5. Documentation
**Upload:** `optibio-for-gemini.zip`
**Ask:**
> "Generate API documentation for all tRPC procedures in `server/routers.ts`."

---

## Keeping Export Up-to-Date

### When to Regenerate Export
- After major code changes
- Before starting new features
- After refactoring
- Weekly (if actively developing)

### How to Update
```bash
# 1. Pull latest changes from GitHub
cd /path/to/optibio-ecommerce
git pull

# 2. Regenerate export
./export-for-gemini.sh

# 3. Upload new zip to Gemini
# File: optibio-for-gemini-[new-timestamp].zip
```

---

## Alternative: Direct GitHub Integration

Some AI tools support direct GitHub integration. If Gemini adds this feature:

### Setup
1. Connect Gemini to GitHub account
2. Grant access to `optibiosupplements/optibio.store.26`
3. Gemini clones repo with sparse checkout (source code only)

### Benefits
- Always up-to-date (no manual export)
- Automatic sync with GitHub
- Can suggest PRs directly

**Note:** As of now, use the export method above.

---

## Troubleshooting

### Export is Still Over 100MB
**Problem:** Export zip is >100MB
**Solution:**
1. Check `.geminiignore` - ensure all large assets excluded
2. Remove additional old docs if needed
3. Run cleanup script again: `./cleanup-old-files.sh`

### Missing Files in Export
**Problem:** Gemini says it can't find a file
**Solution:**
1. Check if file is in `.geminiignore`
2. If needed, remove from `.geminiignore` and regenerate
3. Or describe the file content to Gemini

### Export Script Fails
**Problem:** `./export-for-gemini.sh` errors
**Solution:**
1. Ensure `.geminiignore` exists
2. Check file permissions: `chmod +x export-for-gemini.sh`
3. Run with verbose output: `bash -x export-for-gemini.sh`

---

## Files Reference

### Created Files
- `.geminiignore` - Exclusion rules for export
- `export-for-gemini.sh` - Automated export script
- `cleanup-old-files.sh` - Remove old/redundant files
- `GEMINI_WORKFLOW_GUIDE.md` - This guide

### Key Directories
- `optibio-gemini-export/` - Temporary export folder (gitignored)
- `optibio-for-gemini-*.zip` - Export archives (gitignored)

---

## Summary

**Problem Solved:**
- ✅ Reduced repo from 1.3GB → 685MB (cleanup)
- ✅ Created <100MB export for Gemini (37MB)
- ✅ Preserved all source code and essential docs
- ✅ Automated export process with script

**Workflow:**
1. Run `./export-for-gemini.sh`
2. Upload zip to Gemini
3. Work with Gemini on code/features
4. Apply changes back to full repo
5. Regenerate export when needed

**Result:**
- Full Gemini AI access to codebase
- No loss of functionality
- Easy to keep up-to-date
- Automated and repeatable

---

## Questions?

- **Full repo**: https://github.com/optibiosupplements/optibio.store.26
- **Export size**: ~37MB (well under 100MB limit)
- **Update frequency**: Regenerate weekly or after major changes
- **What's missing**: Only large assets (images, builds) - all code included
