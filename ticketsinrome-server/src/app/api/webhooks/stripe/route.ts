import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { Resend } from 'resend';
import { generateCustomerEmail, generateAdminEmail } from '@/lib/email-templates';
import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Supabase admin client for inventory + booking writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        email: process.env.PAYLOAD_API_EMAIL || '',
        password: process.env.PAYLOAD_API_PASSWORD || '',
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

// ── Decrement inventory in Supabase tour_slots ───────────────────────────────
async function decrementSupabaseInventory(tourSlug: string, date: string, time: string, guestCount: number) {
  try {
    const { data: slot } = await supabaseAdmin
      .from('tour_slots')
      .select('id, available_slots')
      .eq('tour_slug', tourSlug)
      .eq('date', date)
      .eq('time', time)
      .single();

    if (!slot) return; // no slot configured — silently skip

    const newSlots = Math.max(0, (slot.available_slots || 0) - guestCount);
    await supabaseAdmin
      .from('tour_slots')
      .update({ available_slots: newSlots })
      .eq('id', slot.id);
  } catch (err) {
    console.warn('[webhook] Supabase inventory decrement failed:', err);
  }
}

// ── Write booking to Supabase ─────────────────────────────────────────────────
async function writeToSupabase(siteId: string, data: {
  bookingRef: string; tourTitle: string; tourSlug: string;
  date: string; time: string; guestCount: number;
  name: string; email: string; phone: string;
  totalAmount: number; stripePaymentIntentId: string;
  meetingPoint?: string; guestCounts?: Record<string, number>;
  participants?: string; leadDob?: string;
}) {
  try {
    // Avoid duplicates
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('stripe_payment_intent_id', data.stripePaymentIntentId)
      .limit(1);
    if (existing && existing.length > 0) return;

    await supabaseAdmin.from('bookings').insert({
      booking_ref:              data.bookingRef,
      tenant:                   siteId,
      tour_title:               data.tourTitle,
      date:                     data.date,
      time:                     data.time,
      guests:                   data.guestCount,
      total_amount:             data.totalAmount,
      total_price:              data.totalAmount,
      currency:                 'eur',
      status:                   'confirmed',
      stripe_payment_intent_id: data.stripePaymentIntentId,
      lead_first_name:          data.name.split(' ')[0] || '',
      lead_last_name:           data.name.split(' ').slice(1).join(' ') || '',
      lead_email:               data.email,
      lead_phone:               data.phone,
      lead_dob:                 data.leadDob || '',
      meeting_point:            data.meetingPoint || '',
      guest_counts:             data.guestCounts || {},
      participant_details:      data.participants || '[]',
      source:                   'website',
    });
  } catch (err) {
    console.warn('[webhook] Supabase booking write failed:', err);
  }
}

// ── Decrement inventory in Supabase tour_slots (atomic) ──────────────────────
// Payload CMS was decommissioned June 2026 — inventory now lives in Supabase.
async function decrementPayloadInventory(tourSlug: string, date: string, time: string, guestCount: number, siteId: string) {
  // Delegates to Supabase atomic RPC — function name kept for backward compat
  try {
    const { error } = await supabaseAdmin
      .rpc('reserve_slots', {
        p_tour_slug: tourSlug,
        p_date: date,
        p_time: time,
        p_guest_count: guestCount,
        p_site_id: siteId || 'ticketsinrome',
      });
    if (error) {
      console.warn('[webhook] Inventory decrement failed:', error.message);
    }
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
  const senderEmail = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romeagency.com";
  const adminEmails = (process.env.ADMIN_EMAIL || senderEmail).split(',').map(e => e.trim());
  const pin = orderId.slice(-6).toUpperCase();

  // Parse participant names stored as JSON in metadata
  let participants: Array<{ index: number; label: string; name: string; dob?: string }> = [];
  if (metadata.participants) {
    try { participants = JSON.parse(metadata.participants); } catch { /* ignore */ }
  }

  // Build a readable participant list for emails (including DOB)
  const participantListHtml = participants.length > 0
    ? `<table style="width:100%;border-collapse:collapse;margin:8px 0;">
        <tr style="background:#f5f5f5;"><th style="padding:6px 10px;text-align:left;font-size:12px;color:#555;">Guest</th><th style="padding:6px 10px;text-align:left;font-size:12px;color:#555;">Name</th><th style="padding:6px 10px;text-align:left;font-size:12px;color:#555;">DOB</th></tr>
        ${participants.map(p => `<tr><td style="padding:6px 10px;font-size:13px;border-top:1px solid #eee;">${p.label}</td><td style="padding:6px 10px;font-size:13px;font-weight:bold;border-top:1px solid #eee;">${p.name || '—'}</td><td style="padding:6px 10px;font-size:13px;border-top:1px solid #eee;">${p.dob || '—'}</td></tr>`).join('')}
      </table>`
    : '';

  const participantListText = participants.length > 0
    ? '\n\nParticipants:\n' + participants.map(p => `  ${p.label}: ${p.name || '—'} (DOB: ${p.dob || '—'})`).join('\n')
    : '';

  try {
    if (email) {
      const customerHtml = generateCustomerEmail(siteId, {
        name, tourTitle, date, time, guests,
        adults: metadata.adults || '0',
        students: metadata.students || '0',
        youths: metadata.youths || '0',
        orderId, pin, totalAmount, metadata,
        participantListHtml,
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
      participantListHtml,
      participantListText,
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

    // IDEMPOTENCY: Skip if booking already exists for this payment intent
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_ref')
      .eq('stripe_payment_intent_id', pi.id)
      .limit(1);
    if (existingBooking && existingBooking.length > 0) {
      console.log('[webhook] Booking already exists for PI:', pi.id, '— skipping');
      return NextResponse.json({ received: true, deduplicated: true });
    }

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || pi.receipt_email || '';
    const addOns = meta.addOns ? (() => { try { return JSON.parse(meta.addOns); } catch { return []; } })() : [];
    const totalAmount = pi.amount / 100;
    const guestCounts = meta.guestCounts ? (() => { try { return JSON.parse(meta.guestCounts); } catch { return {}; } })() : {};
    const bookingRef = existingBooking?.[0]?.booking_ref || nanoid(8).toUpperCase();

    // 1. Send emails FIRST — most important, never block on DB
    // Use bookingRef as orderId so email shows the SAME reference as success/ticket pages
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, bookingRef, meta);

    // 2. Write to Supabase (primary, non-blocking)
    writeToSupabase(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: pi.id,
      meetingPoint: meta.meetingPoint || '',
      guestCounts,
      participants: meta.participants || '[]',
      leadDob: meta.leadDob || '',
    }).catch(err => console.warn('[webhook] Supabase write failed:', err));

    // 3. Decrement Supabase inventory (primary, non-blocking)
    decrementSupabaseInventory(tourSlug, date, time, guestCount)
      .catch(err => console.warn('[webhook] Supabase inventory failed:', err));

    // 4. Write to Payload (non-blocking fallback)
    writeToPayload(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount, guestCounts,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: pi.id, addOns,
    }).catch(err => console.warn('[webhook] Payload write failed:', err));

    // 5. Decrement Payload inventory (non-blocking fallback)
    decrementPayloadInventory(tourSlug, date, time, guestCount, siteId)
      .catch(err => console.warn('[webhook] Inventory decrement failed:', err));
  }

  else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    // Verify payment was successful
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      console.log('[webhook] Session not paid:', session.id, 'status:', session.payment_status);
      return NextResponse.json({ received: true });
    }

    const piId = session.payment_intent || session.id;

    // IDEMPOTENCY: Skip if booking already exists
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_ref')
      .eq('stripe_payment_intent_id', piId)
      .limit(1);
    if (existingBooking && existingBooking.length > 0) {
      console.log('[webhook] Booking already exists for checkout session:', session.id, '— skipping');
      return NextResponse.json({ received: true, deduplicated: true });
    }

    const { tourTitle, tourSlug, date, time, guests } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || session.customer_email || '';
    const addOns = meta.addOns ? (() => { try { return JSON.parse(meta.addOns); } catch { return []; } })() : [];
    const totalAmount = (session.amount_total || 0) / 100;
    const guestCounts = meta.guestCounts ? (() => { try { return JSON.parse(meta.guestCounts); } catch { return {}; } })() : {};
    const bookingRef = existingBooking?.[0]?.booking_ref || nanoid(8).toUpperCase();

    // 1. Send emails FIRST — use bookingRef so email matches success/ticket pages
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, bookingRef, meta);

    // 2. Write to Supabase (primary, non-blocking)
    writeToSupabase(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: piId,
      meetingPoint: meta.meetingPoint || '',
      guestCounts,
      participants: meta.participants || '[]',
      leadDob: meta.leadDob || '',
    }).catch(err => console.warn('[webhook] Supabase write failed:', err));

    // 3. Decrement Supabase inventory (primary, non-blocking)
    decrementSupabaseInventory(tourSlug, date, time, guestCount)
      .catch(err => console.warn('[webhook] Supabase inventory failed:', err));

    // 4. Write to Payload (non-blocking fallback)
    writeToPayload(siteId, {
      bookingRef, tourTitle, tourSlug, date, time, guestCount, guestCounts,
      name, email, phone: meta.leadPhone || '',
      totalAmount, stripePaymentIntentId: piId, addOns,
    }).catch(err => console.warn('[webhook] Payload write failed:', err));

    // 5. Decrement Payload inventory (non-blocking fallback)
    decrementPayloadInventory(tourSlug, date, time, guestCount, siteId)
      .catch(err => console.warn('[webhook] Inventory decrement failed:', err));
  }

  else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    console.log('[webhook] Payment failed:', pi.id, pi.last_payment_error?.message);
  }

  return NextResponse.json({ received: true, site: siteId });
}
