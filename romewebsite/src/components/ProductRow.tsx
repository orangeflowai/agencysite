'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TourCard from './TourCard';

interface ProductRowProps {
    title: string;
    subtitle?: string;
    tours: any[];
    link?: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link }) => {
    if (!tours || tours.length === 0) return null;

    return (
        <section className="bg-cream overflow-hidden border-t border-forest">
            {/* Editorial Header */}
            <div className="container mx-auto px-8 md:px-16 pt-24 pb-16">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="font-sans text-[10px] uppercase font-black tracking-[0.5em] text-forest/40">
                           Editorial Selection
                        </span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl xl:text-8xl text-forest mt-6 mb-8 font-bold italic"
                    >
                        {title}
                    </motion.h2>

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-sans text-lg md:text-xl text-forest max-w-2xl leading-relaxed opacity-70"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Checkerboard Grid (Editorial Layout) */}
            <div className="border-t border-forest">
                {tours.map((tour, index) => (
                    <motion.div
                        key={tour._id || tour.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <TourCard tour={tour} layout="checkerboard" index={index} />
                    </motion.div>
                ))}
            </div>

            {/* Minimalist Footer CTA */}
            {link && (
                <div className="container mx-auto px-8 py-24 text-center border-t border-forest">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href={link} 
                            className="inline-flex flex-col items-center gap-4 group"
                        >
                            <span className="font-sans text-[11px] font-black uppercase tracking-[0.4em] text-forest/40 group-hover:text-forest transition-all">
                                View Entire {title}
                            </span>
                            <div className="w-16 h-16 border-2 border-forest flex items-center justify-center group-hover:bg-forest group-hover:text-cream transition-all">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

export default ProductRow;
