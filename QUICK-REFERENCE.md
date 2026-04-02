# Quick Reference Card

## 🚀 Deploy Everything
```bash
./deploy-all-fixes.sh
```

## 🔍 Diagnose Email Issue
```bash
npm install @supabase/supabase-js dotenv
node diagnose-webhook-database.js
```

## 🗺️ Add Google Maps API Key

**Get Key:**
https://console.cloud.google.com/ → Enable "Maps Embed API" → Create Key

**Add to .env files:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

## 🔧 Fix Email Issue (RLS Policy)

**Run in Supabase SQL Editor:**
```sql
CREATE POLICY "Service role can insert bookings"
ON bookings FOR INSERT TO service_role USING (true);
```

**Or disable RLS:**
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

## 👥 Set Max Participants

1. Go to: ticketsinrome.com/studio
2. Select tour → Logistics tab
3. Set "Max Participants (per booking)"
4. Click "Publish"

## 📊 Check Inventory

**Admin Panel:**
- ticketsinrome.com/admin/inventory
- wondersofrome.com/admin/inventory

**Edit/Delete:**
- Click on date → Modal opens
- Trash icon = delete slot
- Open/Close = toggle availability

## 📧 Check Webhook Logs
```bash
ssh root@91.98.205.197
pm2 logs rome-tour-tickets --lines 50
```

## 🧪 Test Booking Flow

1. Make test booking on site
2. Check email arrives
3. Check Supabase: https://supabase.com/dashboard
4. Check Admin Panel: /admin/bookings

## 🔄 Restart Services
```bash
ssh root@91.98.205.197
pm2 restart rome-tour-tickets
pm2 restart wondersofrome
```

## 📱 Server Info

**Host:** 91.98.205.197
**User:** root
**Password:** WVdqNp4Rsqfv

**Paths:**
- Ticketsinrome: `/var/www/rome-tour-tickets`
- Wondersofrome: `/var/www/wondersofrome`

**Ports:**
- Ticketsinrome: 3000
- Wondersofrome: 3001

## 🔑 Important URLs

**Sanity Studio:**
- ticketsinrome.com/studio
- wondersofrome.com/studio

**Admin Panels:**
- ticketsinrome.com/admin
- wondersofrome.com/admin

**Supabase:**
- https://supabase.com/dashboard/project/ogrvhooygcoazracbvkb

**Stripe:**
- https://dashboard.stripe.com/webhooks

## 📋 Quick Checks

**Is map showing?**
- Check API key in .env
- Check Maps Embed API enabled
- Check browser console

**Is email sending?**
- Run diagnostic script
- Check RLS policies
- Check Resend API key
- Check webhook logs

**Is inventory editable?**
- Check Supabase connection
- Check admin auth
- Check browser console

**Is max participants working?**
- Check Sanity field is set
- Clear browser cache
- Rebuild site

## 🆘 Emergency Contacts

**Resend Support:** support@resend.com
**Stripe Support:** https://support.stripe.com
**Supabase Support:** https://supabase.com/support

## 📚 Full Documentation

- `COMPLETE-SOLUTION-SUMMARY.md` - Overview of all fixes
- `FIXES-IMPLEMENTATION-GUIDE.md` - Detailed deployment guide
- `sync-sanity-data-guide.md` - Data sync between sites
- `test-real-booking-flow.md` - Booking flow analysis
