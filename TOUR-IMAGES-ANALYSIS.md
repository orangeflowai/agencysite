# Tour Images Analysis - Wondersofrome

**Date:** April 28, 2026  
**Issue:** Tour images not displaying correctly / "rainbow images" appearing

---

## 🔍 ROOT CAUSE IDENTIFIED

### Current Configuration:
```bash
DATA_SOURCE=payload  # ← This is the problem!
```

### The Issue:

**Sanity CMS:**
- ✅ Has 50 tours for wondersofrome
- ✅ ALL tours have proper `mainImage.asset.url`
- ✅ Images are high-quality, tour-specific
- ✅ Example: `https://cdn.sanity.io/images/aknmkkwd/production/7bbcc98ba36646384edc673521fe95d...`

**Payload CMS:**
- ⚠️ Has 366 tours (includes all sites)
- ❌ ALL tours have `mainImage: null`
- ❌ Using generic fallback `imageUrl` from R2
- ❌ Same fallback image for ALL tours: `https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-alex-250137-757239.jpg`

---

## 📊 Comparison Results

### Sanity Tours (First 10):

| # | Title | Image Status |
|---|-------|--------------|
| 1 | Vatican Museums and Sistine Chapel Skip-the-Line Ticket | ✅ Unique Image |
| 2 | St.Peter's Basilica Skip-the-Line Ticket Only | ✅ Unique Image |
| 3 | Lake Bracciano Private Day Trip from Rome | ✅ Unique Image |
| 4 | Orvieto & Civita di Bagnoregio Private Day Trip | ✅ Unique Image |
| 5 | Assisi Private Day Trip from Rome | ✅ Unique Image |
| 6 | Rome Hidden Gems Private Car Tour | ✅ Unique Image |
| 7 | Classic Rome Hop-On/Hop-Off Bus | ✅ Unique Image |
| 8 | Tivoli: Villa d'Este & Gardens Tour | ✅ Unique Image |
| 9 | Rome: VIP Shopping Experience | ✅ Unique Image |
| 10 | Rome by Night Private Car Tour | ✅ Unique Image |

**Result:** 100% of Sanity tours have unique, tour-specific images

### Payload Tours (First 10):

| # | Title | Tenant | Image Status |
|---|-------|--------|--------------|
| 1 | Pantheon Guided Tour | romewander | ❌ Generic Fallback |
| 2 | Pantheon Guided Tour | romanvaticantour | ❌ Generic Fallback |
| 3 | Pantheon Guided Tour | ticketsinrome | ❌ Generic Fallback |
| 4 | Pantheon Guided Tour | wondersofrome | ❌ Generic Fallback |
| 5 | Colosseum, Roman Forum Tour | romewander | ❌ Generic Fallback |
| 6 | Colosseum, Roman Forum Tour | romanvaticantour | ❌ Generic Fallback |
| 7 | Colosseum, Roman Forum Tour | ticketsinrome | ❌ Generic Fallback |
| 8 | Colosseum, Roman Forum Tour | wondersofrome | ❌ Generic Fallback |
| 9 | Vatican Museums Tour | romewander | ❌ Generic Fallback |
| 10 | Vatican Museums Tour | romanvaticantour | ❌ Generic Fallback |

**Result:** 0% of Payload tours have unique images (all using same fallback)

---

## 🎯 THE SOLUTION

### Option 1: Switch to Sanity (RECOMMENDED - IMMEDIATE FIX)

**Change `.env` file:**
```bash
# FROM:
DATA_SOURCE=payload

# TO:
DATA_SOURCE=sanity
```

**Pros:**
- ✅ Immediate fix - all images will work
- ✅ No data migration needed
- ✅ All 50 tours have proper images
- ✅ Images are already optimized

**Cons:**
- ⚠️ Payload admin won't be the source of truth
- ⚠️ Need to manage tours in Sanity Studio

**Implementation:**
1. Update local `.env`: `DATA_SOURCE=sanity`
2. Update server `.env`: `DATA_SOURCE=sanity`
3. Restart PM2: `pm2 restart wondersofrome`
4. Test website

---

### Option 2: Sync Sanity Images to Payload

**Create a sync script to copy images from Sanity to Payload**

**Pros:**
- ✅ Keeps Payload as source of truth
- ✅ Admin panel remains functional
- ✅ Images stored in both systems

**Cons:**
- ⚠️ Requires development work
- ⚠️ Need to run sync regularly
- ⚠️ More complex maintenance

**Implementation Steps:**
1. Create sync script (see below)
2. Run sync to copy all Sanity images to Payload
3. Keep `DATA_SOURCE=payload`
4. Schedule regular syncs

---

### Option 3: Use Dual Mode with Sanity Priority

**Change `.env` file:**
```bash
DATA_SOURCE=dual  # Try Payload first, fallback to Sanity
```

**Pros:**
- ✅ Best of both worlds
- ✅ Payload admin works
- ✅ Sanity images as fallback

**Cons:**
- ⚠️ Slower (two API calls)
- ⚠️ More complex debugging

---

## 🚀 RECOMMENDED IMMEDIATE ACTION

### Step 1: Switch to Sanity (5 minutes)

**Local:**
```bash
# Edit wondersofrome/wondersofrome/.env
sed -i 's/DATA_SOURCE=payload/DATA_SOURCE=sanity/' wondersofrome/wondersofrome/.env
```

**Production Server:**
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197

# Update .env
sed -i 's/DATA_SOURCE=payload/DATA_SOURCE=sanity/' /var/www/wondersofrome/wondersofrome/.env

# Restart service
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart wondersofrome

# Verify
pm2 logs wondersofrome --lines 20
```

### Step 2: Test Website

Visit https://wondersofrome.com and verify:
- [ ] Tour cards show unique images
- [ ] No "rainbow" or generic images
- [ ] Tour detail pages load correctly
- [ ] Images are tour-specific

### Step 3: Verify Admin Panel

Visit https://aknmkkwd.sanity.studio/ and verify:
- [ ] Can access Sanity Studio
- [ ] Tours are visible
- [ ] Images load correctly
- [ ] Can edit tour content

---

## 📝 Image Sync Script (For Option 2)

If you want to sync Sanity images to Payload:

```javascript
// sync-sanity-to-payload.js
const sanityClient = require('@sanity/client');
const fetch = require('node-fetch');

const sanity = sanityClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1',
  useCdn: false
});

async function syncImages() {
  // 1. Get all Sanity tours with images
  const sanityTours = await sanity.fetch(`
    *[_type == 'tour' && 'wondersofrome' in sites[]->slug.current]{
      _id,
      title,
      slug,
      mainImage {
        asset -> { _id, url }
      }
    }
  `);

  console.log(`Found ${sanityTours.length} Sanity tours`);

  // 2. Login to Payload
  const loginRes = await fetch('https://admin.wondersofrome.com/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@romeagency.com',
      password: 'SuperAdmin2025!'
    })
  });
  const { token } = await loginRes.json();

  // 3. For each Sanity tour, find matching Payload tour and update image
  for (const sanityTour of sanityTours) {
    const imageUrl = sanityTour.mainImage?.asset?.url;
    if (!imageUrl) continue;

    // Find Payload tour by slug
    const payloadRes = await fetch(
      `https://admin.wondersofrome.com/api/tours?where[slug][equals]=${sanityTour.slug.current}&where[tenant][equals]=wondersofrome`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const payloadData = await payloadRes.json();

    if (payloadData.docs.length === 0) {
      console.log(`❌ No Payload tour found for: ${sanityTour.title}`);
      continue;
    }

    const payloadTour = payloadData.docs[0];

    // Update Payload tour with Sanity image
    const updateRes = await fetch(
      `https://admin.wondersofrome.com/api/tours/${payloadTour.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mainImage: {
            url: imageUrl,
            alt: sanityTour.title
          }
        })
      }
    );

    if (updateRes.ok) {
      console.log(`✅ Updated: ${sanityTour.title}`);
    } else {
      console.log(`❌ Failed: ${sanityTour.title}`);
    }
  }

  console.log('✅ Sync complete!');
}

syncImages().catch(console.error);
```

**Usage:**
```bash
node sync-sanity-to-payload.js
```

---

## 🎨 Why "Rainbow Images" Appeared

The "rainbow images" or generic images you saw were likely:

1. **Pexels API Images** - Homepage uses Pexels for dynamic images
2. **R2 Fallback Images** - Generic Rome photos from Cloudflare R2
3. **Same Image for All Tours** - Payload using one fallback for all tours

**Example of the fallback:**
```
https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-alex-250137-757239.jpg
```

This single image was being used for ALL Payload tours because `mainImage` was null.

---

## 📊 Data Source Comparison

| Feature | Sanity | Payload |
|---------|--------|---------|
| **Tours for wondersofrome** | 50 | 366 (all sites) |
| **Images** | ✅ Unique per tour | ❌ All null |
| **Image Quality** | ✅ High quality | ❌ Generic fallback |
| **Admin UI** | Sanity Studio | Payload Admin |
| **API Speed** | Fast (CDN) | Medium |
| **Maintenance** | Easy | Complex |

---

## ✅ FINAL RECOMMENDATION

**Switch to Sanity immediately:**

1. **Update `.env` files** (local + production):
   ```bash
   DATA_SOURCE=sanity
   ```

2. **Restart services:**
   ```bash
   pm2 restart wondersofrome
   ```

3. **Test website:**
   - All tour images should now be unique
   - No more "rainbow" or generic images
   - Tour-specific, high-quality images

4. **Future consideration:**
   - Sync Sanity images to Payload
   - Or migrate fully to Payload with proper images
   - Or keep Sanity as primary CMS

---

## 📞 Next Steps

1. ✅ Update DATA_SOURCE to sanity
2. ✅ Restart wondersofrome service
3. ⏳ Test website thoroughly
4. ⏳ Verify all tour images are correct
5. ⏳ Check admin panel access
6. ⏳ Decide on long-term CMS strategy

---

**Status:** Issue identified, solution provided, ready to implement
