'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pause, Play } from 'lucide-react';
import TourCard from './TourCard';
import type { Tour } from '@/lib/dataAdapter';

interface AutoScrollTourSectionProps {
  title: string;
  subtitle?: string;
  tours: Tour[];
  link?: string;
  category: 'vatican' | 'colosseum';
}

export default function AutoScrollTourSection({ 
  title, 
  subtitle, 
  tours, 
  link,
  category 
}: AutoScrollTourSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Filter out tours without valid slugs
  const validTours = tours.filter(tour => tour.slug?.current);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || validTours.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const cardWidth = 400; // approximate card width + gap
    const totalWidth = cardWidth * validTours.length;

    const animate = () => {
      if (!isPaused && !isHovering) {
        scrollPosition += scrollSpeed;
        
        // Reset when we've scrolled through all cards
        if (scrollPosition >= totalWidth) {
          scrollPosition = 0;
        }
        
        container.scrollLeft = scrollPosition;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [validTours.length, isPaused, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const bgColor = category === 'vatican' ? 'bg-background' : 'bg-card';
  const labelColor = category === 'vatican' ? 'Vatican Collection' : 'Colosseum Collection';

  // Don't render if no valid tours
  if (validTours.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 md:py-24 ${bgColor} border-b border-border relative`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">
              {labelColor}
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm font-medium tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Manual Scroll Control Button */}
            <button
              onClick={togglePause}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shrink-0"
              aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            {link && (
              <Link 
                href={link} 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[10px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0"
              >
                View All <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Auto-scrolling container with manual scroll support */}
      <div 
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Duplicate tours for seamless loop */}
        {[...validTours, ...validTours].map((tour, index) => (
          <div 
            key={`${tour._id}-${index}`} 
            className="flex-shrink-0 w-[340px] md:w-[380px]"
          >
            <TourCard tour={tour} />
          </div>
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          height: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
          opacity: 0.5;
        }
        div::-webkit-scrollbar-thumb:hover {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
