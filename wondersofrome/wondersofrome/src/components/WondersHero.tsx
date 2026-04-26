'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const videoUrl = settings?.heroVideo?.asset?.url || R2_HERO_VIDEO;
  const imageUrl = settings?.heroImage?.asset?.url || `${R2_BASE}/pexels-giorgi-gobadze-2160475859-36770780.jpg`;

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline preload="auto"
          className="w-full h-full object-cover"
          poster={imageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Fallback image for slow connections */}
        <Image src={imageUrl} alt="Rome" fill className="object-cover -z-10" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex flex-col items-start justify-center min-h-screen">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            Rome's Premier Tour Operator
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-serif font-black leading-[0.9] tracking-tighter italic uppercase mb-6"
          >
            {settings?.heroTitle || <>Discover<br />Rome</>}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg text-white/75 max-w-md leading-relaxed mb-10"
          >
            {settings?.heroSubtitle || 'Skip-the-line access to the Vatican, Colosseum & hidden gems — with expert historian guides.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-full uppercase tracking-widest text-sm transition-all shadow-2xl shadow-primary/30 hover:-translate-y-0.5 active:scale-95"
            >
              Book Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/category/vatican"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-full uppercase tracking-widest text-sm transition-all"
            >
              Vatican Tours
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-10"
          >
            <div className="flex -space-x-2">
              {[11,12,13,14].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="" className="w-8 h-8 rounded-full border-2 border-white/30 object-cover" />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white/70 text-xs font-medium">50,000+ happy travelers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
