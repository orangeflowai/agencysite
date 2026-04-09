'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, ThumbsUp } from 'lucide-react';

const features = [
    {
        Icon: Award,
        title: 'ROME TOUR\nEXPERTS',
        description: 'Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified.',
        accent: '#C9A84C',
    },
    {
        Icon: Shield,
        title: 'WORRY-FREE\nBOOKING',
        description: 'Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher.',
        accent: '#1A3626',
    },
    {
        Icon: Clock,
        title: '24 HOUR\nSUPPORT',
        description: 'Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday.',
        accent: '#7B2D2D',
    },
    {
        Icon: ThumbsUp,
        title: 'EXCELLENT\nCUSTOMER SERVICE',
        description: 'Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable.',
        accent: '#C9A84C',
    },
];

export default function TrustBadges() {
    return (
        <div className="w-full py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {features.map(({ Icon, title, description, accent }, index) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: index * 0.12 }}
                        className="group relative flex flex-col items-center text-center"
                    >
                        {/* Glass Icon Card */}
                        <div
                            className="relative w-24 h-24 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 overflow-hidden"
                            style={{
                                background: 'rgba(245, 240, 232, 0.8)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: `1px solid rgba(201,168,76,0.2)`,
                                boxShadow: `0 8px 32px rgba(26,18,16,0.06), 0 0 0 1px rgba(255,255,255,0.6) inset`,
                            }}
                        >
                            {/* Subtle gradient overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}05)` }}
                            />
                            <Icon className="w-9 h-9 relative z-10 transition-transform duration-500 group-hover:scale-110" style={{ color: accent }} strokeWidth={1.5} />
                        </div>

                        <h3
                            className="font-bold text-[11px] tracking-widest mb-3 uppercase leading-snug whitespace-pre-line"
                            style={{ color: '#1A1210', fontFamily: 'var(--font-sans, sans-serif)' }}
                        >
                            {title}
                        </h3>

                        <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: '#6B5C45' }}>
                            {description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Platform trust strip */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-10 mt-14 pt-10 flex-wrap hover:opacity-100 transition-opacity duration-500"
                style={{ borderTop: '1px solid rgba(26,18,16,0.08)', opacity: 0.55 }}
            >
                {[['TripAdvisor', '★★★★★'], ['Google', '★★★★★'], ['Viator Elite', ''], ['GetYourGuide', '']].map(([name, stars]) => (
                    <div key={name} className="flex items-center gap-2 group cursor-default">
                        <span
                            className="font-serif text-base font-bold italic transition-colors group-hover:opacity-80"
                            style={{ color: '#1A1210' }}
                        >
                            {name}
                        </span>
                        {stars && <span className="text-xs" style={{ color: '#C9A84C' }}>{stars}</span>}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
