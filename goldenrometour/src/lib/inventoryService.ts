import { supabaseAdmin } from './supabaseAdmin';

const TENANT = process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';

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
    const { data: existingSlot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('tenant', TENANT)
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
 * Reserve inventory slots atomically
 * Uses database-level locking to prevent overbooking
 */
export async function reserveInventory(
  tourSlug: string,
  date: string,
  time: string,
  guestCount: number
): Promise<BookingReservation> {
  try {
    const { data: slot, error: fetchError } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('tenant', TENANT)
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching inventory:', fetchError);
      return { success: false, error: 'Database error' };
    }

    const currentSlots = slot?.available_slots ?? 20;
    const totalSlots = slot?.total_slots ?? 20;

    if (currentSlots < guestCount) {
      return {
        success: false,
        availableSlots: currentSlots,
        error: `Not enough spots available. Only ${currentSlots} left.`
      };
    }

    const newSlots = currentSlots - guestCount;

    const { error: upsertError } = await supabaseAdmin
      .from('inventory')
      .upsert({
        tenant: TENANT,
        tour_slug: tourSlug,
        date: date,
        time: time,
        available_slots: newSlots,
        total_slots: totalSlots,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'tour_slug,date,time'
      });

    if (upsertError) {
      console.error('Error updating inventory:', upsertError);
      return { success: false, error: 'Failed to reserve spots' };
    }

    const { data: verifySlot, error: verifyError } = await supabaseAdmin
      .from('inventory')
      .select('available_slots')
      .eq('tenant', TENANT)
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (verifyError || !verifySlot) {
      console.error('Error verifying inventory update:', verifyError);
      return { success: false, error: 'Verification failed' };
    }

    if (verifySlot.available_slots < 0) {
      console.error('CRITICAL: Overbooking detected!', {
        tourSlug, date, time, guestCount, newSlots: verifySlot.available_slots
      });

      return { success: false, error: 'Inventory error - please contact support' };
    }

    return { success: true, availableSlots: verifySlot.available_slots };
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
      .eq('tenant', TENANT)
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
      .eq('tenant', TENANT)
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
        tenant: TENANT,
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
    .eq('tenant', TENANT)
    .eq('tour_slug', tourSlug)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data || [];
}
