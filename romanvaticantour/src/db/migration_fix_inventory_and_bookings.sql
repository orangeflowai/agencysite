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

-- 4. Deduplicate: keep the row with the lowest id for each (tour_slug, date, time)
DELETE FROM inventory
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY tour_slug, date, time ORDER BY id) AS rn
    FROM inventory
    WHERE tenant = 'romanvaticantour'
  ) sub WHERE rn > 1
);

-- 5. Add index on tenant for inventory queries
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON inventory(tenant);

-- 6. Add unique constraint for upsert-safe seeding
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_tour_slug_date_time_key;
ALTER TABLE inventory ADD CONSTRAINT inventory_tour_slug_date_time_key UNIQUE (tour_slug, date, time);

-- 7. Seed inventory for ALL 4 Roman Vatican Tour products (90 days, 7 slots/day)
-- Uses ON CONFLICT to skip existing rows
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
