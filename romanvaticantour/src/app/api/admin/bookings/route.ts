import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/apiAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

interface EnrichedBooking {
    id: string;
    booking_ref: string;
    tenant: string;
    tour_title: string;
    tour_slug: string;
    date: string;
    time: string;
    guests: number;
    total_amount: number;
    currency: string;
    status: string;
    stripe_payment_intent_id: string | null;
    lead_first_name: string;
    lead_last_name: string;
    lead_email: string;
    lead_phone: string | null;
    notes: string | null;
    pickup_location: string | null;
    guest_counts: Record<string, number> | null;
    guest_details: any[] | null;
    created_at: string;
    updated_at: string;
    // Stripe enrichment
    stripe_payment_status?: string;
    stripe_receipt_url?: string;
    stripe_card_brand?: string;
    stripe_card_last4?: string;
    stripe_customer_email?: string;
    stripe_customer_name?: string;
    stripe_amount_received?: number | null;
    stripe_failure_message?: string;
}

export async function GET(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;

    try {
        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

        // 1. Fetch bookings from Supabase
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('tenant', siteId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[admin/bookings] DB error:', error.message);
            return NextResponse.json({ error: 'Failed to fetch bookings', detail: error.message }, { status: 500 });
        }

        if (!bookings || bookings.length === 0) {
            return NextResponse.json({ bookings: [], count: 0, stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0 } });
        }

        // 2. Enrich with Stripe payment data
        const stripe = getStripe(siteId);
        const enriched: EnrichedBooking[] = [];

        for (const booking of bookings) {
            const entry: EnrichedBooking = { ...booking };

            if (booking.stripe_payment_intent_id) {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        booking.stripe_payment_intent_id,
                        { expand: ['payment_method', 'charges.data'] }
                    );

                    entry.stripe_payment_status = paymentIntent.status;

                    // Try to get receipt URL from charges
                    const charge = (paymentIntent as any).charges?.data?.[0];
                    if (charge) {
                        entry.stripe_receipt_url = charge.receipt_url || null;
                        entry.stripe_card_brand = charge.payment_method_details?.card?.brand || null;
                        entry.stripe_card_last4 = charge.payment_method_details?.card?.last4 || null;
                        entry.stripe_customer_email = charge.billing_details?.email || paymentIntent.receipt_email || null;
                        entry.stripe_customer_name = charge.billing_details?.name || null;
                        entry.stripe_amount_received = charge.amount_received ? charge.amount_received / 100 : null;
                    }

                    // Fallback: get card details from payment method
                    if (!entry.stripe_card_brand && (paymentIntent as any).payment_method) {
                        const pm = (paymentIntent as any).payment_method;
                        if (pm?.card) {
                            entry.stripe_card_brand = pm.card.brand || null;
                            entry.stripe_card_last4 = pm.card.last4 || null;
                        }
                    }
                } catch (stripeErr: any) {
                    console.warn(`[admin/bookings] Stripe lookup failed for ${booking.stripe_payment_intent_id}:`, stripeErr.message);
                    entry.stripe_payment_status = 'stripe_lookup_failed';
                    entry.stripe_failure_message = stripeErr.message;
                }
            }

            enriched.push(entry);
        }

        // 3. Compute stats
        const confirmed = enriched.filter(b => b.status === 'confirmed');
        const revenue = confirmed.reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const stats = {
            total: enriched.length,
            confirmed: confirmed.length,
            pending: enriched.filter(b => b.status === 'pending').length,
            cancelled: enriched.filter(b => b.status === 'cancelled').length,
            revenue,
        };

        return NextResponse.json({ bookings: enriched, count: enriched.length, stats });

    } catch (error: any) {
        console.error('[admin/bookings] Failed:', error.message);
        return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 });
    }
}

// PATCH - cancel a booking (status → cancelled, release inventory slots)
export async function PATCH(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id } = body;
        if (!id) return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });

        const { data: booking, error: fetchErr } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.status === 'cancelled') {
            return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
        }

        // Release inventory: increment available_slots for the booked slot
        if (booking.date && booking.time && booking.guests && booking.tenant) {
            const slug = booking.tour_slug || '';
            if (slug) {
                const { data: inv } = await supabaseAdmin
                    .from('inventory')
                    .select('id, available_slots')
                    .eq('tour_slug', slug)
                    .eq('date', booking.date)
                    .eq('time', booking.time)
                    .eq('tenant', booking.tenant)
                    .maybeSingle();

                if (inv) {
                    await supabaseAdmin
                        .from('inventory')
                        .update({ available_slots: inv.available_slots + (booking.guests || 0) })
                        .eq('id', inv.id);
                }
            }
        }

        const { data: updated, error: updateErr } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (updateErr) {
            return NextResponse.json({ error: updateErr.message }, { status: 500 });
        }

        return NextResponse.json({ booking: updated, cancelled: true });
    } catch (error: any) {
        console.error('[admin/bookings] Cancel failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
