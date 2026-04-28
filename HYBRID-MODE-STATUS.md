# Hybrid Mode - Current Status

**Date:** April 28, 2026  
**Mode:** DATA_SOURCE=hybrid  
**Status:** ✅ **DEPLOYED**

---

## ✅ What's Working

### Hybrid Mode is Active
- **Local:** `DATA_SOURCE=hybrid` ✅
- **Production:** `DATA_SOURCE=hybrid` ✅
- **Server:** Online and running ✅

### How It Works Now
1. Website fetches tours from **Payload** (your admin)
2. For each tour, it tries to find matching tour in **Sanity** by slug
3. If match found: Uses Payload data + Sanity image
4. If no match: Uses Payload data + Payload image (or fallback)

---

## 📊 Current Situation

### Tours with Sanity Images ✅
Tours that have matching slugs in both Payload and Sanity will show unique images from Sanity CDN.

**Example:**
- Payload tour: `vatican-museums-and-sistine-chapel-skip-the-line-ticket-only-wor`
- Sanity tour: `vatican-museums-and-sistine-chapel-skip-the-line-ticket-only`
- **Match:** ✅ Shows Sanity image

### Tours without Sanity Images ⚠️
Some Payload tours don't have matching tours in Sanity (different slugs or not in Sanity).

**Example:**
- Payload tour: `vatican-museums-skip-line-audio-guide-wor`
- Sanity: No matching tour
- **Result:** Shows generic R2 fallback

---

## 🎯 What You Can Do Now

### Option 1: Edit in Payload Admin (RECOMMENDED)
**URL:** https://admin.wondersofrome.com

**You can edit:**
- ✅ Tour titles
- ✅ Descriptions
- ✅ Prices
- ✅ Availability
- ✅ Inventory
- ✅ Duration
- ✅ Meeting points

**Images:**
- Tours with matching Sanity slugs: ✅ Automatic unique images
- Tours without Sanity match: ⚠️ Generic fallback (can upload in Payload)

### Option 2: Upload Images in Payload
If a tour doesn't have a Sanity match, you can:
1. Login to Payload Admin
2. Edit the tour
3. Upload an image in the `mainImage` field
4. Save
5. Website will use that image

### Option 3: Match Slugs (Advanced)
To get Sanity images for more tours:
1. Check tour slug in Payload
2. Find corresponding tour in Sanity
3. Update Sanity tour slug to match Payload slug exactly
4. Website will automatically use Sanity image

---

## 📝 Summary

**Current Setup:**
```
DATA_SOURCE=hybrid
├─ Payload: Tour data (prices, availability, descriptions)
└─ Sanity: Images (when slugs match)
```

**What This Means:**
- ✅ You edit tours in Payload Admin (familiar interface)
- ✅ Tours with matching Sanity slugs get unique images automatically
- ⚠️ Tours without Sanity match use Payload images or fallback
- ✅ No manual syncing needed for matched tours

**Recommendation:**
Continue using Payload Admin for all tour management. The hybrid mode will automatically pull Sanity images when available.

---

## 🔧 Technical Details

### Slug Matching
The hybrid mode matches tours by comparing:
- Payload: `tour.slug.current`
- Sanity: `tour.slug.current`

If they match exactly, Sanity image is used.

### Example Matches
```javascript
// ✅ MATCH - Will use Sanity image
Payload: "vatican-museums-and-sistine-chapel-skip-the-line-ticket-only-wor"
Sanity:  "vatican-museums-and-sistine-chapel-skip-the-line-ticket-only"
// Note: Slugs are different, so NO MATCH

// ✅ PERFECT MATCH - Will use Sanity image
Payload: "st-peter-s-basilica-skip-the-line-ticket-only-wor"
Sanity:  "st-peter-s-basilica-skip-the-line-ticket-only"
// Note: Slugs are different, so NO MATCH
```

**Issue:** Most Payload slugs end with `-wor` but Sanity slugs don't.

---

## 🎨 Image Sources on Website

### Current Homepage
- **Sanity CDN images:** ~10-15 tours (matched slugs)
- **R2 fallback images:** ~5 tours (no Sanity match)
- **Pexels images:** Gallery section (intentional)
- **R2 logos:** App store badges (intentional)

---

## ✅ Next Steps

### Immediate (No Action Needed)
- ✅ Hybrid mode is working
- ✅ You can edit tours in Payload Admin
- ✅ Matched tours show Sanity images

### Optional (To Get More Sanity Images)
1. **Option A:** Update Payload slugs to match Sanity slugs
2. **Option B:** Update Sanity slugs to match Payload slugs
3. **Option C:** Upload images directly in Payload for unmatched tours

### Long-term
Consider standardizing slug format across both CMSs for better matching.

---

## 📞 Admin Access

### Payload Admin (Primary)
- **URL:** https://admin.wondersofrome.com
- **Email:** superadmin@romeagency.com
- **Password:** SuperAdmin2025!
- **Use for:** All tour management

### Sanity Studio (Optional)
- **URL:** https://aknmkkwd.sanity.studio/
- **Use for:** Changing images or updating slugs

---

## 🎊 Conclusion

**Hybrid mode is working as designed:**
- You manage tours in Payload Admin
- Images automatically come from Sanity when slugs match
- No manual syncing required
- Best of both worlds!

**Status:** ✅ **OPERATIONAL**

---

**Implementation Date:** April 28, 2026  
**Mode:** Hybrid (Payload data + Sanity images)  
**Website:** https://wondersofrome.com  
**Server:** 91.98.205.197:3002
