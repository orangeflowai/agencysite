# Complete Image Migration Guide

## 🎯 Goal

Migrate tours from Sanity to Payload **with actual images**, not just URLs. This means:
1. Download images from Sanity CDN
2. Upload images to Payload's media library
3. Link images to tours in Payload
4. Result: Self-contained Payload CMS with all images

---

## 🔄 Two Migration Options

### Option 1: URL-Only Migration (Fast) ⚡

**What it does:**
- Stores Sanity CDN URLs in Payload
- Images stay on Sanity CDN
- Fast migration (~1-3 minutes)

**Pros:**
- ✅ Quick and simple
- ✅ No image downloads/uploads
- ✅ Sanity CDN is fast and reliable

**Cons:**
- ⚠️ Dependent on Sanity CDN
- ⚠️ Images not in Payload media library
- ⚠️ Can't manage images in Payload admin

**Command:**
```bash
node migrate-sanity-to-payload.js
```

### Option 2: Full Image Migration (Complete) 🖼️

**What it does:**
- Downloads images from Sanity CDN
- Uploads images to Payload media library
- Links images to tours
- Stores images in Payload's storage

**Pros:**
- ✅ Complete independence from Sanity
- ✅ Images in Payload media library
- ✅ Can manage images in Payload admin
- ✅ Self-contained system

**Cons:**
- ⏱️ Slower migration (~5-15 minutes for 50 tours)
- 💾 Uses Payload storage space
- 🔄 More complex process

**Command:**
```bash
node migrate-sanity-to-payload-with-images.js
```

---

## 🚀 Full Image Migration Process

### Prerequisites

```bash
# Install additional dependency for form uploads
npm install form-data

# Verify you have all dependencies
npm install @sanity/client node-fetch dotenv form-data
```

### Step 1: Dry Run with Images

```bash
# Preview what will happen (no actual migration)
node migrate-sanity-to-payload-with-images.js --dry-run
```

**What you'll see:**
```
╔════════════════════════════════════════════════════════════════╗
║     SANITY → PAYLOAD MIGRATION TOOL (WITH IMAGES)             ║
╚════════════════════════════════════════════════════════════════╝

Mode: 🔍 DRY RUN (no changes will be made)
Site: wondersofrome
Migrate Images: Yes (full migration)

📥 Fetching tours from Sanity...
✅ Found 50 tours in Sanity

[1/50] Processing: Vatican Museums Skip-the-Line Tour
   Slug: vatican-museums-skip-line
   🖼️  Would download and upload image: https://cdn.sanity.io/images/...
   📊 Fields: 18 mapped
   👥 Guest Types: 3
   📍 Itinerary Steps: 5

[2/50] Processing: Colosseum Underground Tour
   Slug: colosseum-underground
   🖼️  Would download and upload image: https://cdn.sanity.io/images/...
   📊 Fields: 16 mapped
   ...
```

### Step 2: Run Full Migration

```bash
# Migrate tours WITH images
node migrate-sanity-to-payload-with-images.js
```

**What happens:**
1. Authenticates with Payload
2. Fetches tours from Sanity
3. For each tour:
   - Downloads image from Sanity CDN
   - Uploads image to Payload media library
   - Creates/updates tour with image reference
   - Cleans up temporary files

**Progress output:**
```
[1/50] Processing: Vatican Museums Skip-the-Line Tour
   Slug: vatican-museums-skip-line
   📥 Downloading image: image-abc123-1920x1080.jpg...
   📤 Uploading to Payload...
   ✅ Image uploaded: 65f8a9b2c3d4e5f6g7h8i9j0
   ✨ Creating new tour...
   📊 Fields: 18 mapped
   🖼️  Image: Uploaded to Payload (ID: 65f8a9b2c3d4e5f6g7h8i9j0)
   👥 Guest Types: 3
   📍 Itinerary Steps: 5

[2/50] Processing: Colosseum Underground Tour
   ...
```

### Step 3: Verify in Payload Admin

1. **Check Media Library:**
   - Go to https://admin.wondersofrome.com
   - Click "Media" in sidebar
   - You should see all uploaded images

2. **Check Tours:**
   - Click "Tours" in sidebar
   - Open a tour
   - Verify "Main Image" field shows the uploaded image
   - Image should be selectable from Payload media library

3. **Test on Website:**
   - Go to https://wondersofrome.com
   - Verify tour images are loading
   - Images should now come from Payload, not Sanity

---

## 📊 Migration Comparison

### Before Migration

```
Sanity:
├─ Tours: 50
├─ Images: 50 (on Sanity CDN)
└─ Storage: Sanity manages

Payload:
├─ Tours: 366
├─ Images: 0 (all mainImage: null)
└─ Storage: Empty media library
```

### After URL-Only Migration

```
Sanity:
├─ Tours: 50
├─ Images: 50 (still on Sanity CDN)
└─ Storage: Unchanged

Payload:
├─ Tours: 416 (366 + 50 new)
├─ Images: 50 URLs pointing to Sanity CDN
└─ Storage: No images stored
```

### After Full Image Migration

```
Sanity:
├─ Tours: 50
├─ Images: 50 (still on Sanity CDN, but not needed)
└─ Storage: Can be archived

Payload:
├─ Tours: 416 (366 + 50 new)
├─ Images: 50 (in Payload media library)
└─ Storage: ~50-200MB (depending on image sizes)
```

---

## 🎛️ Command Options

### Basic Commands

```bash
# Dry run (preview only)
node migrate-sanity-to-payload-with-images.js --dry-run

# Full migration with images
node migrate-sanity-to-payload-with-images.js

# Migrate and overwrite existing tours
node migrate-sanity-to-payload-with-images.js --force

# Migrate specific site
node migrate-sanity-to-payload-with-images.js --site ticketsinrome
```

### Advanced Options

```bash
# Skip images (data only, faster)
node migrate-sanity-to-payload-with-images.js --skip-images

# Combine options
node migrate-sanity-to-payload-with-images.js --force --site wondersofrome

# Dry run with force (see what would be overwritten)
node migrate-sanity-to-payload-with-images.js --dry-run --force
```

---

## 🖼️ How Image Migration Works

### 1. Download from Sanity

```javascript
// Extract image URL from Sanity tour
const imageUrl = sanityTour.mainImage.asset.url;
// Example: https://cdn.sanity.io/images/aknmkkwd/production/abc123-1920x1080.jpg

// Download to temporary directory
const localPath = await downloadImage(imageUrl, 'vatican-tour-main.jpg');
// Saved to: ./temp-images/vatican-tour-main.jpg
```

### 2. Upload to Payload

```javascript
// Create form data with image file
const form = new FormData();
form.append('file', fs.createReadStream(localPath));

// Upload to Payload media API
const response = await fetch('https://admin.wondersofrome.com/api/media', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: form,
});

// Get media document
const media = await response.json();
// Returns: { id: '65f8a9b2...', url: '/media/vatican-tour-main.jpg', ... }
```

### 3. Link to Tour

```javascript
// Create tour with image reference
const tourData = {
  title: 'Vatican Museums Tour',
  slug: 'vatican-museums-tour',
  mainImage: media.id,  // Reference to uploaded image
  // ... other fields
};

await createPayloadTour(tourData);
```

### 4. Cleanup

```javascript
// Delete temporary file
fs.unlinkSync(localPath);

// After all tours processed, remove temp directory
fs.rmSync('./temp-images', { recursive: true });
```

---

## ⏱️ Performance & Timing

### URL-Only Migration
- **Speed:** ~2-5 tours per second
- **Time for 50 tours:** 10-25 seconds
- **Network:** Minimal (only API calls)

### Full Image Migration
- **Speed:** ~0.5-2 tours per second (depends on image sizes)
- **Time for 50 tours:** 5-15 minutes
- **Network:** Heavy (downloads + uploads)

**Breakdown per tour:**
- Download image: 1-3 seconds
- Upload to Payload: 2-5 seconds
- Create tour: 1 second
- **Total:** 4-9 seconds per tour

---

## 💾 Storage Requirements

### Payload Storage

**Estimated sizes:**
- Small image (800x600): ~100-200 KB
- Medium image (1920x1080): ~300-500 KB
- Large image (3840x2160): ~1-2 MB

**For 50 tours:**
- Small images: ~5-10 MB
- Medium images: ~15-25 MB
- Large images: ~50-100 MB

**Recommendation:** Ensure Payload has at least 100-200 MB free storage.

### Temporary Storage

During migration, images are temporarily stored locally:
- Location: `./temp-images/`
- Size: Same as above (deleted after migration)
- Cleanup: Automatic after completion

---

## 🔧 Payload Media Configuration

### Where Images Are Stored

Payload can store images in different locations:

1. **Local Filesystem** (default)
   ```
   /var/www/wondersofrome/wondersofrome/media/
   ```

2. **Cloudflare R2** (if configured)
   ```
   https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/
   ```

3. **AWS S3** (if configured)
   ```
   https://s3.amazonaws.com/your-bucket/
   ```

### Check Your Configuration

```bash
# SSH to server
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197

# Check Payload config
cd /var/www/wondersofrome/wondersofrome
grep -r "upload" payload.config.ts

# Check media directory
ls -lh media/
```

---

## 🎯 Recommended Workflow

### For wondersofrome (Recommended)

**Option A: Full Image Migration** (Best for long-term)

```bash
# 1. Dry run to preview
node migrate-sanity-to-payload-with-images.js --dry-run

# 2. Run full migration
node migrate-sanity-to-payload-with-images.js

# 3. Verify in admin
# Visit https://admin.wondersofrome.com

# 4. Update .env to use Payload only
DATA_SOURCE=payload
```

**Option B: Hybrid Approach** (Fastest, still works)

```bash
# 1. Migrate data only (skip images)
node migrate-sanity-to-payload-with-images.js --skip-images

# 2. Keep hybrid mode
DATA_SOURCE=hybrid

# Result: Payload data + Sanity images (no migration needed)
```

---

## 🐛 Troubleshooting

### Error: "Failed to upload image"

**Possible causes:**
1. Payload media collection not configured
2. Storage quota exceeded
3. File permissions issue

**Solutions:**
```bash
# Check Payload media endpoint
curl https://admin.wondersofrome.com/api/media

# Check storage space
df -h

# Check Payload logs
pm2 logs payload-admin
```

### Error: "Failed to download image"

**Possible causes:**
1. Sanity CDN URL expired
2. Network timeout
3. Invalid image URL

**Solutions:**
```bash
# Test image URL directly
curl -I "https://cdn.sanity.io/images/..."

# Check Sanity API token
echo $SANITY_API_TOKEN

# Increase timeout in script (edit line ~200)
```

### Images Not Showing on Website

**Check:**
1. Payload media URL configuration
2. Image field in tour document
3. Frontend image component

**Debug:**
```bash
# Check tour in Payload API
curl https://admin.wondersofrome.com/api/tours/[tour-id]

# Should show:
{
  "mainImage": {
    "id": "65f8a9b2...",
    "url": "/media/vatican-tour-main.jpg"
  }
}
```

---

## ✅ Success Checklist

After full image migration:

- [ ] All tours migrated successfully
- [ ] Images visible in Payload media library
- [ ] Tours show correct images in Payload admin
- [ ] Website displays images correctly
- [ ] Images load from Payload, not Sanity
- [ ] No broken image links
- [ ] Temporary files cleaned up
- [ ] Storage usage acceptable

---

## 🎉 Summary

### URL-Only Migration
- ⚡ Fast (1-3 minutes)
- 🔗 Images stay on Sanity CDN
- ✅ Good for testing or hybrid mode

### Full Image Migration
- 🖼️ Complete (5-15 minutes)
- 💾 Images in Payload storage
- ✅ Best for full independence

**Choose based on your needs:**
- **Need speed?** → URL-only migration
- **Need independence?** → Full image migration
- **Want both?** → Hybrid mode (URL-only + keep Sanity)

---

**Ready to migrate images? Let's do it! 🚀**

```bash
# Preview first
node migrate-sanity-to-payload-with-images.js --dry-run

# Then migrate
node migrate-sanity-to-payload-with-images.js
```
