import os
import re

directories = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "romanvaticantour/src",
    "romewander/src",
    "ticketsinrome-copy/ticketsinrome/src"
]

def strip_framer_motion(content):
    # Remove imports
    content = re.sub(r'import\s+\{.*?\b(?:motion|AnimatePresence|useScroll|useTransform|Variants)\b.*?\}\s+from\s+[\'"]framer-motion[\'"];?\n?', '', content)
    
    # Replace motion.TAG with TAG
    content = re.sub(r'<motion\.([a-zA-Z0-9]+)', r'<\1', content)
    content = re.sub(r'</motion\.([a-zA-Z0-9]+)>', r'</\1>', content)
    
    # Remove AnimatePresence wrappers
    content = re.sub(r'<AnimatePresence[^>]*>', '', content)
    content = re.sub(r'</AnimatePresence>', '', content)
    
    # Remove framer-motion specific props
    # Note: Regex to remove balanced braces is hard, we'll remove common single-line props
    props_to_remove = ['initial', 'animate', 'exit', 'whileHover', 'whileTap', 'whileInView', 'transition', 'variants', 'layoutId', 'layout']
    for p in props_to_remove:
        content = re.sub(rf'\b{p}={{[^}}]+}}', '', content)
        content = re.sub(rf'\b{p}="[^"]*"', '', content)
        content = re.sub(rf'\b{p}\b(?=\s|>)', '', content) # standalone props like layout

    # Remove style={{...}} that might have framer-motion hooks if it looks like style={{ opacity: opacity }}
    # We will just leave styles alone and let React handle it, or remove framer-motion style values if they cause errors.
    
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
                
                new = strip_framer_motion(orig)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    files_updated += 1
                    
print(f"✅ Stripped framer-motion from {files_updated} files.")
