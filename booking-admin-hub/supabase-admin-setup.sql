-- ============================================================
-- MULTI-AGENCY ADMIN HUB — SUPABASE SQL MIGRATION
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ogrvhooygcoazracbvkb/sql
-- ============================================================

-- 1. ADMIN USERS TABLE
--    Maps each Supabase Auth user → their agency (site_id)
--    One login = one agency (separate logins per agency)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id TEXT NOT NULL,           -- e.g. 'rome-tour-tickets', 'romewander', 'roman-vatican-tour'
    role TEXT NOT NULL DEFAULT 'admin',  -- 'super_admin' | 'admin' | 'viewer'
    email TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can only read their own row
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_self_read" ON public.admin_users
    FOR SELECT USING (auth.uid() = auth_uid);

-- Super admins can read all users (set role = 'super_admin' manually for now)
CREATE POLICY "admin_users_super_read" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.auth_uid = auth.uid() AND au.role = 'super_admin'
        )
    );


-- 2. SITE PRODUCTS TABLE
--    Products created from the admin hub (Bokun-style)
--    Also synced to Sanity — Supabase is the fast-access cache
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT NOT NULL,
    sanity_id TEXT,                   -- Sanity document _id (populated after Sanity write)
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2),    -- For showing "was €X" strikethrough
    duration TEXT,
    category TEXT,
    meeting_point TEXT,
    max_participants INT DEFAULT 20,
    min_participants INT DEFAULT 1,
    badge TEXT,                        -- e.g. "Bestseller", "New"
    rating NUMERIC(3,1) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    images TEXT[],                     -- Array of image URLs
    tags TEXT[],                       -- e.g. ["Selling Fast", "10% OFF"]
    includes TEXT[],                   -- What's included
    excludes TEXT[],                   -- What's NOT included
    important_info TEXT[],             -- Know before you go
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by site
CREATE INDEX IF NOT EXISTS site_products_site_id_idx ON public.site_products(site_id);
CREATE INDEX IF NOT EXISTS site_products_slug_idx ON public.site_products(site_id, slug);

-- RLS: Admin users can only CRUD their own site's products
ALTER TABLE public.site_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_products_admin_access" ON public.site_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.auth_uid = auth.uid()
            AND (au.site_id = site_products.site_id OR au.role = 'super_admin')
        )
    );

-- PUBLIC READ (for frontends to fetch products)
CREATE POLICY "site_products_public_read" ON public.site_products
    FOR SELECT USING (is_active = true);


-- 3. SITE SETTINGS TABLE
--    Per-agency config saved from the admin panel
--    Frontends read this at runtime via API
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT UNIQUE NOT NULL,
    business_info JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    gdpr_settings JSONB DEFAULT '{}'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    notification_prefs JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admins can read/write their own site settings
CREATE POLICY "site_settings_admin_access" ON public.site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            WHERE au.auth_uid = auth.uid()
            AND (au.site_id = site_settings.site_id OR au.role = 'super_admin')
        )
    );

-- Public read for frontends
CREATE POLICY "site_settings_public_read" ON public.site_settings
    FOR SELECT USING (true);


-- ============================================================
-- SEED: Insert initial admin users
-- Replace the UUIDs with real auth.users IDs after creating
-- accounts in Supabase Auth → Users panel
-- ============================================================
-- Example inserts (replace auth_uid with real IDs from auth.users):
--
-- INSERT INTO public.admin_users (auth_uid, site_id, role, email, display_name)
-- VALUES
--   ('PASTE-AUTH-UUID-HERE', 'rome-tour-tickets', 'admin', 'admin@ticketsinrome.com', 'Tickets in Rome Admin'),
--   ('PASTE-AUTH-UUID-HERE', 'romewander', 'admin', 'admin@romewander.com', 'RomeWander Admin'),
--   ('PASTE-AUTH-UUID-HERE', 'roman-vatican-tour', 'admin', 'admin@romanvaticantour.com', 'Vatican Tour Admin');
--

-- ============================================================
-- SEED: Insert initial site settings rows (empty, to avoid NULL)
-- ============================================================
INSERT INTO public.site_settings (site_id) VALUES
    ('rome-tour-tickets'),
    ('romewander'),
    ('roman-vatican-tour')
ON CONFLICT (site_id) DO NOTHING;


-- ============================================================
-- HELPER FUNCTION: Get site_id for current auth user
-- Used by the admin API routes
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_site_id()
RETURNS TEXT AS $$
    SELECT site_id FROM public.admin_users
    WHERE auth_uid = auth.uid()
    LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;


-- ============================================================
-- UPDATE TRIGGER: auto-update updated_at on site_settings
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER site_products_updated_at
    BEFORE UPDATE ON public.site_products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
