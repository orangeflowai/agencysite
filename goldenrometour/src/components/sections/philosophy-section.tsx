"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Clock, Users, ArrowRight } from "lucide-react";

interface Tour {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  price: number;
  duration: string;
  description?: any;
  rating?: number;
  reviewCount?: number;
  groupSize?: string;
}

interface PhilosophySectionProps {
  tours: Tour[];
}

export function PhilosophySection({ tours }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [leftTranslateX, setLeftTranslateX] = useState(-100);
  const [rightTranslateX, setRightTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  // Get the 2 Vatican tours (skip-the-line and guided)
  const vaticanTours = tours.slice(0, 2);
  const leftTour = vaticanTours[0];
  const rightTour = vaticanTours[1];

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    setLeftTranslateX((1 - progress) * -100);
    setRightTranslateX((1 - progress) * 100);
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
      {/* Scroll-Animated 2 Vatican Tours */}
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            {/* Title */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Vatican Museums.
              </h2>
            </div>

            {/* Tour Cards Grid - 2 Tours from Sanity */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Left Tour - Skip-the-Line */}
              {leftTour && (
                <Link
                  href={`/tour/${leftTour.slug.current}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                  style={{
                    transform: `translate3d(${leftTranslateX}%, 0, 0)`,
                    WebkitTransform: `translate3d(${leftTranslateX}%, 0, 0)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <Image
                    src={leftTour.mainImage?.asset?.url || leftTour.mainImage || "/images/st-peters.jpg"}
                    alt={leftTour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Tour Info Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Rating */}
                    {leftTour.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-bold text-white">{leftTour.rating}</span>
                          <span className="text-xs text-white/80">({leftTour.reviewCount || 0})</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-white mb-3 leading-tight">
                      {leftTour.title}
                    </h3>
                    
                    {/* Details */}
                    <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{leftTour.duration}</span>
                      </div>
                      {leftTour.groupSize && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{leftTour.groupSize}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-white/70">From</span>
                        <div className="text-3xl font-bold text-primary">€{leftTour.price}</div>
                      </div>
                      <span className="inline-flex items-center gap-2 backdrop-blur-md px-6 py-3 text-sm font-medium rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                        Book Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Right Tour - Guided */}
              {rightTour && (
                <Link
                  href={`/tour/${rightTour.slug.current}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                  style={{
                    transform: `translate3d(${rightTranslateX}%, 0, 0)`,
                    WebkitTransform: `translate3d(${rightTranslateX}%, 0, 0)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <Image
                    src={rightTour.mainImage?.asset?.url || rightTour.mainImage || "/images/vatican-sistine.jpg"}
                    alt={rightTour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Tour Info Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Rating */}
                    {rightTour.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-bold text-white">{rightTour.rating}</span>
                          <span className="text-xs text-white/80">({rightTour.reviewCount || 0})</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-white mb-3 leading-tight">
                      {rightTour.title}
                    </h3>
                    
                    {/* Details */}
                    <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{rightTour.duration}</span>
                      </div>
                      {rightTour.groupSize && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{rightTour.groupSize}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-white/70">From</span>
                        <div className="text-3xl font-bold text-primary">€{rightTour.price}</div>
                      </div>
                      <span className="inline-flex items-center gap-2 backdrop-blur-md px-6 py-3 text-sm font-medium rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                        Book Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}
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
