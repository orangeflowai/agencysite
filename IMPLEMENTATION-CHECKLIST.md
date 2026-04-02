# Implementation Checklist

Use this checklist to track your progress implementing all the fixes.

---

## 🗺️ Phase 1: Embedded Google Maps

### Prerequisites
- [ ] Get Google Maps API key from https://console.cloud.google.com/
- [ ] Enable "Maps Embed API" in Google Cloud Console
- [ ] Copy API key to clipboard

### Ticketsinrome Setup
- [ ] Add API key to `ticketsinrome-live/rome-tour-tickets/.env`
  ```env
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
  ```
- [ ] Upload `EmbeddedMap.tsx` to server
- [ ] Upload updated `TourContent.tsx` to server
- [ ] Rebuild: `npm run build`
- [ ] Restart: `pm2 restart rome-tour-tickets`

### Wondersofrome Setup
- [ ] Add API key to `wondersofrome/wondersofrome/.env`
  ```env
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
  ```
- [ ] Upload `EmbeddedMap.tsx` to server
- [ ] Upload updated `TourContent.tsx` to server
- [ ] Rebuild: `npm run build`
- [ ] Restart: `pm2 restart wondersofrome`

### Testing
- [ ] Visit any tour page on ticketsinrome.com
- [ ] Scroll to "Meeting Point" section
- [ ] Verify embedded map appears
- [ ] Map shows correct location
- [ ] Repeat for wondersofrome.com
- [ ] Test on mobile device
- [ ] Test on different browsers

### Sanity CMS Setup
- [ ] Log into Sanity Studio
- [ ] For each tour, fill in "Meeting Point" field
- [ ] Use full address format: "Street, Postal Code, City, Country"
- [ ] Example: "Via Germanico 8, 00192 Roma RM, Italy"
- [ ] Publish changes
- [ ] Verify on frontend

---

## 📧 Phase 2: Fix Email Confirmation

### Diagnosis
- [ ] Install dependencies: `npm install @supabase/supabase-js dotenv`
- [ ] Run diagnostic script: `node diagnose-webhook-database.js`
- [ ] Read output carefully
- [ ] Identify exact error

### Fix RLS Policy (if needed)
- [ ] Log into Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Run this query:
  ```sql
  CREATE POLICY "Service role can insert bookings"
  ON bookings FOR INSERT TO service_role USING (true);
  ```
- [ ] Or disable RLS:
  ```sql
  ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
  ```
- [ ] Verify policy is active

### Verify Environment Variables
- [ ] Check `SUPABASE_SERVICE_ROLE_KEY` in .env
- [ ] Check `RESEND_API_KEY` in .env
- [ ] Check `STRIPE_WEBHOOK_SECRET_ROME` in .env
- [ ] Verify all keys are correct and not expired

### Testing
- [ ] Make a small test booking ($1-5)
- [ ] Check webhook logs: `pm2 logs rome-tour-tickets --lines 50`
- [ ] Look for "Booking creation failed" error
- [ ] Check Supabase for new booking record
- [ ] Check email inbox (customer email)
- [ ] Check admin email inbox
- [ ] Verify booking appears in Admin Panel

### Stripe Webhook Configuration
- [ ] Log into Stripe Dashboard
- [ ] Go to Webhooks section
- [ ] Verify endpoint: `https://ticketsinrome.com/api/webhooks/stripe`
- [ ] Verify events are enabled:
  - [ ] `payment_intent.succeeded`
  - [ ] `checkout.session.completed`
  - [ ] `payment_intent.payment_failed`
- [ ] Test webhook from Stripe Dashboard
- [ ] Check webhook logs for success

---

## 👥 Phase 3: Max Participants

### Sanity Configuration
- [ ] Log into Sanity Studio (ticketsinrome.com/studio)
- [ ] Go to "Tours" section
- [ ] For each tour:
  - [ ] Click on tour
  - [ ] Go to "Logistics" tab
  - [ ] Find "Max Participants (per booking)" field
  - [ ] Set appropriate number (e.g., 20, 30, 50)
  - [ ] Click "Publish"

### Verification
- [ ] Visit tour page on frontend
- [ ] Open booking widget
- [ ] Try to add participants
- [ ] Should be limited to maxParticipants value
- [ ] Try exceeding limit
- [ ] Should show error or disable button
- [ ] Test on both sites

### Common Values
- [ ] Small group tours: 10-15
- [ ] Standard tours: 20-30
- [ ] Large events: 50+
- [ ] Private tours: 6-8

---

## 🔄 Phase 4: Data Sync Verification

### Check Sanity Sync
- [ ] Edit a tour in Sanity
- [ ] Change maxParticipants
- [ ] Publish
- [ ] Check ticketsinrome.com (if tour assigned to it)
- [ ] Check wondersofrome.com (if tour assigned to it)
- [ ] Both should show same value

### Check Inventory Sync
- [ ] Create inventory slot on ticketsinrome admin
- [ ] Check if it appears on wondersofrome admin
- [ ] Make booking on ticketsinrome
- [ ] Check if inventory decreases on both sites
- [ ] Verify in Supabase database

### Check Booking Sync
- [ ] Make booking on ticketsinrome.com
- [ ] Check ticketsinrome admin panel
- [ ] Check wondersofrome admin panel (if same tour exists)
- [ ] Check Supabase database
- [ ] All should show same booking

---

## 📊 Phase 5: Inventory Management

### Access Admin Panel
- [ ] Go to ticketsinrome.com/admin/inventory
- [ ] Log in if needed
- [ ] Calendar should display

### Test Add Slot
- [ ] Click on a future date
- [ ] Modal should open
- [ ] Fill in time (e.g., 10:00)
- [ ] Fill in spots (e.g., 20)
- [ ] Optionally fill in custom price
- [ ] Click "+" button
- [ ] Slot should appear in list
- [ ] Verify on frontend booking widget

### Test Delete Slot
- [ ] Click on date with existing slots
- [ ] Find a slot to delete
- [ ] Click trash icon on that slot
- [ ] Confirm deletion
- [ ] Slot should disappear
- [ ] Verify on frontend

### Test Toggle Status
- [ ] Click on date with slots
- [ ] Find an open slot (available_slots > 0)
- [ ] Click "Close" button
- [ ] Should change to "Sold Out" (available_slots = 0)
- [ ] Click "Open" button
- [ ] Should change back to available
- [ ] Verify on frontend

### Test Delete All
- [ ] Click on date with multiple slots
- [ ] Click trash icon in header (top right)
- [ ] Confirm deletion
- [ ] All slots should disappear
- [ ] Verify on frontend

### Repeat for Wondersofrome
- [ ] Go to wondersofrome.com/admin/inventory
- [ ] Repeat all tests above
- [ ] Verify functionality works identically

---

## 🧪 Phase 6: End-to-End Testing

### Complete Booking Flow
- [ ] Visit tour page
- [ ] Select date
- [ ] Select time
- [ ] Add participants (test maxParticipants limit)
- [ ] Click "Confirm Booking"
- [ ] Fill in guest details
- [ ] Proceed to Stripe checkout
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete payment
- [ ] Redirected to success page
- [ ] Check confirmation email arrives
- [ ] Check admin email arrives
- [ ] Check booking in Supabase
- [ ] Check booking in Admin Panel
- [ ] Check inventory decreased

### Map Display
- [ ] Visit multiple tour pages
- [ ] Verify map appears on all
- [ ] Maps show correct locations
- [ ] Maps are responsive on mobile
- [ ] "View on Maps" button works

### Multi-Site Consistency
- [ ] Compare same tour on both sites
- [ ] Verify maxParticipants is same
- [ ] Verify inventory is same
- [ ] Verify pricing is same
- [ ] Make booking on one site
- [ ] Verify inventory updates on both

---

## 📱 Phase 7: Mobile Testing

### Responsive Design
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Booking widget works
- [ ] Map displays correctly
- [ ] Admin panel accessible
- [ ] Inventory management works

---

## 🔒 Phase 8: Security & Performance

### Security Checks
- [ ] Verify Stripe webhook signature validation
- [ ] Check Supabase RLS policies
- [ ] Verify API keys are in .env (not hardcoded)
- [ ] Check admin authentication works
- [ ] Test unauthorized access blocked

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Map loads without blocking page
- [ ] Booking widget responsive
- [ ] Admin panel loads quickly
- [ ] No console errors

---

## 📝 Phase 9: Documentation

### Update Internal Docs
- [ ] Document Google Maps API key location
- [ ] Document Stripe webhook configuration
- [ ] Document Supabase RLS policies
- [ ] Document admin panel access
- [ ] Document common troubleshooting steps

### Train Team
- [ ] Show how to add inventory
- [ ] Show how to edit/delete slots
- [ ] Show how to set maxParticipants
- [ ] Show how to check bookings
- [ ] Show how to handle customer issues

---

## ✅ Final Verification

### All Systems Go
- [ ] Embedded maps working on both sites
- [ ] Email confirmations sending
- [ ] Max participants limiting correctly
- [ ] Inventory management functional
- [ ] Data synced between sites
- [ ] No console errors
- [ ] No server errors
- [ ] Mobile responsive
- [ ] Performance acceptable

### Monitoring Setup
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Set up webhook failure alerts
- [ ] Set up email delivery monitoring
- [ ] Document escalation procedures

---

## 🎉 Launch

### Pre-Launch
- [ ] All checklist items complete
- [ ] Team trained
- [ ] Documentation updated
- [ ] Monitoring active
- [ ] Backup plan ready

### Launch Day
- [ ] Monitor webhook logs
- [ ] Monitor email delivery
- [ ] Monitor booking flow
- [ ] Check for errors
- [ ] Be ready to rollback if needed

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check customer feedback
- [ ] Review error logs
- [ ] Optimize as needed
- [ ] Celebrate success! 🎊

---

## 📊 Success Metrics

Track these metrics to measure success:

- [ ] Email delivery rate: Target 100%
- [ ] Booking completion rate: Target >80%
- [ ] Map load time: Target <2 seconds
- [ ] Admin panel usage: Track daily
- [ ] Customer complaints: Target <1%
- [ ] System uptime: Target 99.9%

---

## 🆘 Troubleshooting Reference

If something goes wrong, refer to:

1. `QUICK-REFERENCE.md` - Quick commands
2. `FIXES-IMPLEMENTATION-GUIDE.md` - Detailed guide
3. `BOOKING-FLOW-DIAGRAM.md` - Visual flow
4. `COMPLETE-SOLUTION-SUMMARY.md` - Overview

Or run diagnostic script:
```bash
node diagnose-webhook-database.js
```

---

## Notes

Use this space to track issues, questions, or observations:

```
Date: ___________
Issue: ___________________________________________________________
Solution: _________________________________________________________

Date: ___________
Issue: ___________________________________________________________
Solution: _________________________________________________________

Date: ___________
Issue: ___________________________________________________________
Solution: _________________________________________________________
```

---

**Last Updated:** March 13, 2026
**Status:** Ready for Implementation
**Estimated Time:** 2-3 hours for complete implementation
