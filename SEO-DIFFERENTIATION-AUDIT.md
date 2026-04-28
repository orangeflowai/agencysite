# SEO Differentiation Audit Report
**Date:** April 28, 2026  
**Sites Audited:** Wonders of Rome, Golden Rome Tour, Roman Vatican Tour

---

## ✅ EXCELLENT - Already Differentiated

### 1. Title Tags
Each site has unique fallback titles in `layout.tsx`:
- **WOR:** "Wonders of Rome | Official Tours"
- **GT:** "Golden Rome Tour | Official Tours"  
- **RVT:** "Roman Vatican Tour"

**Status:** ✅ PASS

---

### 2. H1 Headings
Completely unique on all homepages:

**Wonders of Rome:**
- "THE WONDERS GUIDE APP"
- "Guest Log Archives"
- "The Roman Journal"

**Golden Rome Tour:**
- "Rome's Greatest Archives, Reopened"
- "The Eternal City Guide"
- "Best Selling Archives"

**Roman Vatican Tour:**
- "Historian-Led Archives"
- "How to Secure Your Priority Access"
- "The Vatican Collection"

**Status:** ✅ PASS

---

### 3. FAQ Content - EXCELLENT DIFFERENTIATION
Same questions, completely reworded answers:

**Example: "What is the dress code?"**

- **WOR:** "The Vatican has a strict dress code. Both men and women must cover their knees and shoulders. Sleeveless tops and shorts strictly are not permitted..."

- **GT:** "Strict modesty is enforced. Both men and women must cover knees and shoulders. Sleeveless tops, shorts, short skirts, and hats are prohibited. Security staff may deny entry with no refund."

- **RVT:** "The Vatican asks visitors to dress modestly — please cover your knees and shoulders. Sleeveless tops and shorts aren't allowed, and you may be turned away at the door."

**Status:** ✅ PASS - Perfect example of SEO-safe content differentiation

---

### 4. First 100 Words
Completely different hero sections and opening content across all sites.

**Status:** ✅ PASS

---

### 5. "Why Us" Sections - Unique Value Props

**Wonders of Rome:**
- "PROPRIETARY AUGMENTED REALITY ENGINE"
- "REAL-TIME DATA OVERLAYS"
- "HIGH-FIDELITY AUDIO ARCHIVES"

**Golden Rome Tour:**
- "Official Vatican Partner"
- "Curated small group experiences led by accredited art historians"
- "Bypass the 3-hour queues with confirmed priority entry"

**Roman Vatican Tour:**
- "Historian-Led Archives"
- "accredited art historians who reveal hidden political and artistic messages"
- "Secure your skip-the-line access before they sell out"

**Status:** ✅ PASS

---

### 6. Testimonials - EXCELLENT DIFFERENTIATION

**Wonders of Rome:**
- Michael Thompson: "The skip-the-line access to the Vatican Museums saved us hours..."
- Sophie Beaumont: "The Colosseum underground tour was surreal..."
- 6 unique reviews with specific tour names

**Golden Rome Tour:**
- James H.: "We did the Sistine Chapel after-hours tour..."
- Maria G.: "Francesca made the Vatican Museums come alive..."
- 6 completely different reviews

**Roman Vatican Tour:**
- Emily R.: "The hop-on hop-off bus was perfect..."
- David K.: "Audio guide was informative..."
- 3 unique reviews (shorter format)

**Status:** ✅ PASS - All testimonials are unique

---

## ⚠️ NEEDS IMMEDIATE ATTENTION

### 1. Meta Descriptions - CRITICAL ISSUE

**Current State:**
All sites use generic fallbacks when CMS data is missing:

```typescript
// wondersofrome/wondersofrome/src/app/layout.tsx
description: site?.seo?.metaDescription || "Expert-led historian tours in Rome."

// goldenrometour/src/app/layout.tsx
description: site?.seo?.metaDescription || `Book skip-the-line tours with ${siteName}. Expert guides, instant confirmation.`

// romanvaticantour/src/app/layout.tsx
description: site?.seo?.metaDescription || "Exclusive tours in Rome."
```

**Problem:** These are too similar and not optimized for SEO.

**REQUIRED FIX:**
Update fallback meta descriptions to be unique, keyword-rich, and 150-160 characters:

```typescript
// wondersofrome/wondersofrome/src/app/layout.tsx
description: site?.seo?.metaDescription || "Explore Rome with AR audio guides & self-guided tours. Skip-the-line Vatican, Colosseum tickets. Download the Wonders of Rome app today."

// goldenrometour/src/app/layout.tsx
description: site?.seo?.metaDescription || "Luxury small-group Rome tours with art historians. Maximum 6 guests. Skip-the-line Vatican Museums, Colosseum arena floor access. Book Golden Rome."

// romanvaticantour/src/app/layout.tsx
description: site?.seo?.metaDescription || "Vatican pilgrimage tours & Papal Audience tickets. Catholic-focused routes with prayer time. Skip-the-line Sistine Chapel access. Book Roman Vatican Tour."
```

**Priority:** 🔴 HIGH

---

### 2. Image Alt Text - MISSING OR GENERIC

**Current Issues:**

**wondersofrome/wondersofrome/src/app/page.tsx:**
```tsx
<img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/applestore.png" 
     alt="App Store" />  // ❌ Too generic
```

**goldenrometour/src/app/page.tsx:**
```tsx
<img src={heroImage} 
     alt="Golden Rome Hero" />  // ❌ Not descriptive
```

**romanvaticantour/src/app/page.tsx:**
```tsx
<Image src={`${R2}/pexels-nastiz-12604242.jpg`} 
       alt="Museum detail" />  // ❌ Too vague
```

**REQUIRED FIX:**
Make alt text unique and descriptive per site:

**Wonders of Rome:**
```tsx
alt="Download Wonders of Rome AR audio guide app on Apple App Store"
alt="Wonders of Rome mobile app showing Vatican Museums AR overlay"
```

**Golden Rome Tour:**
```tsx
alt="Luxury small-group tour at Vatican Museums with art historian guide"
alt="Golden Rome Tour guests enjoying exclusive Colosseum arena floor access"
```

**Roman Vatican Tour:**
```tsx
alt="Roman Vatican Tour pilgrimage group at St. Peter's Basilica"
alt="Skip-the-line Vatican Museums entrance for Roman Vatican Tour guests"
```

**Priority:** 🟡 MEDIUM

---

### 3. URL Slugs - NEED VERIFICATION

**Current State:** Need to check if tour slugs are differentiated across sites.

**Example of GOOD differentiation:**
- `/vatican-tours` (WOR)
- `/vatican-museum-tickets` (GT)
- `/vatican-pilgrimage` (RVT)

**Action Required:** Audit all tour slugs in Sanity/Payload CMS to ensure no duplicates.

**Priority:** 🟡 MEDIUM

---

### 4. Schema Markup - MISSING UNIQUE DESCRIPTIONS

**Current State:**
Only agency-template has schema markup:

```typescript
// agency-template/src/app/layout.tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteName,
  "url": siteUrl,
  ...
}
</script>
```

**REQUIRED FIX:**
Add unique schema markup to each site's layout.tsx with site-specific descriptions.

**Priority:** 🟡 MEDIUM

---

## 🟢 GOOD - Minor Improvements Needed

### 1. Font Families - Already Differentiated ✅
- **WOR:** Radio_Canada_Big
- **GT:** Roboto_Flex
- **RVT:** Google_Sans_Flex
- **Template:** Playfair_Display + Inter

**Status:** ✅ PASS

---

### 2. Color Schemes - Unique Per Site ✅
Each site uses different CSS variables (checked in globals.css)

**Status:** ✅ PASS

---

### 3. Hero Images - Need Unique High-Quality Photos

**Current State:**
Some sites pull from Pexels API dynamically, which is good for variety but may cause inconsistency.

**Recommendation:**
Upload unique, branded hero images to R2 for each site:
- `wonders-hero-ar-app.jpg`
- `golden-luxury-group-tour.jpg`
- `roman-vatican-pilgrimage.jpg`

**Priority:** 🟢 LOW

---

## 🔴 CRITICAL QUICK WINS (Do This Week)

### 1. Remove Template Artifacts ❌ FOUND

**wondersofrome/wondersofrome/src/app/page.tsx:**
```tsx
<span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.4em] shadow-lg">
  Featured Archive  // ❌ "Archive" is template language
</span>

<p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4">
  Priority Selection  // ❌ Generic template copy
</p>

<p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4">
  Editorial Archive  // ❌ Template artifact
</p>
```

**REQUIRED FIX:**
Replace with site-specific language:
- "Featured Archive" → "Featured Experience" (WOR)
- "Priority Selection" → "Top Pick" (WOR)
- "Editorial Archive" → "Travel Guides" (WOR)

**Priority:** 🔴 CRITICAL

---

### 2. Rewrite "Why Us" Bullets - Already Done ✅

Each site has unique phrasing:
- **WOR:** "Self-guided AR experience + live support"
- **GT:** "Maximum 6 guests + art historian guide"
- **RVT:** "Pilgrim-focused routes + group prayer time"

**Status:** ✅ COMPLETE

---

### 3. Swap Hero Images - Partially Done ⚠️

**Current State:**
- WOR: Uses custom WondersHero component ✅
- GT: Uses Pexels luxury images ⚠️
- RVT: Uses custom Hero component ✅

**Action:** Upload unique branded hero to GT.

**Priority:** 🟡 MEDIUM

---

## 📊 Summary Score

| Criteria | WOR | GT | RVT | Status |
|----------|-----|----|----|--------|
| Title Tags | ✅ | ✅ | ✅ | PASS |
| H1 Headings | ✅ | ✅ | ✅ | PASS |
| Meta Descriptions | ⚠️ | ⚠️ | ⚠️ | NEEDS FIX |
| First 100 Words | ✅ | ✅ | ✅ | PASS |
| Testimonials | ✅ | ✅ | ✅ | PASS |
| FAQ Content | ✅ | ✅ | ✅ | EXCELLENT |
| URL Slugs | ❓ | ❓ | ❓ | VERIFY |
| Image Alt Text | ❌ | ❌ | ❌ | NEEDS FIX |
| Schema Markup | ❌ | ❌ | ❌ | NEEDS FIX |
| Template Artifacts | ❌ | ⚠️ | ✅ | NEEDS FIX |

**Overall Grade: B+ (85/100)**

---

## 🎯 Action Plan (Priority Order)

### Week 1 (Critical)
1. ✅ Update meta descriptions in all 3 layout.tsx files
2. ✅ Remove template artifacts ("Archive", "Editorial", "Priority Selection")
3. ✅ Add unique image alt text to homepage images

### Week 2 (High Priority)
4. ✅ Add unique schema markup to each site
5. ✅ Audit tour URL slugs in CMS
6. ✅ Upload unique branded hero images to R2

### Week 3 (Medium Priority)
7. ✅ Audit blog posts for overlapping topics
8. ✅ Add unique alt text to all tour card images
9. ✅ Verify internal linking strategy is differentiated

---

## 📝 Notes

### What's Working Well:
- FAQ content differentiation is **exemplary** — same questions, completely reworded answers
- Testimonials are 100% unique across all sites
- H1 headings and hero copy are completely different
- Font families and color schemes are distinct

### What Needs Work:
- Meta descriptions are too generic
- Image alt text is missing or not descriptive enough
- Template language ("Archive", "Editorial") still present in WOR
- Schema markup missing from production sites

### Competitive Advantage:
The FAQ differentiation strategy is perfect. Google will see these as unique answers to common questions, which is exactly what you want for local SEO and featured snippets.

---

**Next Steps:** Implement Week 1 fixes immediately to avoid duplicate content penalties.
