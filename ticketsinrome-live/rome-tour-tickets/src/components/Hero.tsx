'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users, ChevronDown, Star, Shield, Zap, MapPin } from 'lucide-react';

// Supabase-hosted hero video — same bucket used across both sites
const HERO_VIDEO =
  'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/hero-video.mp4';

const DESTINATIONS = [
  { value: 'colosseum', label: '🏛  Colosseum & Roman Forum' },
  { value: 'vatican',   label: '⛪  Vatican Museums & Sistine Chapel' },
  { value: 'city',      label: '🌆  Rome City Tours' },
  { value: 'hidden-gems', label: '💎  Hidden Gems & Day Trips' },
];

interface HeroProps {
  settings?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: { asset: { url: string } };
    heroVideo?: { asset: { url: string } };
  } | null;
}

export default function Hero({ settings }: HeroProps) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate]               = useState('');
  const [guests, setGuests]           = useState('2');

  const videoSrc = settings?.heroVideo?.asset?.url || HERO_VIDEO;
  const today    = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('category', destination);
    if (date)        params.set('date', date);
    if (guests)      params.set('guests', guests);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Full-screen video ── */}
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(2px) brightness(0.4)', transform: 'scale(1.06)' }}
      />

      {/* ── Cinematic layered gradient: dark teal → deep green ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/80 via-[#0f1f1a]/60 to-[#0f2d1a]/80" />
      {/* subtle warm vignette on edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.55)_100%)]" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6 md:gap-10">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/15 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-black uppercase tracking-[0.25em] px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/30">
          <Zap className="w-3 h-3 text-emerald-400" />
          Skip The Line · Instant Confirmation
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.92] tracking-tighter drop-shadow-2xl uppercase">
          Rome Without<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#34d399]">
            The Queues.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-white/70 font-medium max-w-xl leading-relaxed -mt-2">
          Fast-track access to the Colosseum, Vatican, Borghese &amp; beyond.
          Tickets delivered instantly to your inbox.
        </p>

        {/* ── Search Widget ── */}
        <div className="w-full max-w-4xl mt-1">
          {/* outer glow ring */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/40 via-emerald-300/20 to-[#f97316]/30 shadow-2xl shadow-emerald-900/40">
            <div className="bg-[#071914]/80 backdrop-blur-xl rounded-2xl p-2 grid grid-cols-2 md:flex md:flex-row gap-2">

              {/* Destination */}
              <div className="col-span-2 md:col-span-1 flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/70 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/40 pointer-events-none" />
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full h-12 md:h-14 pl-10 pr-8 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 outline-none font-bold text-sm cursor-pointer appearance-none transition-colors"
                >
                  <option value="" className="bg-[#071914]">All Experiences</option>
                  {DESTINATIONS.map(d => (
                    <option key={d.value} value={d.value} className="bg-[#071914] text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-emerald-500/20 my-2" />

              {/* Date */}
              <div className="col-span-1 relative flex-shrink-0 md:w-44">
                <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/70 pointer-events-none" />
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full h-12 md:h-14 pl-9 md:pl-10 pr-2 md:pr-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 outline-none font-bold text-xs md:text-sm cursor-pointer transition-colors [color-scheme:dark]"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-emerald-500/20 my-2" />

              {/* Guests */}
              <div className="col-span-1 relative flex-shrink-0 md:w-36">
                <Users className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/70 pointer-events-none" />
                <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/40 pointer-events-none" />
                <select
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="w-full h-12 md:h-14 pl-9 md:pl-10 pr-6 md:pr-8 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 outline-none font-bold text-xs md:text-sm cursor-pointer appearance-none transition-colors"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n} className="bg-[#071914] text-white">
                      {n} Guest{n !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA — orange accent for contrast */}
              <button
                onClick={handleSearch}
                className="col-span-2 h-12 md:h-14 px-8 bg-gradient-to-r from-[#f97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f97316]/30 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 border border-[#f97316]/30"
              >
                <Search className="w-4 h-4" />
                Find Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-white/60 text-xs font-bold mt-1">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            4.9 / 5 · 48,000+ travelers
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Free cancellation up to 24h
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Instant e-ticket delivery
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 opacity-50">
        <span className="text-white text-[10px] uppercase tracking-widest font-bold">Explore</span>
        <div className="w-5 h-8 border-2 border-emerald-400/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
