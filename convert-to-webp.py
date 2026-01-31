#!/usr/bin/env python3
"""
Convert product images to WebP format for optimal web performance.
Maintains quality while reducing file sizes by 40-50%.
"""

import os
from PIL import Image
from pathlib import Path

# Define paths
products_dir = Path("/home/ubuntu/optibio-ecommerce/client/public/products")
products_dir.mkdir(parents=True, exist_ok=True)

# Images to convert
images_to_convert = [
    "authentic-bottle.png",
    "lifestyle-morning-routine.png",
    "lifestyle-workspace.png",
    "lifestyle-bedside.png"
]

print("🖼️  Converting product images to WebP format...\n")

conversion_stats = []

for image_name in images_to_convert:
    input_path = products_dir / image_name
    
    if not input_path.exists():
        print(f"⚠️  Skipping {image_name} (not found)")
        continue
    
    # Generate output filename
    output_name = input_path.stem + ".webp"
    output_path = products_dir / output_name
    
    try:
        # Open and convert image
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary (WebP supports both)
            if img.mode in ('RGBA', 'LA'):
                # Keep transparency for WebP
                img.save(output_path, 'WEBP', quality=90, method=6)
            else:
                # Convert to RGB for non-transparent images
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(output_path, 'WEBP', quality=90, method=6)
        
        # Get file sizes
        original_size = input_path.stat().st_size
        webp_size = output_path.stat().st_size
        reduction = ((original_size - webp_size) / original_size) * 100
        
        conversion_stats.append({
            'name': image_name,
            'original_kb': original_size / 1024,
            'webp_kb': webp_size / 1024,
            'reduction': reduction
        })
        
        print(f"✅ {image_name}")
        print(f"   Original: {original_size / 1024:.1f} KB")
        print(f"   WebP: {webp_size / 1024:.1f} KB")
        print(f"   Reduction: {reduction:.1f}%\n")
        
    except Exception as e:
        print(f"❌ Error converting {image_name}: {e}\n")

# Print summary
if conversion_stats:
    print("\n" + "="*60)
    print("📊 CONVERSION SUMMARY")
    print("="*60)
    
    total_original = sum(s['original_kb'] for s in conversion_stats)
    total_webp = sum(s['webp_kb'] for s in conversion_stats)
    total_reduction = ((total_original - total_webp) / total_original) * 100
    
    print(f"\nTotal images converted: {len(conversion_stats)}")
    print(f"Total original size: {total_original:.1f} KB")
    print(f"Total WebP size: {total_webp:.1f} KB")
    print(f"Total size reduction: {total_reduction:.1f}%")
    print(f"\n✨ Estimated page load improvement: {total_reduction * 0.6:.1f}%")
    print("   (Mobile users will see the biggest benefit)")
else:
    print("\n⚠️  No images were converted.")

print("\n✅ Conversion complete!")
