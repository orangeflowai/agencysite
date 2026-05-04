#!/bin/bash

# TicketsInRome Server Management Commands
# Hetzner Server: 91.98.205.197
# SSH Key: ~/.ssh/id_ed25519

# ============================================================================
# SSH CONNECTION
# ============================================================================

# Connect to server
ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no root@91.98.205.197

# ============================================================================
# PM2 MANAGEMENT
# ============================================================================

# Check status
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 status'

# View logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 logs ticketsinrome'

# View last 100 lines
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 logs ticketsinrome --lines 100'

# Monitor in real-time
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 monit'

# Restart service
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 restart ticketsinrome'

# Stop service
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 stop ticketsinrome'

# Start service
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 start "npm start" --name ticketsinrome'

# ============================================================================
# BUILD & DEPLOYMENT
# ============================================================================

# Build locally
npm run build

# Deploy to Hetzner
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  -e "ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no" \
  /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets/ \
  root@91.98.205.197:/var/www/ticketsinrome/

# Build on Hetzner
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'cd /var/www/ticketsinrome && npm run build'

# ============================================================================
# TESTING
# ============================================================================

# Test home page
curl http://91.98.205.197:3000/

# Test tours API
curl http://91.98.205.197:3000/api/tours

# Test tour detail API
curl http://91.98.205.197:3000/api/tours/colosseum-roman-forum

# Test bookings API
curl -X POST http://91.98.205.197:3000/api/bookings \
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

# ============================================================================
# BACKUP & RESTORE
# ============================================================================

# Create backup
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'cd /var/www && cp -r ticketsinrome ticketsinrome-backup-$(date +%Y%m%d-%H%M%S)'

# List backups
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'ls -la /var/www/ticketsinrome-backup-*'

# Restore from backup (replace YYYYMMDD-HHMMSS with actual backup date)
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'cp -r /var/www/ticketsinrome-backup-YYYYMMDD-HHMMSS/* /var/www/ticketsinrome/ && pm2 restart ticketsinrome'

# ============================================================================
# SYSTEM INFORMATION
# ============================================================================

# Check disk space
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'df -h'

# Check memory usage
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'free -h'

# Check CPU usage
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'top -bn1 | head -20'

# Check Node.js version
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'node --version'

# Check npm version
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'npm --version'

# ============================================================================
# TROUBLESHOOTING
# ============================================================================

# Check if port 3000 is in use
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'lsof -i :3000'

# Kill process on port 3000
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'kill -9 <PID>'

# Clear cache and rebuild
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'cd /var/www/ticketsinrome && rm -rf node_modules .next && npm install --legacy-peer-deps && npm run build && pm2 restart ticketsinrome'

# View error logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'tail -f /root/.pm2/logs/ticketsinrome-error.log'

# View output logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'tail -f /root/.pm2/logs/ticketsinrome-out.log'

# ============================================================================
# ENVIRONMENT VARIABLES
# ============================================================================

# View environment variables
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'cat /var/www/ticketsinrome/.env'

# Edit environment variables
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'nano /var/www/ticketsinrome/.env'

# Reload after env change
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 restart ticketsinrome'

# ============================================================================
# NGINX (Optional - if using reverse proxy)
# ============================================================================

# Test Nginx config
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'nginx -t'

# Restart Nginx
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'systemctl restart nginx'

# View Nginx error logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'tail -f /var/log/nginx/error.log'

# View Nginx access logs
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'tail -f /var/log/nginx/access.log'

# ============================================================================
# QUICK ALIASES (Add to ~/.bashrc or ~/.zshrc)
# ============================================================================

# alias tsr-ssh='ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no root@91.98.205.197'
# alias tsr-logs='ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 logs ticketsinrome"'
# alias tsr-status='ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 status"'
# alias tsr-restart='ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 restart ticketsinrome"'
# alias tsr-monit='ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 monit"'

# ============================================================================
# USEFUL INFORMATION
# ============================================================================

# Server IP: 91.98.205.197
# Port: 3000
# URL: http://91.98.205.197:3000
# Project Path: /var/www/ticketsinrome
# Backup Path: /var/www/ticketsinrome-backup-*
# PM2 Process: ticketsinrome
# Node.js Version: 20.20.2
# npm Version: 10.8.2
# PM2 Version: 7.0.1

# ============================================================================
