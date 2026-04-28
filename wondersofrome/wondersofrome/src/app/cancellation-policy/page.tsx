import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cancellation & Refund Policy | Wonders of Rome',
    description: 'Cancellation and Refund Policy for Wonders of Rome bookings.',
};

export default function CancellationPolicy() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-heading text-center mb-4 text-foreground">Cancellation & Refund Policy</h1>
                <p className="text-center text-muted-foreground mb-16 font-mono text-[10px]  tracking-[0.4em]">Last Updated: February 20, 2026 // REF: POL-772-B</p>

                <div className="prose prose-lg mx-auto text-foreground/80 font-medium leading-relaxed space-y-12">
                    <p className="lead text-xl text-foreground font-serif  border-l-4 border-primary pl-6">
                        At Wonders of Rome, we understand that travel plans can change. This policy outlines the conditions under which you may cancel your bookings and your eligibility for refunds.
                    </p>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold   tracking-tight text-primary">1. Booking Options at Checkout</h3>
                        <p>We offer <strong>two booking options</strong> for most of our editorial collections:</p>
                        <ul className="list-disc pl-5 space-y-4 marker:text-primary">
                            <li><strong className="text-foreground">Refundable:</strong> The standard selection when booking more than 24 hours in advance. Offers maximum flexibility for changing archives.</li>
                            <li><strong className="text-foreground">Non-Refundable:</strong> A priority rate for travelers with fixed schedules. No refund or modification is possible once initiated.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold   tracking-tight text-primary">2. General Cancellation Rules</h3>
                        <p>
                            All cancellation requests must be submitted in writing via the terminal at <a href="mailto:info@wondersofrome.com" className="text-primary font-bold hover:underline">info@wondersofrome.com</a> or by contacting our operations center at <a href="tel:3514199425" className="text-primary font-bold hover:underline">+39 351 419 9425</a>. The timing is calculated in Rome local time (CET/CEST).
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold   tracking-tight text-primary">3. Refund Eligibility Tiers</h3>
                        <p>Unless a specific tour archive states otherwise, the following standard protocol applies:</p>

                        <div className="overflow-hidden my-8 border border-border rounded-[2rem] shadow-sm bg-card">
                            <table className="min-w-full text-left text-sm md:text-base">
                                <thead className="bg-foreground text-background font-mono text-[10px]  tracking-widest">
                                    <tr>
                                        <th className="py-5 px-8 font-bold w-1/2">Time of Cancellation</th>
                                        <th className="py-5 px-8 font-bold w-1/2">Refund Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr className="hover:bg-background/50 transition-colors">
                                        <td className="py-5 px-8 font-medium text-foreground">More than 6 working days before the tour</td>
                                        <td className="py-5 px-8 text-primary font-bold font-mono">100% REFUND</td>
                                    </tr>
                                    <tr className="hover:bg-background/50 transition-colors">
                                        <td className="py-5 px-8 font-medium text-foreground">3 to 6 days before the tour</td>
                                        <td className="py-5 px-8 text-primary font-bold font-mono">50% REFUND</td>
                                    </tr>
                                    <tr className="hover:bg-background/50 transition-colors">
                                        <td className="py-5 px-8 font-medium text-foreground">Less than 72 hours before the tour</td>
                                        <td className="py-5 px-8 text-destructive font-bold font-mono">0% REFUND</td>
                                    </tr>
                                    <tr className="hover:bg-background/50 transition-colors">
                                        <td className="py-5 px-8 font-medium text-foreground">No-Show on the day of the tour</td>
                                        <td className="py-5 px-8 text-destructive font-bold font-mono">0% REFUND</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <p className="font-serif font-bold   tracking-tight text-primary mb-4 relative z-10">Critical Notice:</p>
                        <p className="text-foreground/80 text-sm leading-relaxed relative z-10">
                            Many premium tours (especially Colosseum, Vatican Museums, Underground archives, and all timed-entry tickets) are <strong>non-refundable and non-transferable immediately upon purchase</strong>. The full ticket cost will be deducted from any refund, as these slots are permanently allocated.
                        </p>
                    </div>

                    <section className="space-y-6 pt-12 border-t border-border">
                        <h3 className="text-xl font-serif font-bold   tracking-tight text-foreground">Operational Protocol</h3>
                        <p className="text-sm text-muted-foreground">
                            Tours run on a strict schedule. Late arrivals may result in missing the tour with no refund. We strongly recommend arriving at least 20 minutes before your scheduled start time. Wonders of Rome is not responsible for personal delays or external logistical issues.
                        </p>
                    </section>
                </div>

                <div className="mt-24 text-center">
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-bold  tracking-widest text-xs hover:bg-primary transition-all">
                        Contact Support Center
                    </Link>
                </div>
            </div>

            <Footer />
            <WhatsAppButton />
        </main>
    );
}