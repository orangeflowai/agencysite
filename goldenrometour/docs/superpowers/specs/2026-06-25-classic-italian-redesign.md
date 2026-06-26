# Classic Italian Redesign — Golden Rome Tour

**Date:** 2026-06-25
**Status:** Approved
**Scope:** Delete entire UI/UX, build fresh 3-page design for 2 Vatican tour products

---

## Products
1. **Guided Tour:** Vatican Museums & Sistine Chapel — €65, 3hrs, max 24, guided
2. **Skip-the-Line:** Vatican Museums & Sistine Chapel Ticket — €45, flexible, self-guided

## Visual System
- Background: `#FDF8F0` (warm parchment cream)
- Foreground: `#1C1917` (near-black)
- Primary CTA: `#B5460E` (burnt terracotta)
- Secondary: `#F5EDE0` (light travertine)
- Accent: `#C9A84C` (Roman gold)
- Muted: `#78716C` (warm stone gray)
- Headings: Cormorant Garamond (serif)
- Body: Inter (clean sans-serif)
- Accent: Great Vibes (italic flourish, sparing)

## Pages
1. **Homepage** `/` — Hero, Trust bar, 2 wide tour cards, testimonials, FAQ preview, footer
2. **Tour Detail** `/tour/[slug]` — Hero image, description + inline booking panel, cross-link
3. **Success** `/success` — Confirmation, booking details, reminders

## Booking Flow
- Inline on tour page: date picker → guest selector → time slots → Book Now → Stripe
- No cart, no modal, no drawer
- Direct to Stripe payment

## Backend (kept)
- Sanity CMS for tour content
- Supabase for availability & bookings
- Stripe for payments
- Resend for confirmation emails
- API routes: availability, book, create-payment-intent, stripe webhook

## Admin
- `/admin/inventory` — calendar-based availability management (kept from existing)

## Component Tree (12 components)
- `Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, `TrustBar.tsx`
- `TourCardWide.tsx`, `TourCardCompact.tsx`
- `BookingPanel.tsx`, `TestimonialRow.tsx`, `FaqPreview.tsx`
- `ui/Button.tsx`, `ui/Calendar.tsx`, `ui/Accordion.tsx`

## Deletions
- 20+ unused components, blog, search, category, private-tours, partner pages
- Cart system (CartContext, CartDropdown, CheckoutDrawer)
- 3 competing headers/footers → 1 each
- Unused animation libraries (GSAP, Framer Motion, Lenis, SplitText)
- AI blog generator, admin dashboard widgets, admin addons
