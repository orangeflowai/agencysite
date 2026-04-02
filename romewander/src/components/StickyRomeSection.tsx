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

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const text1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const text2Opacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
    const text2Y = useTransform(scrollYProgress, [0.4, 0.8], [50, 0]);

    return (
        <div ref={container} className="relative h-[250vh]">

            {/* STICKY BACKGROUND */}
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div style={{ scale }} className="relative h-full w-full">
                    {/* Layer 1: Chaotic Crowd — fades OUT */}
                    <motion.div style={{ opacity: text1Opacity }} className="absolute inset-0 z-10">
                        <Image
                            src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=2000&auto=format&fit=crop"
                            alt="Crowded Rome"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </motion.div>

                    {/* Layer 2: Serene Vatican — revealed behind */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=2000&auto=format&fit=crop"
                            alt="Serene Vatican"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[#1A1210]/60" />
                    </div>
                </motion.div>
            </div>

            {/* SCROLLING FOREGROUND TEXT */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">

                {/* Scene 1 */}
                <div className="h-screen flex items-center justify-center sticky top-0">
                    <motion.div style={{ opacity: text1Opacity }} className="text-center z-20 px-6 max-w-4xl">
                        <p
                            className="font-nav text-[11px] tracking-[0.4em] uppercase mb-6"
                            style={{ color: '#C9A84C' }}
                        >
                            ✦ THE PROBLEM ✦
                        </p>
                        <h2
                            className="font-serif font-black text-white drop-shadow-2xl leading-[1.05] mb-4"
                            style={{ fontSize: 'clamp(48px, 8vw, 100px)' }}
                        >
                            Rome is Chaotic.
                        </h2>
                        <p className="text-xl md:text-2xl text-white/70 font-sans font-light tracking-widest uppercase">
                            Your pilgrimage shouldn&apos;t be.
                        </p>
                    </motion.div>
                </div>

                {/* Scene 2 */}
                <div className="h-screen flex items-center justify-center sticky top-0">
                    <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="max-w-4xl text-center z-20 px-6">
                        <p
                            className="font-nav text-[11px] tracking-[0.4em] uppercase mb-6"
                            style={{ color: '#C9A84C' }}
                        >
                            ✦ THE SOLUTION ✦
                        </p>
                        <h2
                            className="font-accent italic text-white mb-6 drop-shadow-lg"
                            style={{ fontSize: 'clamp(42px, 7vw, 88px)', lineHeight: 1.1 }}
                        >
                            &ldquo;Experience the Eternal City,<br />Unlocked.&rdquo;
                        </h2>
                        <p className="text-white/60 font-sans text-lg mb-10 max-w-lg mx-auto">
                            Skip the queues, skip the chaos. Private Vatican access curated for the discerning pilgrim.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pointer-events-auto">
                            <Link
                                href="/search"
                                className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 transition-all hover:scale-105 hover:shadow-2xl"
                                style={{ backgroundColor: '#C9A84C', color: '#1A1210', borderRadius: '2px' }}
                            >
                                Find Your Experience
                            </Link>
                            <Link
                                href="/private-tours"
                                className="font-nav font-bold uppercase tracking-widest text-sm px-10 py-5 border-2 transition-all hover:scale-105"
                                style={{ borderColor: 'rgba(201,168,76,0.6)', color: '#F5F0E8', borderRadius: '2px' }}
                            >
                                View Private Tours
                            </Link>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
