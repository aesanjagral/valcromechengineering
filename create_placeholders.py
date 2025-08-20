from PIL import Image, ImageDraw, ImageFont
import os

# List of required image filenames
image_names = [
    'hero-mechanical-seal.jpg',
    'single-spring-seal.jpg',
    'multi-spring-seal.jpg',
    'cartridge-seal.jpg',
    'agitator-seal.jpg',
    'bellow-seal.jpg',
    'industrial-pumps.jpg',
    'products-hero.jpg',
    'single-spring-seal-1.jpg',
    'single-spring-seal-2.jpg',
    'multi-spring-seal-1.jpg',
    'multi-spring-seal-2.jpg',
    'cartridge-seal-1.jpg',
    'cartridge-seal-2.jpg',
    'agitator-seal-1.jpg',
    'bellow-seal-1.jpg',
    'centrifugal-pump.jpg',
    'positive-displacement-pump.jpg',
    'services-hero.jpg',
    'about-hero.jpg',
    'contact-hero.jpg',
    'careers-hero.jpg',
    'catalogue-hero.jpg',
]

# Image properties
width, height = 1200, 600
bg_color = (220, 220, 220)
text = "Replace Me"
text_color = (120, 120, 120)
font_size = 64

# Ensure images directory exists
os.makedirs('images', exist_ok=True)

# Try to use a default font
try:
    font = ImageFont.truetype("arial.ttf", font_size)
except:
    font = ImageFont.load_default()

for name in image_names:
    path = os.path.join('images', name)
    if os.path.exists(path):
        continue  # Don't overwrite existing images
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    # Center the text using textbbox (Pillow 10+)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    draw.text((x, y), text, fill=text_color, font=font)
    img.save(path, quality=90)
print('Placeholder images created.') 