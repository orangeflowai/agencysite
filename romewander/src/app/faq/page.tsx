
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, Phone, Calendar, Shield, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// Grouping the FAQs by category
const faqCategories = [
    {
        title: "Bookings & Payments",
        icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
        items: [
            {
                question: `How do I book a tour with ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}?`,
                answer: `You can book directly through our website at ${process.env.NEXT_PUBLIC_SITE_URL?.replace("https://","") || "yourdomain.com"}. Simply select your tour, choose a date and time, and follow the checkout process.`
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
        icon: <Calendar className="w-6 h-6 text-emerald-600" />,
        items: [
            {
                question: "What is your cancellation policy?",
                answer: (
                    <div className="space-y-2">
                        <p>We offer a tiered refund system:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>7+ days notice:</strong> 100% refund (minus non-refundable entry tickets).</li>
                            <li><strong>3–7 days notice:</strong> 50% refund.</li>
                            <li><strong>Less than 72 hours:</strong> Non-refundable.</li>
                        </ul>
                    </div>
                )
            },
            {
                question: "Can I change the date of my tour?",
                answer: `We’ll do our best to help! Please contact us at ${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"} at least 72 hours before your tour. Changes are subject to ticket availability and site capacity.`
            },
            {
                question: "What happens if it rains?",
                answer: "Our tours run rain or shine! Rome is beautiful in any weather. If there is an extreme weather event that forces a site closure, we will contact you to reschedule or provide a full refund."
            }
        ]
    },
    {
        title: "On the Day of the Tour",
        icon: <MapPin className="w-6 h-6 text-emerald-600" />,
        items: [
            {
                question: "Where do I meet my guide?",
                answer: "Your confirmation voucher contains a Google Maps link and a description of the meeting point. We recommend arriving 15 minutes early to ensure a smooth start."
            },
            {
                question: "What happens if I’m running late?",
                answer: "Because many sites have strict entry time slots (like the Colosseum), our guides must start on time. If you are late, we may not be able to wait, and late arrivals are non-refundable."
            },
            {
                question: "Do I need to print my tickets?",
                answer: "In most cases, no! You can show your voucher on your smartphone. However, ensure your phone is charged!"
            }
        ]
    },
    {
        title: "Safety & Privacy",
        icon: <Shield className="w-6 h-6 text-emerald-600" />,
        items: [
            {
                question: "How is my data used?",
                answer: "We only use your data to process your booking and improve our services. We never sell your information to third parties. You can read our full Privacy Policy for details."
            },
            {
                question: "Are your tours accessible?",
                answer: "We strive to make our tours as inclusive as possible. Since some historic sites in Rome have uneven terrain, please contact us in advance if you have specific mobility needs so we can advise you on the best routes."
            }
        ]
    }
];

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<string | null>(null);

    const toggle = (id: string) => {
        setActiveIndex(activeIndex === id ? null : id);
    };

    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            <div className="bg-emerald-900 text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Everything you need to know about your trip to Rome.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="space-y-12">
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-2">
                                {category.icon}
                                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.items.map((item, index) => {
                                    const id = `${catIndex}-${index}`;
                                    const isOpen = activeIndex === id;

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                        >
                                            <button
                                                onClick={() => toggle(id)}
                                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white"
                                            >
                                                <span className={clsx(
                                                    "font-bold text-lg pr-8 transition-colors",
                                                    isOpen ? "text-emerald-700" : "text-gray-800"
                                                )}>
                                                    {item.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="text-emerald-600 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    >
                                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50">
                                                            {item.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-20 bg-emerald-50 rounded-2xl p-8 md:p-12 text-center border border-emerald-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        We’re here to help! Our team is available 9:00 AM – 6:00 PM (Rome Time).
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}`} className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold rounded-lg border border-emerald-200 hover:border-emerald-400 shadow-sm transition-all hover:-translate-y-1">
                            <Mail size={18} />
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}
                        </a>
                        <a href="tel:+393898922088" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1">
                            <Phone size={18} />
                            +39 389 892 2088
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
