'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const R2_VIDEOS = [
  `${R2}/Video_Generation_Complete.mp4`,
  `${R2}/Animate_moving_towards_202604040427.mp4`,
  `${R2}/Animate_everything_subtly_202604040438.mp4`,
];

const FALLBACK_POSTER = `${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`;

const STATS = [
  { value: '50K+', label: 'Happy Travelers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '48',   label: 'Exclusive Routes' },
];

export default function Hero({ settings }: HeroProps) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set('.hero-reveal', { opacity: 0, y: 40 });

      // 2. Entrance Animation
      const tl = gsap.timeline();
      tl.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'expo.out',
        delay: 0.8
      });

      // 3. Scroll Cinematic Reveal
      gsap.to(videoRef.current, {
        scale: 1,
        filter: 'brightness(0.4)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1.5,
          pin: true,
          anticipatePin: 1
        }
      });

      // Parallax content exit
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
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

  const videoUrl  = settings?.heroVideo?.asset?.url  || R2_VIDEOS[0];
  const posterUrl = settings?.heroImage?.asset?.url  || FALLBACK_POSTER;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (date)        params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex items-center overflow-hidden bg-neutral-950">

      {/* ── Full-screen video background (Cinematic Zoom) ── */}
      <div ref={videoRef} className="absolute inset-0 z-0 scale-[1.3] origin-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl}
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={R2_VIDEOS[1]} type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Content ── */}
      <div ref={contentRef} className="relative z-10 container mx-auto px-6 md:px-12 py-32 md:py-40">
        <div className="max-w-3xl space-y-8">

          <div
            className="hero-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            New VIP Access Routes Available
          </div>

          {/* Headline */}
          <h1 className="hero-reveal text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold tracking-tight text-white leading-[1.05]">
            {settings?.heroTitle || (
              <>
                The Vatican.<br />
                <span className="text-emerald-400 italic font-serif">Skip the line,</span><br />
                own the moment.
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="hero-reveal text-lg md:text-xl text-white/75 max-w-xl leading-relaxed font-sans">
            {settings?.heroSubtitle || 'Join 50,000+ travelers who unlocked Rome through exclusive access, expert storytelling, and zero waiting.'}
          </p>

          {/* CTAs */}
          <div className="hero-reveal flex flex-col sm:flex-row gap-4">
            <Link
              href="/search"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-xl transition-all hover:scale-105 hover:shadow-2xl bg-emerald-600"
            >
              Browse All Tours
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#vatican"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-xl transition-all border border-white/25 hover:bg-white/10"
              style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)' }}
            >
              View Bestsellers
            </Link>
          </div>

          {/* Social proof */}
          <div className="hero-reveal flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex -space-x-2">
              {[12, 13, 14, 15].map(idx => (
                <div key={idx} className="w-9 h-9 rounded-full border-2 border-white/30 bg-neutral-700 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${idx}`} alt="traveler" loading="lazy" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-xs text-white/60 font-medium">4.9/5 from 3,200+ reviews</span>
            </div>
          </div>
        </div>

        {/* Search widget */}
        <div className="hero-reveal mt-16 max-w-2xl">
          <div
            className="p-5 rounded-2xl border border-white/20 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-white font-semibold text-sm">Find Your Tour</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-[2] bg-white rounded-xl border border-white/30 flex items-center px-4 py-3 gap-2 shadow-sm">
                <Search size={15} className="text-neutral-400 shrink-0" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-sm font-medium text-neutral-800 placeholder:text-neutral-400 font-sans"
                  placeholder="Vatican, Sistine Chapel, Colosseum..."
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex-1 bg-white rounded-xl border border-white/30 flex items-center px-4 py-3 shadow-sm">
                <input
                  type="date"
                  className="w-full bg-transparent outline-none text-sm font-medium text-neutral-600 font-sans"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="shrink-0 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 shadow-lg bg-emerald-600 border border-emerald-500/50"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-reveal mt-10 flex flex-wrap gap-4">
          {STATS.map(s => (
            <div
              key={s.label}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/15"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
            >
              <span className="font-bold text-lg text-white">{s.value}</span>
              <span className="text-xs uppercase tracking-widest text-white/50">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-white text-[10px] uppercase tracking-[0.15em] font-medium">Scroll</span>
        <div className="w-4 h-7 border border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
