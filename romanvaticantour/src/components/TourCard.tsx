'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, Users, Heart, Zap } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import type { Tour } from '@/lib/sanityService';

interface TourCardProps {
    tour: Tour;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

export default function TourCard({ tour }: TourCardProps) {
    const [imgError, setImgError] = useState(false);

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
                className="group relative bg-white flex flex-col h-full 
                           rounded-[2.5rem] overflow-hidden border border-sky-100 shadow-saas transition-all duration-500 hover:-translate-y-2 hover:shadow-saas-xl"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />

                    {/* Heart Button */}
                    <div className="absolute top-5 right-5 z-20 p-2.5 bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/20 hover:bg-white/50 transition-all group-hover:scale-110 cursor-pointer">
                        <Heart size={20} className="text-white group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
                    </div>

                    {/* Badge */}
                    <div className="absolute top-5 left-5 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] rounded-full border border-white/10 shadow-xl">
                        {tour.category || 'Premium Tour'}
                    </div>

                    {/* Feature Badge (Auto-apply Fast Track or similar) */}
                    <div className="absolute bottom-5 left-5">
                        <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1.5 rounded-xl shadow-lg">
                            <Zap size={12} className="fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Fast Track</span>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col grow bg-white">
                    {/* Header: Title + Rating */}
                    <div className="mb-4">
                        <h3 className="font-black text-2xl leading-tight mb-3 text-stone-950 group-hover:text-sky-500 transition-colors line-clamp-2">
                            {tour.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-xs font-black text-stone-950 uppercase tracking-widest">4.9 (320)</span>
                        </div>
                    </div>

                    {/* Info Pills */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-xl">
                            <Clock size={14} className="text-sky-500" />
                            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{tour.duration || '3 Hours'}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-xl">
                            <Users size={14} className="text-sky-500" />
                            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{tour.groupSize || 'Small Group'}</span>
                        </div>
                    </div>

                    {/* Bottom: Price + CTA */}
                    <div className="mt-auto flex items-center justify-between border-t border-stone-50 pt-6">
                        <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                            <span className="text-3xl font-black text-stone-950 tracking-tighter">€{tour.price}</span>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-sky-500 group-hover:border-sky-400 transition-all duration-300 shadow-sm group-hover:shadow-saas group-hover:-translate-x-1">
                            <svg 
                                width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                className="text-stone-400 group-hover:text-white transition-colors duration-300"
                                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
