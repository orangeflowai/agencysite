'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface Tour {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  category: string;
  duration: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  groupSize?: string;
}

interface GradientProductSliderProps {
  title: string;
  subtitle?: string;
  tours: Tour[];
  link?: string;
}

const CATEGORY_COLORS: Record<string, { primary: string; secondary: string }> = {
  vatican: { primary: '#064034', secondary: '#C4A96A' },
  colosseum: { primary: '#B5422A', secondary: '#393B0B' },
  city: { primary: '#064034', secondary: '#D9C9A3' },
  default: { primary: '#064034', secondary: '#C4A96A' },
};

export default function GradientProductSlider({ title, subtitle, tours, link }: GradientProductSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Background Gradient Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const activeTour = tours[activeIndex];
      const colors = CATEGORY_COLORS[activeTour?.category || 'default'];

      // Draw two large radial gradients that move slightly
      const x1 = width * (0.5 + Math.sin(time * 0.5) * 0.2);
      const y1 = height * (0.5 + Math.cos(time * 0.3) * 0.2);
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, width * 0.8);
      g1.addColorStop(0, colors.primary + '33'); // 20% opacity
      g1.addColorStop(1, 'transparent');

      const x2 = width * (0.5 + Math.cos(time * 0.4) * 0.2);
      const y2 = height * (0.5 + Math.sin(time * 0.6) * 0.2);
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, width * 0.6);
      g2.addColorStop(0, colors.secondary + '22'); // 13% opacity
      g2.addColorStop(1, 'transparent');

      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex, tours]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollLeft;
    const cardWidth = 340; // Approx card width + gap
    const index = Math.round(scrollPos / cardWidth);
    if (index !== activeIndex && index >= 0 && index < tours.length) {
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden min-h-[800px] flex flex-col justify-center">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="container mx-auto px-6 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">Curated Collection</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none mb-6">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm font-mono font-bold tracking-widest opacity-60 uppercase">
                {subtitle}
              </p>
            )}
          </div>
          {link && (
            <Link href={link} className="group flex items-center gap-3 font-bold tracking-[0.2em] text-[10px] text-foreground hover:text-primary transition-colors">
              <span>View Directory</span>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        className="flex gap-8 px-[10%] overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-20 scroll-smooth items-center"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {tours.map((tour, index) => {
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={tour._id}
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 0.9,
                opacity: isActive ? 1 : 0.7,
                rotateY: isActive ? 0 : (index < activeIndex ? 15 : -15),
                z: isActive ? 100 : 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex-shrink-0 w-[300px] md:w-[380px] scroll-snap-align-center perspective-1000"
              style={{ scrollSnapAlign: 'center' }}
            >
              <Link href={`/tour/${tour.slug?.current || '#'}`} className="block">
                <div className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 bg-card shadow-2xl group ${isActive ? 'border-primary' : 'border-border'}`}>
                  <Image
                    src={tour.mainImage?.asset?.url || tour.mainImage || 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-alex-250137-757239.jpg'}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="space-y-4">
                      <span className={`inline-block px-3 py-1 rounded-full backdrop-blur-md border text-[8px] font-bold tracking-widest uppercase transition-colors duration-500 ${isActive ? 'bg-primary border-white/20' : 'bg-white/10 border-white/20'}`}>
                        {tour.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight">
                        {tour.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest opacity-90 pt-2">
                        <div className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {tour.duration}</div>
                        <div className="flex items-center gap-1.5"><Star size={12} className="text-primary fill-primary" /> {tour.rating || '5.0'}</div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] opacity-60 tracking-widest uppercase">Official Rate</span>
                            <span className="text-xl font-serif font-bold tracking-tighter">€{tour.price}</span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-white' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
                            <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
