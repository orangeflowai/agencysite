'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, Heart, ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/dataAdapter';
import type { Tour } from '@/lib/dataAdapter';

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
                className="group relative flex flex-col h-full rounded-[3rem] overflow-hidden transition-all duration-500 hover:-translate-y-3"
                style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    boxShadow: '0 12px 48px rgba(26,18,16,0.04), 0 0 0 1px rgba(255,255,255,1) inset',
                }}
            >
                {/* Hover gold glow */}
                <div
                    className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 32px 80px rgba(201,168,76,0.08), 0 0 0 1px rgba(201,168,76,0.06) inset' }}
                />

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[3rem]">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <span
                            className="px-4 py-2 text-[8px] uppercase tracking-[0.25em] font-black text-white rounded-full"
                            style={{
                                background: 'rgba(26,18,16,0.75)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            {tour.category || 'Rome'}
                        </span>
                    </div>

                    {/* Heart button */}
                    <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            setLiked(!liked); 
                        }}
                        type="button"
                        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                        className="absolute top-6 right-6 z-10 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{
                            background: liked ? 'rgba(220,38,38,0.9)' : 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.4)',
                        }}
                    >
                        <Heart size={16} className={liked ? 'fill-white text-white' : 'text-white'} />
                    </button>

                    {/* Price tag */}
                    <div className="absolute bottom-6 right-6 z-10">
                        <div
                            className="px-4 py-2 rounded-2xl"
                            style={{
                                background: 'rgba(201,168,76,0.95)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 12px 24px rgba(201,168,76,0.3)',
                            }}
                        >
                            <span className="font-inter text-[8px] uppercase tracking-wider block leading-none text-foreground/60 mb-0.5">From</span>
                            <span className="font-inter font-bold text-xl leading-tight italic text-foreground">€{tour.price}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col grow">
                    {/* Rating & Duration */}
                    <div className="flex items-center gap-5 mb-4">
                        <div className="flex items-center gap-1.5 text-foreground">
                            <Star size={14} fill="currentColor" />
                            <span className="font-inter text-xs font-bold text-foreground">4.9</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/40">
                            <Clock size={14} />
                            <span className="font-inter text-[8px] uppercase tracking-[0.15em] font-bold">{tour.duration || '3h'}</span>
                        </div>
                    </div>

                    <h3 className="font-inter text-2xl font-bold leading-tight mb-5 text-foreground group-hover:text-foreground transition-colors duration-300 line-clamp-2 tracking-tighter">
                        {tour.title}
                    </h3>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                        {['Skip the Line Entrance', 'Expert Local Guide'].map((feat) => (
                            <div key={feat} className="flex items-center gap-3 text-foreground/80">
                                <div className="w-1.5 h-1.5 rounded-full bg-card shrink-0" />
                                <span className="font-inter text-[8px] uppercase tracking-widest font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        className="mt-auto pt-6 flex items-center justify-between"
                        style={{ borderTop: '1px solid rgba(26,18,16,0.05)' }}
                    >
                        <span className="font-inter text-[12px] uppercase tracking-[0.25em] font-black text-foreground group-hover:text-foreground transition-colors">
                            Book Experience
                        </span>
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1"
                            style={{
                                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                                boxShadow: '0 6px 16px rgba(201,168,76,0.3)',
                            }}
                        >
                            <ArrowRight size={16} className="text-white" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
