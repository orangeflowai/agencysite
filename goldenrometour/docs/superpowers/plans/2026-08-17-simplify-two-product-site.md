# Simplify goldenrometour to a 2-product site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce goldenrometour to exactly two Vatican tours, English-only, with Stripe checkout, Supabase-backed content/availability/bookings, and a minimal admin.

**Architecture:** Supabase becomes the single source of truth. A thin `tourService.ts` reads the new `tours` table (fallback to hardcoded `toursData.ts`). Stripe stays for checkout; availability stays on the `inventory` table; bookings stay on the `bookings` table. Sanity, Payload, multi-CMS adapter, blog, and multi-language are deleted.

**Tech Stack:** Next.js 16 (App Router), React, Supabase (`@supabase/supabase-js`, service-role admin), Stripe (`stripe`, `@stripe/react-stripe-js`), Resend, Tailwind.

**Spec:** `docs/superpowers/specs/2026-08-17-simplify-two-product-site.md`

## Global Constraints

- All paths below are relative to `goldenrometour/` (the app root), NOT the monorepo root `/home/abiilesh/travelwebsite`.
- Exactly two tours, exact titles:
  - `Vatican Museums & Sistine Chapel Skip-the-Line Tour` — slug `vatican-museums-sistine-chapel-skip-the-line` — €45
  - `Vatican Museums & Sistine Chapel Guided Tour` — slug `vatican-museums-and-sistine-chapel-guided-tour` — €65
- No other tour may appear in `getTours()` output, sitemap, header, footer, or admin.
- English only. No `translations.ts` usage remains.
- Server data reads use `supabaseAdmin` (service role), matching existing `inventoryService.ts`.
- The `Tour` shape consumed by UI (`_id`, `title`, `slug.current`, `mainImage.asset.url`, `price`, `duration`, `description`, `category`, `highlights`, `includes`, `excludes`, `importantInfo`, `meetingPoint`, `badge`, `rating`, `reviewCount`, `groupSize`, `guestTypes`) must not change, so components stay untouched.
- Verification = `npm run build` (must exit 0) + `npm run lint`. No unit-test harness exists; do not add one.

---

### Task 1: Tours table SQL migration + seed

**Files:**
- Create: `src/db/migration_tours.sql`

**Interfaces:**
- Produces: Supabase table `tours` with columns `id, slug, title, tour_type, price, duration, description, highlights (jsonb), includes (jsonb), excludes (jsonb), meeting_point, important_info (jsonb), image_url, badge, rating, reviews, group_size, category, sort_order, active, created_at, updated_at`.

- [ ] **Step 1: Write the migration file**

```sql
-- goldenrometour: editable tours table (2 products)
create table if not exists tours (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  tour_type text,
  price integer not null default 0,
  duration text,
  description text,
  highlights jsonb not null default '[]',
  includes jsonb not null default '[]',
  excludes jsonb not null default '[]',
  meeting_point text,
  important_info jsonb not null default '[]',
  image_url text,
  badge text,
  rating numeric,
  reviews integer not null default 0,
  group_size text,
  category text not null default 'vatican',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tours enable row level security;
create policy "public read tours" on tours for select using (true);

insert into tours (slug, title, tour_type, price, duration, description, highlights, includes, excludes, meeting_point, important_info, image_url, badge, rating, reviews, group_size, category, sort_order) values
(
  'vatican-museums-sistine-chapel-skip-the-line',
  'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
  'Skip-the-Line',
  45,
  'Flexible',
  'Bypass the crowds and maximize your time inside one of the world''s most incredible art collections. This fast-track entry ticket lets you skip the notorious Vatican queues, giving you the freedom to explore at your own pace.',
  '["Fast-Track Access — priority entry into Vatican Museums and Sistine Chapel","Independent Exploration — explore at your own pace","Michelangelo''s Masterpieces — stand beneath the Sistine Chapel frescoes","Self-Guided Map — navigate with a complimentary Vatican map"]',
  '["Priority Skip-the-Line Entry Ticket","Instant mobile voucher delivery","Detailed map of the Vatican Museums","All reservation and service fees"]',
  '["Hotel pick-up and drop-off","Gratuities","Food and beverages"]',
  'Via Germanico, 40, 00192 Roma, RM, Italy',
  '["Availability: Monday – Saturday (closed Sundays)","Duration: Flexible — spend as long as you like","Security screening is mandatory at the Vatican","Dress code: shoulders and knees must be covered","Photography prohibited inside the Sistine Chapel"]',
  'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Popular',
  4.7,
  1850,
  'Self-Guided',
  'vatican',
  1
),
(
  'vatican-museums-and-sistine-chapel-guided-tour',
  'Vatican Museums & Sistine Chapel Guided Tour',
  'Guided Tour',
  65,
  '3 Hours',
  'Bring history to life with an expert guide on this comprehensive tour of the Vatican Museums and Sistine Chapel. Bypass the crowds with exclusive skip-the-line access and explore the world''s largest collection of Renaissance masterpieces.',
  '["Exclusive Skip-the-Line Entry — save hours of waiting","Expert Storytelling — history, secrets, and context from a professional guide","Michelangelo, Raphael, and Bernini up close","Comprehensive route: Raphael''s Rooms, Gallery of Maps, Pinecone Courtyard","Small group — capped for a personal experience"]',
  '["Guided tour of Vatican Museums","Guided tour of the Sistine Chapel","Fast-track skip-the-line entry","Professional expert tour guide"]',
  '["Guided tour inside St. Peter''s Basilica","Hotel pick-up and drop-off","Gratuities","Food and beverages"]',
  'Via Germanico, 40, 00192 Roma, RM, Italy',
  '["Availability: Monday – Saturday (closed Sundays)","Arrive 25 minutes before your scheduled start time","Security screening is mandatory at the Vatican","Dress code: shoulders and knees must be covered","Large bags and sharp objects are not allowed","Photography prohibited inside the Sistine Chapel"]',
  'https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Best Seller',
  4.8,
  2850,
  'Up to 24 participants',
  'vatican',
  2
)
on conflict (slug) do nothing;
```

- [ ] **Step 2: Apply to Supabase** — run this SQL in the Supabase SQL editor for the project referenced by `NEXT_PUBLIC_SUPABASE_URL` in `goldenrometour/.env`. (If the executor has a DB connection string, use `psql`; otherwise hand this file to the user.)

- [ ] **Step 3: Verify** — after applying, the `tours` table has exactly 2 rows. No automated check; confirm via Supabase Table Editor or a quick query.

- [ ] **Step 4: Commit**

```bash
git add goldenrometour/src/db/migration_tours.sql
git commit -m "feat: add tours table migration with 2 seeded Vatican tours"
```

---

### Task 2: Create `tourService.ts` (replaces dataAdapter)

**Files:**
- Create: `src/lib/tourService.ts`

**Interfaces:**
- Produces: `export interface Tour`, `export async function getTours(): Promise<Tour[]>`, `export async function getTour(slug: string): Promise<Tour | null>`, `export function urlFor(source: any): any`.
- Consumes: `supabaseAdmin` from `@/lib/supabaseAdmin`; `tours`, `TourProduct` from `@/lib/toursData` (types unchanged).

- [ ] **Step 1: Write the file**

```ts
import { supabaseAdmin } from './supabaseAdmin'
import { tours as staticTours, TourProduct } from './toursData'

export interface Tour {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: any
  price: number
  duration: string
  description: any
  category: string
  features: string[]
  highlights?: string[]
  badge?: string
  rating?: number
  reviewCount?: number
  groupSize?: string
  location?: string
  tags?: string[]
  includes?: string[]
  excludes?: string[]
  importantInfo?: string[]
  itinerary?: Array<{ title: string; duration: string; description: string }>
  meetingPoint?: string
  guestTypes?: Array<{ name: string; price: number; description: string }>
}

function guestTypesFor(price: number): Array<{ name: string; price: number; description: string }> {
  return [
    { name: 'Adult', price, description: 'Age 18+' },
    { name: 'Student', price: Math.round(price * 0.85), description: 'Valid ID required' },
    { name: 'Youth', price: Math.round(price * 0.70), description: 'Age 12–17' },
    { name: 'Child', price: Math.round(price * 0.50), description: 'Under 12' },
  ]
}

function staticTourToTour(t: TourProduct): Tour {
  return {
    _id: t.id,
    title: t.title,
    slug: { current: t.slug },
    mainImage: t.imageUrl ? { asset: { url: t.imageUrl } } : undefined,
    price: t.price,
    duration: t.duration,
    description: t.description,
    category: t.category,
    features: t.highlights || [],
    highlights: t.highlights || [],
    badge: t.badge,
    rating: t.rating,
    reviewCount: t.reviews,
    groupSize: t.groupSize,
    location: t.meetingPoint,
    includes: t.includes || [],
    excludes: t.excludes || [],
    importantInfo: t.importantInfo || [],
    meetingPoint: t.meetingPoint || '',
    guestTypes: guestTypesFor(t.price),
  }
}

function rowToTour(row: any): Tour {
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    mainImage: row.image_url ? { asset: { url: row.image_url } } : undefined,
    price: row.price,
    duration: row.duration || '',
    description: row.description || '',
    category: row.category || 'vatican',
    features: row.highlights || [],
    highlights: row.highlights || [],
    badge: row.badge || undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: row.reviews || 0,
    groupSize: row.group_size || undefined,
    location: row.meeting_point || '',
    includes: row.includes || [],
    excludes: row.excludes || [],
    importantInfo: row.important_info || [],
    meetingPoint: row.meeting_point || '',
    guestTypes: guestTypesFor(row.price),
  }
}

export async function getTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('active', true)
      .order('sort_order')
    if (!error && data && data.length > 0) return data.map(rowToTour)
  } catch (e) {
    console.error('[tourService] tours read failed, using static fallback', e)
  }
  return staticTours.map(staticTourToTour)
}

export async function getTour(slug: string): Promise<Tour | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (!error && data) return rowToTour(data)
  } catch (e) {
    console.error('[tourService] tour read failed, using static fallback', e)
  }
  const s = staticTours.find((t) => t.slug === slug)
  return s ? staticTourToTour(s) : null
}

export function urlFor(source: any) {
  const url = typeof source === 'string'
    ? source
    : source?.asset?.url || source?.url || ''
  const builder: any = {
    url: () => url,
    width: (_w: number) => builder,
    height: (_h: number) => builder,
    fit: (_f: string) => builder,
    auto: (_a: string) => builder,
  }
  return builder
}
```

- [ ] **Step 2: Verify build compiles the new module**

Run: `npm run build` (from `goldenrometour/`)
Expected: PASS. `tourService.ts` has no consumers yet, so no behavior change.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/lib/tourService.ts
git commit -m "feat: add tourService reading Supabase tours with static fallback"
```

---

### Task 3: Rename the two tours in `toursData.ts`

**Files:**
- Modify: `src/lib/toursData.ts` (two `title` fields only)

**Interfaces:**
- Consumes/Produces: `TourProduct` type unchanged; titles change to the exact spec strings.

- [ ] **Step 1: Edit titles**

Replace `title: 'Complete Guided Tour: Vatican Museums & Sistine Chapel',` with `title: 'Vatican Museums & Sistine Chapel Guided Tour',`.

Replace `title: 'Skip-the-Line: Vatican Museums & Sistine Chapel Ticket',` with `title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',`.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/lib/toursData.ts
git commit -m "feat: rename the two tours to final titles"
```

---

### Task 4: Rewrite `/api/availability` to read Supabase

**Files:**
- Modify: `src/app/api/availability/route.ts` (replace whole file)

**Interfaces:**
- Produces: GET `?slug=&date=&mode=day|month`. Day → `{ slots: [{ time, available, available_slots, total_slots, price }] }`. Month → `{ 'YYYY-MM-DD': { spots, price } }`.
- Consumes: `getTour` from `@/lib/tourService`, `supabaseAdmin` from `@/lib/supabaseAdmin`.
- Note: `BookingPanel.tsx` reads `slot.available` and `slot.time` — the `available` field is required.

- [ ] **Step 1: Replace the file**

```ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getTour } from '@/lib/tourService'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || ''
  const date = searchParams.get('date') || ''
  const mode = searchParams.get('mode') || 'day'

  if (!slug) return NextResponse.json(mode === 'month' ? {} : { slots: [] })

  try {
    const tour = await getTour(slug)
    const basePrice = tour?.price || 0
    if (mode === 'month') return NextResponse.json(await getMonthAvailability(slug, basePrice, date))
    return NextResponse.json(await getDayAvailability(slug, basePrice, date))
  } catch (err) {
    console.error('[availability] Error:', err)
    return NextResponse.json(mode === 'month' ? {} : { slots: [] })
  }
}

async function getDayAvailability(slug: string, basePrice: number, date: string) {
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .eq('tour_slug', slug)
    .eq('date', date)
    .order('time')

  if (error) return { slots: [] }

  const slots = (data || [])
    .filter((s: any) => (s.available_slots ?? 0) > 0)
    .map((s: any) => ({
      time: s.time,
      available: s.available_slots,
      available_slots: s.available_slots,
      total_slots: s.total_slots,
      price: s.price_override || basePrice,
    }))

  return { slots }
}

async function getMonthAvailability(slug: string, basePrice: number, monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  const monthStart = `${monthStr}-01`
  const monthEnd = `${monthStr}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .eq('tour_slug', slug)
    .gte('date', monthStart)
    .lte('date', monthEnd)

  if (error) return {}

  const byDate: Record<string, { spots: number; price: number }> = {}
  for (const slot of data || []) {
    const dateKey = String(slot.date).slice(0, 10)
    if (!dateKey) continue
    if (!byDate[dateKey]) byDate[dateKey] = { spots: 0, price: slot.price_override || basePrice }
    byDate[dateKey].spots += slot.available_slots || 0
    if (slot.price_override && slot.price_override < byDate[dateKey].price) {
      byDate[dateKey].price = slot.price_override
    }
  }
  return byDate
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS. No `PAYLOAD_URL` reference remains in this file (`grep -c PAYLOAD src/app/api/availability/route.ts` → 0).

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/app/api/availability/route.ts
git commit -m "feat: read availability from Supabase inventory"
```

---

### Task 5: Rewrite `/api/create-payment-intent` to direct Stripe only

**Files:**
- Modify: `src/app/api/create-payment-intent/route.ts` (replace whole file)

**Interfaces:**
- Produces: POST `{ amount, tourTitle, tourSlug, date, time, guests, guestCounts, bookingDetails?, addOns? }` → `{ clientSecret, paymentIntentId }`.
- Consumes: `getStripe` from `@/lib/stripe`.

- [ ] **Step 1: Replace the file**

```ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json()
  const siteId = (await headers()).get('x-site-id')
    || process.env.NEXT_PUBLIC_SITE_ID
    || 'goldenrometour'

  try {
    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe(siteId)
    const { amount, tourTitle, tourSlug, date, time, guests, guestCounts = {}, bookingDetails, addOns = [] } = body

    const adults = guestCounts.Adult ?? guestCounts.Adults ?? body.adults ?? 0
    const students = guestCounts.Student ?? guestCounts.Students ?? body.students ?? 0
    const youths = guestCounts.Youth ?? guestCounts.Youths ?? body.youths ?? 0
    const addOnsTotal = (addOns as any[]).reduce((s, a) => s + a.price * a.quantity, 0)
    const safeJson = (v: any, max = 490) => { const s = JSON.stringify(v); return s.length > max ? s.slice(0, max) : s }
    const lead = bookingDetails?.leadTraveler || {}

    const pi = await stripe.paymentIntents.create({
      amount: Math.round((Number(amount) + addOnsTotal) * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        tourSlug: (tourSlug || '').slice(0, 490),
        tourTitle: (tourTitle || '').slice(0, 490),
        date: (date || '').slice(0, 100),
        time: (time || '').slice(0, 100),
        guests: String(guests),
        adults: String(adults),
        students: String(students),
        youths: String(youths),
        guestCounts: safeJson(guestCounts),
        siteId,
        leadEmail: (lead.email || '').slice(0, 490),
        leadName: (`${lead.firstName || ''} ${lead.lastName || ''}`.trim()).slice(0, 490),
        leadPhone: (lead.phone || '').slice(0, 100),
        addOns: safeJson((addOns as any[]).map((a) => ({ name: a.name, price: a.price, quantity: a.quantity }))),
      },
      description: `${tourTitle} - ${date} at ${time} (${guests} guests)`,
      receipt_email: lead.email || undefined,
    })

    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id })
  } catch (err) {
    console.error('[create-payment-intent] Error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Payment processing failed. Please try again.' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS. `grep -c PAYLOAD src/app/api/create-payment-intent/route.ts` → 0.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/app/api/create-payment-intent/route.ts
git commit -m "feat: create payment intent directly via Stripe"
```

---

### Task 6: Rewrite `tourActions.updateTour` to write Supabase

**Files:**
- Modify: `src/app/actions/tourActions.ts` (replace whole file)

**Interfaces:**
- Produces: `export async function updateTour(formData: FormData): Promise<{ success: boolean; error?: string }>`. Reads form fields: `slug, title, price, duration, description, badge, image_url, meeting_point, highlights, includes, excludes, important_info`.
- Consumes: `supabaseAdmin` from `@/lib/supabaseAdmin`.

- [ ] **Step 1: Replace the file**

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function updateTour(formData: FormData) {
  const slug = formData.get('slug') as string
  if (!slug) return { success: false, error: 'Missing tour slug' }

  const lines = (v: unknown) => (typeof v === 'string' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [])

  const updates: Record<string, any> = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    duration: formData.get('duration') || undefined,
    description: formData.get('description') || undefined,
    badge: formData.get('badge') || undefined,
    image_url: formData.get('image_url') || undefined,
    meeting_point: formData.get('meeting_point') || undefined,
    highlights: lines(formData.get('highlights')),
    includes: lines(formData.get('includes')),
    excludes: lines(formData.get('excludes')),
    important_info: lines(formData.get('important_info')),
    updated_at: new Date().toISOString(),
  }
  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k])

  const { error } = await supabaseAdmin.from('tours').update(updates).eq('slug', slug)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/tours')
  revalidatePath(`/tour/${slug}`)
  revalidatePath('/')
  return { success: true }
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS. `grep -c PAYLOAD src/app/actions/tourActions.ts` → 0.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/app/actions/tourActions.ts
git commit -m "feat: edit tours via Supabase tours table"
```

---

### Task 7: Remove Payload dual-write from Stripe webhook

**Files:**
- Modify: `src/app/api/webhooks/stripe/route.ts`

**Interfaces:**
- Consumes: existing `supabaseAdmin`, `reserveInventory`, `releaseInventory`, `sendEmails`. Removes `writeToPayload`.

- [ ] **Step 1: Delete the `writeToPayload` function** (the whole `async function writeToPayload(...)` block).

- [ ] **Step 2: Delete its two call sites**

Remove the line `await writeToPayload(siteId, { ... });` inside BOTH the `payment_intent.succeeded` handler and the `checkout.session.completed` handler (leaving the surrounding `logAuditAction` and `sendEmails` calls intact).

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: PASS. `grep -c writeToPayload src/app/api/webhooks/stripe/route.ts` → 0.

- [ ] **Step 4: Commit**

```bash
git add goldenrometour/src/app/api/webhooks/stripe/route.ts
git commit -m "refactor: drop Payload dual-write from stripe webhook"
```

---

### Task 8: Rewrite sitemap to the 2 tours + real pages only

**Files:**
- Modify: `src/app/sitemap.ts` (replace whole file)

**Interfaces:**
- Consumes: `getTours` from `@/lib/tourService`.

- [ ] **Step 1: Replace the file**

```ts
import { MetadataRoute } from 'next'
import { getTours } from '@/lib/tourService'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cancellation-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const tours = await getTours()
  const tourPages: MetadataRoute.Sitemap = tours.map((t) => ({
    url: `${baseUrl}/tour/${t.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...tourPages]
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS. No `/blog`, `/about`, `/search`, or `/category/*` URLs remain.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/app/sitemap.ts
git commit -m "refactor: sitemap lists only the 2 tours and real pages"
```

---

### Task 9: Point consumers at `tourService`

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/tour/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getTours`, `getTour` from `@/lib/tourService` (same signatures as before).

- [ ] **Step 1: Update `page.tsx` import**

Replace `import { getTours } from '@/lib/dataAdapter';` with `import { getTours } from '@/lib/tourService';`.

- [ ] **Step 2: Update `tour/[slug]/page.tsx` import**

Replace `import { getTour, getTours } from '@/lib/dataAdapter';` with `import { getTour, getTours } from '@/lib/tourService';`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: PASS. `grep -rl "dataAdapter" src/app src/components` → only files being deleted later (none left in `page.tsx` / `tour/[slug]/page.tsx`).

- [ ] **Step 4: Commit**

```bash
git add goldenrometour/src/app/page.tsx goldenrometour/src/app/tour/[slug]/page.tsx
git commit -m "refactor: read tours via tourService"
```

---

### Task 10: Admin Tours editor (page + API)

**Files:**
- Create: `src/app/api/admin/tours/route.ts`
- Create: `src/app/admin/tours/page.tsx`

**Interfaces:**
- Produces: API GET `/api/admin/tours` → `{ tours: Row[] }` (all tours incl. inactive); PUT `/api/admin/tours` `{ slug, ...fields }` → `{ success }`.
- Consumes: `supabaseAdmin`; the admin page posts FormData via `updateTour` server action (Task 6).

- [ ] **Step 1: Write the API route**

```ts
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('tours')
    .select('*')
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tours: data || [] })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, slug, ...fields } = body
  if (!id && !slug) return NextResponse.json({ error: 'Missing id or slug' }, { status: 400 })

  const allowed = ['title', 'price', 'duration', 'description', 'badge', 'image_url', 'meeting_point', 'tour_type', 'group_size', 'category', 'sort_order', 'active']
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  for (const k of allowed) if (k in fields) updates[k] = fields[k]
  if (Array.isArray(fields.highlights)) updates.highlights = fields.highlights
  if (Array.isArray(fields.includes)) updates.includes = fields.includes
  if (Array.isArray(fields.excludes)) updates.excludes = fields.excludes
  if (Array.isArray(fields.important_info)) updates.important_info = fields.important_info

  const q = supabaseAdmin.from('tours').update(updates)
  if (id) q.eq('id', id)
  else q.eq('slug', slug)

  const { error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Write the admin page**

A client component that fetches `/api/admin/tours` on mount and renders one editable form per tour. Use `updateTour` (server action) on submit. Fields: title, price, duration, badge, image_url, description (textarea), highlights/includes/excludes/important_info (one item per line, textareas).

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTour } from '@/app/actions/tourActions'
import Button from '@/components/ui/Button'

type Row = { id: string; slug: string; title: string; price: number; duration: string; badge: string; image_url: string; description: string; highlights: string[]; includes: string[]; excludes: string[]; important_info: string[] }

function Editable({ value, label, multiline }: { value: string; label: string; multiline?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {multiline
        ? <textarea name={label.toLowerCase().replace(/[^a-z]/g, '_')} defaultValue={value} rows={6} className="w-full bg-background border border-border rounded-lg p-2 text-sm" />
        : <input name={label.toLowerCase().replace(/[^a-z]/g, '_')} defaultValue={value} className="w-full bg-background border border-border rounded-lg p-2 text-sm" />}
    </div>
  )
}

export default function AdminToursPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/tours')
      .then((r) => r.json())
      .then((d) => setRows(d.tours || []))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, slug: string) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('slug', slug)
    const res = await updateTour(fd)
    setMsg(res.success ? 'Saved' : res.error || 'Error')
    router.refresh()
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading tours…</div>

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Tours</h1>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      {rows.map((t) => (
        <form key={t.id} onSubmit={(e) => onSubmit(e, t.slug)} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">{t.title}</h2>
          <Editable value={t.title} label="title" />
          <div className="grid grid-cols-2 gap-4">
            <Editable value={String(t.price)} label="price" />
            <Editable value={t.duration} label="duration" />
          </div>
          <Editable value={t.badge || ''} label="badge" />
          <Editable value={t.image_url || ''} label="image_url" />
          <Editable value={t.description || ''} label="description" multiline />
          <Editable value={(t.highlights || []).join('\n')} label="highlights" multiline />
          <Editable value={(t.includes || []).join('\n')} label="includes" multiline />
          <Editable value={(t.excludes || []).join('\n')} label="excludes" multiline />
          <Editable value={(t.important_info || []).join('\n')} label="important_info" multiline />
          <Button type="submit" variant="primary">Save</Button>
        </form>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add goldenrometour/src/app/api/admin/tours/route.ts goldenrometour/src/app/admin/tours/page.tsx
git commit -m "feat: admin tours editor backed by Supabase"
```

---

### Task 11: Admin Bookings page (client info + cancel/refund)

**Files:**
- Create: `src/app/api/admin/bookings/route.ts` — copy from `../romanvaticantour/src/app/api/admin/bookings/route.ts`
- Create: `src/app/admin/bookings/page.tsx` — copy from `../romanvaticantour/src/app/admin/bookings/page.tsx`

**Interfaces:**
- Produces: GET `/api/admin/bookings` → `{ bookings: Row[] }` (join-style: tour_title, customer_name, customer_email, customer_phone, guests, date, time, status, total_price, stripe_*). PATCH `/api/admin/bookings` `{ id, action: 'cancel' }` → issues Stripe refund + releases inventory + sets status `cancelled`.
- Consumes: `supabaseAdmin`, `stripe` (via `getStripe`), `releaseInventory`, `logAuditAction`.

- [ ] **Step 1: Copy the API route**

```bash
cp ../romanvaticantour/src/app/api/admin/bookings/route.ts src/app/api/admin/bookings/route.ts
```

- [ ] **Step 2: Copy the admin page**

```bash
cp ../romanvaticantour/src/app/admin/bookings/page.tsx src/app/admin/bookings/page.tsx
```

- [ ] **Step 3: Verify the copies build**

Run: `npm run build`
Expected: PASS. If the copied files import a shared admin component not present in goldenrometour (e.g. `@/components/admin/BookingTable`), copy that too from `../romanvaticantour/src/components/admin/`.

- [ ] **Step 4: Commit**

```bash
git add goldenrometour/src/app/api/admin/bookings/route.ts goldenrometour/src/app/admin/bookings/page.tsx
git commit -m "feat: admin bookings view with cancel + refund"
```

---

### Task 12: Update admin nav (add Tours + Bookings, drop Sanity studio)

**Files:**
- Modify: `src/app/admin/AdminLayoutClient.tsx`

**Interfaces:**
- Consumes: existing `NavLink` component. Removes the `/studio` (Sanity) link; adds `/admin/tours` and `/admin/bookings`.

- [ ] **Step 1: Edit nav links**

Replace the nav block (around line 95-96):

```tsx
<NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Inventory Control</NavLink>
<NavLink href="/studio" icon={ExternalLink} external onClick={onClose}>Content Studio (Sanity)</NavLink>
```

with:

```tsx
<NavLink href="/admin/tours" icon={LayoutDashboard} onClick={onClose}>Tours</NavLink>
<NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Availability</NavLink>
<NavLink href="/admin/bookings" icon={LayoutDashboard} onClick={onClose}>Bookings</NavLink>
```

(Ensure the icons `LayoutDashboard` and `Calendar` are already imported; if `ExternalLink` becomes unused, remove it from the import.)

- [ ] **Step 2: Verify**

Run: `npm run build` then `npm run lint`
Expected: PASS. No unused-import lint error.

- [ ] **Step 3: Commit**

```bash
git add goldenrometour/src/app/admin/AdminLayoutClient.tsx
git commit -m "feat: admin nav points to Tours/Availability/Bookings"
```

---

### Task 13: Delete dead code (Sanity, Payload, blog, i18n, legacy tooling)

**Files (delete):**
- `src/sanity/` (entire directory)
- `sanity.config.ts`
- `src/app/studio/` (entire directory)
- `src/app/actions/sanityActions.ts`
- `src/app/actions/blogActions.ts`
- `src/components/admin/AIBlogAssistant.tsx`
- `src/lib/sanityService.ts`
- `src/lib/payloadClient.ts`
- `src/lib/payloadService.ts`
- `src/lib/dataAdapter.ts`
- `src/lib/translations.ts`
- `src/lib/jsonTours.ts`
- `src/lib/mockData.ts`
- `src/lib/pexels.ts`
- `src/lib/r2images.ts`
- `tour-data-tour1.json`, `tour-data-tour2.json` (app root)
- `src/scripts/` (entire directory — all Sanity/Payload tooling)

**Interfaces:** none (removal only). Before deleting each file, confirm no remaining import references it.

- [ ] **Step 1: Confirm no remaining imports**

Run: `grep -rn "sanityService\|payloadService\|payloadClient\|dataAdapter\|translations\|jsonTours\|mockData\|pexels\|r2images\|blogActions\|sanityActions\|@/sanity\|AIBlogAssistant" src/`

Expected: no output (or only self-references within files being deleted).

- [ ] **Step 2: Delete the files**

```bash
rm -rf src/sanity src/app/studio src/scripts
rm -f sanity.config.ts
rm -f src/app/actions/sanityActions.ts src/app/actions/blogActions.ts
rm -f src/components/admin/AIBlogAssistant.tsx
rm -f src/lib/sanityService.ts src/lib/payloadClient.ts src/lib/payloadService.ts
rm -f src/lib/dataAdapter.ts src/lib/translations.ts src/lib/jsonTours.ts
rm -f src/lib/mockData.ts src/lib/pexels.ts src/lib/r2images.ts
rm -f tour-data-tour1.json tour-data-tour2.json
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. If any file was still imported, the build lists it — restore/rewrite that reference before proceeding.

- [ ] **Step 4: Remove Sanity/Payload deps (optional, keep if build is green)**

Do NOT touch `package.json` unless `npm run build` complains. Unused packages are harmless and removing them risks breaking transitive imports. Leave `sanity`, `next-sanity`, `@sanity/*`, `@portabletext/react` installed for now.

- [ ] **Step 5: Commit**

```bash
git add -A goldenrometour
git commit -m "refactor: remove Sanity, Payload, blog, i18n, and legacy tooling"
```

---

### Task 14: Final verification + live check

**Files:** none (verification only).

- [ ] **Step 1: Clean build**

Run: `cd goldenrometour && npm run build`
Expected: exit 0.

- [ ] **Step 2: Lint**

Run: `cd goldenrometour && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke checks (dev server)**

Run: `cd goldenrometour && npm run dev`, then verify:
- `GET /` renders exactly 2 tour cards with the 2 exact titles.
- `GET /tour/vatican-museums-and-sistine-chapel-guided-tour` → 200.
- `GET /tour/vatican-museums-sistine-chapel-skip-the-line` → 200.
- `GET /tour/any-other-slug` → 404.
- `GET /sitemap.xml` lists only the 2 tour URLs + kept static pages.
- `GET /admin` redirects to `/admin/login` (cookie auth still works).
- `/admin/tours`, `/admin/bookings`, `/admin/inventory` render.

- [ ] **Step 4: Commit any fixes**

Commit if smoke checks surfaced issues.

---

## Deployment notes (not automated)

After all tasks pass:
1. Apply `src/db/migration_tours.sql` to the Supabase project (run in SQL editor).
2. Set `DATA_SOURCE` not needed — `tourService.ts` ignores it. Remove `PAYLOAD_*` and `SANITY_*` from Vercel env (glodentour) to avoid confusion.
3. Deploy `glodentour` on Vercel (`vercel --prod`, org `orangeflowai`).
4. Verify `https://www.goldenrometours.com` shows exactly 2 tours and booking works.
