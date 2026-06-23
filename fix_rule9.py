import os
import re

directories = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "romanvaticantour/src",
    "romewander/src",
    "ticketsinrome-copy/ticketsinrome/src"
]

def upgrade_images(content):
    if '<img' not in content:
        return content
        
    # Ensure next/image is imported
    if 'import Image from "next/image"' not in content and 'import Image from \'next/image\'' not in content:
        # Add import after first line (or at top)
        lines = content.split('\n')
        insert_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import'):
                insert_idx = i + 1
        lines.insert(insert_idx, 'import Image from "next/image";')
        content = '\n'.join(lines)
        
    # Convert <img ... /> or <img ... > to <Image ... fill />
    # We do a basic replacement of <img to <Image
    content = re.sub(r'<img\b', '<Image fill ', content)
    return content

files_updated = 0
for d in directories:
    if not os.path.exists(d): continue
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                fpath = os.path.join(root, file)
                with open(fpath, 'r') as f:
                    orig = f.read()
                
                new = upgrade_images(orig)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    files_updated += 1
                    
print(f"✅ Upgraded raw <img> to <Image fill> in {files_updated} files.")
