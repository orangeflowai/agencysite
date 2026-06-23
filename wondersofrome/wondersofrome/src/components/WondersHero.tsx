'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev';
const R2_HERO_VIDEO = `${R2_BASE}/15442544_3840_2160_30fps.mp4`;
const R2_HERO_POSTER = `${R2_BASE}/rome%20photos/hero-poster.jpg`;

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
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  const videoUrl = settings?.heroVideo?.asset?.url || R2_HERO_VIDEO;
  const posterUrl = settings?.heroImage?.asset?.url || R2_HERO_POSTER;

  // CSS-only reveal animation using requestAnimationFrame
  useEffect(() => {
    const left = leftPanelRef.current;
    const right = rightPanelRef.current;
    const cta = ctaRef.current;
    const lines = containerRef.current?.querySelectorAll<HTMLElement>('.hero-line-inner');

    if (!left || !right) return;

    // Start with panels visible
    left.style.transform = 'translateX(0)';
    right.style.transform = 'translateX(0)';

    const timer = setTimeout(() => {
      // Slide panels out
      left.style.transition = 'transform 1.2s cubic-bezier(0.87, 0, 0.13, 1)';
      right.style.transition = 'transform 1.2s cubic-bezier(0.87, 0, 0.13, 1)';
      left.style.transform = 'translateX(-100%)';
      right.style.transform = 'translateX(100%)';

      // Stagger reveal text lines
      lines?.forEach((line, i) => {
        line.style.transition = `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${1.0 + i * 0.08}s`;
        line.style.transform = 'translateY(0)';
      });

      // Fade in CTA
      if (cta) {
        cta.style.transition = 'opacity 0.8s ease 1.8s, transform 0.8s ease 1.8s';
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const title = (settings?.heroTitle || t('hero.title') || '').toString();
  const subtitle = (settings?.heroSubtitle || t('hero.subtitle') || '').toString();

  return (
    <section ref={containerRef} className="relative w-full flex flex-col justify-center overflow-hidden bg-black pt-[104px] min-h-screen">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterUrl}
          className="w-full h-full object-cover opacity-70"
          style={{ willChange: 'auto', transform: 'translateZ(0)' }}
          onError={() => {
            if (videoRef.current) videoRef.current.style.display = 'none';
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Split reveal panels */}
      <div
        ref={leftPanelRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-card z-20 will-change-transform"
      />
      <div
        ref={rightPanelRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-card z-20 will-change-transform"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">

          {/* Title lines */}
          <div className="w-full flex flex-col items-center">
            {title.split('<br />').map((line, i) => (
              <div key={i} className="overflow-hidden mb-2">
                <h1
                  className="hero-line-inner text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-serif font-bold leading-[0.95] tracking-tighter will-change-transform"
                  style={{ transform: 'translateY(100%)' }}
                >
                  {line ? line.replace(/<[^>]*>?/gm, '') : ''}
                </h1>
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <div className="overflow-hidden mt-8 mb-12 w-full flex justify-center">
            <p
              className="hero-line-inner text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-medium will-change-transform px-4"
              style={{ transform: 'translateY(100%)' }}
            >
              {subtitle}
            </p>
          </div>

          {/* CTA */}
          <div
            ref={ctaRef}
            className="w-full max-w-4xl space-y-6"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-white/70 text-[10px] font-bold tracking-widest uppercase ml-1">Category</label>
                  <select className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-white/10 transition-colors [&>option]:text-gray-900">
                    <option value="">All Tours</option>
                    <option value="vatican">Vatican Tours</option>
                    <option value="colosseum">Colosseum Tours</option>
                    <option value="city">City Tours</option>
                    <option value="hidden-gems">Hidden Gems</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-white/70 text-[10px] font-bold tracking-widest uppercase ml-1">Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-white/10 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-white/70 text-[10px] font-bold tracking-widest uppercase ml-1">Guests</label>
                  <select className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-white/10 transition-colors [&>option]:text-gray-900">
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5+ Guests</option>
                  </select>
                </div>
              </div>
              <Link
                href="/search"
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-4 rounded-xl tracking-widest text-sm transition-all shadow-xl hover:-translate-y-1 active:scale-95"
              >
                Search Tours <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: '/category/vatican', label: 'Vatican Tours' },
                { href: '/category/colosseum', label: 'Colosseum Tours' },
                { href: '/search', label: 'All Tours' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white font-semibold px-6 py-3 rounded-full text-xs transition-all hover:-translate-y-1"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 opacity-50">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
      </div>
    </section>
  );
}
