'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, Users, Heart, Zap, ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import type { Tour } from '@/lib/sanityService';

interface TourCardProps {
    tour: Tour;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

export default function TourCard({ tour }: TourCardProps) {
    const [imgError, setImgError] = useState(false);
    const [liked, setLiked] = useState(false);

    const rawImageUrl =
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            : typeof tour.mainImage === 'string'
                ? tour.mainImage
                : tour.mainImage
                    ? urlFor(tour.mainImage).width(600).height(400).url()
                    : FALLBACK_IMAGE;

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    return (
        <div className="h-full px-2">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative flex flex-col h-full rounded-[2rem] overflow-hidden border border-white/60 transition-all duration-500 hover:-translate-y-2"
                style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 24px rgba(2,132,199,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset',
                }}
            >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 20px 60px rgba(2,132,199,0.12), 0 0 0 1px rgba(14,165,233,0.1) inset' }}
                />

                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[2rem]">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />

                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Heart Button - Glassmorphic */}
                    <button
                        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                        className="absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{
                            background: liked ? 'rgba(244,63,94,0.9)' : 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Heart size={18} className={liked ? 'fill-white text-white' : 'text-white'} />
                    </button>

                    {/* Category Badge - Glassmorphic */}
                    <div
                        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white"
                        style={{
                            background: 'rgba(10,10,30,0.65)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}
                    >
                        {tour.category || 'Premium Tour'}
                    </div>

                    {/* Fast Track Badge */}
                    <div className="absolute bottom-4 left-4">
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                            style={{
                                background: 'rgba(14,165,233,0.9)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(56,189,248,0.4)',
                                boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                            }}
                        >
                            <Zap size={11} className="fill-white" />
                            Fast Track
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">4.9 (320)</span>
                    </div>

                    <h3 className="font-black text-xl leading-tight mb-4 text-slate-900 group-hover:text-sky-600 transition-colors duration-300 line-clamp-2">
                        {tour.title}
                    </h3>

                    {/* Info Pills - Glassmorphic */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide"
                            style={{
                                background: 'rgba(14,165,233,0.06)',
                                border: '1px solid rgba(14,165,233,0.12)',
                                color: '#0284c7',
                            }}
                        >
                            <Clock size={12} />
                            {tour.duration || '3 Hours'}
                        </div>
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide"
                            style={{
                                background: 'rgba(14,165,233,0.06)',
                                border: '1px solid rgba(14,165,233,0.12)',
                                color: '#0284c7',
                            }}
                        >
                            <Users size={12} />
                            {tour.groupSize || 'Small Group'}
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100/80">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Starting From</p>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">€{tour.price}</span>
                        </div>

                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-0.5"
                            style={{
                                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                boxShadow: '0 4px 12px rgba(14,165,233,0.35)',
                            }}
                        >
                            <ArrowRight size={18} className="text-white" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
