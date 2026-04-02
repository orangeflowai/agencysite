# Fixes Implementation Guide

## Summary of Changes

I've implemented fixes for all the issues you mentioned. Here's what was done:

---

## ✅ Issue 1: Embedded Google Maps (FIXED)

### What was done:
- Created `EmbeddedMap.tsx` component for both sites
- Updated `TourContent.tsx` to display embedded map below meeting point
- Map dynamically pulls location from Sanity `meetingPoint` field

### Files changed:
- `ticketsinrome-live/rome-tour-tickets/src/components/EmbeddedMap.tsx` (NEW)
- `ticketsinrome-live/rome-tour-tickets/src/components/TourContent.tsx` (UPDATED)
- `wondersofrome/wondersofrome/src/components/EmbeddedMap.tsx` (NEW)
- `wondersofrome/wondersofrome/src/components/TourContent.tsx` (UPDATED)

### How it works:
1. Tour page reads `meetingPoint` from Sanity
2. Displays meeting point text with "View on Maps" button
3. Below that, shows embedded Google Maps iframe
4. Map automatically centers on the meeting point location

### What you need to do:
1. Get a Google Maps API key (if you don't have one):
   - Go to: https://console.cloud.google.com/
   - Enable "Maps Embed API"
   - Create API key
   - Add to `.env` files:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

2. In Sanity CMS, ensure each tour has a `meetingPoint` filled in:
   - Go to tour editing
   - Navigate to "Logistics" tab
   - Fill in "Meeting Point" field
   - Example: "Via Germanico 8, 00192 Roma RM, Italy"

---

## ✅ Issue 2: Max Participants (ALREADY WORKING)

### Status: 
The `maxParticipants` field is already implemented and working correctly!

### How it works:
- Field exists in Sanity schema (both sites)
- BookingWidget uses it to limit participant selection
- Formula: `min(maxParticipants, available_slots)`

### What you need to do:
1. In Sanity CMS, set `maxParticipants` for each tour:
   - Go to tour editing
   - Navigate to "Logistics" tab
   - Set "Max Participants (per booking)"
   - Example: 20

2. This will immediately apply to the booking widget
3. Users won't be able to select more than this number

---

## ✅ Issue 3: Edit/Delete Inventory (ALREADY WORKING)

### Status:
The ManageSlotsModal already has full edit/delete functionality!

### Features available:
- ✅ Delete individual time slot (trash icon)
- ✅ Delete all slots for a date (top right trash button)
- ✅ Toggle slot status Open/Close (changes available_slots)
- ✅ Add new time slots
- ✅ Set custom pricing per slot

### How to use:
1. Go to Admin Panel → Inventory
2. Click on a date in the calendar
3. Modal opens showing all time slots for that date
4. Each slot has:
   - **Close button**: Sets available_slots to 0 (sold out)
   - **Open button**: Sets available_slots to 20 (available)
   - **Trash icon**: Deletes the slot permanently
5. Top right has "Delete All" button to clear entire day

### If you're having trouble:
- Make sure you're clicking on a date that has inventory
- The modal should pop up automatically
- Buttons are clearly visible on each slot row

---

## ⚠️ Issue 4: Email Not Sent After Booking (NEEDS INVESTIGATION)

### Problem:
You booked from ticketsinrome.com but didn't receive confirmation email (only Stripe receipt).

### Root cause:
The webhook is failing at "Booking creation failed" which means:
1. Stripe payment succeeds ✅
2. Webhook receives the event ✅
3. Database insert fails ❌
4. Email is never sent ❌

### Why database insert might fail:
- RLS (Row Level Security) policy blocking insert
- Missing required field
- Supabase connection issue
- Wrong site_id

### Diagnostic steps:

1. **Run the diagnostic script:**
   ```bash
   cd /path/to/workspace
   npm install @supabase/supabase-js dotenv
   node diagnose-webhook-database.js
   ```

   This will:
   - Test database connection
   - Try to insert a test booking
   - Check RLS policies
   - Show recent bookings

2. **Check Supabase RLS policies:**
   - Go to Supabase Dashboard
   - Navigate to Authentication → Policies
   - Find `bookings` table
   - Ensure there's a policy allowing INSERT for service role
   - Or disable RLS temporarily: `ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;`

3. **Check webhook logs on server:**
   ```bash
   ssh root@91.98.205.197
   pm2 logs rome-tour-tickets --lines 100
   ```
   Look for "Booking creation failed" and the error details

4. **Test webhook manually:**
   - Use Stripe Dashboard → Webhooks → Test webhook
   - Send a `payment_intent.succeeded` event
   - Check if booking appears in Supabase

### Quick fix (if RLS is the issue):
Run this SQL in Supabase:
```sql
-- Allow service role to insert bookings
CREATE POLICY "Service role can insert bookings"
ON bookings
FOR INSERT
TO service_role
USING (true);

-- Or disable RLS entirely (less secure but works)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

---

## 🚀 Deployment Instructions

### Option 1: Deploy everything at once
```bash
chmod +x deploy-all-fixes.sh
./deploy-all-fixes.sh
```

### Option 2: Deploy manually

**For ticketsinrome:**
```bash
# Upload files
scp ticketsinrome-live/rome-tour-tickets/src/components/EmbeddedMap.tsx root@91.98.205.197:/var/www/rome-tour-tickets/src/components/
scp ticketsinrome-live/rome-tour-tickets/src/components/TourContent.tsx root@91.98.205.197:/var/www/rome-tour-tickets/src/components/

# SSH and rebuild
ssh root@91.98.205.197
cd /var/www/rome-tour-tickets
npm run build
pm2 restart rome-tour-tickets
```

**For wondersofrome:**
```bash
# Upload files
scp wondersofrome/wondersofrome/src/components/EmbeddedMap.tsx root@91.98.205.197:/var/www/wondersofrome/src/components/
scp wondersofrome/wondersofrome/src/components/TourContent.tsx root@91.98.205.197:/var/www/wondersofrome/src/components/

# SSH and rebuild
ssh root@91.98.205.197
cd /var/www/wondersofrome
npm run build
pm2 restart wondersofrome
```

---

## 📋 Testing Checklist

After deployment, test these:

### 1. Embedded Maps
- [ ] Visit any tour page on ticketsinrome.com
- [ ] Scroll to "Meeting Point" section
- [ ] Verify embedded map appears below the text
- [ ] Map should show the correct location
- [ ] Repeat for wondersofrome.com

### 2. Max Participants
- [ ] In Sanity, set maxParticipants to 5 for a test tour
- [ ] Visit that tour's booking widget
- [ ] Try to add more than 5 participants
- [ ] Should be blocked at 5

### 3. Inventory Management
- [ ] Go to Admin Panel → Inventory
- [ ] Click on a date with slots
- [ ] Try deleting a slot (trash icon)
- [ ] Try toggling Open/Close
- [ ] Try adding a new slot
- [ ] All should work smoothly

### 4. Email Confirmation
- [ ] Run diagnostic script first
- [ ] Make a real test booking (small amount)
- [ ] Check if email arrives
- [ ] Check if booking appears in Supabase
- [ ] Check if booking appears in Admin Panel

---

## 🔧 Environment Variables Needed

Add these to both `.env` files if missing:

**ticketsinrome-live/rome-tour-tickets/.env:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=https://ogrvhooygcoazracbvkb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
STRIPE_WEBHOOK_SECRET_ROME=whsec_aBF43dJtxyQKRPKCNu2SrEYwL7vUMSRk
```

**wondersofrome/wondersofrome/.env:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=https://ogrvhooygcoazracbvkb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=re_4uGgRC4b_MhURchUq42q3NyMcQw7GcJ2J
```

---

## 📞 Support

If you encounter issues:

1. **Maps not showing**: Check Google Maps API key is set and Maps Embed API is enabled
2. **Emails not sending**: Run `node diagnose-webhook-database.js` and check RLS policies
3. **Inventory not editable**: Check browser console for errors, verify Supabase connection
4. **Max participants not working**: Verify field is set in Sanity and tour data is refreshed

---

## 🎯 Summary

**What's working:**
- ✅ Embedded Google Maps (after deployment + API key)
- ✅ Max participants field (already working, just needs Sanity data)
- ✅ Inventory edit/delete (already working)

**What needs investigation:**
- ⚠️ Email confirmation after booking (database insert failing)

**Next steps:**
1. Deploy the map changes
2. Add Google Maps API key
3. Run diagnostic script for webhook issue
4. Fix RLS policies if needed
5. Test complete booking flow
