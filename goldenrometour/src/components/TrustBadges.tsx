'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, ThumbsUp } from 'lucide-react';

const features = [
    {
        Icon: Award,
        title: 'ROME TOUR\nEXPERTS',
        description: 'Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified.',
        accent: '#555B02',
    },
    {
        Icon: Shield,
        title: 'WORRY-FREE\nBOOKING',
        description: 'Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher.',
        accent: '#555B02',
    },
    {
        Icon: Clock,
        title: '24 HOUR\nSUPPORT',
        description: 'Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday.',
        accent: '#555B02',
    },
    {
        Icon: ThumbsUp,
        title: 'EXCELLENT\nCUSTOMER SERVICE',
        description: 'Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable.',
        accent: '#555B02',
    },
];

export default function TrustBadges() {
    return (
        <section className="w-full py-16 bg-[#F5F0E8] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {features.map(({ Icon, title, description, accent }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            className="group relative flex flex-col items-center text-center p-8 rounded-[2.5rem] transition-all duration-500 hover:bg-white/40 border border-transparent hover:border-white/60 hover:shadow-2xl hover:shadow-[#555B02]/5"
                        >
                            {/* Glass Icon Card with Layered Effect */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-[#555B02]/10 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
                                <div
                                    className="relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden shadow-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)',
                                        boxShadow: '0 8px 32px rgba(85, 91, 2, 0.05)',
                                    }}
                                >
                                    <Icon className="w-10 h-10 relative z-10 transition-colors duration-500" style={{ color: accent }} strokeWidth={1.25} />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            <h3
                                className="font-serif font-bold text-sm tracking-widest mb-4 uppercase leading-relaxed whitespace-pre-line text-[#555B02]"
                            >
                                {title}
                            </h3>

                            <p className="font-sans text-xs leading-relaxed text-[#1A1210]/60 max-w-[220px]">
                                {description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Platform trust strip - Refined */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center mt-20 pt-12 border-t border-[#555B02]/10"
                >
                    <p className="font-sans font-black text-[9px] uppercase tracking-[0.4em] text-[#555B02]/30 mb-8">Trusted by Global Travelers</p>
                    <div className="flex items-center justify-center gap-12 lg:gap-20 flex-wrap opacity-40 hover:opacity-100 transition-opacity duration-700">
                        {[['TripAdvisor', '★★★★★'], ['Google', '★★★★★'], ['Viator', 'Elite'], ['GetYourGuide', 'Certified']].map(([name, stars]) => (
                            <div key={name} className="flex flex-col items-center gap-1 group cursor-default">
                                <span className="font-serif text-xl font-bold italic text-[#555B02]">{name}</span>
                                {stars && <span className="text-[10px] font-black tracking-widest text-[#555B02]/60 uppercase">{stars}</span>}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
