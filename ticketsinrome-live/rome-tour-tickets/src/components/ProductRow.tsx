'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import TourCard from './TourCard';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link }) => {
    const scrollRef    = useRef<HTMLDivElement>(null);
    const rafRef       = useRef<number>(0);
    const pausedRef    = useRef(false);   // paused by hover/touch
    const visibleRef   = useRef(false);   // only animate when on screen
    const sectionRef   = useRef<HTMLElement>(null);

    // Intersection Observer — only run rAF when section is visible
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { visibleRef.current = entry.isIntersecting; },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Auto-scroll — throttled to ~30fps, only when visible and not paused
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let lastTime = 0;
        const INTERVAL = 33; // ~30fps instead of 60fps

        const tick = (now: number) => {
            rafRef.current = requestAnimationFrame(tick);
            if (!visibleRef.current || pausedRef.current) return;
            if (now - lastTime < INTERVAL) return;
            lastTime = now;

            container.scrollLeft += 0.6;
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) {
                container.scrollLeft = 0;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [tours]);

    const pause   = useCallback(() => { pausedRef.current = true; },  []);
    const resume  = useCallback(() => { pausedRef.current = false; }, []);

    if (!tours || tours.length === 0) return null;

    return (
        <section ref={sectionRef} className="border-b border-transparent last:border-b-0 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 md:mb-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-6xl font-black text-black mb-4 md:mb-6 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-gray-500 text-lg md:text-2xl font-light leading-snug">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div
                className="relative mb-12 md:mb-20"
                onMouseEnter={pause}
                onMouseLeave={resume}
                onTouchStart={pause}
                onTouchEnd={resume}
            >
                <div
                    ref={scrollRef}
                    className="flex items-stretch overflow-x-auto pb-8 px-4 md:px-0 gap-6 md:gap-8 scrollbar-hide no-scrollbar"
                    style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="w-2 shrink-0 md:hidden" />
                    {tours.map((tour) => (
                        <div
                            key={tour._id || tour.id}
                            className="w-[85vw] md:w-[380px] shrink-0 h-auto flex flex-col"
                        >
                            <TourCard tour={tour} />
                        </div>
                    ))}
                    <div className="w-2 shrink-0 md:hidden" />
                </div>
            </div>

            {link && (
                <div className="text-center">
                    <Link
                        href={link}
                        className="inline-block border-2 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-[0.2em] py-4 px-10 rounded-full transition-all text-sm"
                    >
                        Explore All {title}
                    </Link>
                </div>
            )}
        </section>
    );
};

export default ProductRow;
