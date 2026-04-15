'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, ThumbsUp } from 'lucide-react';

const features = [
    {
        Icon: Award,
        title: 'ROME TOUR\nEXPERTS',
        description: 'Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified.',
    },
    {
        Icon: Shield,
        title: 'WORRY-FREE\nBOOKING',
        description: 'Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher.',
    },
    {
        Icon: Clock,
        title: '24 HOUR\nSUPPORT',
        description: 'Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday.',
    },
    {
        Icon: ThumbsUp,
        title: 'EXCELLENT\nCUSTOMER SERVICE',
        description: 'Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable.',
    },
];

export default function TrustBadges() {
    return (
        <section className="w-full py-20 bg-[#F5F0E8] relative overflow-hidden">
            {/* Subtle background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A84C]/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A84C]/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
                    {features.map(({ Icon, title, description }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Premium Glass Icon Container */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-[#C9A84C]/20 blur-xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                                <div
                                    className="relative w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden shadow-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.4)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(201,168,76,0.15)',
                                        boxShadow: '0 8px 32px rgba(26,18,16,0.03)',
                                    }}
                                >
                                    <Icon className="w-10 h-10 relative z-10 transition-transform duration-500" style={{ color: '#C9A84C' }} strokeWidth={1.25} />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            <h3
                                className="font-nav font-black text-xs tracking-[0.3em] mb-4 uppercase leading-relaxed whitespace-pre-line text-[#1A1210]"
                            >
                                {title}
                            </h3>

                            <p className="font-sans text-xs leading-relaxed text-[#6B5C45] max-w-[200px] opacity-80">
                                {description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Platform trust strip - Refined Editorial Look */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center mt-24 pt-12 border-t border-[#1A1210]/5"
                >
                    <p className="font-nav font-bold text-[9px] uppercase tracking-[0.5em] text-[#C9A84C]/40 mb-10">THE GOLD STANDARD OF ROMAN TRAVEL</p>
                    <div className="flex items-center justify-center gap-12 lg:gap-24 flex-wrap opacity-40 hover:opacity-100 transition-opacity duration-700">
                        {[['TripAdvisor', '★★★★★'], ['Google', '★★★★★'], ['Viator', 'Elite'], ['GetYourGuide', 'Certified']].map(([name, stars]) => (
                            <div key={name} className="flex items-center gap-3 group cursor-default">
                                <span className="font-serif text-xl font-bold italic text-[#1A1210] group-hover:text-[#C9A84C] transition-colors">{name}</span>
                                {stars && <span className="font-nav text-[10px] font-black tracking-widest text-[#C9A84C] opacity-60 uppercase">{stars}</span>}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
