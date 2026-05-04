#!/bin/bash

# TicketsInRome Deployment Script for Hetzner
# This script deploys the updated ticketsinrome UI to the Hetzner server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HETZNER_IP="${HETZNER_IP:-}"
HETZNER_USER="${HETZNER_USER:-root}"
HETZNER_PATH="/var/www/ticketsinrome"
LOCAL_PATH="/home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets"
PROJECT_NAME="ticketsinrome"
PORT=3000

# Functions
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Check if Hetzner IP is provided
if [ -z "$HETZNER_IP" ]; then
    print_error "HETZNER_IP environment variable not set"
    echo "Usage: HETZNER_IP=your.server.ip ./deploy-ticketsinrome-hetzner.sh"
    exit 1
fi

print_info "Starting TicketsInRome deployment to Hetzner..."
print_info "Server: $HETZNER_IP"
print_info "Project: $PROJECT_NAME"

# Step 1: Build locally
print_info "Step 1: Building project locally..."
cd "$LOCAL_PATH"
npm run build
print_status "Build completed successfully"

# Step 2: Create backup on Hetzner
print_info "Step 2: Creating backup on Hetzner..."
ssh "$HETZNER_USER@$HETZNER_IP" << 'EOF'
    if [ -d "/var/www/ticketsinrome" ]; then
        BACKUP_DIR="/var/www/ticketsinrome-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r /var/www/ticketsinrome "$BACKUP_DIR"
        echo "Backup created: $BACKUP_DIR"
    fi
EOF
print_status "Backup created on Hetzner"

# Step 3: Upload files to Hetzner
print_info "Step 3: Uploading files to Hetzner..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.env.local' \
    "$LOCAL_PATH/" \
    "$HETZNER_USER@$HETZNER_IP:$HETZNER_PATH/"
print_status "Files uploaded successfully"

# Step 4: Install dependencies and build on Hetzner
print_info "Step 4: Installing dependencies and building on Hetzner..."
ssh "$HETZNER_USER@$HETZNER_IP" << 'EOF'
    cd /var/www/ticketsinrome
    
    # Install dependencies
    npm install --legacy-peer-deps
    
    # Build project
    npm run build
    
    echo "Build completed on Hetzner"
EOF
print_status "Dependencies installed and project built on Hetzner"

# Step 5: Restart PM2 process
print_info "Step 5: Restarting PM2 process..."
ssh "$HETZNER_USER@$HETZNER_IP" << 'EOF'
    # Stop existing process
    pm2 stop ticketsinrome || true
    
    # Delete existing process
    pm2 delete ticketsinrome || true
    
    # Start new process
    cd /var/www/ticketsinrome
    pm2 start "npm start" --name ticketsinrome
    
    # Save PM2 configuration
    pm2 save
    
    echo "PM2 process restarted"
EOF
print_status "PM2 process restarted"

# Step 6: Verify deployment
print_info "Step 6: Verifying deployment..."
sleep 3
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://$HETZNER_IP:$PORT/")
if [ "$RESPONSE" = "200" ]; then
    print_status "Deployment verified - Server is responding"
else
    print_warning "Server returned status code: $RESPONSE"
fi

# Step 7: Display deployment summary
print_info "Deployment Summary:"
echo ""
echo "  Project: $PROJECT_NAME"
echo "  Server: $HETZNER_IP"
echo "  Path: $HETZNER_PATH"
echo "  Port: $PORT"
echo "  URL: http://$HETZNER_IP:$PORT"
echo ""

# Step 8: Show PM2 logs
print_info "Recent PM2 logs:"
ssh "$HETZNER_USER@$HETZNER_IP" "pm2 logs $PROJECT_NAME --lines 10 --nostream" || true

print_status "Deployment completed successfully!"
print_info "Next steps:"
echo "  1. Verify the site is working: http://$HETZNER_IP:$PORT"
echo "  2. Check PM2 status: ssh $HETZNER_USER@$HETZNER_IP 'pm2 status'"
echo "  3. View logs: ssh $HETZNER_USER@$HETZNER_IP 'pm2 logs $PROJECT_NAME'"
echo "  4. Update DNS to point to $HETZNER_IP"
echo ""
