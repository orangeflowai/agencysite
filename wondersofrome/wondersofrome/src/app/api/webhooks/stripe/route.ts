import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';
import { reserveInventory, releaseInventory } from '@/lib/inventoryService';
import { logAuditAction } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY as string);

// Helper to determine site from webhook payload
function determineSiteFromEvent(event: any): string {
    // Try to get from metadata
    if (event.data?.object?.metadata?.siteId) {
        return event.data.object.metadata.siteId;
    }
    // Try to determine from client_reference_id or other fields
    const session = event.data?.object;
    if (session) {
        const successUrl = session.success_url || '';
        if (successUrl.includes('wondersofrome') || successUrl.includes('wonders-of-rome')) {
            return 'wondersofrome';
        }
    }
    return 'rome-tour-tickets';
}

import { generateCustomerEmail, generateAdminEmail } from '@/lib/email-templates';

// Helper to send emails
async function sendEmails(siteId: string, email: string, name: string, tourTitle: string, date: string, time: string, guests: string, totalAmount: number, orderId: string, metadata: any) {
    if (!process.env.RESEND_API_KEY) return;

    const senderName  = process.env.NEXT_PUBLIC_SITE_NAME || (siteId === 'wondersofrome' ? 'Wonders of Rome' : 'Tickets in Rome');
    const senderEmail = process.env.EMAIL_FROM || (siteId === 'wondersofrome' ? 'bookings@wondersofrome.com' : 'bookings@ticketsinrome.com');
    const adminEmails = (process.env.ADMIN_EMAIL || senderEmail).split(',').map((e: string) => e.trim());

    // Generate PIN (last 6 chars of ID + logic) - Mock for now
    const pin = orderId.slice(-6).toUpperCase();

    // 1. Customer Email (User View)
    if (email) {
        const customerHtml = generateCustomerEmail(siteId, {
            name,
            tourTitle,
            date,
            time,
            guests,
            adults: metadata.adults || '0',
            students: metadata.students || '0',
            youths: metadata.youths || '0',
            orderId,
            pin,
            totalAmount,
            metadata
        });

        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: email,
            subject: `Booking Confirmed: ${tourTitle} (Ref: ${orderId.slice(-6)})`,
            html: customerHtml
        });
    }

    // 2. Admin Email (Client View)
    const adminHtml = generateAdminEmail(siteId, {
        name,
        email,
        phone: metadata.leadPhone || 'N/A',
        tourTitle,
        tourSlug: metadata.tourSlug || 'N/A',
        date,
        time,
        guests,
        adults: metadata.adults || '0',
        students: metadata.students || '0',
        orderId,
        pin,
        totalAmount,
        metadata
    });

    await resend.emails.send({
        from: `System Alert <${senderEmail}>`,
        to: adminEmails,
        subject: `[NEW BOOKING] ${tourTitle} - ${date}`,
        html: adminHtml
    });
}

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    let unverifiedEvent: any;
    try {
        unverifiedEvent = JSON.parse(body);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const siteId = determineSiteFromEvent(unverifiedEvent);
    const webhookSecret = getWebhookSecret(siteId);

    if (!webhookSecret) {
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const stripe = getStripe(siteId);
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle PaymentIntent Succeeded (New Flow)
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        if (!metadata || !metadata.tourSlug) {
            console.error('Missing metadata in payment intent');
            return NextResponse.json({ received: true });
        }

        const { tourTitle, tourSlug, date, guests, time } = metadata;
        const guestCount = parseInt(guests);
        const name = metadata.leadName || 'Guest';
        const email = metadata.leadEmail || paymentIntent.receipt_email || '';

        console.log(`[${siteId}] PaymentIntent: ${tourTitle} | name=${name} | email=${email}`);

        try {
            // Check if booking already exists (Idempotency)
            const { data: existing } = await supabaseAdmin
                .from('bookings')
                .select('id')
                .eq('stripe_payment_intent_id', paymentIntent.id)
                .single();

            if (existing) {
                console.log('Booking already processed');
                return NextResponse.json({ received: true });
            }

            // 1. Reserve Inventory (non-blocking — don't prevent booking if inventory table is missing)
            try {
                const inventoryResult = await reserveInventory(tourSlug, date, time, guestCount);
                if (!inventoryResult.success) {
                    console.warn(`[${siteId}] Inventory reservation failed (non-blocking):`, inventoryResult.error);
                }
            } catch (invErr) {
                console.warn(`[${siteId}] Inventory service error (non-blocking):`, invErr);
            }

            // 2. Create Booking
            const { data: booking, error: bookingError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_title: tourTitle,
                    tour_slug: tourSlug,
                    date: date,
                    time: time,
                    guests: guestCount,
                    total_price: paymentIntent.amount / 100,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: metadata.leadPhone || null,
                    status: 'paid',
                    stripe_payment_intent_id: paymentIntent.id,
                    adults: parseInt(metadata.adults || '0'),
                    students: parseInt(metadata.students || '0'),
                    youths: parseInt(metadata.youths || '0'),
                    guest_details: {
                        hotel: metadata.hotelName,
                        pickup: metadata.pickupRequired,
                        luggage: metadata.luggageDeposit,
                        addOns: metadata.addOns ? JSON.parse(metadata.addOns) : [],
                        guestCounts: metadata.guestCounts ? JSON.parse(metadata.guestCounts) : {}
                    },
                    site_id: siteId,
                })
                .select()
                .single();

            if (bookingError) {
                // CRITICAL: Release inventory if booking creation fails
                console.error('Booking creation failed, releasing inventory:', bookingError);
                await releaseInventory(tourSlug, date, time, guestCount);
                return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
            }

            // 3. Log audit trail
            await logAuditAction(
                'system',
                'stripe_webhook',
                'booking_created',
                'booking',
                booking.id,
                {
                    tour_title: tourTitle,
                    customer_email: email,
                    total_price: paymentIntent.amount / 100,
                    site_id: siteId,
                    payment_intent_id: paymentIntent.id
                }
            );

            // 4. Send Emails
            await sendEmails(siteId, email, name, tourTitle, date, time, guests, paymentIntent.amount / 100, paymentIntent.id, metadata);

        } catch (err) {
            console.error('Error processing payment intent:', err);
            return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
        }
    }
    // Handle Checkout Session Completed
    else if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata;

        if (!metadata || !metadata.tourSlug) {
            console.log(`[${siteId}] Checkout session without tour metadata, skipping`);
            return NextResponse.json({ received: true });
        }

        const { tourTitle, tourSlug, date, guests, time } = metadata;
        const guestCount = parseInt(guests);
        const name = metadata.leadName || 'Guest';
        const email = metadata.leadEmail || session.customer_email || '';

        console.log(`[${siteId}] Checkout Session: ${tourTitle} for ${name} (${guestCount} pax)`);

        try {
            // Check if booking already exists (Idempotency)
            const { data: existing } = await supabaseAdmin
                .from('bookings')
                .select('id')
                .eq('stripe_session_id', session.id)
                .single();

            if (existing) {
                console.log('Booking already processed (checkout session)');
                return NextResponse.json({ received: true });
            }

            // 1. Reserve Inventory (non-blocking)
            try {
                const inventoryResult = await reserveInventory(tourSlug, date, time, guestCount);

                if (!inventoryResult.success) {
                    console.warn(`[${siteId}] Inventory reservation failed (non-blocking):`, inventoryResult.error);
                }
            } catch (invErr) {
                console.warn(`[${siteId}] Inventory service error (non-blocking):`, invErr);
            }

            // 2. Create Booking
            const { data: booking, error: bookingError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_title: tourTitle,
                    tour_slug: tourSlug,
                    date: date,
                    time: time,
                    guests: guestCount,
                    total_price: (session.amount_total || 0) / 100,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: metadata.leadPhone,
                    status: 'paid',
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: session.payment_intent,
                    adults: parseInt(metadata.adults || '0'),
                    students: parseInt(metadata.students || '0'),
                    youths: parseInt(metadata.youths || '0'),
                    guest_details: {
                        hotel: metadata.hotelName,
                        pickup: metadata.pickupRequired,
                        luggage: metadata.luggageDeposit,
                        addOns: metadata.addOns ? JSON.parse(metadata.addOns) : [],
                        guestCounts: metadata.guestCounts ? JSON.parse(metadata.guestCounts) : {}
                    },
                    site_id: siteId,
                })
                .select()
                .single();

            if (bookingError) {
                // CRITICAL: Release inventory if booking creation fails
                console.error('Booking creation failed, releasing inventory:', bookingError);
                await releaseInventory(tourSlug, date, time, guestCount);
                return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
            }

            // 3. Log audit trail
            await logAuditAction(
                'system',
                'stripe_webhook',
                'booking_created',
                'booking',
                booking.id,
                {
                    tour_title: tourTitle,
                    customer_email: email,
                    total_price: (session.amount_total || 0) / 100,
                    site_id: siteId,
                    session_id: session.id
                }
            );

            // 4. Send Emails
            await sendEmails(siteId, email, name, tourTitle, date, time, guests, (session.amount_total || 0) / 100, session.id, metadata);

        } catch (err) {
            console.error('Error processing checkout session:', err);
            return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
        }
    }
    // Handle Payment Failed
    else if (event.type === 'payment_intent.payment_failed') {
        const failedPayment = event.data.object;
        console.log(`[${siteId}] Payment failed:`, failedPayment.id, failedPayment.last_payment_error?.message);

        // Log failed payment for analysis
        await logAuditAction(
            'system',
            'stripe_webhook',
            'booking_cancelled',
            'payment_intent',
            failedPayment.id,
            {
                error_message: failedPayment.last_payment_error?.message,
                site_id: siteId,
                reason: 'payment_failed'
            }
        );
    }
    else {
        console.log(`[${siteId}] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, site: siteId });
}
