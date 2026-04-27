
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Terms and Conditions | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}`,
    description: `Terms and Conditions for use of ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} services and website.`,
};

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight text-center">Terms and Conditions</h1>
                <p className="text-center text-muted-foreground mb-12  text-sm">Last Updated: February 20, 2026</p>

                <div className="prose prose-lg prose-emerald text-muted-foreground max-w-none space-y-8">
                    <p className="lead text-xl text-gray-800 font-medium">
                        Please read these Terms and Conditions carefully before booking any services with {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}. By making a booking and payment, you agree to be bound by these terms. Contact us first if anything is unclear.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Coupons, Discounts & Promotions</h3>
                    <p>Promotions and codes apply only to direct website bookings unless stated otherwise. They cannot usually be combined. See email confirmations for any expiration or special rules.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Liability & Limitations</h3>
                    <p>{process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} is not liable for personal injury, loss/damage to property or luggage, death, or any other loss during tours or transfers. We accept no responsibility for delays, inconveniences, or problems caused by events outside our reasonable control (force majeure), including war, strikes, weather, natural disasters, government restrictions, or site closures.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Travel Insurance Recommendation</h3>
                    <p>We strongly advise all travelers to purchase comprehensive travel insurance that covers trip cancellation, medical emergencies, evacuation, and lost belongings. {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} is not responsible for any related costs if these events occur.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">SMS / WhatsApp Updates</h3>
                    <p>If you opt in during checkout, you agree to receive booking-related messages (confirmations, changes, logistics) via SMS or WhatsApp. Standard message/data rates may apply. We never share your number or use it for marketing — only for your order.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Late Arrivals Policy</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Group / Semi-Private Tours:</strong> Arrive at least 15 minutes early (per voucher instructions). Late arrival may mean missing the tour — no refund or rescheduling.</li>
                        <li><strong>Private Tours:</strong> Notify us immediately of delays. Guide may wait, but any wait time reduces the total tour length. Last-minute changes could add fees.</li>
                        <li><strong>Airport Transfers:</strong> Drivers wait up to 1 hour past scheduled arrival. Longer delays may result in no service and no refund/rescheduling.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-foreground mt-12">ID & Age Requirements</h3>
                    <p>Bring valid government-issued ID for all tours (required for name/age verification at ticketed sites). Booking ages must match on the tour date. Children under 18: provide ID copy. Students (18–26): show original student card.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Special Ticketed Sites (e.g., Colosseum, Vatican)</h3>
                    <p>Timed-entry tickets (Colosseum Underground, Vatican special access, etc.) are often named, non-changeable, and subject to official availability rules. We try to match requested times but may need adjustments. If a specific access (e.g., underground guide) is unavailable, alternatives like staff accompaniment may apply — no extra compensation. If impossible to provide, we offer full refund or a comparable tour with possible partial credit.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Itinerary Changes</h3>
                    <p>Tour routes or site order may be adjusted for safety, crowds, logistics, or guide decision. No refunds for such changes.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Events Outside Our Control</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Weather:</strong> Tours operate in all conditions. Safety-related adjustments do not qualify for refunds.</li>
                        <li><strong>Closures, Strikes, or Unavailability:</strong> Guide will offer alternative experiences. No refund or compensation for unexpected site/attraction closures (including religious venues).</li>
                        <li><strong>Ticket Shortages:</strong> We will contact you for a new date or full refund if tickets cannot be secured.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Discounts & Last-Minute Bookings</h3>
                    <p>Codes must be entered at checkout (no retroactive application). We accommodate last-minute requests when possible; if not feasible due to availability, we provide alternatives or full refund.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Group Size Policy</h3>
                    <p>Our semi-private tours are capped at 8 participants per guide (up to 10 for certain early-access options like Vatican). We occasionally add 1–2 people to keep groups together (e.g., families). You may end up with fewer than the max. Thanks for your flexibility.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Governing Law</h3>
                    <p>These Terms are governed by the laws of Italy. Disputes are subject to the exclusive jurisdiction of the courts of Rome, Italy.</p>

                    <h3 className="text-2xl font-bold text-foreground mt-12">Contact Us</h3>
                    <p>For any questions or concerns regarding these terms:</p>
                    <ul className="list-none pl-0 space-y-2">
                        <li><strong>Email:</strong> <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}`} className="text-emerald-700 font-bold hover:underline">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a></li>
                        <li><strong>Phone:</strong> <a href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}`} className="text-emerald-700 font-bold hover:underline">351 419 9425</a></li>
                    </ul>
                </div>

            </div>

            <Footer />
        </main>
    );
}
