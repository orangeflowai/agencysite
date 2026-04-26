import { supabaseAdmin } from './supabaseAdmin';

export interface InventorySlot {
  id?: string;
  tour_slug: string;
  date: string;
  time: string;
  available_slots: number;
  total_slots?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingReservation {
  success: boolean;
  availableSlots?: number;
  error?: string;
}

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || '';
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';

/** Decrement availableSlots in Payload inventory (non-blocking) */
async function decrementPayloadInventory(tourSlug: string, date: string, time: string, guestCount: number): Promise<void> {
  if (!PAYLOAD_URL) return;
  try {
    const tourRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[slug][equals]=${encodeURIComponent(tourSlug)}&where[tenant][equals]=${encodeURIComponent(SITE_ID)}&limit=1&depth=0`,
      { cache: 'no-store' }
    );
    if (!tourRes.ok) return;
    const tourId = (await tourRes.json())?.docs?.[0]?.id;
    if (!tourId) return;

    const dateStart = `${date}T00:00:00.000Z`;
    const dateEnd = `${date}T23:59:59.999Z`;
    const invRes = await fetch(
      `${PAYLOAD_URL}/api/inventory?where[tour][equals]=${tourId}&where[date][greater_than_equal]=${encodeURIComponent(dateStart)}&where[date][less_than_equal]=${encodeURIComponent(dateEnd)}&where[time][equals]=${encodeURIComponent(time)}&limit=1&depth=0`,
      { cache: 'no-store' }
    );
    if (!invRes.ok) return;
    const slot = (await invRes.json())?.docs?.[0];
    if (!slot) return;

    const newAvailable = Math.max(0, (slot.availableSlots || 0) - guestCount);
    await fetch(`${PAYLOAD_URL}/api/inventory/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availableSlots: newAvailable }),
    });
  } catch (err) {
    console.warn('[inventoryService] Payload decrement sync failed:', err);
  }
}

/** Increment availableSlots in Payload inventory (for cancellations, non-blocking) */
async function incrementPayloadInventory(tourSlug: string, date: string, time: string, guestCount: number): Promise<void> {
  if (!PAYLOAD_URL) return;
  try {
    const tourRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[slug][equals]=${encodeURIComponent(tourSlug)}&where[tenant][equals]=${encodeURIComponent(SITE_ID)}&limit=1&depth=0`,
      { cache: 'no-store' }
    );
    if (!tourRes.ok) return;
    const tourId = (await tourRes.json())?.docs?.[0]?.id;
    if (!tourId) return;

    const dateStart = `${date}T00:00:00.000Z`;
    const dateEnd = `${date}T23:59:59.999Z`;
    const invRes = await fetch(
      `${PAYLOAD_URL}/api/inventory?where[tour][equals]=${tourId}&where[date][greater_than_equal]=${encodeURIComponent(dateStart)}&where[date][less_than_equal]=${encodeURIComponent(dateEnd)}&where[time][equals]=${encodeURIComponent(time)}&limit=1&depth=0`,
      { cache: 'no-store' }
    );
    if (!invRes.ok) return;
    const slot = (await invRes.json())?.docs?.[0];
    if (!slot) return;

    const newAvailable = Math.min(slot.totalSlots || 999, (slot.availableSlots || 0) + guestCount);
    await fetch(`${PAYLOAD_URL}/api/inventory/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availableSlots: newAvailable }),
    });
  } catch (err) {
    console.warn('[inventoryService] Payload increment sync failed:', err);
  }
}

export async function checkAvailability(
  tourSlug: string,
  date: string,
  time: string,
  requestedGuests: number
): Promise<BookingReservation> {
  try {
    const { data: existingSlot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    if (!existingSlot) {
      return { success: true, availableSlots: 20 };
    }

    const availableSlots = existingSlot.available_slots;
    if (availableSlots < requestedGuests) {
      return { success: false, availableSlots, error: `Only ${availableSlots} spots available` };
    }

    return { success: true, availableSlots };
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    return { success: false, error: 'System error' };
  }
}

export async function reserveInventory(
  tourSlug: string,
  date: string,
  time: string,
  guestCount: number
): Promise<BookingReservation> {
  try {
    const { data: slot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 20;

    if (currentSlots < guestCount) {
      return { success: false, availableSlots: currentSlots, error: `Not enough spots available. Only ${currentSlots} left.` };
    }

    const newSlots = currentSlots - guestCount;

    const { error: upsertError } = await supabaseAdmin
      .from('inventory')
      .upsert({
        tour_slug: tourSlug,
        date: date,
        time: time,
        available_slots: newSlots,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tour_slug,date,time' });

    if (upsertError) {
      console.error('Error updating inventory:', upsertError);
      return { success: false, error: 'Failed to reserve spots' };
    }

    const { data: verifySlot, error: verifyError } = await supabaseAdmin
      .from('inventory')
      .select('available_slots')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (verifyError || !verifySlot) {
      return { success: false, error: 'Verification failed' };
    }

    if (verifySlot.available_slots < 0) {
      console.error('CRITICAL: Overbooking detected!', { tourSlug, date, time, guestCount });
      return { success: false, error: 'Inventory error - please contact support' };
    }

    // Sync to Payload CMS (non-blocking)
    decrementPayloadInventory(tourSlug, date, time, guestCount).catch(() => {});

    return { success: true, availableSlots: verifySlot.available_slots };
  } catch (error) {
    console.error('Error in reserveInventory:', error);
    return { success: false, error: 'System error' };
  }
}

export async function releaseInventory(
  tourSlug: string,
  date: string,
  time: string,
  guestCount: number
): Promise<BookingReservation> {
  try {
    const { data: slot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError) {
      console.error('Error fetching inventory for release:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 0;
    const newSlots = Math.min(currentSlots + guestCount, 20);

    const { error: updateError } = await supabaseAdmin
      .from('inventory')
      .update({ available_slots: newSlots, updated_at: new Date().toISOString() })
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time);

    if (updateError) {
      console.error('Error releasing inventory:', updateError);
      return { success: false, error: 'Failed to release spots' };
    }

    // Sync to Payload CMS (non-blocking)
    incrementPayloadInventory(tourSlug, date, time, guestCount).catch(() => {});

    return { success: true, availableSlots: newSlots };
  } catch (error) {
    console.error('Error in releaseInventory:', error);
    return { success: false, error: 'System error' };
  }
}

export async function initializeInventory(
  tourSlug: string,
  date: string,
  time: string,
  totalSlots: number = 20
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('inventory')
      .upsert({
        tour_slug: tourSlug,
        date: date,
        time: time,
        available_slots: totalSlots,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'tour_slug,date,time' });

    if (error) {
      console.error('Error initializing inventory:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in initializeInventory:', error);
    return false;
  }
}

export async function getInventoryForDateRange(
  tourSlug: string,
  startDate: string,
  endDate: string
): Promise<InventorySlot[]> {
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
    .eq('tour_slug', tourSlug)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  return data || [];
}
