"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef<number | null>(null);

  const images = [
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome-hero.jpg",         alt: "Colosseum at sunset",      title: "Colosseum",      href: "/category/colosseum" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/vatican-sistine.jpg",   alt: "Sistine Chapel ceiling",   title: "Sistine Chapel", href: "/category/vatican" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/trevi-fountain.jpg",    alt: "Trevi Fountain at dusk",   title: "Trevi Fountain", href: "/category/city" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/pantheon.jpg",          alt: "Pantheon interior",        title: "Pantheon",       href: "/category/city" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/st-peters.jpg",         alt: "St. Peter's Basilica",     title: "St. Peter's",    href: "/category/vatican" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/roman-forum.jpg",       alt: "Roman Forum ruins",        title: "Roman Forum",    href: "/category/colosseum" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/trastevere.jpg",        alt: "Trastevere streets",       title: "Trastevere",     href: "/category/hidden-gems" },
    { src: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/colosseum-night.jpg",   alt: "Colosseum at night",       title: "Night Tour",     href: "/category/colosseum" },
  ];

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const totalHeight = viewportHeight + (containerWidth - viewportWidth);
      setSectionHeight(`${totalHeight}px`);
    };

    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const updateTransform = useCallback(() => {
    if (!galleryRef.current || !containerRef.current) return;
    
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    const totalScrollDistance = containerWidth - viewportWidth;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / totalScrollDistance);
    const newTranslateX = progress * -totalScrollDistance;
    
    setTranslateX(newTranslateX);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransform]);

  return (
    <section 
      id="gallery"
      ref={galleryRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      {/* Section Title */}
      <div className="absolute top-8 left-6 z-10 md:left-12 lg:left-20">
        <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Discover Rome
        </h2>
      </div>

      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          {/* Horizontal scrolling container */}
          <div 
            ref={containerRef}
            className="flex gap-6 px-6 pt-16"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              WebkitTransform: `translate3d(${translateX}px, 0, 0)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
              touchAction: 'pan-y',
            }}
          >
            {images.map((image, index) => (
              <Link
                key={index}
                href={image.href}
                className="group relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw] block"
                style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <span className="text-white text-2xl font-medium">{image.title}</span>
                  <span className="text-white/80 text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    View Tours →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
