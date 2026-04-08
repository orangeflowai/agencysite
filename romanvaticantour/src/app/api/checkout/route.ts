
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';
import { client } from '@/sanity/lib/client';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to determine site from request — always falls back to NEXT_PUBLIC_SITE_ID
async function getSiteIdFromRequest(req: Request): Promise<string> {
    const headersList = await headers();
    const siteHeader = headersList.get('x-site-id');
    if (siteHeader) return siteHeader;
    return process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
}

// Helper to format currency
const formatAmountForStripe = (amount: number, currency: string) => {
    const numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    });
    const parts = numberFormat.formatToParts(amount);
    let zeroDecimalCurrency = true;
    for (const part of parts) {
        if (part.type === 'decimal') {
            zeroDecimalCurrency = false;
        }
    }
    return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tourTitle, tourSlug, date, time, guests, adults, students, youths, bookingDetails } = body;

        // Determine which site this request is for
        const siteId = await getSiteIdFromRequest(req);
        console.log(`[Checkout] Processing payment for site: ${siteId}`);

        // Get site-specific Stripe instance
        const stripe = getStripe(siteId);

        // Get site base URL from env
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

        // 0. SECURE PRICE CALCULATION (Fetch from Sanity)
        const tour = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]{
            price,
            studentPrice,
            youthPrice
        }`, { slug: tourSlug });

        if (!tour) {
            return NextResponse.json({ error: 'Tour not found.' }, { status: 404 });
        }

        const adultPrice = tour.price || 0;
        const studentPrice = tour.studentPrice || tour.price || 0;
        const youthPrice = tour.youthPrice || tour.price || 0;

        const totalAmount = (adults * adultPrice) + (students * studentPrice) + (youths * youthPrice);

        // Safety check: ensure total > 0
        if (totalAmount <= 0) {
            return NextResponse.json({ error: 'Invalid total amount.' }, { status: 400 });
        }

        // 1. VALIDATE INVENTORY
        const { data: inventory, error: inventoryError } = await supabase
            .from('inventory')
            .select('available_slots, id')
            .eq('tour_slug', tourSlug)
            .eq('date', date)
            .eq('time', time)
            .single();

        if (inventoryError) {
            console.error('Inventory check error:', inventoryError);
            return NextResponse.json({ error: 'Could not check availability.' }, { status: 500 });
        }

        if (!inventory || inventory.available_slots < guests) {
            return NextResponse.json({ error: 'Not enough spots available for this time.' }, { status: 400 });
        }

        // 2. Create Stripe Session with site-specific config
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `${tourTitle} (${date} at ${time})`,
                            description: `${adults} Adults, ${students} Students, ${youths} Youths`,
                        },
                        unit_amount: formatAmountForStripe(totalAmount, 'eur'),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/tour/${tourSlug}`,
            metadata: {
                tourSlug,
                date,
                time,
                guests,
                siteId, // Store site ID for webhook processing
                adults: adults || 0,
                students: students || 0,
                youths: youths || 0,
            },
        });

        // 3. Create Pending Booking in Supabase
        const { error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert({
                tour_slug: tourSlug,
                tour_title: tourTitle,
                date: date,
                time: time,
                customer_name: bookingDetails?.leadTraveler ? `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}` : 'Pending Customer',
                customer_email: bookingDetails?.leadTraveler?.email || 'pending@example.com',
                customer_phone: bookingDetails?.leadTraveler?.phone || null,
                guests: guests,
                total_price: Math.round(totalAmount * 100),
                status: 'pending_payment',
                stripe_session_id: session.id,
                adults: adults || 0,
                students: students || 0,
                youths: youths || 0,
                guest_details: bookingDetails, // Store the full structured object
                site_id: siteId,
            });

        if (bookingError) {
            console.error('Booking creation error:', bookingError);
            return NextResponse.json({ error: 'Failed to initialize booking.' }, { status: 500 });
        }

        return NextResponse.json({ sessionId: session.id, url: session.url });

    } catch (err: any) {
        console.error('Checkout API Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
