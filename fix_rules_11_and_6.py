import os
import re

# Rule 11: Checkout Redirects
checkout_content = """import { redirect } from 'next/navigation';

export default function CheckoutPage() {
    // Rule 11: All checkout flow must go through the modal, not a full page.
    redirect('/?checkout=true');
}
"""

checkout_paths = [
    "wondersofrome/wondersofrome/src/app/checkout/page.tsx",
    "goldenrometour/src/app/checkout/page.tsx",
    "romanvaticantour/src/app/checkout/page.tsx",
    "romewander/src/app/checkout/page.tsx",
    "ticketsinrome-copy/ticketsinrome/src/app/checkout/page.tsx"
]

for path in checkout_paths:
    if os.path.exists(path):
        with open(path, 'w') as f:
            f.write(checkout_content)
        print(f"✅ Redirected {path}")

# Rule 6: Hardcoded Content Removal
def replace_contact_info(content):
    # Replace common hardcoded emails
    content = re.sub(r'["\']info@(romewander|wondersofrome|goldenrometour|romanvaticantour|ticketsinrome)\.com["\']', 'process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@$1.com"', content)
    content = re.sub(r'>info@(romewander|wondersofrome|goldenrometour|romanvaticantour|ticketsinrome)\.com<', '>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@$1.com"}<', content)
    # Replace common hardcoded phones
    content = re.sub(r'\+39 389 892 2088', '{process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 389 892 2088"}', content)
    content = re.sub(r'\+39\s389\s892\s2088', '{process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 389 892 2088"}', content)
    return content

base_dirs = [
    "wondersofrome/wondersofrome/src",
    "goldenrometour/src",
    "romanvaticantour/src",
    "romewander/src",
    "ticketsinrome-copy/ticketsinrome/src"
]

files_updated = 0
for d in base_dirs:
    if not os.path.exists(d): continue
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                fpath = os.path.join(root, file)
                with open(fpath, 'r') as f:
                    orig = f.read()
                
                new = replace_contact_info(orig)
                if orig != new:
                    with open(fpath, 'w') as f:
                        f.write(new)
                    files_updated += 1

print(f"✅ Removed hardcoded contact info in {files_updated} files.")
