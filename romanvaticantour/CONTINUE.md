# romanvaticantour — State & Continuation Guide

## Project Overview
- **Site**: https://romanvaticantour.vercel.app (prod alias)
- **Custom domain**: `romanvaticantour.com` — NOT yet configured in Vercel
- **Vercel account**: `abthelight-6156s-projects`
- **GitHub**: `orangeflowai/agencysite` (monorepo at `/home/abiilesh/travelwebsite`)
- **Path**: `/home/abiilesh/travelwebsite/romanvaticantour`

## Infrastructure

### Sanity
- **Project ID**: `etutpkdi`
- **Dataset**: `production`
- **Studio URL**: `https://romanvaticantour.vercel.app/studio`
- **Site doc ID**: `CTM4OOyGF5ygbudaW53MAn` (slug: `romanvaticantour`)
- **DEDICATED** — only romanvaticantour uses this project
- **4 tours** live with AI-generated Vatican images
- **0 old tours** — all 30 deleted

### Supabase
- **URL**: `https://ogrvhooygcoazracbvkb.supabase.co`
- **SHARED** across: romanvaticantour, wondersofrome, ticketsinrome-server
- **Schema mismatch**: Code uses `customer_name`/`customer_email`/`total_price` but DB has `lead_first_name`/`lead_email`/`total_amount`. See `src/db/migration_fix_flaws.sql`.
- **Migration needed** (run in Supabase SQL Editor):
  - `ALTER TABLE bookings ADD COLUMN IF NOT EXISTS site_id text;`
  - `ALTER TABLE inventory ADD COLUMN IF NOT EXISTS total_slots integer NOT NULL DEFAULT 20;`
  - Create `audit_logs` and `inventory_errors` tables
  - Create `reserve_inventory_slots()` function (prevents overbooking)

### Stripe
- **Live keys** configured in `.env`:
  - `STRIPE_SECRET_KEY_ROMANVATICANTOUR=sk_live_51TycjM49sCzUrTbP...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMANVATICANTOUR=pk_live_51TycjM...`
  - `STRIPE_WEBHOOK_SECRET_ROMANVATICANTOUR=whsec_...`
- **Webhook URL**: `https://romanvaticantour.com/api/webhooks/stripe`
- **Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`, `checkout.session.expired`

### Resend (Email)
- **API Key**: Set in `.env` (not committed)
- **From**: `info@romanvaticantour.com`

## 4 Vatican Tour Products

| # | Title | Slug | Price | Rating |
|---|-------|------|-------|--------|
| 1 | Vatican Museums and Sistine Chapel Tour with Official Local Guide | `vatican-museums-sistine-chapel-guided-tour` | €93 | 4.0 |
| 2 | Fast Pass Skip The Line Vatican Museums and Sistine Chapel | `fast-pass-vatican-museums-sistine-chapel` | €71 | 4.5 |
| 3 | Skip-The-Line Ticket Vatican Museums and Sistine Chapel Fast Pass | `skip-the-line-vatican-museum-sistine-chapel` | €72 | 3.4 |
| 4 | Vatican Museums & Sistine Chapel Official Tour Entrance St. Basilica | `vatican-museum-sistine-chapel-st-basilica` | €113 | 3.3 |

All have `category: "vatican"`, guest types (Adult/Student/Youth), highlights, includes/excludes, SEO metadata, and AI-generated main images.

## Key Files Modified

### Security
- `src/lib/apiAuth.ts` — **NEW** Admin auth helper (`requireAdmin`, `requireAdminAction`)
- `src/lib/supabaseAdmin.ts` — Added `import 'server-only'`
- `src/middleware.ts` — **DELETED** (weak auth; root `middleware.ts` with Supabase SSR wins)
- `src/lib/utils.ts` — Added `escapeHtml()` XSS helper
- 19+ API routes gated with `requireAdmin()` (debug, seed, admin, AI, tickets)

### Payment
- `src/app/api/create-payment-intent/route.ts` — Server-side price calc from Sanity, flat metadata
- `src/app/api/webhooks/stripe/route.ts` — Flat metadata parsing, proper inventory failure handling, lazy Resend
- `src/lib/inventoryService.ts` — Atomic RPC-based reservation (needs DB migration)
- `src/lib/stripe.ts` — Removed `sk_test_placeholder` default
- `src/components/CheckoutDrawer.tsx` — Stripe status handling for requires_action/processing
- `src/components/BookingWizard.tsx` — Same Stripe fix

### Products
- `src/lib/sanityService.ts` — `filterRealTours` restricts to 4 slugs, added `guestTypes` to Tour interface, reduced revalidate to 60s
- `src/lib/dataAdapter.ts` — Re-exports from sanityService
- `src/app/page.tsx` — Maps tours correctly, `revalidate: 60`

### UI
- `src/components/Navbar.tsx` — Removed Colosseum, reduced marquee to 3x
- `src/components/vatican/header.tsx` — Fixed nav links, tablet `lg:hidden` fix
- `src/app/globals.css` — Removed duplicate scrollbar utils, renamed `--vatican-purple` → `--vatican-red`
- `src/app/checkout/page.tsx` — Cart hydration fix (waits for `isLoaded`)
- `src/context/CartContext.tsx` — Added `isLoaded` to context
- `src/components/Newsletter.tsx` — Removed fake success
- `src/lib/ticketGenerator.ts:220` — Fixed `${...}` template literal
- `src/components/EmbeddedMap.tsx:50` — Fixed `${...}` template literal
- `src/context/LanguageContext.tsx:740` — Fixed `${...}` template literal
- `src/app/admin/AdminLayoutClient.tsx` — Sign-out wired

## Correct Contact Info (Single Source of Truth)
- **Company**: Roman Vatican Tour S.R.L.S.
- **Address**: Via Germanico, 28, 00192 Rome, Italy
- **Email**: info@romanvaticantour.com
- **Phone/WhatsApp**: +39 389 521 7315
- **Google Maps**: https://www.google.com/maps/place/Roman+Vatican+Tour+S.R.L.S/@41.9072162,12.4540592,17z
- **TripAdvisor**: https://www.tripadvisor.com/Attraction_Review-g187791-d25773069-Reviews-Roman_Vatican_tour_S_R_L_S-Rome_Lazio.html
- **Social**: facebook.com/romanvaticantour, instagram.com/romanvaticantour, twitter.com/romanvaticantour

## Navbar Changes (2026-08-04)
- Changed "Vatican Tours" + "Private Tours" → single "Tours" link to `/`
- "BOOK NOW" → links to `/` (homepage shows tours)
- Same fixes applied to `vatican/header.tsx`, Footer category links

## Remaining TODO

### Must do
1. **Run Supabase migration** (`src/db/migration_fix_flaws.sql`) in Supabase SQL Editor
2. **Add `romanvaticantour.com` domain** in Vercel Dashboard → Domains
3. **Add env vars to Vercel** for production (Stripe keys, Supabase keys, Sanity token, Resend key)
4. **Verify `/search` page shows tours** — `SearchResults.tsx` fetches via `getTours()` which uses `filterRealTours()` restricting to 4 slug-whitelisted tours. If empty, check Sanity slugs match whitelist.

### Nice to have
5. Fix column name mismatches between code and actual Supabase schema (code uses `customer_name` but DB has `lead_first_name`, etc.)
6. Add `site_id` scoping to admin dashboard (currently shows all bookings across sites)
7. Delete old blog posts from Sanity (3 posts remain)
8. Add more tour images to gallery arrays in Sanity

## Deploy Flow
```bash
cd /home/abiilesh/travelwebsite/romanvaticantour
git add ./src && git commit -m "fix: ..." && git push origin main
vercel deploy --prod
```

## URLs to Verify
- https://romanvaticantour.vercel.app — Homepage with 4 tours
- https://romanvaticantour.vercel.app/tour/vatican-museums-sistine-chapel-guided-tour
- https://romanvaticantour.vercel.app/studio — Sanity Studio
- https://romanvaticantour.vercel.app/admin/login — Admin dashboard
