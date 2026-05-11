#!/bin/bash

# Fix Rome Wander Tours via Direct Database Update
# - Set Vatican tours to LIVE
# - Archive non-Vatican tours

echo "🔧 Rome Wander Tours - Database Fix"
echo "===================================="
echo ""
echo "This will:"
echo "  ✅ Set 25 Vatican tours to LIVE"
echo "  📦 Archive 48 non-Vatican tours"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "🚀 Connecting to database..."

ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 << 'ENDSSH'

# Load environment
cd /var/www/payload-admin
source .env

echo ""
echo "📊 Current status:"
psql "$DATABASE_URI" -c "SELECT status, COUNT(*) FROM payload_tours WHERE tenant = 'romewander' GROUP BY status;"

echo ""
echo "🔄 Updating Vatican tours to LIVE..."
psql "$DATABASE_URI" -c "
UPDATE payload_tours 
SET status = 'live', active = true, \"updatedAt\" = NOW()
WHERE tenant = 'romewander' 
AND (
  category = 'vatican' 
  OR title ILIKE '%vatican%'
  OR title ILIKE '%sistine%'
  OR title ILIKE '%st. peter%'
  OR title ILIKE '%st peter%'
);
"

echo ""
echo "📦 Archiving non-Vatican tours..."
psql "$DATABASE_URI" -c "
UPDATE payload_tours 
SET status = 'archived', active = false, \"updatedAt\" = NOW()
WHERE tenant = 'romewander' 
AND category != 'vatican'
AND title NOT ILIKE '%vatican%'
AND title NOT ILIKE '%sistine%'
AND title NOT ILIKE '%st. peter%'
AND title NOT ILIKE '%st peter%';
"

echo ""
echo "✅ Updated status:"
psql "$DATABASE_URI" -c "SELECT status, COUNT(*) FROM payload_tours WHERE tenant = 'romewander' GROUP BY status;"

echo ""
echo "📋 Vatican tours now live:"
psql "$DATABASE_URI" -c "SELECT title FROM payload_tours WHERE tenant = 'romewander' AND status = 'live' LIMIT 10;"

ENDSSH

echo ""
echo "✅ Database update complete!"
echo ""
echo "Next steps:"
echo "1. Visit https://admin.wondersofrome.com/admin/collections/tours"
echo "2. Verify Vatican tours are live"
echo "3. Redeploy Rome Wander on Vercel OR wait 1 hour for cache"
echo "4. Visit https://romewander.com"
echo ""
