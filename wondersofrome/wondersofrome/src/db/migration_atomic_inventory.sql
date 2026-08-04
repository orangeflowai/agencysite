-- Migration: Atomic inventory reservation functions
-- Replaces read-then-write race condition in application code
-- with atomic UPDATE ... WHERE available_slots >= p_guest_count

-- Reserve slots: atomically decrement available_slots.
-- Returns new available_slots count, or NULL if insufficient slots.
CREATE OR REPLACE FUNCTION reserve_slots(
  p_tour_slug TEXT,
  p_date DATE,
  p_time TEXT,
  p_guest_count INT,
  p_site_id TEXT DEFAULT 'wondersofrome'
) RETURNS INT AS $$
DECLARE
  v_new_slots INT;
BEGIN
  -- Try atomic update with guard clause
  UPDATE tour_slots
  SET available_slots = available_slots - p_guest_count,
      updated_at = NOW()
  WHERE tour_slug = p_tour_slug
    AND date = p_date
    AND time = p_time
    AND available_slots >= p_guest_count
  RETURNING available_slots INTO v_new_slots;

  -- If no row matched, slot doesn't exist or insufficient availability
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN v_new_slots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Release slots: atomically increment available_slots.
-- Creates the slot row if it doesn't exist (for refunds on unlisted dates).
CREATE OR REPLACE FUNCTION release_slots(
  p_tour_slug TEXT,
  p_date DATE,
  p_time TEXT,
  p_guest_count INT,
  p_site_id TEXT DEFAULT 'wondersofrome'
) RETURNS INT AS $$
DECLARE
  v_new_slots INT;
BEGIN
  -- Update existing slot
  UPDATE tour_slots
  SET available_slots = available_slots + p_guest_count,
      updated_at = NOW()
  WHERE tour_slug = p_tour_slug
    AND date = p_date
    AND time = p_time
  RETURNING available_slots INTO v_new_slots;

  -- If no slot exists yet for this tour/date/time, create one
  IF NOT FOUND THEN
    INSERT INTO tour_slots (tour_slug, date, time, available_slots, site_id)
    VALUES (p_tour_slug, p_date, p_time, p_guest_count, p_site_id)
    RETURNING available_slots INTO v_new_slots;
  END IF;

  RETURN v_new_slots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
