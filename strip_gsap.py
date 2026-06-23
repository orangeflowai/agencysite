import os
import re

directories = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "romanvaticantour/src",
    "romewander/src",
    "ticketsinrome-copy/ticketsinrome/src"
]

def strip_gsap(content):
    # Remove imports
    content = re.sub(r'import\s+.*?gsap.*?\n', '', content)
    
    # We can't easily regex out the whole useGSAP block, so we'll just replace `useGSAP` with `// useGSAP`
    # and `gsap.` with `// gsap.`
    content = re.sub(r'\buseGSAP\b', '/* useGSAP disabled */ useEffect', content)
    content = re.sub(r'\bgsap\.', '// gsap.', content)
    content = re.sub(r'\bScrollTrigger\.', '// ScrollTrigger.', content)
    
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
                
                new = strip_gsap(orig)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    files_updated += 1
                    
print(f"✅ Stripped GSAP from {files_updated} files.")
