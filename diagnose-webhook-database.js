/**
 * Diagnostic script to check webhook database saving issue
 * Run: node diagnose-webhook-database.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: './ticketsinrome-live/rome-tour-tickets/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
    console.log('🔍 Diagnosing Webhook Database Issue\n');
    console.log('=' .repeat(60));

    // Test 1: Check if bookings table exists
    console.log('\n📋 Test 1: Check bookings table structure');
    const { data: tables, error: tableError } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);

    if (tableError) {
        console.error('❌ Cannot access bookings table:', tableError.message);
        return;
    }
    console.log('✅ Bookings table accessible');

    // Test 2: Try to insert a test booking (similar to webhook)
    console.log('\n📋 Test 2: Simulate webhook booking insert');
    
    const testBooking = {
        tour_title: 'Test Tour',
        tour_slug: 'test-tour',
        date: '2026-03-20',
        time: '10:00 AM',
        guests: 2,
        total_price: 100,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '+1234567890',
        status: 'paid',
        stripe_payment_intent_id: 'pi_test_' + Date.now(),
        adults: 2,
        students: 0,
        youths: 0,
        guest_details: {
            hotel: null,
            pickup: null,
            luggage: null,
            addOns: [],
            guestCounts: { adults: 2, students: 0, youths: 0 }
        },
        site_id: 'ticketsinrome',
    };

    const { data: insertedBooking, error: insertError } = await supabase
        .from('bookings')
        .insert(testBooking)
        .select()
        .single();

    if (insertError) {
        console.error('❌ Insert failed:', insertError.message);
        console.error('Error details:', insertError);
        
        // Check if it's an RLS policy issue
        if (insertError.message.includes('policy') || insertError.code === '42501') {
            console.log('\n⚠️  This appears to be an RLS (Row Level Security) policy issue');
            console.log('The service role key should bypass RLS, but there might be a configuration issue.');
        }
        
        return;
    }

    console.log('✅ Test booking inserted successfully');
    console.log('Booking ID:', insertedBooking.id);

    // Clean up test booking
    await supabase.from('bookings').delete().eq('id', insertedBooking.id);
    console.log('✅ Test booking cleaned up');

    // Test 3: Check RLS policies
    console.log('\n📋 Test 3: Check RLS policies on bookings table');
    const { data: policies, error: policyError } = await supabase
        .rpc('get_table_policies', { table_name: 'bookings' })
        .catch(() => ({ data: null, error: { message: 'RPC function not available' } }));

    if (policyError || !policies) {
        console.log('⚠️  Cannot check RLS policies (this is normal if RPC function doesn\'t exist)');
    } else {
        console.log('RLS Policies:', policies);
    }

    // Test 4: Check recent bookings
    console.log('\n📋 Test 4: Check recent bookings');
    const { data: recentBookings, error: recentError } = await supabase
        .from('bookings')
        .select('id, tour_title, customer_email, status, created_at, site_id')
        .order('created_at', { ascending: false })
        .limit(5);

    if (recentError) {
        console.error('❌ Cannot fetch recent bookings:', recentError.message);
    } else {
        console.log(`✅ Found ${recentBookings.length} recent bookings:`);
        recentBookings.forEach(b => {
            console.log(`  - ${b.tour_title} | ${b.customer_email} | ${b.status} | ${b.site_id} | ${b.created_at}`);
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnosis complete');
}

diagnose().catch(console.error);
