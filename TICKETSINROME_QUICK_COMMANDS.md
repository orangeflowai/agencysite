# TicketsInRome - Quick Commands Reference

## Local Development

### Start Development Server
```bash
cd /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

---

## Deployment to Hetzner

### One-Command Deploy
```bash
HETZNER_IP=your.server.ip /home/abiilesh/travelwebsite/deploy-ticketsinrome-hetzner.sh
```

### Manual Deploy
```bash
# 1. SSH to server
ssh root@your.server.ip

# 2. Navigate to project
cd /var/www/ticketsinrome

# 3. Pull code
git pull origin main

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Build
npm run build

# 6. Restart PM2
pm2 restart ticketsinrome
```

---

## Server Management (Hetzner)

### SSH Access
```bash
ssh root@your.server.ip
```

### Check PM2 Status
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

### Restart Service
```bash
pm2 restart ticketsinrome
```

### Stop Service
```bash
pm2 stop ticketsinrome
```

### Start Service
```bash
pm2 start "npm start" --name ticketsinrome
```

### Monitor in Real-time
```bash
pm2 monit
```

---

## Nginx Management

### Test Nginx Config
```bash
nginx -t
```

### Restart Nginx
```bash
systemctl restart nginx
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Reload Nginx (No Downtime)
```bash
systemctl reload nginx
```

---

## Testing

### Test Home Page
```bash
curl http://localhost:3000/
```

### Test Tours API
```bash
curl http://localhost:3000/api/tours
```

### Test Tour Detail API
```bash
curl http://localhost:3000/api/tours/colosseum-roman-forum
```

### Test Booking API
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+39123456789",
    "date": "2026-05-15",
    "participants": 2,
    "tourSlug": "colosseum-roman-forum",
    "totalPrice": 130
  }'
```

---

## Troubleshooting

### Check if Port 3000 is in Use
```bash
lsof -i :3000
```

### Kill Process on Port 3000
```bash
kill -9 <PID>
```

### Clear Node Cache
```bash
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

### Check CPU Usage
```bash
top
```

---

## Backup & Restore

### Create Manual Backup
```bash
cp -r /var/www/ticketsinrome /var/www/ticketsinrome-backup-$(date +%Y%m%d-%H%M%S)
```

### List Backups
```bash
ls -la /var/www/ticketsinrome-backup-*
```

### Restore from Backup
```bash
cp -r /var/www/ticketsinrome-backup-YYYYMMDD-HHMMSS/* /var/www/ticketsinrome/
pm2 restart ticketsinrome
```

---

## Environment Variables

### View Environment Variables
```bash
cat /var/www/ticketsinrome/.env
```

### Edit Environment Variables
```bash
nano /var/www/ticketsinrome/.env
```

### Reload After Env Change
```bash
pm2 restart ticketsinrome
```

---

## Database & CMS

### Connect to Supabase
```bash
# Use credentials from .env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Connect to Sanity CMS
```bash
# Use credentials from .env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
```

### Connect to Payload CMS
```bash
# Use credentials from .env
PAYLOAD_API_URL=...
PAYLOAD_API_KEY=...
```

---

## Monitoring

### Monitor Application
```bash
pm2 monit
```

### Check Application Health
```bash
curl -s http://localhost:3000/ | head -20
```

### Monitor Nginx
```bash
watch -n 1 'ps aux | grep nginx'
```

### Check System Resources
```bash
htop
```

---

## Git Operations

### Check Git Status
```bash
cd /var/www/ticketsinrome
git status
```

### View Git Log
```bash
git log --oneline -10
```

### Pull Latest Changes
```bash
git pull origin main
```

### Commit Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## SSL/HTTPS

### Check SSL Certificate
```bash
openssl s_client -connect ticketsinrome.com:443
```

### Renew Let's Encrypt Certificate
```bash
certbot renew
```

### Check Certificate Expiry
```bash
certbot certificates
```

---

## Performance Optimization

### Enable Gzip Compression
```bash
# Already configured in Nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript;
```

### Clear Browser Cache
```bash
# Add to Nginx config
add_header Cache-Control "public, max-age=3600";
```

### Monitor Performance
```bash
# Check response time
curl -w "@curl-format.txt" -o /dev/null -s http://ticketsinrome.com/
```

---

## Useful Aliases

Add to `.bashrc` or `.zshrc`:

```bash
# TicketsInRome shortcuts
alias tsr-ssh='ssh root@your.server.ip'
alias tsr-logs='pm2 logs ticketsinrome'
alias tsr-status='pm2 status'
alias tsr-restart='pm2 restart ticketsinrome'
alias tsr-build='cd /var/www/ticketsinrome && npm run build'
alias tsr-dev='cd /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets && npm run dev'
```

---

## Emergency Commands

### Emergency Restart
```bash
pm2 kill
pm2 start "npm start" --name ticketsinrome
pm2 save
```

### Emergency Rollback
```bash
cp -r /var/www/ticketsinrome-backup-latest/* /var/www/ticketsinrome/
pm2 restart ticketsinrome
```

### Emergency Nginx Restart
```bash
systemctl stop nginx
systemctl start nginx
```

---

## Documentation Links

- Integration Guide: `TICKETSINROME_UI_INTEGRATION_COMPLETE.md`
- Deployment Guide: `TICKETSINROME_DEPLOYMENT_GUIDE.md`
- Final Status: `TICKETSINROME_FINAL_STATUS.md`
- This File: `TICKETSINROME_QUICK_COMMANDS.md`

---

## Support

For issues:
1. Check logs: `pm2 logs ticketsinrome`
2. Check Nginx: `tail -f /var/log/nginx/error.log`
3. Check system: `htop`
4. Review documentation files

---

**Last Updated:** May 4, 2026  
**Status:** Ready for Production
