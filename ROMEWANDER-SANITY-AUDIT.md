# RomeWander Sanity Backend Audit Report
**Date:** May 11, 2026  
**New Sanity Project:** `siu133x5`  
**Dataset:** `tours`

---

## ✅ MIGRATION STATUS: SUCCESSFUL

RomeWander has been successfully migrated from shared project (`aknmkkwd`) to dedicated project (`siu133x5`).

---

## 📊 CURRENT BACKEND INVENTORY

### Content in Sanity (`siu133x5/tours`):
- ✅ **Sites:** 1 (Rome Wander)
- ✅ **Tours:** 11 (all Vatican category)
- ❌ **Posts:** 0 (none)
- ❌ **Settings:** 0 (none - **CRITICAL**)

---

## 🔍 DETAILED ANALYSIS

### 1. SITE DOCUMENT ✅ (Partially Complete)

**Status:** EXISTS but missing critical fields

| Field | Status | Value |
|-------|--------|-------|
| Site ID | ✅ | `romewander` |
| Title | ✅ | Rome Wander |
| Slug | ✅ | `romewander` |
| WhatsApp | ✅ | 3514199425 |
| Contact Email | ❌ | **MISSING** |
| Contact Phone | ❌ | **MISSING** |
| Logo | ❌ | **MISSING** |
| Brand Colors | ❌ | **MISSING** |
| Business Info | ❓ | Unknown |
| Social Links | ❓ | Unknown |

**Impact:** 
- Footer will be incomplete (missing contact info)
- No logo in navbar
- Default colors instead of brand colors

**Fix Required:** Update site document in Sanity Studio with:
```
Contact Email: info@romewander.com
Contact Phone: +39 351 419 9425 (from .env)
Logo: Upload logo image
Brand Colors: Set primary/secondary/accent colors
```

---

### 2. TOURS ⚠️ (Working but Incomplete)

**Status:** 11 tours migrated, **0 have images**

| Category | Count | Images |
|----------|-------|--------|
| Vatican | 11 | ❌ 0/11 have mainImage |
| Colosseum | 0 | N/A |
| City | 0 | N/A |
| Hidden Gems | 0 | N/A |

**Tours List:**
1. Vatican & St. Peter's Basilica Complete Tour
2. St. Peter's Basilica Dome Climb & Crypt (duplicate)
3. Vatican Museums Skip-the-Line + Audio Guide
4. Vatican Museums, Sistine Chapel & St. Peter's Basilica Complete Tour
5. St. Peter's Basilica Dome Climb & Crypt (duplicate)
6. Vatican Gardens Private Walking Tour (duplicate)
7. Vatican Museums & Sistine Chapel Skip-the-Line Tour (duplicate)
8. Early Morning Vatican Tour - Before the Crowds
9. Vatican Gardens Private Walking Tour (duplicate)
10. Early Morning Vatican Tour — Before the Crowds (duplicate)
11. Vatican Museums & Sistine Chapel Skip-the-Line Tour (duplicate)

**Issues:**
- ❌ **NO IMAGES** - All tours missing mainImage and gallery
- ⚠️ **Duplicates** - Several tours have duplicate titles
- ⚠️ **Limited categories** - Only Vatican tours (website shows 4 categories)

**Current Behavior:**
- Website uses **fallback data** from `/romewander/src/lib/toursData.ts` for:
  - Colosseum tours (5 tours)
  - City tours (7 tours)
  - Hidden Gems tours (10 tours)
- Vatican tours come from Sanity but **without images** (will show broken images or placeholders)

**Fix Required:**
1. **Add images to existing 11 tours** in Sanity Studio
2. **Remove duplicate tours** (keep best version of each)
3. **Optional:** Add Colosseum/City/Hidden Gems tours to Sanity (or keep using fallback)

---

### 3. SETTINGS ❌ (CRITICAL - MISSING)

**Status:** NO settings document exists

**Impact:**
- Hero section will be **empty** or use hardcoded defaults
- No custom hero title/subtitle
- No hero video/image from CMS

**Current Behavior:**
```typescript
// In Hero component
const settings = await getSettings(); // Returns null
// Falls back to hardcoded values or empty
```

**Fix Required:** Create Settings document in Sanity Studio:
```
Hero Title: "Discover Vatican City with Expert Guides"
Hero Subtitle: "Skip-the-line tours, small groups, unforgettable experiences"
Hero Video/Image: Upload hero media
Site: Link to "Rome Wander" site
```

---

### 4. BLOG POSTS ✅ (Optional - None Needed)

**Status:** 0 posts (acceptable if blog not used)

**Impact:** None if blog section is not displayed

---

## 🔧 CONFIGURATION STATUS

### Environment Variables (.env) ✅

| Variable | Status | Value |
|----------|--------|-------|
| NEXT_PUBLIC_SANITY_PROJECT_ID | ✅ | `siu133x5` |
| NEXT_PUBLIC_SANITY_DATASET | ✅ | `tours` |
| SANITY_API_TOKEN | ✅ | Set (write access) |
| DATA_SOURCE | ✅ | `sanity` |
| NEXT_PUBLIC_SITE_ID | ✅ | `romewander` |

**Status:** All correctly configured ✅

---

### Sanity Service (sanityService.ts) ✅

**Status:** Correctly configured, no changes needed

- ✅ Uses `NEXT_PUBLIC_SANITY_PROJECT_ID` from env
- ✅ Uses `NEXT_PUBLIC_SANITY_DATASET` from env
- ✅ Queries filter by site slug (`romewander`)
- ✅ Image URL builder configured

---

## 🎯 DATA FLOW ANALYSIS

### Where Data Comes From:

```
┌─────────────────────────────────────────────────────────┐
│                    ROMEWANDER WEBSITE                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Homepage (src/app/page.tsx)                 │
│  - Calls: getTours(), getSettings(), getPosts()         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         sanityService.ts (Direct Sanity Queries)         │
│  - No dataAdapter (unlike wondersofrome)                 │
│  - Direct connection to Sanity                           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Sanity Project: siu133x5                    │
│              Dataset: tours                              │
│                                                          │
│  ✅ Site: romewander                                     │
│  ⚠️  Tours: 11 (no images)                               │
│  ❌ Settings: 0                                          │
│  ❌ Posts: 0                                             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              FALLBACK DATA (if Sanity fails)             │
│  - File: src/lib/toursData.ts                           │
│  - Contains: 33 hardcoded tours with images             │
│  - Used when: getTours() returns empty array            │
└─────────────────────────────────────────────────────────┘
```

### Current Behavior:

**Vatican Tours:**
- ✅ Come from Sanity (`siu133x5`)
- ❌ **No images** (mainImage and gallery are null)
- ⚠️ Will display with broken/placeholder images

**Other Categories (Colosseum, City, Hidden Gems):**
- ✅ Come from fallback data (`toursData.ts`)
- ✅ Have images (Unsplash URLs)
- ✅ Display correctly

**Hero Section:**
- ❌ Settings document missing
- Falls back to hardcoded values or empty

**Site Info (Footer, Navbar):**
- ⚠️ Partial data from Sanity
- Missing: contact email, phone, logo, colors
- Falls back to .env values

---

## 🚨 CRITICAL ISSUES TO FIX

### Priority 1: SETTINGS DOCUMENT (Blocks Hero Section)

**Action:** Create in Sanity Studio
1. Go to: Sanity Studio for `siu133x5`
2. Create new "Settings" document
3. Fill in:
   - Hero Title
   - Hero Subtitle
   - Hero Video/Image
   - Link to "Rome Wander" site

---

### Priority 2: TOUR IMAGES (11 tours have no images)

**Action:** Add images to tours in Sanity Studio

**Option A - Upload Images:**
1. Go to each tour in Sanity Studio
2. Upload mainImage
3. Upload gallery images

**Option B - Use External URLs:**
1. Update tours to use Unsplash URLs (like fallback data)
2. Requires schema change to accept URL strings

**Option C - Keep Fallback Data:**
- Remove Vatican tours from Sanity
- Let website use fallback data for all tours
- Simpler but less CMS control

---

### Priority 3: SITE DOCUMENT COMPLETION

**Action:** Update site document in Sanity Studio
- Add contact email: `info@romewander.com`
- Add contact phone: `+39 351 419 9425`
- Upload logo
- Set brand colors

---

## ✅ WHAT'S WORKING

1. ✅ **Sanity connection** - Project `siu133x5` is accessible
2. ✅ **Site document** - Exists with basic info
3. ✅ **Tours query** - Successfully fetches 11 tours
4. ✅ **Fallback system** - Website won't break (uses hardcoded data)
5. ✅ **Independence** - No longer affects wondersofrome
6. ✅ **Environment config** - All variables correctly set

---

## 📋 ACTION PLAN

### Immediate (Required for Full Sanity Backend):

1. **Create Settings Document** (5 minutes)
   - Open Sanity Studio: `cd romewander && npm run dev` (if studio is in romewander)
   - Or go to: https://romewander.sanity.studio
   - Create Settings → Link to Rome Wander site

2. **Add Images to 11 Tours** (30-60 minutes)
   - Upload mainImage for each tour
   - Add gallery images (optional)

3. **Update Site Document** (10 minutes)
   - Add contact email and phone
   - Upload logo
   - Set brand colors

### Optional (Enhance CMS):

4. **Clean Up Duplicate Tours** (15 minutes)
   - Remove duplicate "St. Peter's Basilica Dome Climb & Crypt"
   - Remove duplicate "Vatican Gardens Private Walking Tour"
   - Remove duplicate "Early Morning Vatican Tour"
   - Remove duplicate "Vatican Museums & Sistine Chapel Skip-the-Line Tour"

5. **Add Missing Tour Categories** (2-3 hours)
   - Import Colosseum tours (5 tours)
   - Import City tours (7 tours)
   - Import Hidden Gems tours (10 tours)
   - Or keep using fallback data

---

## 🎯 RECOMMENDATION

### For Now (Quick Fix):
1. ✅ **Create Settings document** (critical for hero)
2. ✅ **Add images to 11 Vatican tours** (critical for display)
3. ✅ **Update site contact info** (important for footer)

### For Later (Full CMS):
4. Clean up duplicate tours
5. Add remaining tour categories
6. Add blog posts (if needed)

---

## 🔍 SANITY BACKEND HEALTH: ⚠️ NEEDS ATTENTION

**Overall Status:** 60% Complete

| Component | Status | Health |
|-----------|--------|--------|
| Connection | ✅ Working | 100% |
| Site Document | ⚠️ Partial | 60% |
| Tours | ⚠️ No Images | 50% |
| Settings | ❌ Missing | 0% |
| Posts | ✅ Optional | N/A |

**Verdict:** Backend is functional but needs content completion for full CMS control.

---

## 📞 NEXT STEPS

**Choose your path:**

**Path A - Full Sanity Backend (Recommended):**
- Fix all Priority 1-3 issues above
- Full CMS control
- No fallback data needed

**Path B - Hybrid Approach (Current State):**
- Fix only Settings document
- Keep using fallback data for tours
- Simpler, less maintenance

**Path C - Back to Shared Project:**
- Revert to `aknmkkwd` project
- Share with wondersofrome again
- Lose independence

**Which path would you like to take?**
