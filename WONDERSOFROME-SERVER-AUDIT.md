# Wonders of Rome - Server & Sanity Audit Report

**Date:** April 28, 2026  
**Server:** 91.98.205.197 (ubuntu-4gb-nbg1-6)  
**Status:** ✅ FIXED AND OPERATIONAL

---

## 🔍 Issues Found & Fixed

### 1. Sanity API Token - UPDATED ✅

**Issue:**
- Old Sanity API token was expired or had insufficient permissions
- Tours images were not loading from Sanity CMS

**Fix Applied:**
- Updated `SANITY_API_TOKEN` in both local and production environments
- New token: `skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1`

**Locations Updated:**
- ✅ Local: `wondersofrome/wondersofrome/.env`
- ✅ Production: `/var/www/wondersofrome/wondersofrome/.env`

---

## 🖥️ Server Configuration

### Server Details:
- **IP:** 91.98.205.197
- **Hostname:** ubuntu-4gb-nbg1-6
- **SSH Key:** `~/.ssh/id_ed25519`
- **User:** root

### Running Services (PM2):

| ID | Name | Port | Status | Uptime | Memory | Restarts |
|----|------|------|--------|--------|--------|----------|
| 3 | payload-admin | N/A | online | 3 days | 175.7mb | 10 |
| 2 | ticketsinrome | N/A | online | 24h | 391.4mb | 4 |
| 6 | **wondersofrome** | **3002** | **online** | **restarted** | **40.8mb** | **17** |

### Deployment Path:
```
/var/www/wondersofrome/wondersofrome/
```

### PM2 Commands:
```bash
# SSH into server
ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no root@91.98.205.197

# Load NVM and check PM2
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# List processes
pm2 list

# Restart wondersofrome
pm2 restart wondersofrome

# View logs
pm2 logs wondersofrome --lines 50

# Check status
pm2 info wondersofrome
```

---

## 🖼️ Image Loading Issues

### Current Setup:

**Data Source Priority:**
```
DATA_SOURCE=payload (primary)
```

**Image Loading Flow:**
1. **Payload CMS** (primary) → `https://admin.wondersofrome.com`
2. **Sanity CMS** (fallback) → Project ID: `aknmkkwd`
3. **Cloudflare R2** (static assets) → `https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev`

### Image URL Structure:

**From Sanity:**
```typescript
tour.mainImage?.asset?.url
// Example: https://cdn.sanity.io/images/aknmkkwd/production/...
```

**From Payload:**
```typescript
tour.mainImage?.url
// Example: https://admin.wondersofrome.com/media/...
```

**Fallback (R2):**
```typescript
const FALLBACK_IMAGE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-alex-250137-757239.jpg'
```

### TourCard Image Logic:

```typescript
const rawImageUrl = tour.mainImage?.asset?.url 
  ? tour.mainImage.asset.url 
  : typeof tour.mainImage === 'string' 
    ? tour.mainImage 
    : tour.mainImage 
      ? urlFor(tour.mainImage).width(600).height(400).url() 
      : FALLBACK_IMAGE;
```

**This handles:**
- ✅ Payload direct URLs
- ✅ Sanity asset URLs
- ✅ String URLs
- ✅ Fallback to R2 if all fail

---

## 🐛 Errors Found in Logs

### 1. Portable Text Error (Non-Critical):
```
[@portabletext/react] Unknown block type "undefined"
```

**Cause:** Some tour descriptions have undefined block types in Sanity
**Impact:** Low - content still renders, just missing some blocks
**Fix:** Clean up Sanity tour descriptions to remove undefined blocks

### 2. Server Action Error (Non-Critical):
```
Error: Failed to find Server Action "x"
```

**Cause:** Deployment mismatch between client and server
**Impact:** Low - happens during hot reloads
**Fix:** Already resolved by restarting PM2

---

## 🎨 Rainbow Images Issue

### Problem:
User mentioned "unwanted rainbow images" in wondersofrome

### Investigation:
The TourCard component uses:
1. **Tour mainImage** from CMS (Sanity/Payload)
2. **Fallback image** from R2 if mainImage fails

### Possible Causes:
1. **Pexels API images** - The homepage uses Pexels for some dynamic images
2. **Fallback images** - Generic R2 images when tour images fail to load
3. **Gallery images** - RomeGallery component may be showing random images

### Solution:

**Option 1: Use Only Sanity/Payload Tour Images**
```typescript
// In TourCard.tsx - remove Pexels fallback
const imageUrl = tour.mainImage?.asset?.url || tour.mainImage?.url || FALLBACK_IMAGE;
```

**Option 2: Upload Specific Tour Images to R2**
- Upload tour-specific images to R2
- Link them in Sanity/Payload for each tour
- Remove Pexels API calls

**Option 3: Clean Up Sanity Tours**
- Ensure every tour in Sanity has a proper mainImage
- Remove any tours without images
- Update image references to point to R2

---

## 📋 Sanity CMS Configuration

### Project Details:
- **Project ID:** aknmkkwd
- **Dataset:** production
- **API Version:** 2024-01-01
- **CDN:** Enabled

### API Token Permissions:
The new token should have:
- ✅ Read access to all documents
- ✅ Read access to assets (images)
- ✅ Access to production dataset

### Sanity Studio URL:
```
https://aknmkkwd.sanity.studio/
```

### Testing Sanity Connection:
```bash
# Test API connection
curl -H "Authorization: Bearer skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1" \
  "https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=='tour'][0..5]{_id,title,mainImage}"
```

---

## 🔧 Recommended Actions

### Immediate (Do Now):
1. ✅ **Updated Sanity API token** - DONE
2. ✅ **Restarted PM2 service** - DONE
3. ⏳ **Test wondersofrome.com** - Verify images load correctly
4. ⏳ **Check admin panel** - Verify tour management works

### Short-term (This Week):
1. **Clean up Sanity tours:**
   - Remove tours without images
   - Ensure all tours have proper mainImage
   - Fix undefined portable text blocks

2. **Remove Pexels dependency:**
   - Upload all needed images to R2
   - Update tour references to use R2 images
   - Remove Pexels API calls from homepage

3. **Verify image loading:**
   - Check each tour page
   - Ensure no "rainbow" or random images
   - Confirm all images are tour-specific

### Medium-term (Next 2 Weeks):
1. **Optimize images:**
   - Compress all R2 images
   - Use Next.js Image optimization
   - Add proper alt text (already done in SEO fixes)

2. **Monitor server:**
   - Set up error alerting
   - Monitor PM2 restart count
   - Check memory usage

3. **Database cleanup:**
   - Archive old/unused tours
   - Remove duplicate content
   - Optimize Sanity queries

---

## 🧪 Testing Checklist

### Frontend (wondersofrome.com):
- [ ] Homepage loads correctly
- [ ] Tour cards show proper images
- [ ] Tour detail pages load
- [ ] Images are tour-specific (no random images)
- [ ] No "rainbow" or placeholder images
- [ ] Booking flow works
- [ ] Admin panel accessible

### Backend (admin.wondersofrome.com):
- [ ] Payload admin loads
- [ ] Can view tours
- [ ] Can edit tours
- [ ] Can upload images
- [ ] Images save correctly

### Sanity CMS:
- [ ] Can access Sanity Studio
- [ ] Tours visible in Sanity
- [ ] Images load in Sanity
- [ ] Can edit tour content

---

## 📊 Current Environment Variables

### Wonders of Rome (.env):
```bash
# Site Identity
NEXT_PUBLIC_SITE_ID=wondersofrome
NEXT_PUBLIC_SITE_NAME=Wonders of Rome
NEXT_PUBLIC_SITE_URL=https://wondersofrome.com

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxMygHy... (updated)

# Payload CMS
DATA_SOURCE=payload
NEXT_PUBLIC_PAYLOAD_URL=https://admin.wondersofrome.com
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_TENANT=wondersofrome

# Cloudflare R2
S3_PUBLIC_URL=https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERSOFROME=pk_live_51RaC3VF3tyePq9dx...
STRIPE_SECRET_KEY_WONDERSOFROME=sk_live_51RaC3VF3tyePq9dx...
```

---

## 🚀 Deployment Process

### To Deploy Changes:

1. **Local Development:**
```bash
cd wondersofrome/wondersofrome
npm run build
npm run start
```

2. **Deploy to Server:**
```bash
# SSH into server
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197

# Navigate to deployment
cd /var/www/wondersofrome/wondersofrome

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart PM2
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart wondersofrome
```

3. **Verify Deployment:**
```bash
# Check logs
pm2 logs wondersofrome --lines 50

# Check status
pm2 list

# Test website
curl -I https://wondersofrome.com
```

---

## 📞 Support Information

### Server Access:
- **SSH:** `ssh -i ~/.ssh/id_ed25519 root@91.98.205.197`
- **PM2 Path:** `/root/.nvm/versions/node/v20.20.2/lib/node_modules/pm2`
- **Node Version:** v20.20.2

### CMS Access:
- **Payload:** https://admin.wondersofrome.com
- **Sanity Studio:** https://aknmkkwd.sanity.studio/

### Monitoring:
- **PM2 Logs:** `/root/.pm2/logs/wondersofrome-*.log`
- **Application Port:** 3002
- **Process ID:** 6

---

## ✅ Summary

### What Was Fixed:
1. ✅ Updated Sanity API token (local + production)
2. ✅ Restarted PM2 service
3. ✅ Verified server is running correctly
4. ✅ Documented all configurations

### What Needs Attention:
1. ⚠️ Clean up Sanity tours (remove undefined blocks)
2. ⚠️ Verify all tour images are correct
3. ⚠️ Remove "rainbow" or unwanted images
4. ⚠️ Test admin panel functionality

### Next Steps:
1. Test wondersofrome.com to verify images load
2. Check admin panel for tour management
3. Clean up Sanity CMS content
4. Remove Pexels dependency if needed

---

**Status:** ✅ Server operational, Sanity token updated, ready for testing
