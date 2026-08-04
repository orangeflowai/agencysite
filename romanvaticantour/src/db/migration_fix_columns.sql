-- ============================================================
-- Fix schema mismatches — RUN IN SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/ogrvhooygcoazracbvkb
-- ============================================================

-- 1. Add tour_slug column to inventory
-- All application code queries inventory by tour_slug (URL slug like
-- 'vatican-museums-guided-tour'), but the table has tour_id instead.
-- This adds the missing column so queries work.
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS tour_slug text;

-- Copy any tour_id values (if text slugs) to tour_slug
UPDATE inventory SET tour_slug = tour_id
WHERE tour_slug IS NULL AND tour_id IS NOT NULL;

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_inventory_tour_slug ON inventory(tour_slug);
CREATE INDEX IF NOT EXISTS idx_inventory_tour_slug_date ON inventory(tour_slug, date);

-- 2. Add updated_at to inventory (used by inventoryService.ts)
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS updated_at
  timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 3. Make sure inventory has proper RLS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.inventory TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL PRIVILEGES ON public.inventory TO service_role;

DROP POLICY IF EXISTS "Enable read access for all users" ON inventory;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON inventory;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON inventory;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON inventory;
DROP POLICY IF EXISTS "inventory_public_read" ON inventory;
DROP POLICY IF EXISTS "inventory_auth_insert" ON inventory;
DROP POLICY IF EXISTS "inventory_auth_update" ON inventory;
DROP POLICY IF EXISTS "inventory_auth_delete" ON inventory;

CREATE POLICY "inventory_public_read" ON inventory FOR SELECT USING (true);
CREATE POLICY "inventory_auth_insert" ON inventory FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "inventory_auth_update" ON inventory FOR UPDATE
  USING (auth.role() = 'authenticated');
CREATE POLICY "inventory_auth_delete" ON inventory FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. After running this, seed inventory data:
-- Visit /api/seed-inventory (admin login required)
-- This creates 90 days of slots for all tours
