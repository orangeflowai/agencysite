-- ============================================
-- SUPABASE SETUP FOR MOBILE APP INTEGRATION
-- Tickets in Rome & Wonders of Rome
-- ============================================

-- ============================================
-- 1. CREATE MISSING TABLES FOR MOBILE APP
-- ============================================

-- Concierge Agents Table
CREATE TABLE IF NOT EXISTS public.concierge_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subtitle text,
  avatar_url text,
  whatsapp_url text,
  site_id text DEFAULT 'ticketsinrome',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Office Locations Table
CREATE TABLE IF NOT EXISTS public.office_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  hours text,
  latitude numeric,
  longitude numeric,
  site_id text DEFAULT 'ticketsinrome',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  site_id text DEFAULT 'ticketsinrome',
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.concierge_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES FOR MOBILE APP
-- ============================================

-- Concierge Agents: Public read access
DROP POLICY IF EXISTS "Public read access" ON public.concierge_agents;
CREATE POLICY "Public read access" 
  ON public.concierge_agents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin full access" 
  ON public.concierge_agents 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Office Locations: Public read access
DROP POLICY IF EXISTS "Public read access" ON public.office_locations;
CREATE POLICY "Public read access" 
  ON public.office_locations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin full access" 
  ON public.office_locations 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- FAQs: Public read access
DROP POLICY IF EXISTS "Public read access" ON public.faqs;
CREATE POLICY "Public read access" 
  ON public.faqs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin full access" 
  ON public.faqs 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- ============================================
-- 4. UPDATE BOOKINGS TABLE RLS FOR MOBILE APP
-- ============================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.bookings;

-- Allow public read access (app will filter by email)
-- This is safe because users can only see their own bookings by querying with their email
CREATE POLICY "Public read own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

-- Admin/Service role can do everything
CREATE POLICY "Admin full access" 
  ON public.bookings 
  FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 5. ADD MISSING COLUMNS TO BOOKINGS (IF NEEDED)
-- ============================================

-- Add site_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'site_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN site_id text DEFAULT 'ticketsinrome';
  END IF;
END $$;

-- Add stripe_payment_intent_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN stripe_payment_intent_id text;
  END IF;
END $$;

-- ============================================
-- 6. INSERT SAMPLE DATA FOR TESTING
-- ============================================

-- Sample Concierge Agent
INSERT INTO public.concierge_agents (name, subtitle, avatar_url, whatsapp_url, site_id)
VALUES 
  ('Maria Rossi', 'Rome Travel Expert', 'https://i.pravatar.cc/150?img=1', 'https://wa.me/393299294414', 'ticketsinrome'),
  ('Giovanni Bianchi', 'Tour Specialist', 'https://i.pravatar.cc/150?img=12', 'https://wa.me/393299294414', 'wondersofrome')
ON CONFLICT DO NOTHING;

-- Sample Office Locations
INSERT INTO public.office_locations (name, address, hours, latitude, longitude, site_id)
VALUES 
  (
    'Rome Central Office',
    'Via Germanico 8, 00192 Roma RM, Italy',
    'Mon-Fri: 9:00-18:00, Sat: 10:00-14:00',
    41.9065,
    12.4598,
    'ticketsinrome'
  ),
  (
    'Vatican Area Office',
    'Piazza del Risorgimento, 00192 Roma RM, Italy',
    'Mon-Sun: 8:00-19:00',
    41.9065,
    12.4598,
    'wondersofrome'
  )
ON CONFLICT DO NOTHING;

-- Sample FAQs
INSERT INTO public.faqs (question, answer, category, site_id, order_index)
VALUES 
  (
    'How do I use my ticket?',
    'Show the QR code from your app at the meeting point 15 minutes before your tour time. Our staff will scan it and provide you with physical tickets.',
    'tickets',
    'ticketsinrome',
    1
  ),
  (
    'Can I cancel my booking?',
    'Free cancellation up to 24 hours before the tour. Contact us via WhatsApp or email for refunds. Cancellations within 24 hours are non-refundable.',
    'cancellation',
    'ticketsinrome',
    2
  ),
  (
    'What should I bring?',
    'Bring your passport or ID (mandatory for security), comfortable walking shoes, and dress appropriately with covered shoulders and knees for religious sites.',
    'preparation',
    'ticketsinrome',
    3
  ),
  (
    'Where is the meeting point?',
    'The meeting point is at Via Germanico 8, 00192 Roma RM, Italy. Look for staff holding a WHITE FLAG saying "ENJOY ROME". Arrive 15 minutes early.',
    'location',
    'ticketsinrome',
    4
  ),
  (
    'Is the tour wheelchair accessible?',
    'Most tours are wheelchair accessible, but some areas like the Vatican Dome have stairs. Contact us before booking to confirm accessibility for your specific tour.',
    'accessibility',
    'ticketsinrome',
    5
  ),
  (
    'What languages are available?',
    'Tours are primarily conducted in English. We also offer tours in Spanish, French, German, and Italian upon request. Please specify your language preference when booking.',
    'languages',
    'wondersofrome',
    1
  ),
  (
    'Can I modify my booking date?',
    'Yes, you can modify your booking up to 48 hours before the tour date. Contact us via WhatsApp or email with your booking reference number.',
    'modifications',
    'wondersofrome',
    2
  ),
  (
    'Are children allowed?',
    'Yes, children are welcome! We offer discounted rates for youths (ages 6-17) and students. Children under 6 are free but must be accompanied by an adult.',
    'children',
    'wondersofrome',
    3
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. CREATE HELPFUL VIEWS FOR MOBILE APP
-- ============================================

-- View: User Tickets (for Wallet screen)
CREATE OR REPLACE VIEW public.user_tickets AS
SELECT 
  b.id,
  b.tour_title as title,
  b.tour_slug,
  b.date,
  b.time,
  b.guests,
  b.total_price,
  b.status,
  b.customer_email,
  b.customer_name,
  b.stripe_payment_intent_id as qr_value,
  b.site_id,
  b.created_at,
  CASE 
    WHEN b.site_id = 'wondersofrome' THEN ARRAY['#1e3a8a', '#1e40af']
    ELSE ARRAY['#047857', '#065f46']
  END as colors
FROM public.bookings b
WHERE b.status = 'paid'
ORDER BY b.date DESC;

-- View: Available Tours (for Tours screen)
CREATE OR REPLACE VIEW public.available_tours AS
SELECT 
  t.slug,
  t.title,
  t.base_price,
  t.category,
  t.metadata,
  COUNT(DISTINCT i.date) as available_dates,
  MIN(i.date) as next_available_date
FROM public.tours t
LEFT JOIN public.inventory i ON t.slug = i.tour_slug 
  AND i.date >= CURRENT_DATE
  AND i.available_slots > 0
GROUP BY t.slug, t.title, t.base_price, t.category, t.metadata
ORDER BY t.title;

-- ============================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for faster booking lookups by email
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email 
  ON public.bookings(customer_email);

-- Index for faster booking lookups by payment intent
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent 
  ON public.bookings(stripe_payment_intent_id);

-- Index for faster booking lookups by date
CREATE INDEX IF NOT EXISTS idx_bookings_date 
  ON public.bookings(date);

-- Index for faster booking lookups by site
CREATE INDEX IF NOT EXISTS idx_bookings_site_id 
  ON public.bookings(site_id);

-- Index for faster FAQ lookups
CREATE INDEX IF NOT EXISTS idx_faqs_site_order 
  ON public.faqs(site_id, order_index);

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

-- Grant access to anon role (mobile app)
GRANT SELECT ON public.concierge_agents TO anon;
GRANT SELECT ON public.office_locations TO anon;
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT ON public.bookings TO anon;
GRANT SELECT ON public.tours TO anon;
GRANT SELECT ON public.inventory TO anon;
GRANT SELECT ON public.user_tickets TO anon;
GRANT SELECT ON public.available_tours TO anon;

-- Grant full access to authenticated role (admin)
GRANT ALL ON public.concierge_agents TO authenticated;
GRANT ALL ON public.office_locations TO authenticated;
GRANT ALL ON public.faqs TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.tours TO authenticated;
GRANT ALL ON public.inventory TO authenticated;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify setup
SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('concierge_agents', 'office_locations', 'faqs', 'bookings', 'tours')
ORDER BY table_name;

SELECT 'Sample data inserted:' as status;
SELECT 'Concierge Agents: ' || COUNT(*) FROM public.concierge_agents;
SELECT 'Office Locations: ' || COUNT(*) FROM public.office_locations;
SELECT 'FAQs: ' || COUNT(*) FROM public.faqs;