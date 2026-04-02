# Booking Flow Diagram

## Current Flow (With Issue)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BOOKS TOUR                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE CHECKOUT PAGE                          │
│  • User enters payment details                                   │
│  • Stripe processes payment                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  PAYMENT SUCCESS │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STRIPE SENDS WEBHOOK                           │
│  Event: payment_intent.succeeded                                 │
│  To: https://ticketsinrome.com/api/webhooks/stripe              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              WEBHOOK HANDLER PROCESSES EVENT                     │
│  1. Verify webhook signature ✅                                  │
│  2. Extract booking data ✅                                      │
│  3. Try to save to Supabase...                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  DATABASE INSERT │
                    │      FAILS ❌    │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WEBHOOK RETURNS ERROR                         │
│  Status: 500                                                     │
│  Message: "Booking creation failed"                              │
│  Result: EMAIL NEVER SENT ❌                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER EXPERIENCE                          │
│  ✅ Payment successful (Stripe receipt received)                │
│  ❌ No confirmation email                                        │
│  ❌ Booking not in database                                      │
│  ❌ Booking not in admin panel                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why Database Insert Fails

### Possible Causes:

1. **RLS Policy Blocking Insert** (Most Likely)
   ```
   Supabase RLS Policy → Blocks service role → Insert fails
   ```

2. **Missing Required Field**
   ```
   Webhook data → Missing field → Database constraint → Insert fails
   ```

3. **Wrong site_id**
   ```
   Webhook → site_id = 'wondersofrome' → But booking from ticketsinrome → Mismatch
   ```

4. **Supabase Connection Issue**
   ```
   Webhook → Can't connect to Supabase → Timeout → Insert fails
   ```

---

## Fixed Flow (After RLS Fix)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BOOKS TOUR                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE CHECKOUT PAGE                          │
│  • User enters payment details                                   │
│  • Stripe processes payment                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  PAYMENT SUCCESS │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STRIPE SENDS WEBHOOK                           │
│  Event: payment_intent.succeeded                                 │
│  To: https://ticketsinrome.com/api/webhooks/stripe              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              WEBHOOK HANDLER PROCESSES EVENT                     │
│  1. Verify webhook signature ✅                                  │
│  2. Extract booking data ✅                                      │
│  3. Save to Supabase ✅                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  DATABASE INSERT │
                    │    SUCCEEDS ✅   │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESERVE INVENTORY                             │
│  • Reduce available_slots by guest count                         │
│  • Update inventory table                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SEND EMAILS                                 │
│  1. Customer confirmation email ✅                               │
│     To: customer@example.com                                     │
│     From: info@ticketsinrome.com                                 │
│                                                                   │
│  2. Admin notification email ✅                                  │
│     To: ticketsinrome@gmail.com, abiile@ticketsinrome.com       │
│     From: info@ticketsinrome.com                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER EXPERIENCE                          │
│  ✅ Payment successful (Stripe receipt)                         │
│  ✅ Confirmation email received                                  │
│  ✅ Booking in database                                          │
│  ✅ Booking visible in admin panel                               │
│  ✅ Inventory updated                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## How to Fix

### Step 1: Diagnose
```bash
node diagnose-webhook-database.js
```

This will tell you exactly what's failing.

### Step 2: Fix RLS Policy

**Option A: Add Policy for Service Role**
```sql
CREATE POLICY "Service role can insert bookings"
ON bookings FOR INSERT TO service_role USING (true);
```

**Option B: Disable RLS (Quick Fix)**
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

### Step 3: Test
1. Make a test booking
2. Check webhook logs: `pm2 logs rome-tour-tickets`
3. Check Supabase for new booking
4. Check email inbox

---

## Data Flow Architecture

```
┌──────────────┐
│   FRONTEND   │
│ (Next.js)    │
└──────┬───────┘
       │
       │ 1. User books tour
       │
       ▼
┌──────────────┐
│    STRIPE    │
│  (Payment)   │
└──────┬───────┘
       │
       │ 2. Payment success
       │    Sends webhook
       │
       ▼
┌──────────────┐
│   WEBHOOK    │
│  (API Route) │
└──────┬───────┘
       │
       │ 3. Save booking
       │
       ▼
┌──────────────┐      ┌──────────────┐
│   SUPABASE   │◄────►│   INVENTORY  │
│  (Database)  │      │   SERVICE    │
└──────┬───────┘      └──────────────┘
       │
       │ 4. Booking saved
       │
       ▼
┌──────────────┐
│    RESEND    │
│   (Email)    │
└──────┬───────┘
       │
       │ 5. Send emails
       │
       ▼
┌──────────────┐
│   CUSTOMER   │
│  & ADMIN     │
└──────────────┘
```

---

## Inventory Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN CREATES SLOTS                         │
│  Admin Panel → Inventory → Select Date → Add Slots              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SLOTS SAVED TO DATABASE                       │
│  Table: inventory                                                │
│  Fields: tour_slug, date, time, available_slots, price_override │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND DISPLAYS SLOTS                        │
│  BookingWidget → Fetches available slots → Shows to user        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      USER BOOKS SLOT                             │
│  Selects date + time → Proceeds to checkout                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   WEBHOOK RESERVES SLOT                          │
│  available_slots = available_slots - guest_count                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SLOT UPDATED IN DATABASE                      │
│  If available_slots = 0 → Slot shows as "Sold Out"              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Multi-Site Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│  TICKETSINROME.COM  │         │  WONDERSOFROME.COM  │
│   (Port 3000)       │         │   (Port 3001)       │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │                               │
           └───────────┬───────────────────┘
                       │
                       │ Both sites share:
                       │
           ┌───────────▼───────────┐
           │                       │
    ┌──────▼──────┐        ┌──────▼──────┐
    │   SANITY    │        │  SUPABASE   │
    │    (CMS)    │        │ (Database)  │
    └─────────────┘        └─────────────┘
           │                       │
           │                       │
           └───────────┬───────────┘
                       │
                       │ Data is synced:
                       │
           ┌───────────▼───────────┐
           │                       │
    ┌──────▼──────┐        ┌──────▼──────┐
    │    TOURS    │        │  INVENTORY  │
    │   CONTENT   │        │   & SLOTS   │
    └─────────────┘        └─────────────┘
```

**Key Points:**
- Both sites read from same Sanity project
- Both sites write to same Supabase database
- Inventory is shared (prevents double booking)
- Tours can be assigned to one or both sites
- maxParticipants is automatically synced

---

## Summary

**Current Issue:** Database insert fails → Email never sent

**Root Cause:** RLS policy blocking service role insert

**Solution:** Add RLS policy or disable RLS

**Result:** Booking saved → Email sent → Happy customer! 🎉
