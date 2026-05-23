# GoldenRomeTour - Final Setup Instructions for Client

## ✅ What's Been Done

Your GoldenRomeTour website has been updated to feature **ONLY 2 Vatican tours**:

1. **Vatican Museums & Sistine Chapel Skip-the-Line Tour** (€64, 3 hours)
2. **Vatican Museums & Sistine Chapel Guided Tour** (€85, 2 hours)

### Website Changes:
- ✅ Homepage redesigned with premium 2-column layout for your 2 tours
- ✅ Removed Colosseum tour sections (Vatican-only focus)
- ✅ Enhanced tour cards with better images and "Book Now" buttons
- ✅ All changes follow professional design standards
- ✅ Code committed to GitHub and ready to deploy

---

## ⚠️ IMPORTANT: One Manual Step Required

You need to **delete 30 unwanted tours** from your Sanity CMS. The website code is ready, but Sanity still has all 32 tours.

### Why Manual?
The API token in your `.env` file doesn't have write permissions, so tours must be deleted through the Sanity Studio interface.

---

## 🎯 Step-by-Step: Delete Tours from Sanity

### Step 1: Login to Sanity Studio
1. Open your browser
2. Go to: **https://goldenrometour.sanity.studio/**
3. Login with your Sanity credentials

### Step 2: Navigate to Tours
1. Look for **"Tours"** in the left sidebar
2. Click on it to see all 32 tours

### Step 3: Keep ONLY These 2 Tours
✅ **KEEP**: "Vatican Museums & Sistine Chapel Skip-the-Line Tour"
✅ **KEEP**: "Vatican Museums & Sistine Chapel Guided Tour"

### Step 4: Delete All Other Tours (30 tours)
For each tour you want to delete:
1. Click on the tour to open it
2. Look for the **"Delete"** button (usually in the top right or bottom)
3. Confirm deletion
4. Repeat for all 30 unwanted tours

### Step 5: Verify
After deletion, you should see **ONLY 2 tours** in the list.

---

## 📋 List of Tours to DELETE

Here are all 30 tours you need to delete (delete everything EXCEPT the 2 marked "KEEP"):

1. ❌ Colosseum Underground & Arena Floor VIP Tour
2. ❌ DEBUG Test 1 - Minimal Exclusive VIP Experience
3. ❌ Fast-Track Combo Vatican Museum & Rome Sightseeing
4. ❌ St. Peter's Basilica Dome Climb & Crypt Art History
5. ❌ St. Peter's Basilica Dome Climb & Crypt Exclusive VIP
6. ❌ St. Peter's Basilica Dome Climb & Crypt Exclusive VIP (duplicate)
7. ❌ St. Peter's Basilica Dome Climb & Crypt Skip-the-Line
8. ❌ St.Peter's Basilica & Dome & Papal Tomb with Private Guide
9. ❌ St.Peter's Basilica Skip-the-Line Ticket Only
10. ❌ St.Peter's Basilica: Guided Tour, Underground Tomb & Dome
11. ❌ Status Test: draft
12. ❌ Status Test: null
13. ❌ Vatican & Castel Sant'Angelo Combo Tour
14. ❌ Vatican Evening Tour
15. ❌ Vatican Gardens Open Bus Experience
16. ❌ Vatican Gardens Private Walking Tour Art History
17. ❌ Vatican Gardens Private Walking Tour
18. ❌ Vatican Gardens Private Walking Tour (duplicate)
19. ❌ Vatican Gardens Private Walking Tour Skip-the-Line
20. ❌ Vatican Gardens VIP Guided Tour
21. ✅ **KEEP**: Vatican Museums & Sistine Chapel Guided Tour
22. ✅ **KEEP**: Vatican Museums & Sistine Chapel Skip-the-Line Tour
23. ❌ Vatican Museums & Sistine Chapel Skip-the-Line Tour (different one)
24. ❌ Vatican Museums (Early Morning)
25. ❌ Vatican Museums Skip-the-Line + Audio Guide Art History
26. ❌ Vatican Museums Skip-the-Line + Audio Guide
27. ❌ Vatican Museums Skip-the-Line + Audio Guide (duplicate)
28. ❌ Vatican Museums Skip-the-Line + Audio Guide Skip-the-Line
29. ❌ Vatican Museums and Sistine Chapel Skip-the-Line Ticket
30. ❌ Vatican Museums — Before the Crowds
31. ❌ Vatican Museums, Sistine Chapel & St. Peter's Complete Tour
32. ❌ Vatican Museums, Sistine Chapel & St. Peter's Basilica Tour

**Total to delete: 30 tours**
**Total to keep: 2 tours**

---

## 🧪 Testing After Deletion

### 1. Test Locally (Optional)
If you have the code locally:
```bash
cd goldenrometour
npm run dev
```
Visit: http://localhost:3000

You should see **ONLY 2 tours** on the homepage.

### 2. Rebuild for Production
```bash
cd goldenrometour
npm run build
```

This will generate pages for only 2 tours (instead of 32).

### 3. Deploy to Production
Follow your normal deployment process, or see `DEPLOYMENT-INSTRUCTIONS.md`

---

## 📊 What You'll See After Cleanup

### Homepage:
- Beautiful hero section with Vatican imagery
- Section showcasing Vatican Museums
- **2 premium tour cards** side-by-side:
  - Skip-the-Line Tour (€64, 3 hours) - For independent exploration
  - Guided Tour (€85, 2 hours) - With expert guide
- Each tour has a "Book Now" button
- Clean, focused design

### Tour Pages:
- Only 2 tour detail pages:
  - `/tour/vatican-museums-sistine-chapel-skip-the-line-premium`
  - `/tour/vatican-museums-and-sistine-chapel-guided-tour-premium`

### Benefits:
- ✅ Faster website (fewer pages to load)
- ✅ Clearer offering (no confusion with 32 tours)
- ✅ Better conversion (focused choice between 2 options)
- ✅ Easier to manage (only 2 tours to update)

---

## 🆘 Need Help?

### Sanity Studio Access:
- URL: https://goldenrometour.sanity.studio/
- Project ID: `gycprksj`
- Dataset: `production`

### If You Can't Access Sanity:
Contact your Sanity administrator or the person who set up your Sanity account.

### If You Need a Different Approach:
If you can provide a valid Sanity write token (with delete permissions), we can create an automated script to delete the tours.

---

## 📝 Summary

**What's Done:**
- ✅ Website code updated for 2-tour display
- ✅ Premium design with 2-column layout
- ✅ All changes committed to GitHub
- ✅ Build successful, no errors

**What You Need to Do:**
- ⏳ Delete 30 tours from Sanity Studio (see instructions above)
- ⏳ Test the website locally (optional)
- ⏳ Deploy to production

**Expected Time:**
- Deleting tours: 10-15 minutes
- Testing: 5 minutes
- Deployment: 5-10 minutes

**Total: ~30 minutes**

---

## 🎉 After Completion

Once you've deleted the 30 tours from Sanity:

1. Your website will automatically show only 2 tours
2. Customers will have a clear choice: Skip-the-Line or Guided
3. Your booking process will be simpler and more focused
4. You'll have a premium, professional Vatican tour website

---

**Questions?** Contact your developer or refer to the detailed guides:
- `GOLDENROME-2-TOURS-GUIDE.md` - Technical implementation details
- `GOLDENROME-SIMPLIFICATION-COMPLETE.md` - Complete change summary

**Last Updated**: May 23, 2026
