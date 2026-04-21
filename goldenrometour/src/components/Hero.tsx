'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { Search, Map, Calendar, Users, ArrowRight } from 'lucide-react';
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
    const { t } = useLanguage();
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState('2');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial State
            gsap.set('.hero-text-line', { opacity: 0, y: 30 });
            
            // 1. Entrance Animation
            const tl = gsap.timeline();
            tl.to('.hero-text-line', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power4.out',
                delay: 0.5
            });

            // 2. Scroll Animation (The Ravi Klaassens Effect)
            gsap.to(imageRef.current, {
                scale: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=100%',
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Subtle text parallax/fade on scroll
            gsap.to(textRef.current, {
                opacity: 0,
                y: -50,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=50%',
                    scrub: true
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const rawImageUrl = settings?.heroImage?.asset?.url || 
                       `https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-giorgi-gobadze-2160475859-36770780.jpg`;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-[#F5F0E8] overflow-hidden">
            {/* Background Texture/Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-0"></div>

            <div className="flex flex-col lg:flex-row h-full">
                {/* LEFT CONTENT (EDITORIAL) */}
                <div ref={textRef} className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 xl:p-24 space-y-12 relative z-10 border-r border-[#555B02]/10 bg-[#F5F0E8]/80 backdrop-blur-sm">
                    <div className="hero-text-line flex items-center gap-4">
                        <div className="w-12 h-px bg-[#555B02]"></div>
                        <span className="font-sans font-black text-[10px] uppercase tracking-[0.5em] text-[#555B02]/60">
                            Boutique Travel Concierge
                        </span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="hero-text-line font-serif text-6xl md:text-8xl xl:text-9xl text-[#555B02] leading-[0.9] font-bold tracking-tighter">
                            {settings?.heroTitle || "A Rare Path Through Rome."}
                        </h1>

                        <p className="hero-text-line font-sans text-xl md:text-2xl text-[#1A1210] max-w-xl leading-relaxed opacity-70 italic font-serif">
                            {settings?.heroSubtitle || "We avoid the standard. Our collection of private experiences is selected for those who seek the architectural, the historical, and the genuinely rare."}
                        </p>
                    </div>

                    <div className="hero-text-line flex flex-col sm:flex-row gap-6 pt-4">
                        <Link href="/search" className="group bg-[#555B02] text-[#F5F0E8] px-14 py-6 font-sans font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#555B02]/20">
                            <span>Explore Collection</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/private-tours" className="border border-[#555B02]/20 text-[#555B02] px-14 py-6 font-sans font-black uppercase tracking-[0.2em] text-xs hover:bg-[#555B02]/5 transition-all text-center backdrop-blur-md">
                            Private Access
                        </Link>
                    </div>

                    {/* Editorial Credits / Stats */}
                    <div className="hero-text-line flex items-center gap-16 pt-12 border-t border-[#555B02]/10">
                        <div className="group cursor-default">
                            <p className="font-serif text-3xl font-bold text-[#555B02] group-hover:scale-110 transition-transform origin-left">1987</p>
                            <p className="font-sans text-[9px] uppercase font-black tracking-[0.3em] text-[#555B02]/40 mt-1">Heritage Agency</p>
                        </div>
                        <div className="group cursor-default">
                            <p className="font-serif text-3xl font-bold text-[#555B02] group-hover:scale-110 transition-transform origin-left">32</p>
                            <p className="font-sans text-[9px] uppercase font-black tracking-[0.3em] text-[#555B02]/40 mt-1">Curated Routes</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT IMAGE (EDITORIAL) */}
                <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-full overflow-hidden group">
                    <div
                        ref={imageRef}
                        className="w-full h-full scale-[1.2] origin-center"
                    >
                        <Image
                            src={rawImageUrl}
                            alt="Vintage Rome"
                            fill
                            className="object-cover sepia-[0.1] contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-[3000ms]"
                            priority
                        />
                    </div>
                    
                    {/* Vintage Border Inset */}
                    <div className="absolute inset-10 border border-white/20 z-20 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent"></div>

                    {/* Floating Content Card (Glassmorphism) */}
                    <div className="hero-text-line absolute bottom-16 right-16 glass-white p-10 max-w-[320px] z-30 shadow-2xl border border-white/40 rounded-2xl backdrop-blur-2xl">
                        <div className="w-8 h-px bg-[#555B02]/30 mb-6"></div>
                        <p className="font-sans font-black text-[9px] uppercase tracking-[0.4em] text-[#555B02]/50 mb-4">Featured Highlight</p>
                        <h3 className="font-serif text-3xl font-bold text-[#555B02] mb-6 leading-tight italic">The Secret Rooms of the Vatican.</h3>
                        <Link href="/tour/vatican-secrets" className="group inline-flex items-center gap-2 font-sans font-black text-[10px] uppercase tracking-[0.2em] text-[#555B02] transition-all">
                            <span className="border-b border-[#555B02]/30 pb-1 group-hover:border-[#555B02] transition-colors">View Details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* FLOATING SEARCH WIDGET (GLASS) */}
            <div className="hero-text-line hidden lg:block absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full max-w-6xl px-12">
                <div className="glass shadow-[0_32px_80px_rgba(85,91,2,0.15)] p-1.5 border border-white/40 rounded-[2rem] overflow-hidden backdrop-blur-3xl">
                    <div className="bg-[#F5F0E8]/50 backdrop-blur-md flex flex-row items-stretch rounded-[1.8rem]">
                        <div className="flex-1 flex items-center px-10 py-6 border-r border-[#555B02]/10 group focus-within:bg-[#F5F0E8]/80 transition-all duration-500">
                            <Map className="w-5 h-5 text-[#555B02]/40 mr-5 group-hover:scale-110 transition-transform" />
                            <div className="flex-1">
                                <label className="block text-[9px] font-black text-[#555B02]/50 uppercase tracking-[0.3em] mb-2">Location / Interest</label>
                                <input
                                    type="text"
                                    placeholder="Search architectural gems..."
                                    className="w-full bg-transparent outline-none font-serif text-xl text-[#555B02] placeholder:text-[#555B02]/20"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-10 py-6 border-r border-[#555B02]/10 group focus-within:bg-[#F5F0E8]/80 transition-all duration-500">
                            <Calendar className="w-5 h-5 text-[#555B02]/40 mr-5 group-hover:scale-110 transition-transform" />
                            <div className="flex-1">
                                <label className="block text-[9px] font-black text-[#555B02]/50 uppercase tracking-[0.3em] mb-2">Desired Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-transparent outline-none font-sans text-sm font-bold text-[#555B02]"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-10 py-6 border-r border-[#555B02]/10 group focus-within:bg-[#F5F0E8]/80 transition-all duration-500">
                            <Users className="w-5 h-5 text-[#555B02]/40 mr-5 group-hover:scale-110 transition-transform" />
                            <div className="flex-1">
                                <label className="block text-[9px] font-black text-[#555B02]/50 uppercase tracking-[0.3em] mb-2">Guests</label>
                                <select
                                    className="w-full bg-transparent outline-none font-sans text-sm font-bold text-[#555B02] appearance-none cursor-pointer"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                >
                                    <option value="1">Individual (1)</option>
                                    <option value="2">Duo (2)</option>
                                    <option value="4">Small Group (4)</option>
                                    <option value="8">Private Party (8+)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-[#555B02] text-[#F5F0E8] px-16 font-sans font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#6b7303] transition-all flex items-center gap-3 group/btn rounded-r-[1.8rem]"
                        >
                            <span>Find Experiences</span>
                            <Search className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
