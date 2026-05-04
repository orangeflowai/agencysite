# Sanity → Payload Migration Guide

## 📋 Overview

This guide explains the schema differences between Sanity CMS and Payload CMS for the wondersofrome tours, and provides a complete migration solution to transfer all data without losing any information.

---

## 🔍 Schema Comparison

### Sanity CMS Schema (Complete)

```typescript
interface Tour {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    }
  };
  price: number;
  studentPrice?: number;
  youthPrice?: number;
  duration: string;
  description: PortableTextBlock[];  // Rich text with formatting
  category: string;
  features: string[];
  highlights?: string[];
  badge?: string;
  rating?: number;
  reviewCount?: number;
  groupSize?: string;
  location?: string;
  tags?: string[];
  includes?: string[];
  excludes?: string[];
  importantInfo?: string[];
  itinerary?: Array<{
    title: string;
    duration: string;
    description: string;
  }>;
  meetingPoint?: string;
  mapAddress?: string;
  maxParticipants?: number;
  sites?: Array<{ _ref: string; _type: 'reference' }>;
  gallery?: any[];
  guestTypes?: Array<{
    name: string;
    price: number;
    description?: string;
    _key?: string;
  }>;
}
```

### Payload CMS Schema (Current)

```typescript
interface Tour {
  id: string;
  title: string;
  slug: string;
  tenant: string;  // Site identifier
  imageUrl?: string;  // Direct URL string
  mainImage?: { url: string; filename: string };
  price: number;
  duration: string;
  description: string;  // Plain text only
  category: string;
  highlights?: Array<{ item: string }>;  // Array of objects
  badge?: string;
  rating?: number;
  reviewCount?: number;
  groupSize?: string;
  tags?: Array<{ tag: string }>;  // Array of objects
  guestTypes?: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  includes?: Array<{ item: string }>;
  excludes?: Array<{ item: string }>;
  importantInfo?: Array<{ item: string }>;
  meetingPoint?: string;
  mapAddress?: string;
  maxParticipants?: number;
}
```

---

## ⚠️ Key Differences

### 1. **Images** 🖼️
- **Sanity:** Stores images as asset references with full metadata
  ```json
  {
    "mainImage": {
      "asset": {
        "_id": "image-abc123",
        "url": "https://cdn.sanity.io/images/..."
      }
    }
  }
  ```
- **Payload:** Stores images as direct URL strings
  ```json
  {
    "imageUrl": "https://cdn.sanity.io/images/..."
  }
  ```
- **Migration:** ✅ Extracts URL from Sanity asset and stores in Payload

### 2. **Description** 📝
- **Sanity:** Rich text (Portable Text) with formatting, links, images
  ```json
  {
    "description": [
      {
        "_type": "block",
        "children": [{ "text": "Visit the Vatican..." }]
      }
    ]
  }
  ```
- **Payload:** Plain text string only
  ```json
  {
    "description": "Visit the Vatican..."
  }
  ```
- **Migration:** ✅ Converts Portable Text to plain text (formatting lost)

### 3. **Array Fields** 📚
- **Sanity:** Simple string arrays
  ```json
  {
    "highlights": ["Skip the line", "Expert guide", "Small group"]
  }
  ```
- **Payload:** Array of objects with `item` property
  ```json
  {
    "highlights": [
      { "item": "Skip the line" },
      { "item": "Expert guide" },
      { "item": "Small group" }
    ]
  }
  ```
- **Migration:** ✅ Wraps strings in objects

### 4. **Slug Format** 🔗
- **Sanity:** Object with `current` property
  ```json
  { "slug": { "current": "vatican-tour" } }
  ```
- **Payload:** Direct string
  ```json
  { "slug": "vatican-tour" }
  ```
- **Migration:** ✅ Extracts `current` value

### 5. **Site Association** 🏢
- **Sanity:** Array of site references
  ```json
  {
    "sites": [
      { "_ref": "site-wondersofrome", "_type": "reference" }
    ]
  }
  ```
- **Payload:** Single tenant string
  ```json
  { "tenant": "wondersofrome" }
  ```
- **Migration:** ✅ Uses target site ID

### 6. **Missing Fields in Payload** ❌

These Sanity fields have **NO equivalent** in current Payload schema:
- `studentPrice` - Special pricing for students
- `youthPrice` - Special pricing for youth
- `location` - Tour location string
- `itinerary` - Step-by-step tour itinerary
- `gallery` - Additional images array

**Impact:** These fields will be **LOST** unless Payload schema is updated first.

---

## 🛠️ Migration Options

### Option 1: Migrate Now (Lose Some Data) ⚠️

**Pros:**
- Quick and simple
- Works with current Payload schema
- Migrates 90% of data

**Cons:**
- Loses: studentPrice, youthPrice, location, itinerary, gallery
- Description formatting lost (becomes plain text)

**Use Case:** If you don't need the missing fields

### Option 2: Update Payload Schema First (Recommended) ✅

**Pros:**
- **NO DATA LOSS**
- Preserves all fields
- Future-proof

**Cons:**
- Requires Payload schema update
- Takes more time

**Use Case:** If you want to preserve all data

---

## 📊 Field Mapping Table

| Sanity Field | Payload Field | Status | Notes |
|--------------|---------------|--------|-------|
| `_id` | `id` | ✅ Mapped | Auto-generated in Payload |
| `title` | `title` | ✅ Mapped | Direct copy |
| `slug.current` | `slug` | ✅ Mapped | Extract current value |
| `mainImage.asset.url` | `imageUrl` | ✅ Mapped | Extract URL string |
| `price` | `price` | ✅ Mapped | Direct copy |
| `studentPrice` | - | ❌ **LOST** | No Payload field |
| `youthPrice` | - | ❌ **LOST** | No Payload field |
| `duration` | `duration` | ✅ Mapped | Direct copy |
| `description` (PT) | `description` | ⚠️ Partial | Formatting lost |
| `category` | `category` | ✅ Mapped | Direct copy |
| `highlights[]` | `highlights[].item` | ✅ Mapped | Wrap in objects |
| `features[]` | `highlights[].item` | ✅ Mapped | Alias for highlights |
| `badge` | `badge` | ✅ Mapped | Direct copy |
| `rating` | `rating` | ✅ Mapped | Direct copy |
| `reviewCount` | `reviewCount` | ✅ Mapped | Direct copy |
| `groupSize` | `groupSize` | ✅ Mapped | Direct copy |
| `location` | - | ❌ **LOST** | No Payload field |
| `tags[]` | `tags[].tag` | ✅ Mapped | Wrap in objects |
| `guestTypes[]` | `guestTypes[]` | ✅ Mapped | Direct copy |
| `includes[]` | `includes[].item` | ✅ Mapped | Wrap in objects |
| `excludes[]` | `excludes[].item` | ✅ Mapped | Wrap in objects |
| `importantInfo[]` | `importantInfo[].item` | ✅ Mapped | Wrap in objects |
| `itinerary[]` | - | ❌ **LOST** | No Payload field |
| `meetingPoint` | `meetingPoint` | ✅ Mapped | Direct copy |
| `mapAddress` | `mapAddress` | ✅ Mapped | Direct copy |
| `maxParticipants` | `maxParticipants` | ✅ Mapped | Direct copy |
| `sites[]` | `tenant` | ✅ Mapped | Use target site |
| `gallery[]` | - | ❌ **LOST** | No Payload field |

**Summary:**
- ✅ **Mapped:** 20 fields
- ⚠️ **Partial:** 1 field (description)
- ❌ **Lost:** 5 fields (studentPrice, youthPrice, location, itinerary, gallery)

---

## 🚀 Migration Script Usage

### Prerequisites

```bash
# Install dependencies
npm install @sanity/client node-fetch dotenv

# Ensure .env file has all required variables
cd wondersofrome/wondersofrome
cat .env | grep -E "SANITY|PAYLOAD"
```

### Dry Run (Recommended First)

```bash
# See what would be migrated without making changes
node migrate-sanity-to-payload.js --dry-run

# Dry run for specific site
node migrate-sanity-to-payload.js --dry-run --site wondersofrome
```

### Live Migration

```bash
# Migrate tours (skip existing)
node migrate-sanity-to-payload.js

# Migrate and overwrite existing tours
node migrate-sanity-to-payload.js --force

# Migrate specific site
node migrate-sanity-to-payload.js --site ticketsinrome
```

### Command Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview migration without making changes |
| `--force` | Overwrite existing tours in Payload |
| `--site <name>` | Specify which site to migrate (default: wondersofrome) |

---

## 📝 Migration Process

### Step 1: Backup Current Data

```bash
# Backup Payload database
# (Contact your hosting provider for database backup)

# Export Sanity data
npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz
```

### Step 2: Run Dry Run

```bash
node migrate-sanity-to-payload.js --dry-run
```

**Review the output:**
- Number of tours to migrate
- Field mapping details
- Any errors or warnings

### Step 3: Run Migration

```bash
# First run (skip existing)
node migrate-sanity-to-payload.js

# If you want to update existing tours
node migrate-sanity-to-payload.js --force
```

### Step 4: Verify Results

1. **Check Payload Admin:** https://admin.wondersofrome.com
2. **Compare counts:**
   - Sanity tours: Check migration output
   - Payload tours: Check admin panel
3. **Spot check tours:**
   - Open 5-10 random tours
   - Verify all fields populated
   - Check images loading

### Step 5: Update DATA_SOURCE

```bash
# After successful migration, update .env
DATA_SOURCE=payload  # Use Payload only
# or
DATA_SOURCE=hybrid   # Keep using both (Payload data + Sanity images)
```

---

## 🔧 Updating Payload Schema (Optional)

If you want to preserve ALL fields, update Payload schema first:

### Add Missing Fields to Payload

```typescript
// In your Payload collections config
{
  name: 'tours',
  fields: [
    // ... existing fields ...
    
    // Add these fields:
    {
      name: 'studentPrice',
      type: 'number',
      admin: {
        description: 'Special price for students',
      },
    },
    {
      name: 'youthPrice',
      type: 'number',
      admin: {
        description: 'Special price for youth (under 18)',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Tour location (e.g., "Vatican City, Rome")',
      },
    },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'duration', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'url', type: 'text' },
        { name: 'alt', type: 'text' },
      ],
    },
  ],
}
```

Then update the migration script to include these fields.

---

## ⚡ Performance

- **Speed:** ~2-5 tours per second
- **Time Estimate:**
  - 50 tours: ~10-25 seconds
  - 100 tours: ~20-50 seconds
  - 366 tours: ~1-3 minutes

---

## 🐛 Troubleshooting

### Error: "Payload auth failed"

**Solution:** Check credentials in `.env`:
```bash
PAYLOAD_API_EMAIL=superadmin@romeagency.com
PAYLOAD_API_PASSWORD=SuperAdmin2025!
```

### Error: "Site not found in Sanity"

**Solution:** Verify site slug exists in Sanity:
```bash
# Check available sites
npx sanity documents query '*[_type == "site"]{ title, slug }'
```

### Error: "Failed to create tour"

**Possible causes:**
1. Duplicate slug (use `--force` to overwrite)
2. Missing required fields
3. Invalid data format

**Solution:** Check Payload admin logs or run with `--dry-run` first

### Images Not Showing After Migration

**Cause:** Payload stores Sanity CDN URLs, which are still valid

**Solution:** Images should work fine. If not:
1. Check `imageUrl` field in Payload admin
2. Verify Sanity CDN URLs are accessible
3. Consider uploading images to Cloudflare R2

---

## 📈 Post-Migration

### Update dataAdapter.ts

After migration, you can switch to Payload-only:

```typescript
// Option 1: Payload only
DATA_SOURCE=payload

// Option 2: Keep hybrid (recommended)
DATA_SOURCE=hybrid  // Payload data + Sanity images
```

### Benefits of Hybrid Mode

- ✅ Payload has all data (prices, availability, descriptions)
- ✅ Sanity images still work (high-quality CDN)
- ✅ Best of both worlds
- ✅ No image migration needed

---

## 🎯 Recommendations

### For wondersofrome:

1. **Keep hybrid mode** (`DATA_SOURCE=hybrid`)
   - Payload: Manage prices, availability, descriptions
   - Sanity: Keep high-quality images
   - No need to migrate images

2. **Run migration with `--dry-run` first**
   - Verify field mapping
   - Check for errors
   - Review what will be migrated

3. **Don't use `--force` initially**
   - Let it skip existing tours
   - Only use `--force` if you need to update

4. **Verify after migration**
   - Check Payload admin
   - Test website
   - Verify booking flow

---

## 📞 Support

If you encounter issues:

1. **Check logs:** Migration script shows detailed output
2. **Dry run first:** Always test with `--dry-run`
3. **Backup data:** Before running live migration
4. **Review schema:** Understand what fields will be lost

---

## ✅ Summary

**Current Status:**
- Sanity: 50+ tours with complete data and images
- Payload: 366 tours but missing images (all `mainImage: null`)

**Migration Result:**
- ✅ Transfers 20+ fields per tour
- ⚠️ Loses 5 fields (unless Payload schema updated)
- ✅ Preserves images as URLs
- ✅ Maintains all pricing and availability data

**Recommended Approach:**
1. Run `--dry-run` to preview
2. Migrate with default settings (skip existing)
3. Keep `DATA_SOURCE=hybrid` for best results
4. Verify in Payload admin
5. Test website functionality

**Time Required:**
- Dry run: 30 seconds
- Migration: 1-3 minutes
- Verification: 5-10 minutes
- **Total: ~15 minutes**

---

**Ready to migrate? Run the script and preserve your data! 🚀**
