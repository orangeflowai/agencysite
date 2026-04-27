
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CategoryHeroProps {
    images: string[];
    title: string;
    subtitle: string;
}

export default function CategoryHero({ images, title, subtitle }: CategoryHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (!images || images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images]);

    // Fallback if no images
    const currentImage = images && images.length > 0 ? images[currentIndex] : '';

    return (
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
            {/* Background Slider */}
            <AnimatePresence mode='wait'>
                {currentImage && (
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={currentImage}
                            alt={title}
                            fill
                            priority={true}
                            className="object-cover"
                            sizes="100vw"
                            quality={85}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-1"></div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 mt-16">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6  tracking-tight drop-shadow-2xl"
                >
                    {title}
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-24 h-1 bg-sky-500 mx-auto mb-6"
                ></motion.div>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto drop-shadow-md"
                >
                    {subtitle}
                </motion.p>
            </div>
        </div>
    );
}
