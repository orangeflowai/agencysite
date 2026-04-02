'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';

interface HeroProps {
    settings?: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroVideo?: { asset: { url: string } };
        heroImage?: { asset: { url: string } };
    } | null;
}

export default function Hero({ settings }: HeroProps) {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState('');

    // Use Sanity video if available, fallback to Pexels embed
    const videoUrl = settings?.heroVideo?.asset?.url || null;
    const fallbackImage = settings?.heroImage?.asset?.url || `${SUPABASE_BUCKET_URL}/vatican-hero-poster.jpg`;

    // Pexels Vatican / Rome video (public CDN)
    const pexelsVideoUrl = 'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4';

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>

            {/* ── FULL-SCREEN VIDEO BACKGROUND ── */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={fallbackImage}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={videoUrl || pexelsVideoUrl}
                />
                {/* Multi-layer dark overlay for text contrast */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.4) 50%, rgba(26,18,16,0.75) 100%)' }} />
                {/* Subtle vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,18,16,0.5) 100%)' }} />
            </div>

            {/* Faint papal cross watermark */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] select-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='90' y='20' width='20' height='160' fill='%23C9A84C'/%3E%3Crect x='30' y='70' width='140' height='20' fill='%23C9A84C'/%3E%3C/svg%3E")`,
                    backgroundSize: '400px 400px',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* ── HERO CONTENT ── */}
            <div
                className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-16"
                style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '140px' }}
            >
                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-nav text-[11px] tracking-[0.4em] uppercase font-bold mb-8"
                    style={{ color: '#C9A84C' }}
                >
                    ✦ Welcome to RomeWander ✦
                </motion.p>

                {/* H1 */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className="leading-[1.0] mb-6 max-w-5xl"
                >
                    <span
                        className="block font-serif font-black text-white"
                        style={{ fontSize: 'clamp(48px, 7vw, 100px)' }}
                    >
                        Discover the
                    </span>
                    <span
                        className="block font-accent italic"
                        style={{ fontSize: 'clamp(56px, 8.5vw, 116px)', color: '#C9A84C', lineHeight: 1 }}
                    >
                        Eternal City
                    </span>
                    <span
                        className="block font-serif font-black text-white"
                        style={{ fontSize: 'clamp(48px, 7vw, 100px)' }}
                    >
                        with Purpose
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-sans text-white/75 max-w-xl mb-10 leading-relaxed"
                    style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
                >
                    Private Vatican access · Sistine Chapel after-hours · Swiss Guard escorted walks. Curated for the discerning pilgrim.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 mb-16"
                >
                    <Link
                        href="/category/vatican"
                        className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 transition-all hover:scale-105 hover:shadow-2xl"
                        style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                    >
                        Explore Vatican Tours
                    </Link>
                    <Link
                        href="/private-tours"
                        className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 border-2 transition-all hover:scale-105 backdrop-blur-sm"
                        style={{ borderColor: 'rgba(201,168,76,0.7)', color: '#F5F0E8', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                        Private Experiences
                    </Link>
                </motion.div>

                {/* Floating stats pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="flex flex-wrap gap-4 justify-center mb-4"
                >
                    {[
                        { value: '15,000+', label: 'Pilgrims Served' },
                        { value: '4.9 ★', label: 'Average Rating' },
                        { value: '48', label: 'Exclusive Routes' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3 px-5 py-3 backdrop-blur-md"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(201,168,76,0.3)',
                                borderRadius: '2px',
                            }}
                        >
                            <span className="font-serif font-bold text-lg" style={{ color: '#C9A84C' }}>{stat.value}</span>
                            <span className="font-nav text-[9px] uppercase tracking-widest text-white/60">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── OVERLAPPING SEARCH BAR ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-16 xl:px-24"
                style={{ transform: 'translateY(50%)' }}
            >
                <div
                    className="w-full max-w-5xl mx-auto bg-white shadow-2xl"
                    style={{ borderRadius: '2px', border: '1px solid rgba(201,168,76,0.25)' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Destination */}
                        <div className="flex flex-col px-6 py-5">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: '#C9A84C' }}>
                                📍 Destination
                            </label>
                            <input
                                type="text"
                                placeholder="Vatican, Sistine Chapel..."
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                className="font-sans text-sm outline-none bg-transparent placeholder-gray-400"
                                style={{ color: '#1A1210' }}
                            />
                        </div>
                        {/* Date */}
                        <div className="flex flex-col px-6 py-5">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: '#C9A84C' }}>
                                🗓 Travel Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent text-gray-500"
                            />
                        </div>
                        {/* Pilgrims */}
                        <div className="flex flex-col px-6 py-5">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: '#C9A84C' }}>
                                👥 Pilgrims
                            </label>
                            <select
                                value={guests}
                                onChange={e => setGuests(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent text-gray-500"
                            >
                                <option value="">Select group size</option>
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <option key={n} value={n}>{n} {n === 1 ? 'Pilgrim' : 'Pilgrims'}</option>
                                ))}
                                <option value="11+">11+ (Group)</option>
                            </select>
                        </div>
                        {/* Search CTA */}
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-3 font-nav font-bold uppercase tracking-widest text-sm px-8 py-5 transition-all hover:brightness-110 active:scale-95"
                            style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '0 0 2px 2px' }}
                        >
                            <span>🔍</span>
                            <span>Search Tours</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
