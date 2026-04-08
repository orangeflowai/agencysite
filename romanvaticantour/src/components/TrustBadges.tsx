'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, Clock, Headset } from 'lucide-react';

const badges = [
    { Icon: ShieldCheck, label: 'Free Cancellation', sub: 'Up to 24h before' },
    { Icon: Award,       label: 'TripAdvisor Excellence', sub: '5★ Rated' },
    { Icon: Clock,       label: 'Instant Confirmation', sub: 'Tickets in seconds' },
    { Icon: Headset,     label: '24/7 Concierge', sub: 'Always available' },
];

export default function TrustBadges() {
    return (
        <div className="w-full bg-white/60 backdrop-blur-sm border-y border-neutral-100/80 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
                    {badges.map(({ Icon, label, sub }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300">
                                <Icon className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-800">{label}</p>
                                <p className="text-[10px] text-neutral-400">{sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
