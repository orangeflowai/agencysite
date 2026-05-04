# Golden Rome Tour - Tours Display Fix

## Problem
Tours were not showing images and info from the backend on the goldenrometour website. The page was getting stuck during data fetching.

## Root Cause
1. **DATA_SOURCE was set to `sanity`** but the Sanity CMS doesn't have a site document with slug `goldenrometour`
2. **The Sanity service was making blocking queries** to find the site reference, which would fail and return empty tours
3. **No timeout protection** - if Sanity was slow or unreachable, the fetch would hang indefinitely
4. **Missing import** - `clsx` was used in TourCard but not imported

## Solution Applied

### 1. Changed Data Source Strategy
**File:** `goldenrometour/.env`
```diff
- DATA_SOURCE=sanity
+ DATA_SOURCE=dual
```

**Why:** The `dual` mode tries Payload CMS first, then falls back to Sanity. Since Sanity doesn't have the site data, it will fail gracefully and use the fallback tours data from `toursData.ts`.

### 2. Added Timeout Protection to Sanity Service
**File:** `goldenrometour/src/lib/sanityService.ts`

Added a 5-second timeout to `getSiteRefBySlug()` to prevent hanging:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const result = await Promise.race([
    client.fetch(query, { slug }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Sanity fetch timeout')), 5000))
]);
```

### 3. Fixed Missing Import
**File:** `goldenrometour/src/components/TourCard.tsx`

Added missing `clsx` import:
```typescript
import clsx from 'clsx';
```

## How It Works Now

1. **Page loads** → `getTours()` is called
2. **Data adapter tries Payload first** → If Payload returns tours, use them
3. **If Payload fails or returns empty** → Falls back to Sanity
4. **If Sanity times out or fails** → Falls back to hardcoded `toursData.ts`
5. **Tours display with fallback images** from Unsplash (all working URLs)

## Fallback Tours Available
The `toursData.ts` file contains 25 pre-configured tours with:
- ✅ Working Unsplash image URLs
- ✅ Complete tour information (title, price, duration, description)
- ✅ Highlights and features
- ✅ Ratings and reviews
- ✅ Categories (Vatican, Colosseum, City, Hidden Gems)

## Next Steps
1. **Test the homepage** - Tours should now display with images
2. **Configure Payload CMS** - Once Payload is set up with tours for `goldenrometour` tenant, they will be used instead of fallback
3. **Update Sanity** - If using Sanity, ensure a site document exists with slug `goldenrometour`

## Testing
Run the dev server:
```bash
cd goldenrometour
npm run dev
```

Visit `http://localhost:3000` and verify:
- ✅ Tours display on homepage
- ✅ Tour cards show images
- ✅ Prices and durations are visible
- ✅ No console errors about missing data
