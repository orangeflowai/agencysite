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
                                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden shadow-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(201,168,76,0.12)',
                                        boxShadow: '0 12px 48px rgba(26,18,16,0.04)',
                                    }}
                                >
                                    <Icon className="w-11 h-11 relative z-10 transition-transform duration-500" style={{ color: '#C9A84C' }} strokeWidth={1} />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            <h3
                                className="font-inter font-bold text-xs tracking-[0.4em] mb-4 uppercase leading-relaxed whitespace-pre-line text-[#1A1210]"
                            >
                                {title}
                            </h3>

                            <p className="font-inter text-xs leading-relaxed text-[#6B5C45] max-w-[210px] opacity-70">
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
                    className="flex flex-col items-center mt-32 pt-16 border-t border-[#1A1210]/5"
                >
                    <p className="font-inter font-bold text-[8px] uppercase tracking-[0.6em] text-[#C9A84C]/50 mb-12">THE GOLD STANDARD OF ROMAN TRAVEL</p>
                    <div className="flex items-center justify-center gap-16 lg:gap-28 flex-wrap opacity-50 hover:opacity-100 transition-opacity duration-1000">
                        {[['TripAdvisor', '★★★★★'], ['Google', '★★★★★'], ['Viator', 'Elite'], ['GetYourGuide', 'Certified']].map(([name, stars]) => (
                            <div key={name} className="flex items-center gap-4 group cursor-default">
                                <span className="font-inter text-2xl font-bold tracking-tighter text-[#1A1210] group-hover:text-[#C9A84C] transition-colors">{name}</span>
                                {stars && <span className="font-inter text-[9px] font-black tracking-widest text-[#C9A84C] opacity-70 uppercase">{stars}</span>}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
