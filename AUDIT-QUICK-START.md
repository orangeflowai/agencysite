# 🚀 Quick Start - Complete Tour & Image Audit

## Run Complete Audit (One Command)

```bash
cd /home/abiilesh/travelwebsite
./complete-audit.sh
```

**This will check:**
- ✅ All tours across all 5 websites
- ✅ All images and their accessibility
- ✅ All frontend displays
- ✅ All API endpoints

**Time:** ~5-10 minutes

---

## What You'll Get

### 1. Backend Tour Audit
- Tour data completeness for each site
- Image accessibility per tour
- Status and pricing verification
- Tenant assignment check
- **Health score per site**

### 2. Image Verification
- All media files checked
- Broken images identified
- Image source analysis (R2 vs Sanity)
- **Overall image health score**

### 3. Frontend Verification
- Homepage accessibility
- API functionality
- Tours displayed on each site
- **Frontend health score**

---

## Results Location

Results saved to: `audit-results-YYYYMMDD-HHMMSS/`

```bash
# View backend audit
cat audit-results-*/1-backend-tour-audit.txt

# View image verification
cat audit-results-*/2-image-verification.txt

# View frontend check
cat audit-results-*/3-frontend-verification.txt
```

---

## Quick Individual Checks

### Just check tours:
```bash
node audit-all-sites-tours.js
```

### Just check images:
```bash
node verify-all-images.js
```

### Just check frontend:
```bash
node check-frontend-tours.js
```

---

## Websites Checked

1. 🏛️ **wondersofrome** - https://wondersofrome.com
2. 🎫 **ticketsinrome** - https://ticketsinrome.com
3. ⭐ **goldenrometour** - https://goldenrometour.com
4. ⛪ **romanvaticantour** - https://romanvaticantour.com
5. 🚶 **romewander** - https://romewander.com

---

## Understanding Results

### Health Scores:
- **90-100%** 🟢 Excellent
- **70-89%** 🟡 Good (minor issues)
- **Below 70%** 🔴 Needs attention

### Tour Status:
- **GOOD** ✓ - No issues
- **OK** ⚠ - Minor warnings
- **NEEDS_FIX** ✗ - Critical issues

---

## Common Issues You Might Find

| Issue | What It Means | How to Fix |
|-------|---------------|------------|
| Tours not visible | Status is 'draft' | Change to 'live' in admin |
| Wrong tenant | Tour assigned to wrong site | Update tenant field |
| Image not accessible | Broken image URL | Re-upload or fix URL |
| No price | Price is 0 or missing | Set price in admin |
| Missing description | No tour description | Add description |

---

## After Running Audit

1. **Review the results** - Check health scores
2. **Fix critical issues** - Red items first
3. **Address warnings** - Yellow items next
4. **Verify fixes** - Run audit again
5. **Monitor regularly** - Run weekly

---

## Need More Details?

See `AUDIT-GUIDE.md` for:
- Detailed explanations
- Troubleshooting guide
- Fix instructions
- Support commands

---

## Quick Fix Commands

### Fix tour status:
```bash
# In Payload admin: https://admin.wondersofrome.com
# Go to Tours → Select tour → Change status to 'live'
```

### Check specific tour:
```bash
curl "https://admin.wondersofrome.com/api/tours?where[slug][equals]=tour-slug"
```

### Check specific image:
```bash
curl -I "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/image.jpg"
```

---

**Ready? Run the audit now! 👆**

```bash
./complete-audit.sh
```
