#!/bin/bash

# ============================================
# Migrate Rome Wander & Golden Rome Tour to Sanity
# ============================================

set -e

echo "🚀 Migration: Rome Wander & Golden Rome Tour → Sanity"
echo "=" | tr ' ' '=' | head -c 60
echo ""
echo ""

# Step 1: Create new Sanity Studio
echo "📦 Step 1: Creating Sanity Studio..."
echo ""

if [ -d "studio-romewanders" ]; then
  echo "⚠️  studio-romewanders already exists. Skipping creation."
else
  npm create sanity@latest -- \
    --project ozv1sa5p \
    --dataset production \
    --template clean \
    --typescript \
    --output-path studio-romewanders \
    --yes
  
  echo "✅ Sanity Studio created"
fi

echo ""

# Step 2: Copy schemas from Wonders of Rome
echo "📋 Step 2: Copying schemas from Wonders of Rome..."
echo ""

# Copy schema types
cp -r wondersofrome/wondersofrome/src/sanity/schemaTypes/* studio-romewanders/schemaTypes/

# Copy structure
cp wondersofrome/wondersofrome/src/sanity/structure.ts studio-romewanders/src/

echo "✅ Schemas copied"
echo ""

# Step 3: Update Rome Wander .env
echo "🔧 Step 3: Updating Rome Wander .env..."
echo ""

cd romewander

# Backup current .env
cp .env .env.backup-$(date +%Y%m%d-%H%M%S)

# Update Sanity project ID
sed -i 's/NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd/NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p/' .env

# Ensure DATA_SOURCE is sanity
sed -i 's/DATA_SOURCE=payload/DATA_SOURCE=sanity/' .env

echo "✅ Rome Wander .env updated"
echo ""

cd ..

# Step 4: Update Golden Rome Tour .env
echo "🔧 Step 4: Updating Golden Rome Tour .env..."
echo ""

cd goldenrometour

# Backup current .env
cp .env .env.backup-$(date +%Y%m%d-%H%M%S)

# Update Sanity project ID
sed -i 's/NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd/NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p/' .env

# Ensure DATA_SOURCE is sanity
sed -i 's/DATA_SOURCE=payload/DATA_SOURCE=sanity/' .env

echo "✅ Golden Rome Tour .env updated"
echo ""

cd ..

# Step 5: Create migration guide
echo "📝 Step 5: Creating migration guide..."
echo ""

cat > SANITY-MIGRATION-GUIDE.md << 'EOF'
# 🎯 Sanity Migration Complete

## What Changed

### ✅ Rome Wander
- **Old**: Payload CMS (server-hosted, complex)
- **New**: Sanity CMS (cloud-hosted, zero maintenance)
- **Sanity Project**: `ozv1sa5p`
- **Dataset**: `production`

### ✅ Golden Rome Tour
- **Old**: Payload CMS (server-hosted, complex)
- **New**: Sanity CMS (cloud-hosted, zero maintenance)
- **Sanity Project**: `ozv1sa5p`
- **Dataset**: `production`

---

## 📋 Next Steps

### 1. Start Sanity Studio

```bash
cd studio-romewanders
npm install
npm run dev
```

Visit: http://localhost:3333

### 2. Create Admin User

1. Open http://localhost:3333
2. Sign in with Google/GitHub
3. You're now the admin!

### 3. Add Tours

**Option A: Manual Entry**
- Click "Tours" in Sanity Studio
- Click "Create new Tour"
- Fill in details
- Set `tenant` field to either:
  - `romewander` (for Rome Wander tours)
  - `goldenrometour` (for Golden Rome Tour tours)

**Option B: Import from Payload**
- Run the export script (see below)

### 4. Export Tours from Payload

```bash
node export-payload-tours.js
```

This creates:
- `romewander-tours.json` (25 Vatican tours)
- `goldenrometour-tours.json` (all Golden Rome Tour tours)

### 5. Import to Sanity

```bash
cd studio-romewanders
npx sanity dataset import ../romewander-tours.json production
npx sanity dataset import ../goldenrometour-tours.json production
```

### 6. Deploy Sanity Studio

```bash
cd studio-romewanders
npx sanity deploy
```

You'll get a URL like: `https://ozv1sa5p.sanity.studio`

### 7. Deploy Frontends

**Rome Wander (Vercel):**
```bash
cd romewander
vercel --prod
```

**Golden Rome Tour (Vercel):**
```bash
cd goldenrometour
vercel --prod
```

---

## 🎨 Differentiation Between Sites

Both sites use the same Sanity project but are differentiated by the `tenant` field:

### Rome Wander
- `tenant` = `romewander`
- Only shows tours with `tenant: 'romewander'`
- Vatican tours only

### Golden Rome Tour
- `tenant` = `goldenrometour`
- Only shows tours with `tenant: 'goldenrometour'`
- All tour categories

---

## 🔧 Schema Structure

All schemas copied from Wonders of Rome:

- `tour.ts` - Tour content type
- `booking.ts` - Booking records
- `site.ts` - Site settings
- `guestType.ts` - Guest types (adult, child, etc.)
- `availability.ts` - Tour availability/calendar
- `category.ts` - Tour categories

**Key Field**: `tenant` (string) - Differentiates between sites

---

## 📊 Data Flow

### Before (Payload):
```
Frontend → Payload API (Hetzner) → PostgreSQL (Supabase)
```

### After (Sanity):
```
Frontend → Sanity API (Cloud) → Sanity Database (Cloud)
```

**Benefits:**
- ✅ No server to maintain
- ✅ No database to manage
- ✅ No PM2, no SSH, no build errors
- ✅ Real-time updates (no cache delays)
- ✅ Built-in CDN for images
- ✅ Free tier (generous limits)

---

## 🚨 Important Notes

1. **Tenant Field**: Always set `tenant` when creating tours
2. **Images**: Upload directly to Sanity (has built-in CDN)
3. **Availability**: Managed in Sanity Studio calendar
4. **Bookings**: Still stored in Supabase (unchanged)
5. **Stripe**: Unchanged (still per-site Stripe accounts)

---

## 🔄 Rollback Plan

If something goes wrong:

```bash
# Rome Wander
cd romewander
cp .env.backup-YYYYMMDD-HHMMSS .env
vercel --prod

# Golden Rome Tour
cd goldenrometour
cp .env.backup-YYYYMMDD-HHMMSS .env
vercel --prod
```

---

## ✅ Verification Checklist

- [ ] Sanity Studio accessible at http://localhost:3333
- [ ] Tours visible in Sanity Studio
- [ ] Rome Wander shows only Vatican tours
- [ ] Golden Rome Tour shows all tours
- [ ] Booking flow works
- [ ] Images load correctly
- [ ] Availability calendar works
- [ ] No Payload backend needed

---

## 📞 Support

If you encounter issues:
1. Check Sanity Studio logs
2. Check browser console
3. Verify `tenant` field is set correctly
4. Ensure `DATA_SOURCE=sanity` in .env

EOF

echo "✅ Migration guide created: SANITY-MIGRATION-GUIDE.md"
echo ""

# Step 6: Create export script
echo "📝 Step 6: Creating Payload export script..."
echo ""

cat > export-payload-tours.js << 'EXPORTEOF'
#!/usr/bin/env node
/**
 * Export tours from Payload CMS for import to Sanity
 */

const https = require('https')
const fs = require('fs')

const PAYLOAD_URL = 'https://admin.wondersofrome.com'
const API_KEY = 'oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE'

function getTours(tenant) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'admin.wondersofrome.com',
      path: `/api/tours?where[tenant][equals]=${tenant}&where[status][equals]=live&limit=100`,
      headers: { 'Authorization': `users API-Key ${API_KEY}` }
    }
    
    https.get(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

async function exportTours() {
  console.log('📦 Exporting tours from Payload...\n')
  
  // Export Rome Wander tours
  console.log('🔍 Fetching Rome Wander tours...')
  const romewanderData = await getTours('romewander')
  const romewanderTours = romewanderData.docs || []
  
  // Filter Vatican tours only
  const vaticanTours = romewanderTours.filter(t => 
    t.category === 'vatican' || 
    t.title.toLowerCase().includes('vatican') ||
    t.title.toLowerCase().includes('sistine') ||
    t.title.toLowerCase().includes('st. peter') ||
    t.title.toLowerCase().includes('st peter')
  )
  
  console.log(`   Found ${vaticanTours.length} Vatican tours`)
  
  // Transform for Sanity
  const romewanderSanityTours = vaticanTours.map(tour => ({
    _type: 'tour',
    title: tour.title,
    slug: { _type: 'slug', current: tour.slug },
    tenant: 'romewander',
    category: tour.category,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    meetingPoint: tour.meetingPoint,
    status: 'live',
    active: true,
    mainImage: tour.mainImage ? {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: `image-${tour.mainImage.split('/').pop()}`
      }
    } : null
  }))
  
  fs.writeFileSync('romewander-tours.json', JSON.stringify(romewanderSanityTours, null, 2))
  console.log(`   ✅ Exported to romewander-tours.json\n`)
  
  // Export Golden Rome Tour tours
  console.log('🔍 Fetching Golden Rome Tour tours...')
  const goldenData = await getTours('goldenrometour')
  const goldenTours = goldenData.docs || []
  
  console.log(`   Found ${goldenTours.length} tours`)
  
  const goldenSanityTours = goldenTours.map(tour => ({
    _type: 'tour',
    title: tour.title,
    slug: { _type: 'slug', current: tour.slug },
    tenant: 'goldenrometour',
    category: tour.category,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    meetingPoint: tour.meetingPoint,
    status: 'live',
    active: true,
    mainImage: tour.mainImage ? {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: `image-${tour.mainImage.split('/').pop()}`
      }
    } : null
  }))
  
  fs.writeFileSync('goldenrometour-tours.json', JSON.stringify(goldenSanityTours, null, 2))
  console.log(`   ✅ Exported to goldenrometour-tours.json\n`)
  
  console.log('✅ Export complete!')
  console.log('')
  console.log('Next steps:')
  console.log('1. cd studio-romewanders')
  console.log('2. npx sanity dataset import ../romewander-tours.json production')
  console.log('3. npx sanity dataset import ../goldenrometour-tours.json production')
}

exportTours().catch(console.error)
EXPORTEOF

chmod +x export-payload-tours.js

echo "✅ Export script created: export-payload-tours.js"
echo ""

# Done
echo "=" | tr ' ' '=' | head -c 60
echo ""
echo "✅ Migration setup complete!"
echo ""
echo "📖 Read SANITY-MIGRATION-GUIDE.md for next steps"
echo ""
echo "Quick start:"
echo "1. cd studio-romewanders && npm install && npm run dev"
echo "2. node export-payload-tours.js"
echo "3. Follow the guide to import tours"
echo ""

