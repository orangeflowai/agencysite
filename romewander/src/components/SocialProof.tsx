'use client';

import { Star, Quote } from 'lucide-react';

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
        <div className="w-[340px] bg-theme-dark/10 backdrop-blur-md border border-theme-primary/20 p-6 shadow-xl relative">
            <Quote className="absolute top-4 right-4 text-theme-primary/20" size={36} />
            <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} className="fill-theme-primary text-theme-primary" />)}
            </div>
            <p className="text-theme-dark text-sm font-serif italic leading-relaxed whitespace-normal mb-4 min-h-[48px]">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-theme-primary flex items-center justify-center text-sm font-serif font-bold text-theme-dark">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-theme-dark font-sans tracking-wide">{review.name}</p>
                    <p className="text-xs text-theme-dark/60 font-nav uppercase tracking-widest">{review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-24 bg-theme-light text-theme-dark relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-theme-dark) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="container mx-auto px-4 relative z-10 mb-16">
                <div className="flex-1 space-y-6 text-center md:text-left max-w-2xl">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold leading-none tracking-tight">
                        Trusted by over <br />
                        <span className="text-theme-primary italic">1M+</span> Pilgrims
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-theme-primary text-theme-primary" />)}
                        </div>
                        <span className="text-lg font-sans text-theme-dark/80"><strong className="text-theme-dark font-bold">4.9/5</strong> Average Rating</span>
                    </div>
                </div>
            </div>

            {/* CSS marquee — 2 copies only, GPU-accelerated, no JS pixel math */}
            <div className="relative w-full overflow-hidden flex pb-8" style={{ contentVisibility: 'auto' }}>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-theme-light to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-theme-light to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 w-max animate-marquee shadow-2xl skew-x-[-2deg]">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
