# 🎯 Golden Rome Tour - Data Strategy Guide

## Current Situation

**Problem**: Only 2 out of 17 Vatican tours are assigned to goldenrometour in Sanity
**Result**: goldenrometour only shows 2 tours instead of all Vatican tours

---

## 📊 Analysis

### Current Setup
- **wondersofrome**: Uses Sanity, has 17 Vatican tours
- **goldenrometour**: Now configured to use Sanity (changed from Payload)
- **Shared Sanity Project**: Both sites use `aknmkkwd` project
- **Issue**: Tours need to be assigned to goldenrometour site in Sanity

### Tours Status
```
✅ Assigned to goldenrometour: 2 tours
⚠️  NOT assigned: 15 tours
📊 Total Vatican tours: 17 tours
```

---

## 🎯 Recommended Approach: **Use Sanity with Manual Assignment**

### Why This Approach?
✅ **Single source of truth** - Both sites share the same data
✅ **No duplication** - Images and content stored once
✅ **Easy updates** - Update once, both sites get changes
✅ **Already configured** - Both sites use same Sanity project
✅ **Full control** - Choose which tours appear on which site

### Steps to Implement

#### Option A: Manual Assignment in Sanity Studio (RECOMMENDED)

1. **Go to Sanity Studio**
   - URL: https://wondersofrome.sanity.studio (or your Sanity Studio URL)
   - Login with your credentials

2. **For Each Vatican Tour**:
   - Open the tour document
   - Find the "Sites" field (it's a reference array)
   - Add "Golden Rome Tour" to the sites array
   - Click "Publish"

3. **Verify**:
   ```bash
   cd goldenrometour
   node scripts/check-sanity-tours.js
   ```

4. **Rebuild**:
   ```bash
   npm run build
   ```

#### Option B: Use API Token with Write Permissions

If you want to use the script to auto-assign:

1. **Create a new Sanity API token with write permissions**:
   - Go to https://www.sanity.io/manage
   - Select your project (`aknmkkwd`)
   - Go to "API" → "Tokens"
   - Create new token with "Editor" permissions
   - Copy the token

2. **Update the script**:
   - Replace the token in `scripts/assign-vatican-tours.js`
   - Run: `node scripts/assign-vatican-tours.js`

3. **Rebuild**:
   ```bash
   npm run build
   ```

---

## 🔄 Alternative Approach: **Use Payload CMS**

If you prefer to keep goldenrometour data separate:

### Pros
✅ Independent data management
✅ No risk of affecting wondersofrome
✅ Can customize tours specifically for goldenrometour

### Cons
❌ Need to duplicate tour data
❌ Need to upload images to Cloudflare R2
❌ More maintenance (update in two places)

### Steps to Implement

1. **Keep Payload as data source**:
   ```env
   DATA_SOURCE=payload
   ```

2. **Create tours in Payload CMS**:
   - Go to https://admin.wondersofrome.com
   - Login with: superadmin@romeagency.com / SuperAdmin2025!
   - Select tenant: "goldenrometour"
   - Create Vatican tours manually

3. **Upload images to Cloudflare R2**:
   - Images will be stored in R2 bucket
   - Public URL: https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev

---

## 🚀 Quick Decision Matrix

| Criteria | Sanity (Shared) | Payload (Separate) |
|----------|----------------|-------------------|
| **Setup Time** | ⚡ Fast (just assign tours) | 🐌 Slow (create all tours) |
| **Maintenance** | ✅ Easy (update once) | ❌ Hard (update twice) |
| **Data Control** | 🤝 Shared | 🔒 Independent |
| **Images** | ✅ Already uploaded | ❌ Need to upload |
| **Recommended** | ✅ **YES** | ⚠️ Only if you need independence |

---

## 💡 My Recommendation: **Use Sanity with Manual Assignment**

### Why?
1. **Fastest**: Just assign tours in Sanity Studio (5-10 minutes)
2. **Easiest**: No data duplication, no image uploads
3. **Best practice**: Single source of truth
4. **Already working**: wondersofrome proves it works

### Implementation Steps

1. **Assign tours in Sanity Studio** (5-10 minutes)
   - Open each Vatican tour
   - Add "Golden Rome Tour" to Sites field
   - Publish

2. **Verify assignment**:
   ```bash
   cd goldenrometour
   node scripts/check-sanity-tours.js
   ```

3. **Rebuild site**:
   ```bash
   npm run build
   ```

4. **Done!** All 17 Vatican tours will appear on goldenrometour

---

## 📝 Current Configuration

### goldenrometour/.env
```env
# ✅ CURRENT: Using Sanity (shared with wondersofrome)
DATA_SOURCE=sanity

# Sanity credentials (shared)
NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxMygHy...

# Site identity
NEXT_PUBLIC_SITE_ID=goldenrometour
NEXT_PUBLIC_SITE_NAME=Vatican Archives
```

### What Happens Now?
- goldenrometour fetches tours from Sanity
- Filters by: `category == "vatican"` AND `sites[] contains goldenrometour`
- Currently only 2 tours match both criteria
- After assignment: All 17 Vatican tours will match

---

## 🔧 Scripts Available

### Check Tours Status
```bash
node scripts/check-sanity-tours.js
```
Shows which tours are assigned to goldenrometour

### Auto-Assign Tours (requires write token)
```bash
node scripts/assign-vatican-tours.js
```
Automatically assigns all Vatican tours to goldenrometour

---

## ❓ FAQ

**Q: Will assigning tours to goldenrometour affect wondersofrome?**
A: No! Tours can belong to multiple sites. wondersofrome will continue to show all its tours.

**Q: Can I customize tour content for goldenrometour?**
A: Not with shared Sanity. If you need different content, use Payload instead.

**Q: What about images?**
A: Images are already in Sanity, no need to re-upload.

**Q: Can I mix Sanity and Payload?**
A: Yes! Set `DATA_SOURCE=dual` to try Payload first, fallback to Sanity.

**Q: How do I add new Vatican tours?**
A: Add them in Sanity Studio, assign to both sites, publish.

---

## 🎯 Next Steps

### Immediate Action Required:

1. **Choose your approach**:
   - ✅ **Recommended**: Assign tours in Sanity Studio (5-10 min)
   - ⚠️ **Alternative**: Create tours in Payload (1-2 hours)

2. **If using Sanity** (recommended):
   - Go to Sanity Studio
   - Assign all Vatican tours to "Golden Rome Tour"
   - Run: `npm run build`

3. **If using Payload**:
   - Change `.env`: `DATA_SOURCE=payload`
   - Create all tours in Payload CMS
   - Upload images to R2

---

**Status**: ⏳ Waiting for tour assignment
**Recommended**: ✅ Use Sanity with manual assignment
**Time Required**: ⚡ 5-10 minutes
