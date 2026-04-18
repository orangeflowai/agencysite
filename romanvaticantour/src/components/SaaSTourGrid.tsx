'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/dataAdapter';
import { Clock, ArrowRight, Check } from 'lucide-react';

interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    duration?: string;
    price: number;
    rating?: number;
    reviewCount?: number;
    mainImage?: any;
    highlights?: string[];
    isPopular?: boolean;
}

interface SaaSTourGridProps {
    title: string;
    subtitle?: string;
    tours: Tour[];
    link?: string;
    dark?: boolean;
}

function resolveImage(mainImage: any): string | null {
    if (!mainImage) return null;
    if (typeof mainImage === 'string' && mainImage.startsWith('http')) return mainImage;
    if (mainImage?.asset?.url) return mainImage.asset.url;
    try { return urlFor(mainImage).width(600).height(400).url(); } catch { return null; }
}

export default function SaaSTourGrid({ title, subtitle, tours, link, dark = false }: SaaSTourGridProps) {
    if (!tours || tours.length === 0) return null;

    return (
        <section className={`py-24 ${dark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'}`}>
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h2>
                        {subtitle && <p className={`text-lg ${dark ? 'text-neutral-400' : 'text-neutral-600'}`}>{subtitle}</p>}
                    </div>
                    {link && (
                        <Link href={link} className={`shrink-0 inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border transition-colors ${
                            dark ? 'border-neutral-800 hover:bg-neutral-800 text-white' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-900'
                        }`}>
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {tours.slice(0, 3).map((tour, idx) => {
                        const imgSrc = resolveImage(tour.mainImage);
                        return (
                            <motion.div
                                key={tour._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`group flex flex-col rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                                    dark
                                        ? 'bg-neutral-900/80 backdrop-blur-sm border-neutral-800 hover:border-neutral-700 hover:shadow-[0_20px_60px_rgba(14,165,233,0.1)]'
                                        : 'bg-white/80 backdrop-blur-sm border-neutral-100 hover:border-sky-100 hover:shadow-[0_20px_60px_rgba(14,165,233,0.08)]'
                                }`}
                            >
                                <div className="relative h-56 w-full bg-neutral-100 overflow-hidden">
                                    {imgSrc ? (
                                        <Image
                                            src={imgSrc}
                                            alt={tour.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center">
                                            <span className="text-4xl select-none">🏛️</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {tour.isPopular && (
                                        <div
                                            className="absolute top-4 left-4 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10"
                                            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 4px 12px rgba(14,165,233,0.4)' }}
                                        >
                                            Most Popular
                                        </div>
                                    )}
                                    <div
                                        className="absolute top-4 right-4 font-black px-3 py-1.5 rounded-xl z-10 text-sm"
                                        style={{
                                            background: 'rgba(255,255,255,0.92)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#0284c7',
                                            border: '1px solid rgba(14,165,233,0.15)',
                                        }}
                                    >
                                        €{tour.price}
                                    </div>
                                </div>

                                <div className="flex-1 p-6 lg:p-8 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-sky-500 mb-4">
                                        {tour.duration && (
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {tour.duration}</span>
                                        )}
                                    </div>

                                    <h3 className={`text-xl font-bold mb-6 line-clamp-2 group-hover:text-sky-500 transition-colors ${dark ? 'text-white' : 'text-neutral-900'}`}>
                                        {tour.title}
                                    </h3>

                                    <div className="space-y-3 mb-8 flex-1">
                                        {(tour.highlights || ['Skip the line access', 'Expert local guide', 'Instant confirmation']).slice(0, 3).map((highlight, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 rounded-full p-1 shrink-0 ${dark ? 'bg-sky-500/20' : 'bg-sky-50'}`}>
                                                    <Check className={`w-3 h-3 ${dark ? 'text-sky-400' : 'text-sky-500'}`} />
                                                </div>
                                                <span className={`text-sm ${dark ? 'text-neutral-300' : 'text-neutral-600'}`}>{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/tour/${tour.slug?.current}`}
                                        className="w-full py-4 rounded-xl text-center font-bold transition-all flex items-center justify-center gap-2 group/btn text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                            boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                                        }}
                                    >
                                        Book Now
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
