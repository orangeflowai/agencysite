import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateCustomerEmail, generateAdminEmail } from '@/lib/email-templates';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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
        let bookingSaved = false;
        let bookingError = null;

        // First, save the booking to database
        try {
            const orderId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const { data: booking, error: dbError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_title: body.tourTitle,
                    tour_slug: body.tourSlug || 'direct-booking',
                    date: body.date,
                    time: body.time || '10:00 AM',
                    guests: parseInt(body.guests) || 1,
                    total_price: parseFloat(body.price) || 0,
                    customer_name: body.name,
                    customer_email: body.email,
                    customer_phone: body.phone || null,
                    status: 'paid',
                    stripe_payment_intent_id: orderId, // Use generated ID for direct bookings
                    adults: parseInt(body.adults) || parseInt(body.guests) || 1,
                    students: parseInt(body.students) || 0,
                    youths: parseInt(body.youths) || 0,
                    guest_details: {
                        hotel: body.hotel || null,
                        pickup: body.pickupRequired || null,
                        luggage: body.luggageDeposit || null,
                        addOns: body.addOns || [],
                        guestCounts: {
                            adults: parseInt(body.adults) || parseInt(body.guests) || 1,
                            students: parseInt(body.students) || 0,
                            youths: parseInt(body.youths) || 0
                        }
                    },
                    site_id: 'ticketsinrome',
                })
                .select()
                .single();

            if (dbError) {
                console.error("❌ Database error:", dbError);
                bookingError = dbError.message;
            } else {
                console.log("✅ Booking saved to database:", booking.id);
                bookingSaved = true;
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error("❌ Failed to save booking:", errorMessage);
            bookingError = errorMessage;
        }

        // Send confirmation email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const siteId = 'ticketsinrome'; // Default site ID
                const orderId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const pin = orderId.slice(-6).toUpperCase();
                
                // Generate customer email using the new template
                const customerHtml = generateCustomerEmail(siteId, {
                    name: body.name,
                    tourTitle: body.tourTitle,
                    date: body.date,
                    time: body.time || '10:00 AM',
                    guests: body.guests.toString(),
                    adults: body.adults?.toString() || body.guests.toString(),
                    students: body.students?.toString() || '0',
                    youths: body.youths?.toString() || '0',
                    orderId,
                    pin,
                    totalAmount: parseFloat(body.price) || 0,
                    metadata: {
                        meetingPoint: 'Via Germanico 8, 00192 Roma RM, Italy',
                        addOns: body.addOns || [],
                        ...body
                    }
                });

                const result = await resend.emails.send({
                    from: 'Tickets in Rome <info@ticketsinrome.com>',
                    to: body.email,
                    subject: `Booking Confirmed: ${body.tourTitle} (Ref: ${orderId.slice(-6)})`,
                    html: customerHtml
                });
                
                console.log("✅ Resend API response:", JSON.stringify(result));
                emailSent = true;
                
                // Also send admin email
                const adminHtml = generateAdminEmail(siteId, {
                    name: body.name,
                    email: body.email,
                    phone: body.phone || 'N/A',
                    tourTitle: body.tourTitle,
                    tourSlug: body.tourSlug || 'unknown',
                    date: body.date,
                    time: body.time || '10:00 AM',
                    guests: body.guests.toString(),
                    adults: body.adults?.toString() || body.guests.toString(),
                    students: body.students?.toString() || '0',
                    orderId,
                    pin,
                    totalAmount: parseFloat(body.price) || 0,
                    metadata: body
                });

                await resend.emails.send({
                    from: 'Tickets in Rome Alerts <info@ticketsinrome.com>',
                    to: ['ticketsinrome@gmail.com', 'abiile@ticketsinrome.com'],
                    subject: `[NEW BOOKING] ${body.tourTitle} - ${body.date}`,
                    html: adminHtml
                });
                
                console.log("✅ Admin email sent successfully");
                
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("❌ Failed to send email:", errorMessage);
                console.error("❌ Full error:", err);
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
            emailError,
            bookingSaved,
            bookingError
        });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { success: false, message: "Booking failed" },
            { status: 500 }
        );
    }
}
