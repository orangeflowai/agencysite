-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ogrvhooygcoazracbvkb/sql/new

CREATE TABLE IF NOT EXISTS tour_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_slug text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  available_slots integer NOT NULL DEFAULT 20,
  total_slots integer NOT NULL DEFAULT 20,
  price_override numeric(10,2),
  site_id text DEFAULT 'wondersofrome',
  is_paused boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- MIGRATION (run if table already exists):
-- ALTER TABLE tour_slots ADD COLUMN IF NOT EXISTS is_paused boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_tour_slots_tour_date ON tour_slots(tour_slug, date);
CREATE INDEX IF NOT EXISTS idx_tour_slots_date ON tour_slots(date);

ALTER TABLE tour_slots ENABLE ROW LEVEL SECURITY;

-- Allow public read (for booking widget)
CREATE POLICY "anon_read_tour_slots" ON tour_slots
  FOR SELECT TO anon USING (true);

-- Allow service role full access (for admin panel)
CREATE POLICY "service_all_tour_slots" ON tour_slots
  FOR ALL TO service_role USING (true);

GRANT SELECT ON tour_slots TO anon;
GRANT ALL ON tour_slots TO service_role;
