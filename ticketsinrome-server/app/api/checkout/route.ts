import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabase';
import { client } from '@/sanity/lib/client';
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
        return 'ticketsinrome';
    }

    return process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome';
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tourTitle, tourSlug, date, time, guests, adults, students, youths, bookingDetails } = body;

        const siteId = await getSiteIdFromRequest(req);
        const stripe = getStripe(siteId);

        const baseUrl = siteId === 'wondersofrome' 
            ? (process.env.NEXT_PUBLIC_SITE_URL_WONDERS || process.env.NEXT_PUBLIC_SITE_URL || 'https://wondersofrome.com')
            : (process.env.NEXT_PUBLIC_SITE_URL_ROME || process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketsinrome.com');

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

        if (inventoryError && inventoryError.code !== 'PGRST116') {
            console.error('Inventory check error:', inventoryError);
            return NextResponse.json({ error: 'Could not check availability.' }, { status: 500 });
        }

        if (inventory && inventory.available_slots < guests) {
            return NextResponse.json({ error: 'Not enough spots available.' }, { status: 400 });
        }

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: tourTitle,
                            description: `${date} at ${time} — ${guests} guests`,
                        },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/tours/${tourSlug}`,
            metadata: {
                tourSlug,
                date,
                time,
                guests,
                siteId,
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
                guest_details: bookingDetails,
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
