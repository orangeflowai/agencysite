
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, Tag } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Tour } from '@/lib/sanityService';
import Tilt from 'react-parallax-tilt';

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
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            transitionSpeed={2000}
            glareEnable={true}
            glareMaxOpacity={0.2}
            glareColor="#ffffff"
            glarePosition="all"
            className="h-full"
        >
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

                {/* Marketing Tags (Bottom Left of Image) */}
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {tour.tags && tour.tags.length > 0 ? (
                        tour.tags.map((tag: string, index: number) => (
                            <span key={index} className={`text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center ${index === 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                                <Tag size={10} className="mr-1" /> {tag}
                            </span>
                        ))
                    ) : (
                        /* Default Tags if none present */
                        <>
                            {tour.badge && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center">
                                <Tag size={10} className="mr-1" /> {tour.badge}
                            </span>}
                        </>
                    )}
                </div>
            </div>

            {/* Middle Bar - Sleek Dark */}
            <div className="w-full py-2 bg-neutral-900 text-center relative z-10 -mt-1">
                <span className="text-white text-[11px] font-black uppercase tracking-[0.25em]">
                    {middleBarText}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-7 flex flex-col grow bg-white space-y-4">
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
                        <span>{tour.groupSize || '25'}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock size={16} className="mr-2 text-emerald-600" />
                        <span>{tour.duration}</span>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < (tour.rating || 5) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{tour.rating || '5.0'}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold tracking-wide uppercase">
                        {tour.reviewCount || 120} {t('tour.reviews')}
                    </span>
                </div>
            </div>

            {/* Footer: Price & Button - REVERTED TO GREEN/GREEN DESIGN */}
            <div className="flex h-20 mt-auto">
                {/* Price Box - Lighter Green */}
                <div className="w-[55%] bg-emerald-600 text-white flex flex-col justify-center px-8 relative overflow-hidden group-hover:bg-emerald-500 transition-colors">
                    <span className="text-[10px] uppercase opacity-90 font-bold tracking-widest mb-0.5">{t('tour.from')}</span>
                    <span className="text-3xl font-black tracking-tight">€{tour.price}</span>

                    {/* Decorative skewed background */}
                    <div className="absolute top-0 right-0 h-full w-8 bg-emerald-800 transform skew-x-12 translate-x-4 mix-blend-multiply opacity-20"></div>
                </div>

                {/* Book Button - Darker Green */}
                <div className="w-[45%] bg-emerald-800 text-white flex items-center justify-center font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-colors cursor-pointer text-center px-4 leading-tight">
                    {t('tour.book_now')}
                </div>
            </div>
        </Link>
        </Tilt>
    );
}
