'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Clock, Users, ArrowRight, Check } from 'lucide-react';

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
                    {tours.slice(0, 3).map((tour, idx) => (
                        <motion.div
                            key={tour._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`flex flex-col rounded-3xl border overflow-hidden shadow-saas transition-all hover:shadow-saas-xl hover:-translate-y-1 ${
                                dark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                            }`}
                        >
                            <div className="relative h-56 w-full bg-neutral-100">
                                {tour.mainImage && (
                                    <Image
                                        src={urlFor(tour.mainImage).width(600).height(400).url()}
                                        alt={tour.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                {tour.isPopular && (
                                    <div className="absolute top-4 left-4 bg-theme-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
                                        Most Popular
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-neutral-900 font-black px-3 py-1.5 rounded-xl z-10">
                                    €{tour.price}
                                </div>
                            </div>
                            
                            <div className="flex-1 p-6 lg:p-8 flex flex-col">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#0EA5E9] mb-4">
                                    {tour.duration && (
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {tour.duration}</span>
                                    )}
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-6 line-clamp-2 ${dark ? 'text-white' : 'text-neutral-900'}`}>
                                    {tour.title}
                                </h3>

                                <div className="space-y-3 mb-8 flex-1">
                                    {(tour.highlights || ['Skip the line access', 'Expert local guide', 'Instant confirmation']).slice(0, 3).map((highlight, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-1 ${dark ? 'bg-neutral-800' : 'bg-green-50'}`}>
                                                <Check className={`w-3 h-3 ${dark ? 'text-green-400' : 'text-green-600'}`} />
                                            </div>
                                            <span className={`text-sm ${dark ? 'text-neutral-300' : 'text-neutral-600'}`}>{highlight}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link 
                                    href={`/tour/${tour.slug?.current}`}
                                    className={`w-full py-4 rounded-xl text-center font-bold transition-colors ${
                                        dark 
                                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                                    }`}
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
