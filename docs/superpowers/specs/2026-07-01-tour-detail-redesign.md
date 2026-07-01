# Tour Detail Screen Redesign — Design Spec

**Date:** 2026-07-01
**Status:** Approved
**Scope:** `spotifyclone/app/(tabs)/home/tour/[id].tsx` and supporting components

---

## Goal

Redesign the tour detail screen to match top travel apps (Airbnb, GetYourGuide, Viator) with:
- A compelling, scrollable product page using real Sanity data
- Inline booking via a bottom sheet (no navigation away from the tour)
- Feature parity with the website's checkout data collection

---

## Architecture

### Component Tree

```
app/(tabs)/home/tour/[id].tsx          ← Screen orchestrator (data fetching + scroll)
├── components/tour/
│   ├── TourHero.tsx                    ← Parallax hero image, gradient, header buttons
│   ├── TourQuickFacts.tsx              ← Duration · Group Size · Tour Type · Languages
│   ├── TourAbout.tsx                   ← Expandable description from Sanity rich text
│   ├── TourGallery.tsx                 ← Horizontal gallery from Sanity gallery[] images
│   ├── TourIncludesExcludes.tsx        ← What's included ✅ / Not included ❌ (Sanity)
│   ├── TourItinerary.tsx               ← Timeline-style itinerary (Sanity)
│   ├── TourHighlights.tsx              ← Bullet highlights (Sanity)
│   ├── TourReviews.tsx                 ← Rating + star distribution bars
│   ├── TourMeetingPoint.tsx            ← Map link + address + directions
│   ├── TourFAQs.tsx                    ← Accordion FAQs (Sanity)
│   ├── TourImportantInfo.tsx           ← Dress code, ID requirements, etc. (Sanity)
│   ├── StickyBottomBar.tsx             ← Date chip + price + CTA
│   └── BookingSheet.tsx               ← Bottom sheet: calendar → guests → contact → pay
├── src/hooks/
│   ├── useBookingFlow.ts              ← Shared booking logic (extracted from checkout.tsx)
│   └── useAvailability.ts             ← Fetch time slots from API
└── src/components/booking/
    ├── ContactForm.tsx                 ← Contact fields (shared with checkout.tsx)
    ├── GuestStepper.tsx                ← Guest counter with price labels
    └── CalendarPicker.tsx             ← Month-view calendar with availability dots
```

### Design Pattern

Each tour section component receives only the data it needs via props. If a section has no data from Sanity, it does not render — no placeholder text, no hardcoded fallbacks. This keeps the screen clean and data-driven.

---

## Screen Layout (top to bottom)

1. **TourHero** — Parallax-scrolling full-width image. Gradient overlay (bottom 60%). Header: back arrow, heart (favorite toggle), share. Bottom of hero: badge pill (e.g. "Bestseller"), tour title, star rating + review count — all overlaid on the image.

2. **TourQuickFacts** — Horizontal pill row in a glass card: duration, group size, tour type, instant confirmation icon.

3. **TourIncludesExcludes** — Two-column glass card: green checkmarks for included items, red X marks for excluded items. Data from Sanity `includes[]` and `excludes[]`.

4. **TourAbout** — Rich text description with "Read More" / "Show Less" toggle (animated height). Data from Sanity `description` (portable text → plain text).

5. **TourGallery** — Horizontal `ScrollView` with snap-to-interval. Images from Sanity `gallery[]`. Tap to open fullscreen modal with pinch-to-zoom. Falls back to `mainImage` if gallery is empty.

6. **TourItinerary** — Vertical timeline with dots and lines. Each stop shows title, description, and duration. Data from Sanity `itinerary[]`. Hidden if empty.

7. **TourHighlights** — Bullet list with gold accent dots. Data from Sanity `highlights[]`. Hidden if empty.

8. **TourMeetingPoint** — Glass card with map pin icon, address text, "Arrive 15 minutes early" caption, and "Get Directions →" button that opens native maps. Data from Sanity `meetingPoint` and `mapAddress`.

9. **TourImportantInfo** — Glass card listing dress code, ID requirements, accessibility notes. Data from Sanity `importantInfo[]`. Hidden if empty.

10. **TourFAQs** — Accordion list (expand/collapse with spring animation). Data from Sanity `faqs[]`. Hidden if empty.

11. **TourReviews** — Rating summary bar (5-star to 1-star distribution). Uses Sanity `rating` and `reviewCount`. If no rating data, section is hidden.

12. **Bottom spacer** — 140px to clear the sticky bottom bar and tab bar.

---

## Sticky Bottom Bar

Always visible, floats at screen bottom. Three elements:

| Left | Center | Right |
|------|--------|-------|
| Date chip (tappable) | "From €X/person" | Primary button |

**Behavior:**
- Initially shows "Select Date" chip and "Check Availability" button
- After date selected: chip shows "Mon, Apr 15" and button changes to "Book Now"
- Tapping date chip opens the BookingSheet scrolled to the calendar
- Tapping the CTA opens the BookingSheet at whatever step the user left off

---

## Booking Bottom Sheet

A `@gorhom/bottom-sheet` (or React Native `Modal` + `Animated.View`) that slides up from the bottom.

### Structure

**Snap points:** 50% (calendar + times), 90% (full booking flow)

**Step progression:**
- Step 1: Calendar → time slots
- Step 2: Guest counts (with pricing per guest type from Sanity `guestTypes[]`)
- Step 3: Contact form + Stripe PaymentSheet → Confirmation

### Step 1 — Calendar + Times
- Month-view calendar with navigation arrows
- Past dates greyed out
- Selected date highlighted with primary color
- Below calendar: time slot pills fetched from `GET /api/availability?slug=X&date=Y`
- "X spots left" urgency label on low-availability slots
- "Sold out" state for zero-availability slots
- Loading spinner while fetching
- Error state with retry

### Step 2 — Guests
- Guest type steppers from Sanity `guestTypes[]` (or default: Adults/Youth/Child)
- Per-type pricing displayed inline
- Running subtotal updates live
- Constrained by `maxParticipants` if set

### Step 3 — Contact + Payment
- **Lead traveler:** firstName, lastName, DOB, email, phone, notes
- **If logged in:** email + name pre-filled from Supabase session — no OTP needed
- **If guest mode:** OTP email verification required before payment (calls `/api/auth/send-otp` and `/api/auth/verify-otp`)
- **Additional guests:** Per-person firstName, lastName, DOB cards (mandatory, not collapsible). Labeled "Guest 2", "Guest 3", etc.
- **Booking summary:** tour name, date, time, price breakdown
- **Payment:** Stripe PaymentSheet (calls `POST /api/create-payment-intent` → `initPaymentSheet` → `presentPaymentSheet`)
- **Success:** spring-animated confirmation with booking ref, "View Ticket →" button, "Add to Calendar" button
- **Payment info:** "Secured by Stripe · Free cancellation 24h before · Instant confirmation" trust row

### OTP Rule

| User state | OTP required? |
|------------|--------------|
| Logged in (Supabase session) | No — email already verified |
| Guest mode | Yes — verify email before payment |

---

## Sanity Data Integration

### Updated SanityTour Interface

Add these fields to `src/services/tours.ts`:

```typescript
interface SanityTour {
  // ...existing fields (id, slug, title, price, duration, etc.)...
  gallery?: { asset: { url: string } }[]
  includes?: string[]
  excludes?: string[]
  importantInfo?: string[]
  faqs?: { question: string; answer: string }[]
  itinerary?: { title: string; description: string; duration: string }[]
  tourType?: string
  guestTypes?: { name: string; price: number; description?: string }[]
  mapAddress?: string
  maxParticipants?: number
}
```

The GROQ query in `fetchToursFromSanity()` must be updated to include these fields.

### Remove All Hardcoded Data

| Current hardcoded value | Replacement |
|------------------------|-------------|
| `GALLERY_FALLBACK` (Unsplash URLs) | Sanity `gallery[]` |
| `WHATS_INCLUDED` array | Sanity `includes[]` |
| `MEETING_POINT_ADDRESS` | Sanity `meetingPoint` |
| Rating "4.9 (1.2k reviews)" | Sanity `rating` + `reviewCount` |

---

## Refactoring from checkout.tsx

### What Moves to Shared Code

| Logic | Destination |
|-------|-------------|
| Calendar rendering + month navigation | `src/components/booking/CalendarPicker.tsx` |
| Time slot fetching + display | `src/hooks/useAvailability.ts` |
| Guest type steppers | `src/components/booking/GuestStepper.tsx` |
| Contact form + validation | `src/components/booking/ContactForm.tsx` |
| Payment intent creation + Stripe flow | `src/hooks/useBookingFlow.ts` |
| Booking confirmation state + actions | `src/hooks/useBookingFlow.ts` |

### What Stays

`app/checkout.tsx` remains as a standalone screen for deep links and edge cases. It imports the same hooks and components — both the booking sheet and the checkout screen share one implementation.

---

## States

### Loading
- Tour screen: existing skeleton shimmer (hero block + glass card placeholders with shimmer animation)
- Gallery: hidden until images load
- Time slots: small spinner inside the times card
- Payment: button shows spinner + "Processing..."

### Empty
- Tour not found: existing `EmptyState` with "Browse All Tours" CTA
- Sections with no Sanity data: simply not rendered (no "coming soon" messages)

### Error
- Tour fetch failure: existing `ErrorState` with "Check your connection" + retry
- Availability API failure: inline error text + retry button
- Payment failure: Alert dialog (existing behavior)
- Network error during booking: toast notification

---

## Files Changed

| File | Action |
|------|--------|
| `app/(tabs)/home/tour/[id].tsx` | Rewrite — orchestrator only (~150 lines) |
| `app/checkout.tsx` | Refactor — thin wrapper using shared hooks |
| `src/services/tours.ts` | Update — add new Sanity fields to query + interface |
| `src/components/tour/TourHero.tsx` | New |
| `src/components/tour/TourQuickFacts.tsx` | New |
| `src/components/tour/TourAbout.tsx` | New |
| `src/components/tour/TourGallery.tsx` | New |
| `src/components/tour/TourIncludesExcludes.tsx` | New |
| `src/components/tour/TourItinerary.tsx` | New |
| `src/components/tour/TourHighlights.tsx` | New |
| `src/components/tour/TourReviews.tsx` | New |
| `src/components/tour/TourMeetingPoint.tsx` | New |
| `src/components/tour/TourFAQs.tsx` | New |
| `src/components/tour/TourImportantInfo.tsx` | New |
| `src/components/tour/StickyBottomBar.tsx` | New |
| `src/components/tour/BookingSheet.tsx` | New |
| `src/hooks/useBookingFlow.ts` | New |
| `src/hooks/useAvailability.ts` | New |
| `src/components/booking/ContactForm.tsx` | New |
| `src/components/booking/GuestStepper.tsx` | New |
| `src/components/booking/CalendarPicker.tsx` | New |

---

## Out of Scope

- Translating Sanity rich text (portable text) — the app already uses `pt::text()` to flatten it
- Guest auth flow changes — OTP sending for guests already exists on the website API
- Tab bar or navigation changes
- Admin panel changes
- Backend/API changes — all endpoints already exist
- Adding real review content to Sanity — we use `rating` + `reviewCount` fields already present
