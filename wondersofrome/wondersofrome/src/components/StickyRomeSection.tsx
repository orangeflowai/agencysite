'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

export default function StickyRomeSection() {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    const scale       = useTransform(scrollYProgress, [0, 1],   [1, 0.92]);
    const text1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const img1Opacity  = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const text2Opacity = useTransform(scrollYProgress, [0.4, 0.75], [0, 1]);
    const text2Y       = useTransform(scrollYProgress, [0.4, 0.75], [40, 0]);

    return (
        /* Scroll container — 250vh gives enough room to animate through */
        <div ref={container} className="relative h-[250vh]">

            {/* ── Sticky viewport ── */}
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div style={{ scale }} className="relative h-full w-full">

                    {/* Layer 1 — crowded street, fades out */}
                    <motion.div
                        style={{ opacity: img1Opacity }}
                        className="absolute inset-0 z-10"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=2000&auto=format&fit=crop"
                            alt="Crowded Rome street"
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/35" />
                    </motion.div>

                    {/* Layer 2 — serene Vatican, always behind */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=2000&auto=format&fit=crop"
                            alt="Serene Vatican hallway"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* ── Text 1: "Rome is Chaotic" — sits on top of image layer 1 ── */}
                    <motion.div
                        style={{ opacity: text1Opacity }}
                        className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center pointer-events-none"
                    >
                        <div>
                            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-none mb-4">
                                ROME IS CHAOTIC.
                            </h2>
                            <p className="text-lg sm:text-2xl md:text-3xl text-white/90 font-light tracking-widest uppercase">
                                Your trip shouldn&apos;t be.
                            </p>
                        </div>
                    </motion.div>

                    {/* ── Text 2: CTA — fades in over layer 2 ── */}
                    <motion.div
                        style={{ opacity: text2Opacity, y: text2Y }}
                        className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center"
                    >
                        <div className="max-w-3xl">
                            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif italic text-white mb-8 drop-shadow-lg leading-tight">
                                &ldquo;Experience the Eternal City,<br />Unlocked.&rdquo;
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/search"
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all text-sm"
                                >
                                    Find Your Experience
                                </Link>
                                <Link
                                    href="/private-tours"
                                    className="bg-white/10 backdrop-blur-sm border border-white/40 hover:bg-white hover:text-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all text-sm"
                                >
                                    View Private Tours
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
