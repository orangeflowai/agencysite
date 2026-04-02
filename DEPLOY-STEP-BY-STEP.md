# Step-by-Step Deployment Guide

Follow these steps exactly. Copy and paste each command.

**Server Password:** `WVdqNp4Rsqfv`

---

## Step 1: Upload Files to Ticketsinrome

### 1.1 Upload EmbeddedMap component
```bash
scp ticketsinrome-live/rome-tour-tickets/src/components/EmbeddedMap.tsx root@91.98.205.197:/var/www/rome-tour-tickets/src/components/
```
*Enter password when prompted*

### 1.2 Upload TourContent component
```bash
scp ticketsinrome-live/rome-tour-tickets/src/components/TourContent.tsx root@91.98.205.197:/var/www/rome-tour-tickets/src/components/
```
*Enter password when prompted*

---

## Step 2: Rebuild Ticketsinrome

### 2.1 SSH into server
```bash
ssh root@91.98.205.197
```
*Enter password when prompted*

### 2.2 Navigate to ticketsinrome directory
```bash
cd /var/www/rome-tour-tickets
```

### 2.3 Build the application
```bash
npm run build
```
*This will take 1-2 minutes*

### 2.4 Restart the application
```bash
pm2 restart rome-tour-tickets
```

### 2.5 Exit SSH
```bash
exit
```

---

## Step 3: Upload Files to Wondersofrome

### 3.1 Upload EmbeddedMap component
```bash
scp wondersofrome/wondersofrome/src/components/EmbeddedMap.tsx root@91.98.205.197:/var/www/wondersofrome/src/components/
```
*Enter password when prompted*

### 3.2 Upload TourContent component
```bash
scp wondersofrome/wondersofrome/src/components/TourContent.tsx root@91.98.205.197:/var/www/wondersofrome/src/components/
```
*Enter password when prompted*

---

## Step 4: Rebuild Wondersofrome

### 4.1 SSH into server
```bash
ssh root@91.98.205.197
```
*Enter password when prompted*

### 4.2 Navigate to wondersofrome directory
```bash
cd /var/www/wondersofrome
```

### 4.3 Build the application
```bash
npm run build
```
*This will take 1-2 minutes*

### 4.4 Restart the application
```bash
pm2 restart wondersofrome
```

### 4.5 Exit SSH
```bash
exit
```

---

## Step 5: Add Google Maps API Key

### 5.1 Get API Key
1. Go to: https://console.cloud.google.com/
2. Enable "Maps Embed API"
3. Create API key
4. Copy the key

### 5.2 Add to Ticketsinrome .env
```bash
ssh root@91.98.205.197
cd /var/www/rome-tour-tickets
nano .env
```

Add this line (replace with your actual key):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

Rebuild:
```bash
npm run build
pm2 restart rome-tour-tickets
exit
```

### 5.3 Add to Wondersofrome .env
```bash
ssh root@91.98.205.197
cd /var/www/wondersofrome
nano .env
```

Add this line (replace with your actual key):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

Rebuild:
```bash
npm run build
pm2 restart wondersofrome
exit
```

---

## Step 6: Test the Maps

### 6.1 Test Ticketsinrome
1. Open browser: https://ticketsinrome.com
2. Click on any tour
3. Scroll to "Meeting Point" section
4. You should see an embedded map below the meeting point text

### 6.2 Test Wondersofrome
1. Open browser: https://wondersofrome.com
2. Click on any tour
3. Scroll to "Meeting Point" section
4. You should see an embedded map below the meeting point text

---

## Step 7: Diagnose Email Issue

### 7.1 Install dependencies
```bash
npm install @supabase/supabase-js dotenv
```

### 7.2 Run diagnostic script
```bash
node diagnose-webhook-database.js
```

### 7.3 Read the output
The script will tell you if there's a database issue.

### 7.4 Fix RLS Policy (if needed)
If the script shows an RLS error:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run this query:
```sql
CREATE POLICY "Service role can insert bookings"
ON bookings FOR INSERT TO service_role USING (true);
```

Or disable RLS:
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

---

## Step 8: Test Complete Booking Flow

### 8.1 Make a test booking
1. Go to ticketsinrome.com
2. Select a tour
3. Choose date and time
4. Add participants
5. Complete checkout with test card: `4242 4242 4242 4242`

### 8.2 Check results
- [ ] Payment successful
- [ ] Confirmation email received
- [ ] Booking appears in Supabase
- [ ] Booking appears in Admin Panel
- [ ] Inventory decreased

---

## Troubleshooting

### If maps don't show:
- Check browser console for errors (F12)
- Verify API key is correct
- Verify Maps Embed API is enabled in Google Cloud
- Clear browser cache

### If email doesn't send:
- Run diagnostic script
- Check webhook logs: `ssh root@91.98.205.197` then `pm2 logs rome-tour-tickets`
- Verify RLS policies in Supabase
- Check Resend API key

### If build fails:
- Check for syntax errors
- Run `npm install` first
- Check Node.js version: `node --version` (should be 18+)

---

## Quick Commands Reference

**SSH into server:**
```bash
ssh root@91.98.205.197
```

**Check logs:**
```bash
pm2 logs rome-tour-tickets --lines 50
pm2 logs wondersofrome --lines 50
```

**Restart services:**
```bash
pm2 restart rome-tour-tickets
pm2 restart wondersofrome
```

**Check status:**
```bash
pm2 status
```

---

## Done! 🎉

Once all steps are complete:
- ✅ Maps are embedded on tour pages
- ✅ Email confirmations working
- ✅ Max participants limiting correctly
- ✅ Inventory management functional

If you need help, refer to:
- `QUICK-REFERENCE.md` for quick commands
- `FIXES-IMPLEMENTATION-GUIDE.md` for detailed info
- `COMPLETE-SOLUTION-SUMMARY.md` for overview
