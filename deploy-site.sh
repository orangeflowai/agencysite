#!/bin/bash
# Usage: ./deploy-site.sh [rome-tour-tickets|wondersofrome|both]
# Builds, copies static assets correctly, and restarts via PM2

SERVER="root@91.98.205.197"
PM2="/root/.nvm/versions/node/v18.17.0/bin/pm2"

deploy() {
    local SITE=$1
    local LOCAL_SRC=""

    # Map site name to local source directory
    if [ "$SITE" = "rome-tour-tickets" ]; then
        LOCAL_SRC="ticketsinrome-live/rome-tour-tickets/src/"
    elif [ "$SITE" = "wondersofrome" ]; then
        LOCAL_SRC="wondersofrome/wondersofrome/src/"
    fi

    # Sync local source to server before building
    if [ -n "$LOCAL_SRC" ] && [ -d "$LOCAL_SRC" ]; then
        echo "▶ Syncing source files to server for $SITE..."
        rsync -az --delete -e "ssh" "$LOCAL_SRC" "$SERVER:/var/www/$SITE/src/"
    fi

    echo "▶ Building $SITE..."
    ssh $SERVER "source /root/.nvm/nvm.sh && cd /var/www/$SITE && rm -f .next/lock && npm run build"

    echo "▶ Copying public + static assets into standalone..."
    ssh $SERVER "
        mkdir -p /var/www/$SITE/.next/standalone/.next
        cp -r /var/www/$SITE/public /var/www/$SITE/.next/standalone/
        cp -r /var/www/$SITE/.next/static /var/www/$SITE/.next/standalone/.next/static
    "

    echo "▶ Killing any stray port conflicts..."
    if [ "$SITE" = "rome-tour-tickets" ]; then
        ssh $SERVER "lsof -ti:3000 | xargs kill -9 2>/dev/null; true"
    else
        ssh $SERVER "lsof -ti:3001 | xargs kill -9 2>/dev/null; true"
    fi

    echo "▶ Restarting $SITE via PM2..."
    ssh $SERVER "$PM2 restart $SITE && $PM2 save"
    echo "✅ $SITE deployed"
}

case "${1:-both}" in
    rome-tour-tickets) deploy rome-tour-tickets ;;
    wondersofrome)     deploy wondersofrome ;;
    both)
        deploy rome-tour-tickets
        deploy wondersofrome
        ;;
    *) echo "Usage: $0 [rome-tour-tickets|wondersofrome|both]" ;;
esac
