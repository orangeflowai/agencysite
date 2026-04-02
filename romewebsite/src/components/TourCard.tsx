'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import type { Tour } from '@/lib/sanityService';

interface TourCardProps {
    tour: Tour;
    layout?: 'default' | 'checkerboard';
    index?: number;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';

export default function TourCard({ tour, layout = 'default', index = 0 }: TourCardProps) {
    const [imgError, setImgError] = useState(false);

    const rawImageUrl =
        tour.mainImage?.asset?.url
            ? tour.mainImage.asset.url
            : typeof tour.mainImage === 'string'
                ? tour.mainImage
                : tour.mainImage
                    ? urlFor(tour.mainImage).width(800).height(600).url()
                    : FALLBACK_IMAGE;

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    // Checkerboard logic: Alternating layouts
    const isReversed = (index % 2) !== 0;

    if (layout === 'checkerboard') {
        return (
            <div className={`w-full flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} border-b border-forest last:border-b-0 group h-auto md:h-[500px]`}>
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative overflow-hidden h-[350px] md:h-full">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        className="object-cover sepia-[0.15] contrast-[1.1] grayscale-[0.1] transition-transform duration-1000 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-forest/10 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <span className="font-sans font-black text-[9px] uppercase tracking-[0.4em] bg-forest text-cream px-4 py-2">
                           {tour.category || 'CURATED'}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`w-full md:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-center ${isReversed ? 'bg-forest text-cream' : 'bg-cream text-forest'}`}>
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 opacity-60">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={isReversed ? 'fill-cream text-cream' : 'fill-forest text-forest'} />
                            ))}
                            <span className="font-sans text-[10px] font-black uppercase tracking-widest">4.9 Selection</span>
                        </div>

                        <h3 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
                            {tour.title}
                        </h3>

                        <p className="font-sans text-sm md:text-base leading-relaxed opacity-70 line-clamp-3">
                            An architectural and historical journey curated for those who seek the authentic Rome. Private access and expert guidance included.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pb-8 border-b border-current/10">
                            <div className="flex items-center gap-3">
                                <Clock size={16} />
                                <span className="font-sans text-[11px] font-black uppercase tracking-widest">{tour.duration || '3H'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users size={16} />
                                <span className="font-sans text-[11px] font-black uppercase tracking-widest">{tour.groupSize || 'PRIVATE'}</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between pt-4">
                            <div>
                                <p className="font-sans text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Fee starts from</p>
                                <span className="font-serif text-3xl font-bold italic">€{tour.price}</span>
                            </div>

                            <Link 
                                href={`/tour/${tour.slug.current}`}
                                className={`flex items-center gap-3 font-sans font-black text-[11px] uppercase tracking-widest pb-1 border-b-2 ${isReversed ? 'border-cream hover:opacity-50' : 'border-forest hover:opacity-50'} transition-all`}
                            >
                                <span>Reserve Access</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Vertical Card (if needed elsewhere)
    return (
        <div className="group border border-forest/10 hover:border-forest transition-colors bg-cream">
            <Link href={`/tour/${tour.slug.current}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-forest text-cream text-[8px] font-black px-3 py-1.5 uppercase tracking-widest">
                        {tour.category || 'PRIVATE'}
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-bold text-forest leading-tight group-hover:underline transition-all">
                        {tour.title}
                    </h3>
                    <div className="flex justify-between items-end pt-4 border-t border-forest/10">
                        <span className="font-serif text-2xl font-bold italic text-forest">€{tour.price}</span>
                        <span className="font-sans text-[9px] font-black uppercase tracking-widest text-forest/40">View selection</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
