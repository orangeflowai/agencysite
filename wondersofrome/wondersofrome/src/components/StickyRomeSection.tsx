'use client';

import Link from 'next/link';
import Image from 'next/image';

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

export default function StickyRomeSection() {
  return (
    <section className="relative">
      {/* Panel 1 — Chaotic Rome */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={`${R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg`}
          alt="Crowded Rome"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter leading-none drop-shadow-2xl">
            ROME IS CHAOTIC.
          </h2>
          <p className="text-lg sm:text-2xl text-white/80 font-light tracking-widest ">
            Your trip shouldn&apos;t be.
          </p>
        </div>
      </div>

      {/* Panel 2 — Serene Vatican */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={`${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`}
          alt="Serene Vatican"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/55" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif  text-white leading-tight drop-shadow-lg">
            &ldquo;Experience the Eternal City,<br />Unlocked.&rdquo;
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/search"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold  tracking-widest text-sm transition-all shadow-xl"
            >
              Book Your Experience
            </Link>
            <Link
              href="/private-tours"
              className="bg-card/10 hover:bg-card/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold  tracking-widest text-sm transition-all"
            >
              Private Tours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
