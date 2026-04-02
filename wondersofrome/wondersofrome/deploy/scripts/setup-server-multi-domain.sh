#!/bin/bash
# Multi-Domain Server Setup for Hetzner (91.98.205.197)
# Configures nginx for two websites with SSL

set -e

SERVER_IP="91.98.205.197"
DOMAIN1="rome-tour-tickets.com"
DOMAIN2="wondersofrome.com"
DEPLOY_DIR="/var/www"

echo "=========================================="
echo "  Multi-Domain Server Setup"
echo "  Server: $SERVER_IP"
echo "  Domains: $DOMAIN1 + $DOMAIN2"
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Install Certbot
echo "📦 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Create deploy directories
echo "📁 Creating deploy directories..."
mkdir -p $DEPLOY_DIR/rome-tour-tickets
mkdir -p $DEPLOY_DIR/wondersofrome
chown -R www-data:www-data $DEPLOY_DIR

# Setup firewall
echo "🔥 Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Basic setup complete!"
echo ""

# ============================================
# NGINX CONFIGURATION
# ============================================
echo "🔧 Configuring Nginx for multi-domain..."

# Backup default nginx config
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Create nginx config for both domains
cat > /etc/nginx/sites-available/$DOMAIN1 << 'EOF'
# Rome Tour Tickets - Port 3000
server {
    listen 80;
    server_name rome-tour-tickets.com www.rome-tour-tickets.com;
    return 301 https://rome-tour-tickets.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rome-tour-tickets.com www.rome-tour-tickets.com;

    ssl_certificate /etc/letsencrypt/live/rome-tour-tickets.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rome-tour-tickets.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    access_log /var/log/nginx/rome-tour-tickets-access.log;
    error_log /var/log/nginx/rome-tour-tickets-error.log;

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

cat > /etc/nginx/sites-available/$DOMAIN2 << 'EOF'
# Wonders of Rome - Port 3002
server {
    listen 80;
    server_name wondersofrome.com www.wondersofrome.com;
    return 301 https://wondersofrome.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wondersofrome.com www.wondersofrome.com;

    ssl_certificate /etc/letsencrypt/live/wondersofrome.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wondersofrome.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    access_log /var/log/nginx/wondersofrome-access.log;
    error_log /var/log/nginx/wondersofrome-error.log;

    location /_next/static {
        proxy_pass http://localhost:3002;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable sites
ln -sf /etc/nginx/sites-available/$DOMAIN1 /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/$DOMAIN2 /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

echo "✅ Nginx configuration complete!"
echo ""

# ============================================
# SYSTEMD SERVICES
# ============================================
echo "🔧 Creating systemd services..."

# Service for Rome Tour Tickets
cat > /etc/systemd/system/rome-tour-tickets.service << EOF
[Unit]
Description=Rome Tour Tickets Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$DEPLOY_DIR/rome-tour-tickets
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Service for Wonders of Rome
cat > /etc/systemd/system/wondersofrome.service << EOF
[Unit]
Description=Wonders of Rome Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$DEPLOY_DIR/wondersofrome
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3002

[Install]
WantedBy=multi-user.target
EOF

# Enable services
systemctl daemon-reload
systemctl enable rome-tour-tickets.service
systemctl enable wondersofrome.service

echo "✅ Services created!"
echo ""

# ============================================
# SSL SETUP INSTRUCTIONS
# ============================================
echo "=========================================="
echo "  🎉 SERVER SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. 📡 POINT YOUR DOMAINS TO THIS SERVER:"
echo "   - $DOMAIN1 → A → $SERVER_IP"
echo "   - www.$DOMAIN1 → CNAME → $DOMAIN1"
echo "   - $DOMAIN2 → A → $SERVER_IP"
echo "   - www.$DOMAIN2 → CNAME → $DOMAIN2"
echo ""
echo "2. 🔒 SETUP SSL CERTIFICATES (run after DNS propagates):"
echo "   certbot --nginx -d $DOMAIN1 -d www.$DOMAIN1"
echo "   certbot --nginx -d $DOMAIN2 -d www.$DOMAIN2"
echo ""
echo "3. 📁 DEPLOY YOUR WEBSITES:"
echo "   ./deploy.sh both"
echo ""
echo "4. 🚀 START SERVICES:"
echo "   systemctl start rome-tour-tickets"
echo "   systemctl start wondersofrome"
echo ""
echo "Server IP: $SERVER_IP"
echo "Deploy Directory: $DEPLOY_DIR"
echo ""
