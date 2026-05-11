# 🔍 Complete Tour & Image Audit Guide

## Overview

This audit package checks **everything** across all 5 websites:
- ✅ Tour data completeness
- ✅ Image accessibility
- ✅ Frontend display
- ✅ API functionality
- ✅ Status and pricing
- ✅ Tenant assignments

## 🚀 Quick Start

### Run Complete Audit (All Checks)
```bash
cd /home/abiilesh/travelwebsite
chmod +x complete-audit.sh
./complete-audit.sh
```

This runs all 3 audit phases and saves results to a timestamped directory.

---

## 📋 Individual Audit Scripts

### 1. Backend Tour Audit
**Script:** `audit-all-sites-tours.js`

**What it checks:**
- ✅ All tours in Payload for each website
- ✅ Tour data completeness (title, slug, description, price)
- ✅ Status (draft/live/archived)
- ✅ Tenant assignments
- ✅ Main image accessibility
- ✅ Itinerary, highlights, duration
- ✅ Meeting points

**Run:**
```bash
node audit-all-sites-tours.js
```

**Output:**
- Tour-by-tour analysis for each site
- Issues and warnings per tour
- Health score per site
- Overall statistics

---

### 2. Image Verification
**Script:** `verify-all-images.js`

**What it checks:**
- ✅ All media files in Payload Media collection
- ✅ Tour main images
- ✅ Image URL accessibility (HTTP HEAD requests)
- ✅ Image sources (R2, Sanity, other)
- ✅ Broken/missing images

**Run:**
```bash
node verify-all-images.js
```

**Output:**
- Media collection status
- Tour image status
- Broken image list
- Image source distribution
- Overall image health score

---

### 3. Frontend Verification
**Script:** `check-frontend-tours.js`

**What it checks:**
- ✅ Homepage accessibility for each site
- ✅ API endpoint functionality
- ✅ Tours returned by frontend API
- ✅ Tour data quality on frontend
- ✅ Live vs draft tours
- ✅ Images and pricing on frontend

**Run:**
```bash
node check-frontend-tours.js
```

**Output:**
- Homepage status per site
- API accessibility
- Tour count per site
- Sample tours from each site
- Frontend health score

---

## 🎯 What Gets Checked

### For Each Tour:
| Check | Description |
|-------|-------------|
| **Title** | Must exist |
| **Slug** | Must exist and be unique |
| **Description** | Should exist (warning if missing) |
| **Price** | Must be > 0 |
| **Status** | Should be 'live' for public display |
| **Tenant** | Must match website ID |
| **Main Image** | Must exist and be accessible |
| **Itinerary** | Should have items |
| **Highlights** | Should have items |
| **Duration** | Should be specified |
| **Meeting Point** | Should be specified |

### For Each Image:
| Check | Description |
|-------|-------------|
| **URL Exists** | Image has a URL |
| **Accessible** | HTTP 200 response |
| **Source** | R2, Sanity, or other |
| **Content Type** | Valid image MIME type |

### For Each Website:
| Check | Description |
|-------|-------------|
| **Homepage** | Loads successfully |
| **API Endpoint** | Returns tour data |
| **Tour Count** | Has tours assigned |
| **Live Tours** | Has tours with status='live' |
| **Images** | Tours have accessible images |

---

## 📊 Health Scores

### Tour Health Score
- **90-100%** 🟢 Excellent - All tours complete
- **70-89%** 🟡 Good - Minor issues
- **Below 70%** 🔴 Needs attention - Critical issues

### Image Health Score
- **90-100%** 🟢 Excellent - All images working
- **70-89%** 🟡 Good - Some broken images
- **Below 70%** 🔴 Needs attention - Many broken images

### Frontend Health Score
- **90-100%** 🟢 Excellent - All sites working
- **70-89%** 🟡 Good - Some issues
- **Below 70%** 🔴 Needs attention - Critical issues

---

## 🔧 Common Issues & Fixes

### Issue: Tours not showing on website
**Possible causes:**
1. Status is 'draft' instead of 'live'
2. Wrong tenant assignment
3. API endpoint not working

**Fix:**
```bash
# Check backend
node audit-all-sites-tours.js

# Check frontend
node check-frontend-tours.js

# Fix status in Payload admin
# Visit: https://admin.wondersofrome.com
```

---

### Issue: Images not loading
**Possible causes:**
1. Image URL is broken
2. Image still on Sanity CDN (needs migration)
3. R2 bucket permissions

**Fix:**
```bash
# Check images
node verify-all-images.js

# Migrate Sanity images to R2
# (Use migration script if needed)
```

---

### Issue: Wrong tenant assignment
**Possible causes:**
1. Tour created for wrong site
2. Migration error

**Fix:**
```sql
-- Update tour tenant in database
UPDATE payload_tours 
SET tenant = 'correctsiteid' 
WHERE id = 'tour-id';
```

---

### Issue: No tours on new site
**Possible causes:**
1. No tours created for that tenant
2. All tours are draft status

**Fix:**
1. Create tours in Payload admin
2. Set tenant to correct site ID
3. Set status to 'live'

---

## 📁 Output Files

When you run `complete-audit.sh`, it creates a directory with results:

```
audit-results-YYYYMMDD-HHMMSS/
├── 1-backend-tour-audit.txt      # Tour data audit
├── 2-image-verification.txt      # Image accessibility
└── 3-frontend-verification.txt   # Frontend checks
```

---

## 🌐 Websites Checked

1. **wondersofrome** - https://wondersofrome.com
2. **ticketsinrome** - https://ticketsinrome.com
3. **goldenrometour** - https://goldenrometour.com
4. **romanvaticantour** - https://romanvaticantour.com
5. **romewander** - https://romewander.com

---

## 🔍 Detailed Checks

### Backend Tour Audit
```javascript
// Checks performed:
- tour.title exists
- tour.slug exists and unique
- tour.description exists
- tour.price > 0
- tour.status === 'live'
- tour.tenant === siteId
- tour.mainImage accessible
- tour.itinerary.length > 0
- tour.highlights.length > 0
- tour.duration exists
- tour.meetingPoint exists
```

### Image Verification
```javascript
// Checks performed:
- HTTP HEAD request to image URL
- Response status === 200
- Content-Type is image/*
- Image source (R2, Sanity, other)
- File size (if available)
```

### Frontend Verification
```javascript
// Checks performed:
- Homepage HTTP status === 200
- API endpoint returns JSON
- Tours array has items
- Tours have required fields
- Tours have accessible images
- Live tours count > 0
```

---

## 💡 Tips

1. **Run audits regularly** - Weekly or after major changes
2. **Fix critical issues first** - Red items before yellow
3. **Check after migrations** - Always audit after data migrations
4. **Monitor image sources** - Migrate away from Sanity CDN
5. **Keep tours live** - Draft tours don't show on frontend

---

## 🆘 Troubleshooting

### Audit script fails to run
```bash
# Make sure Node.js is installed
node --version

# Make scripts executable
chmod +x *.js *.sh

# Install dependencies if needed
npm install
```

### "Connection refused" errors
```bash
# Check if Payload is running
curl https://admin.wondersofrome.com/api/tours?limit=1

# Check if websites are accessible
curl https://wondersofrome.com
```

### "Invalid JSON" errors
```bash
# API might be returning HTML instead of JSON
# Check API endpoint directly in browser
# Verify CORS settings
```

---

## 📞 Support Commands

```bash
# Check Payload backend
curl https://admin.wondersofrome.com/api/tours?limit=1

# Check specific site API
curl https://wondersofrome.com/api/tours

# Check image accessibility
curl -I https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/image.jpg

# View audit results
cat audit-results-*/1-backend-tour-audit.txt
```

---

## ✅ Success Criteria

After running audits, you should see:

- ✅ All tours have status 'live'
- ✅ All tours have accessible images
- ✅ All tours have correct tenant
- ✅ All tours have price > 0
- ✅ All websites return tours via API
- ✅ All homepages are accessible
- ✅ Image health score > 90%
- ✅ Tour health score > 90%
- ✅ Frontend health score > 90%

---

**Created:** May 9, 2026  
**Last Updated:** May 9, 2026  
**Version:** 1.0
