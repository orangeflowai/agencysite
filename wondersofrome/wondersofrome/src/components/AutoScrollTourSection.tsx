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
            <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">
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
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[10px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0"
            >
              View All <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Dropdown/Stack Layout - Vertical Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {validTours.slice(0, 6).map((tour) => {
          const tourSlug = tour.slug?.current || tour.slug;
          const imageUrl = tour.mainImage 
            ? (typeof tour.mainImage === 'string' ? tour.mainImage : urlFor(tour.mainImage).url())
            : '/placeholder.jpg';

          return (
            <Link 
              key={tour._id} 
              href={`/tour/${tourSlug}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Image - 2 columns */}
                  <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {tour.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium rounded-full uppercase tracking-wide">
                          {tour.category}
                        </span>
                      </div>
                    )}
                    {tour.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-accent text-accent-foreground px-3 py-1 text-xs font-medium rounded-full">
                          {tour.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content - 3 columns */}
                  <div className="md:col-span-3 p-6 md:p-8">
                    {/* Rating */}
                    {(tour.rating || tour.reviewCount) && (
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{tour.rating || "4.9"}</span>
                        <span className="text-sm text-muted-foreground">
                          ({tour.reviewCount || "0"} reviews)
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-foreground text-xl md:text-2xl font-semibold leading-tight group-hover:text-primary transition-colors mb-3">
                      {tour.title}
                    </h3>
                    
                    {/* Description */}
                    {tour.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {typeof tour.description === 'string' ? tour.description : ''}
                      </p>
                    )}
                    
                    {/* Details & Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground block">From</span>
                          <span className="text-2xl font-semibold text-foreground">€{tour.price}</span>
                        </div>
                        <span className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium group-hover:bg-foreground transition-colors">
                          Book Now →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
