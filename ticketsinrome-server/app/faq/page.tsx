'use client';

import React, { useState } from 'react';
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, Calendar, Shield, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
    {
        title: "Bookings & Payments",
        icon: <CreditCard className="w-6 h-6" />,
        items: [
            {
                question: "How do I book a tour?",
                answer: "You can book directly through our website. Simply select your tour, choose a date and time, and follow the checkout process."
            },
            {
                question: "Is my payment secure?",
                answer: "Absolutely. We use industry-standard encryption to ensure your personal and payment information is 100% protected."
            },
            {
                question: "Will I receive a booking confirmation?",
                answer: "Yes! As soon as your booking is complete, a confirmation voucher will be sent to your email. Please check your spam folder if you don't see it within 15 minutes."
            }
        ]
    },
    {
        title: "Cancellations & Changes",
        icon: <Calendar className="w-6 h-6" />,
        items: [
            {
                question: "What is your cancellation policy?",
                answer: "We offer free cancellation up to 24 hours before your tour starts for most experiences. Some special access tours may have different policies, which will be clearly stated at booking."
            },
            {
                question: "Can I change the date of my tour?",
                answer: "We’ll do our best to help! Please contact us at info@wondersofrome.com at least 72 hours before your tour. Changes are subject to ticket availability."
            }
        ]
    },
    {
        title: "On the Day of the Tour",
        icon: <MapPin className="w-6 h-6" />,
        items: [
            {
                question: "Where do I meet my guide?",
                answer: "Your confirmation voucher contains a Google Maps link and a description of the meeting point. We recommend arriving 15 minutes early."
            },
            {
                question: "Do I need to print my tickets?",
                answer: "No! You can show your voucher on your smartphone. Just ensure your phone is charged!"
            }
        ]
    }
];

export default function FAQPage() {
    const [openItem, setOpenItem] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-background">
            <Header />
            
            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground text-lg">Everything you need to know about your Roman adventure.</p>
                </div>

                <div className="space-y-12">
                    {faqCategories.map((category) => (
                        <section key={category.title}>
                            <div className="flex items-center gap-3 mb-6">
                                {category.icon}
                                <h2 className="text-xl font-bold">{category.title}</h2>
                            </div>
                            <div className="space-y-4">
                                {category.items.map((item) => (
                                    <div key={item.question} className="border border-border rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => setOpenItem(openItem === item.question ? null : item.question)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                                        >
                                            <span className="font-semibold">{item.question}</span>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${openItem === item.question ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openItem === item.question && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border">
                                                        {item.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-20 p-8 bg-muted rounded-3xl text-center">
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-muted-foreground mb-6">We're here to help you plan the perfect trip.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact" className="px-8 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity">
                            Contact Support
                        </Link>
                        <a href="https://wa.me/393514199425" className="flex items-center gap-2 text-sm font-bold">
                            <Phone size={16} />
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}
