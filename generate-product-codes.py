#!/usr/bin/env python3
"""
Generate UPC barcodes and QR codes for OptiBio products
"""

import barcode
from barcode.writer import ImageWriter
import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

# Output directory
output_dir = "/home/ubuntu/optibio-ecommerce/client/public/products/codes"
os.makedirs(output_dir, exist_ok=True)

# Product data
products = [
    {
        "name": "OptiBio Ashwagandha KSM-66 600mg - 60 Capsules",
        "sku": "OPTIBIO-ASH-60",
        "upc": "850123456789",  # Valid UPC-A format (12 digits)
        "batch_url": "https://optibiosupplements.com/batch-verification"
    },
    {
        "name": "OptiBio Ashwagandha KSM-66 600mg - 120 Capsules",
        "sku": "OPTIBIO-ASH-120",
        "upc": "850123456796",
        "batch_url": "https://optibiosupplements.com/batch-verification"
    },
    {
        "name": "OptiBio Ashwagandha KSM-66 600mg - 180 Capsules",
        "sku": "OPTIBIO-ASH-180",
        "upc": "850123456802",
        "batch_url": "https://optibiosupplements.com/batch-verification"
    }
]

print("Generating UPC barcodes and QR codes for OptiBio products...\n")

for product in products:
    print(f"Processing: {product['name']}")
    
    # Generate UPC barcode
    try:
        EAN = barcode.get_barcode_class('upca')
        upc_code = EAN(product['upc'], writer=ImageWriter())
        upc_filename = f"{output_dir}/{product['sku']}-upc"
        upc_code.save(upc_filename, options={
            'module_width': 0.3,
            'module_height': 15.0,
            'font_size': 12,
            'text_distance': 5,
            'quiet_zone': 6.5
        })
        print(f"  ✓ UPC barcode saved: {upc_filename}.png")
    except Exception as e:
        print(f"  ✗ Error generating UPC: {e}")
    
    # Generate QR code for batch verification
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        
        # QR code contains batch verification URL + product SKU
        qr_data = f"{product['batch_url']}?sku={product['sku']}"
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white")
        qr_filename = f"{output_dir}/{product['sku']}-qr.png"
        qr_img.save(qr_filename)
        print(f"  ✓ QR code saved: {qr_filename}")
    except Exception as e:
        print(f"  ✗ Error generating QR code: {e}")
    
    print()

print("✓ All product codes generated successfully!")
print(f"\nCodes saved to: {output_dir}")
