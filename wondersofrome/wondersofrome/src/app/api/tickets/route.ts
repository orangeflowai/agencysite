import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('lead_email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to the format the mobile app expects
    const tickets = (data || []).map((b: any) => ({
      bookingRef: b.booking_ref,
      customerEmail: b.lead_email,
      customerName: `${b.lead_first_name || ''} ${b.lead_last_name || ''}`.trim(),
      tourTitle: b.tour_title,
      tourSlug: b.tour_slug || '',
      date: b.date,
      time: b.time,
      guestCount: b.guests,
      totalPrice: b.total_amount,
      currency: b.currency || 'EUR',
      status: b.status,
      meetingPoint: b.meeting_point,
      stripePaymentIntentId: b.stripe_payment_intent_id,
      createdAt: b.created_at,
    }));

    // CORS headers for mobile app
    return NextResponse.json(tickets, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err: any) {
    console.error('[tickets] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
