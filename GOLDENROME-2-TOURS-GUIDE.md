# GoldenRomeTour - Simplification to 2 Tours Only

## Overview
GoldenRomeTour website is being simplified to feature **ONLY 2 Vatican tours**:

1. **Vatican Museums & Sistine Chapel Skip-the-Line Tour** (€64, 3 hours)
2. **Vatican Museums & Sistine Chapel Guided Tour** (€85, 2 hours)

---

## Current Status

### ✅ Identified Tours to Keep
- **Tour 1**: Vatican Museums & Sistine Chapel Skip-the-Line Tour
  - ID: `9sbb9mCKcoDYNnVJV7rziN`
  - Slug: `vatican-museums-sistine-chapel-skip-the-line-premium`
  - Price: €64
  - Duration: 3 hours

- **Tour 2**: Vatican Museums & Sistine Chapel Guided Tour
  - ID: `VS1dEVGXFEIwDue6f9uS06`
  - Slug: `vatican-museums-and-sistine-chapel-guided-tour-premium`
  - Price: €85
  - Duration: 2 hours

### ❌ Tours to Delete
30 other tours need to be removed from Sanity CMS (project: gycprksj)

---

## STEP 1: Delete Tours from Sanity Studio (MANUAL)

The API token in `.env` doesn't have write permissions. You need to delete tours manually:

### Instructions:

1. **Go to Sanity Studio**: https://goldenrometour.sanity.studio/
   
2. **Login** with your Sanity credentials

3. **Navigate to Tours** section in the left sidebar

4. **Delete ALL tours EXCEPT these 2**:
   - ✅ KEEP: "Vatican Museums & Sistine Chapel Skip-the-Line Tour"
   - ✅ KEEP: "Vatican Museums & Sistine Chapel Guided Tour"
   - ❌ DELETE: All other 30 tours

5. **Verify**: After deletion, you should only see 2 tours in the list

### Alternative: Use Sanity CLI

If you have Sanity CLI installed with proper credentials:

```bash
cd goldenrometour
node scripts/delete-tours.js
```

---

## STEP 2: Update Website to Feature 2 Tours

### Changes Made:

1. **Homepage** (`src/app/page.tsx`)
   - Updated to prominently feature only 2 tours
   - Removed "View All Tours" link (not needed with only 2 tours)
   - Added clear CTAs for each tour

2. **Featured Products Section** (`src/components/sections/featured-products-section.tsx`)
   - Updated to display exactly 2 tours in a 2-column grid
   - Enhanced styling for premium Vatican tours
   - Added "Book Now" buttons for each tour

3. **Navigation** (`src/components/vatican/header.tsx`)
   - Simplified navigation (no need for tour categories)
   - Direct links to the 2 tours

4. **Tour Filtering** (`src/lib/sanityService.ts`)
   - Already filters by Vatican category
   - Will automatically show only 2 tours once deleted from Sanity

---

## STEP 3: Test & Verify

### Local Testing:

```bash
cd goldenrometour
npm run dev
```

Visit: http://localhost:3000

### Verify:
- ✅ Homepage shows exactly 2 tours
- ✅ Both tours have complete information
- ✅ Booking buttons work
- ✅ Tour detail pages load correctly
- ✅ No broken links or missing tours

---

## STEP 4: Build & Deploy

### Build:

```bash
cd goldenrometour
npm run build
```

### Deploy to Production:

```bash
# Commit changes
git add .
git commit -m "feat: Simplify GoldenRomeTour to 2 Vatican tours only"
git push origin main

# Deploy to Hetzner (if needed)
# Follow DEPLOYMENT-INSTRUCTIONS.md
```

---

## Summary of Changes

### Files Modified:
- ✅ `src/app/page.tsx` - Updated homepage layout
- ✅ `src/components/sections/featured-products-section.tsx` - 2-tour grid
- ✅ `src/components/vatican/header.tsx` - Simplified navigation
- ✅ `src/lib/sanityService.ts` - Already filters Vatican tours

### Files Created:
- ✅ `scripts/list-tours.js` - List all tours in Sanity
- ✅ `scripts/verify-tours.js` - Verify the 2 tours to keep
- ✅ `scripts/delete-tours.js` - Delete script (needs valid token)
- ✅ `GOLDENROME-2-TOURS-GUIDE.md` - This guide

### Sanity CMS:
- ⏳ **PENDING**: Delete 30 tours manually (see STEP 1)
- ✅ Keep 2 Vatican tours

---

## Next Steps

1. **Delete tours from Sanity Studio** (manual step - see STEP 1)
2. **Test locally** to verify only 2 tours appear
3. **Build and deploy** to production
4. **Update marketing materials** to reflect the simplified offering

---

## Support

If you need help:
- Sanity Studio: https://goldenrometour.sanity.studio/
- Sanity Project ID: `gycprksj`
- Dataset: `production`

---

**Last Updated**: May 23, 2026
