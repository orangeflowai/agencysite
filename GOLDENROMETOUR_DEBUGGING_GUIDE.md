# 🔍 Golden Rome Tour - Debugging Guide

## 🐛 Current Issue: Tour Pages Showing 500 Error

### Symptoms
- Homepage loads fine
- Individual tour pages (`/tour/[slug]`) show 500 error
- Example: `/tour/vatican-gardens-private-tour-grt`

---

## 🔎 Debugging Steps

### 1. Check Server Logs
When you visit a tour page, check the terminal/console for these logs:

```
[TourPage] Fetching tour with slug: vatican-gardens-private-tour-grt
[dataAdapter] Found tour: Vatican Gardens Private Tour, category: vatican, slug: vatican-gardens-private-tour-grt
[TourPage] Site ID: goldenrometour, Tour category: vatican
```

### 2. Possible Issues & Solutions

#### Issue A: Tour Not Found
**Log:** `[dataAdapter] Tour not found for slug: vatican-gardens-private-tour-grt`

**Causes:**
1. Tour doesn't exist in Payload CMS for `goldenrometour` tenant
2. Slug doesn't match (missing `-grt` suffix)
3. Tour is not active

**Solutions:**
1. Check Payload CMS at `https://admin.wondersofrome.com`
2. Verify tour exists with tenant: `goldenrometour`
3. Check tour slug matches URL
4. Ensure tour is marked as `active: true`

#### Issue B: Wrong Category
**Log:** `[dataAdapter] Tour "..." category is "colosseum", not "vatican" - filtering out`

**Cause:** Tour has wrong category for Vatican-only site

**Solutions:**
1. Update tour category to `vatican` in Payload CMS
2. Or temporarily disable Vatican-only filter (see below)

#### Issue C: Missing Category
**Log:** `[dataAdapter] Tour "..." has no category, allowing it through`

**Cause:** Tour doesn't have a category field

**Solution:** This is now allowed - tour will load

---

## 🛠️ Quick Fixes

### Temporarily Disable Vatican-Only Filter

Edit `goldenrometour/src/lib/dataAdapter.ts`:

```typescript
// Change this line:
const VATICAN_ONLY = process.env.NEXT_PUBLIC_SITE_ID === 'goldenrometour'

// To this (disable filter):
const VATICAN_ONLY = false
```

### Check Available Tours

Add this to your homepage to see what tours are available:

```typescript
// In goldenrometour/src/app/page.tsx
console.log('Available tours:', tours.map(t => ({
  title: t.title,
  slug: t.slug.current,
  category: t.category
})))
```

---

## 📊 Data Flow

```
User visits /tour/vatican-gardens-private-tour-grt
    ↓
TourPage component
    ↓
getTour(slug) in dataAdapter.ts
    ↓
withFallback() tries Payload first
    ↓
payload.getTour(slug, siteId)
    ↓
Tries exact slug: "vatican-gardens-private-tour-grt"
    ↓
If not found, tries with suffixes: "-grt", "-wor", etc.
    ↓
Returns tour or null
    ↓
Vatican-only filter checks category
    ↓
If category !== 'vatican' → return null → 404
    ↓
If tour found → render page
```

---

## 🔧 Environment Check

### Required Environment Variables

```env
# Site Identity
NEXT_PUBLIC_SITE_ID=goldenrometour
NEXT_PUBLIC_SITE_NAME=Vatican Archives

# Payload CMS
DATA_SOURCE=payload
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_TENANT=goldenrometour
PAYLOAD_API_KEY=g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU
```

### Verify Payload Connection

Test the Payload API directly:

```bash
curl -H "Authorization: users API-Key g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU" \
  "https://admin.wondersofrome.com/api/tours?where[tenant][equals]=goldenrometour&limit=10"
```

---

## 📝 Common Errors & Solutions

### Error 1: "Tour not found"
**Solution:** Check Payload CMS for tours with tenant `goldenrometour`

### Error 2: "Objects are not valid as a React child"
**Solution:** Already fixed - features are now properly extracted

### Error 3: "urlFor(...).quality is not a function"
**Solution:** Already fixed - removed .quality() calls

### Error 4: "Return statement is not allowed here"
**Solution:** Already fixed - removed duplicate code

### Error 5: Google Translate CORS warnings
**Solution:** Harmless - error handling added, warnings can be ignored

---

## 🎯 Next Steps

1. **Check Payload CMS:**
   - Visit: https://admin.wondersofrome.com
   - Login with: `superadmin@romeagency.com` / `SuperAdmin2025!`
   - Go to Tours collection
   - Filter by tenant: `goldenrometour`
   - Verify tours exist and have:
     - `active: true`
     - `category: 'vatican'`
     - Correct slug format

2. **Check Server Logs:**
   - Run `npm run dev` in goldenrometour folder
   - Visit a tour page
   - Look for `[dataAdapter]` and `[TourPage]` logs
   - Share the logs to identify the issue

3. **Test with Different Slugs:**
   - Try: `/tour/vatican-museums-tour`
   - Try: `/tour/sistine-chapel-tour`
   - Try: `/tour/st-peters-basilica-tour`
   - See which ones work and which don't

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] All tours have `category: 'vatican'`
- [ ] All tours have `tenant: 'goldenrometour'`
- [ ] All tours are `active: true`
- [ ] Slugs match URL patterns
- [ ] Images are uploaded and accessible
- [ ] Stripe keys are configured (real, not mock)
- [ ] Environment variables are set correctly
- [ ] Build completes without errors
- [ ] All tour pages load successfully

---

## 📞 Support

If issues persist:

1. Share server logs from terminal
2. Share Payload CMS screenshot of tours
3. Share specific tour slug that's failing
4. Share any error messages from browser console

**Current Status:** Debugging improvements added, logs will help identify the exact issue.
