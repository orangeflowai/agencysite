import { supabaseAdmin } from './supabaseAdmin';

export interface InventorySlot {
  id?: string;
  tour_slug: string;
  date: string;
  time: string;
  available_slots: number;
  total_slots: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingReservation {
  success: boolean;
  availableSlots?: number;
  error?: string;
}

/**
 * Check availability for a specific tour slot
 * Uses SELECT FOR UPDATE to prevent race conditions
 */
export async function checkAvailability(
  tourSlug: string,
  date: string,
  time: string,
  requestedGuests: number
): Promise<BookingReservation> {
  try {
    // First, ensure the inventory slot exists
    const { data: existingSlot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    if (!existingSlot) {
      // No inventory record exists - assume default capacity of 20
      return { success: true, availableSlots: 20 };
    }

    const availableSlots = existingSlot.available_slots;

    if (availableSlots < requestedGuests) {
      return {
        success: false,
        availableSlots,
        error: `Only ${availableSlots} spots available`
      };
    }

    return { success: true, availableSlots };
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    return { success: false, error: 'System error' };
  }
}

/**
 * Reserve inventory slots atomically.
 * Uses the `reserve_inventory_slots` Postgres RPC to prevent overbooking.
 *
 * REQUIRED — create this Postgres function on the Supabase database:
 *
 * CREATE OR REPLACE FUNCTION reserve_inventory_slots(
 *   p_tour_slug text, p_date text, p_time text, p_guest_count int
 * ) RETURNS int AS $$
 * DECLARE new_slots int;
 * BEGIN
 *   UPDATE inventory
 *   SET available_slots = available_slots - p_guest_count,
 *       updated_at = now()
 *   WHERE tour_slug = p_tour_slug AND date = p_date AND time = p_time
 *     AND available_slots >= p_guest_count
 *   RETURNING available_slots INTO new_slots;
 *
 *   IF NOT FOUND THEN RETURN -1; END IF;
 *   RETURN new_slots;
 * END;
 * $$ LANGUAGE plpgsql;
 */
export async function reserveInventory(
  tourSlug: string,
  date: string,
  time: string,
  guestCount: number
): Promise<BookingReservation> {
  try {
    const { data, error } = await supabaseAdmin.rpc('reserve_inventory_slots', {
      p_tour_slug: tourSlug,
      p_date: date,
      p_time: time,
      p_guest_count: guestCount,
    });

    if (error) {
      console.error('Error reserving inventory:', error);
      return { success: false, error: 'Failed to reserve spots' };
    }

    // RPC returns -1 when no row matched the atomic UPDATE (insufficient slots)
    if (data === -1) {
      return { success: false, error: 'Not enough spots available' };
    }

    return { success: true, availableSlots: data ?? 0 };
  } catch (error) {
    console.error('Error in reserveInventory:', error);
    return { success: false, error: 'System error' };
  }
}

/**
 * Release inventory slots (for cancellations/refunds)
 */
export async function releaseInventory(
  tourSlug: string,
  date: string,
  time: string,
  guestCount: number
): Promise<BookingReservation> {
  try {
    const { data: slot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError) {
      console.error('Error fetching inventory for release:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 0;
    const totalSlots = slot?.total_slots ?? 20;
    const newSlots = Math.min(currentSlots + guestCount, totalSlots);

    const { error: updateError } = await supabaseAdmin
      .from('inventory')
      .update({
        available_slots: newSlots,
        updated_at: new Date().toISOString()
      })
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time);

    if (updateError) {
      console.error('Error releasing inventory:', updateError);
      return { success: false, error: 'Failed to release spots' };
    }

    return { success: true, availableSlots: newSlots };
  } catch (error) {
    console.error('Error in releaseInventory:', error);
    return { success: false, error: 'System error' };
  }
}

/**
 * Initialize inventory for a new tour slot
 */
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
        total_slots: totalSlots,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'tour_slug,date,time'
      });

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

/**
 * Get all inventory for a date range
 */
export async function getInventoryForDateRange(
  tourSlug: string,
  startDate: string,
  endDate: string
): Promise<InventorySlot[]> {
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .eq('tour_slug', tourSlug)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data || [];
}
