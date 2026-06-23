"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Star, ChevronDown, ArrowRight } from "lucide-react";

// Hero images — Vatican-focused for the 2 products
const heroSlides = [
  {
    src: "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Sistine Chapel ceiling by Michelangelo",
    location: "Sistine Chapel",
    tagline: "Michelangelo's Masterpiece",
  },
  {
    src: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Vatican Museums grand gallery",
    location: "Vatican Museums",
    tagline: "Skip the Line. See Everything.",
  },
  {
    src: "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "St. Peter's Basilica, Vatican",
    location: "Vatican City",
    tagline: "Official Vatican Access",
  },
  {
    src: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Rome eternal city landmarks",
    location: "Rome",
    tagline: "2,000 Years of History",
  },
];

const stats = [
  { value: "50,000+", label: "Travelers" },
  { value: "4.9 ★", label: "Average Rating" },
  { value: "2", label: "Vatican Tours" },
  { value: "24h", label: "Free Cancellation" },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = (index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-foreground">
      {/* Background image — crossfade */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <Image
          key={current}
          src={slide.src}
          alt={slide.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top spacing for navbar */}
        <div className="pt-24 md:pt-32" />

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl">
          <div
            className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <span className="inline-block text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">
              {slide.location}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-6">
              {slide.tagline}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed mb-8">
              Skip the queues. Experience Rome's most iconic landmarks with expert-guided tours
              and official skip-the-line access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#tours"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold text-sm uppercase tracking-widest rounded-full hover:bg-accent/90 transition-all shadow-xl shadow-accent/30 active:scale-95"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tour/vatican-museums-sistine-chapel-skip-the-line"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white/20 transition-all active:scale-95"
              >
                Skip the Line →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pb-8">
          {/* Stats row */}
          <div className="flex items-center gap-6 md:gap-12 mb-8 overflow-x-auto scrollbar-none">
            {stats.map((stat) => (
              <div key={stat.label} className="shrink-0">
                <div className="text-white font-bold text-xl md:text-2xl font-serif">{stat.value}</div>
                <div className="text-white/50 text-xs uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Slide indicators + scroll cue */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-8 h-1.5 bg-accent"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <ChevronDown className="w-4 h-4 animate-bounce" />
              <span className="uppercase tracking-widest hidden sm:block">Scroll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badge — floating bottom right */}
      <div className="absolute bottom-8 right-4 sm:right-8 z-20 hidden md:block">
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl px-5 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[41, 42, 43].map((n) => (
                <div key={n} className="w-8 h-8 rounded-full border-2 border-card overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/64?img=${n}`}
                    alt="Traveler"
                    width={32}
                    height={32}
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium">3,000+ verified reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
