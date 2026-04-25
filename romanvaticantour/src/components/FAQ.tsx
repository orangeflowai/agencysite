'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react'; // Changed to Plus/Minus for cleaner look
import clsx from 'clsx';

const faqs = [
    {
        question: "What should I wear?",
        answer: "The Vatican asks visitors to dress modestly — please cover your knees and shoulders. Sleeveless tops and shorts aren't allowed, and you may be turned away at the door."
    },
    {
        question: "Can I just show my ticket on my phone?",
        answer: "Absolutely! Digital tickets work perfectly. Just pull up your QR code at the entrance — no printing needed."
    },
    {
        question: "What should I know about security?",
        answer: "Everyone goes through airport-style security. To speed things up, avoid bringing large backpacks, glass bottles, or anything sharp."
    },
    {
        question: "Will a wheelchair limit what I can see?",
        answer: "Most of the Museums are fully accessible, but some experiences — like climbing St. Peter's Dome — aren't wheelchair-friendly. Reach out if you'd like help picking the right tour."
    },
    {
        question: "Help — I'm running late!",
        answer: "Don't risk it! Vatican entry times are strict. We recommend arriving 15 minutes early. If you miss your slot, entry isn't guaranteed."
    },
    {
        question: "Can I change my mind?",
        answer: "Life happens. Most bookings can be cancelled or rescheduled 24–48 hours ahead for a full refund. Check your specific tour's policy for the exact window."
    },
    {
        question: "How can I pay?",
        answer: "All major cards (Visa, Mastercard, American Express), PayPal, and Apple Pay are welcome."
    },
    {
        question: "Can I book a tour just for my group?",
        answer: "You sure can. Our private tours come with your own guide, a schedule that works for you, and an itinerary built around your interests."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Contextual Pattern Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full opacity-50 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary font-sans font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
                        Support & Help
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] mb-6 tracking-tight">
                        Common Questions
                    </h2>
                    <p className="text-lg text-[#85766a] max-w-2xl mx-auto font-sans">
                        Everything you need to know about your Roman adventure, tickets, and entry guidelines.
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
                                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                                    isOpen
                                        ? "bg-card border-primary/20 shadow-xl shadow-primary/5"
                                        : "bg-card/50 border-[#b19681]/20 hover:border-primary/30 hover:shadow-lg"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none bg-transparent"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={clsx(
                                            "mt-1 p-2 rounded-lg flex-shrink-0 transition-colors hidden md:block",
                                            isOpen ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                        )}>
                                            <HelpCircle size={20} />
                                        </div>
                                        <span className={clsx(
                                            "text-lg md:text-xl font-serif font-bold transition-colors pr-8 italic",
                                            isOpen ? "text-primary" : "text-[#5c4b3e]"
                                        )}>
                                            {faq.question}
                                        </span>
                                    </div>

                                    <div className={clsx(
                                        "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                                        isOpen ? "bg-primary text-white rotate-180" : "bg-primary/5 text-primary"
                                    )}>
                                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
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
                                            <div className="px-6 md:px-8 pb-8 pt-0 pl-6 md:pl-[5.5rem]">
                                                <p className="text-[#85766a] leading-relaxed text-base md:text-lg font-sans">
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
