export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@wondersofrome.com';

// Simple in-memory rate limiter — 5 bookings per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 3600_000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
    // Demo-only guard in production
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEMO_BOOKING) {
        return NextResponse.json({ error: 'Direct booking not available' }, { status: 403 });
    }

    // Rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    try {
        const body = await request.json();

        console.log("------------------------------------------------");
        console.log("📧 NEW BOOKING RECEIVED");
        console.log("------------------------------------------------");
        console.log("Product:", body.tourTitle);
        console.log("Date:", body.date);
        console.log("Guests:", body.guests);
        console.log("Name:", body.name);
        console.log("Email:", body.email);
        console.log("Total:", body.price);
        console.log("RESEND_API_KEY present:", !!process.env.RESEND_API_KEY);
        console.log("------------------------------------------------");

        let emailSent = false;
        let emailError: string | null = null;
        let bookingRef = '';

        // 1. Persist to Supabase FIRST
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );
                bookingRef = nanoid(8).toUpperCase();
                const { error: dbError } = await supabaseAdmin.from('bookings').insert({
                    booking_ref: bookingRef,
                    tour_title: body.tourTitle,
                    tour_slug: body.tourSlug || '',
                    date: body.date,
                    time: body.time || '',
                    guests: body.guests || 1,
                    total_amount: body.price || 0,
                    currency: 'EUR',
                    status: 'confirmed',
                    lead_first_name: (body.name || '').split(' ')[0] || '',
                    lead_last_name: (body.name || '').split(' ').slice(1).join(' ') || '',
                    lead_email: body.email,
                    source: 'direct_booking',
                    meeting_point: body.meetingPoint || '',
                });
                if (dbError) {
                    console.error('[book] Supabase write failed:', dbError);
                } else {
                    console.log('[book] Booking written to Supabase:', bookingRef);
                }
            } catch (dbErr) {
                console.error('[book] Supabase write error:', dbErr);
            }
        }

        // 2. Send confirmation email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const result = await resend.emails.send({
                    from: `Wonders of Rome <${SENDER_EMAIL}>`,
                    to: body.email,
                    subject: `Booking Confirmed: ${body.tourTitle}${bookingRef ? ` (Ref: ${bookingRef})` : ''}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: #4a5d4a; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
                            </div>
                            <div style="padding: 30px; background: #f9f9f7;">
                                <p>Dear <strong>${body.name}</strong>,</p>
                                <p>Thank you for booking with Wonders of Rome! Your reservation has been confirmed.</p>
                                ${bookingRef ? `<p style="text-align:center;font-size:18px;font-weight:bold;margin:20px 0;">Reference: ${bookingRef}</p>` : ''}
                                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5;">
                                    <h3 style="margin-top: 0; color: #4a5d4a;">Booking Details</h3>
                                    <p><strong>Tour:</strong> ${body.tourTitle}</p>
                                    <p><strong>Date:</strong> ${body.date}</p>
                                    <p><strong>Guests:</strong> ${body.guests}</p>
                                    <p><strong>Total:</strong> €${body.price}</p>
                                </div>
                                <p style="color: #666;">Please arrive 15 minutes before your scheduled time. Remember to bring a valid ID and dress appropriately (shoulders and knees covered).</p>
                                <p>Questions? Contact us at <a href="mailto:${SENDER_EMAIL}">${SENDER_EMAIL}</a></p>
                            </div>
                            <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                                © 2026 wondersofrome.com. All rights reserved.
                            </div>
                        </div>
                    `
                });
                console.log("✅ Resend API response:", JSON.stringify(result));
                emailSent = true;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("❌ Failed to send email:", errorMessage);
                emailError = errorMessage;
            }
        } else {
            console.warn("⚠️ RESEND_API_KEY not configured");
            emailError = "Email service not configured";
        }

        return NextResponse.json({
            success: true,
            message: "Booking confirmed",
            bookingRef: bookingRef || undefined,
            emailSent,
            emailError
        });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { success: false, message: "Booking failed" },
            { status: 500 }
        );
    }
}
