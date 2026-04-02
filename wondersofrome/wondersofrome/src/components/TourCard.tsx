
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, Tag } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import type { Tour } from '@/lib/sanityService';


interface TourCardProps {
    tour: Tour;
}

// Fallback image for broken Unsplash URLs
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

export default function TourCard({ tour }: TourCardProps) {
    const [imgError, setImgError] = useState(false);

    const rawImageUrl =
        // 1. If it's a full Sanity asset object with URL already resolved (e.g. from expanded query)
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            // 2. If it's a simple string (e.g. fallback data or direct URL)
            : typeof tour.mainImage === 'string'
                ? tour.mainImage
                // 3. If it's a Sanity Image object that needs resolving
                : tour.mainImage
                    ? urlFor(tour.mainImage).width(400).height(267).quality(75).auto('format').url()
                    // 4. Default fallback
                    : 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';

    // Use fallback if image failed to load
    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    // Top Badge Logic - Prioritize Sanity Badge
    const topBadgeText = tour.badge ? tour.badge.toUpperCase() :
        (tour.category === 'colosseum' ? 'COLOSSEUM TOUR' :
            tour.category === 'vatican' ? 'VATICAN TOUR' :
                'GUIDED TOUR');

    // Middle Bar Logic
    const middleBarText = tour.tags && tour.tags.length > 0 ? tour.tags[0].toUpperCase() : 'FAST TRACK';

    return (
        <div className="h-full">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative bg-white flex flex-col h-full 
                           rounded-[2.5rem] overflow-hidden border border-black shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 min-h-110 lg:min-h-125"
                style={{ transform: 'translateZ(0)', willChange: 'transform, box-shadow' }}
            >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={tour.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 85vw, 380px"
                    className="object-cover will-change-transform"
                    style={{ transform: 'translateZ(0)' }}
                    onError={() => setImgError(true)}
                />

                {/* Heart / Like Button (Top Right) */}
                <div className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors cursor-pointer group-hover:scale-110">
                    <Heart size={24} className="text-white hover:fill-rose-500 hover:text-rose-500 transition-colors" />
                </div>

                {/* Badges Container - Top Left */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                    {/* Top Badge - Subtle 12px Pill */}
                    <div className="bg-black/70 backdrop-blur-sm text-white text-[12px] font-extrabold px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                        {topBadgeText}
                    </div>

                    {/* Marketing Tags - Subtle 12px Pill */}
                    {tour.tags && tour.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap max-w-[200px]">
                            {tour.tags.map((tag, index) => (
                                <span key={index} className={`text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider flex items-center ${index === 0 ? 'bg-[#b45309]/90' : 'bg-[#0f172a]/90'} backdrop-blur-sm`}>
                                    <Tag size={10} className="mr-1 shrink-0" /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Bar - Sleek Dark */}
            <div className="w-full py-2 bg-neutral-900 text-center relative z-10 -mt-1">
                <span className="text-white text-[11px] font-black uppercase tracking-[0.25em]">
                    {middleBarText}
                </span>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col grow relative z-20 bg-white text-left">
                {/* Title */}
                <div className="min-h-16">
                    <h3 className="font-black text-xl leading-tight mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {tour.title}
                    </h3>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < Math.floor(tour.rating || 5) ? 'fill-[#d4af37] text-[#d4af37]' : 'fill-gray-100 text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-black text-gray-900">{tour.rating || '5.0'}</span>
                    <span className="text-xs text-gray-400">({tour.reviewCount || 120})</span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-[#0f172a] shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-[#0f172a] shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">{tour.groupSize || 'Small Group'}</span>
                    </div>
                    {/* Only show 2 items to keep it clean */}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Instant Confirmation
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#b45309] bg-[#fefce8] border border-[#d4af37]/30 px-2 py-1 rounded-full">
                        ⚡ Skip The Line
                    </span>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">From</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-gray-900">€{tour.price}</span>
                            <span className="text-xs font-bold bg-[#fefce8] border border-[#d4af37]/30 text-[#b45309] px-1.5 py-0.5 rounded">per person</span>
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f172a] transition-colors duration-300 shadow-sm border border-slate-100">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
        </div>
    );
}
