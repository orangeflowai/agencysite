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
                <p className="wander-reveal font-inter text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-bold mb-6 sm:mb-8" style={{ color: '#F5F0E8' }}>
                    ✦ Welcome to RomeWander ✦
                </p>

                {/* H1 */}
                <h1 className="wander-reveal leading-[1.05] mb-4 sm:mb-6 max-w-5xl">
                    <span
                        className="block font-inter font-black px-2"
                        style={{ fontSize: 'clamp(36px, 6vw, 100px)', color: '#F5F0E8' }}
                    >
                        Discover the
                    </span>
                    <span
                        className="block font-inter italic px-2"
                        style={{ fontSize: 'clamp(44px, 7.5vw, 116px)', color: '#C9A84C', lineHeight: 1 }}
                    >
                        Eternal City
                    </span>
                    <span
                        className="block font-inter font-black px-2"
                        style={{ fontSize: 'clamp(36px, 6vw, 100px)', color: '#F5F0E8' }}
                    >
                        with Purpose
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="wander-reveal font-inter max-w-xl mb-8 sm:mb-10 leading-relaxed px-4 text-sm sm:text-base md:text-lg" style={{ color: 'rgba(245, 240, 232, 0.8)' }}>
                    Private Vatican access · Sistine Chapel after-hours · Swiss Guard escorted walks. Curated for the discerning pilgrim.
                </p>

                {/* CTAs */}
                <div className="wander-reveal flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
                    <Link
                        href="/category/vatican"
                        className="w-full sm:w-auto text-center font-inter font-bold uppercase tracking-widest text-xs sm:text-sm px-10 py-5 transition-all hover:scale-105 hover:shadow-2xl rounded-full"
                        style={{ backgroundColor: '#C9A84C', color: '#1A1210' }}
                    >
                        Explore Vatican Tours
                    </Link>
                    <Link
                        href="/private-tours"
                        className="w-full sm:w-auto text-center font-inter font-bold uppercase tracking-widest text-xs sm:text-sm px-10 py-5 border-2 transition-all hover:scale-105 backdrop-blur-sm rounded-full"
                        style={{ borderColor: 'rgba(201,168,76,0.7)', color: '#F5F0E8', backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                        Private Experiences
                    </Link>
                </div>
            </div>
        </section>
    );
}
