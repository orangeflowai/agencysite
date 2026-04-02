
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, Tag } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Tour } from '@/lib/sanityService';


interface TourCardProps {
    tour: Tour;
}

// Fallback image for broken Unsplash URLs
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

/**
 * Normalises raw CMS group-size strings like
 * "Max 4 people for a small car; Max 7 people for a minivan"
 * → "Up to 7 people"
 * Plain numbers like "25" → "Up to 25 people"
 */
function normalizeGroupSize(raw: string | number | undefined): string {
    if (!raw) return 'Small Group';
    const str = String(raw).trim();

    // Extract all numbers from the string
    const nums = str.match(/\d+/g)?.map(Number) ?? [];
    if (nums.length === 0) return str; // already clean text, return as-is

    const max = Math.max(...nums);

    // If the original string mentions "private" or "car" it's a private tour
    const lower = str.toLowerCase();
    if (lower.includes('private') || lower.includes('car') || lower.includes('van')) {
        return `Private (max ${max})`;
    }

    return `Up to ${max} people`;
}

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

    // Top Badge Logic - Prefer Sanity badge, fallback to category
    const topBadgeText = tour.badge
        ? tour.badge.toUpperCase()
        : (tour.category === 'colosseum' ? 'COLOSSEUM TOUR'
            : tour.category === 'vatican' ? 'VATICAN TOUR'
                : 'GUIDED TOUR');

    // Middle Bar Logic - Use first tag if present, else fallback
    const middleBarText = tour.tags && tour.tags.length > 0
        ? tour.tags[0].toUpperCase()
        : 'FAST TRACK';

    const { t } = useLanguage();

    return (
        <div className="h-full">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative bg-white flex flex-col h-full 
                           rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-xl transition-shadow duration-200 hover:shadow-2xl min-h-110 lg:min-h-125"
                style={{ transform: 'translateZ(0)', willChange: 'box-shadow' }}
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

                    {/* Marketing Tags - Subtle 12px Pills */}
                    {tour.tags && tour.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap max-w-[200px]">
                            {tour.tags.map((tag: string, index: number) => (
                                <span key={index} className={`text-white text-[12px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center ${index === 0 ? 'bg-[#f97316]/90' : 'bg-emerald-600/90'} backdrop-blur-sm`}>
                                    <Tag size={10} className="mr-1 shrink-0" /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Bar - Sleek Dark Emerald */}
            <div className="w-full py-2 bg-emerald-950 text-center relative z-10 -mt-1 shadow-inner">
                <span className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.25em]">
                    {middleBarText}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col grow bg-white space-y-4 text-left">
                {/* Title */}
                <div className="min-h-18">
                    <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-2 uppercase tracking-wide">
                        {tour.title}
                    </h3>
                </div>

                {/* Location - Increased readability */}
                <div className="flex items-start text-gray-500 text-sm font-bold h-6">
                    <MapPin size={18} className="text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                        {tour.location || 'Rome, Italy'}
                    </span>
                </div>

                {/* Specs Row - Increased readability */}
                <div className="flex items-center space-x-4 text-sm font-bold text-gray-700">
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Users size={16} className="mr-2 text-emerald-600" />
                        <span>{normalizeGroupSize(tour.groupSize)}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock size={16} className="mr-2 text-emerald-600" />
                        <span>{tour.duration}</span>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="flex text-[#f97316]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(tour.rating || 4.9) ? "currentColor" : "none"} className="text-[#f97316]" />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{tour.rating || '4.9'}</span>
                        <span className="text-[10px] text-emerald-600 border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">Verified</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold tracking-wide uppercase">
                        {tour.reviewCount || 120} {t('tour.reviews')}
                    </span>
                </div>
            </div>

            {/* Footer: Price & Button - REVERTED TO GREEN/GREEN DESIGN */}
            <div className="flex h-20 mt-auto">
                {/* Price Box - Emerald */}
                <div className="w-[55%] bg-emerald-600 text-white flex flex-col justify-center px-8 relative overflow-hidden group-hover:bg-emerald-500 transition-colors">
                    <span className="text-[10px] uppercase opacity-90 font-bold tracking-widest mb-0.5">{t('tour.from')}</span>
                    <span className="text-3xl font-black tracking-tight flex items-center gap-2">
                         €{tour.price}
                    </span>

                    {/* Decorative skewed background */}
                    <div className="absolute top-0 right-0 h-full w-8 bg-emerald-800 transform skew-x-12 translate-x-4 mix-blend-multiply opacity-20"></div>
                </div>

                {/* Book Button - High Conversion Orange */}
                <div className="w-[45%] bg-[#f97316] text-white flex items-center justify-center font-black text-sm uppercase tracking-widest hover:bg-[#ea580c] transition-colors cursor-pointer text-center px-4 leading-tight shadow-inner shadow-[#ea580c]/50">
                    {t('tour.book_now')}
                </div>
            </div>
        </Link>
        </div>
    );
}
