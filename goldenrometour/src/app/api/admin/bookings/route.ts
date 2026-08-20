import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getStripe } from '@/lib/stripe';
import { releaseInventory } from '@/lib/inventoryService';
import { isAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const TENANT = process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('tenant', TENANT)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const stripe = getStripe(TENANT);
    const enriched: any[] = [];

    for (const b of bookings || []) {
      const entry: any = { ...b, card_brand: null, card_last4: null, stripe_status: null };
      if (b.stripe_payment_intent_id) {
        try {
          const pi: any = await stripe.paymentIntents.retrieve(b.stripe_payment_intent_id, { expand: ['charges.data'] });
          entry.stripe_status = pi.status;
          const charge = pi.charges?.data?.[0];
          if (charge) {
            entry.card_brand = charge.payment_method_details?.card?.brand || null;
            entry.card_last4 = charge.payment_method_details?.card?.last4 || null;
          }
        } catch {
          entry.stripe_status = 'lookup_failed';
        }
      }
      enriched.push(entry);
    }

    return NextResponse.json({ bookings: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });

    const { data: booking, error: fetchErr } = await supabaseAdmin
      .from('bookings').select('*').eq('id', id).single();
    if (fetchErr || !booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.status === 'cancelled') return NextResponse.json({ error: 'Already cancelled' }, { status: 400 });

    let refund: { id: string; amount: number } | null = null;
    let refundError: string | null = null;

    if (booking.stripe_payment_intent_id) {
      try {
        const stripe = getStripe(TENANT);
        const pi: any = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);
        const chargeId = pi.charges?.data?.[0]?.id;
        if (chargeId && pi.status === 'succeeded') {
          const amountCents = Math.round((booking.total_amount || pi.amount / 100) * 100);
          const r = await stripe.refunds.create({
            charge: chargeId,
            amount: amountCents,
            metadata: { booking_id: String(booking.id), cancelled_by: 'admin' },
          });
          refund = { id: r.id, amount: r.amount / 100 };
        } else if (pi.status !== 'requires_payment_method' && pi.status !== 'canceled') {
          refundError = `Stripe PI status: ${pi.status}`;
        }
      } catch (e: any) {
        refundError = e.message;
      }
    }

    if (booking.tour_slug && booking.date && booking.time && booking.guests) {
      await releaseInventory(booking.tour_slug, booking.date, booking.time, booking.guests);
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    return NextResponse.json({ booking: updated, cancelled: true, refund, refundError });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
