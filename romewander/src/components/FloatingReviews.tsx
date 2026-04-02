'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { name: 'James H.', location: 'USA', avatar: 'J', text: 'We did the Sistine Chapel after-hours tour and it was absolutely transcendent. Standing alone in that space, surrounded by Michelangelo\'s masterwork, is something I\'ll never forget.', rating: 5 },
    { name: 'Maria G.', location: 'United Kingdom', avatar: 'M', text: 'Francesca made the Vatican Museums come alive. The skip-the-line access was a lifesaver — we saw three times more than friends who went independently!', rating: 5 },
    { name: 'Robert D.', location: 'Australia', avatar: 'R', text: 'The Papal Audience package exceeded every expectation. Our guide knew exactly where to stand, when to move, and turned what could be overwhelming into pure magic.', rating: 5 },
    { name: 'Sophie B.', location: 'France', avatar: 'S', text: 'As a Catholic, visiting the Vatican had been a lifelong dream. RomeWander turned it into reality. The Swiss Guard escorted walk was extraordinary.', rating: 5 },
    { name: 'Alessandro R.', location: 'Italy', avatar: 'A', text: 'Even as a Roman, I learned things I never knew. The private Vatican Gardens walk at sunset is a completely different world from the usual tourist trail.', rating: 5 },
    { name: 'Chen W.', location: 'Singapore', avatar: 'C', text: 'Totally worth it for the early morning access to the Sistine Chapel alone. Absolute silence, golden light — magical. The guide\'s knowledge of the artwork was breathtaking.', rating: 5 },
    { name: 'Elena M.', location: 'Spain', avatar: 'E', text: 'I brought my elderly parents — RomeWander arranged everything perfectly. Private transport, priority entry, personal guide. It was seamless and incredibly moving for our family.', rating: 5 },
    { name: 'Thomas K.', location: 'Germany', avatar: 'T', text: 'The Colosseum and Forum private tour was phenomenal. No crowds, expert historian as guide. Walking where gladiators walked with real context changed everything.', rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div
            className="w-[340px] shrink-0 relative p-7 shadow-xl"
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '2px',
            }}
        >
            <Quote
                className="absolute top-5 right-5"
                size={32}
                style={{ color: 'rgba(201,168,76,0.15)' }}
            />

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} style={{ fill: '#C9A84C', color: '#C9A84C' }} />
                ))}
            </div>

            {/* Review text */}
            <p
                className="font-serif italic text-base leading-relaxed mb-5 min-h-[80px] line-clamp-4"
                style={{ color: '#1A1210' }}
            >
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
                <div
                    className="w-10 h-10 flex items-center justify-center text-sm font-serif font-bold shrink-0"
                    style={{
                        backgroundColor: '#3D1A6E',
                        color: '#C9A84C',
                        borderRadius: '2px',
                    }}
                >
                    {review.avatar}
                </div>
                <div>
                    <p className="font-nav font-bold text-xs uppercase tracking-widest" style={{ color: '#1A1210' }}>
                        {review.name}
                    </p>
                    <p className="font-nav text-[10px] uppercase tracking-wider" style={{ color: '#3D1A6E', opacity: 0.6 }}>
                        {review.location}
                    </p>
                </div>
                <div
                    className="ml-auto font-nav text-[9px] uppercase tracking-widest px-2 py-1"
                    style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: '#C9A84C', borderRadius: '999px' }}
                >
                    Verified
                </div>
            </div>
        </div>
    );
}

export default function FloatingReviews() {
    const doubled = [...reviews, ...reviews];

    return (
        <div className="relative w-full overflow-hidden">
            {/* Left + right fade */}
            <div
                className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to right, #F5F0E8, transparent)' }}
            />
            <div
                className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to left, #F5F0E8, transparent)' }}
            />

            {/* Scrolling row — two copies for seamless loop */}
            <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
                {doubled.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                ))}
            </div>
        </div>
    );
}
