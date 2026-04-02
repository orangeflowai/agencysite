import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { generateTicketPDF } from '@/lib/ticketGenerator';

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

        // Fetch booking from Supabase or Sanity
        // For now, we'll use a mock structure - replace with your actual data fetching
        const booking = {
            bookingRef: id,
            tourTitle: 'Vatican Museums Skip-the-Line Tour',
            date: 'February 15, 2026',
            time: '09:00 AM',
            meetingPoint: 'Via Vespasiano 20, Rome (near Ottaviano Metro)',
            duration: '3 hours',
            customerName: 'John Doe',
            guests: 4,
            adults: 2,
            students: 2,
            youths: 0,
            addOns: [
                { name: 'Hotel Pickup Service', price: 45 },
                { name: 'Audio Guide Rental', price: 30 }
            ],
            siteName: 'wondersofrome',
        };

        // Generate PDF
        const pdfBuffer = await generateTicketPDF(booking);

        // Return PDF (convert Uint8Array to Buffer)
        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ticket-${id}.pdf"`,
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
