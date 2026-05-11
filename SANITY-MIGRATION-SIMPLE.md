# 🎯 Simple Sanity Migration Guide
## Rome Wander & Golden Rome Tour → Sanity CMS

---

## Why This Migration?

**Problem**: Payload CMS requires:
- Server maintenance (Hetzner)
- Database management (Supabase)
- PM2 process management
- Build errors, cache issues
- Server Action errors

**Solution**: Sanity CMS provides:
- ✅ Zero server maintenance
- ✅ Cloud-hosted (no infrastructure)
- ✅ Real-time updates
- ✅ Built-in CDN for images
- ✅ Free tier (generous limits)

---

## 📋 Step-by-Step Migration

### Step 1: Update Environment Variables

**Rome Wander:**
```bash
cd /home/abiilesh/travelwebsite/romewander
```

Edit `.env` and change:
```bash
# Change this line:
DATA_SOURCE=payload

# To this:
DATA_SOURCE=sanity

# And update Sanity project ID:
NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p
```

**Golden Rome Tour:**
```bash
cd /home/abiilesh/travelwebsite/goldenrometour
```

Edit `.env` and change:
```bash
# Change this line:
DATA_SOURCE=payload

# To this:
DATA_SOURCE=sanity

# And update Sanity project ID:
NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p
```

---

### Step 2: Create Sanity Studio (Manual)

```bash
cd /home/abiilesh/travelwebsite

# Create Sanity Studio
npm create sanity@latest
```

**When prompted:**
- Project ID: `ozv1sa5p`
- Dataset: `production`
- Template: `clean`
- TypeScript: `yes`
- Output path: `studio-romewanders`

---

### Step 3: Copy Schemas from Wonders of Rome

```bash
# Copy schema files
cp -r wondersofrome/wondersofrome/src/sanity/schemaTypes/* studio-romewanders/schemaTypes/

# Copy structure file
cp wondersofrome/wondersofrome/src/sanity/structure.ts studio-romewanders/src/
```

---

### Step 4: Start Sanity Studio

```bash
cd studio-romewanders
npm install
npm run dev
```

Visit: http://localhost:3333

---

### Step 5: Add Tours to Sanity

**Option A: Manual Entry (Recommended for now)**

1. Open http://localhost:3333
2. Sign in with Google/GitHub
3. Click "Tours" → "Create new Tour"
4. Fill in tour details
5. **Important**: Set `tenant` field to:
   - `romewander` for Rome Wander tours
   - `goldenrometour` for Golden Rome Tour tours
6. Set `status` to `live`
7. Check `active` checkbox
8. Save

**Option B: Export from Payload (Later)**

Run the export script I created:
```bash
cd /home/abiilesh/travelwebsite
node export-payload-tours.js
```

This creates:
- `romewander-tours.json`
- `goldenrometour-tours.json`

Then import:
```bash
cd studio-romewanders
npx sanity dataset import ../romewander-tours.json production
npx sanity dataset import ../goldenrometour-tours.json production
```

---

### Step 6: Deploy Sanity Studio

```bash
cd studio-romewanders
npx sanity deploy
```

You'll get a URL like: `https://ozv1sa5p.sanity.studio`

---

### Step 7: Deploy Frontends

**Rome Wander (Vercel):**
```bash
cd /home/abiilesh/travelwebsite/romewander
vercel --prod
```

**Golden Rome Tour (Vercel):**
```bash
cd /home/abiilesh/travelwebsite/goldenrometour
vercel --prod
```

---

## 🎨 How Sites Are Differentiated

Both sites use the **same Sanity project** (`ozv1sa5p`) but are separated by the `tenant` field:

### Rome Wander
- `tenant` = `romewander`
- Only shows tours with `tenant: 'romewander'`
- Vatican tours only

### Golden Rome Tour
- `tenant` = `goldenrometour`
- Only shows tours with `tenant: 'goldenrometour'`
- All tour categories

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

---

## ✅ Verification Checklist

- [ ] Rome Wander `.env` updated (`DATA_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p`)
- [ ] Golden Rome Tour `.env` updated (`DATA_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p`)
- [ ] Sanity Studio created at `studio-romewanders`
- [ ] Schemas copied from Wonders of Rome
- [ ] Sanity Studio accessible at http://localhost:3333
- [ ] Tours added with correct `tenant` field
- [ ] Rome Wander shows only Vatican tours
- [ ] Golden Rome Tour shows all tours
- [ ] Booking flow works
- [ ] Images load correctly

---

## 🔄 Rollback Plan

If something goes wrong:

**Rome Wander:**
```bash
cd romewander
# Restore backup
cp .env.backup-YYYYMMDD-HHMMSS .env
# Redeploy
vercel --prod
```

**Golden Rome Tour:**
```bash
cd goldenrometour
# Restore backup
cp .env.backup-YYYYMMDD-HHMMSS .env
# Redeploy
vercel --prod
```

---

## 💡 Quick Start (TL;DR)

```bash
# 1. Update Rome Wander
cd romewander
# Edit .env: DATA_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p

# 2. Update Golden Rome Tour
cd ../goldenrometour
# Edit .env: DATA_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID=ozv1sa5p

# 3. Create Sanity Studio
cd ..
npm create sanity@latest
# Follow prompts: ozv1sa5p, production, clean, yes, studio-romewanders

# 4. Copy schemas
cp -r wondersofrome/wondersofrome/src/sanity/schemaTypes/* studio-romewanders/schemaTypes/

# 5. Start Studio
cd studio-romewanders
npm install
npm run dev

# 6. Add tours at http://localhost:3333

# 7. Deploy
npx sanity deploy
cd ../romewander && vercel --prod
cd ../goldenrometour && vercel --prod
```

---

## 📞 Support

If you encounter issues:
1. Check Sanity Studio logs
2. Check browser console
3. Verify `tenant` field is set correctly
4. Ensure `DATA_SOURCE=sanity` in .env

---

**Ready to start? Begin with Step 1!**
