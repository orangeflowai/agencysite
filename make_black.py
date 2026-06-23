import os
import re

directories = [
    "goldenrometour/src/app",
    "goldenrometour/src/components"
]

def make_black(content):
    # Replace common text-gray-*, text-zinc-*, text-slate-* with text-black
    # But only if it's text-*-600 or higher (dark grays). Lighter grays can stay for subtle UI.
    content = re.sub(r'\btext-(?:gray|zinc|slate|neutral)-(?:600|700|800|900|950)\b', 'text-black', content)
    # Also replace text-[#...] with text-black if it's a dark color (simple heuristic: remove dark hex texts)
    content = re.sub(r'\btext-\[#(?:[0-4][0-9a-fA-F]){3,6}\]', 'text-black', content)
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
                
                new = make_black(orig)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    files_updated += 1
                    
print(f"✅ Enforced black text in {files_updated} files in goldenrometour.")
