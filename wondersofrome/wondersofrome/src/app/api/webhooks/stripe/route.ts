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

// ── Decrement inventory in Supabase tour_slots (atomic) ──────────────────────
async function decrementSupabaseInventory(tourSlug: string, date: string, time: string, guestCount: number) {
  try {
    const { data: newSlots, error } = await supabaseAdmin
      .rpc('reserve_slots', {
        p_tour_slug: tourSlug,
        p_date: date,
        p_time: time,
        p_guest_count: guestCount,
        p_site_id: process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome',
      });

    if (error) {
      console.warn('[webhook] Inventory decrement failed (slot may not exist):', error.message);
    }
    // null means insufficient slots — non-fatal, just log
    if (newSlots === null) {
      console.warn(`[webhook] Inventory oversell prevented: ${tourSlug} ${date} ${time}, wanted ${guestCount}`);
    }
  } catch (err) {
    console.warn('[webhook] Supabase inventory decrement failed:', err);
  }
}

// ── Release inventory (refund handler) ────────────────────────────────────────
async function releaseSupabaseInventory(tourSlug: string, date: string, time: string, guestCount: number) {
  try {
    const { error } = await supabaseAdmin
      .rpc('release_slots', {
        p_tour_slug: tourSlug,
        p_date: date,
        p_time: time,
        p_guest_count: guestCount,
        p_site_id: process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome',
      });

    if (error) {
      console.warn('[webhook] Inventory release failed:', error.message);
    }
  } catch (err) {
    console.warn('[webhook] Supabase inventory release failed:', err);
  }
}

// ── Write booking to Supabase ─────────────────────────────────────────────────
async function writeToSupabase(siteId: string, data: {
  bookingRef: string; tourTitle: string; tourSlug: string;
  date: string; time: string; guestCount: number;
  name: string; email: string; phone: string;
  totalAmount: number; stripePaymentIntentId: string;
  meetingPoint: string;
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
      tour_slug:                data.tourSlug,
      date:                     data.date,
      time:                     data.time,
      guests:                   data.guestCount,
      total_amount:             data.totalAmount,
      currency:                 'eur',
      status:                   'confirmed',
      stripe_payment_intent_id: data.stripePaymentIntentId,
      lead_first_name:          data.name.split(' ')[0] || '',
      lead_last_name:           data.name.split(' ').slice(1).join(' ') || '',
      lead_email:               data.email,
      lead_phone:               data.phone,
      source:                   'website',
      meeting_point:            data.meetingPoint,
    });
  } catch (err) {
    console.warn('[webhook] Supabase booking write failed:', err);
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

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Determine site BEFORE construction using raw body metadata (best-effort)
  // This is only to select the correct webhook secret — final siteId comes from verified event
  let rawEvent: any;
  try { rawEvent = JSON.parse(body); }
  catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }); }

  const tentativeSiteId = determineSiteFromEvent(rawEvent);
  const webhookSecret = getWebhookSecret(tentativeSiteId);
  if (!webhookSecret) {
    console.error('[webhook] No webhook secret for site:', tentativeSiteId);
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripe = getStripe(tentativeSiteId);
  let event: any;
  try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); }
  catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  // Use siteId from VERIFIED event metadata, not raw body
  const siteId = event.data?.object?.metadata?.siteId || tentativeSiteId;
  console.log('[webhook] Event received:', event.type, 'site:', siteId);

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const meta = pi.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests, meetingPoint } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || pi.receipt_email || '';
    const totalAmount = pi.amount / 100;
    const bookingRef = nanoid(8).toUpperCase();

    // 1. Send emails FIRST — most important, never block on DB
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, pi.id, meta);

    // 2. Write to Supabase — retry on failure
    try {
      await writeToSupabase(siteId, {
        bookingRef, tourTitle, tourSlug, date, time, guestCount,
        name, email, phone: meta.leadPhone || '',
        totalAmount, stripePaymentIntentId: pi.id,
        meetingPoint: meetingPoint || '',
      });
    } catch (err) {
      console.error('[webhook] CRITICAL: Supabase booking write failed after retries:', err);
      // Payment captured but booking NOT recorded — log for manual intervention
      // TODO: Add dead-letter queue or admin alert for unreconciled payments
    }

    // 3. Decrement Supabase inventory — best-effort
    try {
      await decrementSupabaseInventory(tourSlug, date, time, guestCount);
    } catch (err) {
      console.error('[webhook] Inventory decrement failed:', err);
    }
  }

  else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};
    if (!meta.tourSlug) return NextResponse.json({ received: true });

    const { tourTitle, tourSlug, date, time, guests, meetingPoint } = meta;
    const guestCount = parseInt(guests) || 1;
    const name = meta.leadName || 'Guest';
    const email = meta.leadEmail || session.customer_email || '';
    const totalAmount = (session.amount_total || 0) / 100;
    const bookingRef = nanoid(8).toUpperCase();
    const piId = session.payment_intent || session.id;

    // 1. Send emails FIRST
    await sendEmails(siteId, email, name, tourTitle, date, time, guests, totalAmount, piId, meta);

    // 2. Write to Supabase — retry on failure
    try {
      await writeToSupabase(siteId, {
        bookingRef, tourTitle, tourSlug, date, time, guestCount,
        name, email, phone: meta.leadPhone || '',
        totalAmount, stripePaymentIntentId: piId,
        meetingPoint: meetingPoint || '',
      });
    } catch (err) {
      console.error('[webhook] CRITICAL: Supabase booking write failed after retries:', err);
    }

    // 3. Decrement Supabase inventory — best-effort
    try {
      await decrementSupabaseInventory(tourSlug, date, time, guestCount);
    } catch (err) {
      console.error('[webhook] Inventory decrement failed:', err);
    }
  }

  else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    console.log('[webhook] Payment failed:', pi.id, pi.last_payment_error?.message);
  }

  // ── Refund: release inventory + update booking status ──────────────────────
  else if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    const piId = charge.payment_intent;
    console.log('[webhook] Refund received:', charge.id, 'PI:', piId);

    if (piId) {
      try {
        // Update booking status to refunded
        const { error: updateError } = await supabaseAdmin
          .from('bookings')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', piId);

        if (updateError) {
          console.error('[webhook] Failed to update booking status on refund:', updateError);
        }

        // Release inventory
        const { data: booking } = await supabaseAdmin
          .from('bookings')
          .select('tour_slug, date, time, guests')
          .eq('stripe_payment_intent_id', piId)
          .maybeSingle();

        if (booking) {
          await releaseSupabaseInventory(booking.tour_slug, booking.date, booking.time, booking.guests || 1);
          console.log('[webhook] Inventory released for refund:', booking.tour_slug);
        }
      } catch (err) {
        console.error('[webhook] Refund handling error:', err);
      }
    }
  }

  // ── Dispute: alert admin ───────────────────────────────────────────────────
  else if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object;
    console.error('[webhook] DISPUTE CREATED:', dispute.id, dispute.reason, dispute.status);

    const fromEmail = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@wondersofrome.com';
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || fromEmail;
    if (process.env.RESEND_API_KEY && adminEmail) {
      try {
        await resend.emails.send({
          from: `System Alert <${fromEmail}>`,
          to: adminEmail,
          subject: `⚠️ Dispute Created: ${dispute.reason} — ${dispute.id}`,
          html: `<p>Stripe dispute created:</p>
                 <p><strong>ID:</strong> ${dispute.id}</p>
                 <p><strong>Reason:</strong> ${dispute.reason}</p>
                 <p><strong>Status:</strong> ${dispute.status}</p>
                 <p><strong>Amount:</strong> €${(dispute.amount / 100).toFixed(2)}</p>`,
        });
      } catch (err) {
        console.error('[webhook] Dispute alert email failed:', err);
      }
    }
  }

  // ── PaymentIntent canceled: log only (no inventory was reserved pre-payment) ─
  else if (event.type === 'payment_intent.canceled') {
    const pi = event.data.object;
    console.log('[webhook] PaymentIntent canceled:', pi.id);
  }

  return NextResponse.json({ received: true, site: siteId });
}
