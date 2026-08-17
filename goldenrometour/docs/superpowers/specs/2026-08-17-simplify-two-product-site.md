# Simplify goldenrometour to a 2-product site

Date: 2026-08-17
Status: Approved

## Goal

Reduce the site to exactly **two tours** and strip all multi-tenant / multi-CMS /
multi-language machinery. The result is a single-tenant, English-only site that
sells two Vatican tours with Stripe checkout, editable availability, and a small
admin dashboard.

## The two tours

| # | Title (exact) | Slug | Type | Price (EUR) |
|---|---|---|---|---|
| 1 | Vatican Museums & Sistine Chapel Skip-the-Line Tour | `vatican-museums-sistine-chapel-skip-the-line` | Skip-the-Line | 45 |
| 2 | Vatican Museums & Sistine Chapel Guided Tour | `vatican-museums-and-sistine-chapel-guided-tour` | Guided Tour | 65 |

These two already exist in `src/lib/toursData.ts`; only the titles change to the
exact strings above. No other tour may appear anywhere (homepage, sitemap,
footer, search, admin, `/tour/[slug]`).

## Keep vs remove

**Keep:**
- Homepage (renders exactly the 2 tours)
- `/tour/[slug]` detail pages (only the 2 slugs resolve)
- Booking flow + Stripe checkout (`/booking`, `create-payment-intent`, webhook,
  `/success`, `/booking/success`)
- Availability (`inventory` table) + admin inventory control
- Bookings + client info (Supabase `bookings` table) + admin bookings view (new)
- Admin: login (cookie auth), tours editor (new), availability, bookings
- Contact page, legal pages (privacy, terms, cancellation, disclaimer), FAQ
- Emails via Resend (customer + admin confirmation), ticket generation

**Remove:**
- Sanity CMS — `src/sanity/**`, `sanity.config.ts`, `/studio` route, `sanityService.ts`, `sanityActions.ts`
- Payload CMS — `payloadClient.ts`, `payloadService.ts`, all `PAYLOAD_*` calls in routes/actions
- Multi-CMS `dataAdapter.ts` — replaced by a thin `tourService.ts`
- Blog — `blogActions.ts`, `AIBlogAssistant.tsx`, `getPosts`/`getPost`
- Multi-language — `translations.ts` (English only)
- Legacy JSON tour tooling — `jsonTours.ts`, `mockData.ts`, `pexels.ts`, `r2images.ts` (verify usage), `tour-data-*.json`, image-link scripts
- Sanity-only scripts — `src/scripts/**` that touch Sanity

## Target architecture

```
UI (React server components)
  └─ lib/tourService.ts  ──  reads tours
        ├─ Supabase `tours` table (editable)  ── fallback to hardcoded toursData.ts
  └─ availability ── Supabase `inventory` (inventoryService.ts)
  └─ bookings     ── Supabase `bookings` (existing)
  └─ payments     ── Stripe (existing stripe.ts)
  └─ emails       ── Resend (existing)
```

Single source of truth for content = **Supabase**. Hardcoded `toursData.ts` is the
seed + offline fallback. No Sanity, no Payload.

## Data model (Supabase)

New `tours` table (migrate once, seed with the 2 tours):

```sql
create table tours (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  tour_type text,
  price integer not null default 0,      -- EUR
  duration text,
  description text,
  highlights jsonb default '[]',
  includes jsonb default '[]',
  excludes jsonb default '[]',
  meeting_point text,
  important_info jsonb default '[]',
  image_url text,
  badge text,
  rating numeric,
  reviews integer default 0,
  group_size text,
  category text default 'vatican',
  sort_order integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

- Enable RLS: public select; authenticated (service role) insert/update/delete.
- Seed rows = the 2 tours from `toursData.ts`.

Existing tables unchanged: `inventory` (availability), `bookings` (client info).

## File-level plan

### Delete (whole files / dirs)
- `src/sanity/` (all)
- `sanity.config.ts`
- `src/app/studio/` (route)
- `src/lib/sanityService.ts`, `src/lib/payloadClient.ts`, `src/lib/payloadService.ts`
- `src/app/actions/sanityActions.ts`, `src/app/actions/blogActions.ts`
- `src/components/admin/AIBlogAssistant.tsx`
- `src/lib/translations.ts`, `src/lib/jsonTours.ts`, `src/lib/mockData.ts`
- `src/lib/pexels.ts`, `src/lib/r2images.ts` (after confirming no remaining import)
- `tour-data-tour1.json`, `tour-data-tour2.json` (root)
- `src/scripts/` Sanity-touching scripts (audit, check*, importJson, linkImages, matchImages, reportMissingImages, deduplicateProducts, deleteOrphans, cleanupDuplicates, seedProducts, seedSettings, syncTours, updateProducts, checkState)

### Replace
- `src/lib/dataAdapter.ts` → delete; new `src/lib/tourService.ts`:
  - `getTours()` → Supabase `tours` (active, order by sort_order) → fallback `toursData.ts`
  - `getTour(slug)` → Supabase by slug → fallback hardcoded
  - Return the same `Tour` shape the UI already consumes (no UI churn)
  - `urlFor()` helper (direct URL passthrough)

### Rewrite (remove Payload / Sanity)
- `src/app/api/availability/route.ts` → read Supabase `inventory` via `inventoryService`
- `src/app/api/create-payment-intent/route.ts` → price from `tourService` / hardcoded (drop Payload fetch)
- `src/app/actions/tourActions.ts` → `updateTour` writes Supabase `tours` (drop Payload)
- `src/app/api/webhooks/stripe/route.ts` → remove `writeToPayload` (Supabase already primary)
- `src/app/sitemap.ts` → emit only the 2 tour slugs (drop blog)
- `src/app/admin/AdminLayoutClient.tsx` → remove `/studio` link; add Tours + Bookings nav

### Add
- `src/app/admin/tours/page.tsx` — edit the 2 tours (title, price, duration, description, highlights, includes, image_url)
- `src/app/admin/bookings/page.tsx` — list bookings + client info (name, email, phone, guests, date/time, status, price)
- `src/db/migration_tours.sql` — tours table + seed
- `src/lib/tourService.ts` (above)
- `src/app/api/admin/tours/route.ts` — GET/PUT tours (service-role)

### Site settings
- Branding/contact/SEO currently from Sanity `siteType.ts`. Move to `src/lib/siteConfig.ts`
  + env vars: name, url, contact email/phone, address, WhatsApp. Update `layout.tsx`,
  `Header`, `Footer`, `contact/page.tsx`, legal pages to read `siteConfig`.

### Hardening
- Only the 2 slugs resolve in `/tour/[slug]`; unknown slug → 404 (`not-found`).
- Header/Footer/sitemap derive links from the 2-tour list (no hardcoded extra links).

## Env vars

Drop: `PAYLOAD_API_URL`, `PAYLOAD_TENANT`, `PAYLOAD_API_KEY`, `NEXT_PUBLIC_PAYLOAD_URL`,
`SANITY_API_TOKEN`, `NEXT_PUBLIC_SANITY_*` (optional: keep SANITY out entirely).
Keep: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_SITE_ID`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_URL`,
`ADMIN_PASSWORD`, `STRIPE_*` (site-scoped), `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`,
`NEXT_PUBLIC_R2_PUBLIC_URL` (if images kept on R2).

## Deploy

After code change, apply SQL migration to the Supabase project linked in env, then
redeploy `glodentour` on Vercel (org `orangeflowai`). Verify live at
`www.goldenrometours.com` shows exactly 2 tours.

## Out of scope

- Restoring any other tour, CMS, or language.
- Changing Stripe pricing model or adding new payment methods.
- Redesign / visual changes beyond removing now-dead sections.
