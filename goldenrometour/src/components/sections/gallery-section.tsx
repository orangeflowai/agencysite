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
    { src: "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Sistine Chapel Michelangelo ceiling",   title: "Sistine Chapel",       href: "/#tours" },
    { src: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Vatican Museums galleries",             title: "Vatican Museums",      href: "/#tours" },
    { src: "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "St. Peter's Basilica dome",             title: "St. Peter's Basilica", href: "/#tours" },
    { src: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200",   alt: "Colosseum Rome at golden hour",         title: "Eternal Rome",         href: "/#tours" },
    { src: "https://images.pexels.com/photos/1174136/pexels-photo-1174136.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Roman Forum ancient ruins",             title: "Ancient History",      href: "/#tours" },
    { src: "https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Trevi Fountain Rome",                   title: "Trevi Fountain",       href: "/#tours" },
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
          Vatican Treasures
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore the world's greatest art collection
        </p>
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
