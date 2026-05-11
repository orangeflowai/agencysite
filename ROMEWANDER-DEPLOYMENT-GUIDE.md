# 🚀 Rome Wander - Complete Deployment & Setup Guide

## 🔴 Current Issues

1. ❌ **Rome Wander website is NOT deployed** to the server
2. ❌ **No tours exist** for Rome Wander in Payload (tenant=romewander)
3. ❌ **404 errors** when clicking tours on homepage

## ✅ Complete Solution (2 Steps)

### **Step 1: Add Tours to Payload**

Run this script to create 4 sample tours for Rome Wander:

```bash
cd /home/abiilesh/travelwebsite
node add-romewander-tours.js
```

**What it does:**
- Creates 4 tours with `tenant=romewander`
- Sets `status=live` and `active=true`
- Adds proper slugs, prices, descriptions
- Categories: vatican, colosseum, city, hidden-gems

**Tours created:**
1. Vatican Museums & Sistine Chapel (€79)
2. Colosseum Underground & Roman Forum (€89)
3. Rome City Highlights Walking Tour (€45)
4. Catacombs & Appian Way Hidden Gems (€65)

---

### **Step 2: Deploy Rome Wander Website**

```bash
cd /home/abiilesh/travelwebsite
./deploy-romewander.sh
```

**What it does:**
1. Builds Rome Wander locally
2. Uploads to server at `/var/www/romewander`
3. Installs dependencies
4. Starts with PM2 on port 3006
5. Saves PM2 configuration

**Time:** 5-10 minutes

---

## 🌐 Step 3: Configure Nginx (Manual)

After deployment, you need to configure nginx to route `romewander.com` to port 3006.

### **SSH to server:**
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197
```

### **Create nginx config:**
```bash
nano /etc/nginx/sites-available/romewander
```

### **Add this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name romewander.com www.romewander.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name romewander.com www.romewander.com;

    # SSL certificates (use certbot to generate)
    ssl_certificate /etc/letsencrypt/live/romewander.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/romewander.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy to Next.js on port 3006
    location / {
        proxy_pass http://localhost:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3006;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### **Enable the site:**
```bash
ln -s /etc/nginx/sites-available/romewander /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### **Get SSL certificate:**
```bash
certbot --nginx -d romewander.com -d www.romewander.com
```

---

## ✅ Verification Steps

### **1. Check PM2 Status:**
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 list"
```

Should show `romewander` running on port 3006.

### **2. Test Local Server:**
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "curl http://localhost:3006"
```

Should return HTML.

### **3. Check Tours in Payload:**
```bash
curl "https://admin.wondersofrome.com/api/tours?where[tenant][equals]=romewander" \
  -H "Authorization: users API-Key oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE"
```

Should return 4 tours.

### **4. Visit Website:**
```
https://romewander.com
```

Should show homepage with tours.

### **5. Click a Tour:**
```
https://romewander.com/tour/vatican-museums-sistine-chapel-rwd
```

Should show tour detail page (not 404).

---

## 🔧 Troubleshooting

### **Issue: Tours still 404**

**Cause:** Website not deployed or nginx not configured

**Fix:**
```bash
# Check if romewander is running
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 list | grep romewander"

# Check nginx config
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "nginx -t"

# Restart services
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 restart romewander && systemctl reload nginx"
```

---

### **Issue: No tours on homepage**

**Cause:** Tours not in Payload or wrong tenant

**Fix:**
```bash
# Run the tour creation script again
node add-romewander-tours.js

# Verify in Payload admin
# Go to: https://admin.wondersofrome.com/admin/collections/tours
# Filter by tenant: romewander
```

---

### **Issue: Changes in Payload not showing**

**Cause:** Next.js cache (revalidate: 3600 = 1 hour)

**Fix:**
```bash
# Option 1: Wait 1 hour for cache to expire

# Option 2: Restart the website
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 restart romewander"

# Option 3: Clear Next.js cache
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "rm -rf /var/www/romewander/.next/cache && pm2 restart romewander"
```

---

## 📊 Current Server Status

| Website | Port | Status | URL |
|---------|------|--------|-----|
| **Payload Admin** | 3003 | ✅ Running | https://admin.wondersofrome.com |
| **Wonders of Rome** | 3004 | ✅ Running | https://wondersofrome.com |
| **Tickets in Rome** | 3005 | ✅ Running | https://ticketsinrome.com |
| **Rome Wander** | 3006 | ❌ Not deployed | https://romewander.com |
| **Golden Rome Tour** | 3007 | ❓ Unknown | https://goldenrometour.com |
| **Roman Vatican Tour** | 3008 | ❓ Unknown | https://romanvaticantour.com |

---

## 🎯 Quick Commands Reference

```bash
# Add tours to Payload
node add-romewander-tours.js

# Deploy Rome Wander
./deploy-romewander.sh

# Check if running
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 list"

# View logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 logs romewander"

# Restart
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 restart romewander"

# Check tours API
curl "https://admin.wondersofrome.com/api/tours?where[tenant][equals]=romewander&limit=5"
```

---

## 📝 Summary

**To fix Rome Wander 404 errors:**

1. ✅ Run `node add-romewander-tours.js` - Adds tours to Payload
2. ✅ Run `./deploy-romewander.sh` - Deploys website to server
3. ✅ Configure nginx - Routes domain to port 3006
4. ✅ Get SSL certificate - Enables HTTPS
5. ✅ Test - Visit https://romewander.com

**After these steps:**
- ✅ Homepage shows tours
- ✅ Tours are clickable
- ✅ Tour detail pages work
- ✅ Changes in Payload appear on website (after cache expires)

---

**Created:** May 9, 2026  
**Status:** Ready to deploy  
**Estimated Time:** 15-20 minutes total
