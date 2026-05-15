# Golden Rome Tour - Tour Data Status

## Current Situation

The goldenrometour website is configured to use **Payload CMS** as the primary data source (`DATA_SOURCE=payload`), but the tours haven't been uploaded to Payload yet due to API permission issues.

## What's Been Done

### ✅ Tour Data Files Created
- `tour-data-tour1.json` - Premium Skip-the-Line ticket (€45, self-guided)
- `tour-data-tour2.json` - Complete Guided Tour (€65, 3 hours with guide)
- Both files contain all the information you provided

### ✅ Fallback System Implemented
- Created `src/lib/jsonTours.ts` - Server-only JSON loader
- Updated `src/lib/dataAdapter.ts` - Falls back to JSON files when Payload returns no tours
- Updated `src/lib/toursData.ts` - TypeScript fallback data

### ✅ Meeting Point Updated
- Changed from "Via Tunisi 43" to "Via Germanico, 40, 00192 Roma, RM, Italy"

### ✅ Tour Title Updated
- Guided tour renamed to "Complete Guided Tour: Vatican Museums & Sistine Chapel"

## Current Issue

The tours are showing empty because:
1. Payload CMS doesn't have the tours yet (API key lacks permission to upload)
2. The JSON fallback system is in place but may need the dev server restarted

## Solutions

### Option 1: Restart Dev Server (Recommended)
The JSON fallback should work once the server picks up the changes:

```bash
# Stop the current server
pkill -f "next dev"

# Remove lock file
rm -rf .next/dev/lock

# Start fresh
npm run dev
```

### Option 2: Upload Tours to Payload CMS Manually
1. Log into Payload CMS at https://admin.wondersofrome.com
2. Navigate to Tours collection
3. Create 2 new tours manually using the data from the JSON files
4. Set `tenant` field to `goldenrometour`
5. Set `active` to `true`

### Option 3: Change Data Source Temporarily
Edit `.env` and change:
```
DATA_SOURCE=payload
```
to:
```
DATA_SOURCE=sanity
```

This will use Sanity CMS instead (if tours exist there).

## How to Verify Tours Are Loading

### Check Server Logs
Look for these messages in the terminal:
```
[dataAdapter] No tours from CMS, trying JSON fallback...
[jsonTours] Loaded 2 tours from JSON files
```

### Check the Homepage
Visit http://localhost:3001 and look for:
- "The Vatican Archives" section
- 2 tour cards displayed
- Tour titles, prices, and "Book Now" buttons

### Check Individual Tour Pages
- http://localhost:3001/tour/vatican-museums-sistine-chapel-skip-the-line
- http://localhost:3001/tour/vatican-museums-and-sistine-chapel-guided-tour

## Tour Information Summary

### Tour 1: Premium Skip-the-Line
- **Slug**: `vatican-museums-sistine-chapel-skip-the-line`
- **Price**: €45
- **Duration**: Flexible
- **Type**: Self-guided
- **Badge**: Popular

### Tour 2: Complete Guided Tour
- **Slug**: `vatican-museums-and-sistine-chapel-guided-tour`
- **Price**: €65
- **Duration**: 3 Hours
- **Type**: Guided (up to 24 people)
- **Badge**: Best Seller

## Next Steps

1. **Restart the dev server** to ensure JSON fallback is working
2. **Check the homepage** at http://localhost:3001
3. **Verify both tours** are displaying with correct information
4. **Test the booking flow** to ensure it works with the new data

If tours still don't show after restart, check the browser console and server logs for errors.
