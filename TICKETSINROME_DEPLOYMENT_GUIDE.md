# TicketsInRome Deployment Guide

## Quick Start - Deploy to Hetzner

### Prerequisites
- SSH access to Hetzner server
- Hetzner server IP address
- Node.js 18+ on Hetzner server
- PM2 installed on Hetzner server
- Nginx configured as reverse proxy

### One-Command Deployment

```bash
HETZNER_IP=your.server.ip ./deploy-ticketsinrome-hetzner.sh
```

Replace `your.server.ip` with your actual Hetzner server IP.

### What the Script Does

1. ✅ Builds the project locally
2. ✅ Creates a backup on Hetzner
3. ✅ Uploads files via rsync
4. ✅ Installs dependencies on Hetzner
5. ✅ Builds project on Hetzner
6. ✅ Restarts PM2 process
7. ✅ Verifies deployment
8. ✅ Shows deployment summary

### Manual Deployment Steps

If you prefer to deploy manually:

#### 1. SSH into Hetzner Server
```bash
ssh root@your.server.ip
```

#### 2. Navigate to Project Directory
```bash
cd /var/www/ticketsinrome
```

#### 3. Pull Latest Code
```bash
git pull origin main
```

Or copy files manually:
```bash
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets/ \
  root@your.server.ip:/var/www/ticketsinrome/
```

#### 4. Install Dependencies
```bash
npm install --legacy-peer-deps
```

#### 5. Build Project
```bash
npm run build
```

#### 6. Restart PM2
```bash
pm2 restart ticketsinrome
```

Or start if not running:
```bash
pm2 start "npm start" --name ticketsinrome
pm2 save
```

#### 7. Verify Deployment
```bash
curl http://localhost:3000
```

## Nginx Configuration

Add this to your Nginx config (`/etc/nginx/sites-available/ticketsinrome`):

```nginx
server {
    server_name ticketsinrome.com www.ticketsinrome.com;
    
    # SSL configuration (if using Let's Encrypt)
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/ticketsinrome.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ticketsinrome.com/privkey.pem;
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
    
    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_cache_valid 200 30d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    gzip_min_length 1000;
}

# Redirect www to non-www
server {
    server_name www.ticketsinrome.com;
    return 301 https://ticketsinrome.com$request_uri;
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/ticketsinrome /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Environment Variables

Ensure `.env` file is set on Hetzner with:

```bash
# Core Configuration
NEXT_PUBLIC_SITE_ID=ticketsinrome
NEXT_PUBLIC_SITE_NAME=Rome Tour Tickets
NEXT_PUBLIC_SITE_URL=https://ticketsinrome.com
NEXT_PUBLIC_BASE_URL=https://ticketsinrome.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TICKETSINROME=pk_live_...
STRIPE_SECRET_KEY_TICKETSINROME=sk_live_...
STRIPE_WEBHOOK_SECRET_TICKETSINROME=whsec_...

# CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...

# Database
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Email
RESEND_API_KEY=...
NEXT_PUBLIC_CONTACT_EMAIL=info@ticketsinrome.com

# Payload CMS
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_API_KEY=...
```

## Monitoring & Logs

### View PM2 Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs ticketsinrome
```

### View Last 100 Lines
```bash
pm2 logs ticketsinrome --lines 100
```

### Monitor in Real-time
```bash
pm2 monit
```

## Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or restart PM2
pm2 restart ticketsinrome
```

### Issue: Build Fails
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install --legacy-peer-deps

# Rebuild
npm run build
```

### Issue: Out of Memory
```bash
# Increase Node.js memory
pm2 start "node --max-old-space-size=2048 node_modules/.bin/next start" --name ticketsinrome
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if Node.js is running
pm2 status

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

## Performance Optimization

### Enable Caching
```bash
# In .env
NEXT_PUBLIC_CACHE_DURATION=3600
```

### Monitor Performance
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://ticketsinrome.com/

# Use curl-format.txt:
# time_namelookup:  %{time_namelookup}\n
# time_connect:     %{time_connect}\n
# time_appconnect:  %{time_appconnect}\n
# time_pretransfer: %{time_pretransfer}\n
# time_redirect:    %{time_redirect}\n
# time_starttransfer: %{time_starttransfer}\n
# time_total:       %{time_total}\n
```

## Rollback Plan

If deployment fails:

```bash
# List backups
ls -la /var/www/ticketsinrome-backup-*

# Restore from backup
cp -r /var/www/ticketsinrome-backup-YYYYMMDD-HHMMSS/* /var/www/ticketsinrome/

# Restart
pm2 restart ticketsinrome
```

## Deployment Checklist

- [ ] Build successful locally
- [ ] SSH access to Hetzner verified
- [ ] Backup created on Hetzner
- [ ] Files uploaded successfully
- [ ] Dependencies installed
- [ ] Build successful on Hetzner
- [ ] PM2 process started
- [ ] Server responding on port 3000
- [ ] Nginx reverse proxy working
- [ ] SSL certificate valid
- [ ] Domain DNS updated
- [ ] Site accessible via domain
- [ ] All pages loading correctly
- [ ] API endpoints responding
- [ ] Booking form working
- [ ] No console errors

## Support

For issues or questions:
1. Check logs: `pm2 logs ticketsinrome`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify environment variables: `cat /var/www/ticketsinrome/.env`
4. Test API: `curl http://localhost:3000/api/tours`

## Next Steps

1. ✅ Deploy to Hetzner using the script
2. ⏳ Connect to real Payload CMS for tours
3. ⏳ Implement Stripe payment processing
4. ⏳ Set up booking database
5. ⏳ Configure email notifications
6. ⏳ Set up monitoring and alerts

---

**Last Updated:** May 4, 2026
**Status:** Ready for Deployment
