# Syncing Data Between Ticketsinrome and Wondersofrome

## Overview

Both websites share the same Sanity CMS backend, so data is automatically synced. However, you need to ensure tours are assigned to the correct sites.

## How Multi-Site Works in Sanity

Each tour has a `sites` field that determines which website(s) display it:
- Select "Tickets in Rome" → appears on ticketsinrome.com
- Select "Wonders of Rome" → appears on wondersofrome.com
- Select both → appears on both sites

## Ensuring Participant Numbers Are Synced

Since both sites use the same Sanity backend, `maxParticipants` is automatically synced. Here's how to verify:

### Step 1: Check Current Tours

1. Log into Sanity Studio:
   - ticketsinrome.com/studio OR
   - wondersofrome.com/studio

2. Go to "Tours" section

3. For each tour, check:
   - Which sites it's assigned to (sites field)
   - If maxParticipants is set (Logistics tab)

### Step 2: Set Max Participants

For each tour:

1. Click on the tour
2. Go to "Logistics" tab
3. Find "Max Participants (per booking)"
4. Set a reasonable number (e.g., 20, 30, 50)
5. Click "Publish"

### Step 3: Verify on Frontend

1. Visit the tour page on the website
2. Open booking widget
3. Try to add participants
4. Should be limited to the number you set

## Common Scenarios

### Scenario 1: Tour appears on both sites
- Set maxParticipants once in Sanity
- It applies to both ticketsinrome.com and wondersofrome.com
- Inventory is also shared (same database)

### Scenario 2: Tour only on one site
- Set maxParticipants in Sanity
- Only affects the site where tour is assigned

### Scenario 3: Different limits per site
This is NOT currently supported. If you need different limits:
- Create two separate tours in Sanity
- Assign one to ticketsinrome
- Assign other to wondersofrome
- Set different maxParticipants for each

## Inventory Sync

Inventory (time slots and availability) is stored in Supabase and is shared between both sites:

- If you create inventory for "colosseum-tour" on ticketsinrome admin
- The same inventory appears on wondersofrome admin
- Both sites book from the same pool of available slots

This is by design - you don't want to double-book the same tour!

## Checking Data Sync

### Quick SQL Query to Check Tours:

Run this in Supabase SQL Editor:

```sql
-- Check recent bookings from both sites
SELECT 
    site_id,
    tour_title,
    COUNT(*) as booking_count,
    SUM(guests) as total_guests
FROM bookings
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY site_id, tour_title
ORDER BY site_id, booking_count DESC;
```

### Check Inventory:

```sql
-- Check inventory for both sites
SELECT 
    tour_slug,
    date,
    time,
    available_slots,
    price_override
FROM inventory
WHERE date >= CURRENT_DATE
ORDER BY tour_slug, date, time
LIMIT 50;
```

## Best Practices

1. **Set maxParticipants for all tours**
   - Prevents overbooking
   - Improves user experience
   - Typical values: 15-30 for group tours, 50+ for large events

2. **Use consistent tour slugs**
   - Same slug = same inventory pool
   - Different slug = separate inventory

3. **Monitor both sites**
   - Check admin panel on both sites regularly
   - Ensure inventory is being created correctly
   - Verify bookings appear in both admin panels

4. **Test booking flow on both sites**
   - Make test bookings on ticketsinrome.com
   - Make test bookings on wondersofrome.com
   - Verify both appear in Supabase
   - Verify both receive confirmation emails

## Troubleshooting

### Issue: maxParticipants not applying
- Clear browser cache
- Check if tour data is published in Sanity
- Verify NEXT_PUBLIC_SANITY_DATASET is correct in .env
- Rebuild the site: `npm run build`

### Issue: Inventory not syncing
- Both sites use same Supabase database
- Check NEXT_PUBLIC_SUPABASE_URL is same in both .env files
- Verify tour_slug matches exactly (case-sensitive)

### Issue: Different data on each site
- Check if tours are assigned to correct sites in Sanity
- Verify both sites are using same Sanity project ID
- Check NEXT_PUBLIC_SANITY_PROJECT_ID in both .env files

## Summary

✅ **Automatic Sync:**
- Tour data (title, price, description, maxParticipants)
- Inventory (time slots, availability)
- Bookings (stored in shared database)

❌ **Not Synced:**
- Site-specific styling/branding
- Site-specific content (if tour is assigned to only one site)
- Environment variables (.env files)

**Key Point:** Since both sites share the same Sanity backend and Supabase database, data is inherently synced. You just need to ensure tours are assigned to the correct sites and maxParticipants is set for each tour.
