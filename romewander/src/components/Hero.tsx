'use client';

import { useState, useRef } from 'react';
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

    const rawImageUrl = settings?.heroImage?.asset?.url || `${SUPABASE_BUCKET_URL}/vatican-hero-poster.jpg`;
    const posterUrl = rawImageUrl.includes('supabase.co')
        ? `${rawImageUrl}?width=900&quality=80&format=webp`
        : rawImageUrl;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section
            className="relative w-full overflow-visible"
            style={{ minHeight: '100vh' }}
        >
            {/* Faint gold cross watermark */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] select-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='90' y='20' width='20' height='160' fill='%23C9A84C'/%3E%3Crect x='30' y='70' width='140' height='20' fill='%23C9A84C'/%3E%3C/svg%3E")`,
                    backgroundSize: '300px 300px',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* 60/40 horizontal grid */}
            <div className="flex flex-col md:flex-row w-full" style={{ minHeight: '100vh' }}>

                {/* ── LEFT ZONE (60%) — Ivory Parchment ── */}
                <div
                    className="relative flex flex-col justify-center md:w-[60%] w-full px-8 md:px-16 xl:px-24 pt-32 pb-40 md:pt-36 md:pb-48"
                    style={{ backgroundColor: '#F5F0E8' }}
                >
                    {/* Subtle marble texture overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />

                    {/* Eyebrow */}
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-nav text-[11px] tracking-[0.35em] uppercase font-bold mb-6"
                        style={{ color: '#C9A84C' }}
                    >
                        ✦ WELCOME TO VATICANO ✦
                    </motion.p>

                    {/* H1 — three-line treatment */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <h1 className="leading-[1.05] mb-6">
                            <span
                                className="block font-serif font-bold"
                                style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: '#1A1210' }}
                            >
                                Discover the
                            </span>
                            <span
                                className="block font-accent italic"
                                style={{ fontSize: 'clamp(56px, 7vw, 92px)', color: '#C9A84C' }}
                            >
                                Eternal City
                            </span>
                            <span
                                className="block font-serif font-bold"
                                style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: '#1A1210' }}
                            >
                                With Us
                            </span>
                        </h1>
                    </motion.div>

                    {/* Body */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="font-sans text-xl leading-relaxed mb-10 max-w-md"
                        style={{ color: '#3D1A6E', fontSize: '18px' }}
                    >
                        Private Vatican access, Sistine Chapel after-hours, and Swiss Guard escorted walks — curated for the discerning pilgrim.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link
                            href="/category/vatican"
                            className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 transition-all hover:scale-105 hover:shadow-xl"
                            style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                        >
                            Book Vatican Tours
                        </Link>
                        <Link
                            href="/private-tours"
                            className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 border-2 transition-all hover:scale-105"
                            style={{ borderColor: '#3D1A6E', color: '#3D1A6E', borderRadius: '2px' }}
                        >
                            Private Experiences
                        </Link>
                    </motion.div>
                </div>

                {/* ── RIGHT ZONE (40%) — Full-height photo ── */}
                <div className="relative md:w-[40%] w-full" style={{ minHeight: '60vh' }}>
                    <Image
                        src={posterUrl}
                        alt="Vatican aerial panorama"
                        fill
                        priority
                        fetchPriority="high"
                        className="object-cover"
                        sizes="40vw"
                        quality={80}
                    />
                    {/* Dark gradient on left edge to blend into ivory */}
                    <div
                        className="absolute inset-y-0 left-0 w-16 pointer-events-none hidden md:block"
                        style={{ background: 'linear-gradient(to right, #F5F0E8, transparent)' }}
                    />

                    {/* Floating card — top right: Sacred Sites */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
                        animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
                        className="absolute top-10 right-6 bg-white/95 backdrop-blur-md shadow-2xl p-4 max-w-[190px]"
                        style={{ borderRadius: '2px', borderLeft: '3px solid #C9A84C' }}
                    >
                        <p className="text-2xl mb-1">✈️</p>
                        <p className="font-serif text-2xl font-bold leading-none" style={{ color: '#1A1210' }}>5,000+</p>
                        <p className="font-nav text-[10px] uppercase tracking-widest mt-1" style={{ color: '#3D1A6E' }}>Sacred Sites Visited</p>
                    </motion.div>

                    {/* Floating card — bottom left: Rating */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: 3 }}
                        transition={{ delay: 0.9, duration: 0.6, type: 'spring' }}
                        className="absolute bottom-52 left-0 -translate-x-8 md:-translate-x-10 bg-white/95 backdrop-blur-md shadow-2xl p-4 max-w-[200px]"
                        style={{ borderRadius: '2px', borderLeft: '3px solid #C9A84C' }}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: '#C9A84C', fontSize: '14px' }}>★</span>
                            ))}
                        </div>
                        <p className="font-serif text-xl font-bold" style={{ color: '#1A1210' }}>4.9 Rating</p>
                        <p className="font-nav text-[10px] uppercase tracking-widest" style={{ color: '#3D1A6E' }}>12,000 Pilgrims</p>
                    </motion.div>
                </div>
            </div>

            {/* ── OVERLAPPING SEARCH BAR — floats below hero edge ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-16 xl:px-24 pb-0"
                style={{ transform: 'translateY(50%)' }}
            >
                <div
                    className="w-full max-w-5xl bg-white shadow-2xl"
                    style={{ borderRadius: '2px', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Destination */}
                        <div className="flex flex-col px-6 py-4">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1" style={{ color: '#C9A84C' }}>📍 Destination</label>
                            <input
                                type="text"
                                placeholder="Vatican, Rome, Colosseum..."
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent placeholder-gray-400"
                                style={{ color: '#1A1210' }}
                            />
                        </div>
                        {/* Date */}
                        <div className="flex flex-col px-6 py-4">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1" style={{ color: '#C9A84C' }}>🗓 Travel Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent text-gray-500"
                            />
                        </div>
                        {/* Pilgrims */}
                        <div className="flex flex-col px-6 py-4">
                            <label className="font-nav text-[9px] uppercase tracking-[0.25em] font-bold mb-1" style={{ color: '#C9A84C' }}>👥 Pilgrims</label>
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
                            className="flex items-center justify-center gap-2 font-nav font-bold uppercase tracking-widest text-sm px-8 py-5 transition-all hover:brightness-110 active:scale-95"
                            style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                        >
                            <span>🔍</span>
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
