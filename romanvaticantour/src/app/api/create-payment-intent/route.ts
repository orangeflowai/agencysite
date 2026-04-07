import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to determine site from request
async function getSiteIdFromRequest(req: Request): Promise<string> {
    const headersList = await headers();
    const siteHeader = headersList.get('x-site-id');
    if (siteHeader) return siteHeader;
    return process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
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

        // For backward compatibility in metadata
        const legacyAdults = guestCounts.Adult || guestCounts.Adults || body.adults || 0;
        const legacyStudents = guestCounts.Student || guestCounts.Students || body.students || 0;
        const legacyYouths = guestCounts.Youth || guestCounts.Youths || body.youths || 0;

        // Calculate total with add-ons
        const addOnsTotal = addOns.reduce((sum: number, addon: any) => sum + (addon.price * addon.quantity), 0);
        const totalAmount = amount + addOnsTotal;

        // Stripe metadata values are capped at 500 chars each — truncate safely
        const safeJson = (val: any, max = 490) => {
            const s = JSON.stringify(val);
            return s.length > max ? s.slice(0, max) : s;
        };

        // Create payment intent with multiple payment methods
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            metadata: {
                tourSlug:      (tourSlug || '').slice(0, 490),
                tourTitle:     (tourTitle || '').slice(0, 490),
                date:          (date || '').slice(0, 100),
                time:          (time || '').slice(0, 100),
                guests:        guests.toString(),
                adults:        legacyAdults.toString(),
                students:      legacyStudents.toString(),
                youths:        legacyYouths.toString(),
                guestCounts:   safeJson(guestCounts),
                siteId,
                leadEmail:     (bookingDetails?.leadTraveler?.email || '').slice(0, 490),
                leadName:      (bookingDetails?.leadTraveler
                    ? `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}`
                    : '').slice(0, 490),
                leadPhone:     (bookingDetails?.leadTraveler?.phone || '').slice(0, 100),
                addOns:        safeJson(addOns.map((a: any) => ({ name: a.name, price: a.price, quantity: a.quantity }))),
                meetingPoint:  (meetingPoint || '').slice(0, 490),
            },
            description: `${tourTitle} - ${date} at ${time} (${guests} guests)`,
            receipt_email: bookingDetails?.leadTraveler?.email || undefined,
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
