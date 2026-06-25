import Link from 'next/link';
import { Clock, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface TourCardWideProps {
  tour: {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration: string;
    description: any;
    highlights?: string[];
    includes?: string[];
    rating?: number;
    reviewCount?: number;
    groupSize?: string;
    badge?: string;
    mainImage?: any;
  };
  imageFirst?: boolean;
}

function getFallbackImage(slug: string): string {
  if (slug.includes('guided')) return '/vatican-museums.jpg';
  if (slug.includes('skip')) return '/vatican-sistine-chapel.jpg';
  return '/vatican-museums.jpg';
}

export default function TourCardWide({ tour, imageFirst = true }: TourCardWideProps) {
  const slug = tour.slug?.current || '';
  const imageUrl = tour.mainImage?.asset?.url || getFallbackImage(slug);
  const highlights = tour.highlights?.slice(0, 4) || [];
  const includes = tour.includes?.slice(0, 3) || [];
  const description = typeof tour.description === 'string'
    ? tour.description
    : tour.description?.[0]?.children?.[0]?.text || '';

  const imageBlock = (
    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto">
      <img
        src={imageUrl}
        alt={tour.title}
        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
      />
      {tour.badge && (
        <span className="absolute top-4 left-4 bg-accent text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {tour.badge}
        </span>
      )}
    </div>
  );

  const contentBlock = (
    <div className="flex flex-col justify-center py-4">
      <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 leading-tight">
        {tour.title}
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-5 line-clamp-3">
        {description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          {tour.duration}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          {tour.groupSize || 'Small Group'}
        </span>
        {(tour.rating || tour.reviewCount) && (
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-accent text-accent" />
            {tour.rating || '4.9'} ({tour.reviewCount || 0} reviews)
          </span>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <ul className="space-y-2 mb-5">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <span className="text-3xl font-bold text-foreground font-heading">€{tour.price}</span>
          <span className="text-muted-foreground text-sm ml-1">/ person</span>
        </div>
        <Link
          href={`/tour/${slug}`}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all group"
        >
          View Tour
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  return (
    <div id="tours" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {imageFirst ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}
