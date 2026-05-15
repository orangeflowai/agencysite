# TicketsInRome - Complete Testing Guide

## 🧪 LOCAL TESTING (Before Production)

### Prerequisites
```bash
# 1. Install Stripe CLI (for webhook testing)
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# 2. Login to Stripe
stripe login
```

---

## 🚀 STEP 1: Start Development Server

```bash
cd /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets
npm run dev
```

Server should start at: http://localhost:3000

---

## 🔗 STEP 2: Setup Stripe Webhook Forwarding

Open a new terminal:

```bash
cd /home/abiilesh/travelwebsite/ticketsinrome-live/rome-tour-tickets
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You should see:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**IMPORTANT:** Copy this webhook secret and temporarily add it to your `.env`:
```env
STRIPE_WEBHOOK_SECRET_ROME=whsec_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_TICKETSINROME=whsec_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_ROME_TOUR_TICKETS=whsec_xxxxxxxxxxxxx
```

Restart your dev server after updating `.env`.

---

## 🧪 STEP 3: Test Complete Booking Flow

### 3.1 Visit Tour Page
1. Open browser: http://localhost:3000/tours/vatican-museums-sistine-chapel
2. Verify BookingWidget appears on the right sidebar
3. Verify SmartCalendar loads with dates

### 3.2 Select Date & Time
1. Click on an available date (green)
2. Verify time slots appear below calendar
3. Select a time slot
4. Verify it's highlighted

### 3.3 Select Guests
1. Use stepper controls to add guests
2. Verify price updates in real-time
3. Try different guest types (adults, students, youths)
4. Verify total price calculation

### 3.4 Click "Book Now"
1. Click the "Book Now" button
2. Verify CheckoutDrawer opens as a modal
3. Verify "Step 1 of 2" is shown
4. Verify order summary on the right

### 3.5 Fill Contact Details (Step 1)
```
First Name: John
Last Name: Doe
Email: john.doe@example.com
Phone: +1234567890
Notes: (optional)
```
1. Fill all required fields
2. Click "Continue to Payment"
3. Verify "Step 2 of 2" is shown

### 3.6 Enter Payment Details (Step 2)
Use Stripe test cards:

**Success:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

**Decline:**
```
Card Number: 4000 0000 0000 0002
```

**Requires Authentication:**
```
Card Number: 4000 0025 0000 3155
```

1. Enter test card details
2. Click "Pay €XXX.XX"
3. Verify loading state
4. Wait for payment to process

### 3.7 Verify Webhook
In the Stripe CLI terminal, you should see:
```
2026-05-13 10:30:45   --> payment_intent.succeeded [evt_xxxxx]
2026-05-13 10:30:45   <-- [200] POST http://localhost:3000/api/webhooks/stripe [evt_xxxxx]
```

### 3.8 Verify Success Page
1. Should redirect to `/success?payment_intent=pi_xxxxx`
2. Verify booking reference is displayed (6-character code)
3. Verify all booking details are shown:
   - Tour title
   - Date & time
   - Number of guests
   - Total amount
   - Customer name, email, phone
4. Verify "Download PDF Ticket" button appears
5. Click "Download PDF Ticket"
6. Verify PDF downloads with booking details

### 3.9 Verify Emails
Check your email inbox (john.doe@example.com):
1. Should receive customer confirmation email
2. Verify booking reference matches
3. Verify all details are correct
4. Verify "View Booking Details" button works

Check admin email (admin@ticketsinrome.com):
1. Should receive admin notification email
2. Verify customer details
3. Verify booking details

---

## 🔍 STEP 4: Test API Endpoints Directly

### 4.1 Test Availability API
```bash
# Get availability for a specific date
curl "http://localhost:3000/api/availability?slug=vatican-museums-sistine-chapel&date=2026-05-20&mode=day"

# Expected response:
{
  "slots": [
    {
      "time": "09:00",
      "available_slots": 15,
      "price": 45
    },
    {
      "time": "11:00",
      "available_slots": 20,
      "price": 45
    }
  ]
}
```

```bash
# Get availability for entire month
curl "http://localhost:3000/api/availability?slug=vatican-museums-sistine-chapel&date=2026-05&mode=month"

# Expected response:
{
  "dates": {
    "2026-05-01": { "spots": 50, "price": 45 },
    "2026-05-02": { "spots": 30, "price": 45 },
    ...
  }
}
```

### 4.2 Test Create Payment Intent API
```bash
curl -X POST http://localhost:3000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 90,
    "tourTitle": "Vatican Museums & Sistine Chapel",
    "tourSlug": "vatican-museums-sistine-chapel",
    "date": "2026-05-20",
    "time": "09:00",
    "guests": 2,
    "guestCounts": {"adults": 2},
    "leadName": "John Doe",
    "leadEmail": "john.doe@example.com",
    "leadPhone": "+1234567890"
  }'

# Expected response:
{
  "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

### 4.3 Test Bookings API
```bash
# Replace pi_xxxxx with actual payment intent ID from success page
curl "http://localhost:3000/api/bookings/pi_xxxxx"

# Expected response:
{
  "id": "ABC123XY",
  "tourTitle": "Vatican Museums & Sistine Chapel",
  "tourSlug": "vatican-museums-sistine-chapel",
  "date": "2026-05-20",
  "time": "09:00",
  "guests": 2,
  "totalAmount": 90,
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "customerPhone": "+1234567890",
  "meetingPoint": "...",
  "status": "confirmed",
  "createdAt": "2026-05-13T10:30:45.000Z"
}
```

---

## 🐛 STEP 5: Test Error Scenarios

### 5.1 Test Declined Payment
1. Use card: 4000 0000 0000 0002
2. Verify error message appears
3. Verify user can retry
4. Verify no booking is created

### 5.2 Test Missing Required Fields
1. Try to continue without filling email
2. Verify validation error appears
3. Fill email and try again

### 5.3 Test Booking Not Found
1. Visit: http://localhost:3000/success?payment_intent=pi_invalid
2. Verify polling happens (loading spinner)
3. After 30 seconds, verify error message appears
4. Verify "Back to Home" button works

### 5.4 Test Past Date Selection
1. Try to select a past date in calendar
2. Verify it's disabled (grayed out)
3. Verify click does nothing

### 5.5 Test Sold Out Time Slot
1. If a time slot shows "Sold Out"
2. Verify it's disabled
3. Verify click does nothing

---

## 📊 STEP 6: Verify Payload CMS Integration

### 6.1 Check Booking Created
1. Login to Payload CMS: https://admin.wondersofrome.com
2. Navigate to Bookings
3. Filter by tenant: "ticketsinrome"
4. Verify your test booking appears
5. Verify all fields are correct:
   - Booking reference
   - Tour title
   - Date & time
   - Guests
   - Total amount
   - Customer details
   - Stripe payment intent ID
   - Status: "confirmed"

### 6.2 Check Inventory Decremented
1. Navigate to Inventory in Payload CMS
2. Find the slot for your booking (tour + date + time)
3. Verify `availableSlots` was decremented by the number of guests

---

## 🎨 STEP 7: Test Responsive Design

### 7.1 Desktop (1920x1080)
1. Verify BookingWidget is sticky on right sidebar
2. Verify CheckoutDrawer is centered modal
3. Verify calendar shows full month view
4. Verify all text is readable

### 7.2 Tablet (768x1024)
1. Verify BookingWidget stacks below tour content
2. Verify CheckoutDrawer is full-width modal
3. Verify calendar is responsive
4. Verify touch interactions work

### 7.3 Mobile (375x667)
1. Verify BookingWidget is full-width
2. Verify CheckoutDrawer is full-screen
3. Verify calendar is scrollable
4. Verify buttons are large enough for touch
5. Verify form inputs are easy to fill

---

## ✅ STEP 8: Final Checklist

Before deploying to production, verify:

- [ ] All API routes return correct responses
- [ ] Stripe payment processing works
- [ ] Webhook receives events correctly
- [ ] Emails are sent (customer + admin)
- [ ] Bookings are created in Payload CMS
- [ ] Inventory is decremented correctly
- [ ] Success page displays booking details
- [ ] PDF download works
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Responsive design works on all devices
- [ ] All validation works correctly
- [ ] Error handling works correctly
- [ ] Loading states are shown
- [ ] All text is readable
- [ ] All buttons are clickable
- [ ] All links work

---

## 🚀 PRODUCTION DEPLOYMENT

### 1. Configure Production Webhook
```bash
# In Stripe Dashboard → Developers → Webhooks
# Add endpoint: https://ticketsinrome.com/api/webhooks/stripe
# Select events:
#   - payment_intent.succeeded
#   - checkout.session.completed
#   - payment_intent.payment_failed
# Copy webhook secret to production .env
```

### 2. Update Environment Variables
Ensure production `.env` has:
```env
STRIPE_WEBHOOK_SECRET_ROME=whsec_PRODUCTION_SECRET_HERE
STRIPE_WEBHOOK_SECRET_TICKETSINROME=whsec_PRODUCTION_SECRET_HERE
STRIPE_WEBHOOK_SECRET_ROME_TOUR_TICKETS=whsec_PRODUCTION_SECRET_HERE
```

### 3. Deploy
```bash
npm run build
vercel --prod
# Or your deployment command
```

### 4. Test Production
1. Visit production site
2. Complete a real booking with a real card
3. Verify everything works
4. Verify emails are sent
5. Verify booking appears in Payload CMS

---

## 🐛 TROUBLESHOOTING

### Webhook Not Receiving Events
- Verify Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Verify webhook secret in `.env` matches Stripe CLI output
- Restart dev server after updating `.env`
- Check Stripe CLI terminal for errors

### Emails Not Sending
- Verify `RESEND_API_KEY` is set in `.env`
- Verify `EMAIL_FROM` is set in `.env`
- Check Resend dashboard for delivery status
- Check spam folder

### Booking Not Found on Success Page
- Wait 30 seconds (webhook might be delayed)
- Check Stripe CLI terminal for webhook events
- Check Payload CMS for booking
- Check browser console for errors
- Check server terminal for errors

### Payment Fails
- Verify Stripe keys are correct in `.env`
- Verify test card number is correct
- Check Stripe Dashboard for payment intent
- Check browser console for errors

### Calendar Not Loading
- Verify `/api/availability` returns data
- Check browser console for errors
- Verify tour slug is correct
- Verify Payload CMS has inventory data

---

## 📝 TEST CARDS REFERENCE

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0025 0000 3155 | Requires Authentication |
| 4000 0000 0000 9995 | Insufficient Funds |
| 4000 0000 0000 0069 | Expired Card |
| 4000 0000 0000 0127 | Incorrect CVC |

All test cards:
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

---

## 🎉 SUCCESS CRITERIA

Your implementation is ready for production when:

✅ Complete booking flow works end-to-end
✅ Stripe payment processing works
✅ Webhook receives and processes events
✅ Emails are sent successfully
✅ Bookings are created in Payload CMS
✅ Inventory is decremented correctly
✅ Success page displays booking details
✅ PDF download works
✅ No errors in console or server logs
✅ Responsive design works on all devices
✅ All validation and error handling works

---

**Happy Testing! 🚀**

If you encounter any issues, check the troubleshooting section or review the implementation files.
