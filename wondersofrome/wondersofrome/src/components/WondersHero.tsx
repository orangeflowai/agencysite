'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';
const R2_HERO_VIDEO = `${R2_BASE}/Video_Generation_Complete.mp4`;

interface HeroProps {
  settings?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroVideo?: { asset: { url: string } };
    heroImage?: { asset: { url: string } };
  } | null;
}

export default function WondersHero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const videoUrl = settings?.heroVideo?.asset?.url || R2_HERO_VIDEO;
  const imageUrl = settings?.heroImage?.asset?.url || `${R2_BASE}/pexels-giorgi-gobadze-2160475859-36770780.jpg`;

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });

    // 1. Initial State: Panels cover the screen, text invisible
    gsap.set([leftPanelRef.current, rightPanelRef.current], { xPercent: 0 });
    gsap.set('.hero-line-inner', { yPercent: 100 });
    gsap.set(ctaRef.current, { opacity: 0, y: 30 });

    const isMobile = window.innerWidth < 768;
    const panelDuration = isMobile ? 0.8 : 1.2;

    // 2. Split Panels at 0.3s
    tl.to(leftPanelRef.current, {
      xPercent: -100,
      duration: panelDuration
    }, 0.3);
    
    tl.to(rightPanelRef.current, {
      xPercent: 100,
      duration: panelDuration
    }, 0.3);

    // 3. Reveal Text at 1.0s (overlapping)
    tl.to('.hero-line-inner', {
      yPercent: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power4.out'
    }, 1.0);

    // 4. CTA Fade up at 1.8s
    tl.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 1.8);

  }, { scope: containerRef });

  // Split title into lines manually for the reveal effect
  const title = settings?.heroTitle || "Discover Rome's Timeless Wonders";
  const lines = title.split('\n');

  return (
    <section ref={containerRef} className="relative w-full flex flex-col justify-center overflow-hidden bg-black pt-[102px] min-h-screen">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline preload="auto"
          className="w-full h-full object-cover opacity-60 scale-105"
          poster={imageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Vertical Split Overlay */}
      <div ref={leftPanelRef} className="absolute inset-y-0 left-0 w-1/2 bg-[#0F1C19] z-20 will-change-transform" />
      <div ref={rightPanelRef} className="absolute inset-y-0 right-0 w-1/2 bg-[#0F1C19] z-20 will-change-transform" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex-1 flex flex-col justify-center">
        <div ref={textRef} className="max-w-4xl">
          {title.split('<br />').map((line, i) => (
            <div key={i} className="overflow-hidden mb-2">
              <h1 className="hero-line-inner text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-serif font-bold leading-[0.95] tracking-tighter will-change-transform">
                {line.replace(/<[^>]*>?/gm, '')}
              </h1>
            </div>
          ))}
          
          <div className="overflow-hidden mt-8 mb-12">
            <p className="hero-line-inner text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-medium will-change-transform">
              {settings?.heroSubtitle || 'Experience the Eternal City through the eyes of historians. Skip-the-line access and immersive AR technology.'}
            </p>
          </div>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full tracking-widest text-xs transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              INITIATE JOURNEY <ArrowRight size={14} />
            </Link>
            <Link
              href="/category/vatican"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white font-bold px-10 py-5 rounded-full tracking-widest text-xs transition-all"
            >
              EXPLORE VATICAN
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
      </div>
    </section>
  );
}
