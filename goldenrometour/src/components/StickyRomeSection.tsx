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
                        <h2 className="font-serif text-5xl md:text-[10rem] font-bold text-white mb-8 tracking-[-0.05em] drop-shadow-2xl leading-[0.8] italic">
                            ROME IS CHAOTIC.
                        </h2>
                        <p className="font-sans text-[11px] md:text-sm text-white font-black tracking-[0.6em] uppercase opacity-70">
                            Your journey should be curated.
                        </p>
                    </motion.div>
                </div>

                {/* Section 2 Text: Serenity */}
                <div className="h-screen flex items-center justify-center sticky top-0"> {/* Overlaying sticky for fade effect */}
                    <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="max-w-4xl text-center z-20 px-4">
                        <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8 drop-shadow-lg">
                            "Experience the Eternal City,<br />Unlocked."
                        </h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6 pointer-events-auto">
                            <Link href="/search" className="bg-forest text-cream px-12 py-5 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-forest-light transition-all shadow-xl active:scale-95">
                                Secure Access
                            </Link>
                            <Link href="/private-tours" className="bg-cream text-forest px-12 py-5 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl active:scale-95 border border-forest/10">
                                Private Folio
                            </Link>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
