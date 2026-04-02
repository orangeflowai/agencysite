
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cancellation & Refund Policy | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}',
    description: 'Cancellation and Refund Policy for ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} bookings.',
};

export default function CancellationPolicy() {
    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">CANCELLATION & REFUND POLICY</h1>
                <p className="text-center text-gray-500 mb-12 italic text-sm">Last Updated: February 20, 2026</p>

                <div className="prose prose-lg prose-emerald text-gray-600 max-w-none space-y-8">
                    <p className="lead text-xl text-gray-800 font-medium">
                        At ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}, we understand that travel plans can change. This policy outlines the conditions under which you may cancel your bookings and your eligibility for refunds.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">1. Booking Options at Checkout</h3>
                    <p>We offer <strong>two booking options</strong>:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Refundable</strong> (default when booking more than 24 hours in advance)</li>
                        <li><strong>Non-Refundable</strong> (cheaper price, no refund possible)</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">2. General Cancellation Rules</h3>
                    <p>
                        All cancellation requests must be submitted in writing via email to <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}" className="text-emerald-700 font-bold hover:underline">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a> or by contacting our customer service at <a href="tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}" className="text-emerald-700 font-bold hover:underline">351 419 9425</a>. The timing is calculated in Rome local time (CET/CEST).
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">3. Refund Eligibility Tiers</h3>
                    <p>Unless a specific tour states otherwise, the following standard policy applies:</p>

                    <div className="overflow-x-auto my-8 border border-gray-200 rounded-xl shadow-sm">
                        <table className="min-w-full bg-white text-left text-sm md:text-base">
                            <thead className="bg-emerald-900 text-white">
                                <tr>
                                    <th className="py-4 px-6 font-bold uppercase tracking-wider w-1/2">Time of Cancellation</th>
                                    <th className="py-4 px-6 font-bold uppercase tracking-wider w-1/2">Refund Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">More than 6 working days before the tour</td>
                                    <td className="py-4 px-6 text-emerald-700 font-bold">100% Refund (minus non-refundable fees)</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">3 to 6 days before the tour</td>
                                    <td className="py-4 px-6 text-yellow-600 font-bold">50% Refund</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">Less than 72 hours before the tour</td>
                                    <td className="py-4 px-6 text-red-600 font-bold">No Refund (0%)</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">No-Show on the day of the tour</td>
                                    <td className="py-4 px-6 text-red-600 font-bold">No Refund (0%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6 rounded-r-lg">
                        <p className="font-bold text-amber-900 mb-2 italic">Important:</p>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Many tours (especially Colosseum, Vatican Museums, Underground tours, and all timed-entry tickets) are <strong>non-refundable and non-transferable immediately upon purchase</strong>. The full ticket cost will be deducted from any refund, even if you cancel within the allowed period.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">4. Last-Minute Bookings & Non-Refundable Tours</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Bookings made <strong>less than 24 hours</strong> before the tour start time are <strong>non-refundable</strong>.</li>
                        <li>Private tours, Colosseum Underground, Vatican special entries, and any tour marked &quot;Non-Refundable&quot; on the product page follow the strict 24-hour or immediate non-refundable rule.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">5. No Refunds Once Tour Has Started</h3>
                    <p>No refunds or credits will be issued once the tour has commenced, regardless of the reason.</p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">6. Rescheduling</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>More than 72 hours in advance:</strong> Usually free of charge (subject to availability and new ticket costs).</li>
                        <li><strong>Within 72 hours:</strong> Treated as a cancellation and subject to the above refund policy.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">7. Cancellations by ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}</h3>
                    <p>If we cancel your tour (due to weather, site closures, strikes, etc.), you will receive a <strong>full 100% refund</strong> or the option to reschedule to an alternative date.</p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">8. Late Arrivals</h3>
                    <p>Tours run on a strict schedule. Late arrivals may result in missing the tour with <strong>no refund</strong>. We strongly recommend arriving 15–20 minutes early.</p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">9. Travel Insurance Recommendation</h3>
                    <p>We strongly recommend purchasing comprehensive travel insurance that covers tour cancellations, medical emergencies, and lost luggage. ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} is not responsible for any costs arising from cancellations due to personal reasons.</p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">10. Processing of Refunds</h3>
                    <p>Approved refunds are processed back to the original payment method within <strong>5–10 business days</strong>.</p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">11. Contact Us</h3>
                    <p>For any questions:</p>
                    <ul className="list-none pl-0 space-y-2">
                        <li><strong>Email:</strong> <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}" className="text-emerald-700 font-bold hover:underline">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a></li>
                        <li><strong>Phone/WhatsApp:</strong> <a href="tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}" className="text-emerald-700 font-bold hover:underline">351 419 9425</a></li>
                    </ul>

                    <p className="mt-12 text-center font-bold text-gray-900">
                        Thank you for choosing ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}. We look forward to giving you an unforgettable experience in the Eternal City!
                    </p>
                </div>

            </div>

            <Footer />
        </main>
    );
}
