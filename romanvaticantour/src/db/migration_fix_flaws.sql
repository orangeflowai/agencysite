-- Migration: Add missing columns and tables for romanvaticantour.com
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS site_id text;

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_site_id ON bookings(site_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_inventory_tour_date_time ON inventory(tour_slug, date, time);

-- 3. Add total_slots to inventory if missing
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS total_slots integer NOT NULL DEFAULT 20;

-- 4. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  event text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create inventory_errors table
CREATE TABLE IF NOT EXISTS inventory_errors (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tour_slug text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  guest_count integer NOT NULL,
  error_type text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Atomic inventory reservation function (prevents overbooking)
CREATE OR REPLACE FUNCTION reserve_inventory_slots(
  p_tour_slug text,
  p_date text,
  p_time text,
  p_guest_count int
) RETURNS int AS $$
DECLARE
  new_slots int;
BEGIN
  UPDATE inventory
  SET available_slots = available_slots - p_guest_count,
      updated_at = now()
  WHERE tour_slug = p_tour_slug
    AND date = p_date
    AND time = p_time
    AND available_slots >= p_guest_count
  RETURNING available_slots INTO new_slots;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  RETURN new_slots;
END;
$$ LANGUAGE plpgsql;

-- 7. Fix bookings RLS: allow anon read by session_id (for success page)
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON bookings;
CREATE POLICY "Enable read by payment intent" ON bookings
  FOR SELECT USING (
    auth.role() = 'authenticated'
    OR stripe_session_id IS NOT NULL
    OR stripe_payment_intent_id IS NOT NULL
  );
