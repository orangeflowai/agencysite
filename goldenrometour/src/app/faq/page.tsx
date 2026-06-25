'use client';

import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Mail, Phone, Shield, CreditCard, Clock, Camera, UserCheck } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const faqCategories = [
    {
        title: "Vatican Tickets & Entry",
        icon: <CreditCard className="w-6 h-6 text-foreground" />,
        items: [
            {
                question: "Do I need to buy Vatican tickets in advance?",
                answer: "Yes, absolutely. Vatican Museums tickets sell out days or even weeks in advance, especially during peak season (April–October). We secure skip-the-line tickets for all our guests, but bookings must be made at least 48 hours ahead."
            },
            {
                question: "What is the difference between the Vatican Museums and St. Peter's Basilica?",
                answer: "The Vatican Museums house the Sistine Chapel and vast art collections, while St. Peter's Basilica is a separate church (and free to enter). Our guided tours include both, but note that St. Peter's may close unexpectedly for religious ceremonies."
            },
            {
                question: "Are there any dress code requirements?",
                answer: "Yes. Both the Vatican Museums and St. Peter's Basilica enforce a strict dress code: shoulders and knees must be covered for both men and women. We recommend bringing a scarf or shawl, even in summer."
            }
        ]
    },
    {
        title: "Tour Timing & Scheduling",
        icon: <Clock className="w-6 h-6 text-foreground" />,
        items: [
            {
                question: "What time should I arrive for my Vatican tour?",
                answer: "Please arrive at our meeting point 20 minutes before your scheduled entry time. Vatican entry slots are strictly enforced—if you miss your window by even 5 minutes, the museums may deny entry with no refund."
            },
            {
                question: "How long does a typical Vatican tour last?",
                answer: "Our standard Vatican Museums & Sistine Chapel tour lasts approximately 3 hours. If you add St. Peter's Basilica, plan for 3.5 to 4 hours total. The Early Morning VIP tour is 2.5 hours."
            },
            {
                question: "Can I visit the Vatican on a Sunday?",
                answer: "The Vatican Museums are closed every Sunday except the last Sunday of the month (free entry, but extremely crowded). St. Peter's Basilica remains open daily. We strongly recommend booking Tuesday–Thursday for the best experience."
            }
        ]
    },
    {
        title: "Photography & Restrictions",
        icon: <Camera className="w-6 h-6 text-foreground" />,
        items: [
            {
                question: "Can I take photos inside the Sistine Chapel?",
                answer: "No. Photography and video are strictly prohibited inside the Sistine Chapel. Guards actively enforce this rule. However, you may take photos (without flash) in the Vatican Museums galleries and St. Peter's Basilica."
            },
            {
                question: "Are backpacks or large bags allowed?",
                answer: "Large bags, backpacks, and umbrellas must be checked in the cloakroom. Bags exceeding 40cm x 35cm x 15cm are not permitted inside. We recommend traveling light for your Vatican visit."
            },
            {
                question: "Can I bring food or water into the Vatican?",
                answer: "Small water bottles are permitted, but food and snacks are not allowed inside the museums. There is a café inside if you need refreshments, though we recommend eating before your tour."
            }
        ]
    },
    {
        title: "Accessibility & Special Needs",
        icon: <UserCheck className="w-6 h-6 text-foreground" />,
        items: [
            {
                question: "Is the Vatican wheelchair accessible?",
                answer: "The Vatican Museums offer wheelchair rental and elevator access to most areas, but the route is lengthy. Please notify us when booking so we can arrange the accessible path and ensure your guide is prepared."
            },
            {
                question: "Do children need tickets for the Vatican?",
                answer: "Children under 6 enter free but still require a reservation. Ages 6–18 receive reduced pricing with valid ID. Strollers are permitted but may need to be carried in certain areas."
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
        <main className="min-h-screen bg-card font-body selection:bg-card selection:text-white">
            <Header />

            <div className="bg-card text-white py-24 text-center relative overflow-hidden border-b border-border/20">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 relative z-10 pt-12">
                    <p className="text-foreground font-bold  tracking-tight text-[8px] mb-4">Operations Team</p>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-tighter  ">Common Inquiries</h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Essential info for your Vatican Museums & Sistine Chapel visit.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="space-y-12">
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4 sticky top-24 bg-card/90 backdrop-blur-md z-10">
                                {category.icon}
                                <h2 className="text-2xl font-heading font-bold text-secondary   tracking-tight">{category.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.items.map((item, index) => {
                                    const id = `${catIndex}-${index}`;
                                    const isOpen = activeIndex === id;

                                    return (
                                        <div
                                            key={index}
                                            className={clsx(
                                                "bg-card rounded-lg border overflow-hidden shadow-sm transition-all duration-300",
                                                isOpen ? "border-border border-l-4 shadow-md" : "border-border hover:border-border/50"
                                            )}
                                        >
                                            <button
                                                onClick={() => toggle(id)}
                                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-card"
                                            >
                                                <span className={clsx(
                                                    "font-bold text-lg pr-8 transition-colors",
                                                    isOpen ? "text-foreground" : "text-foreground"
                                                )}>
                                                    {item.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="text-foreground flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="text-foreground flex-shrink-0" />
                                                )}
                                            </button>

                                            {isOpen && (
                                                    <div>
                                                        <div className="px-6 pb-6 text-foreground leading-relaxed border-t border-border/50 pt-4">
                                                            {item.answer}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-card rounded-2xl p-8 md:p-12 text-center border border-border shadow-lg shadow-[#0A1628]/5">
                    <h3 className="text-2xl font-heading font-bold text-secondary mb-4   tracking-tight">Still have questions?</h3>
                    <p className="text-foreground mb-8 max-w-lg mx-auto">
                        Our Vatican specialists are here to help! Available 8:00 AM – 7:00 PM (CET).
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@goldenrometour.com'}`} className="flex items-center gap-2 px-6 py-3 bg-card text-foreground font-bold rounded-full border border-border hover:border-border shadow-sm transition-all hover:-translate-y-1">
                            <Mail size={18} className="text-foreground" />
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@goldenrometour.com'}
                        </a>
                        <a href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+393514199425'}`} className="flex items-center gap-2 px-6 py-3 bg-card text-foreground font-bold rounded-full hover:bg-card shadow-lg shadow-[#C9A227]/20 transition-all hover:-translate-y-1">
                            <Phone size={18} />
                            {process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 351 419 9425"}
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
