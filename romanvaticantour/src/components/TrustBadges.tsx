'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, Clock, Headset, ArrowRight } from 'lucide-react';

const badges = [
    {
        Icon: ShieldCheck,
        label: 'Free Cancellation',
        sub: 'Up to 24h before your tour',
        gradient: 'from-emerald-500/10 to-emerald-500/5',
        ring: 'ring-emerald-500/20',
        iconBg: 'bg-secondary',
        iconColor: 'text-primary',
    },
    {
        Icon: Award,
        label: 'TripAdvisor Excellence',
        sub: '5★ Rated · 50,000+ Reviews',
        gradient: 'from-sky-500/10 to-sky-500/5',
        ring: 'ring-sky-500/20',
        iconBg: 'bg-sky-50',
        iconColor: 'text-sky-500',
    },
    {
        Icon: Clock,
        label: 'Instant Confirmation',
        sub: 'Tickets delivered in seconds',
        gradient: 'from-violet-500/10 to-violet-500/5',
        ring: 'ring-violet-500/20',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-500',
    },
    {
        Icon: Headset,
        label: '24/7 Concierge',
        sub: 'Always here when you need us',
        gradient: 'from-amber-500/10 to-amber-500/5',
        ring: 'ring-amber-500/20',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
    },
];

export default function TrustBadges() {
    return (
        <div className="w-full py-10 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {badges.map(({ Icon, label, sub, gradient, ring, iconBg, iconColor }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className={`group relative flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br ${gradient} ring-1 ${ring} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/5 cursor-default`}
                        >
                            {/* Subtle animated glow on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-card/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className={`relative shrink-0 w-11 h-11 rounded-xl ${iconBg} ring-1 ${ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.5} />
                            </div>

                            <div className="relative min-w-0">
                                <p className="text-sm font-bold text-neutral-800 leading-snug">{label}</p>
                                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
