#!/bin/bash

# Rebuild and restart both sites
# Run this on the server

echo "🔨 Rebuilding ticketsinrome..."
cd /var/www/rome-tour-tickets
npm run build
pm2 restart rome-tour-tickets

echo ""
echo "🔨 Rebuilding wondersofrome..."
cd /var/www/wondersofrome
npm run build
pm2 restart wondersofrome

echo ""
echo "✅ Both sites rebuilt and restarted!"
pm2 status
