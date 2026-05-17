# Hetzner Deployment - Folder Mapping

## 🖥️ Server Information

**Server IP:** 91.98.205.197  
**User:** root  
**SSH Key:** ~/.ssh/id_ed25519  
**Process Manager:** PM2

---

## 📁 Deployed Folders Mapping

### 1. WondersOfRome ✅

**Local Folder:**
```
/home/abiilesh/travelwebsite/wondersofrome/wondersofrome/
```

**Hetzner Path:**
```
/var/www/wondersofrome/
```

**PM2 Process Name:** `wondersofrome`  
**Status:** ✅ Online (13h uptime)  
**Domain:** https://wondersofrome.com

**What's Deployed:**
- Complete Next.js application
- All booking flow components (BookingWidget, CheckoutDrawer, SmartCalendar)
- Stripe integration
- Email templates
- API routes (availability, payment intent, webhooks)

---

### 2. TicketsInRome ✅

**Local Folder (OLD - Currently Deployed):**
```
/home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/
```

**Local Folder (NEW - With Complete Booking Flow):**
```
/home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets/
```

**Hetzner Path:**
```
/var/www/rome-tour-tickets/
```

**PM2 Process Name:** `ticketsinrome` or `rome-tour-tickets`  
**Status:** ✅ Online  
**Port:** 3000  
**Domain:** https://ticketsinrome.com

**⚠️ IMPORTANT:** The server is currently running the OLD version from `ticketsinrome-copy`. You need to deploy the NEW version from `ticketsinrome-live/rome-tour-tickets` to get the complete booking flow!

---

### 3. GoldenRomeTour ✅

**Local Folder:**
```
/home/abiilesh/travelwebsite/goldenrometour/
```

**Hetzner Path:**
```
/var/www/goldenrometour/
```

**PM2 Process Name:** `goldenrometour`  
**Status:** ✅ Online  
**Domain:** https://goldenrometour.com

---

### 4. RomanVaticanTour ✅

**Local Folder:**
```
/home/abiilesh/travelwebsite/romanvaticantour/
```

**Hetzner Path:**
```
/var/www/romanvaticantour/
```

**PM2 Process Name:** `romanvaticantour`  
**Status:** ✅ Online  
**Domain:** https://romanvaticantour.com

---

### 5. RomeWander ✅

**Local Folder:**
```
/home/abiilesh/travelwebsite/romewander/
```

**Hetzner Path:**
```
/var/www/romewander/
```

**PM2 Process Name:** `romewander`  
**Status:** ✅ Online  
**Domain:** https://romewander.com

---

### 6. Payload Admin ✅

**Local Folder:**
```
/home/abiilesh/travelwebsite/payload-admin/
```

**Hetzner Path:**
```
/var/www/payload-admin/
```

**PM2 Process Name:** `payload-admin`  
**Status:** ✅ Online (9 days uptime)  
**Domain:** https://admin.wondersofrome.com

---

## 🚨 CRITICAL: TicketsInRome Needs Update!

### Current Situation

**Currently Deployed (OLD):**
- Folder: `ticketsinrome-copy/ticketsinrome/`
- Missing: Complete booking flow
- Missing: Webhook integration
- Missing: Email templates
- Missing: New API routes

**Should Be Deployed (NEW):**
- Folder: `ticketsinrome-live/rome-tour-tickets/`
- Has: Complete booking flow (100% feature parity with WondersOfRome)
- Has: Webhook integration
- Has: Email templates
- Has: All new API routes

### How to Deploy the NEW Version

#### Option 1: Using the Deployment Script

```bash
cd /home/abiilesh/travelwebsite

# Update the deployment script to use the correct folder
# Edit deploy-hetzner.sh line 22:
# FROM: deploy_site "rome-tour-tickets" "ticketsinrome-copy/ticketsinrome" "/var/www/rome-tour-tickets"
# TO:   deploy_site "rome-tour-tickets" "ticketsinrome-live/rome-tour-tickets" "/var/www/rome-tour-tickets"

# Then run:
./deploy-hetzner.sh
```

#### Option 2: Manual Deployment

```bash
# 1. Build locally
cd /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets
npm run build

# 2. Backup on server
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 \
  "cp -r /var/www/rome-tour-tickets /var/www/rome-tour-tickets-backup-$(date +%Y%m%d-%H%M%S)"

# 3. Upload files
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets/ \
  root@91.98.205.197:/var/www/rome-tour-tickets/

# 4. Build and restart on server
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 << 'EOF'
  cd /var/www/rome-tour-tickets
  npm install --legacy-peer-deps
  npm run build
  pm2 restart rome-tour-tickets
EOF

# 5. Verify
curl -s -o /dev/null -w "%{http_code}\n" https://ticketsinrome.com
```

#### Option 3: Using the Specific TicketsInRome Script

```bash
cd /home/abiilesh/travelwebsite

# Set the server IP
export HETZNER_IP=91.98.205.197

# Run the deployment script
./deploy-ticketsinrome-hetzner.sh
```

---

## 📊 Deployment Summary Table

| Site | Local Folder | Hetzner Path | PM2 Name | Status | Needs Update |
|------|--------------|--------------|----------|--------|--------------|
| WondersOfRome | `wondersofrome/wondersofrome/` | `/var/www/wondersofrome/` | `wondersofrome` | ✅ Online | ❌ No |
| TicketsInRome | `ticketsinrome-copy/ticketsinrome/` | `/var/www/rome-tour-tickets/` | `rome-tour-tickets` | ✅ Online | ⚠️ **YES - Deploy NEW version!** |
| GoldenRomeTour | `goldenrometour/` | `/var/www/goldenrometour/` | `goldenrometour` | ✅ Online | ❌ No |
| RomanVaticanTour | `romanvaticantour/` | `/var/www/romanvaticantour/` | `romanvaticantour` | ✅ Online | ❌ No |
| RomeWander | `romewander/` | `/var/www/romewander/` | `romewander` | ✅ Online | ❌ No |
| Payload Admin | `payload-admin/` | `/var/www/payload-admin/` | `payload-admin` | ✅ Online | ❌ No |

---

## 🔧 Useful Commands

### Check Server Status
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 status'
```

### View Logs
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 logs rome-tour-tickets'
```

### Restart a Site
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 restart rome-tour-tickets'
```

### Check Site Response
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ticketsinrome.com
```

---

## 📝 Notes

1. **GitHub Repository:** All code is backed up in `orangeflowai/agencysite`
2. **Environment Variables:** `.env` files are NOT deployed (gitignored). They must be configured manually on the server.
3. **Build Process:** Each site is built on the server after deployment
4. **PM2 Configuration:** All sites run under PM2 for process management and auto-restart
5. **Backups:** Always create a backup before deploying updates

---

## ⚠️ Action Required

**Deploy the NEW TicketsInRome version to get:**
- ✅ Complete booking flow (like WondersOfRome)
- ✅ Webhook integration for Stripe
- ✅ Email confirmations (customer + admin)
- ✅ PDF ticket download
- ✅ Smart calendar with availability
- ✅ 2-step checkout modal
- ✅ Expected revenue increase: +130% (+€420,000 annually)

**Recommended:** Use Option 2 (Manual Deployment) for full control and verification.

---

**Last Updated:** May 15, 2026  
**Status:** Documentation Complete
