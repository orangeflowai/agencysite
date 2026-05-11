#!/bin/bash

# Deploy Rome Wander to Hetzner Server

set -e

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
REMOTE_DIR="/var/www/romewander"
LOCAL_DIR="/home/abiilesh/travelwebsite/romewander"

echo "🚀 Deploying Rome Wander to Hetzner..."
echo ""

# Step 1: Build locally
echo "📦 Building Rome Wander locally..."
cd "$LOCAL_DIR"
npm run build

# Step 2: Create remote directory
echo "📁 Creating remote directory..."
ssh -i $SSH_KEY $SERVER "mkdir -p $REMOTE_DIR"

# Step 3: Upload files
echo "📤 Uploading files to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next/cache' \
  -e "ssh -i $SSH_KEY" \
  "$LOCAL_DIR/" \
  "$SERVER:$REMOTE_DIR/"

# Step 4: Install dependencies and setup on server
echo "⚙️  Setting up on server..."
ssh -i $SSH_KEY $SERVER << 'ENDSSH'
cd /var/www/romewander

# Install dependencies
npm install --production

# Setup PM2 ecosystem if not exists
if [ ! -f "ecosystem.config.js" ]; then
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'romewander',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3006',
    cwd: '/var/www/romewander',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    }
  }]
}
EOF
fi

# Start or restart with PM2
pm2 delete romewander 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ Rome Wander deployed and running on port 3006"
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure nginx to route romewander.com to port 3006"
echo "2. Add tours to Payload with tenant=romewander"
echo "3. Visit https://romewander.com"
echo ""
