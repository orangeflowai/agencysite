# Code Synchronization Report
**Date:** May 19, 2026  
**Checked:** Local → GitHub → Hetzner Server

---

## 📊 Summary

| Location | Status | Last Updated | Has New Code |
|----------|--------|--------------|--------------|
| **Local** (`/home/abiilesh/travelwebsite`) | ✅ Up to date | May 19, 2026 | ✅ Yes |
| **GitHub** (`orangeflowai/agencysite`) | ✅ Synced | May 19, 2026 | ✅ Yes |
| **Hetzner Server** (`91.98.205.197:/var/www/wondersofrome`) | ❌ **OUTDATED** | May 18, 2026 | ❌ **No** |

---

## ✅ Local Repository Status

**Location:** `/home/abiilesh/travelwebsite`

**Git Remote:**
```
origin: git@github.com:orangeflowai/agencysite.git
```

**Branch:** `main`

**Status:** Clean working tree, no uncommitted changes

**Latest Commits:**
```
d8d638028 (HEAD -> main, origin/main) docs: Add implementation status and ticket system flow diagrams
156460efe feat: Implement deep linking ticket viewing system for wondersofrome
0e241b1e0 feat: Copy GoldenRomeTour UI to RomanVaticanTour
77ad6705a fix: Add missing fields to Sanity queries
e63e1675a docs: Confirm GoldenRomeTour data source
```

**New Files Present:**
- ✅ `wondersofrome/wondersofrome/src/lib/ticketService.ts`
- ✅ `wondersofrome/wondersofrome/src/components/TicketDisplay.tsx`
- ✅ `wondersofrome/wondersofrome/src/components/AppDownloadPrompt.tsx`
- ✅ `wondersofrome/wondersofrome/src/app/ticket/[id]/page.tsx`
- ✅ `wondersofrome/wondersofrome/public/.well-known/apple-app-site-association`
- ✅ `wondersofrome/wondersofrome/public/.well-known/assetlinks.json`

**Updated Files:**
- ✅ `wondersofrome/wondersofrome/src/app/api/tickets/[id]/route.ts`
- ✅ `wondersofrome/wondersofrome/src/lib/email-templates.ts`

---

## ✅ GitHub Repository Status

**Repository:** `orangeflowai/agencysite`

**Branch:** `main`

**Status:** ✅ **Fully Synced with Local**

**Latest Commit:** `d8d638028` (same as local)

**Verification:**
```bash
git fetch origin
git diff origin/main
# Result: No differences
```

**Conclusion:** GitHub has ALL the latest code including the new ticket system.

---

## ❌ Hetzner Server Status

**Server:** `91.98.205.197`

**Location:** `/var/www/wondersofrome`

**Status:** ❌ **OUTDATED - NOT SYNCED**

### Issues Found:

1. **Not a Git Repository**
   - The `/var/www/wondersofrome` directory is NOT a git repository
   - No `.git` folder exists
   - Cannot pull updates from GitHub

2. **Missing New Files**
   - ❌ `src/lib/ticketService.ts` - NOT FOUND
   - ❌ `src/components/TicketDisplay.tsx` - NOT FOUND
   - ❌ `src/components/AppDownloadPrompt.tsx` - NOT FOUND
   - ❌ `src/app/ticket/[id]/page.tsx` - NOT FOUND
   - ❌ `public/.well-known/apple-app-site-association` - NOT FOUND
   - ❌ `public/.well-known/assetlinks.json` - NOT FOUND

3. **Outdated Files**
   - `src/lib/email-templates.ts` - Last modified: **April 24, 2026** (outdated)
   - `src/app/api/tickets/[id]/route.ts` - Last modified: **April 16, 2026** (outdated)
   - `.next` build folder - Last modified: **May 18, 2026** (outdated)

4. **Current Deployment Method**
   - Uses PM2 for process management
   - Running on port 3002
   - No automated deployment from GitHub
   - Manual deployment via tar.gz file (`wonders-deploy.tar.gz`)

### Server Configuration:

**PM2 App:** `wondersofrome`
```javascript
{
  name: 'wondersofrome',
  script: 'node_modules/.bin/next',
  args: 'start -p 3002',
  instances: 1,
  autorestart: true,
  env: {
    NODE_ENV: 'production',
    PORT: '3002',
    DATA_SOURCE: 'payload',
    NEXT_PUBLIC_SITE_ID: 'wondersofrome'
  }
}
```

---

## 🚨 Critical Issue

**The Hetzner server is running OLD CODE without the new ticket viewing system!**

This means:
- ❌ Customers CANNOT view their tickets online
- ❌ Email confirmation does NOT have "View My Ticket" button
- ❌ `/ticket/[id]` route does NOT exist
- ❌ API endpoints do NOT support JSON format
- ❌ Universal links NOT configured

---

## 🔧 How to Fix: Deploy New Code to Hetzner

### Option 1: Manual Deployment (Quick)

1. **Build locally:**
   ```bash
   cd /home/abiilesh/travelwebsite/wondersofrome/wondersofrome
   npm run build
   ```

2. **Create deployment package:**
   ```bash
   tar -czf wonders-deploy-$(date +%Y%m%d-%H%M%S).tar.gz \
     .next \
     public \
     src \
     node_modules \
     package.json \
     package-lock.json \
     next.config.ts \
     tsconfig.json \
     middleware.ts \
     ecosystem.config.js \
     .env.example
   ```

3. **Upload to server:**
   ```bash
   scp wonders-deploy-*.tar.gz root@91.98.205.197:/tmp/
   ```

4. **Deploy on server:**
   ```bash
   ssh root@91.98.205.197
   cd /var/www/wondersofrome
   
   # Backup current version
   pm2 stop wondersofrome
   cp -r /var/www/wondersofrome /var/www/wondersofrome-backup-$(date +%Y%m%d-%H%M%S)
   
   # Extract new version
   tar -xzf /tmp/wonders-deploy-*.tar.gz -C /var/www/wondersofrome
   
   # Restart
   pm2 restart wondersofrome
   pm2 save
   ```

### Option 2: Git-Based Deployment (Recommended)

1. **Initialize git on server:**
   ```bash
   ssh root@91.98.205.197
   cd /var/www/wondersofrome
   
   # Backup current version
   pm2 stop wondersofrome
   mv /var/www/wondersofrome /var/www/wondersofrome-backup-$(date +%Y%m%d-%H%M%S)
   
   # Clone from GitHub
   cd /var/www
   git clone git@github.com:orangeflowai/agencysite.git wondersofrome-new
   cd wondersofrome-new/wondersofrome/wondersofrome
   
   # Copy .env from backup
   cp /var/www/wondersofrome-backup-*/. env .env
   
   # Install and build
   npm install
   npm run build
   
   # Move to production location
   cd /var/www
   mv wondersofrome-new/wondersofrome/wondersofrome wondersofrome
   rm -rf wondersofrome-new
   
   # Restart
   cd /var/www/wondersofrome
   pm2 restart wondersofrome
   pm2 save
   ```

2. **Future updates (after git setup):**
   ```bash
   ssh root@91.98.205.197
   cd /var/www/wondersofrome
   
   # Pull latest
   git pull origin main
   
   # Rebuild
   npm install
   npm run build
   
   # Restart
   pm2 restart wondersofrome
   ```

### Option 3: Automated CI/CD (Best Long-Term)

Set up GitHub Actions to automatically deploy on push:

1. **Create `.github/workflows/deploy.yml` in repository:**
   ```yaml
   name: Deploy to Hetzner
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
         
         - name: Install dependencies
           run: |
             cd wondersofrome/wondersofrome
             npm ci
         
         - name: Build
           run: |
             cd wondersofrome/wondersofrome
             npm run build
         
         - name: Deploy to server
           uses: appleboy/scp-action@master
           with:
             host: 91.98.205.197
             username: root
             key: ${{ secrets.SSH_PRIVATE_KEY }}
             source: "wondersofrome/wondersofrome/.next,wondersofrome/wondersofrome/public,wondersofrome/wondersofrome/src"
             target: "/var/www/wondersofrome"
         
         - name: Restart PM2
           uses: appleboy/ssh-action@master
           with:
             host: 91.98.205.197
             username: root
             key: ${{ secrets.SSH_PRIVATE_KEY }}
             script: |
               cd /var/www/wondersofrome
               pm2 restart wondersofrome
   ```

2. **Add SSH key to GitHub Secrets:**
   - Generate SSH key on local machine
   - Add public key to server's `~/.ssh/authorized_keys`
   - Add private key to GitHub repository secrets as `SSH_PRIVATE_KEY`

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Backup current server code
- [ ] Copy `.env` file from current deployment
- [ ] Verify all environment variables are set
- [ ] Test build locally first
- [ ] Deploy new code to server
- [ ] Run `npm install` on server
- [ ] Run `npm run build` on server
- [ ] Restart PM2 process
- [ ] Test ticket viewing with real booking
- [ ] Verify email contains ticket link
- [ ] Check server logs for errors
- [ ] Test on mobile devices
- [ ] Monitor for 24 hours

---

## 🔍 Verification Commands

After deployment, verify the new code is running:

```bash
# Check if new files exist
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/lib/ticketService.ts"
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/components/TicketDisplay.tsx"
ssh root@91.98.205.197 "ls -la /var/www/wondersofrome/src/app/ticket"

# Check PM2 status
ssh root@91.98.205.197 "pm2 status"

# Check logs
ssh root@91.98.205.197 "pm2 logs wondersofrome --lines 50"

# Test ticket endpoint
curl https://wondersofrome.com/api/tickets/test123?format=json
```

---

## 📊 File Comparison

| File | Local | GitHub | Server | Status |
|------|-------|--------|--------|--------|
| `src/lib/ticketService.ts` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |
| `src/components/TicketDisplay.tsx` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |
| `src/components/AppDownloadPrompt.tsx` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |
| `src/app/ticket/[id]/page.tsx` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |
| `src/lib/email-templates.ts` | ✅ Updated | ✅ Updated | ❌ Outdated | **NEEDS DEPLOY** |
| `src/app/api/tickets/[id]/route.ts` | ✅ Updated | ✅ Updated | ❌ Outdated | **NEEDS DEPLOY** |
| `public/.well-known/apple-app-site-association` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |
| `public/.well-known/assetlinks.json` | ✅ Exists | ✅ Exists | ❌ Missing | **NEEDS DEPLOY** |

---

## 🎯 Recommendation

**IMMEDIATE ACTION REQUIRED:**

1. **Deploy the new code to Hetzner server** using Option 2 (Git-Based Deployment)
2. **Test thoroughly** with a real booking
3. **Set up automated deployment** using Option 3 (CI/CD) for future updates

**Why Git-Based Deployment is Best:**
- ✅ Easy to update in the future (`git pull`)
- ✅ Version control on server
- ✅ Can rollback if needed
- ✅ Matches local and GitHub exactly
- ✅ No manual tar.gz creation

---

## 📞 Support

If you need help with deployment:
- Server: `ssh root@91.98.205.197`
- PM2 logs: `pm2 logs wondersofrome`
- Nginx logs: `/var/log/nginx/wondersofrome.error.log`

---

**Status:** ⚠️ **ACTION REQUIRED - Server needs deployment**  
**Priority:** 🔴 **HIGH** - New features not available to customers  
**Next Step:** Deploy new code to Hetzner server
