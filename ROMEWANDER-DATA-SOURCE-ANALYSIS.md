# 🔍 Rome Wander - Complete Data Source Analysis

## Overview

Rome Wander (`romewander.com`) is configured to fetch **ALL data from Payload CMS** at `https://admin.wondersofrome.com`.

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ROME WANDER WEBSITE                       │
│                   (romewander.com)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ DATA_SOURCE=payload
                       │ PAYLOAD_TENANT=romewander
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA ADAPTER LAYER                        │
│              (src/lib/dataAdapter.ts)                        │
│                                                              │
│  • getTours()     → Payload Service                          │
│  • getTour()      → Payload Service                          │
│  • getPosts()     → Payload Service                          │
│  • getSettings()  → Payload Service                          │
│  • getSite()      → Payload Service                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   PAYLOAD SERVICE                            │
│              (src/lib/payloadService.ts)                     │
│                                                              │
│  API Endpoint: https://admin.wondersofrome.com/api          │
│  Auth: API-Key (oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE)│
│  Tenant Filter: where[tenant][equals]=romewander            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  PAYLOAD CMS BACKEND                         │
│           https://admin.wondersofrome.com                    │
│                                                              │
│  Collections:                                                │
│  • tours (filtered by tenant=romewander)                     │
│  • posts (filtered by tenant=romewander)                     │
│  • site-settings (filtered by tenant=romewander)             │
│  • media (Cloudflare R2 storage)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏠 Homepage Sections - Data Sources

### **1. Hero Section**
- **Component:** `<Hero settings={settings} />`
- **Data Source:** Payload CMS → `site-settings` collection
- **API Call:** `GET /api/site-settings?where[tenant][equals]=romewander`
- **Fields Used:**
  - `heroTitle` - Main headline
  - `heroSubtitle` - Subheadline
  - `heroImage` - Background image
  - `heroVideo` - Background video (if set)

**Served From:** Payload CMS

---

### **2. Stats Bar**
- **Component:** Hardcoded in `page.tsx`
- **Data:** Static values
  - "50,000+ Happy Guests"
  - "4.9 ★ Google Rating"
  - "24/7 Support"
  - "100% Satisfaction"

**Served From:** Hardcoded (not from CMS)

---

### **3. Reviews Section**
- **Component:** `<FloatingReviews />`
- **Data Source:** Likely hardcoded or from a reviews API
- **Note:** Not fetched from Payload/Sanity

**Served From:** Component internal data or external API

---

### **4. Vatican Tours Section**
- **Component:** `<ProductRow title="Vatican Museums & St. Peter's" tours={vaticanTours} />`
- **Data Source:** Payload CMS → `tours` collection
- **API Call:** `GET /api/tours?where[tenant][equals]=romewander&where[active][equals]=true`
- **Filter:** `tours.filter((t) => t.category === 'vatican')`
- **Fields Used:**
  - `title` - Tour name
  - `slug` - URL slug
  - `mainImage` - Tour image
  - `price` - Tour price
  - `duration` - Tour duration
  - `rating` - Star rating
  - `reviewCount` - Number of reviews
  - `badge` - Special badge (e.g., "Bestseller")

**Served From:** Payload CMS (tenant: romewander, category: vatican)

---

### **5. Rome Gallery**
- **Component:** `<RomeGallery />`
- **Data Source:** Likely hardcoded images or from R2
- **Note:** Not fetched from Payload tours

**Served From:** Component internal data or R2 direct URLs

---

### **6. Highlight Section**
- **Component:** `<HighlightSection />`
- **Data:** Hardcoded props
  - Title: "Vatican & Rome's Greatest Experiences, Simplified"
  - Body text
  - CTA button
  - Image from R2: `${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`

**Served From:** Hardcoded + R2 image

---

### **7. Colosseum Tours Section**
- **Component:** `<ProductRow title="Colosseum & Ancient Rome" tours={colosseumTours} />`
- **Data Source:** Payload CMS → `tours` collection
- **API Call:** Same as Vatican tours
- **Filter:** `tours.filter((t) => t.category === 'colosseum')`

**Served From:** Payload CMS (tenant: romewander, category: colosseum)

---

### **8. City Tours Section**
- **Component:** `<ProductRow title="Rome City Tours" tours={cityTours} />`
- **Data Source:** Payload CMS → `tours` collection
- **API Call:** Same as Vatican tours
- **Filter:** `tours.filter((t) => t.category === 'city')`

**Served From:** Payload CMS (tenant: romewander, category: city)

---

### **9. Hidden Gems Section**
- **Component:** `<ProductRow title="Italy Hidden Gems" tours={hiddenGemsTours} />`
- **Data Source:** Payload CMS → `tours` collection
- **API Call:** Same as Vatican tours
- **Filter:** `tours.filter((t) => t.category === 'hidden-gems')`

**Served From:** Payload CMS (tenant: romewander, category: hidden-gems)

---

### **10. Trust Badges Section**
- **Component:** `<TrustBadges />`
- **Data:** Hardcoded trust indicators
  - "Skip-the-Line Access"
  - "Expert Guides"
  - "Small Groups"
  - "Free Cancellation"

**Served From:** Hardcoded (not from CMS)

---

### **11. FAQ Section**
- **Component:** `<FAQ />`
- **Data:** Likely hardcoded Q&A pairs
- **Note:** Not fetched from Payload

**Served From:** Component internal data

---

### **12. Blog Section**
- **Component:** Blog cards with links
- **Data Source:** Payload CMS → `posts` collection
- **API Call:** `GET /api/posts?where[tenant][equals]=romewander&sort=-publishedAt`
- **Filter:** `posts.slice(0, 3)` - Shows first 3 posts
- **Fields Used:**
  - `title` - Post title
  - `slug` - URL slug
  - `mainImage` - Featured image
  - `excerpt` - Short description

**Served From:** Payload CMS (tenant: romewander)

---

## 🎯 Tour Detail Page

**Route:** `/tour/[slug]`

**Data Source:** Payload CMS → `tours` collection

**API Call:** `GET /api/tours?where[slug][equals]={slug}&where[tenant][equals]=romewander`

**All Fields Used:**
- Basic Info: `title`, `slug`, `description`, `price`, `duration`
- Images: `mainImage`, `gallery`
- Details: `highlights`, `includes`, `excludes`, `importantInfo`
- Itinerary: `itinerary[]` (time, title, description, location)
- Booking: `guestTypes[]`, `maxParticipants`, `meetingPoint`
- SEO: `badge`, `rating`, `reviewCount`, `tags`

**Served From:** Payload CMS

---

## 🖼️ Image Sources

### **Tour Images:**
- **Primary Source:** Cloudflare R2
- **URL Pattern:** `https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/...`
- **Storage:** Payload Media collection → R2 bucket `romeagencywebsites`
- **Fallback:** Legacy `imageUrl` field (if mainImage not set)

### **Static Images:**
- **Gallery Images:** R2 direct URLs
- **Hero Images:** Payload site-settings → R2
- **Blog Images:** Payload posts → R2

**All Images Served From:** Cloudflare R2 CDN

---

## 🔑 Configuration Summary

### **Environment Variables (.env):**

```bash
# Data Source
DATA_SOURCE=payload                                    # Uses Payload only
PAYLOAD_TENANT=romewander                              # Filters all data by this tenant
NEXT_PUBLIC_SITE_ID=romewander                         # Site identifier

# Payload API
PAYLOAD_API_URL=https://admin.wondersofrome.com        # Backend URL
PAYLOAD_API_KEY=oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE  # API key for auth

# Images
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev
S3_BUCKET=romeagencywebsites
```

---

## 📋 API Endpoints Used

### **1. Tours API**
```
GET https://admin.wondersofrome.com/api/tours
  ?where[tenant][equals]=romewander
  &where[active][equals]=true
  &depth=2
  &limit=200
  &sort=createdAt
```

**Returns:** All active tours for Rome Wander

---

### **2. Single Tour API**
```
GET https://admin.wondersofrome.com/api/tours
  ?where[slug][equals]={slug}
  &where[tenant][equals]=romewander
  &depth=2
  &limit=1
```

**Returns:** Single tour by slug

---

### **3. Posts API**
```
GET https://admin.wondersofrome.com/api/posts
  ?where[tenant][equals]=romewander
  &sort=-publishedAt
  &depth=2
  &limit=200
```

**Returns:** All blog posts for Rome Wander

---

### **4. Site Settings API**
```
GET https://admin.wondersofrome.com/api/site-settings
  ?where[tenant][equals]=romewander
  &depth=2
  &limit=1
```

**Returns:** Hero settings, contact info, branding

---

## 🔒 Authentication

**Method:** API Key Authentication

**Header:**
```
Authorization: users API-Key oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE
```

**Access Level:** Read-only access to tours, posts, and settings filtered by tenant

---

## 🎨 Data Mapping

### **Payload → Frontend Transformation:**

```typescript
// Payload tour document
{
  id: "123",
  title: "Vatican Tour",
  slug: "vatican-tour",
  price: 79,
  tenant: "romewander",
  mainImage: { url: "https://r2.dev/image.jpg" },
  highlights: [{ item: "Skip the line" }],
  guestTypes: [{ name: "Adult", price: 79 }]
}

// Transformed to frontend Tour type
{
  _id: "123",
  title: "Vatican Tour",
  slug: { current: "vatican-tour" },
  price: 79,
  mainImage: { asset: { _id: "123", url: "https://r2.dev/image.jpg" } },
  highlights: ["Skip the line"],
  guestTypes: [{ name: "Adult", price: 79 }]
}
```

---

## 🔄 Fallback Strategy

**Current Mode:** `DATA_SOURCE=payload` (Payload only)

**Available Modes:**
1. `payload` - Payload CMS only (current)
2. `sanity` - Sanity CMS only
3. `dual` - Payload first, Sanity fallback

**Fallback Logic:**
```typescript
// If Payload returns empty or fails, falls back to Sanity
// Currently disabled (payload mode only)
```

---

## 📊 Data Freshness

**Revalidation:** `revalidate = 3600` (1 hour)

**Cache Strategy:**
- Homepage: Regenerated every hour
- Tour pages: Regenerated every hour
- Blog posts: Regenerated every hour

**Manual Revalidation:** Rebuild site or clear Next.js cache

---

## ✅ Summary Table

| Section | Data Source | API Endpoint | Tenant Filter | Category Filter |
|---------|-------------|--------------|---------------|-----------------|
| **Hero** | Payload | `/api/site-settings` | ✅ romewander | - |
| **Stats** | Hardcoded | - | - | - |
| **Reviews** | Component | - | - | - |
| **Vatican Tours** | Payload | `/api/tours` | ✅ romewander | ✅ vatican |
| **Gallery** | R2/Hardcoded | - | - | - |
| **Highlight** | Hardcoded | - | - | - |
| **Colosseum Tours** | Payload | `/api/tours` | ✅ romewander | ✅ colosseum |
| **City Tours** | Payload | `/api/tours` | ✅ romewander | ✅ city |
| **Hidden Gems** | Payload | `/api/tours` | ✅ romewander | ✅ hidden-gems |
| **Trust Badges** | Hardcoded | - | - | - |
| **FAQ** | Component | - | - | - |
| **Blog** | Payload | `/api/posts` | ✅ romewander | - |
| **Tour Detail** | Payload | `/api/tours` | ✅ romewander | - |
| **Images** | R2 CDN | Direct URLs | - | - |

---

## 🔍 Key Findings

1. ✅ **All tour data** comes from Payload CMS
2. ✅ **All images** served from Cloudflare R2
3. ✅ **Tenant filtering** ensures only Rome Wander tours show
4. ✅ **Category filtering** organizes tours by type
5. ⚠️ **Some sections hardcoded** (stats, trust badges, FAQ)
6. ✅ **Blog posts** from Payload CMS
7. ✅ **Hero settings** from Payload CMS
8. ✅ **API key authentication** for secure access

---

## 🛠️ How to Update Content

### **To Add/Edit Tours:**
1. Go to https://admin.wondersofrome.com
2. Login with admin credentials
3. Navigate to Collections → Tours
4. Create/Edit tour
5. **Important:** Set `tenant` to `romewander`
6. Set `category` to one of: `vatican`, `colosseum`, `city`, `hidden-gems`
7. Set `status` to `live`
8. Set `active` to `true`
9. Save

### **To Update Hero:**
1. Go to https://admin.wondersofrome.com
2. Navigate to Collections → Site Settings
3. Find Rome Wander settings (tenant=romewander)
4. Update `heroTitle`, `heroSubtitle`, `heroImage`
5. Save

### **To Add Blog Posts:**
1. Go to https://admin.wondersofrome.com
2. Navigate to Collections → Posts
3. Create new post
4. **Important:** Set `tenant` to `romewander`
5. Add title, excerpt, content, image
6. Save

---

## 📞 API Testing Commands

```bash
# Test tours API
curl "https://admin.wondersofrome.com/api/tours?where[tenant][equals]=romewander&limit=5" \
  -H "Authorization: users API-Key oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE"

# Test site settings
curl "https://admin.wondersofrome.com/api/site-settings?where[tenant][equals]=romewander" \
  -H "Authorization: users API-Key oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE"

# Test posts
curl "https://admin.wondersofrome.com/api/posts?where[tenant][equals]=romewander&limit=3" \
  -H "Authorization: users API-Key oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE"
```

---

**Created:** May 9, 2026  
**Site:** Rome Wander (romewander.com)  
**Data Source:** Payload CMS (admin.wondersofrome.com)  
**Tenant:** romewander
