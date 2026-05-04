'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import TourCard from './TourCard';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { TourProduct } from '@/lib/toursData';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
    dark?: boolean;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link, dark = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let animationFrameId: number;

        const scroll = () => {
            if (!isHovered && container) {
                // Slow scroll speed
                container.scrollLeft += 0.5;

                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                    container.scrollLeft = 0; // Snap back to start
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, tours]); // Re-run if tours change

    if (!tours || tours.length === 0) return null;

    return (
        <section className={`border-b border-transparent last:border-b-0 overflow-hidden font-sans ${dark ? 'dark bg-neutral-900' : ''}`}>
            <div className="container mx-auto px-4 mb-8 md:mb-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className={`text-3xl md:text-6xl font-serif font-bold mb-4 md:mb-6 tracking-tighter   ${dark ? 'text-white' : 'text-foreground'}`}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className={`text-lg md:text-xl font-sans font-medium leading-snug  tracking-[0.2em] ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Scroll Container */}
            <div
                className="relative mb-12 md:mb-20"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex items-stretch overflow-x-auto pb-12 px-4 md:px-0 gap-6 md:gap-8 scrollbar-hide no-scrollbar"
                    style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
                >
                    {/* Padding for mobile centering feel */}
                    <div className="w-2 shrink-0 md:hidden"></div>

                    {tours.map((tour) => (
                        <div key={tour._id || tour.id} className="w-[85vw] md:w-[400px] shrink-0 h-auto flex flex-col transform transition-transform duration-300">
                            <TourCard tour={tour} />
                        </div>
                    ))}

                    <div className="w-2 shrink-0 md:hidden"></div>
                </div>
            </div>

            <div className="text-center">
                {link && (
                    <Link href={link} className="inline-block bg-primary text-white hover:brightness-110 font-bold  tracking-[0.25em] py-4 px-12 rounded-[var(--radius)] shadow-lg shadow-primary/20 transition-all text-[10px]">
                        Explore Full Directory
                    </Link>
                )}
            </div>
        </section>
    );
};

export default ProductRow;
