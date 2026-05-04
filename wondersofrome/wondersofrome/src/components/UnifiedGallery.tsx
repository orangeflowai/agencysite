'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GradientProductSlider from './GradientProductSlider';
import ScrollMaskText from './ScrollMaskText';
import ParallaxImage from './ParallaxImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UnifiedGalleryProps {
  vaticanTours: any[];
  colosseumTours: any[];
  images: string[];
}

export default function UnifiedGallery({ vaticanTours, colosseumTours, images }: UnifiedGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vaticanSectionRef = useRef<HTMLDivElement>(null);
  const colosseumSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. VATICAN SEQUENCE: Grid Zoom -> Reveal Slider
    const vaticanTl = gsap.timeline({
      scrollTrigger: {
        trigger: vaticanSectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
      }
    });

    vaticanTl
      .to(".vatican-grid", { scale: 1.8, opacity: 0, ease: "none" }, 0)
      .to(".vatican-title", { opacity: 0, y: -100, ease: "none" }, 0)
      .from(".vatican-slider-wrap", { y: "50vh", opacity: 0, ease: "none" }, 0.5)
      .to(".vatican-slider-wrap", { y: 0, opacity: 1, ease: "none" }, 1);

    // 2. COLOSSEUM SEQUENCE: Parallax Mask Reveal
    const colosseumTl = gsap.timeline({
      scrollTrigger: {
        trigger: colosseumSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    colosseumTl.from(".colosseum-reveal-bg", {
      scale: 1.2,
      yPercent: -20,
      ease: "none"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background">
      
      {/* VATICAN CINEMATIC SEQUENCE */}
      <section ref={vaticanSectionRef} className="relative h-screen overflow-hidden">
        {/* The Zooming Grid */}
        <div className="vatican-grid absolute inset-0 z-10 grid grid-cols-3 gap-8 p-12 pointer-events-none">
          {images.slice(0, 9).map((src, i) => (
            <div key={i} className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ${i === 4 ? 'border-4 border-primary' : ''}`}>
              <img src={src} alt="Rome" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Intro Text */}
        <div className="vatican-title absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-6xl md:text-9xl font-serif font-bold text-white drop-shadow-2xl tracking-tighter leading-none">
            UNFOLD THE<br/><span className="text-primary italic">ETERNAL</span>
          </h2>
          <p className="text-white/60 font-mono text-xs tracking-[0.5em] mt-8 uppercase">Deep Dive: Vatican Archives</p>
        </div>

        {/* Revealed Slider */}
        <div className="vatican-slider-wrap absolute inset-0 z-30 flex flex-col justify-center bg-background/80 backdrop-blur-xl">
           <GradientProductSlider 
            title="Vatican Collection" 
            subtitle="SKIP THE LINE: SISTINE CHAPEL, MUSEUMS, GARDENS." 
            tours={vaticanTours} 
            link="/category/vatican" 
          />
        </div>
      </section>

      {/* TRANSITION SPACER */}
      <div className="h-16 md:h-24 bg-background border-y border-border" />

      {/* COLOSSEUM SEQUENCE */}
      <section ref={colosseumSectionRef} className="relative py-24 md:py-32 overflow-hidden bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 md:mb-20 text-center">
            <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">Arena Protocol</p>
            <ScrollMaskText className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none text-foreground" as="h2">
              Ancient Power
            </ScrollMaskText>
          </div>
          
          <div className="relative rounded-[3rem] overflow-hidden border border-border shadow-2xl mb-16 md:mb-20 colosseum-reveal-bg">
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
