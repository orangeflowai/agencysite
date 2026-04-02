# Deployment Status Report
**Date:** March 14, 2026
**Time:** Current

---

## ✅ Successfully Deployed

### 1. Embedded Maps Feature
- ✅ EmbeddedMap.tsx uploaded to both sites
- ✅ TourContent.tsx updated on both sites
- ✅ Google Maps API key added: `AIzaSyBiMgipzLZugImdhsFkg6A45a2rR3xYZbk`
- ✅ Both sites rebuilt and restarted
- ✅ Maps should now display on tour pages

### 2. Logo Issue - FIXED
- ❌ **Issue Found:** Logo showing error on wondersofrome
- ✅ **Root Cause:** Public folder not copied to standalone build
- ✅ **Fix Applied:** Copied public folders to both `.next/standalone/` directories
- ✅ **Status:** Both sites restarted, logos should work now

### 3. Services Status
- ✅ **ticketsinrome** (rome-tour-tickets): Online on port 3000
- ✅ **wondersofrome**: Online on port 3001
- ✅ Both services running via PM2

---

## ⚠️ Issues Found & Solutions

### Issue 1: Max Participants Not Changing

**Problem:** You mentioned participant numbers are not changing yet.

**Root Cause Analysis:**
The `maxParticipants` field:
- ✅ EXISTS in Sanity schema
- ✅ IS USED in BookingWidget.tsx
- ⚠️ **BUT** needs to be SET in Sanity CMS for each tour

**How maxParticipants Works:**
```typescript
const maxSelectable = useMemo(() => {
    const byParticipants = tour?.maxParticipants ?? Number.POSITIVE_INFINITY;
    const byAvailability = activeSlot?.available_slots ?? Number.POSITIVE_INFINITY;
    return Math.min(byParticipants, byAvailability);
}, [tour, activeSlot]);
```

**What This Means:**
- If `maxParticipants` is NOT set in Sanity → No limit (POSITIVE_INFINITY)
- If `maxParticipants` IS set → Limits to that number
- Final limit is the MINIMUM of (maxParticipants, available_slots)

**Solution - You Need To:**

1. **Go to Sanity Studio:**
   - Visit: https://ticketsinrome.com/studio
   - Or: https://wondersofrome.com/studio

2. **For Each Tour:**
   - Click on the tour
   - Go to "Logistics" tab
   - Find "Max Participants (per booking)" field
   - Enter a number (e.g., 20, 30, 50)
   - Click "Publish"

3. **Test:**
   - Visit the tour page
   - Try to add participants
   - Should be limited to the number you set

**Example:**
- Set maxParticipants = 10 in Sanity
- User can only select up to 10 participants
- Even if available_slots = 50, limit is still 10

---

### Issue 2: Admin Panel

**Status:** Need more information

**Questions:**
1. What specific issue are you seeing in the admin panel?
2. Which admin panel? (ticketsinrome or wondersofrome)
3. What page/feature is not working?
4. Any error messages?

**Admin Panel URLs:**
- Ticketsinrome: https://ticketsinrome.com/admin
- Wondersofrome: https://wondersofrome.com/admin

**Common Admin Panel Features:**
- Dashboard: `/admin/dashboard`
- Bookings: `/admin/bookings`
- Inventory: `/admin/inventory`
- Products: `/admin/products`
- Settings: `/admin/settings`

---

## 🔍 Verification Steps

### 1. Check Maps Are Working

**Ticketsinrome:**
```
1. Visit: https://ticketsinrome.com
2. Click any tour
3. Scroll to "Meeting Point" section
4. You should see:
   - Meeting point text
   - "View on Maps" button
   - Embedded Google Map below
```

**Wondersofrome:**
```
1. Visit: https://wondersofrome.com
2. Click any tour
3. Scroll to "Meeting Point" section
4. You should see:
   - Meeting point text
   - "View on Maps" button
   - Embedded Google Map below
```

### 2. Check Logo Is Fixed

**Wondersofrome:**
```
1. Visit: https://wondersofrome.com
2. Check if logo appears in navbar
3. Should not show error
```

### 3. Test Max Participants

**After setting in Sanity:**
```
1. Go to Sanity Studio
2. Set maxParticipants = 5 for a test tour
3. Publish
4. Visit that tour page
5. Try to add 6 participants
6. Should be blocked at 5
```

---

## 📊 Current Configuration

### Environment Variables Set:
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (both sites)
- ✅ `RESEND_API_KEY` (both sites)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (both sites)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (both sites)
- ✅ `STRIPE_WEBHOOK_SECRET_ROME` (ticketsinrome)

### Files Deployed:
- ✅ `EmbeddedMap.tsx` (both sites)
- ✅ `TourContent.tsx` (both sites)
- ✅ Public folders copied to standalone builds

### Services Running:
- ✅ PM2 managing both applications
- ✅ Port 3000: ticketsinrome
- ✅ Port 3001: wondersofrome
- ✅ Nginx proxy forwarding requests

---

## 🚀 Next Steps

### Immediate Actions:

1. **Set Max Participants in Sanity:**
   - Log into Sanity Studio
   - Edit each tour
   - Set maxParticipants field
   - Publish changes

2. **Test Everything:**
   - Visit both websites
   - Check maps display
   - Check logos display
   - Test booking widget
   - Try adding participants

3. **Provide Admin Panel Details:**
   - Tell me what specific issue you're seeing
   - Which page/feature
   - Any error messages
   - Screenshots if possible

### Pending Tasks:

1. **Email Confirmation Issue:**
   - Still needs RLS policy fix
   - Run: `node diagnose-webhook-database.js`
   - Apply RLS fix in Supabase

2. **Verify Inventory Management:**
   - Test edit/delete slots
   - Confirm functionality works

---

## 📝 Summary

**What's Working:**
- ✅ Embedded maps deployed
- ✅ Google Maps API key configured
- ✅ Logo issue fixed
- ✅ Both sites online and running
- ✅ maxParticipants logic implemented

**What Needs Action:**
- ⚠️ Set maxParticipants in Sanity for each tour
- ⚠️ Provide details about admin panel issue
- ⚠️ Fix email confirmation (RLS policy)
- ⚠️ Test complete booking flow

**How to Set Max Participants:**
1. Go to Sanity Studio
2. Edit tour → Logistics tab
3. Set "Max Participants (per booking)"
4. Publish
5. Test on frontend

---

## 🆘 If Something Doesn't Work

### Maps not showing:
- Check browser console (F12)
- Verify API key is correct
- Check Maps Embed API is enabled

### Logo still broken:
- Clear browser cache
- Check server logs: `pm2 logs wondersofrome`

### Max participants not limiting:
- Verify field is set in Sanity
- Check tour data includes maxParticipants
- Clear browser cache
- Rebuild site if needed

### Admin panel issues:
- Provide specific details
- Check browser console
- Check server logs

---

**Last Updated:** March 14, 2026
**Status:** Deployment Complete - Awaiting Sanity Configuration
