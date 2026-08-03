'use client';

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
        <section className={`py-24 ${dark ? 'bg-foreground text-background' : 'bg-card text-foreground'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4">{title}</h2>
                        {subtitle && (
                            <p className={`text-lg ${dark ? 'text-background/60' : 'text-muted-foreground'}`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {link && (
                        <Link
                            href={link}
                            className={`shrink-0 inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border transition-colors ${
                                dark
                                    ? 'border-background/20 hover:bg-background/10 text-background'
                                    : 'border-border hover:bg-muted text-foreground'
                            }`}
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {tours.slice(0, 3).map((tour) => {
                        const imgSrc = resolveImage(tour.mainImage);
                        return (
                            <div
                                key={tour._id}
                                className={`group flex flex-col rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                                    dark
                                        ? 'bg-background/5 backdrop-blur-sm border-background/10 hover:border-background/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                                        : 'bg-card backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(139,26,26,0.1)]'
                                }`}
                            >
                                <div className="relative h-56 w-full bg-muted overflow-hidden">
                                    {imgSrc ? (
                                        <Image
                                            src={imgSrc}
                                            alt={tour.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                            <span className="text-4xl select-none">🏛️</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {tour.isPopular && (
                                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[8px] font-bold tracking-widest px-3 py-1.5 rounded-full z-10 shadow-lg">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 font-bold px-3 py-1.5 rounded-xl z-10 text-sm bg-white/90 backdrop-blur-sm text-primary border border-primary/15">
                                        €{tour.price}
                                    </div>
                                </div>

                                <div className="flex-1 p-6 lg:p-8 flex flex-col">
                                    <div className={`flex items-center gap-4 text-xs font-bold tracking-widest mb-4 ${dark ? 'text-primary' : 'text-primary'}`}>
                                        {tour.duration && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" /> {tour.duration}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`text-xl font-serif font-bold mb-6 line-clamp-2 group-hover:text-primary transition-colors ${dark ? 'text-background' : 'text-foreground'}`}>
                                        {tour.title}
                                    </h3>

                                    <div className="space-y-3 mb-8 flex-1">
                                        {(tour.highlights || ['Skip the line access', 'Expert local guide', 'Instant confirmation']).slice(0, 3).map((highlight, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 rounded-full p-1 shrink-0 ${dark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                                <span className={`text-sm ${dark ? 'text-background/70' : 'text-muted-foreground'}`}>
                                                    {highlight}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/tour/${tour.slug?.current}`}
                                        className="w-full py-4 rounded-xl text-center font-bold transition-all flex items-center justify-center gap-2 group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                    >
                                        Book Now
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
