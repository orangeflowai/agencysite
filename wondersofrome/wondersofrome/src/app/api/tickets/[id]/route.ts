import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateTicketPDF } from '@/lib/ticketGenerator';

export const dynamic = 'force-dynamic';

const API_KEY = process.env.MOBILE_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require same auth as the list endpoint
    if (!API_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const apiKey = request.headers.get('x-api-key') || token;
    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    // Get format from query params (json or pdf)
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try booking_ref first, then stripe_payment_intent_id
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`booking_ref.eq.${id},stripe_payment_intent_id.eq.${id}`)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Return JSON format (for app/API consumption)
    if (format === 'json') {
      return NextResponse.json({
        bookingRef: data.booking_ref,
        customerName: `${data.lead_first_name || ''} ${data.lead_last_name || ''}`.trim(),
        customerEmail: data.lead_email,
        tourTitle: data.tour_title,
        date: data.date,
        time: data.time,
        guests: data.guests,
        totalPrice: data.total_amount,
        currency: data.currency || 'EUR',
        status: data.status,
        meetingPoint: data.meeting_point,
        participantDetails: data.participant_details,
        guestCounts: data.guest_counts,
        stripePaymentIntentId: data.stripe_payment_intent_id,
      });
    }

    // Return PDF format (for download)
    if (format === 'pdf') {
      const guestBreakdown = data.guest_counts || {};
      const pdfData = {
        bookingRef: data.booking_ref,
        tourTitle: data.tour_title,
        date: data.date,
        time: data.time,
        meetingPoint: data.meeting_point || 'Via Tunisi 43, 00192 Roma RM, Italy',
        duration: '3 hours',
        customerName: `${data.lead_first_name || ''} ${data.lead_last_name || ''}`.trim(),
        guests: data.guests,
        adults: guestBreakdown['Adult'] || guestBreakdown['Adults'] || 0,
        students: guestBreakdown['Student'] || guestBreakdown['Students'] || 0,
        youths: guestBreakdown['Youth'] || guestBreakdown['Youths'] || 0,
        addOns: data.add_ons || [],
        qrCode: data.qr_code,
        siteName: 'wondersofrome',
      };

      const pdfBuffer = await generateTicketPDF(pdfData);

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="ticket-${data.booking_ref}.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Use ?format=json or ?format=pdf' },
      { status: 400 }
    );

  } catch (err: any) {
    console.error('[ticket] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}
