'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { Search, Star, CheckCircle2, ArrowRight, Mic2 } from 'lucide-react';

interface HeroProps {
    settings?: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroVideo?: { asset: { url: string } };
        heroImage?: { asset: { url: string } };
    } | null;
}

// Known-good Vatican image from Unsplash (no auth needed)
const FALLBACK_HERO = 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1600&q=85&auto=format&fit=crop';

export default function Hero({ settings }: HeroProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');

    const heroImageUrl = settings?.heroImage?.asset?.url || FALLBACK_HERO;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        router.push(`/search?${params.toString()}`);
    };

    const stats = [
        { value: '50K+', label: 'Happy Travelers' },
        { value: '4.9★', label: 'Average Rating' },
        { value: '48', label: 'Exclusive Routes' },
    ];

    return (
        <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-neutral-950">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImageUrl}
                    alt="Vatican Museums"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-32 md:py-40">
                <div className="max-w-3xl space-y-8">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        New VIP Access Routes Available
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05]">
                            {settings?.heroTitle || (
                                <>The Vatican.<br />
                                    <span className="text-sky-400">Skip the line,</span><br />
                                    own the moment.
                                </>
                            )}
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-lg md:text-xl text-white/75 max-w-xl leading-relaxed"
                    >
                        {settings?.heroSubtitle || 'Join 50,000+ travelers who unlocked Rome through exclusive access, expert storytelling, and zero waiting.'}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/search"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-neutral-950 rounded-xl transition-all hover:scale-105 hover:shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}
                        >
                            Browse All Tours
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#vatican"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-xl transition-all border border-white/25 hover:bg-white/10"
                            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)' }}
                        >
                            View Bestsellers
                        </Link>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="flex items-center gap-4 pt-4 border-t border-white/10"
                    >
                        {/* Avatars */}
                        <div className="flex -space-x-2">
                            {[12, 13, 14, 15].map(idx => (
                                <div key={idx} className="w-9 h-9 rounded-full border-2 border-white/30 bg-neutral-700 overflow-hidden shadow-lg">
                                    <img src={`https://i.pravatar.cc/100?img=${idx}`} alt="traveler" loading="lazy" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                            </div>
                            <span className="text-xs text-white/60 font-medium">4.9/5 from 3,200+ reviews</span>
                        </div>
                    </motion.div>
                </div>

                {/* Glassmorphism Search Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-16 max-w-2xl"
                >
                    <div
                        className="p-5 rounded-2xl border border-white/20 shadow-2xl"
                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span className="text-white font-semibold text-sm">Find Your Tour</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-[2] bg-white rounded-xl border border-white/30 flex items-center px-4 py-3 gap-2 shadow-sm">
                                <Search size={15} className="text-neutral-400 shrink-0" />
                                <input
                                    type="text"
                                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-800 placeholder:text-neutral-400"
                                    placeholder="Vatican, Sistine Chapel, Colosseum..."
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-white/30 flex items-center px-4 py-3 shadow-sm">
                                <input
                                    type="date"
                                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-600"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="shrink-0 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="mt-10 flex flex-wrap gap-4"
                >
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/15"
                            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
                        >
                            <span className="font-bold text-lg text-white">{s.value}</span>
                            <span className="text-xs uppercase tracking-widest text-white/50">{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
