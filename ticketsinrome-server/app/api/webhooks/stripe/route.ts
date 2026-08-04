import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY as string);

function determineSiteFromEvent(event: any): string {
  if (event.data?.object?.metadata?.siteId) return event.data.object.metadata.siteId;
  return process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome';
}

// ── Generate Customer Email ──────────────────────────────────────────────────
function generateCustomerEmail(siteId: string, data: {
  name: string; tourTitle: string; date: string; time: string; guests: string;
  orderId: string; pin: string; totalAmount: number; metadata: any;
}): string {
  const siteName = siteId === 'ticketsinrome' ? 'Tickets in Rome' : 'Rome Tour Tickets';
  const siteUrl = siteId === 'ticketsinrome' ? 'https://ticketsinrome.com' : 'https://rome-tour-tickets.com';
  const primaryColor = '#064034';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: ${primaryColor}; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${siteName}</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Booking Confirmation</p>
            </td>
          </tr>
          
          <!-- Success Badge -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 12px 24px; border-radius: 24px; font-weight: bold; font-size: 14px;">
                ✓ BOOKING CONFIRMED
              </div>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Hi ${data.name}!</h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Your booking has been confirmed! We're excited to show you the best of Rome.
              </p>
            </td>
          </tr>
          
          <!-- Booking Reference -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Booking Reference</p>
                <p style="margin: 0; color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 2px;">${data.pin}</p>
              </div>
            </td>
          </tr>
          
          <!-- Tour Details -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Tour Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Tour</p>
                    <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${data.tourTitle}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Date & Time</p>
                    <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${data.date} at ${data.time}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Guests</p>
                    <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${data.guests} ${parseInt(data.guests) === 1 ? 'person' : 'people'}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Paid</p>
                    <p style="margin: 4px 0 0 0; color: ${primaryColor}; font-size: 24px; font-weight: bold;">€${data.totalAmount.toFixed(2)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Important Reminders -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">⚠️ Important Reminders</h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li>Please arrive 15-20 minutes before your scheduled time</li>
                  <li>Bring a valid ID or passport</li>
                  <li>Dress code: Shoulders and knees must be covered (for Vatican tours)</li>
                  <li>Keep this email handy for check-in</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <a href="${siteUrl}/success?payment_intent=${data.orderId}" style="display: inline-block; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View Booking Details
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Need help? Contact us at <a href="mailto:info@ticketsinrome.com" style="color: ${primaryColor}; text-decoration: none;">info@ticketsinrome.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ── Generate Admin Email ──────────────────────────────────────────────────────
function generateAdminEmail(siteId: string, data: {
  name: string; email: string; phone: string; tourTitle: string; tourSlug: string;
  date: string; time: string; guests: string; orderId: string; pin: string; totalAmount: number;
}): string {
  const siteName = siteId === 'ticketsinrome' ? 'Tickets in Rome' : 'Rome Tour Tickets';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Booking Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 24px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #dc2626; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🔔 NEW BOOKING</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${siteName}</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">Booking Reference: ${data.pin}</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Customer:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Email:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Phone:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.phone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Tour:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.tourTitle}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Date & Time:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.date} at ${data.time}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #6b7280; font-size: 14px;">Guests:</strong><br>
                    <span style="color: #1f2937; font-size: 16px;">${data.guests}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #6b7280; font-size: 14px;">Total Amount:</strong><br>
                    <span style="color: #059669; font-size: 20px; font-weight: bold;">€${data.totalAmount.toFixed(2)}</span>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px;">
                Payment Intent ID: ${data.orderId}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
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

  const senderName = process.env.NEXT_PUBLIC_SITE_NAME || (siteId === 'ticketsinrome' ? 'Tickets in Rome' : 'Rome Tour Tickets');
  const senderEmail = process.env.EMAIL_FROM || 'info@ticketsinrome.com';
  const adminEmails = (process.env.ADMIN_EMAIL || senderEmail).split(',').map(e => e.trim());
  const pin = orderId.slice(-6).toUpperCase();

  try {
    if (email) {
      const customerHtml = generateCustomerEmail(siteId, {
        name, tourTitle, date, time, guests,
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
      orderId, pin, totalAmount,
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
