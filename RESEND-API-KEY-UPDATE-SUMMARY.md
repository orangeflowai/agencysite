# 🔑 Resend API Key Update - Wonders of Rome

## ✅ What Was Done:

### Updated Resend API Key:
- **Old Key**: `re_GtXjh56Y_5m8EnUQyA8T5mGA3m8epSVyS`
- **New Key**: `re_4uGgRC4b_MhURchUq42q3NyMcQw7GcJ2J`

### Files Updated:
1. ✅ `wondersofrome/wondersofrome/.env`
2. ✅ `wondersofrome/wondersofrome/.next/standalone/.env`

## 🚀 Deployment Options:

### Option 1: Automatic Deployment (Recommended)
```bash
./deploy-wondersofrome-resend-update.sh
```

This will:
- Upload updated .env file to server
- Restart the application
- Show status

### Option 2: Manual Deployment
```bash
# 1. Upload .env file
scp wondersofrome/wondersofrome/.env root@91.98.205.197:/var/www/wondersofrome/.env

# 2. Restart application
ssh root@91.98.205.197
cd /var/www/wondersofrome
/root/.nvm/versions/node/v18.17.0/bin/pm2 restart wondersofrome
```

## 🧪 Testing:

### Test 1: Check API Key is Loaded
```bash
ssh root@91.98.205.197 "grep RESEND_API_KEY /var/www/wondersofrome/.env"
```

Expected output:
```
RESEND_API_KEY=re_4uGgRC4b_MhURchUq42q3NyMcQw7GcJ2J
```

### Test 2: Send Test Email
```bash
curl -X POST https://wondersofrome.com/api/book \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "abiileshofficial@gmail.com",
    "phone": "+1234567890",
    "tourTitle": "Test Tour",
    "tourSlug": "test-tour",
    "date": "2026-03-15",
    "time": "10:00 AM",
    "guests": 1,
    "adults": 1,
    "students": 0,
    "youths": 0,
    "price": "50.00",
    "addOns": []
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Booking confirmed",
  "emailSent": true,
  "emailError": null
}
```

### Test 3: Check Resend Dashboard
1. Go to https://resend.com/emails
2. Look for recent emails sent
3. Verify they're using the new API key

## 📊 Verification Checklist:

After deployment:
- [ ] .env file updated on server
- [ ] Application restarted successfully
- [ ] Test email sends successfully
- [ ] Email arrives in inbox
- [ ] Resend dashboard shows activity
- [ ] No errors in PM2 logs

## ⚠️ Important Notes:

### About the New API Key:
- This is a **different Resend account** or **new API key**
- Make sure this key has proper permissions
- Verify domain is configured in this Resend account

### Domain Configuration:
The new API key needs to have:
- ✅ `wondersofrome.com` domain verified
- ✅ DNS records configured
- ✅ Sender email: `info@wondersofrome.com`

If domain is not verified yet:
1. Go to Resend Dashboard with new API key
2. Add `wondersofrome.com` domain
3. Configure DNS records (see RESEND-DOMAIN-SETUP-GUIDE.md)

## 🔄 Rollback (if needed):

If something goes wrong, rollback to old key:
```bash
# On server
ssh root@91.98.205.197
cd /var/www/wondersofrome
nano .env
# Change RESEND_API_KEY back to: re_GtXjh56Y_5m8EnUQyA8T5mGA3m8epSVyS
pm2 restart wondersofrome
```

## 📞 Support:

If you encounter issues:
1. Check PM2 logs: `pm2 logs wondersofrome`
2. Check Resend dashboard for errors
3. Verify API key is valid
4. Ensure domain is verified in Resend

## 🎯 Next Steps:

1. **Deploy the update** (run deployment script)
2. **Test email sending** (use test command)
3. **Verify in Resend dashboard**
4. **Update ticketsinrome.com** with same key (if needed)

---

**Status**: ✅ Ready to deploy
**Estimated Time**: 5 minutes
**Risk Level**: Low (can rollback easily)