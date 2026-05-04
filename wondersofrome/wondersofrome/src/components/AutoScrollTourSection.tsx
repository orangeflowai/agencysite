'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled through all cards
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [validTours.length]);

  const bgColor = category === 'vatican' ? 'bg-background' : 'bg-card';
  const labelColor = category === 'vatican' ? 'Vatican Collection' : 'Colosseum Collection';

  return (
    <section className={`py-16 md:py-24 ${bgColor} border-b border-border`}>
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

      {/* Auto-scrolling container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-hidden px-4 sm:px-6 lg:px-8"
        style={{ scrollBehavior: 'auto' }}
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
          display: none;
        }
      `}</style>
    </section>
  );
}
