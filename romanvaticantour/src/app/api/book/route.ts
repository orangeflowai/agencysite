export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

// Service role client — bypasses RLS for inserting bookings
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

function generateBookingRef(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = '';
    for (let i = 0; i < 8; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const safeName = escapeHtml(String(body.name ?? ''));
        const safeTourTitle = escapeHtml(String(body.tourTitle ?? ''));
        const safeDate = escapeHtml(String(body.date ?? ''));
        const safeGuests = escapeHtml(String(body.guests ?? ''));

        const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
        const bookingRef = generateBookingRef();

        console.log("------------------------------------------------");
        console.log("📧 NEW BOOKING RECEIVED");
        console.log("------------------------------------------------");
        console.log("Product:", body.tourTitle);
        console.log("Date:", body.date);
        console.log("Time:", body.time);
        console.log("Guests:", body.guests);
        console.log("Name:", body.name);
        console.log("Email:", body.email);
        console.log("Total:", body.price);
        console.log("Site:", siteId);
        console.log("Ref:", bookingRef);
        console.log("------------------------------------------------");

        // 1. INSERT BOOKING INTO DATABASE
        let bookingId: string | null = null;
        let dbError: string | null = null;

        try {
            const guestCounts: Record<string, number> = {};
            if (body.guestCounts && typeof body.guestCounts === 'object') {
                for (const [key, val] of Object.entries(body.guestCounts)) {
                    guestCounts[key] = Number(val) || 0;
                }
            } else {
                guestCounts['Adult'] = Number(body.adults) || Number(body.guests) || 0;
            }

            const fullName = safeName.split(' ');
            const firstName = fullName[0] || safeName;
            const lastName = fullName.slice(1).join(' ') || '';

            const { data: booking, error: insertError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_slug: body.tourSlug || '',
                    tour_title: safeTourTitle,
                    date: body.date || '',
                    time: body.time || '09:00',
                    lead_first_name: firstName,
                    lead_last_name: lastName,
                    lead_email: body.email || '',
                    lead_phone: body.phone || null,
                    guests: Number(body.guests) || 0,
                    total_amount: Number(body.price) || 0,
                    currency: 'eur',
                    status: 'pending',
                    tenant: siteId,
                    booking_ref: bookingRef,
                    guest_counts: guestCounts,
                    source: 'website',
                    notes: body.notes || null,
                    pickup_location: body.pickupLocation || null,
                })
                .select()
                .single();

            if (insertError) {
                console.error('❌ DB insert failed:', insertError.message);
                dbError = insertError.message;
            } else {
                bookingId = booking?.id || null;
                console.log('✅ Booking saved:', bookingId, 'Ref:', bookingRef);
            }
        } catch (err: any) {
            console.error('❌ DB error:', err.message);
            dbError = err.message;
        }

        // 2. SEND CONFIRMATION EMAIL
        let emailSent = false;
        let emailError: string | null = null;

        if (process.env.RESEND_API_KEY && body.email) {
            try {
                await resend.emails.send({
                    from: `${process.env.NEXT_PUBLIC_SITE_NAME || 'Bookings'} <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
                    to: body.email,
                    subject: `Booking Confirmed: ${safeTourTitle}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: ${process.env.NEXT_PUBLIC_BRAND_COLOR || "#4a5d4a"}; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
                            </div>
                            <div style="padding: 30px; background: #f9f9f7;">
                                <p>Dear <strong>${safeName}</strong>,</p>
                                <p>Thank you for your booking! Your reservation has been confirmed.</p>

                                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5;">
                                    <h3 style="margin-top: 0; color: ${process.env.NEXT_PUBLIC_BRAND_COLOR || "#4a5d4a"};">Booking Details</h3>
                                    <p><strong>Reference:</strong> ${bookingRef}</p>
                                    <p><strong>Tour:</strong> ${safeTourTitle}</p>
                                    <p><strong>Date:</strong> ${safeDate}</p>
                                    <p><strong>Time:</strong> ${escapeHtml(String(body.time || '09:00'))}</p>
                                    <p><strong>Guests:</strong> ${safeGuests}</p>
                                    <p><strong>Total:</strong> €${body.price}</p>
                                </div>

                                <p style="color: #666;">Please arrive 15 minutes before your scheduled time. Remember to bring a valid ID and dress appropriately (shoulders and knees covered).</p>

                                <p>Questions? Contact us at <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romanvaticantour.com"}">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romanvaticantour.com"}</a></p>
                            </div>
                            <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                                © 2026 ${process.env.NEXT_PUBLIC_SITE_NAME || "Roman Vatican Tour"}. All rights reserved.
                            </div>
                        </div>
                    `
                });
                console.log("✅ Confirmation email sent to:", body.email);
                emailSent = true;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("❌ Failed to send email:", errorMessage);
                emailError = errorMessage;
            }
        }

        // 3. SEND ADMIN NOTIFICATION
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
            try {
                await resend.emails.send({
                    from: `System Alert <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
                    to: process.env.ADMIN_EMAIL.split(',').map((e: string) => e.trim()),
                    subject: `[NEW BOOKING] ${safeTourTitle} - ${safeDate}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>🔔 New Booking Received</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Reference</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingRef}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tour</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeTourTitle}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeDate} at ${escapeHtml(String(body.time || '09:00'))}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName} (${escapeHtml(String(body.email || 'N/A'))})</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(body.phone || 'N/A'))}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guests</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeGuests}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">€${body.price}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Status</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingId ? '✅ Saved to DB' : '⚠️ DB insert failed'}</td></tr>
                            </table>
                            ${dbError ? `<p style="color: red;">DB Error: ${dbError}</p>` : ''}
                            <p style="margin-top: 20px;">View in admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/bookings">${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/bookings</a></p>
                        </div>
                    `
                });
                console.log("✅ Admin notification sent to:", process.env.ADMIN_EMAIL);
            } catch (err: unknown) {
                console.error("❌ Admin notification failed:", err instanceof Error ? err.message : String(err));
            }
        }

        return NextResponse.json({
            success: true,
            message: "Booking confirmed",
            bookingRef,
            bookingId,
            emailSent,
            emailError,
            dbError,
        });

    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { success: false, message: "Booking failed" },
            { status: 500 }
        );
    }
}
