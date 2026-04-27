'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, Phone, Shield, Footprints, CreditCard, Church, Landmark } from 'lucide-react';
import clsx from 'clsx';

const faqCategories = [
    {
        title: "Reservations & Payments",
        icon: <CreditCard className="w-6 h-6 text-primary" />,
        items: [
            {
                question: "How far ahead should I reserve my spot?",
                answer: "For standard walking tours, 2–3 days is usually sufficient. However, Vatican Museums and Colosseum Underground slots often disappear weeks in advance during high season. We suggest securing your preferred date as early as possible to avoid disappointment."
            },
            {
                question: "What payment methods do you accept?",
                answer: "We process all major credit and debit cards through our encrypted checkout. Apple Pay and Google Pay are also available. Cash payments are only accepted for private bookings arranged directly via phone."
            },
            {
                question: "If my plans shift, can I get my money back?",
                answer: "Cancellations made eight or more days prior to the activity receive a complete refund. Between three and seven days, we retain a small processing fee and refund the remainder. Unfortunately, bookings cancelled within 72 hours of departure cannot be refunded, as tickets are already committed to our suppliers."
            }
        ]
    },
    {
        title: "Vatican Museums & Holy Sites",
        icon: <Church className="w-6 h-6 text-primary" />,
        items: [
            {
                question: "Will I be turned away if I'm wearing shorts?",
                answer: "Quite possibly. The Vatican enforces one of the strictest dress codes in Rome—arms and legs must be covered all the way to the knees and shoulders. This applies to everyone regardless of the heat outside. A light scarf or cardigan tucked in your bag is a lifesaver."
            },
            {
                question: "Why can't I snap pictures in the Sistine Chapel?",
                answer: "The chapel's frescoes are extremely sensitive to light and flash photography accelerates pigment deterioration. Additionally, the Vatican maintains the space as a place of worship. Guards patrol silently and will ask you to put your device away if they see a lens pointed upward."
            },
            {
                question: "Are the Museums closed on religious holidays?",
                answer: "Most Vatican closures follow the papal calendar. Aside from the usual Sunday closure (except final Sundays), expect shutdowns around Christmas, Easter, and other significant feast days. We always notify confirmed guests immediately if a closure affects their reservation."
            }
        ]
    },
    {
        title: "Colosseum & Ancient City",
        icon: <Landmark className="w-6 h-6 text-primary" />,
        items: [
            {
                question: "Why do you need my passport details just to visit a ruin?",
                answer: "Italian cultural authorities require exact personal data for every visitor entering the Colosseum. Your name on the booking must mirror the name in your passport or government-issued ID exactly. Security staff check this routinely at the turnstiles."
            },
            {
                question: "What's the real difference between 'Arena Floor' and 'Underground' visits?",
                answer: "The Arena Floor lets you stand on a reconstructed wooden platform where gladiators once fought, looking up at the same sky they saw. The Underground descends into the hypogeum—the labyrinth of tunnels and cages beneath the stage where animals and performers awaited their fate. Underground visits require specially licensed guides and have extremely limited capacity."
            },
            {
                question: "Is there anywhere to grab water or use the restroom inside the amphitheater?",
                answer: "Facilities exist only at the entry level. Once you ascend to the upper tiers or step onto the Arena Floor, there are no toilets or vendors for the duration of the guided portion. We recommend visiting the restroom and filling your bottle before passing through security."
            }
        ]
    },
    {
        title: "Getting There & Getting Around",
        icon: <Footprints className="w-6 h-6 text-primary" />,
        items: [
            {
                question: "How do I find my guide in a sea of tourists?",
                answer: "Your voucher contains a precise street address plus a pinned Google Maps link. Look for our representative holding a branded sign or flag at the exact coordinates. We strongly advise arriving fifteen minutes early—Roman traffic and metro delays are unpredictable."
            },
            {
                question: "What if my train is delayed and I miss the group?",
                answer: "Historic sites operate on rigid time slots. If you arrive after the group has entered the Colosseum or Vatican, the venue will not allow a solo catch-up, and we cannot interrupt a tour in progress. Travel insurance that covers missed departures is highly recommended."
            },
            {
                question: "Will my grandmother be comfortable on this tour?",
                answer: "Ancient Rome involves cobblestones, stairs, and inclines with very little seating. The Vatican route covers several kilometers of marble corridors. If mobility is a concern, please email us beforehand so we can select a private vehicle-assisted itinerary or a route with elevator access."
            }
        ]
    },
    {
        title: "Weather & Practical Concerns",
        icon: <Shield className="w-6 h-6 text-primary" />,
        items: [
            {
                question: "Do tours get called off when it pours?",
                answer: "Rain rarely stops us—Roman monuments look dramatic under grey skies. We provide disposable ponchos when needed. Only official site closures due to flooding or severe weather alerts trigger rescheduling or refunds."
            },
            {
                question: "Should I carry cash for tips or souvenirs?",
                answer: "Guides appreciate gratuities in cash when you feel they've exceeded expectations. Most souvenir stalls near the sites also prefer cash for small items, though cards are accepted inside museum shops."
            },
            {
                question: "How is my personal information handled?",
                answer: "Your details are used exclusively for booking confirmation, ticket procurement, and emergency contact. We never share or sell data to marketing firms. Full transparency is available in our privacy documentation."
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
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight mt-10">Rome Tour FAQs</h1>
                    <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        From the Vatican to the Colosseum — answers for every Roman adventure.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="space-y-12">
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                                {category.icon}
                                <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.items.map((item, index) => {
                                    const id = `${catIndex}-${index}`;
                                    const isOpen = activeIndex === id;

                                    return (
                                        <div
                                            key={index}
                                            className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                        >
                                            <button
                                                onClick={() => toggle(id)}
                                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-card"
                                            >
                                                <span className={clsx(
                                                    "font-bold text-lg pr-8 transition-colors",
                                                    isOpen ? "text-emerald-700" : "text-gray-800"
                                                )}>
                                                    {item.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="text-primary flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="text-muted-foreground flex-shrink-0" />
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
                                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-gray-50">
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

                <div className="mt-20 bg-secondary rounded-2xl p-8 md:p-12 text-center border border-emerald-100">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Can't find what you're looking for?</h3>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Our Rome team is on standby from 8:00 AM to 7:00 PM, seven days a week.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a href="mailto:info@romanvaticantour.com" className="flex items-center gap-2 px-6 py-3 bg-card text-emerald-800 font-bold rounded-lg border border-emerald-200 hover:border-emerald-400 shadow-sm transition-all hover:-translate-y-1">
                            <Mail size={18} />
                            info@romanvaticantour.com
                        </a>
                        <a href="tel:+393895217315" className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1">
                            <Phone size={18} />
                            +39 389 521 7315
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
