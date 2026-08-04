'use server';

import { createClient } from '@supabase/supabase-js';

/**
 * Server-side booking lookup — uses service_role key (never exposed to client).
 * Gated: caller must provide payment_intent_id AND matching email.
 */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface BookingResult {
  id: string;
  booking_ref: string;
  tour_title: string;
  tour_slug: string;
  date: string;
  time: string;
  guests: number;
  total_amount: number;
  currency: string;
  status: string;
  lead_first_name: string;
  lead_last_name: string;
  lead_email: string;
  lead_phone?: string;
  meeting_point?: string;
  guest_counts?: Record<string, number>;
  created_at: string;
}

/**
 * Get booking by Stripe payment intent ID, email-verified.
 * Returns null if no booking found or email doesn't match.
 */
export async function getBookingByPaymentIntent(
  paymentIntentId: string,
  email: string
): Promise<BookingResult | null> {
  if (!paymentIntentId || !email) return null;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle();

  if (error || !data) return null;

  // Verify the email matches — prevents PII scraping
  if (data.lead_email?.toLowerCase() !== email.toLowerCase()) return null;

  return data as BookingResult;
}

/**
 * Get booking by booking reference, email-verified.
 */
export async function getBookingByRef(
  bookingRef: string,
  email: string
): Promise<BookingResult | null> {
  if (!bookingRef || !email) return null;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('booking_ref', bookingRef)
    .maybeSingle();

  if (error || !data) return null;

  if (data.lead_email?.toLowerCase() !== email.toLowerCase()) return null;

  return data as BookingResult;
}

/**
 * Get booking by payment intent ID only (no email gate).
 * Safe because payment_intent IDs are cryptographically unguessable
 * (e.g., pi_3QxY...). Used by the success page redirect flow.
 * Rate-limited at the API route level.
 */
export async function getBookingByPaymentIntentOnly(
  paymentIntentId: string
): Promise<BookingResult | null> {
  if (!paymentIntentId) return null;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle();

  if (error || !data) return null;

  return data as BookingResult;
}
