# 🚀 Quick Start Guide - Rome Wander & Golden Rome Tour

**Last Updated:** May 10, 2026

---

## ✅ Current Status

| Site | Status | Dev Server | Tours |
|------|--------|------------|-------|
| **Rome Wander** | 🟢 Running | http://localhost:3001 | 23 Vatican |
| **Golden Rome Tour** | 🟢 Ready | Not started | 81 All categories |

---

## 🎯 Test Rome Wander (Already Running)

### 1. Open Browser
```
http://localhost:3001
```

### 2. What to Check
- ✅ Homepage shows 23 Vatican tours
- ✅ No "Site not found" errors
- ✅ Tour cards have images, prices, durations
- ✅ Click any tour → detail page loads
- ✅ BookingWidget visible on tour page
- ✅ "Book Now" button works

### 3. Test Booking Flow
1. Click "Book Now" on any tour
2. Select a date
3. Select number of guests
4. Click "Continue to Checkout"
5. CheckoutDrawer modal opens (centered popup)
6. Fill in contact details
7. Use Stripe test card: `4242 4242 4242 4242`
8. Complete payment
9. See confirmation

---

## 🎯 Test Golden Rome Tour

### 1. Start Dev Server
```bash
cd /home/abiilesh/travelwebsite/goldenrometour
npm run dev
```

### 2. Open Browser
```
http://localhost:3000
(or whatever port it shows)
```

### 3. What to Check
- ✅ Homepage shows tours from all categories
- ✅ No "Site not found" errors
- ✅ Test category pages:
  - http://localhost:3000/category/vatican (23 tours)
  - http://localhost:3000/category/city (30 tours)
  - http://localhost:3000/category/colosseum (11 tours)
  - http://localhost:3000/category/hidden-gems (13 tours)
- ✅ Click any tour → detail page loads
- ✅ BookingWidget visible
- ✅ Test booking flow (same as Rome Wander)

---

## 🔧 If Something Goes Wrong

### "Site not found" Error

**Rome Wander:**
```bash
node /home/abiilesh/travelwebsite/fix-romewander-complete.js
```

**Golden Rome Tour:**
```bash
node /home/abiilesh/travelwebsite/fix-goldenrometour-complete.js
```

### Dev Server Won't Start
```bash
# For Rome Wander
cd /home/abiilesh/travelwebsite/romewander
rm -rf .next
npm run dev

# For Golden Rome Tour
cd /home/abiilesh/travelwebsite/goldenrometour
rm -rf .next
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3002
```

### No Tours Showing

**Verify data:**
```bash
# Rome Wander
node /home/abiilesh/travelwebsite/test-romewander-data.js

# Golden Rome Tour (create similar test script if needed)
```

---

## 📊 Quick Reference

### Rome Wander
- **Site ID:** romewander
- **Tours:** 23 Vatican tours
- **Categories:** Vatican only
- **Dev Server:** http://localhost:3001 ✅ Running
- **Sanity Site ID:** site-romewander

### Golden Rome Tour
- **Site ID:** goldenrometour
- **Tours:** 81 tours (all categories)
- **Categories:** Vatican, City, Colosseum, Hidden Gems
- **Dev Server:** Not started yet
- **Sanity Site ID:** rWUPi3J8uIVCSx8nbaGxkF

### Shared Configuration
- **Sanity Project:** aknmkkwd
- **Dataset:** production
- **Studio:** https://aknmkkwd.sanity.studio
- **Account:** abiileshlive@gmail.com

---

## 🎫 Stripe Test Cards

### Successful Payment
```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Declined Payment (for testing)
```
Card: 4000 0000 0000 0002
```

### 3D Secure Required (for testing)
```
Card: 4000 0027 6000 3184
```

---

## 📝 What to Test

### Essential Tests
- [ ] Homepage loads
- [ ] Tours display correctly
- [ ] Tour detail pages work
- [ ] Images load (or show placeholders)
- [ ] Prices display correctly
- [ ] Booking widget appears
- [ ] Date selection works
- [ ] Guest selection works
- [ ] Checkout modal opens
- [ ] Stripe form loads
- [ ] Test payment succeeds

### Category Tests (Golden Rome Tour only)
- [ ] Vatican category page
- [ ] City category page
- [ ] Colosseum category page
- [ ] Hidden Gems category page

### Edge Cases
- [ ] Invalid tour slug → 404 page
- [ ] Invalid category → empty or 404
- [ ] Mobile responsive design
- [ ] Slow network (throttle in DevTools)

---

## 🚨 Known Issues (Not Blockers)

### 1. Placeholder Stripe Keys
Both sites have placeholder Stripe keys. Payments won't work in production until real keys are added.

**Location:**
- `/home/abiilesh/travelwebsite/romewander/.env`
- `/home/abiilesh/travelwebsite/goldenrometour/.env`

### 2. Some Tour Images Missing
Some tours may have Unsplash placeholder images that return 404.

**Fix:** Upload real images in Sanity Studio

### 3. Placeholder Contact Info
Some contact fields have "REPLACE_WITH..." placeholders.

**Fix:** Update `.env` files with real contact information

---

## 📚 Documentation

### Detailed Guides
- **BOTH-SITES-COMPLETE.md** - Complete overview of both sites
- **ROMEWANDER-SUCCESS-SUMMARY.md** - Rome Wander detailed status
- **ROMEWANDER-FIXED-READY.md** - Rome Wander fix documentation

### Scripts
- **fix-romewander-complete.js** - Fix Rome Wander site
- **fix-goldenrometour-complete.js** - Fix Golden Rome Tour site
- **test-romewander-data.js** - Verify Rome Wander data

---

## 🎉 Success!

You now have:
- ✅ Rome Wander with 23 Vatican tours
- ✅ Golden Rome Tour with 81 tours across all categories
- ✅ Both using Sanity CMS (zero backend maintenance)
- ✅ Clean data architecture
- ✅ Easy to manage via Sanity Studio
- ✅ No more Payload CMS issues!

---

## 🚀 Next Actions

1. **Test Rome Wander:** Open http://localhost:3001
2. **Start Golden Rome Tour:** `cd goldenrometour && npm run dev`
3. **Test booking flow** on both sites
4. **Add real Stripe keys** before production
5. **Upload tour images** in Sanity Studio
6. **Update contact info** in `.env` files

---

**Everything is ready to test!** 🎊
