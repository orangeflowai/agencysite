#!/bin/bash
# Run this once SSH is accessible again
# Usage: bash deploy-hetzner.sh

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"
RSYNC="rsync -az -e 'ssh -i $SSH_KEY -o StrictHostKeyChecking=no'"

echo "=== Deploying wondersofrome ==="
rsync -az -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude='.next' --exclude='node_modules' --exclude='.env' \
  wondersofrome/wondersofrome/src/ \
  $SERVER:/var/www/wondersofrome/src/

echo "=== Deploying ticketsinrome ==="
rsync -az -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude='.next' --exclude='node_modules' --exclude='.env' \
  ticketsinrome-live/rome-tour-tickets/src/ \
  $SERVER:/var/www/rome-tour-tickets/src/

echo "=== Building wondersofrome ==="
$SSH $SERVER "cd /var/www/wondersofrome && rm -rf .next && NODE_OPTIONS='--max-old-space-size=1536' npm run build && npx pm2 restart wondersofrome && echo 'wondersofrome DONE'"

echo "=== Building ticketsinrome ==="
$SSH $SERVER "cd /var/www/rome-tour-tickets && rm -rf .next && NODE_OPTIONS='--max-old-space-size=1536' npm run build && npx pm2 restart rome-tour-tickets && echo 'ticketsinrome DONE'"

echo "=== Verifying ==="
curl -s -o /dev/null -w "wondersofrome: %{http_code}\n" https://wondersofrome.com
curl -s -o /dev/null -w "ticketsinrome: %{http_code}\n" https://ticketsinrome.com
