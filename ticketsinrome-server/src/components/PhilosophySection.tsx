"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [vaticanTranslateX, setVaticanTranslateX] = useState(-100);
  const [colosseumTranslateX, setColosseumTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    setVaticanTranslateX((1 - progress) * -100);
    setColosseumTranslateX((1 - progress) * 100);
    setTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms]);

  return (
    <section id="tours" className="bg-background">
      {/* Scroll-Animated Product Grid */}
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            {/* Title */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Vatican & Colosseum.
              </h2>
            </div>

            {/* Tour Cards Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Vatican Tour */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  transform: `translate3d(${vaticanTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${vaticanTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                onClick={() => window.location.href = '/category/vatican'}
              >
                <Image
                  src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/extend_this_image_202604281706.jpeg"
                  alt="St. Peter's Basilica Vatican"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(6,64,52,0.9)] text-white">
                    Vatican Tours — Explore Now →
                  </span>
                </div>
              </div>

              {/* Colosseum Tour */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  transform: `translate3d(${colosseumTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${colosseumTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                onClick={() => window.location.href = '/category/colosseum'}
              >
                <Image
                  src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/extend_this_imgae_202604281701.jpeg"
                  alt="Colosseum illuminated at night"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(6,64,52,0.9)] text-white">
                    Colosseum Tours — Explore Now →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
