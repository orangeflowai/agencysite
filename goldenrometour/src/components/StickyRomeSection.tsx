'use client';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function StickyRomeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / totalScrollable));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const imageScale = 1 - progress * 0.1;
  const text1Opacity = Math.max(0, 1 - progress / 0.3);
  const text2Opacity = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) / 0.4);
  const text2Y = progress < 0.4 ? 50 : Math.max(0, 50 - ((progress - 0.4) / 0.4) * 50);

  return (
    <div ref={containerRef} className="relative h-[250vh]">

      {/* STICKY BACKGROUND */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div style={{ transform: `scale(${imageScale})`, transition: 'transform 0.1s linear' }} className="relative h-full w-full">
          {/* Layer 1: Crowded — fades out */}
          <div style={{ opacity: text1Opacity }} className="absolute inset-0 z-10">
            <Image
              src="https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Crowded Rome streets"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Layer 2: Vatican — revealed underneath */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Vatican Museums interior"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      </div>

      {/* SCROLLING FOREGROUND CONTENT */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">

        {/* Section 1: Rome is Chaotic */}
        <div className="h-screen flex items-center justify-center sticky top-0">
          <div style={{ opacity: text1Opacity }} className="text-center z-20 px-4">
            <h2 className="font-serif text-5xl md:text-[10rem] font-bold text-white mb-8 tracking-tight drop-shadow-2xl leading-[0.85]">
              Rome is<br /> Chaotic.
            </h2>
            <p className="text-sm md:text-base text-white/70 font-medium">
              Your experience should be curated.
            </p>
          </div>
        </div>

        {/* Section 2: Book Now */}
        <div className="h-screen flex items-center justify-center sticky top-0">
          <div
            style={{ opacity: text2Opacity, transform: `translateY(${text2Y}px)`, transition: 'transform 0.1s linear' }}
            className="max-w-4xl text-center z-20 px-4"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 drop-shadow-lg leading-tight">
              Experience the<br className="hidden md:block" /> Eternal City, Unlocked.
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-4 pointer-events-auto">
              <Link
                href="/#tours"
                className="bg-accent text-foreground px-10 py-4 font-bold text-sm rounded-full hover:bg-accent/90 transition-colors shadow-xl"
              >
                Browse All Tours
              </Link>
              <Link
                href="/tour/vatican-museums-and-sistine-chapel-guided-tour"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-4 font-bold text-sm rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Vatican Guided Tour
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
