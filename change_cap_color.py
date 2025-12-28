#!/usr/bin/env python3
"""
Change bottle cap color from gold to black on product images.
Preserves all other design elements.
"""

from PIL import Image
import numpy as np

def change_cap_to_black(image_path, output_path):
    """
    Change the gold cap to black by detecting gold colors and replacing with black.
    """
    # Load image
    img = Image.open(image_path)
    img_array = np.array(img)
    
    # Define gold color range in RGB
    # Gold is typically: R: 180-255, G: 140-220, B: 0-100
    lower_gold = np.array([150, 120, 0])
    upper_gold = np.array([255, 230, 120])
    
    # Create mask for gold pixels
    mask = np.all((img_array[:, :, :3] >= lower_gold) & (img_array[:, :, :3] <= upper_gold), axis=2)
    
    # Replace gold pixels with black (keeping alpha channel if present)
    img_array[mask, 0] = 30  # R - dark charcoal
    img_array[mask, 1] = 30  # G - dark charcoal
    img_array[mask, 2] = 30  # B - dark charcoal
    
    # Convert back to image
    result = Image.fromarray(img_array)
    
    # Save with high quality
    result.save(output_path, 'JPEG', quality=95)
    print(f"✅ Saved: {output_path}")

def main():
    # Process both product images
    images = [
        ('client/public/products/optibio-90cap-bottle-front.jpg', 
         'client/public/products/optibio-90cap-bottle-front-new.jpg'),
        ('client/public/products/optibio-90cap-bottle-angle.jpg', 
         'client/public/products/optibio-90cap-bottle-angle-new.jpg')
    ]
    
    for input_path, output_path in images:
        print(f"Processing: {input_path}")
        change_cap_to_black(input_path, output_path)
    
    print("\n✅ All images processed!")
    print("Review the new images before replacing the originals.")

if __name__ == "__main__":
    main()
