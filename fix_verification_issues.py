import os
import re

directories = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "romanvaticantour/src",
    "romewander/src",
    "ticketsinrome-copy/ticketsinrome/src"
]

def fix_content(content, fpath):
    # Fix the $1 issue
    content = content.replace('info@$1.com', 'info@romeagency.com')
    
    # Fix the nested phone issue
    content = re.sub(r'\{process\.env\.NEXT_PUBLIC_SUPPORT_PHONE\s\|\|\s"\{process\.env\.NEXT_PUBLIC_SUPPORT_PHONE\s\|\|\s"\+39 389 892 2088"\}"\}', '{process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 389 892 2088"}', content)

    # Revert <Image fill> in email templates
    if 'email-templates.ts' in fpath or 'ticketGenerator.ts' in fpath:
        content = content.replace('<Image fill ', '<img ')
        # Also remove Next.js Image import if it was added
        content = content.replace('import Image from "next/image";', '')

    return content

for d in directories:
    if not os.path.exists(d): continue
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                fpath = os.path.join(root, file)
                with open(fpath, 'r') as f:
                    orig = f.read()
                
                new = fix_content(orig, fpath)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    print(f"✅ Fixed {fpath}")

