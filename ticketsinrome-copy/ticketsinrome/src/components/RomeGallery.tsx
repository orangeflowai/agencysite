
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800', // Colosseum
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=80&w=800', // St Peter's
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=800', // Trevi Fountain
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&q=80&w=800', // Roman Forum
    'https://images.unsplash.com/photo-1548585744-4e87b61edba7?auto=format&fit=crop&q=80&w=800', // Pantheon
];

export default function RomeGallery() {
    return (
        <section className="py-24 bg-neutral-900 border-t border-neutral-800 overflow-hidden relative">

            {/* Header */}
            <div className="container mx-auto px-4 mb-16 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                    Walk where the <span className="text-emerald-500">gladiators</span> walked
                </h2>
                <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    Immerse yourself in the eternal beauty of Rome. Every corner tells a story waiting to be discovered.
                </p>
            </div>

            {/* Marquee Container */}
            <div className="flex relative w-full">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-900 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-900 to-transparent z-10"></div>

                <motion.div
                    className="flex gap-6 whitespace-nowrap"
                    animate={{ x: [0, -1920] }} // Adjust based on total width approx
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40,
                    }}
                >
                    {/* Double the array for seamless loop */}
                    {[...images, ...images, ...images].map((src, i) => (
                        <div key={i} className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] flex-shrink-0 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105">
                            <Image
                                src={src}
                                alt={`Rome Gallery ${i}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 300px, 400px"
                                quality={60}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
