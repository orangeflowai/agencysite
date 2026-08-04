-- ============================================================
-- Fix inventory table permissions and connect booking flow
-- Run in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- 1. GRANT proper permissions on inventory table
-- Ensures anon and authenticated roles can read, service role can do everything
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.inventory TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL PRIVILEGES ON public.inventory TO service_role;

-- 2. Drop old RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON inventory;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON inventory;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON inventory;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON inventory;

-- 3. Create proper RLS policies
-- Public read: booking widget needs to check availability without auth
CREATE POLICY "inventory_public_read" ON inventory
  FOR SELECT USING (true);

-- Authenticated insert (admin API uses service role, but fallback)
CREATE POLICY "inventory_auth_insert" ON inventory
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated update
CREATE POLICY "inventory_auth_update" ON inventory
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated delete
CREATE POLICY "inventory_auth_delete" ON inventory
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Fix inventory_errors table permissions (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'inventory_errors') THEN
    GRANT SELECT, INSERT ON public.inventory_errors TO authenticated;
    GRANT ALL PRIVILEGES ON public.inventory_errors TO service_role;
  END IF;
END $$;
