-- Migration: Sync bookings → user_tickets for mobile app visibility
-- The website writes to 'bookings' table via Stripe webhook.
-- The mobile app reads from 'user_tickets' table for ticket management.
-- This trigger keeps them in sync so website bookings appear in the app.

-- Create user_tickets table if it doesn't exist (mirrors bookings for mobile)
CREATE TABLE IF NOT EXISTS user_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  booking_id TEXT UNIQUE NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  tour_id TEXT,
  tour_title TEXT,
  tour_date TEXT,
  tour_time TEXT,
  status TEXT DEFAULT 'confirmed',
  number_of_people INT DEFAULT 1,
  total_price DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  qr_code TEXT,
  booking_reference TEXT,
  meeting_point TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: When a new booking is inserted, sync to user_tickets
CREATE OR REPLACE FUNCTION sync_booking_to_user_tickets()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_tickets (
    user_email,
    booking_id,
    ticket_code,
    tour_id,
    tour_title,
    tour_date,
    tour_time,
    status,
    number_of_people,
    total_price,
    currency,
    booking_reference,
    meeting_point
  ) VALUES (
    NEW.lead_email,
    NEW.booking_ref,
    COALESCE(NEW.booking_ref, 'TKT-' || NEW.booking_ref),
    NEW.tour_slug,
    NEW.tour_title,
    NEW.date::TEXT,
    NEW.time,
    NEW.status,
    NEW.guests,
    NEW.total_amount,
    NEW.currency,
    NEW.booking_ref,
    NEW.meeting_point
  )
  ON CONFLICT (booking_id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_sync_booking_to_user_tickets ON bookings;

-- Create the trigger
CREATE TRIGGER trigger_sync_booking_to_user_tickets
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION sync_booking_to_user_tickets();
