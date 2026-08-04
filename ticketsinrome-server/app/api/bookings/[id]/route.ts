import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paymentIntentId } = await params;

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 });
  }

  const payloadUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (!payloadUrl) {
    return NextResponse.json({ error: 'Payload CMS not configured' }, { status: 500 });
  }

  try {
    // Authenticate with Payload CMS
    const loginRes = await fetch(`${payloadUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com',
        password: process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!',
      }),
    });

    if (!loginRes.ok) {
      console.error('[bookings] Payload auth failed');
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }

    const { token } = await loginRes.json();

    // Fetch booking by payment intent ID
    const bookingRes = await fetch(
      `${payloadUrl}/api/bookings?where[stripePaymentIntentId][equals]=${encodeURIComponent(paymentIntentId)}&limit=1&depth=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!bookingRes.ok) {
      console.error('[bookings] Payload fetch failed');
      return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }

    const bookingData = await bookingRes.json();

    if (!bookingData?.docs?.length) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingData.docs[0];

    // Transform to match the expected format for the success page
    const response = {
      id: booking.bookingRef || booking.id,
      tourTitle: booking.tourTitle || 'Tour',
      tourSlug: booking.tourSlug || '',
      date: booking.date || '',
      time: booking.time || '',
      guests: booking.guests || 1,
      totalAmount: booking.totalAmount || 0,
      customerName: `${booking.leadFirstName || ''} ${booking.leadLastName || ''}`.trim() || 'Guest',
      customerEmail: booking.leadEmail || '',
      customerPhone: booking.leadPhone || '',
      meetingPoint: booking.meetingPoint || '',
      status: booking.status || 'confirmed',
      createdAt: booking.createdAt || new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[bookings] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
