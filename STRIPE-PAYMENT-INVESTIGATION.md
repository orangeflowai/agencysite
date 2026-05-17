# Stripe Payment Investigation - WondersOfRome 💰

**Issue**: Payments showing in admin panel but not in Stripe account  
**Date**: May 15, 2026

---

## 🔍 CURRENT CONFIGURATION

### Stripe Account Details
```
Account ID: acct_1RaC3VF3tyePq9dx (from pk_live_51RaC3V...)
Mode: LIVE (pk_live / sk_live)
Webhook Secret: whsec_QgDuJh1im7kiDGpJG2HNDIopPWwj3zkB
```

### Payment Flow
```
1. Customer pays on wondersofrome.com
2. Stripe processes payment
3. Webhook sends event to: /api/webhooks/stripe
4. Booking saved to Payload CMS
5. Emails sent to customer & admin
```

---

## 🚨 POSSIBLE ISSUES

### Issue 1: Test Mode vs Live Mode ⚠️
**Check**: Are you looking at the correct Stripe dashboard mode?

```
✅ LIVE MODE: pk_live_... / sk_live_...
❌ TEST MODE: pk_test_... / sk_test_...
```

**Action**: 
1. Go to https://dashboard.stripe.com
2. Check top-left corner - should say "LIVE" not "TEST"
3. Toggle to LIVE mode if needed

---

### Issue 2: Wrong Stripe Account 🔑
**Check**: Are you logged into the correct Stripe account?

Your keys start with `acct_1RaC3V...` - this is the account ID.

**Action**:
1. Go to https://dashboard.stripe.com/settings/account
2. Verify account email matches your expected account
3. Check if you have multiple Stripe accounts

---

### Issue 3: Webhook Not Configured ⚡
**Check**: Is the webhook endpoint registered in Stripe?

**Required Webhook Endpoint**:
```
https://wondersofrome.com/api/webhooks/stripe
```

**Action**:
1. Go to https://dashboard.stripe.com/webhooks
2. Check if endpoint exists
3. Verify it's listening to these events:
   - `payment_intent.succeeded`
   - `checkout.session.completed`
   - `payment_intent.payment_failed`

**If webhook is missing, add it**:
```
URL: https://wondersofrome.com/api/webhooks/stripe
Events: payment_intent.succeeded, checkout.session.completed
Secret: whsec_QgDuJh1im7kiDGpJG2HNDIopPWwj3zkB
```

---

### Issue 4: Payment Intent vs Checkout Session 💳
**Check**: Which payment method are you using?

Your code supports both:
- **Payment Intent** (direct card payment)
- **Checkout Session** (Stripe Checkout page)

**Action**: Check which one is being used in your booking flow.

---

### Issue 5: Payments Going to Different Account 🏦
**Check**: Could payments be going to a connected account?

**Action**:
1. Check if you're using Stripe Connect
2. Look for `stripe_account` parameter in API calls
3. Verify no `on_behalf_of` parameter is set

---

## 🔧 DEBUGGING STEPS

### Step 1: Check Stripe Dashboard
```bash
# Go to Stripe Dashboard
https://dashboard.stripe.com/payments

# Filter by:
- Date range: Last 7 days
- Status: Successful
- Search: wondersofrome
```

### Step 2: Check Webhook Logs
```bash
# Go to Webhook Logs
https://dashboard.stripe.com/webhooks

# Check:
- Recent webhook deliveries
- Any failed webhooks
- Response codes (should be 200)
```

### Step 3: Check Payment Intents
```bash
# Go to Payment Intents
https://dashboard.stripe.com/payment_intents

# Look for:
- Recent payment intents
- Metadata: should contain tourSlug, date, time
- Status: should be "succeeded"
```

### Step 4: Check Your Stripe Balance
```bash
# Go to Balance
https://dashboard.stripe.com/balance/overview

# Check:
- Available balance
- Pending balance
- Payout schedule
```

---

## 💰 WHERE IS THE MONEY?

### Stripe Payment Flow
```
Customer pays → Stripe holds funds → Payout to bank account
```

### Payout Schedule
By default, Stripe pays out:
- **Daily**: For established accounts
- **Weekly**: For new accounts
- **Manual**: If you set manual payouts

**Check your payout schedule**:
```
https://dashboard.stripe.com/settings/payouts
```

### Pending Balance
Money might be in "Pending" status:
- **Reason 1**: Waiting for payout schedule
- **Reason 2**: Account verification needed
- **Reason 3**: Dispute or hold

**Check pending balance**:
```
https://dashboard.stripe.com/balance/overview
```

---

## 🔍 INVESTIGATION COMMANDS

### Check Recent Payments in Stripe (via CLI)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# List recent payments
stripe payment_intents list --limit 10

# Search for specific payment
stripe payment_intents list --query "metadata['tourSlug']:'vatican-tour'"
```

### Check Webhook Events
```bash
# List recent webhook events
stripe events list --limit 10 --type payment_intent.succeeded

# Get specific event
stripe events retrieve evt_xxxxx
```

### Check Payouts
```bash
# List recent payouts
stripe payouts list --limit 10

# Check payout status
stripe payouts retrieve po_xxxxx
```

---

## 📊 ADMIN PANEL vs STRIPE

### Why Admin Panel Shows Bookings But Stripe Doesn't Show Payments

**Scenario 1**: Test Mode Payments
- Admin panel saves ALL bookings (test + live)
- You're looking at TEST payments in admin
- But checking LIVE Stripe dashboard

**Scenario 2**: Webhook Fired But Payment Failed
- Webhook creates booking in admin
- But payment actually failed in Stripe
- Check `payment_intent.payment_failed` events

**Scenario 3**: Different Stripe Account
- Payments going to different Stripe account
- Admin panel connected to Account A
- You're checking Account B dashboard

---

## ✅ VERIFICATION CHECKLIST

### Stripe Dashboard
- [ ] Logged into correct Stripe account
- [ ] Viewing LIVE mode (not TEST mode)
- [ ] Check Payments tab for recent transactions
- [ ] Check Balance for available/pending funds
- [ ] Check Payouts for scheduled transfers

### Webhook Configuration
- [ ] Webhook endpoint exists: `https://wondersofrome.com/api/webhooks/stripe`
- [ ] Webhook secret matches: `whsec_QgDuJh1im7kiDGpJG2HNDIopPWwj3zkB`
- [ ] Webhook events enabled: `payment_intent.succeeded`, `checkout.session.completed`
- [ ] Recent webhook deliveries show 200 status

### Environment Variables
- [ ] `STRIPE_SECRET_KEY_WONDERSOFROME` = `sk_live_51RaC3V...` ✅
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERSOFROME` = `pk_live_51RaC3V...` ✅
- [ ] `STRIPE_WEBHOOK_SECRET_WONDERSOFROME` = `whsec_QgDuJh1im7kiDGpJG2HNDIopPWwj3zkB` ✅

### Payment Flow
- [ ] Customer completes checkout
- [ ] Stripe processes payment
- [ ] Webhook fires successfully (check logs)
- [ ] Booking appears in admin panel
- [ ] Payment appears in Stripe dashboard
- [ ] Funds appear in Stripe balance

---

## 🛠️ QUICK FIXES

### Fix 1: Verify Webhook Endpoint
```bash
# SSH into server
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197

# Test webhook endpoint
curl -X POST https://wondersofrome.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"ping"}'

# Should return: {"received":true}
```

### Fix 2: Check Stripe Logs on Server
```bash
# Check PM2 logs for webhook events
pm2 logs wondersofrome --lines 100 | grep webhook

# Look for:
# - "[webhook] Event received: payment_intent.succeeded"
# - "[webhook] Customer email sent"
# - "[webhook] Admin email sent"
```

### Fix 3: Test Payment Flow
```bash
# Use Stripe test card
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits

# Complete a test booking
# Check if it appears in Stripe TEST dashboard
```

---

## 📞 NEXT STEPS

1. **Check Stripe Dashboard Mode**
   - Go to https://dashboard.stripe.com
   - Ensure you're in LIVE mode (top-left corner)

2. **Verify Account**
   - Go to https://dashboard.stripe.com/settings/account
   - Confirm this is your account

3. **Check Recent Payments**
   - Go to https://dashboard.stripe.com/payments
   - Filter by last 7 days
   - Look for wondersofrome transactions

4. **Check Balance**
   - Go to https://dashboard.stripe.com/balance/overview
   - Check available + pending balance

5. **Check Payouts**
   - Go to https://dashboard.stripe.com/payouts
   - Verify payout schedule
   - Check recent payouts to your bank

6. **Check Webhook Logs**
   - Go to https://dashboard.stripe.com/webhooks
   - Click on your webhook endpoint
   - Check recent deliveries

---

## 🎯 MOST LIKELY ISSUE

Based on the configuration, the most likely issues are:

1. **You're viewing TEST mode instead of LIVE mode** (90% probability)
2. **Payments are pending payout** (5% probability)
3. **Wrong Stripe account** (3% probability)
4. **Webhook not configured** (2% probability)

**First Action**: Go to Stripe dashboard and toggle to LIVE mode!

---

## 📧 CONTACT STRIPE SUPPORT

If payments are still missing after checking above:

1. Go to https://support.stripe.com
2. Click "Contact Support"
3. Provide:
   - Account ID: `acct_1RaC3VF3tyePq9dx`
   - Date range of missing payments
   - Example payment intent ID (from admin panel)
   - Webhook endpoint URL

---

**Let me know what you find in the Stripe dashboard!** 💰
