'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react'; // Changed to Plus/Minus for cleaner look
import clsx from 'clsx';

const faqs = [
    {
        question: "What is the dress code for the Vatican?",
        answer: "The Vatican has a strict dress code. Both men and women must cover their knees and shoulders. Sleeveless tops and shorts strictly are not permitted, and you may be denied entry."
    },
    {
        question: "Do I need to print my tickets?",
        answer: "No, digital tickets on your smartphone are perfectly acceptable. Just show the QR code at the entrance."
    },
    {
        question: "Is there a security check?",
        answer: "Yes, all visitors must go through airport-style security. Prohibited items include large backpacks, glass bottles, and sharp objects."
    },
    {
        question: "Are the tours wheelchair accessible?",
        answer: "Most Vatican Museums tours are wheelchair accessible, but some specific areas (like the St. Peter's Dome climb) are not. Please check the specific tour details or contact us for assistance."
    },
    {
        question: "What happens if I'm late?",
        answer: "Vatican entry times are strict. If you miss your time slot, you may not be able to enter. We recommend arriving 15 minutes before your scheduled time."
    },
    {
        question: "Can I cancel or modify my booking?",
        answer: "Yes, most tours can be cancelled or modified up to 24-48 hours before the scheduled time for a full refund. Check the specific tour's cancellation policy for details."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay for online bookings."
    },
    {
        question: "Do you offer private tours?",
        answer: "Yes! We offer private personalized tours for individuals, couples, and groups. Private tours include a dedicated guide, flexible timing, and customized itineraries."
    },
    // Reduced list slightly for balanced layout or keep all if needed
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-cream relative overflow-hidden border-t border-forest/5">

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-forest/40 mb-4 block">
                        Editorial Support
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8 italic">
                        The Rome Compendium
                    </h2>
                    <p className="font-sans text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-forest/60 max-w-xl mx-auto leading-loose opacity-60">
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
                                        ? "bg-white border-forest shadow-2xl"
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
                                            "font-serif text-lg md:text-2xl font-bold italic transition-colors pr-8 leading-tight",
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
                                                <p className="font-sans text-xs md:text-sm font-black uppercase tracking-widest text-forest/60 mb-4 opacity-30">Our Guidance:</p>
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
