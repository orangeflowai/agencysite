
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '@/lib/dataAdapter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourHeroSliderProps {
    images: any[]; // Array of Sanity image objects
    title: string;
    category: string;
    duration: string;
    groupSize?: string;
    rating?: number;
    reviewCount?: number;
}

export default function TourHeroSlider({
    images,
    title,
    category,
    duration,
    groupSize,
    rating,
    reviewCount
}: TourHeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out invalid images just in case
    const validImages = images.filter(img => img?.asset || img);

    // Auto-advance logic
    useEffect(() => {
        if (validImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [validImages.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    if (validImages.length === 0) return null;

    // Helper to get URL
    const getImageUrl = (img: any) => {
        if (typeof img === 'string') return img; // Fallback for hardcoded
        if (img?.asset?.url) return img.asset.url; // Already resolved
        return urlFor(img).width(1920).height(1080).fit('crop').url();
    };

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full bg-black overflow-hidden group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={getImageUrl(validImages[currentIndex])}
                        alt={title}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0}
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-card/20 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-card/20 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
                        {validImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-card w-4' : 'bg-card/50 hover:bg-card'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
