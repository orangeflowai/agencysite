#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Rome Agency — Full Platform Deploy Script
# Server: root@91.98.205.197 (Hetzner)
# ═══════════════════════════════════════════════════════════════

SERVER="root@91.98.205.197"
SSH_KEY="~/.ssh/id_ed25519"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=15"
RSYNC="rsync -az --progress -e \"ssh -i $SSH_KEY -o StrictHostKeyChecking=no\""

# Colors
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; }

# ── Deploy a Next.js site ──────────────────────────────────────
deploy_site() {
  local name=$1
  local local_path=$2
  local remote_path=$3
  local port=$4

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Deploying: $name → $remote_path (port $port)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Sync source (exclude heavy dirs)
  eval "$RSYNC \
    --exclude='.next' \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --delete-excluded \
    \"$local_path/\" \"$SERVER:$remote_path/\""

  # Remote: install deps + build + restart
  $SSH $SERVER bash << REMOTE
    set -e
    cd $remote_path
    echo "→ Installing dependencies..."
    npm install --legacy-peer-deps --silent 2>&1 | tail -3
    echo "→ Building..."
    npm run build 2>&1 | tail -5
    echo "→ Restarting PM2..."
    pm2 describe $name > /dev/null 2>&1 \
      && pm2 restart $name \
      || pm2 start npm --name "$name" -- start -- -p $port
    pm2 save
    echo "→ Done: $name"
REMOTE

  if [ $? -eq 0 ]; then ok "$name deployed"; else err "$name FAILED"; fi
}

# ── Deploy payload admin ───────────────────────────────────────
deploy_admin() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Deploying: payload-admin → /var/www/payload-admin"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  eval "$RSYNC \
    --exclude='.next' \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='*.py' \
    --exclude='*.js' \
    --include='src/***' \
    --include='package.json' \
    --include='package-lock.json' \
    --include='next.config.ts' \
    --include='tailwind.config.js' \
    --include='postcss.config.js' \
    --include='tsconfig.json' \
    --include='ecosystem.config.js' \
    --include='migrations/***' \
    --exclude='*' \
    \"payload-admin/\" \"$SERVER:/var/www/payload-admin/\""

  $SSH $SERVER bash << REMOTE
    set -e
    cd /var/www/payload-admin
    npm install --legacy-peer-deps --silent 2>&1 | tail -3
    npm run build 2>&1 | tail -5
    pm2 describe payload-admin > /dev/null 2>&1 \
      && pm2 restart payload-admin \
      || pm2 start npm --name "payload-admin" -- start -- -p 3003
    pm2 save
REMOTE

  if [ $? -eq 0 ]; then ok "payload-admin deployed"; else err "payload-admin FAILED"; fi
}

# ── Health check ───────────────────────────────────────────────
health_check() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Health Check"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  local sites=(
    "https://wondersofrome.com"
    "https://romanvaticantour.com"
    "https://ticketsinrome.com"
    "https://romewander.com"
    "https://goldenrometour.com"
    "https://admin.wondersofrome.com"
  )
  for url in "${sites[@]}"; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$url" 2>/dev/null)
    if [[ "$code" == "200" || "$code" == "301" || "$code" == "307" ]]; then
      ok "$code $url"
    else
      err "$code $url"
    fi
  done
}

# ── Main ───────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║     ROME AGENCY — PLATFORM DEPLOY                    ║"
echo "╚═══════════════════════════════════════════════════════╝"

DEPLOY_TARGET="${1:-all}"

case "$DEPLOY_TARGET" in
  wondersofrome)
    deploy_site "wondersofrome" "wondersofrome/wondersofrome" "/var/www/wondersofrome" 3002
    ;;
  romanvaticantour)
    deploy_site "romanvaticantour" "romanvaticantour" "/var/www/romanvaticantour" 3004
    ;;
  ticketsinrome)
    deploy_site "rome-tour-tickets" "ticketsinrome-copy/ticketsinrome" "/var/www/rome-tour-tickets" 3001
    ;;
  romewander)
    deploy_site "romewander" "romewander" "/var/www/romewander" 3005
    ;;
  goldenrometour)
    deploy_site "goldenrometour" "goldenrometour" "/var/www/goldenrometour" 3006
    ;;
  admin)
    deploy_admin
    ;;
  check)
    health_check
    ;;
  all)
    deploy_admin
    deploy_site "wondersofrome"    "wondersofrome/wondersofrome"       "/var/www/wondersofrome"       3002
    deploy_site "rome-tour-tickets" "ticketsinrome-copy/ticketsinrome"  "/var/www/rome-tour-tickets"   3001
    deploy_site "romanvaticantour" "romanvaticantour"                   "/var/www/romanvaticantour"    3004
    deploy_site "romewander"       "romewander"                         "/var/www/romewander"          3005
    deploy_site "goldenrometour"   "goldenrometour"                     "/var/www/goldenrometour"      3006
    health_check
    ;;
  *)
    echo "Usage: $0 [all|wondersofrome|romanvaticantour|ticketsinrome|romewander|goldenrometour|admin|check]"
    exit 1
    ;;
esac

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║     DEPLOY COMPLETE                                   ║"
echo "╚═══════════════════════════════════════════════════════╝"
