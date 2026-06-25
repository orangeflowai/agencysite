"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const words = ["ROMAN", "VATICAN", "COLOSSEUM", "TOURS"];

const sideImages = [
  {
    src: "/images/vatican-sistine.jpg",
    alt: "Sistine Chapel",
    position: "left",
    span: 1,
  },
  {
    src: "/images/st-peters.jpg",
    alt: "St. Peter's Dome",
    position: "left",
    span: 1,
  },
  {
    src: "/images/colosseum-night.jpg",
    alt: "Colosseum Underground",
    position: "right",
    span: 1,
  },
  {
    src: "/images/rome-hero.jpg",
    alt: "Arena Floor",
    position: "right",
    span: 1,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    // Cycle words
    const interval = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  const centerWidth = 100 - (imageProgress * 58);
  const centerHeight = 100 - (imageProgress * 30);
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div 
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px`, paddingBottom: `${60 + (imageProgress * 40)}px` }}
          >
            
            {/* Left Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative overflow-hidden will-change-transform"
                  style={{
                    flex: img.span,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Hero Image - Center */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <Image
                src="/images/rome-hero.jpg"
                alt="The Vatican at Night"
                fill
                className="object-cover"
                priority
              />
              
              {/* Dynamic Word Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: textOpacity }}
              >
                <h1 className="text-[15vw] font-black tracking-tighter text-white drop-shadow-2xl">
                  {words[currentWordIdx]}
                </h1>
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative overflow-hidden will-change-transform"
                  style={{
                    flex: img.span,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="h-[100vh]" />

      {/* Tagline Section */}
      <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground">ROMAN VATICAN</h2>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Skip the line. Experience history.
          <br />
          Official priority access to the Vatican and Colosseum.
        </p>
        <div className="mt-12">
            <Link href="/search" className="px-12 py-5 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:scale-105 transition-transform inline-block">
                Book Now
            </Link>
        </div>
      </div>
    </section>
  );
}
