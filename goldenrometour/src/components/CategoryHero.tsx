'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CategoryHeroProps {
    images: string[];
    title: string;
    subtitle: string;
}

export default function CategoryHero({ images, title, subtitle }: CategoryHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images]);

    const currentImage = images && images.length > 0 ? images[currentIndex] : '';

    return (
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
            {currentImage && (
                <div key={currentIndex} className="absolute inset-0 z-0 animate-fade-in">
                    <Image
                        src={currentImage}
                        alt={title}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                        quality={85}
                    />
                </div>
            )}

            <div className="absolute inset-0 bg-black/50 z-10" />

            <div className="relative z-20 container mx-auto px-4 mt-16">
                <h1
                    className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl transition-all duration-700"
                    style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)' }}
                >
                    {title}
                </h1>
                <div
                    className="w-24 h-1 bg-accent mx-auto mb-6 transition-all duration-700 delay-100"
                    style={{ opacity: isVisible ? 1 : 0 }}
                />
                <p
                    className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto drop-shadow-md transition-all duration-700 delay-200"
                    style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)' }}
                >
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
