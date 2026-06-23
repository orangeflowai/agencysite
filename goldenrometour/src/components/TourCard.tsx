'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, Users, ArrowRight, MapPin, Check, Heart, Info } from 'lucide-react';
import { urlFor } from '@/lib/dataAdapter';
import type { Tour } from '@/lib/dataAdapter';
import clsx from 'clsx';

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
                    ? urlFor(tour.mainImage).width(800).height(600).url()
                    : FALLBACK_IMAGE;

    const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

    // Resolve description snippet
    const descriptionSnippet = typeof tour.description === 'string' 
        ? tour.description.slice(0, 100) + '...'
        : 'Experience the heart of Rome with our expert-led archival tours.';

    return (
        <div className="min-w-[304px] md:min-w-[400px] h-full p-2">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 border border-primary/10 bg-white shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(201,168,76,0.15)]"
            >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[2.2rem]">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                        <span className="px-4 py-2 text-[8px] font-heading tracking-tight font-bold text-white rounded-full bg-secondary/80 backdrop-blur-xl border border-white/20 uppercase">
                            {tour.category || 'Rome'}
                        </span>
                        
                        <button
                            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                            className={clsx(
                                "p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-xl",
                                liked ? "bg-accent/90" : "bg-black/20"
                            )}
                        >
                            <Heart size={16} className={liked ? 'fill-white text-white' : 'text-white'} />
                        </button>
                    </div>

                    {/* Bottom Info Bar (On Image) */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10 text-white">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-primary">
                                <Star size={14} fill="currentColor" />
                                <span className="font-heading text-xs font-bold">{tour.rating || '5.0'}</span>
                                <span className="text-[8px] opacity-60 font-body uppercase tracking-tighter">({tour.reviewCount || 100} Logs)</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-90">
                                <MapPin size={12} className="text-primary" />
                                <span className="font-heading text-[8px] tracking-tight uppercase">{tour.location || 'Rome, Italy'}</span>
                            </div>
                        </div>
                        <div className="bg-primary text-secondary px-5 py-3 rounded-2xl shadow-xl border border-white/10 text-center">
                            <span className="block text-[8px] font-heading font-bold uppercase tracking-tighter leading-none mb-1 opacity-70">Starting From</span>
                            <span className="block font-heading font-bold text-xl leading-none">€{tour.price}</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1 bg-white">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-black/40">
                            <Clock size={14} className="text-primary/60" />
                            <span className="font-heading text-[8px] tracking-tighter font-bold uppercase">{tour.duration || '3h'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/40">
                            <Users size={14} className="text-primary/60" />
                            <span className="font-heading text-[8px] tracking-tighter font-bold uppercase">{tour.groupSize || 'Max 15'}</span>
                        </div>
                    </div>

                    <h3 className="font-heading text-2xl font-bold leading-[1.1] mb-4 text-black group-hover:text-primary transition-colors duration-500 line-clamp-2 uppercase">
                        {tour.title}
                    </h3>

                    <p className="font-body text-sm text-black/50 leading-relaxed mb-6 line-clamp-2 uppercase tracking-tight">
                        {descriptionSnippet}
                    </p>

                    {/* Dynamic Highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {(tour.highlights && tour.highlights.length > 0 ? tour.highlights.slice(0, 4) : ['Skip the Line', 'Private Access', 'Historian Led', 'Archival Entry']).map((feat: any) => (
                            <div key={typeof feat === 'object' ? feat.item : feat} className="flex items-center gap-2 py-2 px-3 bg-background/50 rounded-xl border border-primary/5">
                                <Check size={12} className="text-primary shrink-0" />
                                <span className="font-heading text-[8px] font-bold text-black/60 tracking-tight uppercase truncate">{typeof feat === 'object' ? feat.item : feat}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-primary/5">
                        <div className="flex items-center gap-2 text-primary font-heading font-bold text-[8px] tracking-tight uppercase">
                            <Info size={14} />
                            <span>Detailed Protocol</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-heading text-[8px] font-bold text-black uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">Reserve Seat</span>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-white shadow-xl transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-[360deg]">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
