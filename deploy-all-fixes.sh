#!/bin/bash

# Deploy All Fixes Script
# This script deploys the embedded map feature and other fixes to both websites

set -e  # Exit on error

SERVER="root@91.98.205.197"
PASSWORD="WVdqNp4Rsqfv"

echo "=================================================="
echo "🚀 Deploying All Fixes to Production"
echo "=================================================="

# Function to deploy to a site
deploy_site() {
    local SITE_NAME=$1
    local SITE_PATH=$2
    local PORT=$3
    
    echo ""
    echo "📦 Deploying $SITE_NAME..."
    echo "--------------------------------------------------"
    
    # Upload EmbeddedMap component
    echo "📤 Uploading EmbeddedMap component..."
    sshpass -p "$PASSWORD" scp "$SITE_PATH/src/components/EmbeddedMap.tsx" "$SERVER:/var/www/$SITE_NAME/src/components/"
    
    # Upload updated TourContent
    echo "📤 Uploading updated TourContent..."
    sshpass -p "$PASSWORD" scp "$SITE_PATH/src/components/TourContent.tsx" "$SERVER:/var/www/$SITE_NAME/src/components/"
    
    # Upload updated webhook route (for ticketsinrome only)
    if [ "$SITE_NAME" == "rome-tour-tickets" ]; then
        echo "📤 Uploading updated webhook route..."
        sshpass -p "$PASSWORD" scp "$SITE_PATH/src/app/api/webhooks/stripe/route.ts" "$SERVER:/var/www/$SITE_NAME/src/app/api/webhooks/stripe/"
    fi
    
    # Rebuild and restart
    echo "🔨 Building $SITE_NAME..."
    sshpass -p "$PASSWORD" ssh "$SERVER" << EOF
        cd /var/www/$SITE_NAME
        npm run build
        pm2 restart $SITE_NAME
        echo "✅ $SITE_NAME deployed and restarted"
EOF
}

# Deploy ticketsinrome
deploy_site "rome-tour-tickets" "ticketsinrome-live/rome-tour-tickets" "3000"

# Deploy wondersofrome
deploy_site "wondersofrome" "wondersofrome/wondersofrome" "3001"

echo ""
echo "=================================================="
echo "✅ All deployments complete!"
echo "=================================================="
echo ""
echo "🔍 Next steps:"
echo "1. Test embedded maps on both sites"
echo "2. Run: node diagnose-webhook-database.js"
echo "3. Test a real booking to verify email delivery"
echo "4. Check admin panel inventory management"
echo ""
