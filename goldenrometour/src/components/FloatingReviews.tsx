'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { name: 'James H.', location: 'USA', avatar: 'J', text: 'We did the Sistine Chapel after-hours tour and it was absolutely transcendent. Standing alone in that space was something I\'ll never forget.', rating: 5 },
    { name: 'Maria G.', location: 'UK', avatar: 'M', text: 'Francesca made the Vatican Museums come alive. The skip-the-line access was a lifesaver — we saw three times more than friends!', rating: 5 },
    { name: 'Robert D.', location: 'Australia', avatar: 'R', text: 'The Colosseum and Forum tour exceeded every expectation. Our guide knew exactly where to stand and turned chaos into pure magic.', rating: 5 },
    { name: 'Sophie B.', location: 'France', avatar: 'S', text: 'As a Catholic, visiting the Vatican had been a lifelong dream. RomeWander turned it into reality. The personal guide was extraordinary.', rating: 5 },
    { name: 'Alessandro R.', location: 'Italy', avatar: 'A', text: 'Even as a Roman, I learned things I never knew. The private Vatican Gardens walk at sunset is a completely different world.', rating: 5 },
    { name: 'Chen W.', location: 'Singapore', avatar: 'C', text: 'Totally worth it for the early morning access to the Sistine Chapel alone. Absolute silence, golden light — magical.', rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div
            className="w-[340px] shrink-0 relative p-7 shadow-xl"
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(26,18,16,0.1)',
                borderRadius: '2px',
            }}
        >
            <Quote
                className="absolute top-5 right-5"
                size={32}
                style={{ color: 'rgba(26,18,16,0.08)' }}
            />

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} style={{ fill: '#1A1210', color: '#1A1210' }} />
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
            <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(26,18,16,0.1)' }}>
                <div
                    className="w-10 h-10 flex items-center justify-center text-sm font-serif font-bold shrink-0"
                    style={{
                        backgroundColor: '#1A1210',
                        color: '#F5F0E8',
                        borderRadius: '2px',
                    }}
                >
                    {review.avatar}
                </div>
                <div>
                    <p className="font-nav font-bold text-xs uppercase tracking-widest" style={{ color: '#1A1210' }}>
                        {review.name}
                    </p>
                    <p className="font-nav text-[10px] uppercase tracking-wider" style={{ color: '#1A1210', opacity: 0.5 }}>
                        {review.location}
                    </p>
                </div>
                <div
                    className="ml-auto font-nav text-[9px] uppercase tracking-widest px-2 py-1"
                    style={{ backgroundColor: 'rgba(26,18,16,0.05)', color: '#1A1210', borderRadius: '999px' }}
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
        <div className="relative w-full overflow-hidden py-10">
            {/* Left + right fade */}
            <div
                className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to right, #F5F0E8, transparent)' }}
            />
            <div
                className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to left, #F5F0E8, transparent)' }}
            />

            {/* Scrolling row */}
            <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
                {doubled.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                ))}
            </div>
        </div>
    );
}
