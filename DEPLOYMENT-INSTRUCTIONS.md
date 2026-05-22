# 🚀 Deployment Instructions for Hetzner Server

**Server:** 91.98.205.197  
**Current Status:** ⚠️ Server has OLD code, needs deployment  
**New Features:** Ticket viewing system with deep linking

---

## ⚡ Quick Deploy (Recommended)

I've created an automated deployment script for you:

```bash
cd /home/abiilesh/travelwebsite
./deploy-to-hetzner.sh
```

This script will:
1. ✅ Build the project locally
2. ✅ Create a deployment package
3. ✅ Upload to server
4. ✅ Backup current version
5. ✅ Extract new code
6. ✅ Install dependencies
7. ✅ Restart PM2
8. ✅ Verify deployment

**Time:** ~5-10 minutes

---

## 📋 What Gets Deployed

### New Files (Ticket System)
- `src/lib/ticketService.ts` - Fetch bookings from Payload
- `src/components/TicketDisplay.tsx` - Ticket UI component
- `src/components/AppDownloadPrompt.tsx` - Mobile app banner
- `src/app/ticket/[id]/page.tsx` - Ticket viewing page
- `public/.well-known/apple-app-site-association` - iOS deep links
- `public/.well-known/assetlinks.json` - Android deep links

### Updated Files
- `src/app/api/tickets/[id]/route.ts` - JSON + PDF support
- `src/lib/email-templates.ts` - Added ticket link button

---

## 🔍 Current Status

### ✅ Local Code
- Location: `/home/abiilesh/travelwebsite`
- Status: **Up to date**
- Has new ticket system: **Yes**
- Git status: **Clean, synced with GitHub**

### ✅ GitHub Repository
- Repo: `orangeflowai/agencysite`
- Branch: `main`
- Status: **Synced with local**
- Latest commit: `d8d638028`

### ❌ Hetzner Server
- Location: `/var/www/wondersofrome`
- Status: **OUTDATED**
- Has new ticket system: **No**
- Last update: **May 18, 2026**
- Missing: **8 new/updated files**

---

## 🛠️ Manual Deployment (Alternative)

If you prefer to deploy manually:

### Step 1: Build Locally
```bash
cd /home/abiilesh/travelwebsite/wondersofrome/wondersofrome
npm run build
```

### Step 2: Create Package
```bash
tar -czf /tmp/wonders-deploy.tar.gz \
  .next public src package.json package-lock.json \
  next.config.ts tsconfig.json middleware.ts \
  ecosystem.config.js .env.example
```

### Step 3: Upload to Server
```bash
scp /tmp/wonders-deploy.tar.gz root@91.98.205.197:/tmp/
```

### Step 4: Deploy on Server
```bash
ssh root@91.98.205.197

# Stop PM2
pm2 stop wondersofrome

# Backup current version
cp -r /var/www/wondersofrome /var/www/wondersofrome-backup-$(date +%Y%m%d-%H%M%S)

# Extract new version
cd /var/www/wondersofrome
tar -xzf /tmp/wonders-deploy.tar.gz --overwrite

# Install dependencies
npm install --production

# Restart PM2
pm2 restart wondersofrome
pm2 save

# Check status
pm2 status
pm2 logs wondersofrome --lines 50
```

---

## ✅ Post-Deployment Verification

After deployment, verify everything works:

### 1. Check Files Exist
```bash
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/lib/ticketService.ts"
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/components/TicketDisplay.tsx"
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/app/ticket"
```

### 2. Check PM2 Status
```bash
ssh root@91.98.205.197 "pm2 status"
```

### 3. Check Logs
```bash
ssh root@91.98.205.197 "pm2 logs wondersofrome --lines 100"
```

### 4. Test Ticket Endpoint
```bash
# Test API (should return 404 for non-existent ticket, not 500)
curl https://wondersofrome.com/api/tickets/TEST123?format=json

# Test page (should load, not 404)
curl -I https://wondersofrome.com/ticket/TEST123
```

### 5. Make Test Booking
1. Go to https://wondersofrome.com
2. Book any tour
3. Complete payment
4. Check confirmation email
5. Click "View My Ticket" button
6. Verify ticket displays correctly

---

## 🔄 Rollback (If Needed)

If something goes wrong, rollback to previous version:

```bash
ssh root@91.98.205.197

# Stop current version
pm2 stop wondersofrome

# Find latest backup
ls -lt /var/www/wondersofrome-backup-* | head -1

# Restore backup
BACKUP_DIR=$(ls -td /var/www/wondersofrome-backup-* | head -1)
rm -rf /var/www/wondersofrome
cp -r $BACKUP_DIR /var/www/wondersofrome

# Restart
pm2 restart wondersofrome
```

---

## 📊 Deployment Checklist

Before deploying:
- [x] Code committed to GitHub
- [x] Build successful locally
- [x] All tests passing
- [ ] Backup current server code
- [ ] Deploy new code
- [ ] Verify files exist
- [ ] Check PM2 status
- [ ] Test ticket viewing
- [ ] Verify email contains link
- [ ] Monitor logs for errors

After deploying:
- [ ] Test with real booking
- [ ] Check mobile responsiveness
- [ ] Verify QR code generation
- [ ] Test PDF download
- [ ] Test calendar integration
- [ ] Monitor for 24 hours

---

## 🚨 Important Notes

1. **Environment Variables**
   - The `.env` file is NOT included in deployment package
   - Current `.env` on server will be preserved
   - No need to reconfigure environment variables

2. **Node Modules**
   - `npm install --production` runs on server
   - Only production dependencies installed
   - Reduces deployment size

3. **PM2 Process**
   - Process name: `wondersofrome`
   - Port: `3002`
   - Auto-restart: Enabled
   - Saved to PM2 startup

4. **Nginx**
   - Already configured
   - No changes needed
   - Proxies to port 3002

---

## 📞 Troubleshooting

### Issue: PM2 won't start
```bash
ssh root@91.98.205.197
cd /var/www/wondersofrome
pm2 logs wondersofrome --err --lines 100
```

### Issue: Build errors
```bash
# Check Node version (should be 20.x)
ssh root@91.98.205.197 "node --version"

# Reinstall dependencies
ssh root@91.98.205.197 "cd /var/www/wondersofrome && rm -rf node_modules && npm install"
```

### Issue: Ticket page 404
```bash
# Check if route exists
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/app/ticket"

# Check Next.js build
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/.next/server/app/ticket"
```

### Issue: Email doesn't have ticket link
- Check if `email-templates.ts` was updated
- Verify `ticketUrl` variable is defined
- Test email template locally first

---

## 🎯 Expected Results After Deployment

✅ Customers can view tickets at: `https://wondersofrome.com/ticket/{BOOKING_ID}`  
✅ Confirmation emails include "View My Ticket" button  
✅ QR codes generated for all bookings  
✅ PDF download works  
✅ Add to calendar works  
✅ Mobile app download banner shows on mobile  
✅ API supports JSON and PDF formats  

---

## 📈 Monitoring

After deployment, monitor:

1. **PM2 Logs**
   ```bash
   ssh root@91.98.205.197 "pm2 logs wondersofrome --lines 100"
   ```

2. **Nginx Logs**
   ```bash
   ssh root@91.98.205.197 "tail -f /var/log/nginx/wondersofrome.error.log"
   ```

3. **Server Resources**
   ```bash
   ssh root@91.98.205.197 "pm2 monit"
   ```

4. **Ticket Views**
   - Check Payload CMS for booking records
   - Monitor ticket page views in analytics
   - Track email click-through rates

---

## 🚀 Ready to Deploy?

Run the deployment script:

```bash
cd /home/abiilesh/travelwebsite
./deploy-to-hetzner.sh
```

Or deploy manually following the steps above.

**Estimated Time:** 5-10 minutes  
**Downtime:** ~30 seconds (during PM2 restart)  
**Risk:** Low (backup created automatically)

---

**Questions?** Check the logs or rollback if needed.  
**Success?** Test with a real booking and monitor for 24 hours.
