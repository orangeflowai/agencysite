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
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Contextual Pattern Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-50 rounded-full opacity-50 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-sky-600 font-bold uppercase tracking-wider text-sm mb-2 block">
                        Support & Help
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Common Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                                        ? "bg-white border-sky-200 shadow-xl shadow-sky-900/5"
                                        : "bg-white border-gray-100 hover:border-sky-200 hover:shadow-lg"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none bg-transparent"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={clsx(
                                            "mt-1 p-2 rounded-lg flex-shrink-0 transition-colors hidden md:block",
                                            isOpen ? "bg-sky-100 text-sky-700" : "bg-gray-50 text-gray-400"
                                        )}>
                                            <HelpCircle size={20} />
                                        </div>
                                        <span className={clsx(
                                            "text-lg md:text-xl font-bold transition-colors pr-8",
                                            isOpen ? "text-sky-900" : "text-gray-900"
                                        )}>
                                            {faq.question}
                                        </span>
                                    </div>

                                    <div className={clsx(
                                        "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                                        isOpen ? "bg-sky-600 text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-sky-50 group-hover:text-sky-600"
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
                                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
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
