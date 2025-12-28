#!/usr/bin/env python3
"""
Change bottle cap color from gold to black using region-based approach.
"""

from PIL import Image, ImageDraw
import numpy as np

def change_cap_to_black_front(image_path, output_path):
    """
    Change the gold cap to black on the front view bottle.
    The cap is at the top of the bottle (approximately top 15% of image).
    """
    # Load image
    img = Image.open(image_path)
    width, height = img.size
    
    # Convert to numpy array for processing
    img_array = np.array(img)
    
    # Define cap region (top portion of the bottle)
    # For front view: cap is roughly from y=0 to y=400 (top ~15% of 2752px height)
    cap_top = 0
    cap_bottom = 450  # Adjust based on actual cap size
    
    # Process only the cap region
    for y in range(cap_top, min(cap_bottom, height)):
        for x in range(width):
            r, g, b = img_array[y, x, :3]
            
            # Detect gold/yellow colors (high R and G, low B)
            # Gold typically has: R > 150, G > 120, B < 120
            if r > 140 and g > 110 and b < 130:
                # Replace with black/dark charcoal
                img_array[y, x, 0] = 35  # R
                img_array[y, x, 1] = 35  # G
                img_array[y, x, 2] = 35  # B
    
    # Convert back to image
    result = Image.fromarray(img_array)
    
    # Save with high quality
    result.save(output_path, 'JPEG', quality=95)
    print(f"✅ Saved: {output_path}")

def change_cap_to_black_angle(image_path, output_path):
    """
    Change the gold cap to black on the angled view bottle.
    """
    # Load image
    img = Image.open(image_path)
    width, height = img.size
    
    # Convert to numpy array
    img_array = np.array(img)
    
    # For angled view: cap is also at top but slightly different region
    cap_top = 0
    cap_bottom = 500
    
    # Process cap region
    for y in range(cap_top, min(cap_bottom, height)):
        for x in range(width):
            r, g, b = img_array[y, x, :3]
            
            # Detect gold colors
            if r > 140 and g > 110 and b < 130:
                # Replace with black
                img_array[y, x, 0] = 35
                img_array[y, x, 1] = 35
                img_array[y, x, 2] = 35
    
    # Convert back to image
    result = Image.fromarray(img_array)
    
    # Save
    result.save(output_path, 'JPEG', quality=95)
    print(f"✅ Saved: {output_path}")

def main():
    print("🎨 Changing bottle cap color from gold to black...\n")
    
    # Process front view
    print("Processing front view...")
    change_cap_to_black_front(
        'client/public/products/optibio-90cap-bottle-front.jpg',
        'client/public/products/optibio-90cap-bottle-front-black.jpg'
    )
    
    # Process angled view
    print("Processing angled view...")
    change_cap_to_black_angle(
        'client/public/products/optibio-90cap-bottle-angle.jpg',
        'client/public/products/optibio-90cap-bottle-angle-black.jpg'
    )
    
    print("\n✅ All images processed!")
    print("Review the *-black.jpg files before replacing originals.")

if __name__ == "__main__":
    main()
