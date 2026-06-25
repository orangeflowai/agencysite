export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Vatican-only validation for goldenrometour
        if (process.env.NEXT_PUBLIC_SITE_ID === 'goldenrometour') {
            const tourCategory = body.tourCategory || body.category;
            if (tourCategory && tourCategory !== 'vatican') {
                return NextResponse.json(
                    { success: false, message: "Only Vatican tours are available on this platform" },
                    { status: 400 }
                );
            }
        }

        console.log(`[book] Booking received: ${body.tourTitle} | ${body.date} | ${body.guests} guests | €${body.price}`);

        let emailSent = false;
        let emailError = null;

        // Send confirmation email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const result = await resend.emails.send({
                    from: `${process.env.NEXT_PUBLIC_SITE_NAME || 'Bookings'} <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
                    to: body.email,
                    subject: `Booking Confirmed: ${body.tourTitle}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: ${process.env.NEXT_PUBLIC_BRAND_COLOR || "#4a5d4a"}; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
                            </div>
                            <div style="padding: 30px; background: #f9f9f7;">
                                <p>Dear <strong>${body.name}</strong>,</p>
                                <p>Thank you for your booking! Your reservation has been confirmed.</p>
                                
                                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5;">
                                    <h3 style="margin-top: 0; color: ${process.env.NEXT_PUBLIC_BRAND_COLOR || "#4a5d4a"};">Booking Details</h3>
                                    <p><strong>Tour:</strong> ${body.tourTitle}</p>
                                    <p><strong>Date:</strong> ${body.date}</p>
                                    <p><strong>Guests:</strong> ${body.guests}</p>
                                    <p><strong>Total:</strong> €${body.price}</p>
                                </div>
                                
                                <p style="color: #666;">Please arrive 15 minutes before your scheduled time. Remember to bring a valid ID and dress appropriately (shoulders and knees covered).</p>
                                
                                <p>Questions? Contact us at <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@goldenrometour.com"}">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@goldenrometour.com"}</a></p>
                            </div>
                            <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                                © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_URL || "goldenrometour.com"}. All rights reserved.
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

        // Attempt to persist booking to database for audit/recovery
        let bookingId: string | null = null;
        try {
            const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
            const { data: booking, error: dbError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_title: body.tourTitle,
                    tour_slug: body.tourSlug || '',
                    date: body.date,
                    time: body.time || '',
                    guests: body.guests || 0,
                    guest_counts: body.guestCounts || {},
                    price: body.price || 0,
                    customer_name: body.name,
                    customer_email: body.email,
                    customer_phone: body.phone || '',
                    payment_intent_id: body.paymentIntentId || null,
                    status: 'confirmed',
                    metadata: body.metadata || {},
                })
                .select('id')
                .single();
            if (dbError) {
                console.error('[book] Failed to persist booking:', dbError.message);
            } else {
                bookingId = booking?.id || null;
            }
        } catch (dbErr: unknown) {
            console.error('[book] Database error:', dbErr instanceof Error ? dbErr.message : String(dbErr));
        }

        return NextResponse.json({
            success: true,
            message: "Booking confirmed",
            emailSent,
            bookingId,
        });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { success: false, message: "Booking failed" },
            { status: 500 }
        );
    }
}
