#!/bin/bash

# Export OptiBio Repository for Gemini AI (under 100MB)
# This script creates a lightweight version of the repository for Gemini Code Assist

set -e

EXPORT_DIR="optibio-gemini-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="optibio-for-gemini-${TIMESTAMP}.zip"

echo "🚀 Creating Gemini-compatible repository export..."
echo "Target: Under 100MB (current repo: 328MB)"
echo ""

# Create clean export directory
rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

# Copy essential source code
echo "📦 Copying source code..."

# Create exclusion list for tar
EXCLUDE_OPTS=""
while IFS= read -r line; do
  # Skip comments and empty lines
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue
  # Skip negation patterns (!) - tar doesn't support them the same way
  [[ "$line" =~ ^!.*$ ]] && continue
  EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude=$line"
done < .geminiignore

# Use tar to copy with exclusions
tar cf - $EXCLUDE_OPTS \
  --exclude='.git' \
  --exclude="$EXPORT_DIR" \
  --exclude='*.zip' \
  --exclude='export-for-gemini.sh' \
  . | (cd "$EXPORT_DIR" && tar xf -)

# Create a README explaining the export
cat > "$EXPORT_DIR/GEMINI_EXPORT_README.md" << 'EOF'
# OptiBio Repository - Gemini AI Export

This is a **lightweight export** of the OptiBio e-commerce repository, optimized for Gemini AI (under 100MB).

## What's Included
- ✅ All source code (client, server, database schema)
- ✅ Configuration files (package.json, tsconfig, tailwind)
- ✅ Documentation and strategy files
- ✅ Essential branding assets (logo, favicon)

## What's Excluded
- ❌ Product images (558MB) - stored in production S3
- ❌ Build outputs (dist/) - can be regenerated
- ❌ node_modules/ - install with `pnpm install`
- ❌ Marketing assets (26MB) - available in full repo

## Full Repository
The complete repository with all assets is available at:
- GitHub: [Your GitHub URL]
- Full size: 328MB (includes all product images and marketing materials)

## Working with This Export

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment
Copy `.env.example` to `.env` and configure:
- Database credentials
- Stripe keys
- OAuth settings

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Access Product Images
Product images are served from S3 in production. For local development:
- Use placeholder images, OR
- Download full repo from GitHub, OR
- Pull images from production S3

## Key Files for Gemini

### Source Code
- `client/src/` - React frontend
- `server/` - Express + tRPC backend
- `drizzle/schema.ts` - Database schema

### Configuration
- `package.json` - Dependencies
- `tailwind.config.ts` - Design system
- `tsconfig.json` - TypeScript config

### Documentation
- `todo.md` - Feature tracking
- `docs/` - Technical documentation
- `*.md` files - Strategy and planning

## Questions?
This export is designed for AI code assistance. For full development, clone the complete repository.
EOF

# Create a manifest of excluded files
echo "📋 Creating exclusion manifest..."
cat > "$EXPORT_DIR/EXCLUDED_FILES.txt" << 'EOF'
# Files Excluded from Gemini Export (to stay under 100MB)

## Large Image Assets (~558MB)
- client/public/products/*.png (product photos)
- client/public/products/*.jpg (product photos)
- client/public/*.png (hero images)
- client/public/*.jpg (lifestyle photos)
- marketing-assets/*.jpg (ad creative)

## Build Outputs (~291MB)
- dist/ (production build - can be regenerated)

## Dependencies
- node_modules/ (install with pnpm install)
- pnpm-lock.yaml (large lockfile)

## Total Excluded: ~850MB
## Export Size: <100MB (source code only)

Note: All excluded files are either:
1. Regenerable (build outputs, node_modules)
2. Available in production (S3 images)
3. Available in full GitHub repository
EOF

# Calculate size
EXPORT_SIZE=$(du -sh "$EXPORT_DIR" | cut -f1)
echo ""
echo "✅ Export created: $EXPORT_DIR/"
echo "📊 Size: $EXPORT_SIZE"
echo ""

# Create zip archive
echo "🗜️  Creating zip archive..."
zip -r "$ARCHIVE_NAME" "$EXPORT_DIR" -q
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_NAME" | cut -f1)

echo "✅ Archive created: $ARCHIVE_NAME"
echo "📊 Archive size: $ARCHIVE_SIZE"
echo ""

# Verify size is under 100MB
ARCHIVE_SIZE_MB=$(du -m "$ARCHIVE_NAME" | cut -f1)
if [ "$ARCHIVE_SIZE_MB" -lt 100 ]; then
  echo "✅ SUCCESS! Archive is under 100MB and ready for Gemini"
else
  echo "⚠️  WARNING: Archive is ${ARCHIVE_SIZE_MB}MB (over 100MB limit)"
  echo "   You may need to exclude additional files in .geminiignore"
fi

echo ""
echo "📤 Next steps:"
echo "1. Upload $ARCHIVE_NAME to Gemini AI"
echo "2. Or share the $EXPORT_DIR/ folder"
echo "3. Gemini will have full access to source code without large assets"
