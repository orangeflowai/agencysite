# TicketsInRome UI Migration - Complete Summary

## Overview

This document provides a complete plan to replace the ticketsinrome UI with the modern new design from `tickets_in_rome` while preserving all backend integration with Payload CMS, Sanity, Supabase, and Stripe.

---

## What's Being Done

### Current State
- **Old UI**: Basic design with limited components
- **Backend**: Full integration with Payload CMS, Sanity, Supabase, Stripe
- **Features**: Booking flow, admin dashboard, payment processing, email notifications

### New State
- **New UI**: Modern design with Radix UI components, Tailwind CSS v4
- **Backend**: Same integration preserved
- **Features**: All existing features + improved UX

### Key Changes
| Aspect | Before | After |
|--------|--------|-------|
| UI Framework | Custom components | Radix UI + shadcn |
| Styling | Tailwind v3 | Tailwind v4 |
| Components | Basic | Advanced (Accordion, Dialog, Drawer, etc.) |
| Design System | Inconsistent | 8pt grid, CSS variables, proper spacing |
| Responsiveness | Basic | Mobile-first, fully responsive |
| Accessibility | Limited | WCAG compliant (Radix UI) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              UI Components (Radix UI)                │   │
│  │  - Header, Hero, Featured Products, Gallery, etc.   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Backend Integration Layer                    │   │
│  │  - backendAdapter.ts (Tour fetching)                │   │
│  │  - API routes (/api/tours, /api/checkout, etc.)    │   │
│  │  - Context providers (Cart, Admin, Theme)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Backend Services                             │   │
│  │  - Payload CMS (Tours, Products)                    │   │
│  │  - Sanity CMS (Fallback)                            │   │
│  │  - Supabase (Database, Auth)                        │   │
│  │  - Stripe (Payments)                                │   │
│  │  - Resend (Email)                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### New Structure (After Migration)

```
ticketsinrome/
├── app/
│   ├── page.tsx                    (Homepage with new sections)
│   ├── layout.tsx                  (Root layout)
│   ├── globals.css                 (Global styles)
│   ├── api/
│   │   ├── tours/route.ts          (Tours API endpoint)
│   │   ├── checkout/               (Checkout flow)
│   │   ├── webhooks/               (Stripe webhooks)
│   │   └── ...                     (Other API routes)
│   ├── tour/[slug]/page.tsx        (Tour detail page)
│   ├── booking/                    (Booking pages)
│   ├── admin/                      (Admin dashboard)
│   └── ...                         (Other pages)
│
├── components/
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── featured-products-section.tsx  (Connected to backend)
│   │   ├── gallery-section.tsx
│   │   ├── footer-section.tsx
│   │   └── ...
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   └── ... (50+ Radix UI components)
│   ├── header.tsx
│   ├── booking-widget.tsx          (Booking trigger)
│   ├── checkout-drawer.tsx         (Payment modal)
│   └── ...
│
├── src/
│   ├── lib/
│   │   ├── backendAdapter.ts       (NEW: Tour fetching)
│   │   ├── payloadService.ts       (Payload CMS)
│   │   ├── sanityService.ts        (Sanity CMS)
│   │   ├── supabase.ts             (Database)
│   │   ├── stripe.ts               (Payments)
│   │   ├── inventoryService.ts     (Inventory)
│   │   ├── email-templates.ts      (Email)
│   │   └── constants.ts            (Config)
│   │
│   ├── context/
│   │   ├── CartContext.tsx         (Shopping cart)
│   │   ├── AdminContext.tsx        (Admin state)
│   │   └── ThemeContext.tsx        (Theme)
│   │
│   ├── db/
│   │   └── schema.sql              (Database schema)
│   │
│   └── types/
│       └── ...
│
├── public/
│   ├── images/                     (Tour images)
│   └── ...
│
├── styles/
│   └── globals.css                 (Tailwind styles)
│
├── .env                            (Environment variables)
├── middleware.ts                   (Request handling)
├── next.config.ts                  (Next.js config)
├── tailwind.config.ts              (Tailwind config)
├── tsconfig.json                   (TypeScript config)
└── package.json                    (Dependencies)
```

---

## Data Flow

### 1. Tour Display Flow
```
User visits homepage
    ↓
Featured Products Section renders
    ↓
useEffect calls /api/tours?featured=true&limit=6
    ↓
API route calls getFeaturedTours()
    ↓
backendAdapter fetches from Payload CMS
    ↓
Tours data returned to component
    ↓
Tours displayed with images, prices, ratings
```

### 2. Booking Flow
```
User clicks "Book Now" on tour card
    ↓
BookingWidget opens CheckoutDrawer modal
    ↓
User enters contact details
    ↓
Stripe PaymentElement loads
    ↓
User enters payment info
    ↓
Payment processed via Stripe
    ↓
Webhook received at /api/webhooks/stripe
    ↓
Booking created in Supabase
    ↓
Ticket generated (PDF)
    ↓
Email sent via Resend
    ↓
Success page shown
```

### 3. Admin Dashboard Flow
```
Admin logs in at /admin/login
    ↓
AdminContext stores auth state
    ↓
Admin accesses dashboard
    ↓
Can manage:
  - Tours (create, edit, delete)
  - Inventory (availability, slots)
  - Bookings (view, confirm, cancel)
  - Payments (view transactions)
    ↓
Changes synced to Payload CMS
```

---

## Key Integration Points

### 1. Environment Variables
```env
# Payload CMS
NEXT_PUBLIC_PAYLOAD_URL=https://admin.wondersofrome.com
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_API_KEY=oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE
PAYLOAD_TENANT=ticketsinrome

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=aknmkkwd
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ogrvhooygcoazracbvkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME=pk_live_...
STRIPE_SECRET_KEY_ROME=sk_live_...
STRIPE_WEBHOOK_SECRET_ROME=whsec_...

# Site Config
NEXT_PUBLIC_SITE_ID=ticketsinrome
NEXT_PUBLIC_SITE_NAME=Rome Tour Tickets
NEXT_PUBLIC_SITE_URL=https://ticketsinrome.com
```

### 2. API Endpoints
```
GET  /api/tours                    - List all tours
GET  /api/tours?featured=true      - Featured tours only
GET  /api/tours?limit=6            - Limit results
GET  /api/tours/[id]               - Single tour
POST /api/checkout                 - Create payment intent
POST /api/book                     - Create booking
POST /api/webhooks/stripe          - Stripe webhook
GET  /api/availability             - Tour availability
GET  /api/tickets/[id]             - Download ticket
```

### 3. Database Tables (Supabase)
```
tours
  - id, title, slug, description, price, duration
  - category, featured, mainImage, rating, reviewCount
  - site_id, created_at, updated_at

bookings
  - id, tour_id, user_email, user_name, user_phone
  - guests, date, time, total_price, status
  - stripe_payment_id, ticket_url, created_at

inventory
  - id, tour_id, date, available_slots, booked_slots
  - site_id, created_at, updated_at

users
  - id, email, name, phone, role (admin/customer)
  - created_at, updated_at
```

---

## Design System Compliance

### Spacing (8pt Grid)
```
4px   → gap-1, p-1   (icon gaps, tight text)
8px   → gap-2, p-2   (small internal padding)
16px  → gap-4, p-4   (default element padding)
24px  → gap-6, p-6   (card padding, component margins)
32px  → gap-8, p-8   (section separators)
40px  → gap-10, p-10 (large component padding)
48px  → gap-12, p-12 (hero section padding)
64px  → gap-16, p-16 (major section divisions)
```

### Typography
```
Headings: text-3xl, text-4xl, text-5xl (leading-tight)
Body: text-base, text-sm (leading-relaxed)
Min body size: 16px
Line height: 1.25 (headings), 1.625 (body)
```

### Colors (CSS Variables)
```
--background       (page background)
--foreground       (primary text)
--card             (card background)
--primary          (brand color)
--muted            (subtle background)
--muted-foreground (secondary text)
--border           (borders)
--destructive      (errors)
--accent           (highlights)
```

### Component States
```
default   - Normal state
hover     - Cursor over element
active    - Click/tap state
disabled  - Non-interactive
loading   - Async operation
error     - Validation error
```

---

## Testing Checklist

### Functional Testing
- [ ] Homepage loads without errors
- [ ] All sections render correctly
- [ ] Featured products load from backend
- [ ] Images display properly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Navigation links work
- [ ] Footer links work
- [ ] Cart dropdown shows items
- [ ] Booking flow works end-to-end
- [ ] Payment processing works
- [ ] Success page displays after payment
- [ ] Admin dashboard accessible
- [ ] Admin can manage tours
- [ ] Admin can view bookings

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Images optimized with next/image
- [ ] No console errors
- [ ] No memory leaks
- [ ] API calls complete successfully
- [ ] Database queries efficient

### Backend Integration Testing
- [ ] Payload CMS connection works
- [ ] Sanity CMS fallback works
- [ ] Supabase database queries work
- [ ] Stripe webhook receives events
- [ ] Email notifications send
- [ ] Ticket generation works
- [ ] Inventory updates correctly

### Design System Compliance
- [ ] Spacing follows 8pt grid
- [ ] Typography correct sizes and line heights
- [ ] Colors from CSS variables
- [ ] Component states all work
- [ ] Responsive breakpoints correct
- [ ] Accessibility (WCAG) compliant

---

## Deployment Steps

### 1. Pre-Deployment
```bash
# Backup current version
cp -r ticketsinrome ticketsinrome-backup-$(date +%s)

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm run lint

# Check for errors
npm run build 2>&1 | grep -i error
```

### 2. Deployment
```bash
# Commit changes
git add .
git commit -m "feat: replace ticketsinrome UI with modern design"

# Push to main
git push origin main

# Monitor Vercel deployment
# Check build logs
# Test live site
```

### 3. Post-Deployment
```bash
# Monitor error logs
# Check analytics
# Verify bookings work
# Test payment processing
# Monitor performance metrics
```

---

## Rollback Plan

If issues occur:

```bash
# Option 1: Restore from backup
rm -rf ticketsinrome
cp -r ticketsinrome-backup-* ticketsinrome

# Option 2: Revert git commit
git revert HEAD
git push origin main

# Option 3: Restore from Vercel
# Go to Vercel dashboard
# Select previous deployment
# Click "Promote to Production"
```

---

## Success Criteria

✅ **UI**: Modern design with Radix UI components  
✅ **Backend**: All services integrated and working  
✅ **Data**: Tours loading from Payload CMS  
✅ **Booking**: Full booking flow functional  
✅ **Payments**: Stripe processing works  
✅ **Admin**: Dashboard accessible and functional  
✅ **Performance**: Page load < 3 seconds  
✅ **Design System**: Spacing, typography, colors compliant  
✅ **Testing**: All tests pass  
✅ **Deployment**: Live and monitoring  

---

## Timeline

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

## Resources

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Radix UI Components](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Payload CMS API](https://payloadcms.com/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Supabase Docs](https://supabase.com/docs)

### Key Files
- `TICKETSINROME_UI_MIGRATION_PLAN.md` - Detailed plan
- `TICKETSINROME_STEP_BY_STEP.md` - Step-by-step guide
- `TICKETSINROME_CODE_SNIPPETS.md` - Code examples

---

## Contact & Support

For questions or issues:
1. Check the troubleshooting section
2. Review error logs
3. Check Vercel deployment logs
4. Contact development team

---

**Created:** 2024  
**Status:** Ready for Execution  
**Last Updated:** 2024  
**Next Action:** Begin Phase 1 - Analysis & Preparation
