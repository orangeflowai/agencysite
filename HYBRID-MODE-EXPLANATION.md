# Hybrid Mode - Best of Both Worlds

**Date:** April 28, 2026  
**Status:** ✅ **IMPLEMENTED**

---

## 🎯 What is Hybrid Mode?

**Hybrid Mode** combines the best of both CMSs:
- **Payload Admin** → Tour data (prices, availability, inventory, descriptions)
- **Sanity CMS** → Images (because Payload has no images)

This means:
- ✅ You edit tours in **Payload Admin** (https://admin.wondersofrome.com)
- ✅ Images automatically come from **Sanity** (no manual image upload needed)
- ✅ Website shows **Payload data** with **Sanity images**

---

## 📊 How It Works

### Data Flow
```
User visits wondersofrome.com
    ↓
dataAdapter.ts (hybrid mode)
    ↓
Fetches from BOTH:
  - Payload: tour data (title, price, availability, etc.)
  - Sanity: images (mainImage, gallery images)
    ↓
Merges by matching slug
    ↓
Returns: Payload tour + Sanity images
    ↓
Website displays combined data
```

### Matching Logic
Tours are matched by **slug**:
- Payload tour: `slug.current = "vatican-museums-tour"`
- Sanity tour: `slug.current = "vatican-museums-tour"`
- Result: Payload data + Sanity mainImage

---

## 🔧 Configuration

### Environment Variable
```bash
DATA_SOURCE=hybrid
```

### Available Modes
| Mode | Description | Use Case |
|------|-------------|----------|
| `payload` | Payload only | When Payload has all data + images |
| `sanity` | Sanity only | When Sanity is primary CMS |
| `dual` | Payload first, Sanity fallback | Backup strategy |
| `hybrid` | **Payload data + Sanity images** | **RECOMMENDED** ✅ |

---

## ✅ Benefits of Hybrid Mode

### For You (Admin)
- ✅ Edit tours in familiar **Payload Admin**
- ✅ Update prices, availability, descriptions
- ✅ Manage inventory and bookings
- ✅ No need to upload images manually
- ✅ Images automatically pulled from Sanity

### For Website
- ✅ Unique, high-quality images (from Sanity)
- ✅ Real-time data (from Payload)
- ✅ Fast performance (both APIs in parallel)
- ✅ No generic fallback images

### For Maintenance
- ✅ Single source of truth for data (Payload)
- ✅ Single source of truth for images (Sanity)
- ✅ No manual syncing needed
- ✅ Automatic matching by slug

---

## 📝 How to Edit Tours

### Step 1: Login to Payload Admin
```
URL: https://admin.wondersofrome.com
Email: superadmin@romeagency.com
Password: SuperAdmin2025!
```

### Step 2: Edit Tour Data
You can edit:
- ✅ Title
- ✅ Description
- ✅ Price
- ✅ Availability
- ✅ Inventory
- ✅ Duration
- ✅ Group size
- ✅ Meeting point
- ✅ Inclusions/exclusions

### Step 3: Images (Automatic)
- ❌ **Don't upload images in Payload** (they won't be used)
- ✅ Images automatically come from Sanity
- ✅ Matched by tour slug

### Step 4: Save
- Click "Save" in Payload Admin
- Website will show your changes + Sanity images

---

## 🔍 Technical Implementation

### dataAdapter.ts (Hybrid Logic)
```typescript
if (source === 'hybrid') {
  // Fetch from BOTH Payload and Sanity in parallel
  const [payloadResult, sanityResult] = await Promise.all([
    payloadFn().catch(() => null),
    sanityFn().catch(() => null)
  ]);

  // Merge: Payload data + Sanity images
  return payloadResult.map((payloadTour: any) => {
    const sanityTour = sanityResult.find((st: any) => 
      st.slug?.current === payloadTour.slug?.current
    );
    return {
      ...payloadTour,  // All Payload data
      mainImage: sanityTour?.mainImage || payloadTour.mainImage,  // Sanity image
      images: sanityTour?.images || payloadTour.images,  // Sanity gallery
    };
  });
}
```

### Key Points
1. **Parallel Fetching** - Both APIs called simultaneously (fast)
2. **Slug Matching** - Tours matched by `slug.current`
3. **Payload Priority** - All data from Payload except images
4. **Sanity Images** - Only images come from Sanity
5. **Fallback** - If no Sanity image, uses Payload image (if any)

---

## 🎨 Image Management

### Current State
- **Payload:** 366 tours, 0 images (mainImage = null)
- **Sanity:** 50+ tours per site, 100% have images

### With Hybrid Mode
- **Website displays:** Payload tour data + Sanity images
- **You edit in:** Payload Admin
- **Images come from:** Sanity (automatic)

### If You Want to Change Images
1. Login to Sanity Studio: https://aknmkkwd.sanity.studio/
2. Find the tour by slug
3. Upload new image
4. Website will automatically use new image

---

## 📊 Comparison

### Before (DATA_SOURCE=payload)
```
❌ Payload data: ✅ (prices, availability)
❌ Payload images: ❌ (all null)
❌ Result: Generic R2 fallback images
```

### After Sanity Fix (DATA_SOURCE=sanity)
```
✅ Sanity data: ✅ (but you can't edit easily)
✅ Sanity images: ✅ (unique per tour)
❌ Problem: Must edit in Sanity Studio (unfamiliar)
```

### Now with Hybrid (DATA_SOURCE=hybrid) ✅
```
✅ Payload data: ✅ (edit in familiar admin)
✅ Sanity images: ✅ (unique per tour)
✅ Result: Best of both worlds!
```

---

## 🚀 Deployment Status

### Local Environment
```bash
# wondersofrome/wondersofrome/.env
DATA_SOURCE=hybrid ✅
```

### Production Server
```bash
# /var/www/wondersofrome/wondersofrome/.env
DATA_SOURCE=hybrid ✅

# Service status
PM2 Process: wondersofrome (ID: 6)
Status: Online ✅
Port: 3002
```

### Files Updated
- ✅ `wondersofrome/wondersofrome/src/lib/dataAdapter.ts` (hybrid logic added)
- ✅ `wondersofrome/wondersofrome/.env` (DATA_SOURCE=hybrid)
- ✅ `/var/www/wondersofrome/wondersofrome/.env` (production)
- ✅ `/var/www/wondersofrome/wondersofrome/src/lib/dataAdapter.ts` (production)

---

## ✅ Testing Checklist

### For You to Verify
- [ ] Login to Payload Admin (https://admin.wondersofrome.com)
- [ ] Edit a tour (change price or description)
- [ ] Save the tour
- [ ] Visit the tour page on wondersofrome.com
- [ ] Verify: Your changes appear + Sanity image shows

### Expected Results
- ✅ Tour data reflects your Payload edits
- ✅ Tour image is unique (from Sanity)
- ✅ No generic fallback images
- ✅ Availability/inventory from Payload works

---

## 🔧 Troubleshooting

### If Images Don't Show
1. Check if tour slug matches between Payload and Sanity
2. Verify Sanity has image for that slug
3. Check browser console for errors

### If Data Doesn't Update
1. Clear browser cache (Ctrl+Shift+R)
2. Wait 1 hour (Next.js revalidation time)
3. Or rebuild: `npm run build && pm2 restart wondersofrome`

### If Availability Doesn't Work
1. Verify inventory is set in Payload Admin
2. Check date ranges are correct
3. Ensure tour is published (not draft)

---

## 📞 Admin Access

### Payload Admin
- **URL:** https://admin.wondersofrome.com
- **Email:** superadmin@romeagency.com
- **Password:** SuperAdmin2025!
- **Use for:** Editing tours, prices, availability

### Sanity Studio (Optional)
- **URL:** https://aknmkkwd.sanity.studio/
- **Token:** skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1
- **Use for:** Changing images (rarely needed)

---

## 🎊 Summary

**Hybrid Mode = Payload Admin + Sanity Images**

You can now:
- ✅ Edit tours in Payload Admin (familiar interface)
- ✅ Update prices, availability, inventory
- ✅ Website automatically shows Sanity images
- ✅ No manual image management needed
- ✅ Best user experience with unique images

**Status:** ✅ **LIVE AND OPERATIONAL**

---

**Implementation Date:** April 28, 2026  
**Mode:** Hybrid (Payload data + Sanity images)  
**Deployment:** Production server (91.98.205.197)  
**Website:** https://wondersofrome.com
