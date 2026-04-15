import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
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
                            <div style="background: #4a5d4a; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
                            </div>
                            <div style="padding: 30px; background: #f9f9f7;">
                                <p>Dear <strong>${body.name}</strong>,</p>
                                <p>Thank you for your booking! Your reservation has been confirmed.</p>
                                
                                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5;">
                                    <h3 style="margin-top: 0; color: #4a5d4a;">Booking Details</h3>
                                    <p><strong>Tour:</strong> ${body.tourTitle}</p>
                                    <p><strong>Date:</strong> ${body.date}</p>
                                    <p><strong>Guests:</strong> ${body.guests}</p>
                                    <p><strong>Total:</strong> €${body.price}</p>
                                </div>
                                
                                <p style="color: #666;">Please arrive 15 minutes before your scheduled time. Remember to bring a valid ID and dress appropriately (shoulders and knees covered).</p>
                                
                                <p>Questions? Contact us at <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a></p>
                            </div>
                            <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                                © 2026 ${process.env.NEXT_PUBLIC_SITE_URL || ""}. All rights reserved.
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
