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

    return (
        <div className="h-full px-2 py-4">
            <Link
                href={`/tour/${tour.slug.current}`}
                className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{
                    background: 'rgba(245, 240, 232, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    boxShadow: '0 4px 24px rgba(26,18,16,0.06), 0 0 0 1px rgba(255,255,255,0.7) inset',
                }}
            >
                {/* Hover gold glow */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 20px 60px rgba(201,168,76,0.14), 0 0 0 1px rgba(201,168,76,0.1) inset' }}
                />

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span
                            className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-black text-white rounded-full"
                            style={{
                                background: 'rgba(26,18,16,0.7)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}
                        >
                            {tour.category || 'Rome'}
                        </span>
                    </div>

                    {/* Heart button */}
                    <button
                        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{
                            background: liked ? 'rgba(220,38,38,0.85)' : 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        <Heart size={16} className={liked ? 'fill-white text-white' : 'text-white'} />
                    </button>

                    {/* Price tag */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <div
                            className="px-3 py-1.5 rounded-xl"
                            style={{
                                background: 'rgba(201,168,76,0.9)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
                            }}
                        >
                            <span className="font-nav text-[9px] uppercase tracking-wider block leading-none text-[#1A1210]/70">From</span>
                            <span className="font-serif font-bold text-lg leading-tight italic text-[#1A1210]">€{tour.price}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                    {/* Rating & Duration */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-[#C9A84C]">
                            <Star size={13} fill="currentColor" />
                            <span className="font-nav text-[11px] font-bold text-[#1A1210]">4.9</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-black/40">
                            <Clock size={13} />
                            <span className="font-nav text-[10px] uppercase tracking-wider font-bold">{tour.duration || '3h'}</span>
                        </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold leading-tight mb-4 text-[#1A1210] group-hover:text-[#C9A84C] transition-colors duration-300 line-clamp-2">
                        {tour.title}
                    </h3>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                        {['Skip the Line Entrance', 'Expert Local Guide'].map((feat) => (
                            <div key={feat} className="flex items-center gap-2 text-[#6B5C45]/70">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 shrink-0" />
                                <span className="font-nav text-[10px] uppercase tracking-widest">{feat}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        className="mt-auto pt-4 flex items-center justify-between"
                        style={{ borderTop: '1px solid rgba(26,18,16,0.07)' }}
                    >
                        <span className="font-nav text-[10px] uppercase tracking-[0.2em] font-black text-[#C9A84C] group-hover:text-[#A07830] transition-colors">
                            Book Now
                        </span>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-0.5"
                            style={{
                                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                                boxShadow: '0 3px 10px rgba(201,168,76,0.35)',
                            }}
                        >
                            <ArrowRight size={14} className="text-white" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
