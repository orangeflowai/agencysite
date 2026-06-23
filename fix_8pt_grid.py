import re
import os

def nearest_8pt(val):
    return round(val / 8) * 8

def replace_px(match):
    full_match = match.group(0)
    prefix = match.group(1)
    value_str = match.group(2)
    suffix = match.group(3)
    
    try:
        val = int(value_str)
        if val % 8 == 0:
            return full_match
        new_val = nearest_8pt(val)
        # Use 4pt if closer and small
        if abs(val - round(val / 4) * 4) < abs(val - new_val) and val < 16:
            new_val = round(val / 4) * 4
        
        # Avoid w-[0px] or h-[0px] if original was not 0
        if new_val == 0 and val > 0:
            new_val = 4 if val < 6 else 8
            
        return f"{prefix}[{new_val}px]{suffix}"
    except ValueError:
        return full_match

pattern = re.compile(r'([a-z]+-)\[([0-9]+)px\]([ "])')

directories = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "ticketsinrome-live/rome-tour-tickets/src",
    "romanvaticantour/src",
    "romewander/src"
]

for base_dir in directories:
    if not os.path.exists(base_dir):
        print(f"Skipping {base_dir} (not found)")
        continue
    
    print(f"Scanning {base_dir}...")
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()
                
                new_content = pattern.sub(replace_px, content)
                
                if new_content != content:
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    print(f"  Updated {file_path}")

