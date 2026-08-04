'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import GradientProductSlider from './GradientProductSlider';
import ScrollMaskText from './ScrollMaskText';
import ParallaxImage from './ParallaxImage';

interface UnifiedGalleryProps {
  vaticanTours: any[];
  colosseumTours: any[];
  images: string[];
}

export default function UnifiedGallery({ vaticanTours, colosseumTours, images }: UnifiedGalleryProps) {
  const vaticanSectionRef = useRef<HTMLDivElement>(null);
  const colosseumSectionRef = useRef<HTMLDivElement>(null);

  // Fade-in vatican section when it enters viewport
  useEffect(() => {
    const elements = [vaticanSectionRef.current, colosseumSectionRef.current].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background">

      {/* VATICAN SECTION */}
      <section ref={vaticanSectionRef} className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">Vatican Archives</p>
            <ScrollMaskText className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none text-foreground" as="h2">
              The Eternal City
            </ScrollMaskText>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-16 max-h-[60vh] overflow-hidden rounded-3xl">
            {images.slice(0, 6).map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 1 ? 'row-span-2' : 'aspect-[3/4]'}`}>
                <Image
                  src={src}
                  alt={`Rome gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <GradientProductSlider
            title="Vatican Collection"
            subtitle="SKIP THE LINE: SISTINE CHAPEL, MUSEUMS, GARDENS."
            tours={vaticanTours}
            link="/category/vatican"
          />
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-16 md:h-24 bg-background border-y border-border" />

      {/* COLOSSEUM SECTION */}
      <section ref={colosseumSectionRef} className="relative py-24 md:py-32 overflow-hidden bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 md:mb-20 text-center">
            <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">Arena Protocol</p>
            <ScrollMaskText className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none text-foreground" as="h2">
              Ancient Power
            </ScrollMaskText>
          </div>

          <div className="relative rounded-[3rem] overflow-hidden border border-border shadow-2xl mb-16 md:mb-20">
            <ParallaxImage
              src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-c1superstar-27096007.jpg"
              alt="Colosseum Arena"
              aspectRatio="aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <GradientProductSlider
            title=""
            subtitle="COLOSSEUM ARENA, UNDERGROUND, AND ROMAN FORUM."
            tours={colosseumTours}
            link="/category/colosseum"
          />
        </div>
      </section>

    </div>
  );
}
