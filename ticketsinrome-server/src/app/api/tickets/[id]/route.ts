import { NextResponse } from 'next/server';
import { getTicketById } from '@/lib/ticketService';
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

        // Get format from query params (json or pdf)
        const url = new URL(req.url);
        const format = url.searchParams.get('format') || 'json';

        // Fetch ticket data from Payload CMS
        const ticket = await getTicketById(id);
        
        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        // Return JSON format (for app/API consumption)
        if (format === 'json') {
            return NextResponse.json({
                ticketId: ticket.id,
                bookingRef: ticket.bookingRef,
                tourTitle: ticket.tourTitle,
                tourSlug: ticket.tourSlug,
                customerName: ticket.customerName,
                customerEmail: ticket.customerEmail,
                date: ticket.date,
                time: ticket.time,
                guestCount: ticket.guestCount,
                guestCounts: ticket.guestCounts,
                totalPrice: ticket.totalPrice,
                qrCode: ticket.qrCode,
                meetingPoint: ticket.meetingPoint,
                status: ticket.status,
                createdAt: ticket.createdAt,
                addOns: ticket.addOns,
            });
        }

        // Return PDF format (for download)
        if (format === 'pdf') {
            // Map ticket to PDF generator format
            const guestBreakdown = ticket.guestCounts || {};
            const pdfData = {
                bookingRef: ticket.bookingRef,
                tourTitle: ticket.tourTitle,
                date: ticket.date,
                time: ticket.time,
                meetingPoint: ticket.meetingPoint || 'Via Tunisi 43, 00192 Roma RM, Italy',
                duration: '3 hours',
                customerName: ticket.customerName,
                guests: ticket.guestCount,
                adults: guestBreakdown['Adult'] || guestBreakdown['Adults'] || 0,
                students: guestBreakdown['Student'] || guestBreakdown['Students'] || 0,
                youths: guestBreakdown['Youth'] || guestBreakdown['Youths'] || 0,
                addOns: ticket.addOns || [],
                qrCode: ticket.qrCode,
                siteName: 'wondersofrome',
            };

            const pdfBuffer = await generateTicketPDF(pdfData);

            return new NextResponse(Buffer.from(pdfBuffer), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="ticket-${ticket.bookingRef}.pdf"`,
                },
            });
        }

        return NextResponse.json(
            { error: 'Invalid format. Use ?format=json or ?format=pdf' },
            { status: 400 }
        );

    } catch (err: any) {
        console.error('Ticket API error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to fetch ticket' },
            { status: 500 }
        );
    }
}
