'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, Tag } from 'lucide-react';
import { urlFor } from '@/lib/dataAdapter';
import type { Tour } from '@/lib/dataAdapter';

interface TourCardProps {
  tour: Tour;
}

const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';
const FALLBACK_IMAGE = `${R2_BASE}/pexels-alex-250137-757239.jpg`;

export default function TourCard({ tour }: TourCardProps) {
  const [imgError, setImgError] = useState(false);

  const rawImageUrl = tour.mainImage?.asset?.url 
    ? tour.mainImage.asset.url 
    : typeof tour.mainImage === 'string' 
      ? tour.mainImage 
      : tour.mainImage 
        ? urlFor(tour.mainImage).width(600).height(400).url() 
        : FALLBACK_IMAGE;

  const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

  const topBadgeText = tour.badge
    ? tour.badge.toUpperCase()
    : tour.category === 'colosseum' ? 'COLOSSEUM TOUR'
    : tour.category === 'vatican' ? 'VATICAN TOUR'
    : 'GUIDED TOUR';

  const middleBarText = tour.tags && tour.tags.length > 0
    ? tour.tags[0].toUpperCase()
    : 'SYSTEM_LINK_ACTIVE';

  const displayPrice = tour.guestTypes?.length
    ? Math.min(...tour.guestTypes.filter(g => (g as any).price > 0).map(g => (g as any).price))
    : tour.price;

  return (
    <Link
      href={`/tour/${tour.slug.current}`}
      className="group relative bg-card flex flex-col h-full rounded-[var(--radius)] overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg min-h-[440px] lg:min-h-[500px] font-sans"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />

        {/* Heart */}
        <div className="absolute top-3 right-3 z-20 p-2 bg-background/80 backdrop-blur-md border border-border rounded-sm hover:bg-primary hover:text-white transition-colors cursor-pointer group-hover:scale-110 text-primary">
          <Heart size={16} />
        </div>

        {/* Top badge */}
        <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2 py-1  tracking-[0.2em] rounded-sm shadow-md border border-white/20">
          {topBadgeText}
        </div>
      </div>

      {/* Middle bar */}
      <div className="w-full py-1.5 bg-foreground text-center relative z-10 -mt-1">
        <span className="text-background text-[9px] font-bold  tracking-[0.3em]">
          {middleBarText}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow space-y-4">
        <div className="min-h-[3.5rem]">
          <h3 className="text-lg font-serif font-bold text-foreground leading-tight line-clamp-2  tracking-tight">
            {tour.title}
          </h3>
        </div>

        <div className="flex items-center text-muted-foreground text-xs font-bold  tracking-widest h-5">
          <MapPin size={14} className="text-primary mr-1.5 shrink-0" />
          <span className="line-clamp-1">Vatican City // Terminal 01</span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold  tracking-widest text-muted-foreground">
          <div className="flex items-center bg-background px-2.5 py-1.5 rounded-sm border border-border">
            <Users size={14} className="mr-1.5 text-primary" />
            <span>{tour.groupSize || '25'}</span>
          </div>
          <div className="flex items-center bg-background px-2.5 py-1.5 rounded-sm border border-border">
            <Clock size={14} className="mr-1.5 text-primary" />
            <span>{tour.duration}</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs font-bold text-foreground">{tour.rating || '5.0'}</span>
          </div>
          <span className="text-[9px] text-muted-foreground font-bold tracking-widest  opacity-60">
            {tour.reviewCount || 120} logs
          </span>
        </div>
      </div>

      {/* Footer: Price & Book */}
      <div className="flex h-16 mt-auto border-t border-border">
        <div className="w-[60%] bg-card text-foreground flex flex-col justify-center px-6 relative overflow-hidden group-hover:bg-accent transition-colors">
          <span className="text-[8px]  opacity-60 font-bold tracking-widest mb-0.5">ESTIMATED_COST</span>
          <span className="text-2xl font-serif font-bold tracking-tighter ">€{displayPrice}</span>
        </div>
        <div className="w-[40%] bg-primary text-white flex items-center justify-center font-bold text-[10px]  tracking-[0.2em] hover:brightness-110 transition-all cursor-pointer text-center px-4 leading-tight">
          INITIATE
        </div>
      </div>
    </Link>
  );
}
