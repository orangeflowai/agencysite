'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TourCard from './TourCard';

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
                container.scrollLeft += 0.5;
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, tours]);

    if (!tours || tours.length === 0) return null;

    return (
        <section className="py-24 overflow-hidden bg-soft-blue">
            <div className="container mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-sky-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.25em] mb-6 shadow-sm"
                        >
                            Exclusive Routes
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-stone-950 mb-6 tracking-tight leading-[0.95]"
                        >
                            {title}<br />
                            <span className="text-sky-500 italic">Selection.</span>
                        </motion.h2>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-stone-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                    
                    {link && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href={link} className="inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] text-[10px] text-sky-500 hover:text-stone-950 transition-colors group">
                                <span>Browse category</span>
                                <div className="w-10 h-10 rounded-full border border-sky-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scroll Container */}
            <div
                className="relative cursor-grab pb-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex items-stretch overflow-x-auto no-scrollbar gap-8 px-6 lg:px-[8vw] scroll-smooth"
                >
                    {tours.map((tour, index) => (
                        <motion.div 
                            key={tour._id || tour.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="w-[85vw] md:w-[420px] shrink-0"
                        >
                            <TourCard tour={tour} />
                        </motion.div>
                    ))}
                    {/* Padding dummy */}
                    <div className="w-2 md:w-[8vw] shrink-0" />
                </div>
            </div>
        </section>
    );
};

export default ProductRow;
