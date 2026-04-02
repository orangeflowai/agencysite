# 📧 Resend Domain Setup Guide
## Using Your Existing Email: info@ticketsinrome.com

## ✅ **What I Changed:**

Updated all email sender addresses to use your existing email:
- **Customer emails**: `Tickets in Rome <info@ticketsinrome.com>`
- **Admin alerts**: `Tickets in Rome Alerts <info@ticketsinrome.com>`
- **Wonders of Rome**: `Wonders of Rome <info@wondersofrome.com>`

## 🚀 **Setup Steps:**

### Step 1: Verify Domain in Resend

1. **Go to Resend Dashboard**
   - Visit: https://resend.com/domains
   - Login with your Resend account

2. **Add Domain**
   - Click **"Add Domain"**
   - Enter: `ticketsinrome.com`
   - Click **"Add"**

3. **Get DNS Records**
   Resend will show you DNS records like:
   ```
   Type: TXT
   Name: _resend
   Value: resend_verify_abc123xyz...
   
   Type: MX
   Name: @
   Value: mx.resend.com
   Priority: 10
   
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; ...
   ```

### Step 2: Add DNS Records to Hostinger

1. **Login to Hostinger**
   - Go to: https://hpanel.hostinger.com
   - Navigate to **Domains** → **ticketsinrome.com** → **DNS / Name Servers**

2. **Add Each DNS Record**
   
   **Record 1: Verification TXT**
   - Type: `TXT`
   - Name: `_resend` (or `_resend.ticketsinrome.com`)
   - Value: `resend_verify_...` (copy from Resend)
   - TTL: `3600`
   
   **Record 2: SPF TXT**
   - Type: `TXT`
   - Name: `@` (or leave blank)
   - Value: `v=spf1 include:_spf.resend.com ~all`
   - TTL: `3600`
   
   **Record 3: DKIM TXT**
   - Type: `TXT`
   - Name: `resend._domainkey` (copy from Resend)
   - Value: `v=DKIM1; k=rsa; p=...` (copy from Resend)
   - TTL: `3600`
   
   **Record 4: DMARC TXT**
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:info@ticketsinrome.com`
   - TTL: `3600`

3. **Save Changes**
   - Click **"Save"** or **"Add Record"** for each

### Step 3: Wait for Verification

- DNS propagation takes **5-60 minutes**
- Go back to Resend Dashboard
- Click **"Verify"** next to your domain
- Status should change to **"Verified" ✅**

### Step 4: Repeat for Wonders of Rome (if needed)

If you have a separate domain:
1. Add `wondersofrome.com` in Resend
2. Add DNS records to Hostinger
3. Verify domain

## 🧪 **Test Your Setup:**

### Test 1: Send Test Email from Resend
```bash
# In Resend Dashboard → API Keys → Test
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "Tickets in Rome <info@ticketsinrome.com>",
    "to": "abiileshofficial@gmail.com",
    "subject": "Test Email",
    "html": "<p>This is a test!</p>"
  }'
```

### Test 2: Test from Your Website
```bash
# Run the test script
node test-email-booking.js
```

Expected result:
```
✅ Email sent successfully
📧 Check abiileshofficial@gmail.com
```

## ⚠️ **Important Notes:**

### **About Your Existing Email Setup:**

You mentioned `info@ticketsinrome.com` is configured with Hetzner/Hostinger. Here's what happens:

**Option A: Keep Both (RECOMMENDED)**
- **Hetzner/Hostinger**: For receiving emails (inbox)
- **Resend**: For sending automated emails (confirmations)
- ✅ You can still receive emails at `info@ticketsinrome.com`
- ✅ Automated emails sent via Resend
- ✅ Best of both worlds

**Option B: Resend Only**
- **Resend**: For both sending and receiving
- ⚠️ Need to set up email forwarding in Resend
- ⚠️ More complex setup

**My Recommendation:** Use Option A (keep both)

### **DNS Record Conflicts:**

If you already have MX records for Hetzner/Hostinger:
- ✅ **Keep your existing MX records** (for receiving emails)
- ✅ **Add Resend's TXT records** (for sending emails)
- ❌ **Don't add Resend's MX records** (unless you want Resend to handle receiving too)

### **SPF Record Conflict:**

If you already have an SPF record:
```
Current: v=spf1 include:_spf.hostinger.com ~all
```

Update it to include both:
```
New: v=spf1 include:_spf.hostinger.com include:_spf.resend.com ~all
```

## 📊 **Verification Checklist:**

After setup, verify:
- [ ] Domain shows "Verified" in Resend Dashboard
- [ ] Test email sends successfully
- [ ] Email arrives in inbox (not spam)
- [ ] You can still receive emails at info@ticketsinrome.com
- [ ] Booking confirmation emails work

## 🔧 **Deploy Updated Code:**

After domain is verified:

```bash
# Deploy to server
rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  ticketsinrome-live/rome-tour-tickets/src/app/api/ \
  root@91.98.205.197:/var/www/rome-tour-tickets/src/app/api/

# Rebuild and restart
ssh root@91.98.205.197 "cd /var/www/rome-tour-tickets && npm run build && pm2 restart rome-tour-tickets"
```

## 🎯 **Summary:**

**What you need to do:**
1. ✅ Add domain to Resend
2. ✅ Add DNS records to Hostinger
3. ✅ Wait for verification
4. ✅ Deploy updated code
5. ✅ Test email sending

**Benefits:**
- ✅ Professional sender address (info@)
- ✅ Better deliverability
- ✅ Can reply to customer emails
- ✅ Keep existing email setup

**Time needed:** 15-30 minutes (mostly waiting for DNS)