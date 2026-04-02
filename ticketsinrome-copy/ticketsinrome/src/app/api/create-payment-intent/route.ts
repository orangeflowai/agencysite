import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to determine site from request
async function getSiteIdFromRequest(req: Request): Promise<string> {
    const headersList = await headers();
    const siteHeader = headersList.get('x-site-id');
    if (siteHeader) return siteHeader;

    const referer = req.headers.get('referer') || '';
    if (referer.includes('wondersofrome') || referer.includes('wonders-of-rome')) {
        return 'wondersofrome';
    }
    if (referer.includes('rome-tour-tickets') || referer.includes('ticketsinrome')) {
        return 'rome-tour-tickets';
    }

    const url = new URL(req.url);
    const host = url.hostname;
    if (host.includes('wondersofrome') || host.includes('wonders-of-rome')) {
        return 'wondersofrome';
    }

    return process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets';
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            amount,
            tourTitle,
            tourSlug,
            meetingPoint,
            date,
            time,
            guests,
            guestCounts = {},
            bookingDetails,
            addOns = []
        } = body;

        // Determine site
        const siteId = await getSiteIdFromRequest(req);
        const stripe = getStripe(siteId);

        // Calculate total with add-ons
        const addOnsTotal = addOns.reduce((sum: number, addon: any) => sum + (addon.price * addon.quantity), 0);
        const totalAmount = amount + addOnsTotal;

        // Create payment intent with multiple payment methods
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            metadata: {
                tourSlug,
                tourTitle,
                date,
                time,
                guests: guests.toString(),
                guestCounts: JSON.stringify(guestCounts),
                guestSummary: Object.entries(guestCounts)
                    .filter(([_, count]) => (count as number) > 0)
                    .map(([type, count]) => `${count} ${type}`)
                    .join(', '),
                siteId,
                leadEmail: bookingDetails?.leadTraveler?.email || '',
                leadName: bookingDetails?.leadTraveler ?
                    `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}` : '',
                leadPhone: bookingDetails?.leadTraveler?.phone || '',
                hotelName: bookingDetails?.logistics?.hotelName || '',
                pickupRequired: bookingDetails?.logistics?.pickupRequired ? 'yes' : 'no',
                luggageDeposit: bookingDetails?.logistics?.luggageDeposit ? 'yes' : 'no',
                addOns: JSON.stringify(addOns.map((a: any) => ({ name: a.name, price: a.price }))),
                meetingPoint: meetingPoint || 'See booking confirmation for details',
            },
            description: `${tourTitle} - ${date} at ${time} (${guests} guests)`,
            receipt_email: bookingDetails?.leadTraveler?.email,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (err: any) {
        console.error('Payment Intent Error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
