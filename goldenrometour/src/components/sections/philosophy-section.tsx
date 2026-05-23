"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
      {/* Scroll-Animated Vatican Showcase */}
      <div ref={sectionRef} className="relative" style={{ height: "150vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
            {/* Title */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Vatican Museums.
              </h2>
            </div>

            {/* Vatican Showcase - Single Large Image */}
            <div className="relative z-10">
              <div 
                className="relative aspect-[16/9] overflow-hidden rounded-3xl cursor-pointer shadow-2xl"
                style={{
                  transform: `scale(${0.85 + (1 - titleOpacity) * 0.15})`,
                  opacity: 0.3 + (1 - titleOpacity) * 0.7,
                }}
                onClick={() => document.getElementById('vatican')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Image
                  src="/images/st-peters.jpg"
                  alt="Vatican Museums & Sistine Chapel"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-white text-3xl font-semibold mb-3">
                    Vatican Museums & Sistine Chapel
                  </h3>
                  <p className="text-white/90 text-lg mb-4">
                    Skip-the-Line Access • Expert Guided Tours
                  </p>
                  <span className="inline-block backdrop-blur-md px-6 py-3 text-sm font-medium rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                    Explore Tours →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Official Vatican Access
          </p>
          <p className="mt-8 leading-relaxed text-muted-foreground text-3xl">
            Bypass 2-3 hour queues with authenticated priority vouchers. 
            Choose independent exploration or expert-guided experiences led by accredited art historians.
          </p>
        </div>
      </div>
    </section>
  );
}
