'use client';

import React from 'react';
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { ShieldCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CancellationPolicyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            
            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Cancellation Policy</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We understand that plans can change. Our cancellation policy is designed to be as 
                        flexible as possible while respecting our commitments to our guides and partners.
                    </p>
                </div>

                <div className="grid gap-8">
                    <section className="p-8 border border-border rounded-3xl bg-muted/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-6 h-6 text-foreground" />
                            <h2 className="text-2xl font-bold">Standard Policy</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                <p><strong>Full Refund:</strong> Cancel up to 24 hours in advance of the experience for a full refund.</p>
                            </div>
                            <div className="flex gap-4">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                                <p><strong>Late Cancellation:</strong> If you cancel less than 24 hours before the experience’s start time, the amount you paid will not be refunded.</p>
                            </div>
                            <div className="flex gap-4">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                                <p><strong>No-Show:</strong> Any changes made less than 24 hours before the experience’s start time will not be accepted.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 px-4">
                        <h3 className="text-xl font-bold">Important Notes</h3>
                        <ul className="list-disc pl-5 space-y-4 text-muted-foreground leading-relaxed">
                            <li>
                                <strong>Cut-off Times:</strong> All cut-off times are based on the experience’s local time (Central European Time).
                            </li>
                            <li>
                                <strong>Special Access Tours:</strong> Some tours (e.g., Private After-Hours Vatican) may have stricter cancellation policies. These will be clearly indicated on the product page and in your confirmation email.
                            </li>
                            <li>
                                <strong>Entry Tickets:</strong> For certain tours, the cost of the entry tickets is non-refundable from the moment of purchase, as these are issued by third-party authorities (e.g., Vatican, Colosseum).
                            </li>
                            <li>
                                <strong>How to Cancel:</strong> To cancel your booking, please follow the link in your confirmation email or contact us at info@wondersofrome.com.
                            </li>
                        </ul>
                    </section>

                    <div className="mt-12 p-8 bg-foreground text-background rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6" />
                                Secure Booking
                            </h3>
                            <p className="text-background/80 text-sm max-w-sm">
                                Book with confidence knowing your purchase is protected by our official refund guarantee.
                            </p>
                        </div>
                        <a href="/contact" className="px-8 py-3 bg-background text-foreground rounded-full font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}
