'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SUPABASE_BUCKET_URL = 'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images';
const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

// Best available video from R2 — use as hero background
const R2_HERO_VIDEO = `${R2_BASE}/Video_Generation_Complete.mp4`;

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
  const [destination, setDestination] = useState('Vatican Museums');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);

  const videoUrl = settings?.heroVideo?.asset?.url || R2_HERO_VIDEO;
  const imageUrl = settings?.heroImage?.asset?.url || `${R2_BASE}/pexels-giorgi-gobadze-2160475859-36770780.jpg`;
  const title = settings?.heroTitle;
  const subtitle = settings?.heroSubtitle;

  const handleSearch = () => {
    const query = encodeURIComponent(destination);
    const dateParam = date ? `&date=${date}` : '';
    router.push(`/search?q=${query}${dateParam}&guests=${guests}`);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline preload="auto"
          className="w-full h-full object-cover opacity-90"
          poster={imageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="space-y-6">
          <h2 className="text-white/90 text-sm md:text-base tracking-[0.2em]  font-bold">
            Official Rome Tour Operator
          </h2>

          {title ? (
            <h1 className="text-5xl md:text-7xl lg:text-9xl text-white font-bold tracking-tighter drop-shadow-xl ">
              {title}
            </h1>
          ) : (
            <h1 className="text-5xl md:text-7xl lg:text-9xl text-white font-bold tracking-tighter drop-shadow-xl">
              THE ETERNAL CITY,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400 ">
                UNLOCKED.
              </span>
            </h1>
          )}

          <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            {subtitle || 'Skip-the-line access to Vatican, Colosseum & Rome\'s greatest wonders. Expert guides, instant confirmation.'}
          </p>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-primary hover:opacity-90 text-white px-8 py-4 rounded-full font-bold  tracking-widest transition-all text-sm md:text-base shadow-lg hover:shadow-primary/50 hover:scale-105"
            >
              Explore All Tours
            </Link>
            <Link
              href="/private-tours"
              className="bg-card/10 backdrop-blur-md border border-white/30 hover:bg-card hover:text-foreground text-white px-8 py-4 rounded-full font-bold  tracking-widest transition-all text-sm md:text-base hover:scale-105"
            >
              View Private Tours
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/50 mx-auto mb-2" />
        <span className="text-[10px]  tracking-widest">Scroll</span>
      </div>
    </section>
  );
}
