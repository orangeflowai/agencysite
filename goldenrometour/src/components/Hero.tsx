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
        <section ref={containerRef} className="relative w-full min-h-screen bg-background overflow-hidden pt-[68px]">
            {/* Background Texture/Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-0"></div>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-68px)]">
                {/* LEFT CONTENT (EDITORIAL) */}
                <div ref={textRef} className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 space-y-12 relative z-10 border-r border-primary/10 bg-background/80 backdrop-blur-sm">
                    <div className="hero-text-line flex items-center gap-4">
                        <div className="w-12 h-px bg-primary"></div>
                        <span className="text-[10px] font-heading font-bold tracking-tight text-primary/60 uppercase">
                            Boutique Travel Concierge
                        </span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="hero-text-line font-heading text-6xl md:text-8xl xl:text-9xl text-secondary leading-tight font-bold tracking-tighter">
                            {settings?.heroTitle || "A Rare Path Through Rome."}
                        </h1>

                        <p className="hero-text-line font-body text-base md:text-lg text-secondary max-w-xl leading-relaxed opacity-70">
                            {settings?.heroSubtitle || "We avoid the standard. Our collection of private experiences is selected for those who seek the architectural, the historical, and the genuinely rare."}
                        </p>
                    </div>

                    <div className="hero-text-line flex flex-col sm:flex-row gap-6 pt-4">
                        <Link href="/search" className="group bg-primary text-secondary px-14 py-6 font-heading font-bold tracking-tight text-xs hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 uppercase">
                            <span>Explore Collection</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/private-tours" className="border border-primary/20 text-secondary px-14 py-6 font-heading font-bold tracking-tight text-xs hover:bg-primary/5 transition-all text-center backdrop-blur-md uppercase">
                            Private Access
                        </Link>
                    </div>

                    {/* Editorial Credits / Stats */}
                    <div className="hero-text-line flex items-center gap-16 pt-12 border-t border-primary/10">
                        <div className="group cursor-default">
                            <p className="font-heading text-3xl font-bold text-primary group-hover:scale-110 transition-transform origin-left">1987</p>
                            <p className="text-[10px] font-heading font-bold tracking-tight text-primary/40 mt-1 uppercase">Heritage Agency</p>
                        </div>
                        <div className="group cursor-default">
                            <p className="font-heading text-3xl font-bold text-primary group-hover:scale-110 transition-transform origin-left">32</p>
                            <p className="text-[10px] font-heading font-bold tracking-tight text-primary/40 mt-1 uppercase">Curated Routes</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT VIDEO (EDITORIAL) */}
                <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-full overflow-hidden group">
                    <div
                        ref={imageRef}
                        className="w-full h-full scale-[1.2] origin-center"
                    >
                        <video
                            src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/goldenroman/POV_Walking_Video_Generation-ezgif.com-optimize-2.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover sepia-[0.1] contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-[3000ms]"
                        />
                    </div>
                    
                    {/* Vintage Border Inset */}
                    <div className="absolute inset-10 border border-white/20 z-20 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-secondary/20 via-transparent to-transparent"></div>

                    {/* Floating Content Card (Glassmorphism) */}
                    <div className="hero-text-line absolute bottom-8 sm:bottom-12 md:bottom-16 right-8 sm:right-12 md:right-16 bg-white/10 backdrop-blur-2xl p-8 md:p-10 max-w-[280px] sm:max-w-[320px] z-30 shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-white/20 rounded-3xl">
                        <div className="w-8 h-px bg-primary mb-6"></div>
                        <p className="text-[10px] font-heading font-bold tracking-tight text-primary mb-4 uppercase">Featured Highlight</p>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold leading-tight tracking-tight text-white mb-6">The Secret Rooms of the Vatican.</h3>
                        <Link href="/tour/vatican-secrets" className="group inline-flex items-center gap-2 text-xs font-heading font-bold tracking-tight text-primary transition-all uppercase">
                            <span className="border-b border-primary pb-1 group-hover:text-white group-hover:border-white transition-colors">View Details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>


        </section>
    );
}
