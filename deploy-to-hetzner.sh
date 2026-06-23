#!/bin/bash
# Deploy wondersofrome to Hetzner Server
# Usage: ./deploy-to-hetzner.sh

set -e

SERVER="root@91.98.205.197"
DEPLOY_DIR="/var/www/wondersofrome"
BACKUP_DIR="/var/www/wondersofrome-backup-$(date +%Y%m%d-%H%M%S)"
LOCAL_DIR="./wondersofrome/wondersofrome"

echo "=========================================="
echo "  Deploy wondersofrome to Hetzner"
echo "  Server: 91.98.205.197"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "$LOCAL_DIR" ]; then
    echo "❌ Error: wondersofrome directory not found!"
    echo "Please run this script from /home/abiilesh/travelwebsite"
    exit 1
fi

# Step 1: Build locally
echo "📦 Step 1: Building locally..."
cd "$LOCAL_DIR"
npm run build
cd -

# Step 2: Create deployment package
echo "📦 Step 2: Creating deployment package..."
PACKAGE_NAME="wonders-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
cd "$LOCAL_DIR"
tar -czf "/tmp/$PACKAGE_NAME" \
    .next \
    public \
    src \
    package.json \
    package-lock.json \
    next.config.ts \
    tsconfig.json \
    middleware.ts \
    ecosystem.config.js \
    .env.example \
    sanity.config.ts \
    postcss.config.mjs \
    eslint.config.mjs \
    README.md
cd -

echo "✅ Package created: /tmp/$PACKAGE_NAME"
echo "   Size: $(du -h /tmp/$PACKAGE_NAME | cut -f1)"

# Step 3: Upload to server
echo "📤 Step 3: Uploading to server..."
scp "/tmp/$PACKAGE_NAME" "$SERVER:/tmp/"

# Step 4: Deploy on server
echo "🚀 Step 4: Deploying on server..."
ssh "$SERVER" << 'ENDSSH'
set -e

PACKAGE_NAME=$(ls -t /tmp/wonders-deploy-*.tar.gz | head -1)
DEPLOY_DIR="/var/www/wondersofrome"
BACKUP_DIR="/var/www/wondersofrome-backup-$(date +%Y%m%d-%H%M%S)"

echo "   → Stopping PM2 process..."
pm2 stop wondersofrome || true

echo "   → Creating backup..."
if [ -d "$DEPLOY_DIR" ]; then
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
    echo "   ✅ Backup created: $BACKUP_DIR"
fi

echo "   → Extracting new version..."
cd "$DEPLOY_DIR"
tar -xzf "$PACKAGE_NAME" --overwrite

echo "   → Installing dependencies..."
npm install --production --legacy-peer-deps

echo "   → Restarting PM2..."
pm2 restart wondersofrome
pm2 save

echo "   → Cleaning up..."
rm -f "$PACKAGE_NAME"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 PM2 Status:"
pm2 status wondersofrome

ENDSSH

# Step 5: Verify deployment
echo ""
echo "🔍 Step 5: Verifying deployment..."
echo ""
echo "Checking if new files exist on server..."

ssh "$SERVER" << 'ENDVERIFY'
DEPLOY_DIR="/var/www/wondersofrome"

echo -n "   ticketService.ts: "
if [ -f "$DEPLOY_DIR/src/lib/ticketService.ts" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

echo -n "   TicketDisplay.tsx: "
if [ -f "$DEPLOY_DIR/src/components/TicketDisplay.tsx" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

echo -n "   AppDownloadPrompt.tsx: "
if [ -f "$DEPLOY_DIR/src/components/AppDownloadPrompt.tsx" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

echo -n "   ticket/[id]/page.tsx: "
if [ -f "$DEPLOY_DIR/src/app/ticket/[id]/page.tsx" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

echo -n "   apple-app-site-association: "
if [ -f "$DEPLOY_DIR/public/.well-known/apple-app-site-association" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

echo -n "   assetlinks.json: "
if [ -f "$DEPLOY_DIR/public/.well-known/assetlinks.json" ]; then
    echo "✅ Found"
else
    echo "❌ Missing"
fi

ENDVERIFY

# Cleanup local package
rm -f "/tmp/$PACKAGE_NAME"

echo ""
echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Test ticket viewing: https://wondersofrome.com/ticket/TEST123"
echo "2. Make a test booking and verify email"
echo "3. Check PM2 logs: ssh $SERVER 'pm2 logs wondersofrome'"
echo "4. Monitor for errors: ssh $SERVER 'pm2 monit'"
echo ""
