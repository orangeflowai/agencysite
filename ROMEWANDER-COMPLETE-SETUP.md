# ✅ Rome Wander - Complete Setup & Verification

## 🎉 Setup Complete!

Rome Wander is now fully configured with Sanity CMS and ready for testing.

---

## 📊 What Was Done

### 1. ✅ Sanity Schemas Copied
- Copied all 8 schema files from Wonders of Rome
- `tourType.ts`, `siteType.ts`, `addonType.ts`, etc.
- Structure file copied

### 2. ✅ Vatican Tours Created
**5 Vatican tours added to Sanity:**

1. **Vatican Museums & Sistine Chapel Skip-the-Line Tour**
   - Price: €65 | Duration: 3 hours
   - Slug: `vatican-museums-sistine-chapel-skip-line`
   - Featured: Yes

2. **Early Morning Vatican Tour - Before the Crowds**
   - Price: €89 | Duration: 3 hours
   - Slug: `early-morning-vatican-tour`
   - Featured: Yes

3. **Vatican & St. Peter's Basilica Complete Tour**
   - Price: €79 | Duration: 4 hours
   - Slug: `vatican-st-peters-basilica-complete`

4. **Vatican Gardens Private Walking Tour**
   - Price: €45 | Duration: 2 hours
   - Slug: `vatican-gardens-private-tour`

5. **St. Peter's Basilica Dome Climb & Crypt**
   - Price: €35 | Duration: 2.5 hours
   - Slug: `st-peters-dome-climb-crypt`

### 3. ✅ Configuration Verified
- **Sanity Project ID**: `aknmkkwd`
- **Dataset**: `production`
- **Data Source**: `sanity`
- **Site ID**: `romewander`
- **Tenant**: `romewander`

### 4. ✅ Routes Verified
- Homepage: `src/app/page.tsx` ✅
- Tour detail: `src/app/tour/[slug]/page.tsx` ✅
- Payment API: `src/app/api/create-payment-intent/route.ts` ✅
- Stripe webhook: `src/app/api/webhooks/stripe/route.ts` ✅

### 5. ✅ Components Verified
- `TourCard.tsx` ✅
- `BookingWidget.tsx` ✅
- `CheckoutDrawer.tsx` ✅
- `dataAdapter.ts` ✅
- `sanityService.ts` ✅
- `stripe.ts` ✅

---

## 🚀 Testing Instructions

### Step 1: Start Development Server

```bash
cd /home/abiilesh/travelwebsite/romewander
npm run dev
```

Server will start at: **http://localhost:3000**

---

### Step 2: Test Homepage

Visit: **http://localhost:3000**

**Expected Results:**
- ✅ 5 Vatican tours displayed
- ✅ Featured tours highlighted (2 tours)
- ✅ Tour cards show:
  - Title
  - Price (€35 - €89)
  - Duration (2-4 hours)
  - Short description
  - "Book Now" button
- ✅ Hero section with Vatican imagery
- ✅ Navigation bar
- ✅ Footer

---

### Step 3: Test Tour Detail Pages

Click on any tour or visit directly:

**Tour 1:**
```
http://localhost:3000/tour/vatican-museums-sistine-chapel-skip-line
```

**Tour 2:**
```
http://localhost:3000/tour/early-morning-vatican-tour
```

**Tour 3:**
```
http://localhost:3000/tour/vatican-st-peters-basilica-complete
```

**Tour 4:**
```
http://localhost:3000/tour/vatican-gardens-private-tour
```

**Tour 5:**
```
http://localhost:3000/tour/st-peters-dome-climb-crypt
```

**Expected on Each Page:**
- ✅ Tour title
- ✅ Price and duration
- ✅ Full description
- ✅ Highlights list (6 items)
- ✅ What's included list
- ✅ What's not included list
- ✅ Meeting point
- ✅ Cancellation policy
- ✅ Important information
- ✅ Languages available
- ✅ Accessibility info
- ✅ **BookingWidget** (date picker, guest selector)
- ✅ "Book Now" button

---

### Step 4: Test Booking Flow

**On any tour detail page:**

1. **Select Date**
   - Click on date picker
   - Choose a future date
   - ✅ Date should be selected

2. **Select Guests**
   - Click guest selector
   - Choose number of adults/children
   - ✅ Total price should update

3. **Click "Book Now"**
   - ✅ CheckoutDrawer modal should open
   - ✅ Modal should be centered on screen
   - ✅ Should show booking summary

4. **Fill Contact Details**
   - Enter name
   - Enter email
   - Enter phone
   - ✅ Form validation should work

5. **Payment Section**
   - ✅ Stripe PaymentElement should load
   - ✅ Should show card input fields
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

6. **Complete Payment**
   - Click "Pay Now" or "Complete Booking"
   - ✅ Should process payment
   - ✅ Should show success message
   - ✅ Should receive confirmation email (if configured)

---

### Step 5: Test Sanity Studio

Visit: **http://localhost:3000/studio**

**Expected:**
- ✅ Sanity Studio loads
- ✅ Can see "Tours" collection
- ✅ Can see all 5 Vatican tours
- ✅ Can edit tour details
- ✅ Can add new tours
- ✅ Can upload images
- ✅ Can set tour status (draft/live)
- ✅ Can toggle active/inactive

**Test Editing:**
1. Click on any tour
2. Change the price
3. Click "Publish"
4. Refresh homepage
5. ✅ Price should update

---

## 🔍 Verification Checklist

### Data Layer
- [x] Sanity project connected (`aknmkkwd`)
- [x] 5 Vatican tours in Sanity
- [x] All tours have `tenant='romewander'`
- [x] All tours have `status='live'`
- [x] All tours have `active=true`
- [x] Tours have complete data (description, highlights, etc.)

### Frontend
- [ ] Homepage loads without errors
- [ ] 5 tours displayed on homepage
- [ ] Tour cards show correct information
- [ ] Tour detail pages load for all 5 tours
- [ ] Images load correctly
- [ ] Prices display correctly
- [ ] Duration displays correctly

### Booking Flow
- [ ] BookingWidget appears on tour pages
- [ ] Date picker works
- [ ] Guest selector works
- [ ] Price updates with guest count
- [ ] "Book Now" opens CheckoutDrawer
- [ ] CheckoutDrawer is centered modal
- [ ] Contact form validates input
- [ ] Stripe PaymentElement loads

### Payment
- [ ] Can enter test card details
- [ ] Payment processes successfully
- [ ] Success message appears
- [ ] Booking saved to database
- [ ] Confirmation email sent (if configured)

### Sanity Studio
- [ ] Studio accessible at /studio
- [ ] Can view all tours
- [ ] Can edit tours
- [ ] Can add new tours
- [ ] Changes reflect on frontend

---

## 🐛 Troubleshooting

### Tours Not Showing on Homepage

**Check:**
1. Tours have `tenant='romewander'`
2. Tours have `status='live'`
3. Tours have `active=true`
4. `DATA_SOURCE=sanity` in `.env`

**Fix:**
```bash
node /home/abiilesh/travelwebsite/add-vatican-tours-romewander.js
```

### Tour Detail Page 404

**Check:**
1. Slug matches URL
2. Tour exists in Sanity
3. Dynamic route file exists: `src/app/tour/[slug]/page.tsx`

### Booking Widget Not Working

**Check:**
1. `BookingWidget.tsx` imported on tour page
2. Tour has `maxParticipants` set
3. Tour has `price` set

### Stripe Payment Fails

**Check:**
1. Stripe keys in `.env`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMEWANDER`
   - `STRIPE_SECRET_KEY_ROMEWANDER`
2. Using test card: `4242 4242 4242 4242`
3. API route exists: `src/app/api/create-payment-intent/route.ts`

### Sanity Studio Not Loading

**Check:**
1. Sanity config: `sanity.config.ts`
2. Project ID correct: `aknmkkwd`
3. Dataset correct: `production`
4. Token valid in `.env`

---

## 📝 Test Stripe Cards

### Successful Payments
- **4242 4242 4242 4242** - Visa (succeeds)
- **5555 5555 5555 4444** - Mastercard (succeeds)

### Failed Payments (for testing)
- **4000 0000 0000 0002** - Card declined
- **4000 0000 0000 9995** - Insufficient funds

**For all cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

---

## 🎯 Next Steps After Testing

### 1. Add Real Stripe Keys
Replace test keys with live keys in `.env`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMEWANDER=pk_live_YOUR_REAL_KEY
STRIPE_SECRET_KEY_ROMEWANDER=sk_live_YOUR_REAL_KEY
```

### 2. Add Tour Images
In Sanity Studio:
1. Go to each tour
2. Upload `mainImage`
3. Add gallery images
4. Publish

### 3. Configure Email
Set up Resend for confirmation emails:
```bash
RESEND_API_KEY=your_resend_key
EMAIL_FROM=info@romewander.com
```

### 4. Deploy to Vercel
```bash
cd /home/abiilesh/travelwebsite/romewander
vercel --prod
```

### 5. Set Up Stripe Webhook
1. Go to Stripe Dashboard
2. Add webhook endpoint: `https://romewander.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

---

## ✅ Summary

**Rome Wander is now:**
- ✅ Connected to Sanity CMS
- ✅ Has 5 Vatican tours
- ✅ Has complete booking flow
- ✅ Has Stripe payment integration
- ✅ Has Sanity Studio for content management
- ✅ Ready for testing

**No more:**
- ❌ Payload CMS backend issues
- ❌ Server maintenance
- ❌ Database management
- ❌ PM2 process management
- ❌ Build errors
- ❌ Cache delays

**Start testing now:**
```bash
cd /home/abiilesh/travelwebsite/romewander
npm run dev
```

Visit: **http://localhost:3000**

🎉 **Happy testing!**
