#!/bin/bash

# Manual Deployment Script (without sshpass)
# You'll be prompted for password for each command

set -e

SERVER="root@91.98.205.197"

echo "=================================================="
echo "🚀 Manual Deployment - Embedded Maps Feature"
echo "=================================================="
echo ""
echo "You'll be prompted for the server password multiple times."
echo "Password: WVdqNp4Rsqfv"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "=================================================="
echo "📦 Step 1: Deploy to Ticketsinrome"
echo "=================================================="

echo ""
echo "📤 Uploading EmbeddedMap.tsx..."
scp ticketsinrome-live/rome-tour-tickets/src/components/EmbeddedMap.tsx "$SERVER:/var/www/rome-tour-tickets/src/components/"

echo ""
echo "📤 Uploading TourContent.tsx..."
scp ticketsinrome-live/rome-tour-tickets/src/components/TourContent.tsx "$SERVER:/var/www/rome-tour-tickets/src/components/"

echo ""
echo "🔨 Building and restarting ticketsinrome..."
echo "Commands to run on server:"
echo "  cd /var/www/rome-tour-tickets"
echo "  npm run build"
echo "  pm2 restart rome-tour-tickets"
echo ""
read -p "Press Enter to SSH into server (run the commands above, then type 'exit')..."
ssh "$SERVER"

echo ""
echo "=================================================="
echo "📦 Step 2: Deploy to Wondersofrome"
echo "=================================================="

echo ""
echo "📤 Uploading EmbeddedMap.tsx..."
scp wondersofrome/wondersofrome/src/components/EmbeddedMap.tsx "$SERVER:/var/www/wondersofrome/src/components/"

echo ""
echo "📤 Uploading TourContent.tsx..."
scp wondersofrome/wondersofrome/src/components/TourContent.tsx "$SERVER:/var/www/wondersofrome/src/components/"

echo ""
echo "🔨 Building and restarting wondersofrome..."
echo "Commands to run on server:"
echo "  cd /var/www/wondersofrome"
echo "  npm run build"
echo "  pm2 restart wondersofrome"
echo ""
read -p "Press Enter to SSH into server (run the commands above, then type 'exit')..."
ssh "$SERVER"

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "🔍 Next steps:"
echo "1. Add Google Maps API key to both .env files"
echo "2. Test maps on both websites"
echo "3. Run: node diagnose-webhook-database.js"
echo ""
