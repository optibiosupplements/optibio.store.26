#!/usr/bin/env python3
"""
Replace logo on product bottle images with correct branding.
Only modifies the logo area, preserves all other elements.
"""

from PIL import Image
import os

# Paths
logo_path = "/home/ubuntu/upload/updatedlogo.png"
bottle_front_path = "/home/ubuntu/optibio-ecommerce/client/public/products/optibio-90cap-bottle-front.jpg"
bottle_angle_path = "/home/ubuntu/optibio-ecommerce/client/public/products/optibio-90cap-bottle-angle.jpg"

output_front_path = "/home/ubuntu/optibio-ecommerce/client/public/products/optibio-90cap-bottle-front-new.jpg"
output_angle_path = "/home/ubuntu/optibio-ecommerce/client/public/products/optibio-90cap-bottle-angle-new.jpg"

def replace_logo_on_bottle(bottle_path, logo_path, output_path, logo_position, logo_size):
    """
    Replace logo on bottle image.
    
    Args:
        bottle_path: Path to original bottle image
        logo_path: Path to correct logo image
        output_path: Path to save updated image
        logo_position: (x, y) tuple for top-left corner of logo
        logo_size: (width, height) tuple for logo dimensions
    """
    # Load images
    bottle = Image.open(bottle_path).convert("RGB")
    logo = Image.open(logo_path).convert("RGBA")
    
    # Resize logo to fit
    logo_resized = logo.resize(logo_size, Image.Resampling.LANCZOS)
    
    # Create a copy of the bottle image
    result = bottle.copy()
    
    # Paste logo with alpha channel for transparency
    # Convert bottle to RGBA temporarily for pasting
    result_rgba = result.convert("RGBA")
    result_rgba.paste(logo_resized, logo_position, logo_resized)
    result = result_rgba.convert("RGB")
    
    # Save result
    result.save(output_path, "JPEG", quality=95)
    print(f"✅ Saved: {output_path}")
    return output_path

# Process front bottle image
# Logo is centered horizontally, approximately 1/3 from top
# Bottle image is 1024x1536 pixels (estimated)
print("Processing front bottle image...")
front_img = Image.open(bottle_front_path)
width, height = front_img.size
print(f"Front bottle dimensions: {width}x{height}")

# Logo should be about 300px wide, positioned near top center
logo_width = 300
logo_height = 150  # Approximate aspect ratio
logo_x = (width - logo_width) // 2  # Center horizontally
logo_y = int(height * 0.22)  # About 22% from top

replace_logo_on_bottle(
    bottle_front_path,
    logo_path,
    output_front_path,
    (logo_x, logo_y),
    (logo_width, logo_height)
)

# Process angled bottle image
print("\nProcessing angled bottle image...")
angle_img = Image.open(bottle_angle_path)
width_angle, height_angle = angle_img.size
print(f"Angled bottle dimensions: {width_angle}x{height_angle}")

# Logo positioning for angled view (slightly offset)
logo_width_angle = 280
logo_height_angle = 140
logo_x_angle = int(width_angle * 0.42)  # Slightly left of center due to angle
logo_y_angle = int(height_angle * 0.20)  # About 20% from top

replace_logo_on_bottle(
    bottle_angle_path,
    logo_path,
    output_angle_path,
    (logo_x_angle, logo_y_angle),
    (logo_width_angle, logo_height_angle)
)

print("\n✅ Logo replacement complete!")
print(f"Front bottle: {output_front_path}")
print(f"Angled bottle: {output_angle_path}")
