'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/dataAdapter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourHeroSliderProps {
    images: any[];
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

    const validImages = images.filter(img => img?.asset || img);

    useEffect(() => {
        if (validImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [validImages.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % validImages.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);

    if (validImages.length === 0) return null;

    const getImageUrl = (img: any) => {
        if (typeof img === 'string') return img;
        if (img?.asset?.url) return img.asset.url;
        return urlFor(img).width(1920).height(1080).fit('crop').url();
    };

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full bg-black overflow-hidden group">
            <div
                key={currentIndex}
                className="absolute inset-0 animate-fade-in"
            >
                <Image
                    src={getImageUrl(validImages[currentIndex])}
                    alt={title}
                    fill
                    className="object-cover"
                    priority={currentIndex === 0}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {validImages.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20"
                        aria-label="Next image"
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
                        {validImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-2 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
