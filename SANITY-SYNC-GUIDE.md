# Syncing Tour Variations to Sanity CMS

## Issue: API Token Permissions

The current error `"Unauthorized - Session does not match project host"` means the Sanity API tokens don't have write permission for the specific projects.

---

## Solution 1: Create Project-Specific API Tokens (RECOMMENDED)

You need to create separate API tokens for each Sanity project with **Editor** or **Administrator** permissions.

### Steps:

1. **Go to Sanity Management Console**: https://sanity.io/manage

2. **For Golden Rome Tour (gycprksj)**:
   - Select project "Golden Rome Tour" (gycprksj)
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name: "Tour Sync Script"
   - Permissions: **Editor** (or Administrator)
   - Copy the token
   - Save it as `SANITY_TOKEN_GOLDENROMETOUR` in your environment

3. **For RomeWander (s9wuvaa8)**:
   - Select project "RomeWander" (s9wuvaa8)
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name: "Tour Sync Script"
   - Permissions: **Editor**
   - Copy the token
   - Save it as `SANITY_TOKEN_ROMEWANDER`

4. **For RomanVaticanTour (etutpkdi)**:
   - Select project "RomanVaticanTour" (etutpkdi)
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name: "Tour Sync Script"
   - Permissions: **Editor**
   - Copy the token
   - Save it as `SANITY_TOKEN_ROMANVATICANTOUR`

5. **Run the sync script**:
   ```bash
   SANITY_TOKEN_GOLDENROMETOUR=sk_xxx \
   SANITY_TOKEN_ROMEWANDER=sk_yyy \
   SANITY_TOKEN_ROMANVATICANTOUR=sk_zzz \
   node sync-tours-to-sanity.js
   ```

---

## Solution 2: Export Tours as JSON (MANUAL IMPORT)

If you can't get API tokens working, you can export tours as JSON and manually import them into Sanity Studio.

### Step 1: Export Tours from Payload CMS

Run the export script:
```bash
node export-tours-json.js
```

This will create 3 files:
- `tours-premium-vip.json` (for Golden Rome Tour)
- `tours-value-budget.json` (for RomeWander)
- `tours-educational-expert.json` (for RomanVaticanTour)

### Step 2: Import into Sanity Studio

For each project:

1. Open Sanity Studio locally:
   ```bash
   cd goldenrometour
   npm run dev
   ```

2. Go to http://localhost:3000/studio

3. Use the **Vision** plugin (or create a custom import script) to import the JSON data

4. Or manually create tours using the exported JSON as reference

---

## Solution 3: Use Sanity CLI Import

### Step 1: Install Sanity CLI
```bash
npm install -g @sanity/cli
```

### Step 2: Login to Sanity
```bash
sanity login
```

### Step 3: Export tours to NDJSON format
```bash
node export-tours-ndjson.js
```

### Step 4: Import to each project
```bash
# Golden Rome Tour
sanity dataset import tours-premium.ndjson production --project gycprksj

# RomeWander  
sanity dataset import tours-value.ndjson tours --project s9wuvaa8

# RomanVaticanTour
sanity dataset import tours-educational.ndjson production --project etutpkdi
```

---

## Current Status

✅ **Payload CMS**: 93 tour variations created successfully
- 32 Premium (VIP) tours
- 31 Value (BEST VALUE) tours
- 31 Educational (EXPERT GUIDE) tours

❌ **Sanity Sync**: Blocked by API token permissions

---

## Distribution Plan

| Badge Type | Count | Target Website | Sanity Project | Dataset |
|------------|-------|----------------|----------------|---------|
| VIP | 32 | Golden Rome Tour | gycprksj | production |
| BEST VALUE | 31 | RomeWander | s9wuvaa8 | tours |
| EXPERT GUIDE | 31 | RomanVaticanTour | etutpkdi | production |

---

## Next Steps

1. **Create API tokens** for each Sanity project (Solution 1)
2. **Run sync script** with proper tokens
3. **Verify tours** in each Sanity Studio
4. **Upload images** (can be done separately after tours are created)
5. **Publish tours** from draft to published status

---

## Files Created

- `sync-tours-to-sanity.js` - Main sync script (needs proper tokens)
- `export-tours-json.js` - Export to JSON for manual import (to be created)
- `SANITY-SYNC-GUIDE.md` - This guide

---

## Troubleshooting

### Error: "Unauthorized - Session does not match project host"
- **Cause**: API token doesn't have permission for the project
- **Fix**: Create project-specific tokens with Editor permissions

### Error: "Dataset not found"
- **Cause**: Wrong dataset name
- **Fix**: Check `.env` file for correct dataset name
  - Golden Rome Tour: `production`
  - RomeWander: `tours`
  - RomanVaticanTour: `production`

### Error: "Document type 'tour' not found"
- **Cause**: Tour schema not deployed to Sanity
- **Fix**: Deploy schema: `cd <project> && sanity deploy`

---

## Alternative: Manual Copy-Paste

If all else fails, you can manually create tours in Sanity Studio:

1. Open Payload CMS: https://admin.wondersofrome.com
2. Open Sanity Studio: http://localhost:3000/studio
3. For each tour:
   - Copy title, description, price, etc. from Payload
   - Create new tour in Sanity
   - Paste the content
   - Upload images manually

This is tedious but guaranteed to work!

---

## Contact

If you need help with API tokens or Sanity permissions, contact:
- Sanity Support: https://sanity.io/help
- Or check Sanity documentation: https://www.sanity.io/docs/http-auth
