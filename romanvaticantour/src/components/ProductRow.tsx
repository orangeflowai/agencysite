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
        <section className={`py-24 overflow-hidden ${dark ? 'bg-[#1A3626] text-[#F5F0E8]' : 'bg-[#F5F0E8] text-[#1A3626]'}`}>
            <div className="container mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className={`text-[10px] font-black px-4 py-1.5 rounded-full inline-block uppercase tracking-[0.25em] mb-6 shadow-sm ${dark ? 'bg-white/10 text-white' : 'bg-[#1A3626] text-white'}`}
                        >
                            Exclusive Routes
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-[0.95] italic uppercase ${dark ? 'text-white' : 'text-[#1A3626]'}`}
                        >
                            {title}
                        </motion.h2>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`text-lg md:text-xl font-sans font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-xl`}
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
                            <Link href={link} className={`inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] text-[10px] transition-colors group ${dark ? 'text-white hover:text-white/60' : 'text-[#1A3626] hover:text-[#1A3626]/60'}`}>
                                <span>Browse category</span>
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${dark ? 'border-white/20 group-hover:bg-white group-hover:text-[#1A3626]' : 'border-[#1A3626]/10 group-hover:bg-[#1A3626] group-hover:text-white'}`}>
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
