'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users, ArrowUpRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
    dark?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

function TourCard({ tour, index }: { tour: any; index: number }) {
    const rawImageUrl =
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            : typeof tour.mainImage === 'string'
            ? tour.mainImage
            : tour.mainImage
            ? urlFor(tour.mainImage).width(700).height(480).format('webp').url()
            : FALLBACK_IMAGE;

    const duration = tour.duration
        ? `${tour.duration}${typeof tour.duration === 'number' ? ' hrs' : ''}`
        : tour.durationHours
        ? `${tour.durationHours} hrs`
        : '3 hrs';

    const groupSize = tour.groupSize || tour.maxGroupSize;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group shrink-0 flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ width: 'clamp(280px, 24vw, 360px)' }}
        >
            {/* Image — top 60% */}
            <Link href={`/tour/${tour.slug?.current || '#'}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/3', flexShrink: 0 }}>
                <Image
                    src={rawImageUrl}
                    alt={tour.title || 'Rome tour'}
                    fill
                    sizes="(max-width: 768px) 90vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQMEAwEAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqjqnWEdTHcDK01oSmhAFkkAHJNOgbGMsYrmuuYfduNriblgikMkfPjh+XfPoHnuAGT//2Q=="
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                {/* Price badge */}
                {tour.price && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg" style={{ backgroundColor: '#C9A84C', color: '#1A1210' }}>
                        from €{tour.price}
                    </div>
                )}
                {/* Arrow hover CTA */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0" style={{ backgroundColor: 'white', color: '#1A1210' }}>
                    <ArrowUpRight size={16} />
                </div>
            </Link>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                {/* Category tag */}
                {tour.category && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C9A84C' }}>
                        {tour.category.replace('-', ' ')}
                    </span>
                )}

                <Link href={`/tour/${tour.slug?.current || '#'}`}>
                    <h3 className="font-serif font-bold text-base leading-snug mb-3 line-clamp-2 hover:opacity-70 transition-opacity" style={{ color: '#1A1210' }}>
                        {tour.title}
                    </h3>
                </Link>

                {tour.shortDescription && (
                    <p className="text-xs leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: '#6B5C45' }}>
                        {tour.shortDescription}
                    </p>
                )}

                {/* Tags row */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#6B5C45' }}>
                        <Clock size={12} style={{ color: '#C9A84C' }} />
                        {duration}
                    </span>
                    {groupSize && (
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#6B5C45' }}>
                            <Users size={12} style={{ color: '#C9A84C' }} />
                            {typeof groupSize === 'number' ? `Up to ${groupSize}` : groupSize}
                        </span>
                    )}
                    {tour.languages && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F0E8', color: '#6B5C45' }}>
                            🌐 {typeof tour.languages === 'string' ? tour.languages : tour.languages[0] || 'EN'}
                        </span>
                    )}
                </div>

                {/* CTA */}
                <Link
                    href={`/tour/${tour.slug?.current || '#'}`}
                    className="mt-auto flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-all group/btn"
                    style={{ backgroundColor: '#1A1210', color: '#F5F0E8' }}
                >
                    <span>Book Now</span>
                    <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
            </div>
        </motion.div>
    );
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link, dark = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((dir: 'left' | 'right') => {
        const c = scrollRef.current;
        if (!c) return;
        const cardW = c.querySelector('[class*="shrink-0"]')?.clientWidth || 340;
        c.scrollBy({ left: dir === 'right' ? cardW + 24 : -(cardW + 24), behavior: 'smooth' });
    }, []);

    if (!tours || tours.length === 0) return null;

    const bgColor = dark ? '#1A1210' : 'transparent';
    const titleColor = dark ? '#F5F0E8' : '#1A1210';

    return (
        <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <div className="container mx-auto px-6 md:px-12 mb-10">
                <div className="flex items-end justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#C9A84C' }}>
                            ✦ CURATED EXPERIENCES ✦
                        </p>
                        <h2 className="font-serif font-bold leading-[1.1]" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: titleColor }}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 text-sm md:text-base max-w-lg" style={{ color: dark ? '#C9A84C' : '#6B5C45' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Arrows + View All */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            aria-label="Scroll left"
                            className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-opacity-10"
                            style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            aria-label="Scroll right"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            style={{ backgroundColor: '#C9A84C', color: '#1A1210' }}
                        >
                            <ChevronRight size={18} />
                        </button>
                        {link && (
                            <Link
                                href={link}
                                className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider ml-2 transition-opacity hover:opacity-70"
                                style={{ color: '#C9A84C' }}
                            >
                                View All <ArrowUpRight size={14} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex gap-5 md:gap-6 overflow-x-auto no-scrollbar pb-4"
                style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: 'clamp(24px, 6vw, 96px)',
                    paddingRight: 'clamp(24px, 6vw, 96px)',
                }}
            >
                {tours.map((tour, index) => (
                    <div key={tour._id || tour.id || index} style={{ scrollSnapAlign: 'start' }}>
                        <TourCard tour={tour} index={index} />
                    </div>
                ))}
            </div>

            {/* Mobile View All */}
            {link && (
                <div className="md:hidden text-center mt-8 px-6">
                    <Link
                        href={link}
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider py-3 px-8 border-2 rounded-xl"
                        style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                    >
                        View All Experiences <ArrowUpRight size={14} />
                    </Link>
                </div>
            )}
        </section>
    );
};

export default ProductRow;
