# TicketsInRome UI Migration - Visual Guide

## Project Structure Comparison

### BEFORE (Current)
```
ticketsinrome/
├── src/
│   ├── app/
│   │   ├── page.tsx (old homepage)
│   │   ├── tour/[slug]/page.tsx
│   │   ├── booking/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── TourCard.tsx
│   │   ├── BookingWidget.tsx
│   │   ├── CheckoutDrawer.tsx
│   │   └── ... (custom components)
│   ├── lib/
│   │   ├── payloadService.ts ✓
│   │   ├── sanityService.ts ✓
│   │   ├── supabase.ts ✓
│   │   ├── stripe.ts ✓
│   │   └── ...
│   └── context/
│       ├── CartContext.tsx ✓
│       ├── AdminContext.tsx ✓
│       └── ThemeContext.tsx ✓
├── package.json (old deps)
└── tailwind.config.ts (v3)
```

### AFTER (New)
```
ticketsinrome/
├── app/
│   ├── page.tsx (NEW: modern homepage)
│   ├── layout.tsx
│   ├── globals.css
│   ├── tour/[slug]/page.tsx
│   ├── booking/
│   ├── admin/
│   └── api/
│       ├── tours/route.ts (NEW)
│       ├── checkout/
│       ├── webhooks/
│       └── ...
├── components/
│   ├── sections/
│   │   ├── hero-section.tsx (NEW)
│   │   ├── featured-products-section.tsx (NEW + backend)
│   │   ├── gallery-section.tsx (NEW)
│   │   ├── footer-section.tsx (NEW)
│   │   └── ...
│   ├── ui/
│   │   ├── button.tsx (Radix UI)
│   │   ├── card.tsx (Radix UI)
│   │   ├── dialog.tsx (Radix UI)
│   │   ├── drawer.tsx (Radix UI)
│   │   └── ... (50+ components)
│   ├── header.tsx (NEW)
│   ├── booking-widget.tsx (UPDATED)
│   ├── checkout-drawer.tsx (UPDATED)
│   └── ...
├── src/
│   ├── lib/
│   │   ├── backendAdapter.ts (NEW)
│   │   ├── payloadService.ts ✓
│   │   ├── sanityService.ts ✓
│   │   ├── supabase.ts ✓
│   │   ├── stripe.ts ✓
│   │   └── ...
│   ├── context/
│   │   ├── CartContext.tsx ✓
│   │   ├── AdminContext.tsx ✓
│   │   └── ThemeContext.tsx ✓
│   └── ...
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── package.json (merged deps)
├── tailwind.config.ts (v4)
└── ...
```

---

## Component Hierarchy

### Homepage Structure (NEW)
```
<main>
  ├── <Header />
  │   ├── Logo
  │   ├── Navigation
  │   ├── Cart Dropdown
  │   └── Admin Link
  │
  ├── <HeroSection />
  │   ├── Background Image
  │   ├── Headline
  │   └── CTA Button
  │
  ├── <PhilosophySection />
  │   ├── Title
  │   ├── Description
  │   └── Features Grid
  │
  ├── <FeaturedProductsSection /> ← CONNECTED TO BACKEND
  │   ├── Section Title
  │   └── Tours Grid
  │       ├── Tour Card (from API)
  │       │   ├── Image
  │       │   ├── Category Badge
  │       │   ├── Title
  │       │   ├── Rating
  │       │   ├── Duration
  │       │   └── Price
  │       └── ... (6 tours)
  │
  ├── <TechnologySection />
  │   ├── Title
  │   └── Features
  │
  ├── <GallerySection />
  │   ├── Title
  │   └── Image Grid
  │
  ├── <CollectionSection />
  │   ├── Title
  │   └── Collection Items
  │
  ├── <TestimonialsSection />
  │   ├── Title
  │   └── Testimonial Cards
  │
  ├── <EditorialSection />
  │   ├── Title
  │   └── Content
  │
  └── <FooterSection />
      ├── Links
      ├── Contact Info
      ├── Social Links
      └── Copyright
```

---

## Data Flow Diagram

### Tour Display Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits Homepage                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         FeaturedProductsSection Component Renders           │
│                                                              │
│  useEffect(() => {                                          │
│    fetch("/api/tours?featured=true&limit=6")               │
│  }, [])                                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              API Route: /api/tours/route.ts                 │
│                                                              │
│  export async function GET(request) {                       │
│    const featured = searchParams.get("featured")            │
│    const tours = await getFeaturedTours(...)               │
│    return Response.json(tours)                             │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Backend Adapter: lib/backendAdapter.ts              │
│                                                              │
│  export async function getFeaturedTours() {                │
│    const tours = await getTours(siteId)                    │
│    return tours.filter(t => t.featured)                    │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Payload CMS API                                │
│                                                              │
│  GET /api/tours?site=ticketsinrome&limit=100              │
│  Authorization: Bearer PAYLOAD_API_KEY                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Tours Data Returned                            │
│                                                              │
│  [                                                          │
│    {                                                        │
│      id: "tour-1",                                         │
│      title: "Vatican Museums + Sistine Chapel",            │
│      price: 39,                                            │
│      mainImage: { url: "...", alt: "..." },               │
│      rating: 4.9,                                          │
│      reviewCount: 847,                                     │
│      duration: "3 hours"                                   │
│    },                                                      │
│    ...                                                     │
│  ]                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Component State Updated: setTours(data)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Tours Rendered on Page                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Tour Card 1  │  │ Tour Card 2  │  │ Tour Card 3  │     │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │     │
│  │ Title        │  │ Title        │  │ Title        │     │
│  │ €39          │  │ €45          │  │ €65          │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Tour Card 4  │  │ Tour Card 5  │  │ Tour Card 6  │     │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │     │
│  │ Title        │  │ Title        │  │ Title        │     │
│  │ €55          │  │ €79          │  │ €89          │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Booking Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  User on Tour Card                           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Vatican Museums + Sistine Chapel                       │ │
│  │ [Image]                                                │ │
│  │ Rating: 4.9 ⭐ (847 reviews)                          │ │
│  │ Duration: 3 hours                                      │ │
│  │ From €39                                               │ │
│  │                                                        │ │
│  │ [Book Now Button] ← Click here                        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│         BookingWidget.handleInitialClick()                   │
│                                                               │
│  - Add tour to cart (CartContext)                           │
│  - Open CheckoutDrawer modal                               │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              CheckoutDrawer Modal Opens                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ STEP 1: Contact Details                             │   │
│  │                                                      │   │
│  │ Name: [________________]                            │   │
│  │ Email: [________________]                           │   │
│  │ Phone: [________________]                           │   │
│  │ Guests: [__]                                        │   │
│  │ Date: [________________]                            │   │
│  │                                                      │   │
│  │ [Continue to Payment] →                             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              CheckoutDrawer Modal - Step 2                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ STEP 2: Payment Details                             │   │
│  │                                                      │   │
│  │ ┌──────────────────────────────────────────────────┐ │   │
│  │ │ Stripe PaymentElement                            │ │   │
│  │ │                                                  │ │   │
│  │ │ Card Number: [____________________]             │ │   │
│  │ │ Expiry: [__/__]  CVC: [___]                     │ │   │
│  │ │                                                  │ │   │
│  │ └──────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │ Total: €39.00                                       │   │
│  │                                                      │   │
│  │ [Pay Now] →                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              Stripe Payment Processing                       │
│                                                               │
│  POST /api/checkout                                         │
│  {                                                          │
│    amount: 3900,                                            │
│    currency: "eur",                                         │
│    tourId: "tour-1",                                        │
│    email: "user@example.com"                               │
│  }                                                          │
│                                                              │
│  ↓                                                           │
│                                                              │
│  Stripe API: Create Payment Intent                         │
│  ↓                                                           │
│  Payment processed                                          │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              Stripe Webhook Received                         │
│                                                               │
│  POST /api/webhooks/stripe                                  │
│  {                                                          │
│    type: "payment_intent.succeeded",                        │
│    data: { object: { id: "pi_...", amount: 3900 } }        │
│  }                                                          │
│                                                              │
│  ↓                                                           │
│                                                              │
│  - Create booking in Supabase                              │
│  - Generate ticket (PDF)                                   │
│  - Send confirmation email                                 │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              Success Page Displayed                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✓ Payment Successful!                               │   │
│  │                                                      │   │
│  │ Booking Confirmation: #BK-12345                     │   │
│  │ Tour: Vatican Museums + Sistine Chapel              │   │
│  │ Date: March 15, 2024                                │   │
│  │ Time: 10:00 AM                                      │   │
│  │ Guests: 2                                           │   │
│  │ Total: €39.00                                       │   │
│  │                                                      │   │
│  │ Confirmation email sent to: user@example.com        │   │
│  │                                                      │   │
│  │ [Download Ticket] [View Booking] [Home]             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Dependencies

```
App (Root)
├── Header
│   ├── Logo
│   ├── Navigation
│   ├── CartDropdown
│   │   └── CartContext
│   └── AdminLink
│
├── HeroSection
│   └── FadeImage
│
├── PhilosophySection
│   └── FadeImage
│
├── FeaturedProductsSection ← BACKEND CONNECTED
│   ├── useEffect (fetch tours)
│   ├── FadeImage
│   ├── Star (lucide-react)
│   ├── Button
│   ├── Skeleton
│   └── Link (to tour detail)
│
├── TechnologySection
│   └── FadeImage
│
├── GallerySection
│   └── FadeImage
│
├── CollectionSection
│   └── FadeImage
│
├── TestimonialsSection
│   └── Avatar
│
├── EditorialSection
│   └── FadeImage
│
└── FooterSection
    ├── Link
    ├── Button
    └── Input

Tour Detail Page (/tour/[slug])
├── TourContent
│   ├── TourHeroSlider
│   ├── BookingWidget ← BOOKING TRIGGER
│   │   └── CheckoutDrawer
│   │       ├── Form (react-hook-form)
│   │       ├── Stripe PaymentElement
│   │       └── CartContext
│   ├── FAQ
│   └── Reviews

Admin Dashboard (/admin)
├── AdminContext
├── SiteSwitcher
├── Dashboard
│   ├── Inventory Management
│   ├── Booking Management
│   ├── Payment History
│   └── Tour Management
```

---

## Technology Stack

### Frontend
```
Next.js 16.1.3
├── React 19.2.3
├── TypeScript 5
├── Tailwind CSS 4
├── Radix UI (50+ components)
├── React Hook Form
├── Zod (validation)
├── Lucide React (icons)
├── Sonner (toasts)
└── Framer Motion (animations)
```

### Backend Services
```
Payload CMS
├── Tours collection
├── Products collection
├── Media management
└── API endpoints

Sanity CMS (Fallback)
├── Tour schema
├── Blog posts
└── Settings

Supabase
├── PostgreSQL database
├── Authentication
├── Real-time subscriptions
└── Storage

Stripe
├── Payment processing
├── Webhooks
└── Subscription management

Resend
├── Email service
├── Email templates
└── Transactional emails
```

---

## Environment Variables Map

```
┌─────────────────────────────────────────────────────────────┐
│                  Environment Variables                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PAYLOAD CMS                                                │
│  ├── NEXT_PUBLIC_PAYLOAD_URL                               │
│  ├── PAYLOAD_API_URL                                       │
│  ├── PAYLOAD_API_KEY                                       │
│  └── PAYLOAD_TENANT                                        │
│                                                              │
│  SANITY CMS                                                │
│  ├── NEXT_PUBLIC_SANITY_PROJECT_ID                         │
│  ├── NEXT_PUBLIC_SANITY_DATASET                            │
│  └── SANITY_API_TOKEN                                      │
│                                                              │
│  SUPABASE                                                  │
│  ├── NEXT_PUBLIC_SUPABASE_URL                              │
│  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY                         │
│  └── SUPABASE_SERVICE_ROLE_KEY                             │
│                                                              │
│  STRIPE                                                    │
│  ├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME              │
│  ├── STRIPE_SECRET_KEY_ROME                                │
│  └── STRIPE_WEBHOOK_SECRET_ROME                            │
│                                                              │
│  SITE CONFIG                                               │
│  ├── NEXT_PUBLIC_SITE_ID                                   │
│  ├── NEXT_PUBLIC_SITE_NAME                                 │
│  ├── NEXT_PUBLIC_SITE_URL                                  │
│  └── NEXT_PUBLIC_BASE_URL                                  │
│                                                              │
│  EMAIL                                                     │
│  └── RESEND_API_KEY                                        │
│                                                              │
│  AI (Optional)                                             │
│  ├── GROQ_API_KEY                                          │
│  ├── OPENAI_API_KEY                                        │
│  └── ...                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## File Changes Summary

### New Files (Created)
```
✨ src/lib/backendAdapter.ts
✨ src/app/api/tours/route.ts
✨ components/sections/hero-section.tsx
✨ components/sections/featured-products-section.tsx
✨ components/sections/philosophy-section.tsx
✨ components/sections/technology-section.tsx
✨ components/sections/gallery-section.tsx
✨ components/sections/collection-section.tsx
✨ components/sections/editorial-section.tsx
✨ components/sections/testimonials-section.tsx
✨ components/sections/footer-section.tsx
✨ components/header.tsx
✨ components/fade-image.tsx
✨ components/theme-provider.tsx
✨ components/ui/* (50+ Radix UI components)
✨ hooks/use-mobile.ts
✨ hooks/use-toast.ts
✨ lib/utils.ts
✨ styles/globals.css
```

### Updated Files (Modified)
```
📝 package.json (merged dependencies)
📝 tailwind.config.ts (upgraded to v4)
📝 next.config.ts (kept image domains)
📝 postcss.config.mjs (updated for v4)
📝 tsconfig.json (ensured paths work)
📝 .env (preserved all variables)
📝 components/booking-widget.tsx (integrated with new UI)
📝 components/checkout-drawer.tsx (integrated with new UI)
```

### Preserved Files (Unchanged)
```
✓ src/lib/payloadService.ts
✓ src/lib/sanityService.ts
✓ src/lib/supabase.ts
✓ src/lib/supabaseAdmin.ts
✓ src/lib/stripe.ts
✓ src/lib/inventoryService.ts
✓ src/lib/email-templates.ts
✓ src/lib/constants.ts
✓ src/app/api/webhooks/*
✓ src/app/api/checkout/*
✓ src/app/api/tickets/*
✓ src/context/CartContext.tsx
✓ src/context/AdminContext.tsx
✓ src/context/ThemeContext.tsx
✓ src/db/schema.sql
✓ middleware.ts
```

---

## Testing Pyramid

```
                    ▲
                   /│\
                  / │ \
                 /  │  \
                /   │   \
               /    │    \
              /  E2E Tests \
             /     (10%)    \
            /─────────────────\
           /                   \
          /   Integration Tests  \
         /        (30%)          \
        /─────────────────────────\
       /                           \
      /     Unit Tests (60%)        \
     /─────────────────────────────\
    ▼
```

### Unit Tests (60%)
- Component rendering
- Utility functions
- Data transformations
- API response handling

### Integration Tests (30%)
- API routes with backend
- Component interactions
- Data flow
- Context providers

### E2E Tests (10%)
- Full booking flow
- Payment processing
- Admin dashboard
- User journeys

---

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Commits                        │
│                                                              │
│  git add .                                                  │
│  git commit -m "feat: replace UI"                          │
│  git push origin main                                      │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Actions                             │
│                                                              │
│  - Run linter (ESLint)                                     │
│  - Run tests (Jest)                                        │
│  - Build project (Next.js)                                 │
│  - Check for errors                                        │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Vercel Deployment                          │
│                                                              │
│  - Build Next.js app                                       │
│  - Optimize images                                         │
│  - Deploy to CDN                                           │
│  - Run health checks                                       │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Production Live                            │
│                                                              │
│  - Monitor error logs                                      │
│  - Track performance metrics                               │
│  - Monitor user analytics                                  │
│  - Alert on issues                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

```
Performance
├── Page Load Time: < 3 seconds ✓
├── First Contentful Paint: < 1.5s ✓
├── Largest Contentful Paint: < 2.5s ✓
└── Cumulative Layout Shift: < 0.1 ✓

Functionality
├── All sections render: 100% ✓
├── Tours load from backend: 100% ✓
├── Booking flow works: 100% ✓
├── Payments process: 100% ✓
└── Admin dashboard works: 100% ✓

Quality
├── No console errors: 0 ✓
├── No TypeScript errors: 0 ✓
├── Accessibility score: > 90 ✓
├── SEO score: > 90 ✓
└── Mobile score: > 90 ✓

User Experience
├── Responsive design: All breakpoints ✓
├── Touch-friendly: All buttons > 44px ✓
├── Accessible: WCAG AA compliant ✓
└── Fast interactions: < 100ms ✓
```

---

**Visual Guide Complete**  
**Ready for Implementation**
