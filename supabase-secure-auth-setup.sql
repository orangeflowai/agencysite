-- ============================================
-- SECURE AUTH SETUP FOR MOBILE APP
-- Implements proper RLS with Supabase Auth
-- ============================================

-- ============================================
-- 1. ADD USER_ID COLUMN TO BOOKINGS
-- ============================================

-- Add user_id column to link bookings to authenticated users
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_user_id 
  ON public.bookings(user_id);

-- ============================================
-- 2. UPDATE RLS POLICIES (SECURE VERSION)
-- ============================================

-- Drop the unsafe public read policy
DROP POLICY IF EXISTS "Public read own bookings" ON public.bookings;

-- Allow users to read ONLY their own bookings (by user_id)
CREATE POLICY "Users read own bookings by user_id" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to read bookings by email (for backward compatibility during migration)
-- This is temporary - remove after all users are migrated to auth
CREATE POLICY "Users read own bookings by email" 
  ON public.bookings 
  FOR SELECT 
  USING (
    auth.jwt() ->> 'email' = customer_email
    OR auth.uid() = user_id
  );

-- Admin/Service role can do everything
DROP POLICY IF EXISTS "Admin full access" ON public.bookings;
CREATE POLICY "Admin full access bookings" 
  ON public.bookings 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- ============================================
-- 3. CREATE FUNCTION TO LINK EXISTING BOOKINGS
-- ============================================

-- Function to link existing bookings to users when they sign in
CREATE OR REPLACE FUNCTION link_bookings_to_user()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user signs in, link all bookings with their email to their user_id
  UPDATE public.bookings
  SET user_id = NEW.id
  WHERE customer_email = NEW.email
    AND user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run this function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_bookings_to_user();

-- ============================================
-- 4. UPDATE WEBHOOK TO SET USER_ID
-- ============================================

-- Note: Your webhook code should be updated to:
-- 1. Check if user exists with customer_email
-- 2. If yes, set user_id when creating booking
-- 3. If no, just set customer_email (user_id will be linked when they sign in)

-- Example webhook logic (add to your webhook code):
/*
// In your webhook after getting customer_email:
const { data: existingUser } = await supabaseAdmin
  .from('auth.users')
  .select('id')
  .eq('email', customer_email)
  .single();

const booking_data = {
  ...other_fields,
  customer_email: customer_email,
  user_id: existingUser?.id || null  // Link if user exists
};
*/

-- ============================================
-- 5. CREATE SECURE VIEW FOR USER TICKETS
-- ============================================

-- Drop old view
DROP VIEW IF EXISTS public.user_tickets;

-- Create secure view that respects RLS
CREATE VIEW public.user_tickets AS
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
  b.user_id,
  CASE 
    WHEN b.site_id = 'wondersofrome' THEN ARRAY['#1e3a8a', '#1e40af']
    ELSE ARRAY['#047857', '#065f46']
  END as colors
FROM public.bookings b
WHERE b.status = 'paid'
  AND (
    b.user_id = auth.uid()  -- User's own bookings
    OR auth.jwt() ->> 'email' = b.customer_email  -- Or by email (temporary)
  )
ORDER BY b.date DESC;

-- Grant access to authenticated users
GRANT SELECT ON public.user_tickets TO authenticated;
GRANT SELECT ON public.user_tickets TO anon;

-- ============================================
-- 6. MIGRATION: LINK EXISTING BOOKINGS
-- ============================================

-- Run this to link existing bookings to users who already have accounts
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, email FROM auth.users
  LOOP
    UPDATE public.bookings
    SET user_id = user_record.id
    WHERE customer_email = user_record.email
      AND user_id IS NULL;
  END LOOP;
END $$;

-- ============================================
-- 7. VERIFICATION
-- ============================================

-- Check how many bookings are linked vs unlinked
SELECT 
  'Bookings Status' as check_type,
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_bookings,
  COUNT(*) FILTER (WHERE user_id IS NULL) as unlinked_bookings,
  COUNT(*) as total_bookings
FROM public.bookings;

-- Check RLS policies
SELECT 
  'RLS Policies' as check_type,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'bookings'
ORDER BY policyname;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

SELECT '✅ Secure auth setup complete!' as status;
SELECT 'Next: Update mobile app to use Supabase Auth (Magic Link)' as next_step;