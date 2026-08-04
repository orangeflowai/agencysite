import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getTour } from '@/lib/sanityService';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function getSiteId(req: Request): Promise<string> {
    const h = await headers();
    return h.get('x-site-id') || process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
}

/**
 * Compute server-authoritative total price from Sanity tour data.
 * Never trusts client-supplied amount.
 */
function computeServerPrice(
    tour: { price: number; guestTypes?: Array<{ name: string; price: number }>; studentPrice?: number; youthPrice?: number },
    guestCounts: Record<string, number>,
    guests: number,
    addOns: Array<{ name: string; price: number; quantity: number }>
): number {
    let total = 0;

    // If guestTypes are configured, use per-type pricing
    if (tour.guestTypes && tour.guestTypes.length > 0) {
        for (const gt of tour.guestTypes) {
            const count = guestCounts[gt.name] || 0;
            total += (gt.price || tour.price) * count;
        }
        // Any uncategorized guests fall back to base price
        const categorized = tour.guestTypes.reduce((sum: number, gt: any) => sum + (guestCounts[gt.name] || 0), 0);
        const remaining = guests - categorized;
        if (remaining > 0) total += tour.price * remaining;
    } else {
        total = tour.price * guests;
    }

    // Add-ons
    const addOnsTotal = addOns.reduce((sum: number, a: any) => sum + (a.price * a.quantity), 0);
    return total + addOnsTotal;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            amount, tourTitle, tourSlug, meetingPoint, mapAddress, location,
            date, time, guests, guestCounts = {}, bookingDetails, addOns = []
        } = body;

        const siteId = await getSiteId(req);

        // ── Server-side price validation ──
        const tour = await getTour(tourSlug, siteId);
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        const serverPrice = computeServerPrice(tour, guestCounts, guests, addOns);
        const clientAmount = amount || 0;
        const addOnsTotalFromClient = addOns.reduce((sum: number, a: any) => sum + (a.price * a.quantity), 0);
        const clientTotal = clientAmount + addOnsTotalFromClient;

        // Allow €1 tolerance for rounding
        if (Math.abs(clientTotal - serverPrice) > 1) {
            console.warn(`[create-payment-intent] Price mismatch: client=${clientTotal}, server=${serverPrice}, tour=${tourSlug}`);
            return NextResponse.json({
                error: 'Price mismatch',
                serverPrice,
                clientPrice: clientTotal,
            }, { status: 400 });
        }

        const totalAmount = serverPrice;

        // ── Inventory check ──
        const { data: slot } = await supabaseAdmin
            .from('tour_slots')
            .select('available_slots')
            .eq('tour_slug', tourSlug)
            .eq('date', date)
            .eq('time', time)
            .maybeSingle();

        if (!slot || slot.available_slots < guests) {
            return NextResponse.json({
                error: 'Sold out',
                availableSlots: slot?.available_slots ?? 0,
            }, { status: 409 });
        }

        // ── Create PaymentIntent ──
        const stripe = getStripe(siteId);

        const legacyAdults   = guestCounts.Adult   || guestCounts.Adults   || body.adults   || 0;
        const legacyStudents = guestCounts.Student || guestCounts.Students || body.students || 0;
        const legacyYouths   = guestCounts.Youth   || guestCounts.Youths   || body.youths   || 0;

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
                participants: JSON.stringify(
                    (bookingDetails?.participants || []).map((p: any) => ({
                        index: p.index,
                        label: p.label,
                        name: p.name,
                        dob: p.dob || '',
                    }))
                ),
                // Stamp server-verified price for webhook reconciliation
                serverVerifiedPrice: serverPrice.toString(),
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
