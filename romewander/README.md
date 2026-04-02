# Agency Tour Website Template

A production-ready tour booking website for travel agencies. Drop in your `.env.local` and it works.

## What's included

- Full Next.js 16 website with tour listings, booking flow, checkout (Stripe)
- Sanity CMS for tours, blog, site settings, and branding
- Supabase for bookings, inventory, and customer data
- Multi-language support (EN, IT, ES, FR, DE, PT, RU)
- Confirmation emails via Resend with meeting point maps
- Apple Pay, Google Pay, PayPal, Revolut Pay via Stripe
- Admin panel at `/admin`
- Sanity Studio at `/studio`
- Mobile app companion (see `../wondersofrome_app`)

## Setup in 5 steps

### 1. Copy env file
```bash
cp .env.example .env.local
```
Fill in every value in `.env.local`.

### 2. Create a Sanity project
- Go to [sanity.io/manage](https://sanity.io/manage) → New Project
- Copy the **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Run `npx sanity deploy` to deploy the studio schema

### 3. Create a Supabase project
- Go to [supabase.com](https://supabase.com) → New Project
- Copy **URL** and **anon key** → `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service role key** → `SUPABASE_SERVICE_ROLE_KEY`
- Run the schema: Supabase Dashboard → SQL Editor → paste `src/db/schema.sql`

### 4. Create a Stripe account
- Go to [dashboard.stripe.com](https://dashboard.stripe.com)
- Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy **Secret key** → `STRIPE_SECRET_KEY`
- Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. Install and run
```bash
npm install
npm run dev
```

## Branding

All branding is controlled from Sanity. Create a `site` document with your agency slug matching `NEXT_PUBLIC_SITE_ID`:

- **Logo** — upload in Sanity → Site → Logo
- **Colors** — set primary/accent hex values in Sanity → Site → Brand Colors
- **Contact info** — phone, email, address, WhatsApp number
- **Social links** — Facebook, Instagram, Twitter, TripAdvisor
- **Map link** — Google Maps URL for your office (shown in footer and emails)
- **Hero image/title** — set in Sanity → Settings

## Multiple agencies from one codebase

Each agency needs its own `NEXT_PUBLIC_SITE_ID` and optionally its own Stripe account:

```env
# Agency 1
NEXT_PUBLIC_SITE_ID=rome-agency
STRIPE_SECRET_KEY_ROME_AGENCY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME_AGENCY=pk_live_...

# Agency 2 (shares same Supabase/Sanity, different Stripe)
NEXT_PUBLIC_SITE_ID=florence-agency
STRIPE_SECRET_KEY_FLORENCE_AGENCY=sk_live_...
```

The site ID suffix is uppercased with hyphens replaced by underscores.

## Apple Pay setup

After deploying to your domain:
1. The `/.well-known/apple-developer-merchantid-domain-association` file is already in `public/.well-known/`
2. Register your domain in Stripe: Dashboard → Settings → Payment Methods → Apple Pay → Add domain
3. Apple Pay will appear automatically in Safari/iOS

## Deploy

```bash
npm run build
npm start
```

Or use the included `ecosystem.config.js` for PM2:
```bash
pm2 start ecosystem.config.js
```
