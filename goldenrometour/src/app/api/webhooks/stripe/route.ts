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

function parseGuestCounts(meta: any): Record<string, number> {
  let gc: Record<string, number> = {};
  try {
    if (meta.guestCounts) {
      gc = typeof meta.guestCounts === 'string' ? JSON.parse(meta.guestCounts) : meta.guestCounts;
    }
  } catch { /* ignore malformed guestCounts */ }
  return {
    Adult: Number(gc.Adult ?? meta.adults ?? 0),
    Student: Number(gc.Student ?? meta.students ?? 0),
    Youth: Number(gc.Youth ?? meta.youths ?? 0),
    Child: Number(gc.Child ?? 0),
  };
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
    const fullName = (meta.leadName || 'Guest').split(' ');
    const firstName = fullName[0] || 'Guest';
    const lastName = fullName.slice(1).join(' ') || '';
    const email = meta.leadEmail || pi.receipt_email || '';
    const guestCounts = parseGuestCounts(meta);
    const totalAmount = pi.amount / 100;

    try {
      const { data: existing } = await supabaseAdmin
        .from('bookings')
        .select('id, status')
        .eq('stripe_payment_intent_id', pi.id)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'pending') {
          await supabaseAdmin.from('bookings').update({ status: 'confirmed', total_amount: totalAmount }).eq('id', existing.id);
        }
        return NextResponse.json({ received: true, updated: existing.id });
      }

      try { await reserveInventory(tourSlug, date, time, guestCount); } catch {}

      const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').insert({
        tour_title: tourTitle,
        tour_slug: tourSlug,
        date,
        time,
        guests: guestCount,
        total_amount: totalAmount,
        currency: 'eur',
        lead_first_name: firstName,
        lead_last_name: lastName,
        lead_email: email,
        lead_phone: meta.leadPhone || null,
        status: 'confirmed',
        stripe_payment_intent_id: pi.id,
        guest_counts: guestCounts,
        tenant: siteId,
        notes: meta.notes || null,
        pickup_location: meta.pickupLocation || null,
        source: 'website',
      }).select().single();

      if (bookingError) {
        await releaseInventory(tourSlug, date, time, guestCount);
        return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
      }

      await logAuditAction('system', 'stripe_webhook', 'booking_created', 'booking', booking.id, { tour_title: tourTitle, lead_email: email, total_amount: totalAmount, tenant: siteId, payment_intent_id: pi.id });
      await sendEmails(siteId, email, `${firstName} ${lastName}`.trim(), tourTitle, date, time, guests, totalAmount, pi.id, meta);

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
    const fullName = (meta.leadName || 'Guest').split(' ');
    const firstName = fullName[0] || 'Guest';
    const lastName = fullName.slice(1).join(' ') || '';
    const email = meta.leadEmail || session.customer_email || '';
    const guestCounts = parseGuestCounts(meta);
    const totalAmount = (session.amount_total || 0) / 100;

    try {
      const { data: existing } = await supabaseAdmin
        .from('bookings')
        .select('id, status')
        .eq('stripe_session_id', session.id)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'pending') {
          await supabaseAdmin.from('bookings').update({ status: 'confirmed', total_amount: totalAmount }).eq('id', existing.id);
        }
        return NextResponse.json({ received: true, updated: existing.id });
      }

      try { await reserveInventory(tourSlug, date, time, guestCount); } catch {}

      const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').insert({
        tour_title: tourTitle,
        tour_slug: tourSlug,
        date,
        time,
        guests: guestCount,
        total_amount: totalAmount,
        currency: 'eur',
        lead_first_name: firstName,
        lead_last_name: lastName,
        lead_email: email,
        lead_phone: meta.leadPhone || null,
        status: 'confirmed',
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        guest_counts: guestCounts,
        tenant: siteId,
        notes: meta.notes || null,
        pickup_location: meta.pickupLocation || null,
        source: 'website',
      }).select().single();

      if (bookingError) {
        await releaseInventory(tourSlug, date, time, guestCount);
        return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
      }

      await logAuditAction('system', 'stripe_webhook', 'booking_created', 'booking', booking.id, { tour_title: tourTitle, lead_email: email, total_amount: totalAmount, tenant: siteId, session_id: session.id });
      await sendEmails(siteId, email, `${firstName} ${lastName}`.trim(), tourTitle, date, time, guests, totalAmount, session.id, meta);

    } catch (err) {
      console.error('Error processing checkout session:', err);
      return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
  }

  else if (event.type === 'payment_intent.payment_failed') {
    const failedPayment = event.data.object;
    await logAuditAction('system', 'stripe_webhook', 'booking_cancelled', 'payment_intent', failedPayment.id, { error_message: failedPayment.last_payment_error?.message, tenant: siteId, reason: 'payment_failed' });
  }

  return NextResponse.json({ received: true, site: siteId });
}
