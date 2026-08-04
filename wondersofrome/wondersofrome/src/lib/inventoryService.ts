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
    // Atomic UPDATE with guard — prevents oversell under concurrency.
    // Decrements only if enough slots remain, returns new count.
    const { data, error: updateError } = await supabaseAdmin
      .rpc('reserve_slots', {
        p_tour_slug: tourSlug,
        p_date: date,
        p_time: time,
        p_guest_count: guestCount,
        p_site_id: SITE_ID,
      });

    if (updateError) {
      console.error('Error reserving inventory:', updateError);
      return { success: false, error: 'Database error' };
    }

    // data is the new available_slots count, or null if reservation failed
    if (data === null || data === undefined) {
      // Fetch current count for the error message
      const { data: slot } = await supabaseAdmin
        .from('tour_slots')
        .select('available_slots')
        .eq('tour_slug', tourSlug)
        .eq('date', date)
        .eq('time', time)
        .maybeSingle();

      const currentSlots = slot?.available_slots ?? 0;
      return { success: false, availableSlots: currentSlots, error: `Not enough spots available. Only ${currentSlots} left.` };
    }

    return { success: true, availableSlots: data };
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
    const { data, error: updateError } = await supabaseAdmin
      .rpc('release_slots', {
        p_tour_slug: tourSlug,
        p_date: date,
        p_time: time,
        p_guest_count: guestCount,
        p_site_id: SITE_ID,
      });

    if (updateError) {
      console.error('Error releasing inventory:', updateError);
      return { success: false, error: 'Database error' };
    }

    return { success: true, availableSlots: data ?? 0 };
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
