#!/bin/bash

# Deploy complete ticketsinrome fixes to Hetzner server
set -e

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
REMOTE_DIR="/var/www/ticketsinrome"
LOCAL_DIR="./ticketsinrome-live/rome-tour-tickets"

echo "🚀 Deploying complete ticketsinrome fixes..."

# Copy updated files
echo "📦 Copying updated files..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  "$LOCAL_DIR/app/page.tsx" \
  "$SERVER:$REMOTE_DIR/app/"

scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  "$LOCAL_DIR/components/header.tsx" \
  "$SERVER:$REMOTE_DIR/components/"

scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  "$LOCAL_DIR/components/sections/featured-products-section.tsx" \
  "$SERVER:$REMOTE_DIR/components/sections/"

scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  "$LOCAL_DIR/app/api/tours/route.ts" \
  "$SERVER:$REMOTE_DIR/app/api/tours/"

# Rebuild and restart
echo "🔨 Rebuilding application..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER << 'ENDSSH'
cd /var/www/ticketsinrome

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Next.js application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart rome-tour-tickets

echo "✅ Deployment complete!"
pm2 status
ENDSSH

echo ""
echo "✅ Deployment successful!"
echo "🌐 Visit: https://ticketsinrome.com"
echo ""
echo "📊 To check logs:"
echo "   ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 logs rome-tour-tickets'"
