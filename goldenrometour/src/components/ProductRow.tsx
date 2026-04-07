'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import TourCard from './TourCard';
import { motion } from 'framer-motion';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
    dark?: boolean;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link, dark = false }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    if (!tours || tours.length === 0) return null;

    const bgColor = dark ? '#1A1210' : '#F5F0E8';
    const titleColor = dark ? '#F5F0E8' : '#1A1210';
    const subtitleColor = dark ? 'rgba(201,168,76,0.8)' : 'rgba(26,18,16,0.6)';

    return (
        <section className="py-20 md:py-32 overflow-hidden transition-colors duration-500" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <div className="container mx-auto px-6 md:px-16 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-10 h-px bg-[#C9A84C]" />
                            <p className="font-nav text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: '#C9A84C' }}>
                                Essential Rome
                            </p>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-serif font-bold leading-tight mb-4" 
                            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: titleColor }}
                        >
                            {title}
                        </motion.h2>
                        {subtitle && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-sans text-base md:text-lg max-w-lg leading-relaxed" 
                                style={{ color: subtitleColor }}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4">
                            {scrollSnaps.map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`h-1 transition-all duration-300 rounded-full ${index === selectedIndex ? 'w-8 bg-[#C9A84C]' : 'w-2 bg-[#C9A84C]/20'}`} 
                                />
                            ))}
                        </div>
                        <button
                            onClick={scrollPrev}
                            disabled={!prevBtnEnabled}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${!prevBtnEnabled ? 'opacity-30 Slab-not-allowed cursor-not-allowed' : 'hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-white'}`}
                            style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!nextBtnEnabled}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!nextBtnEnabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 shadow-lg'}`}
                            style={{ backgroundColor: '#C9A84C', color: '#1A1210' }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="embla px-6 md:px-16" ref={emblaRef}>
                <div className="embla__container flex gap-6">
                    {tours.map((tour, index) => (
                        <div 
                            key={tour._id || tour.id || index} 
                            className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                        >
                            <TourCard tour={tour} />
                        </div>
                    ))}
                    
                    {/* Final "View All" Slide */}
                    {link && (
                        <div className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                            <Link 
                                href={link}
                                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#C9A84C]/30 rounded-2xl p-12 group hover:border-[#C9A84C] transition-all bg-white/5"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A84C] group-hover:text-[#1A1210] transition-all">
                                    <ArrowUpRight size={32} />
                                </div>
                                <span className="font-nav text-xs uppercase tracking-[0.3em] font-bold" style={{ color: titleColor }}>
                                    Explore More
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Footer CTA */}
            {link && (
                <div className="md:hidden text-center mt-12 px-6">
                    <Link
                        href={link}
                        className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] py-4 px-10 rounded-full transition-all active:scale-95"
                        style={{ backgroundColor: '#1A1210', color: '#F5F0E8' }}
                    >
                        View All Tours <ArrowUpRight size={14} />
                    </Link>
                </div>
            )}
        </section>
    );
};

export default ProductRow;
