'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, Heart, ArrowRight } from 'lucide-react';
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
                    ? urlFor(tour.mainImage).width(800).height(600).url()
                    : 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop&q=80';

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    return (
        <div className="h-full px-2 py-4">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative flex flex-col h-full bg-white transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/[0.03]"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#1A1210] font-nav text-[9px] uppercase tracking-[0.2em] font-bold rounded-full border border-black/5">
                            {tour.category || 'Rome'}
                        </span>
                    </div>

                    {/* Like Button */}
                    <button className="absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-red-500 transition-all duration-300 shadow-lg">
                        <Heart size={16} fill="currentColor" className="opacity-80" />
                    </button>
                    
                    {/* Price Overlay tag */}
                    <div className="absolute bottom-4 right-4 z-10">
                         <div className="bg-[#C9A84C] text-[#1A1210] px-3 py-1.5 rounded-lg shadow-lg">
                            <span className="font-nav text-[9px] uppercase tracking-wider block leading-none opacity-80">From</span>
                            <span className="font-serif font-bold text-lg leading-none italic">€{tour.price}</span>
                         </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                    {/* Rating & Duration */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-[#C9A84C]">
                            <Star size={14} fill="currentColor" />
                            <span className="font-nav text-[11px] font-bold text-[#1A1210]">4.9</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-black/40">
                            <Clock size={14} />
                            <span className="font-nav text-[10px] uppercase tracking-wider font-bold">{tour.duration || '3h'}</span>
                        </div>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold leading-tight mb-4 text-[#1A1210] group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                        {tour.title}
                    </h3>

                    {/* Features list */}
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-black/50">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/40" />
                             <span className="font-nav text-[10px] uppercase tracking-widest">Skip the Line Entrance</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/50">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/40" />
                             <span className="font-nav text-[10px] uppercase tracking-widest">Expert Local Guide</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                        <span className="font-nav text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">Book Now</span>
                        <ArrowRight size={16} className="text-[#C9A84C] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
