
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
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            : typeof tour.mainImage === 'string'
                ? tour.mainImage
                : tour.mainImage
                    ? urlFor(tour.mainImage).width(600).height(800).url()
                    : 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=800&fit=crop&q=80';

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    return (
        <div className="h-full px-2">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative flex flex-col h-full bg-theme-light border border-transparent 
                           transition-all duration-500 hover:-translate-y-2 hover:border-theme-primary/50 overflow-hidden rounded-t-[140px]"
            >
                {/* Arch Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[140px] bg-theme-dark/10">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                    
                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-theme-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Minimal Content */}
                <div className="p-6 flex flex-col items-center text-center grow bg-theme-light border-x border-b border-theme-primary/10 transition-colors duration-500 group-hover:border-theme-primary/50 pb-8">
                    
                    <h3 className="font-serif text-2xl font-bold leading-snug mb-3 text-theme-dark group-hover:text-theme-primary transition-colors line-clamp-2">
                        {tour.title}
                    </h3>
                    
                    <div className="w-8 h-px bg-theme-primary/40 mb-4" />

                    <div className="mt-auto flex flex-col items-center gap-1">
                        <span className="text-theme-dark/60 font-nav text-[10px] uppercase tracking-[0.2em] font-bold">Starting from</span>
                        <span className="font-nav text-lg text-theme-dark font-bold tracking-widest">€{tour.price}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
