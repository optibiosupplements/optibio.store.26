#!/usr/bin/env python3
"""
Export OptiBio Repository for Gemini AI (under 100MB)
Creates a lightweight version excluding large assets
"""

import os
import shutil
import zipfile
from datetime import datetime
from pathlib import Path

EXPORT_DIR = "optibio-gemini-export"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
ARCHIVE_NAME = f"optibio-for-gemini-{TIMESTAMP}.zip"

# Files and directories to exclude
EXCLUDE_PATTERNS = [
    '.git',
    'node_modules',
    'dist',
    'build',
    '*.zip',
    'optibio-gemini-export',
    'export-for-gemini.sh',
    'export-for-gemini.py',
    'cleanup-old-files.sh',
    'todo.md.backup',
    # Large images
    'client/public/products/*.png',
    'client/public/products/*.jpg',
    'client/public/*.png',
    'client/public/*.jpg',
    'marketing-assets/*.jpg',
    'marketing-assets/*.png',
    # Keep only essential branding
    '!client/public/logo*.png',
    '!client/public/favicon*.png',
]

def should_exclude(path, base_path):
    """Check if path should be excluded based on patterns"""
    rel_path = os.path.relpath(path, base_path)
    
    # Exclude patterns
    excludes = [
        '.git',
        'node_modules',
        'dist',
        'build',
        'optibio-gemini-export',
        'todo.md.backup',
    ]
    
    for exclude in excludes:
        if exclude in rel_path:
            return True
    
    # Exclude large image directories
    if 'client/public/products' in rel_path and (path.endswith('.png') or path.endswith('.jpg')):
        return True
    
    if 'marketing-assets' in rel_path and (path.endswith('.jpg') or path.endswith('.png')):
        return True
    
    # Exclude large images in client/public root (except logo/favicon)
    if rel_path.startswith('client/public/') and '/' not in rel_path[14:]:
        if path.endswith(('.png', '.jpg')) and 'logo' not in path.lower() and 'favicon' not in path.lower():
            return True
    
    # Exclude zip files
    if path.endswith('.zip'):
        return True
    
    # Exclude scripts
    if path.endswith(('export-for-gemini.sh', 'export-for-gemini.py', 'cleanup-old-files.sh')):
        return True
    
    return False

def copy_tree(src, dst, base_path):
    """Recursively copy directory tree with exclusions"""
    os.makedirs(dst, exist_ok=True)
    
    for item in os.listdir(src):
        src_path = os.path.join(src, item)
        dst_path = os.path.join(dst, item)
        
        if should_exclude(src_path, base_path):
            continue
        
        if os.path.isdir(src_path):
            copy_tree(src_path, dst_path, base_path)
        else:
            shutil.copy2(src_path, dst_path)

def get_dir_size(path):
    """Calculate directory size in MB"""
    total = 0
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if os.path.exists(filepath):
                total += os.path.getsize(filepath)
    return total / (1024 * 1024)  # Convert to MB

def main():
    print("🚀 Creating Gemini-compatible repository export...")
    print("Target: Under 100MB (current repo: 685MB)")
    print()
    
    base_path = os.getcwd()
    
    # Clean up old exports
    if os.path.exists(EXPORT_DIR):
        print(f"🧹 Removing old export directory...")
        shutil.rmtree(EXPORT_DIR)
    
    # Create export directory
    print("📦 Copying source code (excluding large assets)...")
    os.makedirs(EXPORT_DIR, exist_ok=True)
    
    # Copy files with exclusions
    copy_tree(base_path, EXPORT_DIR, base_path)
    
    # Create README
    readme_content = """# OptiBio Repository - Gemini AI Export

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
- GitHub: https://github.com/optibiosupplements/optibio.store.26
- Full size: 685MB (includes all product images and marketing materials)

## Working with This Export

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

### 3. Access Product Images
Product images are served from S3 in production. For local development, download the full repo from GitHub.

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
- `GEMINI_WORKFLOW_GUIDE.md` - How to use this export
- `docs/` - Technical documentation
"""
    
    with open(os.path.join(EXPORT_DIR, 'GEMINI_EXPORT_README.md'), 'w') as f:
        f.write(readme_content)
    
    # Calculate export size
    export_size_mb = get_dir_size(EXPORT_DIR)
    print(f"✅ Export created: {EXPORT_DIR}/")
    print(f"📊 Size: {export_size_mb:.1f}MB")
    print()
    
    # Create zip archive
    print("🗜️  Creating zip archive...")
    with zipfile.ZipFile(ARCHIVE_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(EXPORT_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, EXPORT_DIR)
                zipf.write(file_path, arcname)
    
    archive_size_mb = os.path.getsize(ARCHIVE_NAME) / (1024 * 1024)
    print(f"✅ Archive created: {ARCHIVE_NAME}")
    print(f"📊 Archive size: {archive_size_mb:.1f}MB")
    print()
    
    # Verify size
    if archive_size_mb < 100:
        print("✅ SUCCESS! Archive is under 100MB and ready for Gemini")
    else:
        print(f"⚠️  WARNING: Archive is {archive_size_mb:.1f}MB (over 100MB limit)")
        print("   You may need to exclude additional files")
    
    print()
    print("📤 Next steps:")
    print(f"1. Upload {ARCHIVE_NAME} to Gemini AI")
    print(f"2. Or share the {EXPORT_DIR}/ folder")
    print("3. Gemini will have full access to source code without large assets")
    print()
    print("📖 See GEMINI_WORKFLOW_GUIDE.md for detailed usage instructions")

if __name__ == "__main__":
    main()
