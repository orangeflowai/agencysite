#!/bin/bash
# Deploy the location URL fix for View on Maps + EmbeddedMap
SERVER="root@49.13.7.108"

echo "=== Deploying ticketsinrome maps fix ==="
rsync -az ticketsinrome-live/rome-tour-tickets/src/components/EmbeddedMap.tsx \
         ticketsinrome-live/rome-tour-tickets/src/components/TourContent.tsx \
         $SERVER:/var/www/rome-tour-tickets/src/components/

rsync -az ticketsinrome-live/rome-tour-tickets/.next/ \
         $SERVER:/var/www/rome-tour-tickets/.next/

echo "=== Deploying wondersofrome maps fix ==="
rsync -az wondersofrome/wondersofrome/src/components/EmbeddedMap.tsx \
         wondersofrome/wondersofrome/src/components/TourContent.tsx \
         $SERVER:/var/www/wondersofrome/src/components/

rsync -az wondersofrome/wondersofrome/.next/ \
         $SERVER:/var/www/wondersofrome/.next/

echo "=== Restarting PM2 ==="
ssh $SERVER "pm2 restart rome-tour-tickets wondersofrome"

echo "=== Done ==="
