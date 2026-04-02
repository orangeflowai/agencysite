# Stripe Webhook Diagnosis & Solution

## 🔍 Problem Identified

You received the Stripe payment receipt but not the booking confirmation email. This means:

✅ **Payment Processing**: Working (Stripe charged successfully)
✅ **Email System**: Working (confirmed via direct API test)
❌ **Stripe Webhook**: Not triggering the confirmation email

## 🛠️ Solution Steps

### Step 1: Verify Stripe Webhook Configuration

1. **Go to Stripe Dashboard**:
   - Login to https://dashboard.stripe.com
   - Navigate to **Developers** → **Webhooks**

2. **Check Webhook Endpoint**:
   - Should be: `https://ticketsinrome.com/api/webhooks/stripe`
   - Status should be: **Active**

3. **Verify Events**:
   - Should listen for: `payment_intent.succeeded` and `checkout.session.completed`

### Step 2: Check Webhook Secret

The webhook secret in your `.env` file should match the one in Stripe dashboard:
```
STRIPE_WEBHOOK_SECRET_ROME=whsec_aBF43dJtxyQKRPKCNu2SrEYwL7vUMSRk
```

### Step 3: Test Webhook Manually

You can test the webhook from Stripe dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select `payment_intent.succeeded` event
5. Click **Send test webhook**

### Step 4: Check Webhook Logs

In Stripe dashboard:
1. Go to your webhook endpoint
2. Check the **Recent deliveries** tab
3. Look for any failed attempts or error messages

## 🚨 Quick Fix Options

### Option A: Manual Email Sending

If you need to send the confirmation email for your recent booking immediately:

1. **Get your booking details** (tour name, date, guest count, etc.)
2. **Run this command** with your details:

```bash
node check-recent-booking.js
```

This will send the confirmation email to your verified address.

### Option B: Webhook Debugging

1. **Check if webhook is being called**:
   - Look in Stripe dashboard for webhook delivery attempts
   - Check server logs for webhook requests

2. **Common Issues**:
   - Wrong webhook URL
   - Incorrect webhook secret
   - Server not responding to webhook calls
   - Webhook events not configured

## 📧 Email System Status

✅ **Confirmed Working**:
- Resend API integration
- Email templates with logos and maps
- Direct booking API email sending
- Professional email formatting

❌ **Issue**:
- Stripe webhook not triggering emails after payment

## 🔧 Immediate Action Required

1. **Check Stripe Dashboard** for webhook configuration
2. **Verify webhook secret** matches your environment
3. **Test webhook manually** from Stripe dashboard
4. **Check webhook delivery logs** for errors

## 📞 Support

If you need immediate assistance:
1. Check your Stripe webhook configuration
2. Look for webhook delivery failures in Stripe dashboard
3. Verify the webhook endpoint is accessible: `https://ticketsinrome.com/api/webhooks/stripe`

The email system is fully functional - we just need to ensure Stripe is calling the webhook correctly after payments.