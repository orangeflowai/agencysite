import os
import re

files = [
    "romewander/src/app/about/page.tsx",
    "romewander/src/app/admin/AdminLayoutClient.tsx",
    "romewander/src/app/api/book/route.ts",
    "romewander/src/app/api/contact/route.ts",
    "romewander/src/app/blog/[slug]/page.tsx",
    "romewander/src/app/blog/page.tsx",
    "romewander/src/app/contact/page.tsx",
    "romewander/src/app/search/page.tsx",
    "romewander/src/app/tour/[slug]/page.tsx",
    "romewander/src/app/globals.css",
    "romewander/src/app/page.tsx",
    "romewander/src/components/BookingWidget.tsx",
    "romewander/src/components/FloatingReviews.tsx",
    "romewander/src/components/Footer.tsx",
    "romewander/src/components/Hero.tsx",
    "romewander/src/components/Newsletter.tsx",
    "romewander/src/components/ProductRow.tsx",
    "romewander/src/components/RomeGallery.tsx",
    "romewander/src/components/SocialProof.tsx",
    "romewander/src/components/StickyRomeSection.tsx",
    "romewander/src/components/TourCard.tsx",
    "romewander/src/components/TourContent.tsx",
    "romewander/src/components/TrustBadges.tsx",
    "romewander/src/components/Marquee.tsx",
    "romewander/src/components/HighlightSection.tsx",
    "romewander/src/components/Navbar.tsx",
    "romewander/src/components/CheckoutModal.tsx",
    "romewander/src/components/ThemeProvider.tsx",
    "romewander/src/lib/email-templates.ts"
]

# Base path
base_path = "/home/abiilesh/travelwebsite/"

replacements = [
    (r'font-serif', 'font-inter'),
    (r'font-sans', 'font-inter'),
    (r'font-nav', 'font-inter'),
    (r'font-accent', 'font-inter'),
    (r'font-family:\s*[^;\'"]+', 'font-family: var(--font-inter)'),
    (r'Playfair(?:\s+Display)?', 'Inter'),
    (r'Cormorant(?:\s+Garamond)?', 'Inter'),
    (r'Josefin(?:\s+Sans)?', 'Inter'),
    (r'Great_Vibes', 'Inter'),
]

# Special handling for ThemeProvider.tsx font URL
google_fonts_pattern = r'https://fonts\.googleapis\.com/css2\?family=Playfair\+Display:wght@[0-9,;]+&family=Inter:wght@[0-9,;]+&display=swap'
google_fonts_replacement = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'

for file_path in files:
    full_path = os.path.join(base_path, file_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    new_content = content
    
    # Apply standard replacements
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)
    
    # Apply special Google Fonts replacement if in ThemeProvider.tsx
    if "ThemeProvider.tsx" in file_path:
        new_content = re.sub(google_fonts_pattern, google_fonts_replacement, new_content)

    if new_content != content:
        with open(full_path, 'w') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")
    else:
        print(f"No changes needed: {file_path}")
