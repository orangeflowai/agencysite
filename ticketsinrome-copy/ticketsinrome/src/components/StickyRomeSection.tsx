'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

export default function StickyRomeSection() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    // Animation: Scale down image and fade opacity
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Text Opacity: Fade out first text, Fade in second text
    const text1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const text2Opacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
    const text2Y = useTransform(scrollYProgress, [0.4, 0.8], [50, 0]);

    return (
        <div ref={container} className="relative h-[250vh]">

            {/* STICKY BACKGROUND */}
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div style={{ scale }} className="relative h-full w-full">
                    {/* Layer 1: Chaos (Crowded Street) - Fades OUT */}
                    <motion.div style={{ opacity: text1Opacity }} className="absolute inset-0 z-10">
                        <Image
                            src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=2000&auto=format&fit=crop"
                            alt="Crowded Rome"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </motion.div>

                    {/* Layer 2: Serenity (Vatican Hallway) - Revealed behind or fades In */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=2000&auto=format&fit=crop"
                            alt="Serene Vatican"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                </motion.div>
            </div>

            {/* SCROLLING FOREGROUND CONTENT */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">

                {/* Section 1 Text: Rome is Chaotic */}
                <div className="h-screen flex items-center justify-center sticky top-0">
                    <motion.div style={{ opacity: text1Opacity }} className="text-center z-20 px-4">
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">
                            ROME IS CHAOTIC.
                        </h2>
                        <p className="text-xl md:text-3xl text-white font-light tracking-widest uppercase">
                            Your trip shouldn't be.
                        </p>
                    </motion.div>
                </div>

                {/* Section 2 Text: Serenity */}
                <div className="h-screen flex items-center justify-center sticky top-0"> {/* Overlaying sticky for fade effect */}
                    <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="max-w-4xl text-center z-20 px-4">
                        <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8 drop-shadow-lg">
                            "Experience the Eternal City,<br />Unlocked."
                        </h2>
                        <div className="flex justify-center gap-4 pointer-events-auto"> {/* Pointer events back on for buttons */}
                            <Link href="/search" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all">
                                Find Your Experience
                            </Link>
                            <Link href="/private-tours" className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all">
                                View Private Tours
                            </Link>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
