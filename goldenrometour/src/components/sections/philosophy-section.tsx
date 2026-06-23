"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Clock, Users, ArrowRight } from "lucide-react";

// Fallback images per category — cards are never blank
const CATEGORY_FALLBACKS: Record<string, string> = {
  vatican: "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=800",
  colosseum: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800",
  city: "https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=800",
  "hidden-gems": "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800",
};
const DEFAULT_FALLBACK = "https://images.pexels.com/photos/1174136/pexels-photo-1174136.jpeg?auto=compress&cs=tinysrgb&w=800";

function getTourImage(tour: Tour): string {
  const url = tour.mainImage?.asset?.url || tour.mainImage;
  if (url && typeof url === "string" && url.startsWith("http")) return url;
  return CATEGORY_FALLBACKS[tour.category || ""] || DEFAULT_FALLBACK;
}

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

  // Show up to 4 tours in the animated reveal section
  const featuredTours = tours.slice(0, 4);
  const leftTours = featuredTours.filter((_, i) => i % 2 === 0);
  const rightTours = featuredTours.filter((_, i) => i % 2 === 1);

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
                Discover Rome.
              </h2>
            </div>

            {/* Tour Cards Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                {leftTours.map((tour, idx) => (
                  <Link
                    key={tour._id}
                    href={`/tour/${tour.slug.current}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                    style={{
                      transform: `translate3d(${leftTranslateX}%, 0, 0)`,
                      WebkitTransform: `translate3d(${leftTranslateX}%, 0, 0)`,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transitionDelay: `${idx * 50}ms`,
                    }}
                  >
                    <Image
                      src={getTourImage(tour)}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      {tour.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-xs font-bold text-white">{tour.rating}</span>
                            <span className="text-xs text-white/80">({tour.reviewCount || 0})</span>
                          </div>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-white mb-3 leading-tight">{tour.title}</h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{tour.duration}</span></div>
                        {tour.groupSize && <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{tour.groupSize}</span></div>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-white/70">From</span>
                          <div className="text-3xl font-bold text-primary">€{tour.price}</div>
                        </div>
                        <span className="inline-flex items-center gap-2 backdrop-blur-md px-5 py-2.5 text-sm font-medium rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                          Book Now <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4">
                {rightTours.map((tour, idx) => (
                  <Link
                    key={tour._id}
                    href={`/tour/${tour.slug.current}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                    style={{
                      transform: `translate3d(${rightTranslateX}%, 0, 0)`,
                      WebkitTransform: `translate3d(${rightTranslateX}%, 0, 0)`,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transitionDelay: `${idx * 50}ms`,
                    }}
                  >
                    <Image
                      src={getTourImage(tour)}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      {tour.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-xs font-bold text-white">{tour.rating}</span>
                            <span className="text-xs text-white/80">({tour.reviewCount || 0})</span>
                          </div>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-white mb-3 leading-tight">{tour.title}</h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{tour.duration}</span></div>
                        {tour.groupSize && <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{tour.groupSize}</span></div>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-white/70">From</span>
                          <div className="text-3xl font-bold text-primary">€{tour.price}</div>
                        </div>
                        <span className="inline-flex items-center gap-2 backdrop-blur-md px-5 py-2.5 text-sm font-medium rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                          Book Now <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
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
