# 🔧 Golden Rome Tour - Stripe Setup Guide

## 🚨 Current Issue

**Error:** 500 when clicking "Book Now"  
**Cause:** Stripe keys are set to placeholder values

## 📋 Solution

You need to add real Stripe API keys to the `.env` file.

---

## 🔑 Option 1: Use Test Keys (Development/Testing)

### Step 1: Get Stripe Test Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Update `.env` File
Replace the placeholder values in `goldenrometour/.env`:

```env
# Replace these lines:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR=pk_test_YOUR_ACTUAL_TEST_KEY_HERE
STRIPE_SECRET_KEY_GOLDENROMETOUR=sk_test_YOUR_ACTUAL_TEST_SECRET_HERE
```

### Step 3: Restart Development Server
```bash
cd goldenrometour
npm run dev
```

### Step 4: Test Booking
- Click "Book Now"
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

---

## 🔑 Option 2: Use Live Keys (Production)

### Step 1: Get Stripe Live Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_live_`)
3. Copy your **Secret key** (starts with `sk_live_`)

### Step 2: Update `.env` File
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR=pk_live_YOUR_ACTUAL_LIVE_KEY_HERE
STRIPE_SECRET_KEY_GOLDENROMETOUR=sk_live_YOUR_ACTUAL_LIVE_SECRET_HERE
```

### Step 3: Setup Webhook (Required for Production)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://goldenrometour.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret (starts with `whsec_`)
6. Add to `.env`:
```env
STRIPE_WEBHOOK_SECRET_GOLDENROMETOUR=whsec_YOUR_WEBHOOK_SECRET_HERE
```

---

## 🔑 Option 3: Use Fallback Generic Keys (Quick Fix)

If you don't have site-specific keys, you can use generic Stripe keys:

```env
# Add these as fallback (without _GOLDENROMETOUR suffix)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

The system will automatically fall back to these if site-specific keys aren't found.

---

## 🧪 Testing the Fix

### 1. Check Stripe Connection
```bash
# In goldenrometour directory
npm run dev
```

### 2. Test Booking Flow
1. Visit http://localhost:3000
2. Click on any Vatican tour
3. Select date and time
4. Click "Book Now"
5. Fill in contact details
6. Should see Stripe payment form (no 500 error)

### 3. Test Payment (Test Mode)
Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

---

## 🔍 Troubleshooting

### Error: "Stripe secret key not configured"
- Check that keys are in `.env` file
- Restart dev server after changing `.env`
- Verify no typos in key names

### Error: "Invalid API Key"
- Keys must start with `pk_test_` or `pk_live_` (publishable)
- Keys must start with `sk_test_` or `sk_live_` (secret)
- Copy keys directly from Stripe dashboard

### Payment succeeds but booking not saved
- Check webhook configuration
- Verify webhook secret is correct
- Check server logs for webhook errors

---

## 📚 Additional Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

## ✅ Quick Start (Development)

```bash
# 1. Get test keys from Stripe
# Visit: https://dashboard.stripe.com/test/apikeys

# 2. Update .env file
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR=pk_test_...
STRIPE_SECRET_KEY_GOLDENROMETOUR=sk_test_...

# 3. Restart server
cd goldenrometour
npm run dev

# 4. Test booking with card: 4242 4242 4242 4242
```

---

## 🚀 Production Checklist

- [ ] Live Stripe keys added to `.env`
- [ ] Webhook endpoint created
- [ ] Webhook secret added to `.env`
- [ ] Test booking flow end-to-end
- [ ] Verify webhook receives events
- [ ] Check booking confirmation emails
- [ ] Test payment success/failure scenarios

---

**Need Help?** Check the Stripe dashboard for detailed error logs and webhook delivery status.
