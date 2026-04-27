'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { name: "James H.",       location: "USA",       text: "We did the Rome in a Day tour with Sev and it was phenomenal. He was an encyclopedia of knowledge!", rating: 5 },
    { name: "Maria G.",       location: "UK",        text: "Francesca made the Vatican Museums come alive. Skip-the-line access was a lifesaver.", rating: 5 },
    { name: "Robert D.",      location: "Australia", text: "The Colosseum underground was the highlight. Walking on the arena floor felt surreal.", rating: 5 },
    { name: "Sophie Bennett", location: "France",    text: "Efficient, fun, and so informative. We saw everything we wanted without the stress.", rating: 5 },
    { name: "Alessandro R.",  location: "Italy",     text: "Even as a local, I learned so much from Roberta. The hidden gems tour is a must.", rating: 5 },
    { name: "Chen Wei",       location: "Singapore", text: "Totally worth it for the early morning access to the Sistine Chapel. Magical experience.", rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div className="w-[340px] bg-cream border border-forest p-10 flex-shrink-0 relative">
            <Quote className="absolute top-6 right-6 text-forest/10" size={48} />
            <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-forest text-forest" />)}
            </div>
            <p className="font-serif text-lg text-forest  leading-[1.6] mb-8 min-h-[60px]">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-forest/10">
                <div className="w-10 h-10 border border-forest flex items-center justify-center text-xs font-serif font-bold text-forest bg-forest/5">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="font-sans text-xs font-bold text-forest  tracking-widest">{review.name}</p>
                    <p className="font-sans text-[10px] text-forest/50  tracking-[0.2em]">{review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-32 bg-cream text-forest border-t border-forest relative overflow-hidden">
            {/* Editorial Header */}
            <div className="container mx-auto px-8 md:px-16 relative z-10 mb-20 text-center md:text-left">
                <div className="max-w-3xl">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-sans text-[10px]  font-bold tracking-[0.5em] text-forest/40"
                    >
                        Client Testimonials
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl font-bold mt-6 leading-none"
                    >
                        Verified Path <br />
                        <span className="">Documentation.</span>
                    </motion.h2>
                    <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-forest text-forest" />)}
                        </div>
                        <span className="font-sans text-sm  font-bold tracking-widest opacity-60">Avg Rating 4.9/5</span>
                    </div>
                </div>
            </div>

            {/* Editorial Marquee */}
            <div className="relative w-full overflow-hidden border-y border-forest/20 py-12 bg-forest/[0.02]">
                <div className="flex gap-10 w-max animate-marquee">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>

            {/* Corporate/Partner Strip */}
            <div className="container mx-auto px-8 mt-20 flex flex-wrap justify-center gap-12 opacity-40">
                <span className="font-serif text-2xl font-bold  tracking-tighter">TripAdvisor Private</span>
                <span className="font-serif text-2xl font-bold  tracking-tighter">Google Elite</span>
                <span className="font-serif text-2xl font-bold  tracking-tighter">The Roman Guild</span>
            </div>
        </section>
    );
}
