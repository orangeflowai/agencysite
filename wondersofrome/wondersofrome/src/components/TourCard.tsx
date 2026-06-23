'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Clock, Star, MapPin, Users, Heart, Tag, ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/dataAdapter';
import type { Tour } from '@/lib/dataAdapter';
import { useLanguage } from '@/context/LanguageContext';

interface TourCardProps {
  tour: Tour;
  nextAvailable?: string | null; // YYYY-MM-DD from /api/next-available
}

const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';
const FALLBACK_IMAGE = `${R2_BASE}/pexels-alex-250137-757239.jpg`;

export default function TourCard({ tour, nextAvailable }: TourCardProps) {
  const [imgError, setImgError] = useState(false);
  const { translateTour, t } = useLanguage();
  
  // Get translated tour data
  const translatedTour = translateTour(tour);

  const rawImageUrl = translatedTour.mainImage?.asset?.url 
    ? translatedTour.mainImage.asset.url 
    : typeof translatedTour.mainImage === 'string' 
      ? translatedTour.mainImage 
      : translatedTour.mainImage 
        ? urlFor(translatedTour.mainImage).width(600).height(400).url() 
        : FALLBACK_IMAGE;

  const imageUrl = imgError ? FALLBACK_IMAGE : rawImageUrl;

  const topBadgeText = translatedTour.badge
    ? translatedTour.badge.toUpperCase()
    : translatedTour.category === 'colosseum' ? t('nav.colosseum').toUpperCase()
    : translatedTour.category === 'vatican' ? t('nav.vatican').toUpperCase()
    : t('common.guided_tour').toUpperCase();

  const middleBarText = translatedTour.tags && translatedTour.tags.length > 0
    ? (typeof translatedTour.tags[0] === 'string' ? translatedTour.tags[0] : (translatedTour.tags[0] as any)?.label || (translatedTour.tags[0] as any)?.name || t('common.featured_tour')).toUpperCase()
    : t('common.featured_tour').toUpperCase();

  const displayPrice = translatedTour.guestTypes?.length
    ? Math.min(...translatedTour.guestTypes.filter(g => (g as any).price > 0).map(g => (g as any).price))
    : translatedTour.price;

  return (
    <Link
      href={`/tour/${translatedTour.slug?.current || '#'}`}
      className="group relative bg-card flex flex-col h-full rounded-[var(--radius)] overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl min-h-[440px] lg:min-h-[496px] font-sans"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={translatedTour.title}
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
        <div className="absolute top-3 left-3 bg-primary text-white text-[8px] font-bold px-2 py-1 tracking-[0.2em] rounded-sm shadow-md border border-white/20">
          {topBadgeText}
        </div>
      </div>

      {/* Middle bar */}
      <div className="w-full py-1.5 bg-foreground text-center relative z-10 -mt-1 group-hover:bg-primary transition-colors">
        <span className="text-background text-[8px] font-bold tracking-[0.3em]">
          {middleBarText}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow space-y-4">
        <div className="min-h-[3.5rem]">
          <h3 className="text-lg font-serif font-bold text-foreground leading-tight line-clamp-2 tracking-tight group-hover:text-primary transition-colors">
            {translatedTour.title}
          </h3>
        </div>

        <div className="flex items-center text-muted-foreground text-xs font-bold tracking-widest h-5">
          <MapPin size={14} className="text-primary mr-1.5 shrink-0" />
          <span className="line-clamp-1">{translatedTour.location || 'Rome, Italy'}</span>
        </div>

        <div className="flex items-center space-x-3 text-[8px] font-bold tracking-widest text-muted-foreground">
          <div className="flex items-center bg-background px-2.5 py-1.5 rounded-sm border border-border group-hover:border-primary/30 transition-colors">
            <Users size={14} className="mr-1.5 text-primary" />
            <span>{translatedTour.groupSize || '25'}</span>
          </div>
          <div className="flex items-center bg-background px-2.5 py-1.5 rounded-sm border border-border group-hover:border-primary/30 transition-colors">
            <Clock size={14} className="mr-1.5 text-primary" />
            <span>{translatedTour.duration}</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs font-bold text-foreground">{translatedTour.rating || '5.0'}</span>
          </div>
          <span className="text-[8px] text-muted-foreground font-bold tracking-widest opacity-60">
            {translatedTour.reviewCount || 120} {t('tour.reviews')}
          </span>
        </div>

        {/* Next available date */}
        {nextAvailable !== undefined && (
          <div className={`mt-3 flex items-center gap-1.5 text-[9px] font-bold tracking-wider rounded-lg px-2 py-1.5 w-fit ${
            nextAvailable
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${nextAvailable ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
            {nextAvailable
              ? `Next: ${new Date(nextAvailable + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
              : 'Contact us for dates'
            }
          </div>
        )}
      </div>

      {/* Footer: Price & Book */}
      <div className="flex h-20 mt-auto border-t border-border overflow-hidden">
        <div className="w-[55%] bg-card text-foreground flex flex-col justify-center px-6 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
          <span className="text-[9px] text-muted-foreground font-bold tracking-[0.2em] mb-0.5 uppercase">{t('tour.from')}</span>
          <span className="text-3xl font-serif font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">€{displayPrice}</span>
        </div>
        <div className="w-[45%] bg-primary text-white flex items-center justify-center font-bold text-[10px] tracking-[0.2em] hover:bg-foreground group-hover:bg-primary transition-all cursor-pointer text-center px-4 leading-tight uppercase shadow-[inset_10px_0_20px_rgba(0,0,0,0.1)]">
          {t('tour.book_now')} <ArrowRight size={14} className="ml-2" />
        </div>
      </div>
    </Link>
  );
}
