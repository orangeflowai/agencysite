# How to Set Max Participants in Sanity

## Quick Guide

### Step 1: Access Sanity Studio

Visit one of these URLs:
- https://ticketsinrome.com/studio
- https://wondersofrome.com/studio

(Both access the same Sanity backend)

### Step 2: Navigate to Tours

1. Click on "Tours" in the left sidebar
2. You'll see a list of all your tours

### Step 3: Edit a Tour

1. Click on any tour to open it
2. You'll see multiple tabs at the top

### Step 4: Go to Logistics Tab

1. Click on the "Logistics" tab
2. Scroll down to find "Max Participants (per booking)"

### Step 5: Set the Number

1. Enter a number in the "Max Participants" field
2. Common values:
   - Small group tours: 10-15
   - Standard tours: 20-30
   - Large events: 50+
   - Private tours: 6-8

### Step 6: Publish

1. Click the "Publish" button (top right)
2. Changes are now live!

### Step 7: Test

1. Visit the tour page on your website
2. Try to add participants in the booking widget
3. You should be limited to the number you set

---

## Example

**Tour:** Colosseum Skip-the-Line Tour
**Max Participants:** 25

**What happens:**
- User can select 1-25 participants
- If they try to select 26, the + button is disabled
- If available_slots = 10, limit becomes 10 (minimum of 25 and 10)

---

## Important Notes

1. **This field is optional**
   - If left empty, there's no limit (except available_slots)
   - Only set it if you want to cap bookings

2. **Works with inventory**
   - Final limit = min(maxParticipants, available_slots)
   - Example: maxParticipants=30, available_slots=15 → limit is 15

3. **Applies immediately**
   - No need to rebuild the website
   - Changes are live as soon as you publish

4. **Same for both sites**
   - If a tour is on both ticketsinrome and wondersofrome
   - The same maxParticipants applies to both
   - (They share the same Sanity backend)

---

## Troubleshooting

### "I set maxParticipants but it's not working"

**Check:**
1. Did you click "Publish"?
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors (F12)
4. Verify the tour page is loading fresh data

### "I want different limits for different sites"

**Solution:**
- Create two separate tours in Sanity
- Assign one to ticketsinrome
- Assign other to wondersofrome
- Set different maxParticipants for each

### "The field is not showing"

**Check:**
1. Make sure you're in the "Logistics" tab
2. Scroll down - it might be below other fields
3. If still not visible, the schema might need updating

---

## Visual Guide

```
Sanity Studio
├── Tours (sidebar)
│   ├── Tour 1
│   │   ├── Details tab
│   │   ├── Content tab
│   │   ├── Logistics tab ← GO HERE
│   │   │   ├── Meeting Point
│   │   │   ├── Important Information
│   │   │   ├── Group Size
│   │   │   ├── Max Participants ← SET THIS
│   │   │   └── Location
│   │   └── SEO tab
│   └── Tour 2
```

---

## Recommended Values by Tour Type

| Tour Type | Recommended Max |
|-----------|----------------|
| Private Tour | 6-8 |
| Small Group | 10-15 |
| Standard Tour | 20-30 |
| Large Group | 40-50 |
| Event/Show | 100+ |
| Walking Tour | 15-20 |
| Bus Tour | 40-50 |
| Food Tour | 12-15 |

---

## Need Help?

If you're having trouble:
1. Check the browser console (F12)
2. Check if the tour data includes maxParticipants
3. Try rebuilding the site (if changes don't appear)
4. Contact support with specific details

---

**Remember:** This is just a cap on how many participants can be selected per booking. It works together with your inventory system to prevent overbooking.
