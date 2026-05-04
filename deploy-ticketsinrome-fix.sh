#!/bin/bash

# Deploy ticketsinrome fixes to Hetzner server
# This script:
# 1. Copies the updated files to the server
# 2. Rebuilds the Next.js application
# 3. Restarts PM2

set -e

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
REMOTE_DIR="/var/www/ticketsinrome"
LOCAL_DIR="./ticketsinrome-live/rome-tour-tickets"

echo "🚀 Deploying ticketsinrome fixes to Hetzner server..."

# Copy the updated featured-products-section component
echo "📦 Copying updated files..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  "$LOCAL_DIR/components/sections/featured-products-section.tsx" \
  "$SERVER:$REMOTE_DIR/components/sections/"

# SSH into server and rebuild
echo "🔨 Rebuilding application on server..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER << 'ENDSSH'
cd /var/www/ticketsinrome

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Next.js application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart ticketsinrome

echo "✅ Deployment complete!"
pm2 status
ENDSSH

echo ""
echo "✅ Deployment successful!"
echo "🌐 Visit: https://ticketsinrome.com"
echo ""
echo "📊 To check logs:"
echo "   ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 'pm2 logs ticketsinrome'"
