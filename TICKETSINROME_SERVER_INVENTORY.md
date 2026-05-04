# Ticketsinrome Files on Hetzner Server

**Date**: May 2, 2026  
**Server**: Hetzner  
**User**: abiilesh  
**Base Path**: `/home/abiilesh/travelwebsite/`

---

## Directory Structure

### 1. ticketsinrome-live
**Path**: `/home/abiilesh/travelwebsite/ticketsinrome-live/`

**Contents**:
```
ticketsinrome-live/
└── rome-tour-tickets/
    ├── .env (4.7 KB)
    ├── .env.example (1.9 KB)
    ├── .next/ (build cache)
    ├── .vercel/ (Vercel config)
    ├── deploy/ (empty)
    ├── ecosystem.config.js (475 B)
    ├── next-env.d.ts (251 B)
    ├── node_modules/ (20,136 files)
    ├── package-lock.json (761 KB)
    ├── src/
    │   └── app/
    │       ├── not-found.tsx
    │       ├── error.tsx
    │       └── sitemap.ts
    └── tsconfig.tsbuildinfo (1.8 MB)
```

**Status**: Minimal setup - only error pages and sitemap

---

### 2. ticketsinrome-copy
**Path**: `/home/abiilesh/travelwebsite/ticketsinrome-copy/`

**Contents**:
```
ticketsinrome-copy/
└── ticketsinrome/
    ├── .dockerignore (82 B)
    ├── .env (4.3 KB)
    ├── .env.example (1.9 KB)
    ├── .gitignore (491 B)
    ├── .next/ (build cache)
    ├── deploy/ (empty)
    ├── ecosystem.config.js (1.2 KB)
    ├── eslint.config.mjs (465 B)
    ├── middleware.ts (3.1 KB)
    ├── new_features_schema.sql (1.5 KB)
    ├── next.config.ts (1.6 KB)
    ├── next-env.d.ts (247 B)
    ├── node_modules/ (19,964 files)
    ├── package.json (1.6 KB)
    ├── package-lock.json (759 KB)
    ├── postcss.config.mjs (94 B)
    ├── public/ (26 files)
    ├── README.md (1.5 KB)
    ├── sanity.config.ts (1.1 KB)
    ├── scripts/ (108 files)
    ├── src/ (FULL APPLICATION)
    ├── tailwind.config.ts (3.2 KB)
    ├── tsconfig.json (736 B)
    ├── tsconfig.tsbuildinfo (1.8 MB)
    └── vercel.json (126 B)
```

**Status**: Full application with complete source code

---

## Complete File Inventory - ticketsinrome-copy/ticketsinrome/src

### App Pages (20 files)
```
src/app/
├── about/page.tsx
├── admin/
│   ├── addons/page.tsx
│   ├── blog/page.tsx
│   ├── bookings/page.tsx
│   ├── dashboard/page.tsx
│   ├── inventory/page.tsx
│   ├── login/page.tsx
│   ├── payments/page.tsx
│   ├── products/page.tsx
│   ├── settings/page.tsx
│   ├── users/page.tsx
│   ├── AdminLayoutClient.tsx
│   ├── layout.tsx
│   └── page.tsx
├── api/ (20+ route files)
├── become-a-partner/page.tsx
├── blog/
│   ├── [slug]/page.tsx
│   └── page.tsx
├── booking/success/page.tsx
├── cancellation-policy/page.tsx
├── category/[slug]/page.tsx
├── checkout/page.tsx
├── contact/page.tsx
├── disclaimer/page.tsx
├── faq/page.tsx
├── privacy-policy/page.tsx
├── private-tours/page.tsx
├── search/page.tsx
├── studio/[[...tool]]/
│   ├── Studio.tsx
│   └── page.tsx
├── success/page.tsx
├── terms-and-conditions/page.tsx
├── tour/[slug]/page.tsx
├── layout.tsx
├── page.tsx
├── not-found.tsx
├── error.tsx
└── sitemap.ts
```

### API Routes (20+ files)
```
src/app/api/
├── addons/route.ts
├── admin/
│   ├── addons/
│   │   ├── [id]/route.ts
│   │   └── route.ts
├── ai/
│   ├── extract-keywords/route.ts
│   └── generate-blog/route.ts
├── availability/route.ts
├── book/route.ts
├── checkout/route.ts
├── contact/route.ts
├── create-payment-intent/route.ts
├── debug/
│   ├── inventory/route.ts
│   ├── supabase/route.ts
│   └── tours/route.ts
├── seed-addons/route.ts
├── seed-inventory/route.ts
├── seed-tours/route.ts
├── seed-verified/route.ts
├── tickets/[id]/route.ts
└── webhooks/stripe/route.ts
```

### Components (50+ files)
```
src/components/
├── admin/
│   ├── AIBlogAssistant.tsx
│   ├── CalendarDiagnostic.tsx
│   ├── InventoryCalendar.tsx
│   ├── ManageSlotsModal.tsx
│   └── SiteSwitcher.tsx
├── ui/
│   └── SmartCalendar.tsx
├── AnimatedSection.tsx
├── BookingModal.tsx
├── BookingWidget.tsx
├── CartDropdown.tsx
├── CategoryHero.tsx
├── CookieBanner.tsx
├── FAQ.tsx
├── FloatingReviews.tsx
├── Footer.tsx
├── GlobalThemeProvider.tsx
├── GoogleTranslate.tsx
├── GuestDetailsModal.tsx
├── Hero.tsx
├── LanguageSwitcher.tsx
├── LiveVisitorCounter.tsx
├── LoadingWithFacts.tsx
├── MagneticButton.tsx
├── Navbar.tsx
├── Newsletter.tsx
├── PaymentLogos.tsx
├── PhoneInput.tsx
├── ProductRow.tsx
├── RomeGallery.tsx
├── SearchResults.tsx
├── SectionSeparator.tsx
├── SiteProvider.tsx
├── SmoothScroll.tsx
├── SocialProof.tsx
├── StickyRomeSection.tsx
├── ThemeProvider.tsx
├── TourCard.tsx
├── TourContent.tsx
├── TourHeroSlider.tsx
└── TrustBadges.tsx
```

### Actions (3 files)
```
src/app/actions/
├── blogActions.ts
├── sanityActions.ts
└── tourActions.ts
```

### Additional Directories
```
src/
├── components/ (50+ files)
├── lib/ (utilities and services)
├── context/ (React context)
├── hooks/ (custom hooks)
├── types/ (TypeScript types)
├── styles/ (CSS/Tailwind)
└── public/ (static assets)
```

---

## Key Configuration Files

| File | Size | Purpose |
|------|------|---------|
| `.env` | 4.3 KB | Environment variables |
| `package.json` | 1.6 KB | Dependencies |
| `next.config.ts` | 1.6 KB | Next.js configuration |
| `tailwind.config.ts` | 3.2 KB | Tailwind CSS config |
| `tsconfig.json` | 736 B | TypeScript config |
| `middleware.ts` | 3.1 KB | Next.js middleware |
| `sanity.config.ts` | 1.1 KB | Sanity CMS config |
| `ecosystem.config.js` | 1.2 KB | PM2 config |

---

## Dependencies Summary

- **Total node_modules**: 19,964 files
- **Package-lock.json**: 759 KB
- **Framework**: Next.js (React)
- **CMS**: Sanity
- **Styling**: Tailwind CSS
- **Deployment**: Vercel + PM2

---

## Comparison: ticketsinrome-live vs ticketsinrome-copy

| Aspect | ticketsinrome-live | ticketsinrome-copy |
|--------|-------------------|-------------------|
| **Status** | Minimal | Full Application |
| **Source Code** | Partial (3 files) | Complete (100+ files) |
| **Components** | None | 50+ components |
| **API Routes** | None | 20+ routes |
| **Pages** | 3 (error pages) | 30+ pages |
| **Size** | ~2.5 MB | ~2.6 MB |
| **Last Updated** | Apr 24 | Apr 28 |
| **Purpose** | Placeholder | Production |

---

## File Statistics

### ticketsinrome-copy/ticketsinrome
- **Total TypeScript files**: 100+
- **Total Components**: 50+
- **Total Pages**: 30+
- **Total API Routes**: 20+
- **Total Actions**: 3
- **Configuration Files**: 8
- **Total Size**: ~2.6 MB (with node_modules)

---

## Key Features Present

✅ **Admin Dashboard**
- Dashboard page
- User management
- Product management
- Blog management
- Booking management
- Payment management
- Settings management
- Inventory management

✅ **Public Pages**
- Homepage
- Tour detail pages
- Blog pages
- Search functionality
- Category pages
- About page
- FAQ page
- Contact page
- Privacy policy
- Terms and conditions
- Cancellation policy

✅ **E-Commerce**
- Shopping cart
- Checkout process
- Payment integration (Stripe)
- Booking system
- Inventory management

✅ **CMS Integration**
- Sanity CMS
- Blog management
- Content management

✅ **Advanced Features**
- AI Blog Assistant
- Calendar system
- Live visitor counter
- Google Translate
- Cookie banner
- Newsletter signup
- Social proof

---

## Deployment Configuration

- **Vercel**: Configured (vercel.json present)
- **PM2**: Configured (ecosystem.config.js present)
- **Docker**: Supported (.dockerignore present)
- **Environment**: Multi-environment (.env files)

---

## Summary

**ticketsinrome-live**: Minimal setup with only error pages - appears to be a placeholder or staging environment.

**ticketsinrome-copy**: Full production application with complete source code, 100+ TypeScript files, 50+ components, 30+ pages, and 20+ API routes. This is the main application.

Both are Next.js applications using Sanity CMS, Tailwind CSS, and Stripe for payments.

---

**Last Scanned**: May 2, 2026  
**Total Files Found**: 100+ TypeScript files across both directories

