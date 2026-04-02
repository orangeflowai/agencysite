'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import Image from 'next/image';


// Define props
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const videoUrl = settings?.heroVideo?.asset?.url || `${SUPABASE_BUCKET_URL}/hero-video.mp4`;
    // Supabase image transform: serve poster at 1280px WebP for fast LCP
    const rawImageUrl = settings?.heroImage?.asset?.url || `${SUPABASE_BUCKET_URL}/hero-poster.jpg`;
    const posterUrl = rawImageUrl.includes('supabase.co')
        ? `${rawImageUrl}?width=1280&quality=75&format=webp`
        : rawImageUrl;
    const posterUrlMobile = rawImageUrl.includes('supabase.co')
        ? `${rawImageUrl}?width=640&quality=70&format=webp`
        : rawImageUrl;

    const title = settings?.heroTitle;
    const subtitle = settings?.heroSubtitle;

    // Load video lazily after page is interactive
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && videoRef.current && !videoLoaded) {
                    videoRef.current.src = videoUrl;
                    videoRef.current.load();
                    setVideoLoaded(true);
                }
            },
            { threshold: 0 }
        );
        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, [videoUrl, videoLoaded]);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background: priority poster image for LCP, video loads lazily */}
            <div className="absolute inset-0 z-0">
                {/* LCP-optimised poster — served via Supabase transforms at correct size */}
                <Image
                    src={posterUrl}
                    alt="Rome hero background"
                    fill
                    priority
                    fetchPriority="high"
                    className="object-cover opacity-90"
                    sizes="100vw"
                    quality={75}
                />
                {/* Video overlays the poster once loaded */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-bold !text-white"
                    >
                        {t('hero.title')}
                    </motion.h2>

                    {title ? (
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-9xl !text-white font-black tracking-tighter drop-shadow-xl uppercase"
                        >
                            {title}
                        </motion.h1>
                    ) : (
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-9xl !text-white font-black tracking-tighter drop-shadow-xl"
                        >
                            THE ETERNAL CITY,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400 italic">
                                UNLOCKED.
                            </span>
                        </motion.h1>
                    )}

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-2xl !text-white/90 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        {subtitle || t('hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-8 flex flex-col md:flex-row gap-4 justify-center"
                    >
                        <Link href="/search" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all text-sm md:text-base shadow-lg hover:shadow-emerald-900/50 hover:scale-105">
                            {t('hero.cta')}
                        </Link>
                        <Link href="/private-tours" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all text-sm md:text-base hover:scale-105">
                            View Private Tours
                        </Link>
                    </motion.div>

                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 animate-bounce"
            >
                <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/50 mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            </motion.div>
        </section>
    );
}
