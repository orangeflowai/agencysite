'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80';

function ArchCard({ tour, index }: { tour: any; index: number }) {
    const [imgError, setImgError] = useState(false);

    const rawImageUrl =
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            : typeof tour.mainImage === 'string'
                ? tour.mainImage
                : tour.mainImage
                    ? urlFor(tour.mainImage).width(600).height(800).url()
                    : FALLBACK_IMAGE;

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    const duration = tour.duration
        ? `${tour.duration}${typeof tour.duration === 'number' ? ' hrs' : ''}`
        : tour.durationHours
            ? `${tour.durationHours} hrs`
            : tour.groupSize
                ? null
                : '3 hrs';

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.12 }}
            className="group relative shrink-0"
            style={{ width: 'clamp(260px, 22vw, 340px)' }}
        >
            <Link
                href={`/tour/${tour.slug?.current || '#'}`}
                className="block relative overflow-hidden cursor-pointer"
                // Arch shape: border-radius on top only
                style={{ borderRadius: '9999px 9999px 8px 8px', aspectRatio: '3/4' }}
            >
                {/* Full-bleed photo */}
                <Image
                    src={imageUrl}
                    alt={tour.title || 'Vatican tour'}
                    fill
                    sizes="(max-width: 768px) 85vw, 340px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => setImgError(true)}
                />

                {/* Bottom gradient for text readability */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(26,18,16,0.85) 30%, transparent 70%)' }}
                />

                {/* ── PRICE BADGE — top left ── */}
                {tour.price && (
                    <div
                        className="absolute top-4 left-4 font-nav font-bold text-xs uppercase tracking-widest px-3 py-1.5 shadow-lg"
                        style={{
                            backgroundColor: '#C9A84C',
                            color: '#1A1210',
                            borderRadius: '999px',
                        }}
                    >
                        from €{tour.price}
                    </div>
                )}

                {/* ── DURATION BADGE — bottom left ── */}
                {duration && (
                    <div
                        className="absolute bottom-[90px] left-4 font-nav font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 shadow-lg"
                        style={{
                            backgroundColor: 'rgba(26,18,16,0.85)',
                            color: '#F5F0E8',
                            borderRadius: '999px',
                            border: '1px solid rgba(201,168,76,0.4)',
                        }}
                    >
                        ⏱ {duration}
                    </div>
                )}

                {/* Arrow CTA — bottom right */}
                <div
                    className="absolute bottom-[90px] right-4 w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                        backgroundColor: 'rgba(201,168,76,0.9)',
                        borderRadius: '50%',
                        color: '#1A1210',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </div>

                {/* Location name + short desc — bottom  */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
                    <h3 className="font-serif font-bold text-white leading-snug line-clamp-2 text-lg mb-1 drop-shadow-md">
                        {tour.title}
                    </h3>
                    {tour.shortDescription && (
                        <p className="font-sans text-white/80 text-xs line-clamp-1">
                            {tour.shortDescription}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Gentle auto-scroll
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        let animationFrameId: number;
        const scroll = () => {
            if (!isHovered && container) {
                container.scrollLeft += 0.4;
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
        <section className="py-20 md:py-28 overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
            {/* Section Header */}
            <div className="container mx-auto px-6 md:px-16 mb-14 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="font-nav text-[10px] tracking-[0.35em] uppercase font-bold mb-4"
                    style={{ color: '#C9A84C' }}
                >
                    ✦ SACRED DESTINATIONS ✦
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-serif font-bold leading-[1.1] mb-4"
                    style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#1A1210' }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="font-accent italic text-2xl md:text-3xl"
                        style={{ color: '#C9A84C' }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {/* Arch-Gallery Scroll Container */}
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex items-end gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-4"
                    style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch', paddingLeft: 'clamp(24px, 8vw, 120px)', paddingRight: 'clamp(24px, 8vw, 120px)' }}
                >
                    {/* Staggered heights for visual dynamism */}
                    {tours.map((tour, index) => (
                        <div
                            key={tour._id || tour.id || index}
                            style={{
                                marginBottom: index % 3 === 1 ? '40px' : index % 3 === 2 ? '20px' : '0px',
                            }}
                        >
                            <ArchCard tour={tour} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* View All — Ghost button with gold border */}
            {link && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-14"
                >
                    <Link
                        href={link}
                        className="inline-block font-nav font-bold uppercase tracking-[0.2em] text-sm py-4 px-12 transition-all hover:scale-105"
                        style={{
                            border: '2px solid #C9A84C',
                            color: '#C9A84C',
                            borderRadius: '2px',
                            backgroundColor: 'transparent',
                        }}
                    >
                        View All Experiences →
                    </Link>
                </motion.div>
            )}
        </section>
    );
};

export default ProductRow;
