import { NextResponse } from 'next/server';
import { generateTicketPDF } from '@/lib/ticketGenerator';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
        }

        // Fetch real booking from Supabase — try by stripe_payment_intent_id first, then by id
        let bookingData: any = null;

        const { data: byIntent } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('stripe_payment_intent_id', id)
            .single();

        if (byIntent) {
            bookingData = byIntent;
        } else {
            const { data: byId } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', id)
                .single();
            bookingData = byId;
        }

        if (!bookingData) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Parse add-ons from guest_details
        let addOns: Array<{ name: string; price: number }> = [];
        try {
            const gd = bookingData.guest_details;
            if (gd?.addOns) {
                const raw = typeof gd.addOns === 'string' ? JSON.parse(gd.addOns) : gd.addOns;
                if (Array.isArray(raw)) addOns = raw;
            }
        } catch (_) {}

        const booking = {
            bookingRef: bookingData.id?.slice(-8).toUpperCase() || id.slice(-8).toUpperCase(),
            tourTitle: bookingData.tour_title || 'Tour',
            date: bookingData.date || '',
            time: bookingData.time || '',
            meetingPoint: bookingData.guest_details?.meetingPoint
                || process.env.NEXT_PUBLIC_DEFAULT_MEETING_POINT
                || 'See booking confirmation for details',
            duration: '3 hours',
            customerName: bookingData.customer_name || 'Guest',
            guests: bookingData.guests || 1,
            adults: bookingData.adults || 0,
            students: bookingData.students || 0,
            youths: bookingData.youths || 0,
            addOns,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME || process.env.NEXT_PUBLIC_SITE_ID || 'agency',
        };

        const pdfBuffer = await generateTicketPDF(booking);

        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ticket-${booking.bookingRef}.pdf"`,
            },
        });

    } catch (err: any) {
        console.error('Ticket generation error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to generate ticket' },
            { status: 500 }
        );
    }
}
