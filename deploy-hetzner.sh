#!/bin/bash
# High-End Travel Agency Deployment Script
# Targets: root@91.98.205.197

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"
# Fixed RSYNC command
RSYNC="rsync -az -e \"ssh -i $SSH_KEY -o StrictHostKeyChecking=no\""

function deploy_site() {
    local name=$1
    local path=$2
    local remote_path=$3
    
    echo "--- Deploying $name ---"
    eval "$RSYNC --exclude='.next' --exclude='node_modules' --exclude='.env' \"$path/src/\" \"$SERVER:$remote_path/src/\""
    
    echo "--- Building $name ---"
    $SSH $SERVER "cd $remote_path && rm -rf .next && export PATH=\$PATH:/usr/local/bin:/usr/bin:/bin && npm run build && npx pm2 restart $name || npx pm2 start npm --name '$name' -- run start && echo '$name DONE'"
}

# 1. Heritage Sites
deploy_site "wondersofrome" "wondersofrome/wondersofrome" "/var/www/wondersofrome"
deploy_site "rome-tour-tickets" "ticketsinrome-copy/ticketsinrome" "/var/www/rome-tour-tickets"

# 2. New Agency Sites (Verified 5k)
deploy_site "goldenrometour" "goldenrometour" "/var/www/goldenrometour"
deploy_site "romanvaticantour" "romanvaticantour" "/var/www/romanvaticantour"
deploy_site "romewander" "romewander" "/var/www/romewander"

# 3. Payload Admin (Static Update)
echo "--- Syncing Payload Admin Build ---"
eval "$RSYNC --exclude='node_modules' --exclude='.env' \"payload-admin/\" \"$SERVER:/var/www/payload-admin/\""
$SSH $SERVER "cd /var/www/payload-admin && npx pm2 restart payload-admin || npx pm2 start npm --name 'payload-admin' -- run start"

echo "=== Verifying 5k Platform ==="
curl -s -o /dev/null -w "wondersofrome: %{http_code}\n" https://wondersofrome.com
curl -s -o /dev/null -w "ticketsinrome: %{http_code}\n" https://ticketsinrome.com
curl -s -o /dev/null -w "goldenrometour: %{http_code}\n" https://goldenrometour.com
curl -s -o /dev/null -w "romanvatican: %{http_code}\n" https://romanvaticantour.com
curl -s -o /dev/null -w "romewander: %{http_code}\n" https://romewander.com
