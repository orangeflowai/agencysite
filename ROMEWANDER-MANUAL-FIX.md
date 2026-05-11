# 🔧 Rome Wander - Manual Fix Guide

## Problem
- Cannot delete tours (database error)
- Cannot update tours via API (permission error)
- Need to show only Vatican tours

## ✅ Solution: Archive Non-Vatican Tours

Instead of deleting (which causes errors), we'll **archive** them. Archived tours won't show on the website.

---

## 📋 Step-by-Step Instructions

### **Step 1: Set Vatican Tours to Live**

1. Go to https://admin.wondersofrome.com/admin
2. Log in
3. Click **Collections** → **Tours**
4. In the filters (top right):
   - Set `tenant` = `romewander`
   - Set `category` = `vatican`
5. You should see 25 Vatican tours

**For each Vatican tour:**
1. Click on the tour title
2. In the right sidebar, find **Status** dropdown
3. Change from `Draft` to **`Live`**
4. Check the **Active** checkbox ✓
5. Click **Save** (top right)
6. Repeat for all 25 Vatican tours

---

### **Step 2: Archive Non-Vatican Tours**

1. Still in Collections → Tours
2. Change filter:
   - `tenant` = `romewander`
   - `category` = `city`
3. You should see 24 city tours

**For each city tour:**
1. Click on the tour
2. Change **Status** to **`Archived`**
3. **Uncheck** the Active checkbox
4. Click **Save**

**Repeat for other categories:**
- `category` = `colosseum` (10 tours)
- `category` = `hidden-gems` (13 tours)
- `category` = `special` (1 tour)

---

## 🎯 Quick Reference

### Tours to Set LIVE (Vatican - 25 tours):
```
Status: Live ✓
Active: Checked ✓
Category: vatican
```

### Tours to ARCHIVE (Non-Vatican - 48 tours):
```
Status: Archived
Active: Unchecked
Category: city, colosseum, hidden-gems, special
```

---

## ⚡ Faster Method (If Available)

If Payload supports bulk editing:

1. **Select multiple tours** (checkboxes)
2. Click **Bulk Actions**
3. Choose **Update Status** → `Archived`
4. Apply to all selected

---

## 🔍 Verification

After completing:

1. Go to Collections → Tours
2. Filter: `tenant=romewander`, `status=live`
3. Should see **only 25 Vatican tours**

4. Visit https://romewander.com
5. Wait 1 hour for cache OR redeploy on Vercel
6. Should see only Vatican tours on homepage

---

## ❌ Why Deleting Fails

**Database Error Causes:**
1. **Foreign key constraints** - Tours referenced by:
   - Bookings
   - Inventory/slots
   - Related tours
   - Order history

2. **Payload relationships** - Tours linked to:
   - Media files
   - Site settings
   - User favorites

**Solution:** Archive instead of delete. Archived tours:
- Don't show on website
- Don't appear in API results
- Can be restored later if needed
- Don't cause database errors

---

## 🐛 If Status Change Also Fails

If you can't change status either, the Server Action errors are blocking form submissions.

**Fix the Server Actions first:**

```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197
cd /var/www/payload-admin
pm2 stop payload-admin
rm -rf .next
npm run build
pm2 restart payload-admin
```

Then try changing status again.

---

## 📊 Expected Result

**Before:**
- 73 tours total
- 1 live, 72 draft
- All categories showing

**After:**
- 25 Vatican tours live
- 48 non-Vatican archived
- Only Vatican tours on website

---

## 💡 Alternative: Database Direct Update

If the admin UI completely fails, we can update the database directly:

```sql
-- Set Vatican tours to live
UPDATE payload_tours 
SET status = 'live', active = true 
WHERE tenant = 'romewander' 
AND category = 'vatican';

-- Archive non-Vatican tours
UPDATE payload_tours 
SET status = 'archived', active = false 
WHERE tenant = 'romewander' 
AND category != 'vatican';
```

**To run this:**
```bash
ssh -i ~/.ssh/id_ed25519 root@91.98.205.197
psql $DATABASE_URI -c "UPDATE payload_tours SET status = 'live', active = true WHERE tenant = 'romewander' AND category = 'vatican';"
psql $DATABASE_URI -c "UPDATE payload_tours SET status = 'archived', active = false WHERE tenant = 'romewander' AND category != 'vatican';"
```

---

## ✅ Summary

1. **Don't delete** - causes database errors
2. **Archive instead** - safe and reversible
3. **Set Vatican to live** - makes them visible
4. **Archive others** - hides them from website
5. **Wait for cache** - or redeploy on Vercel

**Time:** 15-20 minutes manually, or 30 seconds with SQL

---

**Which method do you prefer?**
- A) Manual in admin UI (safer, slower)
- B) SQL direct update (faster, requires SSH)
