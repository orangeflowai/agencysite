'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react'; // Changed to Plus/Minus for cleaner look
import clsx from 'clsx';

const faqs = [
    {
        question: "What is the Vatican dress code?",
        answer: "Strict modesty is enforced. Both men and women must cover knees and shoulders. Sleeveless tops, shorts, short skirts, and hats are prohibited. Security staff may deny entry with no refund."
    },
    {
        question: "Do I need to print my tickets?",
        answer: "Printing is unnecessary. Present your digital ticket (QR code) on a smartphone at the turnstile. Ensure your screen brightness is up and your phone is charged."
    },
    {
        question: "What happens at security?",
        answer: "All visitors pass through metal detectors and bag checks. Prohibited items include large backpacks, umbrellas, glass bottles, aerosols, knives, and scissors. Lockers are not available."
    },
    {
        question: "Is the Vatican wheelchair accessible?",
        answer: "The Museums offer step-free routes and elevators for most areas. St. Peter's Basilica is accessible via a ramp. However, the Dome climb and some narrow corridors are not. Contact us to arrange an accessible route."
    },
    {
        question: "What is the late arrival policy?",
        answer: "Time slots are enforced strictly by Vatican authorities. Arrive 15 minutes prior to your entry time. Latecomers are treated as no-shows and are not guaranteed re-entry or refunds."
    },
    {
        question: "What is the cancellation policy?",
        answer: "Free cancellation is available up to 24 hours before most tours, and up to 48 hours for some premium experiences. Cancellations within the window are non-refundable. Rescheduling is subject to availability."
    },
    {
        question: "Which payment methods are accepted?",
        answer: "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All transactions are encrypted and processed in your local currency where supported."
    },
    {
        question: "How do private tours work?",
        answer: "Private tours include an expert guide exclusively for your party, skip-the-line entry, customizable pacing, and optional add-ons (e.g., early morning access). Available for groups of 1–20. Pricing scales per person."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-cream relative overflow-hidden border-t border-forest/5">

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="font-sans text-[10px] font-bold  tracking-[0.4em] text-forest/40 mb-4 block">
                        Editorial Support
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8 ">
                        The Rome Compendium
                    </h2>
                    <p className="font-sans text-[11px] md:text-xs font-bold  tracking-[0.2em] text-forest/60 max-w-xl mx-auto leading-loose opacity-60">
                        Essential insights for your curated exploration of the Eternal City.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = activeIndex === index;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className={clsx(
                                    "border transition-all duration-300 overflow-hidden",
                                    isOpen
                                        ? "bg-card border-forest shadow-2xl"
                                        : "bg-cream border-forest/10 hover:border-forest/30"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-10 text-left focus:outline-none bg-transparent"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={clsx(
                                            "mt-1.5 p-2 flex-shrink-0 transition-colors hidden md:block",
                                            isOpen ? "bg-forest text-cream" : "bg-forest/5 text-forest/40"
                                        )}>
                                            <HelpCircle size={14} />
                                        </div>
                                        <span className={clsx(
                                            "font-serif text-lg md:text-2xl font-bold  transition-colors pr-8 leading-tight",
                                            isOpen ? "text-forest" : "text-forest/80"
                                        )}>
                                            {faq.question}
                                        </span>
                                    </div>

                                    <div className={clsx(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-300 border",
                                        isOpen ? "bg-forest text-cream border-forest rotate-180" : "bg-transparent text-forest/30 border-forest/10"
                                    )}>
                                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 md:px-10 pb-10 pt-0 pl-6 md:pl-[6.5rem]">
                                                <p className="font-sans text-xs md:text-sm font-bold  tracking-widest text-forest/60 mb-4 opacity-30">Our Guidance:</p>
                                                <p className="font-sans text-[11px] md:text-sm leading-[2] text-forest/70 font-medium">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
