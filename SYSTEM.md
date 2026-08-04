# Wonders of Rome — Full System Architecture

> Read this first. Every file, connection, and data flow in one place.

## Project Layout

```
/home/abiilesh/travelwebsite/
├── wondersofrome/wondersofrome/   ← Next.js 16 website (Hetzner)
└── spotifyclone/                   ← Expo SDK 51 mobile app
```

## Website (`wondersofrome/wondersofrome`)

**Stack:** Next.js 16 + Tailwind + Sanity CMS + Supabase + Stripe

### Key Files
| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — providers, fonts, metadata |
| `src/app/page.tsx` | Homepage — Hero, tours, FAQ |
| `src/app/tour/[slug]/page.tsx` | Tour detail + BookingWidget |
| `src/app/checkout/page.tsx` | Checkout redirect (stores data, redirects to `/?checkout=true`) |
| `src/components/CheckoutDrawer.tsx` | Full checkout drawer — contact → OTP verify → payment |
| `src/components/BookingWidget.tsx` | Date picker + guest steppers → opens CheckoutDrawer |
| `src/components/Navbar.tsx` | Navigation + search + cart + language |
| `src/components/Footer.tsx` | 4-column footer |
| `src/app/admin/dashboard/page.tsx` | Admin dashboard — stats, charts, recent bookings |
| `src/app/admin/bookings/page.tsx` | Full booking list — search, filter, sort, export CSV |
| `src/app/admin/inventory/page.tsx` | Calendar-based inventory management |
| `src/lib/sanityService.ts` | All Sanity queries — tours, posts, sites, settings |
| `src/lib/inventoryService.ts` | Supabase inventory CRUD — reserve, check, initialize |
| `src/lib/ticketService.ts` | Ticket lookup from Supabase bookings table |
| `src/lib/supabase.ts` | Supabase client initialization (anon + admin) |
| `src/lib/stripe.ts` | Lazy Stripe client with site-specific keys |
| `middleware.ts` | Auth guard for `/admin/*` routes |

### API Endpoints
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/create-payment-intent` | Create Stripe PaymentIntent (validates amount) |
| GET | `/api/availability?slug=X&date=Y` | Get time slots + guest prices for a tour |
| POST | `/api/webhooks/stripe` | Stripe webhook → write to Supabase bookings |
| GET | `/api/tickets?email=X` | Get bookings by email (for mobile sync) |
| GET | `/api/tickets/[id]` | Get single booking by ref or payment intent ID |
| POST | `/api/auth/send-otp` | Send OTP to email via Supabase |
| POST | `/api/auth/verify-otp` | Verify OTP, create session |
| POST | `/api/contact` | Contact form → email |
| GET | `/api/admin/inventory` | Admin inventory CRUD |

### Database: Supabase
| Table | Key Columns |
|---|---|
| `bookings` | booking_ref, lead_email, lead_first_name, lead_last_name, tour_title, date, time, guests, total_amount, status, stripe_payment_intent_id |
| `tour_slots` | tour_slug, date, time, available_slots, total_slots, is_paused, price_override |
| `user_tickets` | user_id, user_email, booking_id, ticket_code, tour_title, status |

### Brand System
4 brands via `.env`: `NEXT_PUBLIC_SITE_ID=wondersofrome|ticketsinrome|goldenrometour|romanvaticantour`
Each has CSS variables in `src/app/globals.css` — colors, fonts, shadows.

---

## Mobile App (`spotifyclone`)

**Stack:** Expo SDK 51 + Expo Router + React Native + Sanity + Supabase + Stripe

### Key Files
| File | Purpose |
|---|---|
| `app/_layout.tsx` | Root — providers (Auth, Stripe, Audio) + fonts |
| `app/(tabs)/home/index.tsx` | Home — greeting, search, top pick, nearby, experiences |
| `app/(tabs)/home/tour/[id].tsx` | Tour detail — parallax hero, gallery, booking |
| `app/(tabs)/map/index.tsx` | Map — GPS toggle, markers, audio guide |
| `app/(tabs)/booking/index.tsx` | Booking — explore tours + my tickets tabs |
| `app/(tabs)/profile/index.tsx` | Profile → delegates to ProfileScreen |
| `app/checkout.tsx` | 3-step checkout — date → payment → confirmation |
| `app/ticket/[code].tsx` | Ticket detail — QR code, directions, support |
| `app/tickets.tsx` | All tickets list |
| `screens/LoginScreen.tsx` | Email OTP login (no password) |
| `screens/ProfileScreen.tsx` | Stats, preferences, account, sign out |
| `navigators/BottomTabBar/BottomTabBar.tsx` | Glass tab bar — Home/Map/Book/Profile |
| `src/services/supabase.ts` | Auth + ticket CRUD |
| `src/services/sanity.ts` | Sights + audio tours from Sanity |
| `src/services/tours.ts` | Tour fetch from Sanity |
| `src/services/ticketService.ts` | Ticket CRUD + QR generation |
| `src/services/bookingService.ts` | Booking sync — website → app |
| `src/services/favoritesService.ts` | Favorites (AsyncStorage) |
| `src/services/locationService.ts` | GPS + geofencing |
| `src/services/weatherService.ts` | Weather from OpenWeatherMap |
| `context/AuthContext.tsx` | Auth state — signIn, signOut, guest mode |
| `context/AudioPlayerContext.tsx` | expo-av audio playback |
| `config/colors.ts` | COLORS — glassmorphism palette |
| `config/typography.ts` | FONT, FONT_SIZE, TEXT_STYLE |
| `config/spacing.ts` | SPACING, RADIUS |
| `config/glass.ts` | GLASS presets |
| `config/animation.ts` | SPRING, DURATION, SCALE |

### Shared Components
| Component | Location |
|---|---|
| Button (5 variants) | `src/components/Button/` |
| TourCard | `src/components/Card/TourCard.tsx` |
| TicketCard | `src/components/Card/TicketCard.tsx` |
| LandmarkCard | `src/components/Card/LandmarkCard.tsx` |
| LoadingState | `components/LoadingState/` |
| ErrorState | `components/ErrorState/` |
| EmptyState | `components/EmptyState/` |
| TextInput | `src/components/Input/TextInput.tsx` |
| SearchBar | `src/components/Input/SearchBar.tsx` |

### Design System
- **Palette:** Mediterranean Blue `#2B5C8F` + Roman Gold `#C49B3F` + warm rice paper `#FCFBF8`
- **Fonts:** Playfair Display (headings) + Inter (body) — via @expo-google-fonts
- **Style:** Glassmorphism — translucent white cards, soft colored shadows, backdrop blur
- **Motion:** Spring animations — button press 0.97, card press 0.985, modal slide-up
- **Haptics:** Light on tabs/toggles, medium on primary actions, success on booking

---

## Cross-Project Connections

```
WEBSITE                                MOBILE APP
───────                                ──────────

CheckoutDrawer                          app/checkout.tsx
  │                                        │
  ├─ POST /api/create-payment-intent ←────┤ calls this endpoint
  ├─ POST /api/auth/send-otp         ←────┤ (OTP via Supabase directly)
  ├─ POST /api/auth/verify-otp       ←────┤ (OTP via Supabase directly)
  │                                        │
  ├─ Stripe PaymentElement                 ├─ Stripe PaymentSheet (native)
  │   │                                    │   │
  │   └──→ webhook ──→ bookings table ←───┘   └──→ storeUserTicket()
  │                                        │
  ├─ GET /api/tickets?email=X ──────────→ │ syncBookingsFromWebsiteByEmail()
  └─ GET /api/availability?slug=X ←───────┤ fetches time slots

SHARED DATABASE (Supabase)
  bookings table ← website writes (webhook), mobile reads (sync)
  user_tickets table ← mobile writes (storeUserTicket), mobile reads (getUserTickets)
  tour_slots table ← website manages (inventory), mobile reads (availability)

SHARED CMS (Sanity)
  tours, sights, audio tours, settings ← both projects fetch from same project
  project: aknmkkwd, dataset: production
```

## Booking Flow (End to End)

```
1. Customer browses tours (Sanity) → website or app
2. Selects date/time (tour_slots table)
3. Enters contact details + email
4. OTP verification (Supabase auth)
5. Pays via Stripe
6. Webhook writes to bookings table
7. App syncs: GET /api/tickets?email=X → storeUserTicket()
8. Customer sees ticket with QR code in app
9. Admin sees all bookings at /admin/bookings
```

## Auth Flow

```
Website: Email → OTP → verify → session cookie
App:     Email → OTP (Supabase directly) → verify → sync bookings → home
         Guest mode available (AsyncStorage flag)
Admin:   Email + password → Supabase session → middleware guard
```

## Current State (2026-06-30)

- ✅ All screens redesigned with glassmorphism
- ✅ OTP auth replacing passwords (both platforms)
- ✅ Website → App ticket sync functional
- ✅ Native checkout with Stripe PaymentSheet
- ✅ Cross-project API connections verified
- ✅ Profile stats from real data (not hardcoded)
- ✅ Fonts: Playfair Display + Inter (via expo-google-fonts)
- ✅ Admin panel: bookings, inventory, users, settings
- ⚠️ Not yet deployed — 40 local commits on mobile, 5 on website
