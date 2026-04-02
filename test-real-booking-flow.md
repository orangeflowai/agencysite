# Real Booking Flow Test Results

## Test Date: March 13, 2026

### Issue 1: Email Not Sent After Real Booking

**Problem**: User booked from ticketsinrome.com but didn't receive confirmation email (only Stripe payment receipt)

**Root Cause Analysis**:
Looking at the webhook code (`/api/webhooks/stripe/route.ts`), the flow is:
1. Stripe sends webhook → payment_intent.succeeded or checkout.session.completed
2. Webhook tries to save booking to database
3. If booking save fails, it returns error 500 and NEVER sends email
4. The error message is: "Booking creation failed"

**Likely Causes**:
- Database permission issue (RLS policies blocking insert)
- Missing required fields in bookings table
- Supabase connection issue
- site_id mismatch

**Fix Required**:
1. Check Supabase RLS policies for bookings table
2. Verify all required fields are being sent
3. Add better error logging to identify exact failure point
4. Consider sending email even if database save fails (as fallback)

### Issue 2: maxParticipants Field

**Status**: ✅ ALREADY IMPLEMENTED

The `maxParticipants` field:
- EXISTS in Sanity schema (both ticketsinrome and wondersofrome)
- IS BEING USED in BookingWidget.tsx (line 96-100)
- Limits participant selection based on min(maxParticipants, available_slots)

**Action**: Just needs to be populated in Sanity CMS for each tour

### Issue 3: Edit/Delete Inventory Timings

**Status**: ✅ ALREADY IMPLEMENTED

ManageSlotsModal has:
- Delete individual slot button (Trash icon)
- Delete all slots button (top right)
- Toggle status button (Open/Close)
- Add new slot functionality

**Possible User Confusion**:
- User might not see the buttons (UI visibility issue)
- User might be looking in wrong place
- Modal might not be opening correctly

**Action**: Verify modal is accessible and buttons are visible

### Issue 4: Dynamic Map from Sanity

**Status**: ❌ NOT IMPLEMENTED

Current implementation:
- Meeting point is text field in Sanity
- Displayed as static text with "View on Maps" link
- No embedded map

**Required Changes**:
1. Add embedded Google Maps iframe below meeting point text
2. Use meetingPoint field to generate map embed URL
3. Make it responsive and styled consistently
4. Apply to both ticketsinrome and wondersofrome

## Next Steps:

1. ✅ Fix webhook database saving issue
2. ✅ Add embedded Google Maps to tour pages
3. ✅ Verify maxParticipants is synced between sites
4. ✅ Test complete booking flow end-to-end
