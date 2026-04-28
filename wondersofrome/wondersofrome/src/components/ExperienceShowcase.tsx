'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Users, Star, ArrowRight } from 'lucide-react';

interface Tour {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  duration?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  groupSize?: string;
  badge?: string;
  highlights?: string[];
  mainImage?: any;
  category?: string;
}

interface ExperienceShowcaseProps {
  title: string;
  subtitle?: string;
  tours: Tour[];
  link?: string;
  accent?: 'emerald' | 'gold';
}

function getTourImage(tour: Tour): string {
  if (tour.mainImage?.asset?.url) return tour.mainImage.asset.url;
  if (typeof tour.mainImage === 'string') return tour.mainImage;
  const cats: Record<string, string> = {
    vatican: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&q=80',
    colosseum: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80',
    city: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=900&q=80',
    'hidden-gems': 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=900&q=80',
  };
  return cats[tour.category || ''] || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80';
}

export default function ExperienceShowcase({
  title,
  subtitle,
  tours,
  link,
  accent = 'emerald',
}: ExperienceShowcaseProps) {
  const [current, setCurrent] = useState(0);

  if (!tours || tours.length === 0) return null;

  const tour = tours[current];
  const imageUrl = getTourImage(tour);

  const isGold = accent === 'gold';
  const accentBg = isGold ? 'bg-accent' : 'bg-[var(--accent)]';
  const accentText = isGold ? 'text-accent' : 'text-[var(--accent)]';
  const accentHover = isGold ? 'hover:bg-[var(--accent)]' : 'hover:bg-[var(--accent)]';
  const ctaBg = isGold ? 'bg-accent text-primary' : 'bg-[var(--accent)] text-white';
  const highlights = tour.highlights?.slice(0, 3) || [];

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Row header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg mt-2">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent(i => (i - 1 + tours.length) % tours.length)}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent(i => (i + 1) % tours.length)}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {link && (
              <Link href={link} className={`ml-4 text-sm font-bold ${accentText} underline underline-offset-4 hidden sm:block`}>
                View all
              </Link>
            )}
          </div>
        </div>

        {/* Main showcase card — image left, text right (like image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl min-h-[420px]">

          {/* Left — large photo */}
          <div className="relative h-72 lg:h-auto overflow-hidden">
            <Image
              src={imageUrl}
              alt={tour.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Badge overlay */}
            {tour.badge && (
              <div className={`absolute top-5 left-5 ${accentBg} text-white text-xs font-bold  tracking-widest px-3 py-1.5 rounded-full shadow-lg`}>
                {tour.badge}
              </div>
            )}
            {/* Rating overlay */}
            {tour.rating && (
              <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-card/90 backdrop-blur px-3 py-1.5 rounded-full shadow">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-foreground">{tour.rating}</span>
                <span className="text-xs text-muted-foreground font-medium">({tour.reviewCount || 0})</span>
              </div>
            )}
          </div>

          {/* Right — content panel */}
          <div className="bg-muted flex flex-col justify-center p-8 md:p-12 gap-6">
            {/* Category + index */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold  tracking-widest ${accentText}`}>
                {tour.category?.replace('-', ' ') || 'Tour'}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">{current + 1} / {tours.length}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {tour.title}
            </h3>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-bold">
              {tour.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {tour.duration}
                </span>
              )}
              {tour.groupSize && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {tour.groupSize}
                </span>
              )}
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <ul className="space-y-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`mt-0.5 w-4 h-4 rounded-full ${accentBg} text-white flex items-center justify-center shrink-0 text-[10px] font-bold`}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* Price + CTA */}
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border">
              <div>
                <span className="text-xs text-muted-foreground font-bold  tracking-wider">From</span>
                <p className="text-3xl font-bold text-foreground">€{tour.price}</p>
              </div>
              <div className="flex gap-3 ml-auto">
                <Link
                  href={`/tour/${tour.slug.current}`}
                  className={`${ctaBg} ${accentHover} flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm  tracking-wide transition-all hover:-translate-y-0.5 shadow-lg`}
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        {tours.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {tours.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? `w-8 ${accentBg}` : 'w-1.5 bg-gray-300'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
