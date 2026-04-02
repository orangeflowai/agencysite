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
        <div className="w-[340px] bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex-shrink-0 relative">
            <Quote className="absolute top-4 right-4 text-sky-500/20" size={36} />
            <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sky-50 text-sm font-medium leading-relaxed whitespace-normal mb-4 min-h-[48px]">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{review.name}</p>
                    <p className="text-xs text-sky-200">{review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-24 bg-sky-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="container mx-auto px-4 relative z-10 mb-16">
                <div className="flex-1 space-y-6 text-center md:text-left max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
                        Trusted by over <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">50,000+</span> Travelers
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <span className="text-lg font-medium text-sky-100"><strong className="text-white">4.9/5</strong> Average Rating</span>
                    </div>
                    {/* Review platform badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                            <span className="text-green-400 font-black text-lg leading-none">●</span>
                            <div>
                                <p className="text-white text-xs font-black">TripAdvisor</p>
                                <p className="text-yellow-400 text-[10px]">★★★★★ Excellent</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                            <span className="text-white font-black text-lg leading-none">G</span>
                            <div>
                                <p className="text-white text-xs font-black">Google</p>
                                <p className="text-yellow-400 text-[10px]">★★★★★ 4.9/5</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                            <span className="text-orange-400 font-black text-lg leading-none">V</span>
                            <div>
                                <p className="text-white text-xs font-black">Viator</p>
                                <p className="text-yellow-400 text-[10px]">★★★★★ Top Rated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS marquee — 2 copies only, GPU-accelerated, no JS pixel math */}
            <div className="relative w-full overflow-hidden" style={{ contentVisibility: 'auto' }}>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-sky-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-sky-900 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 w-max animate-marquee">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
