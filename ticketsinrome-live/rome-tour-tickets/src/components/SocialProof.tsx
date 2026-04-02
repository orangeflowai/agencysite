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
            <Quote className="absolute top-4 right-4 text-emerald-500/20" size={36} />
            <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-emerald-50 text-sm font-medium leading-relaxed whitespace-normal mb-4 min-h-[48px]">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{review.name}</p>
                    <p className="text-xs text-emerald-200">{review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="container mx-auto px-4 relative z-10 mb-16">
                <div className="flex-1 space-y-6 text-center md:text-left max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
                        Trusted by over <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">50,000+</span> Travelers
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <span className="text-lg font-medium text-emerald-100"><strong className="text-white">4.9/5</strong> Average Rating</span>
                    </div>
                    {/* Platform trust badges */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#34E0A1]" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.5c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                            <span className="text-xs font-bold text-white">TripAdvisor</span>
                            <span className="text-[10px] text-emerald-300 font-bold">&#9733; 4.9</span>
                        </a>
                        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span className="text-xs font-bold text-white">Google</span>
                            <span className="text-[10px] text-emerald-300 font-bold">&#9733; 4.8</span>
                        </a>
                        <a href="https://www.viator.com" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF6B35]" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            <span className="text-xs font-bold text-white">Viator</span>
                            <span className="text-[10px] text-emerald-300 font-bold">&#9733; 4.9</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* CSS marquee — 2 copies only, GPU-accelerated, no JS pixel math */}
            <div className="relative w-full overflow-hidden" style={{ contentVisibility: 'auto' }}>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-emerald-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-900 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 w-max animate-marquee">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
