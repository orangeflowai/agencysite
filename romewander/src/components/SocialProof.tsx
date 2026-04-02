'use client';

import { Star } from 'lucide-react';

const reviews = [
    { name: 'James H.', location: 'USA', text: 'Standing alone in the Sistine Chapel after closing time — an experience that moved me to tears. RomeWander made the impossible possible.', rating: 5 },
    { name: 'Maria G.', location: 'UK', text: 'Francesca made the Vatican Museums come alive. Skip-the-line access was a lifesaver — we saw three times more than friends who went independently!', rating: 5 },
    { name: 'Robert D.', location: 'Australia', text: 'The Colosseum underground was the highlight of our entire Italy trip. Walking the arena floor where gladiators fought felt surreal.', rating: 5 },
    { name: 'Sophie B.', location: 'France', text: 'As a Catholic, visiting the Vatican had been a lifelong dream. RomeWander turned it into everything I\'d hoped for and more.', rating: 5 },
    { name: 'Alessandro R.', location: 'Italy', text: 'Even as a Roman, I learned things I never knew. The private Vatican Gardens walk at sunset is a completely different world.', rating: 5 },
    { name: 'Chen W.', location: 'Singapore', text: 'Totally worth it for the early morning access to the Sistine Chapel alone. Absolute silence, golden light — magical.', rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div
            className="w-[340px] shrink-0 relative p-6"
            style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '2px',
            }}
        >
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} style={{ fill: '#C9A84C', color: '#C9A84C' }} />
                ))}
            </div>

            {/* Review text */}
            <p
                className="font-serif italic text-sm leading-relaxed mb-4 line-clamp-3"
                style={{ color: 'rgba(245,240,232,0.85)' }}
            >
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 flex items-center justify-center text-sm font-serif font-bold shrink-0"
                    style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                >
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="font-nav font-bold text-[11px] uppercase tracking-widest" style={{ color: '#F5F0E8' }}>
                        {review.name}
                    </p>
                    <p className="font-nav text-[9px] uppercase tracking-wider" style={{ color: 'rgba(201,168,76,0.6)' }}>
                        {review.location}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    const doubled = [...reviews, ...reviews];

    return (
        <section className="py-20 overflow-hidden" style={{ backgroundColor: '#1A1210' }}>
            {/* Dot grid texture */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />

            {/* Header */}
            <div className="container mx-auto px-6 md:px-16 mb-12 text-center relative z-10">
                <p
                    className="font-nav text-[10px] tracking-[0.35em] uppercase font-bold mb-4"
                    style={{ color: '#C9A84C' }}
                >
                    ✦ TRUSTED WORLDWIDE ✦
                </p>
                <h2
                    className="font-serif font-bold text-white leading-none mb-3"
                    style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
                >
                    Trusted by over{' '}
                    <span className="font-accent italic" style={{ color: '#C9A84C', fontSize: '1.15em' }}>
                        1M+
                    </span>{' '}
                    Pilgrims
                </h2>
                <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} style={{ fill: '#C9A84C', color: '#C9A84C' }} />
                        ))}
                    </div>
                    <span className="font-sans" style={{ color: 'rgba(245,240,232,0.7)', fontSize: '15px' }}>
                        <strong style={{ color: '#F5F0E8' }}>4.9/5</strong> Average Rating
                    </span>
                </div>
            </div>

            {/* Marquee row */}
            <div className="relative w-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to right, #1A1210, transparent)' }}
                />
                <div
                    className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to left, #1A1210, transparent)' }}
                />

                <div className="flex gap-5 animate-marquee" style={{ width: 'max-content' }}>
                    {doubled.map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
