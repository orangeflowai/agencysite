import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';
import { reserveInventory, releaseInventory } from '@/lib/inventoryService';
import { logAuditAction } from '@/lib/auditLog';
import { generateCustomerEmail, generateAdminEmail } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY as string);

function determineSiteFromEvent(event: any): string {
  if (event.data?.object?.metadata?.siteId) return event.data.object.metadata.siteId;
  return process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';
}

/** Write booking to Payload CMS (non-blocking — never fails the webhook) */
async function writeToPayload(siteId: string, bookingData: {
  tourTitle: string; tourSlug: string; date: string; time: string;
  guestCount: number; adults: number; students: number; youths: number;
  name: string; email: string; phone: string;
  totalAmount: number; stripePaymentIntentId: string; stripeChargeId?: string;
  addOns: any[];
}) {
  const payloadUrl = process.env.PAYLOAD_API_URL;
  const apiKey = process.env.PAYLOAD_API_KEY;
  if (!payloadUrl || !apiKey) return;

  try {
    const { nanoid } = await import('nanoid');
    const bookingRef = nanoid(8).toUpperCase();
    const pin = nanoid(6).toUpperCase();

    await fetch(`${payloadUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': siteId,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        tenant: siteId,
        bookingRef,
        pin,
        status: 'confirmed',
        date: bookingData.date,
        time: bookingData.time,
        adults: bookingData.adults,
        students: bookingData.students,
        youths: bookingData.youths,
        totalGuests: bookingData.guestCount,
        totalAmount: bookingData.totalAmount,
        currency: 'eur',
        stripePaymentIntentId: bookingData.stripePaymentIntentId,
        stripeChargeId: bookingData.stripeChargeId || '',
        leadTraveler: {
          firstName: bookingData.name.split(' ')[0] || '',
          lastName: bookingData.name.split(' ').slice(1).join(' ') || '',
          email: bookingData.email,
          phone: bookingData.phone,
        },
        addons: bookingData.addOns.map((a: any) => ({
          name: a.name,
          price: a.price,
          quantity: a.quantity,
          total: a.price * a.quantity,
        })),
        emailStatus: 'sent',
      }),
    });
  } catch (err) {
    console.warn('[webhook] Payload write failed (non-blocking):', err);
  }
}

async function sendEmails(siteId: string, email: string, name: string, tourTitle: string, date: string, time: string, guests: string, totalAmount: number, orderId: string, metadata: any) {
  if (!process.env.RESEND_API_KEY) return;
  const senderName = process.env.NEXT_PUBLIC_SITE_NAME || siteId;
  const senderEmail = process.env.EMAIL_FROM || 'bookings@yourdomain.com';
  const adminEmails = (process.env.ADMIN_EMAIL || senderEmail).split(',').map(e => e.trim());
  const pin = orderId.slice(-6).toUpperCase();

  if (email) {
    const customerHtml = generateCustomerEmail(siteId, { name, tourTitle, date, time, guests, adults: metadata.adults || '0', students: metadata.students || '0', youths: metadata.youths || '0', orderId, pin, totalAmount, metadata });
    await resend.emails.send({ from: `${senderName} <${senderEmail}>`, to: email, subject: `Booking Confirmed: ${tourTitle} (Ref: ${orderId.slice(-6)})`, html: customerHtml });
  }

  const adminHtml = generateAdminEmail(siteId, { name, email, phone: metadata.leadPhone || 'N/A', tourTitle, tourSlug: metadata.tourSlug || 'N/A', date, time, guests, adults: metadata.adults || '0', students: metadata.students || '0', orderId, pin, totalAmount, metadata });
  await resend.emails.send({ from: `System Alert <${senderEmail}>`, to: adminEmails, subject: `[NEW BOOKING] ${tourTitle} - ${date}`, html: adminHtml });
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let unverifiedEvent: any;
  try { unverifiedEvent = JSON.parse(body); } catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }); }

  const siteId = determineSiteFromEvent(unverifiedEvent);
  const webhookSecret = getWebhookSecret(siteId);
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });

  const stripe = getStripe(siteId);
  let event: any;
  try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); }
  catch { return NextResponse.json({ error: 'Webhook Error' }, { status: 400 }); }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const meta = pi.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests);
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || pi.receipt_email || '';
    const adults = parseInt(meta.adults || '0');
    const students = parseInt(meta.students || '0');
    const youths = parseInt(meta.youths || '0');
    const addOns = meta.addOns ? JSON.parse(meta.addOns) : [];
    const totalAmount = pi.amount / 100;

    try {
      const { data: existing } = await supabaseAdmin.from('bookings').select('id').eq('stripe_payment_intent_id', pi.id).single();
      if (existing) return NextResponse.json({ received: true });

      try { await reserveInventory(tourSlug, date, time, guestCount); } catch {}

      const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').insert({
        tour_title: tourTitle, tour_slug: tourSlug, date, time, guests: guestCount,
        total_price: totalAmount, customer_name: name, customer_email: email,
        customer_phone: meta.leadPhone || null, status: 'paid',
        stripe_payment_intent_id: pi.id, adults, students, youths,
        guest_details: { hotel: meta.hotelName, pickup: meta.pickupRequired, luggage: meta.luggageDeposit, addOns, guestCounts: meta.guestCounts ? JSON.parse(meta.guestCounts) : {} },
        site_id: siteId,
      }).select().single();

      if (bookingError) {
        await releaseInventory(tourSlug, date, time, guestCount);
        return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
      }

      // Dual-write to Payload CMS
      await writeToPayload(siteId, { tourTitle, tourSlug, date, time, guestCount, adults, students, youths, name, email, phone: meta.leadPhone || '', totalAmount, stripePaymentIntentId: pi.id, addOns });

      await logAuditAction('system', 'stripe_webhook', 'booking_created', 'booking', booking.id, { tour_title: tourTitle, customer_email: email, total_price: totalAmount, site_id: siteId, payment_intent_id: pi.id });
      await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, pi.id, meta);

    } catch (err) {
      console.error('Error processing payment intent:', err);
      return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
  }

  else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests);
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || session.customer_email || '';
    const adults = parseInt(meta.adults || '0');
    const students = parseInt(meta.students || '0');
    const youths = parseInt(meta.youths || '0');
    const addOns = meta.addOns ? JSON.parse(meta.addOns) : [];
    const totalAmount = (session.amount_total || 0) / 100;

    try {
      const { data: existing } = await supabaseAdmin.from('bookings').select('id').eq('stripe_session_id', session.id).single();
      if (existing) return NextResponse.json({ received: true });

      try { await reserveInventory(tourSlug, date, time, guestCount); } catch {}

      const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').insert({
        tour_title: tourTitle, tour_slug: tourSlug, date, time, guests: guestCount,
        total_price: totalAmount, customer_name: name, customer_email: email,
        customer_phone: meta.leadPhone, status: 'paid',
        stripe_session_id: session.id, stripe_payment_intent_id: session.payment_intent,
        adults, students, youths,
        guest_details: { hotel: meta.hotelName, pickup: meta.pickupRequired, luggage: meta.luggageDeposit, addOns, guestCounts: meta.guestCounts ? JSON.parse(meta.guestCounts) : {} },
        site_id: siteId,
      }).select().single();

      if (bookingError) {
        await releaseInventory(tourSlug, date, time, guestCount);
        return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
      }

      // Dual-write to Payload CMS
      await writeToPayload(siteId, { tourTitle, tourSlug, date, time, guestCount, adults, students, youths, name, email, phone: meta.leadPhone || '', totalAmount, stripePaymentIntentId: session.payment_intent || '', addOns });

      await logAuditAction('system', 'stripe_webhook', 'booking_created', 'booking', booking.id, { tour_title: tourTitle, customer_email: email, total_price: totalAmount, site_id: siteId, session_id: session.id });
      await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, session.id, meta);

    } catch (err) {
      console.error('Error processing checkout session:', err);
      return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
  }

  else if (event.type === 'payment_intent.payment_failed') {
    const failedPayment = event.data.object;
    await logAuditAction('system', 'stripe_webhook', 'booking_cancelled', 'payment_intent', failedPayment.id, { error_message: failedPayment.last_payment_error?.message, site_id: siteId, reason: 'payment_failed' });
  }

  return NextResponse.json({ received: true, site: siteId });
}
