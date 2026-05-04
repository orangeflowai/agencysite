# TicketsInRome UI Migration Plan
## Replacing Old UI with New Modern UI + Backend Sync

**Status:** Planning Phase  
**Target:** Replace ticketsinrome UI with new tickets_in_rome while preserving all backend integration  
**Timeline:** 6 phases (estimated 4-6 hours)

---

## Executive Summary

The new UI (`tickets_in_rome`) is a modern, component-based design with:
- **Radix UI components** (accessibility-first)
- **Tailwind CSS v4** (modern styling)
- **Section-based architecture** (Hero, Philosophy, Featured Products, Gallery, etc.)
- **Responsive design** with proper spacing (8pt grid)
- **No backend integration yet** (hardcoded tour data)

The current ticketsinrome has:
- **Full backend integration** (Payload CMS, Sanity, Supabase)
- **Complex booking flow** (CheckoutDrawer, BookingWidget, Cart)
- **Admin dashboard** (inventory, payments, bookings)
- **API routes** (webhooks, checkout, tours)
- **Database schema** (tours, inventory, bookings)

**Goal:** Merge the modern UI with the existing backend infrastructure.

---

## Phase 1: Analysis & Preparation (30 mins)

### 1.1 Current State Assessment
- [x] New UI structure: `/ticketsinrome-copy/tickets_in_rome/`
- [x] Current backend: `/ticketsinrome-copy/ticketsinrome/`
- [x] Dependencies identified
- [x] Backend integration points mapped

### 1.2 Key Differences

| Aspect | New UI | Current Backend |
|--------|--------|-----------------|
| **Framework** | Next.js 16 | Next.js 16.1.3 |
| **React** | 19.2.0 | 19.2.3 |
| **UI Library** | Radix UI + shadcn | Radix UI + custom |
| **Styling** | Tailwind v4 | Tailwind v3 |
| **CMS** | None (hardcoded) | Sanity + Payload |
| **Database** | None | Supabase |
| **Booking** | None | Full flow |
| **Admin** | None | Full dashboard |

### 1.3 Files to Preserve from Current Backend
```
src/lib/
  ├── payloadService.ts      (Payload CMS integration)
  ├── sanityService.ts       (Sanity CMS integration)
  ├── supabase.ts            (Database client)
  ├── supabaseAdmin.ts       (Admin operations)
  ├── stripe.ts              (Payment processing)
  ├── inventoryService.ts    (Inventory management)
  ├── email-templates.ts     (Email generation)
  └── constants.ts           (Site configuration)

src/app/api/
  ├── webhooks/              (Stripe webhooks)
  ├── checkout/              (Payment checkout)
  ├── tickets/               (Ticket generation)
  ├── availability/          (Tour availability)
  └── book/                  (Booking creation)

src/context/
  ├── CartContext.tsx        (Shopping cart)
  ├── AdminContext.tsx       (Admin state)
  └── ThemeContext.tsx       (Theme management)

src/components/
  ├── BookingWidget.tsx      (Booking trigger)
  ├── CheckoutDrawer.tsx     (Payment modal)
  ├── CartDropdown.tsx       (Cart display)
  └── Footer.tsx             (Footer with links)

.env                         (All environment variables)
middleware.ts               (Request handling)
```

---

## Phase 2: Setup & Structure (45 mins)

### 2.1 Create New Project Structure
```bash
# Copy new UI as base
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/* \
      /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/

# This will:
# - Replace app/ with new structure
# - Replace components/ with new Radix UI components
# - Update package.json with new dependencies
# - Update tailwind.config.ts to v4
```

### 2.2 Merge Dependencies
**New UI dependencies to add:**
```json
{
  "@radix-ui/*": "latest",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "1.0.4",
  "embla-carousel-react": "8.5.1",
  "input-otp": "1.4.1",
  "lucide-react": "^0.454.0",
  "next-themes": "^0.4.6",
  "react-resizable-panels": "^2.1.7",
  "recharts": "2.15.4",
  "sonner": "^1.7.4",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^1.1.2",
  "zod": "3.25.76"
}
```

**Keep existing backend dependencies:**
```json
{
  "@sanity/image-url": "^2.0.3",
  "@stripe/react-stripe-js": "^3.6.0",
  "@stripe/stripe-js": "^8.6.4",
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.93.2",
  "framer-motion": "^12.34.3",
  "next-sanity": "^12.0.15",
  "resend": "^6.7.0",
  "sanity": "^5.4.0",
  "stripe": "^20.2.0"
}
```

### 2.3 Update Configuration Files
- **tailwind.config.ts** → Upgrade to v4 syntax
- **tsconfig.json** → Ensure path aliases work
- **next.config.ts** → Keep existing image domains
- **postcss.config.mjs** → Update for Tailwind v4

---

## Phase 3: Integrate Backend Services (1 hour)

### 3.1 Copy Backend Integration Files
```bash
# Copy all backend service files
cp src/lib/payloadService.ts → new location
cp src/lib/sanityService.ts → new location
cp src/lib/supabase.ts → new location
cp src/lib/stripe.ts → new location
cp src/lib/inventoryService.ts → new location
cp src/lib/email-templates.ts → new location
cp src/lib/constants.ts → new location

# Copy API routes
cp -r src/app/api/* → new location

# Copy context providers
cp src/context/* → new location

# Copy middleware
cp middleware.ts → new location
```

### 3.2 Create Backend Integration Layer
**New file: `src/lib/backendAdapter.ts`**
```typescript
// Unified interface for fetching tours from Payload CMS
export async function getTours(siteId: string) {
  const tours = await fetch(`${PAYLOAD_API_URL}/api/tours?site=${siteId}`)
  return tours.json()
}

// Get featured tours for homepage
export async function getFeaturedTours(siteId: string, limit: number = 6) {
  const tours = await getTours(siteId)
  return tours.filter(t => t.featured).slice(0, limit)
}

// Get tour by slug
export async function getTourBySlug(slug: string) {
  const tour = await fetch(`${PAYLOAD_API_URL}/api/tours?slug=${slug}`)
  return tour.json()
}
```

### 3.3 Update Environment Variables
**Preserve all existing .env variables:**
```env
# ============================================
# RESEND - Email Service (Shared)
# ============================================
RESEND_API_KEY=re_GtXjh56Y_5m8EnUQyA8T5mGA3m8epSVyS

# ============================================
# SANITY CMS (Shared)
# ============================================
NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...

# ============================================
# SUPABASE (Shared)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# ============================================
# STRIPE CONFIGURATION
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME=pk_live_...
STRIPE_SECRET_KEY_ROME=sk_live_...
STRIPE_WEBHOOK_SECRET_ROME=whsec_...

# ============================================
# MULTI-SITE CONFIGURATION
# ============================================
NEXT_PUBLIC_SITE_ID=ticketsinrome
NEXT_PUBLIC_SITE_NAME=Rome Tour Tickets
NEXT_PUBLIC_SITE_URL=https://ticketsinrome.com
NEXT_PUBLIC_BASE_URL=https://ticketsinrome.com

# ============================================
# PAYLOAD CMS — Data Source
# ============================================
DATA_SOURCE=dual
NEXT_PUBLIC_PAYLOAD_URL=https://admin.wondersofrome.com
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_TENANT=ticketsinrome
PAYLOAD_API_KEY=oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE
```

---

## Phase 4: Update UI Components (1.5 hours)

### 4.1 Update Featured Products Section
**File: `components/sections/featured-products-section.tsx`**

Replace hardcoded tours with backend data:
```typescript
"use client";

import { useEffect, useState } from "react";
import { FadeImage } from "@/components/fade-image";
import { Star } from "lucide-react";
import { getFeaturedTours } from "@/lib/backendAdapter";

export function FeaturedProductsSection() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        const data = await getFeaturedTours("ticketsinrome", 6);
        setTours(data);
      } catch (error) {
        console.error("Failed to load tours:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTours();
  }, []);

  if (loading) return <div>Loading tours...</div>;

  return (
    <section id="vatican" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Curated Experiences.
          <br />
          Unforgettable Memories.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Skip-the-Line Tours
        </p>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {tours.map((tour) => (
          <div key={tour.id} className="group cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={tour.mainImage?.url || "/placeholder.jpg"}
                alt={tour.title}
                fill
                className="object-cover group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-foreground text-background px-3 py-1 text-xs font-medium rounded-full">
                  {tour.category || "Tour"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-foreground text-foreground" />
                <span className="text-sm font-medium">{tour.rating || "4.8"}</span>
                <span className="text-sm text-muted-foreground">
                  ({tour.reviewCount || 0} reviews)
                </span>
              </div>
              <h3 className="text-foreground text-xl font-semibold">
                {tour.title}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">
                  {tour.duration || "3 hours"}
                </span>
                <span className="text-lg font-medium">
                  From €{tour.price || "0"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 4.2 Add Booking Widget to New UI
**File: `components/booking-widget.tsx`** (copy from current backend)

Integrate the booking flow:
- Add "Book Now" buttons to tour cards
- Show CheckoutDrawer modal
- Handle cart state with CartContext
- Process payments with Stripe

### 4.3 Update Header Component
**File: `components/header.tsx`**

Add:
- Navigation links (About, Blog, Contact, FAQ)
- Cart dropdown
- Language switcher
- WhatsApp button
- Admin login link

### 4.4 Update Footer Component
**File: `components/sections/footer-section.tsx`**

Add:
- Contact information (from env vars)
- Social links
- Legal pages (Privacy, Terms, Cancellation)
- Newsletter signup
- Payment icons

---

## Phase 5: Sync Backend Data (1 hour)

### 5.1 Create Data Sync Service
**File: `src/lib/dataSyncService.ts`**

```typescript
export async function syncToursFromPayload() {
  const tours = await fetch(
    `${PAYLOAD_API_URL}/api/tours?site=ticketsinrome&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${PAYLOAD_API_KEY}`,
      },
    }
  ).then(r => r.json());

  return tours.docs || [];
}

export async function syncAddonsFromPayload() {
  const addons = await fetch(
    `${PAYLOAD_API_URL}/api/addons?site=ticketsinrome`,
    {
      headers: {
        Authorization: `Bearer ${PAYLOAD_API_KEY}`,
      },
    }
  ).then(r => r.json());

  return addons.docs || [];
}

export async function syncInventoryFromSupabase() {
  const { data } = await supabase
    .from("inventory")
    .select("*")
    .eq("site_id", "ticketsinrome");

  return data || [];
}
```

### 5.2 Create API Route for Tours
**File: `src/app/api/tours/route.ts`**

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured") === "true";
  const limit = parseInt(searchParams.get("limit") || "6");

  try {
    const tours = await syncToursFromPayload();
    
    let filtered = tours;
    if (featured) {
      filtered = tours.filter(t => t.featured);
    }
    
    return Response.json(filtered.slice(0, limit));
  } catch (error) {
    return Response.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
```

### 5.3 Update Featured Products to Use API
```typescript
useEffect(() => {
  async function loadTours() {
    try {
      const response = await fetch("/api/tours?featured=true&limit=6");
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error("Failed to load tours:", error);
    } finally {
      setLoading(false);
    }
  }
  loadTours();
}, []);
```

### 5.4 Verify Data Flow
- [ ] Tours load from Payload CMS
- [ ] Images display correctly
- [ ] Prices and ratings show
- [ ] Availability data syncs
- [ ] Inventory updates in real-time

---

## Phase 6: Testing & Verification (1 hour)

### 6.1 Functional Testing

#### Homepage
- [ ] All sections render correctly
- [ ] Featured products load from backend
- [ ] Images load and display properly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Spacing follows 8pt grid (from design system)

#### Booking Flow
- [ ] "Book Now" buttons appear on tour cards
- [ ] Clicking opens CheckoutDrawer modal
- [ ] Contact form displays correctly
- [ ] Stripe payment element loads
- [ ] Payment processing works
- [ ] Success page shows after payment

#### Navigation
- [ ] Header navigation links work
- [ ] Footer links navigate correctly
- [ ] Cart dropdown shows items
- [ ] Language switcher works
- [ ] WhatsApp button opens chat

#### Admin
- [ ] Admin login page accessible
- [ ] Dashboard loads
- [ ] Inventory management works
- [ ] Booking management works
- [ ] Payment history displays

### 6.2 Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Images optimized with next/image
- [ ] No console errors
- [ ] No memory leaks
- [ ] API calls complete successfully

### 6.3 Backend Integration Testing
- [ ] Payload CMS connection works
- [ ] Sanity CMS fallback works
- [ ] Supabase database queries work
- [ ] Stripe webhook receives events
- [ ] Email notifications send
- [ ] Ticket generation works

### 6.4 Design System Compliance
- [ ] Spacing: All gaps/padding use 8pt grid (gap-2, gap-4, gap-6, etc.)
- [ ] Typography: Body text ≥ 16px, proper line heights
- [ ] Colors: All from CSS variables (no hardcoded hex)
- [ ] Components: All states (hover, active, disabled, loading) work
- [ ] Responsive: Mobile-first design works on all breakpoints

### 6.5 Build & Deployment
```bash
# Install dependencies
npm install

# Build project
npm run build

# Check for errors
npm run lint

# Start production server
npm run start

# Test in browser
# Visit http://localhost:3000
```

---

## Phase 7: Deployment (30 mins)

### 7.1 Pre-Deployment Checklist
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set correctly
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] Email service configured
- [ ] Images optimized
- [ ] SEO metadata correct

### 7.2 Deploy to Production
```bash
# Push to main branch
git add .
git commit -m "feat: replace ticketsinrome UI with modern design"
git push origin main

# Deploy to Vercel/hosting
# Monitor deployment logs
# Test live site
```

### 7.3 Post-Deployment
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify bookings work
- [ ] Test payment processing
- [ ] Monitor performance metrics

---

## Key Integration Points

### 1. Tour Data Flow
```
Payload CMS → API Route (/api/tours) → Featured Products Section → Display
```

### 2. Booking Flow
```
Tour Card → "Book Now" → CheckoutDrawer → Contact Form → Stripe Payment → Success
```

### 3. Cart Management
```
CartContext → Add to Cart → CartDropdown → Checkout → Process Payment
```

### 4. Admin Dashboard
```
Admin Login → Dashboard → Manage Tours/Inventory/Bookings → Update Payload CMS
```

### 5. Email Notifications
```
Booking Created → Email Template → Resend API → Customer Email
```

---

## File Mapping

### New Files to Create
```
src/lib/backendAdapter.ts          (Tour data fetching)
src/lib/dataSyncService.ts         (Data synchronization)
src/app/api/tours/route.ts         (Tours API endpoint)
src/app/api/tours/[id]/route.ts    (Single tour endpoint)
src/components/booking-widget.tsx  (Booking trigger)
src/components/tour-card.tsx       (Tour card component)
```

### Files to Copy from Current Backend
```
src/lib/payloadService.ts
src/lib/sanityService.ts
src/lib/supabase.ts
src/lib/supabaseAdmin.ts
src/lib/stripe.ts
src/lib/inventoryService.ts
src/lib/email-templates.ts
src/lib/constants.ts
src/app/api/webhooks/*
src/app/api/checkout/*
src/app/api/tickets/*
src/context/CartContext.tsx
src/context/AdminContext.tsx
src/context/ThemeContext.tsx
middleware.ts
```

### Files to Update
```
package.json                       (Merge dependencies)
tailwind.config.ts                 (Upgrade to v4)
tsconfig.json                      (Ensure paths work)
next.config.ts                     (Keep image domains)
postcss.config.mjs                 (Update for v4)
.env                               (Preserve all variables)
components/header.tsx              (Add navigation)
components/sections/footer-section.tsx (Add links)
components/sections/featured-products-section.tsx (Add backend data)
```

---

## Rollback Plan

If issues occur:

1. **Keep current version backed up**
   ```bash
   cp -r ticketsinrome-copy/ticketsinrome ticketsinrome-backup-$(date +%s)
   ```

2. **Git history preserved**
   ```bash
   git log --oneline  # View all commits
   git revert <commit-hash>  # Revert specific commit
   ```

3. **Database rollback**
   - Supabase has automatic backups
   - Can restore from point-in-time recovery

---

## Success Criteria

✅ **Phase 1:** Analysis complete, all files identified  
✅ **Phase 2:** New structure in place, dependencies merged  
✅ **Phase 3:** Backend services integrated, APIs working  
✅ **Phase 4:** UI components updated, booking flow works  
✅ **Phase 5:** Data syncing from Payload CMS  
✅ **Phase 6:** All tests pass, design system compliant  
✅ **Phase 7:** Deployed to production, monitoring active  

---

## Timeline Estimate

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Analysis & Preparation | 30 min | ⏳ |
| 2 | Setup & Structure | 45 min | ⏳ |
| 3 | Backend Integration | 1 hour | ⏳ |
| 4 | UI Components | 1.5 hours | ⏳ |
| 5 | Data Sync | 1 hour | ⏳ |
| 6 | Testing & Verification | 1 hour | ⏳ |
| 7 | Deployment | 30 min | ⏳ |
| **TOTAL** | | **6 hours** | ⏳ |

---

## Next Steps

1. **Confirm this plan** with stakeholders
2. **Start Phase 1** - Verify all files and dependencies
3. **Execute Phase 2** - Set up new structure
4. **Proceed through phases** sequentially
5. **Monitor and test** at each phase
6. **Deploy when ready** with confidence

---

## Questions & Considerations

1. **Should we keep Sanity CMS or migrate fully to Payload?**
   - Current: Dual mode (Payload primary, Sanity fallback)
   - Recommendation: Keep dual for safety, migrate gradually

2. **Do we need to preserve the admin dashboard?**
   - Yes, it's critical for managing tours, inventory, and bookings
   - Will be integrated into new UI

3. **What about existing bookings and customer data?**
   - All data stays in Supabase
   - No data loss, just UI replacement

4. **Timeline for going live?**
   - Can be done in one day with proper testing
   - Recommend staging environment first

5. **Do we need to update SEO?**
   - Yes, ensure meta tags and structured data are correct
   - Update sitemap.ts for new routes

---

**Created:** 2024  
**Status:** Ready for Execution  
**Next Action:** Confirm plan and begin Phase 1
