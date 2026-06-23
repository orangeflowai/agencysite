'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

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
    const textRef = useRef<HTMLDivElement>(null);

    // CSS-only entrance: stagger children with animation-delay
    useEffect(() => {
        const lines = textRef.current?.querySelectorAll<HTMLElement>('.hero-text-line');
        lines?.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(30px)';
            line.style.transition = `opacity 1.2s ease ${0.5 + i * 0.2}s, transform 1.2s ease ${0.5 + i * 0.2}s`;
            // Trigger
            requestAnimationFrame(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            });
        });
    }, []);

    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden pt-[64px]">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-68px)]">

                {/* LEFT CONTENT */}
                <div
                    ref={textRef}
                    className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 space-y-12 relative z-10 border-r border-primary/10 bg-background/80 backdrop-blur-sm"
                >
                    <div className="hero-text-line flex items-center gap-4">
                        <div className="w-12 h-px bg-primary" />
                        <span className="text-[8px] font-bold tracking-tight text-primary/60 uppercase">
                            Boutique Travel Concierge
                        </span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="hero-text-line text-6xl md:text-8xl xl:text-9xl text-foreground leading-tight font-bold tracking-tighter font-serif">
                            {settings?.heroTitle || 'A Rare Path Through Rome.'}
                        </h1>
                        <p className="hero-text-line text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                            {settings?.heroSubtitle || 'We avoid the standard. Our collection of private experiences is selected for those who seek the architectural, the historical, and the genuinely rare.'}
                        </p>
                    </div>

                    <div className="hero-text-line flex flex-col sm:flex-row gap-6 pt-4">
                        <Link
                            href="/search"
                            className="group bg-primary text-primary-foreground px-14 py-6 font-bold tracking-tight text-xs hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 uppercase rounded-xl"
                        >
                            <span>Explore Collection</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/private-tours"
                            className="border border-primary/20 text-foreground px-14 py-6 font-bold tracking-tight text-xs hover:bg-primary/5 transition-all text-center backdrop-blur-md uppercase rounded-xl"
                        >
                            Private Access
                        </Link>
                    </div>

                    <div className="hero-text-line flex items-center gap-16 pt-12 border-t border-primary/10">
                        <div>
                            <p className="text-3xl font-bold text-primary">1987</p>
                            <p className="text-[8px] font-bold tracking-tight text-muted-foreground mt-1 uppercase">Heritage Agency</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">32</p>
                            <p className="text-[8px] font-bold tracking-tight text-muted-foreground mt-1 uppercase">Curated Routes</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT VIDEO */}
                <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-full overflow-hidden group">
                    <video
                        src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/goldenroman/POV_Walking_Video_Generation-ezgif.com-optimize-2.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover sepia-[0.1] contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-[3000ms]"
                    />
                    <div className="absolute inset-10 border border-white/20 z-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-l from-foreground/20 via-transparent to-transparent" />

                    {/* Floating card */}
                    <div className="hero-text-line absolute bottom-8 sm:bottom-12 md:bottom-16 right-8 sm:right-12 md:right-16 bg-white/10 backdrop-blur-2xl p-8 md:p-10 max-w-[280px] sm:max-w-[320px] z-30 shadow-2xl border border-white/20 rounded-3xl">
                        <div className="w-8 h-px bg-primary mb-6" />
                        <p className="text-[8px] font-bold tracking-tight text-primary mb-4 uppercase">Featured Highlight</p>
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-white mb-6 font-serif">
                            The Secret Rooms of the Vatican.
                        </h3>
                        <Link href="/tour/vatican-secrets" className="group inline-flex items-center gap-2 text-xs font-bold tracking-tight text-primary transition-all uppercase">
                            <span className="border-b border-primary pb-1 group-hover:text-white group-hover:border-white transition-colors">View Details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
