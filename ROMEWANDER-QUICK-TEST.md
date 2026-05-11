# 🚀 Rome Wander - Quick Test Guide

## Start Server
```bash
cd /home/abiilesh/travelwebsite/romewander
npm run dev
```

## Test URLs

### Homepage
```
http://localhost:3000
```
**Expected:** 5 Vatican tours displayed

### Tour Detail Pages
```
http://localhost:3000/tour/vatican-museums-sistine-chapel-skip-line
http://localhost:3000/tour/early-morning-vatican-tour
http://localhost:3000/tour/vatican-st-peters-basilica-complete
http://localhost:3000/tour/vatican-gardens-private-tour
http://localhost:3000/tour/st-peters-dome-climb-crypt
```
**Expected:** Full tour details, booking widget, "Book Now" button

### Sanity Studio
```
http://localhost:3000/studio
```
**Expected:** Can view/edit all 5 tours

## Test Booking Flow

1. **Go to any tour page**
2. **Select date** (any future date)
3. **Select guests** (e.g., 2 adults)
4. **Click "Book Now"**
5. **Fill contact form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
6. **Enter test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`
7. **Click "Pay Now"**
8. **✅ Should see success message**

## Quick Checks

- [ ] Homepage shows 5 tours
- [ ] All tour detail pages load
- [ ] Booking widget appears
- [ ] Checkout modal opens
- [ ] Stripe payment form loads
- [ ] Test payment succeeds
- [ ] Sanity Studio accessible

## If Something Doesn't Work

**Re-add tours:**
```bash
cd /home/abiilesh/travelwebsite
node add-vatican-tours-romewander.js
```

**Verify setup:**
```bash
node verify-romewander-complete.js
```

**Check logs:**
```bash
# In the terminal where npm run dev is running
# Look for errors
```

## 🎉 Success Criteria

✅ All 5 tours visible on homepage  
✅ All tour detail pages load without 404  
✅ Booking widget functional  
✅ Payment flow completes  
✅ Sanity Studio accessible  

**If all checks pass → Rome Wander is working perfectly!**
