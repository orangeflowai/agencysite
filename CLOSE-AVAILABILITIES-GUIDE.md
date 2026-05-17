# Close All Availabilities Guide 🔒

**Purpose**: Close all booking availabilities for WondersOfRome  
**Effect**: No new bookings can be made until slots are reopened

---

## 🚀 QUICK START

### Option 1: Run the Script (Recommended)

```bash
cd /home/abiilesh/travelwebsite
node close-all-availabilities.js
```

**Output**:
```
🔒 Closing all availabilities for WondersOfRome...

1️⃣ Authenticating with Payload CMS...
✅ Authenticated successfully

2️⃣ Fetching all inventory slots...
✅ Found 245 inventory slots

3️⃣ Closing all slots...
✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total slots:          245
✅ Closed:            245
ℹ️  Already closed:   0
❌ Errors:            0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All availabilities have been closed successfully!
ℹ️  No new bookings can be made until you reopen slots.
```

---

### Option 2: Manual via Admin Panel

1. **Login to Admin Panel**
   ```
   https://admin.wondersofrome.com
   Email: superadmin@romeagency.com
   Password: SuperAdmin2025!
   ```

2. **Go to Inventory**
   - Click "Inventory" in left sidebar
   - You'll see all tour slots

3. **Close Individual Slots**
   - Click on a slot
   - Set "Available Slots" to `0`
   - Click "Save"
   - Repeat for all slots

**Note**: This is tedious if you have many slots. Use the script instead!

---

### Option 3: Bulk Close via API

```bash
# Set environment variables
export PAYLOAD_URL="https://admin.wondersofrome.com"
export EMAIL="superadmin@romeagency.com"
export PASSWORD="SuperAdmin2025!"

# Login and get token
TOKEN=$(curl -s -X POST "$PAYLOAD_URL/api/users/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

# Get all inventory slots
SLOTS=$(curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&limit=1000" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.docs[].id')

# Close each slot
for SLOT_ID in $SLOTS; do
  curl -s -X PATCH "$PAYLOAD_URL/api/inventory/$SLOT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"availableSlots":0}' > /dev/null
  echo "Closed slot: $SLOT_ID"
done

echo "✅ All slots closed!"
```

---

## 🔍 VERIFY CLOSURE

### Check via Admin Panel
1. Go to https://admin.wondersofrome.com
2. Click "Inventory"
3. All slots should show "Available: 0"

### Check via Website
1. Go to https://wondersofrome.com
2. Try to book any tour
3. Calendar should show "No availability" or all dates grayed out

### Check via API
```bash
curl -s "https://admin.wondersofrome.com/api/inventory?where[tenant][equals]=wondersofrome&where[availableSlots][greater_than]=0&limit=1" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.totalDocs'

# Should return: 0 (no slots with availability > 0)
```

---

## 🔓 REOPEN AVAILABILITIES

### Option 1: Reopen All Slots to Default Capacity

Create a script `reopen-all-availabilities.js`:

```javascript
// Set all slots to default capacity (e.g., 25)
const DEFAULT_CAPACITY = 25;

// ... (same login code as close script)

for (const slot of slots) {
  await fetch(`${PAYLOAD_URL}/api/inventory/${slot.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      availableSlots: slot.totalSlots || DEFAULT_CAPACITY 
    }),
  });
}
```

### Option 2: Reopen Specific Dates

```bash
# Reopen slots for a specific date range
START_DATE="2026-06-01"
END_DATE="2026-06-30"

# Get slots in date range
SLOTS=$(curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&where[date][greater_than_equal]=${START_DATE}&where[date][less_than_equal]=${END_DATE}&limit=1000" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.docs[] | "\(.id)|\(.totalSlots)"')

# Reopen each slot
while IFS='|' read -r SLOT_ID TOTAL_SLOTS; do
  curl -s -X PATCH "$PAYLOAD_URL/api/inventory/$SLOT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"availableSlots\":$TOTAL_SLOTS}" > /dev/null
  echo "Reopened slot: $SLOT_ID (capacity: $TOTAL_SLOTS)"
done <<< "$SLOTS"
```

---

## 📊 INVENTORY MANAGEMENT

### View Current Status
```bash
# Count closed slots
curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&where[availableSlots][equals]=0&limit=0" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.totalDocs'

# Count open slots
curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&where[availableSlots][greater_than]=0&limit=0" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.totalDocs'

# Total slots
curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&limit=0" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.totalDocs'
```

### Export Inventory to CSV
```bash
curl -s "$PAYLOAD_URL/api/inventory?where[tenant][equals]=wondersofrome&limit=1000" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.docs[] | [.date, .time, .tour, .totalSlots, .availableSlots] | @csv' \
  > inventory-export.csv
```

---

## ⚠️ IMPORTANT NOTES

### Before Closing All Availabilities

1. **Notify customers** - Send email about temporary closure
2. **Check existing bookings** - Don't affect confirmed bookings
3. **Set maintenance message** - Update website with notice
4. **Backup inventory data** - Export current state

### After Closing

1. **Existing bookings still valid** - Closing slots doesn't cancel bookings
2. **No new bookings possible** - Calendar will show no availability
3. **Admin can still create bookings** - Manual bookings still work
4. **Webhooks still process** - If someone has old payment link

### When to Close Availabilities

- **Maintenance period** - Website updates, system maintenance
- **Holiday closure** - Business closed for holidays
- **Capacity issues** - Staff shortage, tour guide unavailable
- **Emergency** - Unexpected closure (weather, safety)
- **Inventory audit** - Reviewing and updating all slots

---

## 🔧 TROUBLESHOOTING

### Script Fails with "Login failed"
```bash
# Check credentials
echo "URL: $PAYLOAD_URL"
echo "Email: $EMAIL"

# Test login manually
curl -X POST "https://admin.wondersofrome.com/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@romeagency.com","password":"SuperAdmin2025!"}'
```

### Script Fails with "Failed to fetch inventory"
```bash
# Check if Payload CMS is accessible
curl -I https://admin.wondersofrome.com/api/inventory

# Should return: HTTP/1.1 401 Unauthorized (expected without token)
```

### Some Slots Not Closing
```bash
# Check for errors in script output
# Look for ✗ symbols

# Manually check problematic slot
curl -s "$PAYLOAD_URL/api/inventory/SLOT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

---

## 📞 SUPPORT

If you encounter issues:

1. **Check Payload CMS Status**
   ```bash
   ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 status payload-admin"
   ```

2. **Check Logs**
   ```bash
   ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 logs payload-admin --lines 50"
   ```

3. **Restart Payload CMS**
   ```bash
   ssh -i ~/.ssh/id_ed25519 root@91.98.205.197 "pm2 restart payload-admin"
   ```

---

## ✅ SUMMARY

**To close all availabilities**:
```bash
node close-all-availabilities.js
```

**To verify closure**:
```bash
# Check admin panel: https://admin.wondersofrome.com
# Check website: https://wondersofrome.com (try booking)
```

**To reopen**:
```bash
# Manually via admin panel, or
# Create reopen script (similar to close script)
```

---

**All availabilities will be closed and no new bookings can be made!** 🔒
