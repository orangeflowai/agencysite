#!/bin/bash

echo "=================================================="
echo "🔍 Checking Deployment Status"
echo "=================================================="
echo ""

SERVER="root@91.98.205.197"

echo "1. Checking PM2 Status..."
ssh $SERVER "/root/.nvm/versions/node/v18.17.0/bin/pm2 status"

echo ""
echo "2. Checking if EmbeddedMap.tsx exists..."
ssh $SERVER "ls -la /var/www/rome-tour-tickets/src/components/EmbeddedMap.tsx"
ssh $SERVER "ls -la /var/www/wondersofrome/src/components/EmbeddedMap.tsx"

echo ""
echo "3. Checking Google Maps API Key..."
ssh $SERVER "grep 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY' /var/www/rome-tour-tickets/.env"
ssh $SERVER "grep 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY' /var/www/wondersofrome/.env"

echo ""
echo "4. Checking logo files..."
ssh $SERVER "ls -la /var/www/wondersofrome/.next/standalone/public/logo.png"
ssh $SERVER "ls -la /var/www/rome-tour-tickets/.next/standalone/public/logo.png"

echo ""
echo "5. Checking recent logs (last 10 lines)..."
echo "--- Wondersofrome ---"
ssh $SERVER "/root/.nvm/versions/node/v18.17.0/bin/pm2 logs wondersofrome --lines 10 --nostream"

echo ""
echo "--- Ticketsinrome ---"
ssh $SERVER "/root/.nvm/versions/node/v18.17.0/bin/pm2 logs rome-tour-tickets --lines 10 --nostream"

echo ""
echo "=================================================="
echo "✅ Status Check Complete"
echo "=================================================="
