import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { Resend } from 'resend';
import { generateCustomerEmail, generateAdminEmail } from '@/lib/email-templates';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY as string);

function determineSiteFromEvent(event: any): string {
  if (event.data?.object?.metadata?.siteId) return event.data.object.metadata.siteId;
  return process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
}

// ── Write booking to Payload CMS ──────────────────────────────────────────────
async function writeToPayload(siteId: string, data: {
  bookingRef: string; tourTitle: string; tourSlug: string;
  date: string; time: string; guestCount: number;
  guestCounts: Record<string, number>;
  name: string; email: string; phone: string;
  totalAmount: number; stripePaymentIntentId: string;
  addOns: any[];
}): Promise<{ id: string; bookingRef: string } | null> {
  const payloadUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (!payloadUrl) return null;

  try {
    // Authenticate
    const loginRes = await fetch(`${payloadUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com',
        password: process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!',
      }),
    });
    if (!loginRes.ok) throw new Error('Payload auth failed');
    const { token } = await loginRes.json();

    // Check for duplicate
    const checkRes = await fetch(
      `${payloadUrl}/api/bookings?where[stripePaymentIntentId][equals]=${data.stripePaymentIntentId}&limit=1&depth=0`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (checkData?.docs?.length > 0) {
        return { id: checkData.docs[0].id, bookingRef: checkData.docs[0].bookingRef };
      }
    }

    // Create booking
    const res = await fetch(`${payloadUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        tenant: siteId,
        bookingRef: data.bookingRef,
        status: 'confirmed',
        tourTitle: data.tourTitle,
        date: data.date,
        time: data.time,
        guests: data.guestCount,
        guestCounts: data.guestCounts,
        totalAmount: data.totalAmount,
        currency: 'eur',
        stripePaymentIntentId: data.stripePaymentIntentId,
        leadFirstName: data.name.split(' ')[0] || '',
        leadLastName: data.name.split(' ').slice(1).join(' ') || '',
        leadEmail: data.email,
        leadPhone: data.phone,
        source: 'website',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[webhook] Payload write failed:', err);
      return null;
    }
    const result = await res.json();
    return { id: result.doc?.id, bookingRef: data.bookingRef };
  } catch (err) {
    console.error('[webhook] Payload write error:', err);
    return null;
  }
}

// ── Decrement inventory in Payload ────────────────────────────────────────────
async function decrementPayloadInventory(tourSlug: string, date: string, time: string, guestCount: number, siteId: string) {
  const payloadUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL;
  if (!payloadUrl) return;
  try {
    const loginRes = await fetch(`${payloadUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com', password: process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!' }),
    });
    if (!loginRes.ok) return;
    const { token } = await loginRes.json();

    const tourRes = await fetch(`${payloadUrl}/api/tours?where[slug][equals]=${encodeURIComponent(tourSlug)}&where[tenant][equals]=${encodeURIComponent(siteId)}&limit=1&depth=0`, { headers: { Authorization: `Bearer ${token}` } });
    if (!tourRes.ok) return;
    const tourId = (await tourRes.json())?.docs?.[0]?.id;
    if (!tourId) return;

    const dateStart = `${date}T00:00:00.000Z`;
    const dateEnd = `${date}T23:59:59.999Z`;
    const invRes = await fetch(`${payloadUrl}/api/inventory?where[tour][equals]=${tourId}&where[date][greater_than_equal]=${encodeURIComponent(dateStart)}&where[date][less_than_equal]=${encodeURIComponent(dateEnd)}&where[time][equals]=${encodeURIComponent(time)}&limit=1&depth=0`, { headers: { Authorization: `Bearer ${token}` } });
    if (!invRes.ok) return;
    const slot = (await invRes.json())?.docs?.[0];
    if (!slot) return;

    const newAvailable = Math.max(0, (slot.availableSlots || 0) - guestCount);
    await fetch(`${payloadUrl}/api/inventory/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ availableSlots: newAvailable }),
    });
  } catch (err) {
    console.warn('[webhook] Inventory decrement failed:', err);
  }
}

// ── Send emails ───────────────────────────────────────────────────────────────
async function sendEmails(siteId: string, email: string, name: string, tourTitle: string, date: string, time: string, guests: string, totalAmount: number, orderId: string, metadata: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[webhook] RESEND_API_KEY not set — skipping emails');
    return;
  }

  const senderName = process.env.NEXT_PUBLIC_SITE_NAME || (siteId === 'wondersofrome' ? 'Wonders of Rome' : 'Tickets in Rome');
  const senderEmail = process.env.EMAIL_FROM || 'info@wondersofrome.com';
  const adminEmails = (process.env.ADMIN_EMAIL || senderEmail).split(',').map(e => e.trim());
  const pin = orderId.slice(-6).toUpperCase();

  try {
    if (email) {
      const customerHtml = generateCustomerEmail(siteId, {
        name, tourTitle, date, time, guests,
        adults: metadata.adults || '0',
        students: metadata.students || '0',
        youths: metadata.youths || '0',
        orderId, pin, totalAmount, metadata,
      });
      const result = await resend.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to: email,
        subject: `✅ Booking Confirmed: ${tourTitle} (Ref: ${pin})`,
        html: customerHtml,
      });
      console.log('[webhook] Customer email sent:', result.data?.id || result.error);
    }

    const adminHtml = generateAdminEmail(siteId, {
      name, email, phone: metadata.leadPhone || 'N/A',
      tourTitle, tourSlug: metadata.tourSlug || 'N/A',
      date, time, guests,
      adults: metadata.adults || '0',
      students: metadata.students || '0',
      orderId, pin, totalAmount, metadata,
    });
    const adminResult = await resend.emails.send({
      from: `System Alert <${senderEmail}>`,
      to: adminEmails,
      subject: `[NEW BOOKING] ${tourTitle} — ${date} at ${time}`,
      html: adminHtml,
    });
    console.log('[webhook] Admin email sent:', adminResult.data?.id || adminResult.error);
  } catch (err) {
    console.error('[webhook] Email send failed:', err);
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let unverifiedEvent: any;
  try { unverifiedEvent = JSON.parse(body); }
  catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }); }

  const siteId = determineSiteFromEvent(unverifiedEvent);
  const webhookSecret = getWebhookSecret(siteId);
  if (!webhookSecret) {
    console.error('[webhook] No webhook secret for site:', siteId);
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripe = getStripe(siteId);
  let event: any;
  try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); }
  catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  console.log('[webhook] Event received:', event.type, 'site:', siteId);

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const meta = pi.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || pi.receipt_email || '';
    const addOns = meta.addOns ? (() => { try { return JSON.parse(meta.addOns); } catch { return []; } })() : [];
    const totalAmount = pi.amount / 100;
    const guestCounts = meta.guestCounts ? (() => { try { return JSON.parse(meta.guestCounts); } catch { return {}; } })() : {};
    const bookingRef = nanoid(8).toUpperCase();

    // 1. Send emails FIRST — most important, never block on DB
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, pi.id, meta);

    // 2. Write to Payload (non-blocking)
    writeToPayload(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount, guestCounts,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: pi.id, addOns,
    }).catch(err => console.warn('[webhook] Payload write failed:', err));

    // 3. Decrement inventory (non-blocking)
    decrementPayloadInventory(tourSlug, date, time, guestCount, siteId)
      .catch(err => console.warn('[webhook] Inventory decrement failed:', err));
  }

  else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || session.customer_email || '';
    const addOns = meta.addOns ? (() => { try { return JSON.parse(meta.addOns); } catch { return []; } })() : [];
    const totalAmount = (session.amount_total || 0) / 100;
    const guestCounts = meta.guestCounts ? (() => { try { return JSON.parse(meta.guestCounts); } catch { return {}; } })() : {};
    const bookingRef = nanoid(8).toUpperCase();
    const piId = session.payment_intent || session.id;

    // 1. Send emails FIRST
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, piId, meta);

    // 2. Write to Payload (non-blocking)
    writeToPayload(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount, guestCounts,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: piId, addOns,
    }).catch(err => console.warn('[webhook] Payload write failed:', err));

    // 3. Decrement inventory (non-blocking)
    decrementPayloadInventory(tourSlug, date, time, guestCount, siteId)
      .catch(err => console.warn('[webhook] Inventory decrement failed:', err));
  }

  else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    console.log('[webhook] Payment failed:', pi.id, pi.last_payment_error?.message);
  }

  return NextResponse.json({ received: true, site: siteId });
}
