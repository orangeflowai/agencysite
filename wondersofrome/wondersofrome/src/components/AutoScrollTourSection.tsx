'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/lib/dataAdapter';
import type { Tour } from '@/lib/dataAdapter';

interface AutoScrollTourSectionProps {
  title: string;
  subtitle?: string;
  tours: Tour[];
  link?: string;
  category: 'vatican' | 'colosseum';
}

export default function AutoScrollTourSection({ 
  title, 
  subtitle, 
  tours, 
  link,
  category 
}: AutoScrollTourSectionProps) {
  // Filter out tours without valid slugs
  const validTours = tours.filter(tour => tour.slug?.current);

  const bgColor = category === 'vatican' ? 'bg-background' : 'bg-card';
  const labelColor = category === 'vatican' ? 'Vatican Collection' : 'Colosseum Collection';

  // Don't render if no valid tours
  if (validTours.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 md:py-24 ${bgColor} border-b border-border relative`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">
              {labelColor}
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm font-medium tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          {link && (
            <Link 
              href={link} 
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[8px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0"
            >
              View All <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Product Card Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {validTours.slice(0, 6).map((tour) => {
            const tourSlug = tour.slug?.current || tour.slug;
            const imageUrl = tour.mainImage
              ? (typeof tour.mainImage === 'string' ? tour.mainImage : (urlFor(tour.mainImage).url() || '/placeholder.jpg'))
              : '/placeholder.jpg';

            return (
              <Link
                key={tour._id}
                href={`/tour/${tourSlug}`}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {tour.category && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 text-[8px] font-bold rounded-full uppercase tracking-widest">
                        {tour.category}
                      </span>
                    </div>
                  )}
                  {tour.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-accent text-accent-foreground px-3 py-1.5 text-[8px] font-bold rounded-full">
                        {tour.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  {/* Rating */}
                  {(tour.rating || tour.reviewCount) && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{tour.rating || "4.9"}</span>
                      <span className="text-xs text-muted-foreground">
                        ({tour.reviewCount || "0"})
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-foreground text-base md:text-lg font-serif font-bold leading-tight group-hover:text-primary transition-colors mb-2">
                    {tour.title}
                  </h3>

                  {/* Description */}
                  {tour.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {typeof tour.description === 'string' ? tour.description : ''}
                    </p>
                  )}

                  {/* Footer: Duration + Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[8px] text-muted-foreground font-bold tracking-widest block uppercase mb-0.5">From</span>
                        <span className="text-xl font-serif font-bold text-foreground">€{tour.price}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase group-hover:bg-foreground transition-all shadow-md group-hover:shadow-lg">
                        Book Now <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
