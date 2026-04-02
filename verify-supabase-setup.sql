-- ============================================
-- VERIFY SUPABASE SETUP FOR MOBILE APP
-- ============================================

-- 1. Check if all tables exist
SELECT 
  'Tables Check' as verification_step,
  table_name,
  CASE 
    WHEN table_name IN ('concierge_agents', 'office_locations', 'faqs', 'bookings', 'tours', 'inventory') 
    THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('concierge_agents', 'office_locations', 'faqs', 'bookings', 'tours', 'inventory')
ORDER BY table_name;

-- 2. Check if views were created
SELECT 
  'Views Check' as verification_step,
  table_name as view_name,
  '✅ EXISTS' as status
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('user_tickets', 'available_tours')
ORDER BY table_name;

-- 3. Check sample data counts
SELECT 'Sample Data Check' as verification_step, 'concierge_agents' as table_name, COUNT(*)::text || ' rows' as status FROM public.concierge_agents
UNION ALL
SELECT 'Sample Data Check', 'office_locations', COUNT(*)::text || ' rows' FROM public.office_locations
UNION ALL
SELECT 'Sample Data Check', 'faqs', COUNT(*)::text || ' rows' FROM public.faqs;

-- 4. Check RLS policies
SELECT 
  'RLS Policies Check' as verification_step,
  schemaname || '.' || tablename as table_name,
  policyname as policy_name,
  '✅ ACTIVE' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('concierge_agents', 'office_locations', 'faqs', 'bookings')
ORDER BY tablename, policyname;

-- 5. Check indexes
SELECT 
  'Indexes Check' as verification_step,
  tablename as table_name,
  indexname as index_name,
  '✅ CREATED' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('bookings', 'faqs')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 6. Check bookings table columns
SELECT 
  'Bookings Columns Check' as verification_step,
  column_name,
  data_type,
  CASE 
    WHEN column_name IN ('site_id', 'stripe_payment_intent_id') 
    THEN '✅ EXISTS'
    ELSE 'ℹ️ STANDARD'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'bookings'
  AND column_name IN ('id', 'tour_title', 'customer_email', 'site_id', 'stripe_payment_intent_id', 'status', 'date')
ORDER BY 
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'tour_title' THEN 2
    WHEN 'customer_email' THEN 3
    WHEN 'site_id' THEN 4
    WHEN 'stripe_payment_intent_id' THEN 5
    WHEN 'status' THEN 6
    WHEN 'date' THEN 7
  END;

-- 7. Test query: Fetch sample concierge data
SELECT 
  'Sample Query Test' as verification_step,
  'Concierge Agent: ' || name as result,
  '✅ READABLE' as status
FROM public.concierge_agents
LIMIT 2;

-- 8. Test query: Fetch sample FAQs
SELECT 
  'Sample Query Test' as verification_step,
  'FAQ: ' || LEFT(question, 50) || '...' as result,
  '✅ READABLE' as status
FROM public.faqs
ORDER BY order_index
LIMIT 3;

-- 9. Summary
SELECT 
  '========================================' as summary,
  'SETUP VERIFICATION COMPLETE' as status,
  '========================================' as note;

SELECT 
  'Next Steps:' as summary,
  '1. Add .env file to mobile app' as status,
  '2. Restart app with: npx expo start -c' as note
UNION ALL
SELECT 
  'Next Steps:',
  '3. Test fetching data in app',
  '4. Verify tickets appear in Wallet';
