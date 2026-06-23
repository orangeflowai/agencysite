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

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';

export async function checkAvailability(
  tourSlug: string,
  date: string,
  time: string,
  requestedGuests: number
): Promise<BookingReservation> {
  try {
    const { data: existingSlot, error: fetchError } = await supabaseAdmin
      .from('tour_slots')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    if (!existingSlot) {
      // DEFAULT TO 0 (FULLY BOOKED)
      return { success: true, availableSlots: 0 };
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
      .from('tour_slots')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 0;

    if (currentSlots < guestCount) {
      return { success: false, availableSlots: currentSlots, error: `Not enough spots available. Only ${currentSlots} left.` };
    }

    const newSlots = currentSlots - guestCount;

    let updateResult;
    if (slot?.id) {
        // Update existing
        updateResult = await supabaseAdmin
            .from('tour_slots')
            .update({
                available_slots: newSlots,
                updated_at: new Date().toISOString()
            })
            .eq('id', slot.id);
    } else {
        // Insert new (shouldn't happen often if defaulting to 0, but for safety)
        updateResult = await supabaseAdmin
            .from('tour_slots')
            .insert({
                tour_slug: tourSlug,
                date: date,
                time: time,
                available_slots: newSlots,
                site_id: SITE_ID
            });
    }

    if (updateResult.error) {
      console.error('Error updating inventory:', updateResult.error);
      return { success: false, error: 'Failed to reserve spots' };
    }

    return { success: true, availableSlots: newSlots };
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
      .from('tour_slots')
      .select('id, tour_slug, date, time, available_slots, created_at, updated_at')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching inventory for release:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 0;
    const newSlots = currentSlots + guestCount;

    let result;
    if (slot?.id) {
        result = await supabaseAdmin
            .from('tour_slots')
            .update({ available_slots: newSlots, updated_at: new Date().toISOString() })
            .eq('id', slot.id);
    } else {
        result = await supabaseAdmin
            .from('tour_slots')
            .insert({
                tour_slug: tourSlug,
                date: date,
                time: time,
                available_slots: newSlots,
                site_id: SITE_ID
            });
    }

    if (result.error) {
      console.error('Error releasing inventory:', result.error);
      return { success: false, error: 'Failed to release spots' };
    }

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
    const { data: existing } = await supabaseAdmin
      .from('tour_slots')
      .select('id')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    let result;
    if (existing) {
        result = await supabaseAdmin
            .from('tour_slots')
            .update({
                available_slots: totalSlots,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
    } else {
        result = await supabaseAdmin
            .from('tour_slots')
            .insert({
                tour_slug: tourSlug,
                date: date,
                time: time,
                available_slots: totalSlots,
                site_id: SITE_ID
            });
    }

    if (result.error) {
      console.error('Error initializing inventory:', result.error);
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
    .from('tour_slots')
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
