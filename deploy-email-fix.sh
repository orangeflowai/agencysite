#!/bin/bash

echo "🚀 Deploying email fixes to server..."

# Copy updated files to server
echo "📁 Copying email templates..."
scp ticketsinrome-live/rome-tour-tickets/src/lib/email-templates.ts root@91.98.205.197:/var/www/rome-tour-tickets/src/lib/

echo "📁 Copying book API route..."
scp ticketsinrome-live/rome-tour-tickets/src/app/api/book/route.ts root@91.98.205.197:/var/www/rome-tour-tickets/src/app/api/book/

echo "📁 Copying webhook route..."
scp ticketsinrome-live/rome-tour-tickets/src/app/api/webhooks/stripe/route.ts root@91.98.205.197:/var/www/rome-tour-tickets/src/app/api/webhooks/stripe/

echo "🔄 Restarting the application..."
ssh root@91.98.205.197 'cd /var/www/rome-tour-tickets && npm run build && pm2 restart rome-tour-tickets'

echo "✅ Deployment complete!"