-- ============================================================
-- FIX: Missing tour_slug column + seed inventory for RVT
-- RUN IN SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/ogrvhooygcoazracbvkb/sql/new
-- ============================================================

-- 1. Add tour_slug column to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tour_slug text;

-- 2. Make tour_id nullable on inventory (tour_slug is the real key)
ALTER TABLE inventory ALTER COLUMN tour_id DROP NOT NULL;

-- 3. Delete bogus inventory rows (tour_slug = numeric strings from bad seed)
DELETE FROM inventory WHERE tour_slug ~ '^[0-9]+$';

-- 4. Add index on tenant for inventory queries
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON inventory(tenant);

-- 5. Seed inventory for ALL 4 Roman Vatican Tour products (90 days, 7 slots/day)
-- Only inserts rows that don't already exist (ON CONFLICT DO NOTHING)

INSERT INTO inventory (tour_id, tour_slug, date, time, available_slots, total_slots, tenant)
SELECT
  t.tour_id,
  t.tour_slug,
  d.date::date,
  s.time::text,
  20,
  20,
  'romanvaticantour'
FROM (
  VALUES
    (1, 'skip-the-line-vatican-museum-sistine-chapel'),
    (2, 'vatican-museums-sistine-chapel-guided-tour'),
    (3, 'fast-pass-vatican-museums-sistine-chapel'),
    (4, 'vatican-museum-sistine-chapel-st-basilica')
) AS t(tour_id, tour_slug)
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '89 days',
  '1 day'
) AS d(date)
CROSS JOIN (
  VALUES ('09:00'),('10:00'),('11:00'),('12:00'),('14:00'),('15:00'),('16:00')
) AS s(time)
ON CONFLICT (tour_slug, date, time) DO NOTHING;
