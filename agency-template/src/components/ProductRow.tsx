'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import TourCard from './TourCard';
 
import { TourProduct } from '@/lib/toursData';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link }) => {
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

                // Reset to start if reached end (loop effect requires duplication, but basic scroll reset is simpler)
                // For a true infinite loop, we'd need to duplicate items. 
                // Let's implement a "ping-pong" or just simple reset for now.
                // Or better: if (scrollLeft + clientWidth >= scrollWidth) scrollLeft = 0;

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
        <section className="border-b border-transparent last:border-b-0 overflow-hidden">
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
                    className="flex items-stretch overflow-x-auto pb-8 px-4 md:px-0 gap-6 md:gap-8 scrollbar-hide no-scrollbar"
                    style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
                >
                    {/* Padding for mobile centering feel */}
                    <div className="w-2 shrink-0 md:hidden"></div>

                    {tours.map((tour) => (
                        <div key={tour._id || tour.id} className="w-[85vw] md:w-[380px] shrink-0 h-auto flex flex-col transform transition-transform duration-300">
                            <TourCard tour={tour} />
                        </div>
                    ))}

                    <div className="w-2 shrink-0 md:hidden"></div>
                </div>
            </div>

            <div className="text-center">
                {link && (
                    <Link href={link} className="inline-block border-2 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-[0.2em] py-4 px-10 rounded-full transition-all text-sm">
                        Explore All {title}
                    </Link>
                )}
            </div>
        </section>
    );
};

export default ProductRow;
