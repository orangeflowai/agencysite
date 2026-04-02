#!/bin/bash

echo "🚀 Deploying Resend API Key Update to Wonders of Rome"
echo "======================================================"

# Server details
SERVER="root@91.98.205.197"
PASSWORD="WVdqNp4Rsqfv"
REMOTE_PATH="/var/www/wondersofrome"

echo ""
echo "📤 Step 1: Uploading updated .env file..."
sshpass -p "$PASSWORD" scp wondersofrome/wondersofrome/.env $SERVER:$REMOTE_PATH/.env

if [ $? -eq 0 ]; then
    echo "✅ .env file uploaded successfully"
else
    echo "❌ Failed to upload .env file"
    exit 1
fi

echo ""
echo "🔄 Step 2: Restarting Wonders of Rome application..."
sshpass -p "$PASSWORD" ssh $SERVER << 'EOF'
cd /var/www/wondersofrome
/root/.nvm/versions/node/v18.17.0/bin/pm2 restart wondersofrome
EOF

if [ $? -eq 0 ]; then
    echo "✅ Application restarted successfully"
else
    echo "❌ Failed to restart application"
    exit 1
fi

echo ""
echo "🧪 Step 3: Checking application status..."
sshpass -p "$PASSWORD" ssh $SERVER "/root/.nvm/versions/node/v18.17.0/bin/pm2 status wondersofrome"

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Test email sending from wondersofrome.com"
echo "2. Verify emails are sent from info@wondersofrome.com"
echo "3. Check Resend dashboard for delivery status"
echo ""
echo "🧪 Test Command:"
echo "curl -X POST https://wondersofrome.com/api/book \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Test\",\"email\":\"your@email.com\",\"tourTitle\":\"Test Tour\",\"date\":\"2026-03-15\",\"guests\":1,\"price\":\"50\"}'"
