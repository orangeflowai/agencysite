import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getSiteId(req: Request): Promise<string> {
    const h = await headers();
    return h.get('x-site-id') || process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            amount, tourTitle, tourSlug, meetingPoint, mapAddress, location,
            date, time, guests, guestCounts = {}, bookingDetails, addOns = []
        } = body;

        const siteId = await getSiteId(req);
        const stripe = getStripe(siteId);

        const legacyAdults   = guestCounts.Adult   || guestCounts.Adults   || body.adults   || 0;
        const legacyStudents = guestCounts.Student || guestCounts.Students || body.students || 0;
        const legacyYouths   = guestCounts.Youth   || guestCounts.Youths   || body.youths   || 0;

        const addOnsTotal = addOns.reduce((sum: number, a: any) => sum + (a.price * a.quantity), 0);
        const totalAmount = amount + addOnsTotal;

        if (!totalAmount || totalAmount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            metadata: {
                tourSlug,
                tourTitle,
                date,
                time,
                guests: guests.toString(),
                adults:   legacyAdults.toString(),
                students: legacyStudents.toString(),
                youths:   legacyYouths.toString(),
                guestCounts: JSON.stringify(guestCounts),
                siteId,
                leadEmail: bookingDetails?.leadTraveler?.email || '',
                leadName:  bookingDetails?.leadTraveler
                    ? `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}`
                    : '',
                leadPhone: bookingDetails?.leadTraveler?.phone || '',
                meetingPoint: meetingPoint || mapAddress || location || '',
                specialRequests: bookingDetails?.marketing?.specialRequests || '',
                addOns: JSON.stringify(addOns.map((a: any) => ({ name: a.name, price: a.price, quantity: a.quantity }))),
            },
            description: `${tourTitle} — ${date} at ${time} (${guests} guests)`,
            receipt_email: bookingDetails?.leadTraveler?.email,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (err: any) {
        console.error('[create-payment-intent]', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
