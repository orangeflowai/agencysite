
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
                    ? urlFor(tour.mainImage).width(600).height(400).url()
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
                           rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl min-h-110 lg:min-h-125"
            >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => setImgError(true)}
                />

                {/* Heart / Like Button (Top Right) */}
                <div className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors cursor-pointer group-hover:scale-110">
                    <Heart size={24} className="text-white hover:fill-rose-500 hover:text-rose-500 transition-colors" />
                </div>

                {/* Top Left Badge - Premium Pill Style */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                    {topBadgeText}
                </div>

                {/* Marketing Tags (Bottom Left of Image) — only show if tags exist, never duplicate badge */}
                {tour.tags && tour.tags.length > 0 && (
                    <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                        {tour.tags.map((tag, index) => (
                            <span key={index} className={`text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center ${index === 0 ? 'bg-rose-500' : 'bg-sky-500'}`}>
                                <Tag size={10} className="mr-1" /> {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Middle Bar - Sleek Dark */}
            <div className="w-full py-2 bg-neutral-900 text-center relative z-10 -mt-1">
                <span className="text-white text-[11px] font-black uppercase tracking-[0.25em]">
                    {middleBarText}
                </span>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col grow relative z-20 bg-white">
                {/* Title */}
                <div className="min-h-16">
                    <h3 className="font-black text-xl leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
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
                                className={`${i < Math.floor(tour.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-black text-gray-900">{tour.rating || '5.0'}</span>
                    <span className="text-xs text-gray-400">({tour.reviewCount || 120})</span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">{tour.groupSize || 'Small Group'}</span>
                    </div>
                    {/* Only show 2 items to keep it clean */}
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">From</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-gray-900">€{tour.price}</span>
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">per person</span>
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
