'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

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

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // The assigned R2 video link
    const videoUrl = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/Video_Generation_Complete.mp4';

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Initial State
            gsap.set('.wander-reveal', { opacity: 0, y: 30 });

            // 2. Entrance Timeline
            const tl = gsap.timeline();
            tl.to('.wander-reveal', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.5
            });

            // 3. Cinematic Scroll Effect (Ravi Klaassens Style)
            gsap.to(videoRef.current, {
                scale: 1,
                filter: 'brightness(0.5)',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=100%',
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Text parallax / exit
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -80,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=40%',
                    scrub: true
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#1A1210] flex flex-col justify-center">

            {/* Cinematic Video Background */}
            <div ref={videoRef} className="absolute inset-0 z-0 overflow-hidden scale-[1.2] origin-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    src={videoUrl}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* ── HERO CONTENT ── */}
            <div
                ref={contentRef}
                className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16"
            >
                {/* Eyebrow */}
                <p className="wander-reveal font-nav text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-bold mb-6 sm:mb-8 text-[#F5F0E8]">
                    ✦ Welcome to RomeWander ✦
                </p>

                {/* H1 */}
                <h1 className="wander-reveal leading-[1.05] mb-4 sm:mb-6 max-w-5xl">
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
                </h1>

                {/* Subtitle */}
                <p className="wander-reveal font-sans text-white/90 max-w-xl mb-8 sm:mb-10 leading-relaxed px-4 text-sm sm:text-base md:text-lg">
                    Private Vatican access · Sistine Chapel after-hours · Swiss Guard escorted walks. Curated for the discerning pilgrim.
                </p>

                {/* CTAs */}
                <div className="wander-reveal flex flex-col sm:flex-row gap-4 mb-10 sm:mb-16 w-full sm:w-auto px-4">
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
                </div>
            </div>

            {/* ── SEARCH BAR (GLASS) ── */}
            <div className="wander-reveal lg:absolute lg:bottom-12 left-0 right-0 z-20 px-6 md:px-16 xl:px-24">
                <div
                    className="w-full max-w-6xl mx-auto glass shadow-2xl overflow-hidden rounded-[2rem] border border-white/20"
                >
                    <div className="bg-white/10 backdrop-blur-2xl flex flex-col lg:flex-row items-stretch overflow-hidden">
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
                        
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-4 bg-[#C9A84C] text-[#1A1210] font-nav font-black uppercase tracking-[0.25em] text-xs px-12 py-8 transition-all hover:bg-[#d4b766] active:scale-95 group/btn lg:w-[240px]"
                        >
                            <span>Search</span>
                            <Search size={16} className="group-hover/btn:scale-125 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
