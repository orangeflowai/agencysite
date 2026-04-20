'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

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

    // Refs for GSAP
    const videoWrapperRef = useRef<HTMLDivElement>(null);

    // The assigned R2 video link
    const videoUrl = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/Video_Generation_Complete.mp4';

    // Mouse Parallax (Desktop Only)
    useEffect(() => {
        console.log("✦ Hero Section v2.2 Active");
        if (!videoWrapperRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xOffset = ((clientX / window.innerWidth) - 0.5) * -2; // -1% to 1%
            const yOffset = ((clientY / window.innerHeight) - 0.5) * -2;

            gsap.to(videoWrapperRef.current, {
                xPercent: xOffset,
                yPercent: yOffset,
                duration: 1,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="relative w-full min-h-screen md:h-screen min-h-[700px] overflow-hidden bg-[#1A1210] flex flex-col justify-center">

            {/* ── PARALLAX WRAPPER & VIDEO ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    ref={videoWrapperRef}
                    className="absolute w-full h-full"
                    style={{ transform: 'scale(1.05)' }} // 1.05x scale prevents edges from showing during parallax
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover"
                        src={videoUrl}
                    />
                </div>
            </div>

            {/* Multi-layer dark overlay for text contrast */}
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(26,18,16,0.6) 0%, rgba(26,18,16,0.3) 40%, rgba(26,18,16,0.85) 100%)' }} />
            {/* Subtle vignette */}
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,18,16,0.6) 100%)' }} />

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
                className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16"
                style={{ paddingTop: '140px', paddingBottom: '40px' }}
            >
                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-nav text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-bold mb-6 sm:mb-8 text-[#F5F0E8]"
                >
                    ✦ Welcome to RomeWander ✦
                </motion.p>

                {/* H1 */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className="leading-[1.05] mb-4 sm:mb-6 max-w-5xl"
                >
                    <span
                        className="block font-serif font-black text-white px-2"
                        style={{ fontSize: 'clamp(36px, 6vw, 100px)' }}
                    >
                        Discover the
                    </span>
                    <span
                        className="block font-accent italic px-2"
                        style={{ fontSize: 'clamp(44px, 7.5vw, 116px)', color: '#F5F0E8', lineHeight: 1 }}
                    >
                        Eternal City
                    </span>
                    <span
                        className="block font-serif font-black text-white px-2"
                        style={{ fontSize: 'clamp(36px, 6vw, 100px)' }}
                    >
                        with Purpose
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-sans text-white/90 max-w-xl mb-8 sm:mb-10 leading-relaxed px-4 text-sm sm:text-base md:text-lg"
                >
                    Private Vatican access · Sistine Chapel after-hours · Swiss Guard escorted walks. Curated for the discerning pilgrim.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-16 w-full sm:w-auto px-4"
                >
                    <Link
                        href="/category/vatican"
                        className="w-full sm:w-auto text-center font-nav font-bold uppercase tracking-widest text-xs sm:text-sm px-8 py-4 sm:py-5 transition-all hover:scale-105 hover:shadow-2xl"
                        style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                    >
                        Explore Vatican Tours
                    </Link>
                    <Link
                        href="/private-tours"
                        className="w-full sm:w-auto text-center font-nav font-bold uppercase tracking-widest text-xs sm:text-sm px-8 py-4 sm:py-5 border-2 transition-all hover:scale-105 backdrop-blur-sm"
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
                    className="hidden sm:flex flex-wrap gap-4 justify-center"
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
                            <span className="font-serif font-bold text-lg" style={{ color: '#F5F0E8' }}>{stat.value}</span>
                            <span className="font-nav text-[9px] uppercase tracking-widest text-white/60">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── SEARCH BAR (GLASS) ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="lg:absolute lg:bottom-12 left-0 right-0 z-20 px-6 md:px-16 xl:px-24 pt-12 lg:pt-0"
            >
                <div
                    className="w-full max-w-6xl mx-auto glass shadow-2xl overflow-hidden rounded-[2rem] border border-white/20"
                >
                    <div className="bg-white/10 backdrop-blur-2xl flex flex-col lg:flex-row items-stretch overflow-hidden">
                        {/* Destination */}
                        <div className="flex-1 flex flex-col px-8 py-6 border-b lg:border-b-0 lg:border-r border-white/10 group focus-within:bg-white/10 transition-all duration-300">
                            <label className="font-nav text-[10px] uppercase tracking-[0.3em] font-black mb-2 text-[#C9A84C]/80">
                                📍 Destination
                            </label>
                            <input
                                type="text"
                                placeholder={settings?.heroSubtitle || "Vatican, Sistine Chapel..."}
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                className="font-serif text-xl outline-none bg-transparent placeholder-white/30 text-white w-full"
                            />
                        </div>
                        
                        {/* Date */}
                        <div className="flex-1 flex flex-col px-8 py-6 border-b lg:border-b-0 lg:border-r border-white/10 group focus-within:bg-white/10 transition-all duration-300">
                            <label className="font-nav text-[10px] uppercase tracking-[0.3em] font-black mb-2 text-[#C9A84C]/80">
                                🗓 Travel Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent text-white/50 w-full focus:text-white transition-colors"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                        
                        {/* Pilgrims */}
                        <div className="flex-1 flex flex-col px-8 py-6 border-b lg:border-b-0 lg:border-r border-white/10 group focus-within:bg-white/10 transition-all duration-300">
                            <label className="font-nav text-[10px] uppercase tracking-[0.3em] font-black mb-2 text-[#C9A84C]/80">
                                👥 Pilgrims
                            </label>
                            <select
                                value={guests}
                                onChange={e => setGuests(e.target.value)}
                                className="font-sans text-sm outline-none bg-transparent text-white/50 w-full focus:text-white transition-colors cursor-pointer appearance-none"
                            >
                                <option value="" className="bg-[#1A1210]">Select group size</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n} className="bg-[#1A1210]">{n} {n === 1 ? 'Pilgrim' : 'Pilgrims'}</option>
                                ))}
                                <option value="11+" className="bg-[#1A1210]">11+ (Group)</option>
                            </select>
                        </div>
                        
                        {/* Search CTA */}
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-4 bg-[#C9A84C] text-[#1A1210] font-nav font-black uppercase tracking-[0.25em] text-xs px-12 py-8 transition-all hover:bg-[#d4b766] active:scale-95 group/btn lg:w-[240px]"
                        >
                            <span>Search</span>
                            <Search size={16} className="group-hover/btn:scale-125 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>

        </section>
    );
}
