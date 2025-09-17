#!/usr/bin/env python3
"""
Placeholder Asset Generator for Dungeon of Numbers EDU
Creates placeholder PNG files according to Art Bible specifications
"""

from PIL import Image, ImageDraw
import os
import json

# Art Bible Color Palette
COLORS = {
    'deep_blue_gray': (44, 62, 80),
    'cool_blue': (63, 91, 110),
    'moss_green': (125, 175, 102),
    'warm_torch': (232, 193, 112),
    'magic_light': (198, 228, 242),
    'slate_dark': (34, 49, 58),
    'pale_text': (218, 228, 234),
    'hp_red': (231, 111, 81),
    'xp_teal': (42, 157, 143)
}

def create_directory(path):
    """Create directory if it doesn't exist"""
    os.makedirs(path, exist_ok=True)

def create_placeholder_sprite(width, height, color, filename, text=""):
    """Create a placeholder sprite with specified dimensions and color"""
    img = Image.new('RGBA', (width, height), color)
    draw = ImageDraw.Draw(img)
    
    if text:
        # Add text in the center
        try:
            from PIL import ImageFont
            font = ImageFont.truetype("arial.ttf", min(width, height) // 4)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    # Add border
    draw.rectangle([0, 0, width-1, height-1], outline=(255, 255, 255), width=1)
    
    img.save(filename)
    print(f"Created: {filename}")

def create_sprite_sheet(width, height, frames, color, filename, prefix):
    """Create a sprite sheet with multiple frames"""
    total_width = width * frames
    img = Image.new('RGBA', (total_width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for i in range(frames):
        x = i * width
        # Create frame with slight color variation
        frame_color = tuple(max(0, min(255, c + (i * 10))) for c in color)
        
        # Draw frame background
        draw.rectangle([x, 0, x + width - 1, height - 1], fill=frame_color)
        
        # Add frame number
        text = f"{i+1}"
        try:
            from PIL import ImageFont
            font = ImageFont.truetype("arial.ttf", min(width, height) // 6)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = x + (width - text_width) // 2
        text_y = (height - text_height) // 2
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)
        
        # Add border
        draw.rectangle([x, 0, x + width - 1, height - 1], outline=(255, 255, 255), width=1)
    
    img.save(filename)
    print(f"Created sprite sheet: {filename}")

def main():
    print("Creating placeholder assets according to Art Bible...")
    
    # Create asset directories
    create_directory("assets/sprites/chars")
    create_directory("assets/sprites/enemies")
    create_directory("assets/sprites/fx")
    create_directory("assets/tilesets")
    create_directory("assets/ui")
    
    # Character sprites (48x48 px)
    print("\nCreating character sprites...")
    create_sprite_sheet(48, 48, 24, COLORS['deep_blue_gray'], 
                       "assets/sprites/chars/lanternbearer_walk.png", "lanternbearer_walk")
    create_sprite_sheet(48, 48, 3, COLORS['cool_blue'], 
                       "assets/sprites/chars/lanternbearer_idle.png", "lanternbearer_idle")
    create_sprite_sheet(48, 48, 6, COLORS['warm_torch'], 
                       "assets/sprites/chars/lanternbearer_cast.png", "lanternbearer_cast")
    
    # Sidekick sprites (32x32 px)
    print("\nCreating sidekick sprites...")
    create_sprite_sheet(32, 32, 13, COLORS['magic_light'], 
                       "assets/sprites/fx/sidekick_idle.png", "sidekick")
    
    # Boss sprites (96x96 px)
    print("\nCreating boss sprites...")
    create_sprite_sheet(96, 96, 12, COLORS['hp_red'], 
                       "assets/sprites/enemies/times_troll.png", "times_troll")
    create_sprite_sheet(96, 96, 12, COLORS['xp_teal'], 
                       "assets/sprites/enemies/hourglass_wraith.png", "hourglass_wraith")
    create_sprite_sheet(96, 96, 12, COLORS['moss_green'], 
                       "assets/sprites/enemies/shape_mimic.png", "shape_mimic")
    
    # Tilesets (32x32 px)
    print("\nCreating tilesets...")
    create_sprite_sheet(32, 32, 8, COLORS['slate_dark'], 
                       "assets/tilesets/tal_tileset.png", "tal")
    create_sprite_sheet(32, 32, 8, COLORS['cool_blue'], 
                       "assets/tilesets/tid_tileset.png", "tid")
    create_sprite_sheet(32, 32, 8, COLORS['magic_light'], 
                       "assets/tilesets/geometri_tileset.png", "geometri")
    create_sprite_sheet(32, 32, 8, COLORS['warm_torch'], 
                       "assets/tilesets/algebra_tileset.png", "algebra")
    create_sprite_sheet(32, 32, 8, COLORS['pale_text'], 
                       "assets/tilesets/data_tileset.png", "data")
    
    # UI elements
    print("\nCreating UI elements...")
    create_sprite_sheet(200, 20, 2, COLORS['slate_dark'], 
                       "assets/ui/ui_atlas.png", "ui")
    
    print("\nAll placeholder assets created successfully!")
    print("Note: These are placeholder images. Replace with actual pixel art according to Art Bible specifications.")

if __name__ == "__main__":
    main()
