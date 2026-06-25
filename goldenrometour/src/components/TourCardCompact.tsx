import Link from 'next/link';
import { ArrowRight, Clock, Star } from 'lucide-react';

interface TourCardCompactProps {
  tour: {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration: string;
    rating?: number;
    reviewCount?: number;
    mainImage?: any;
  };
}

function getFallbackImage(slug: string): string {
  if (slug.includes('guided')) return '/vatican-museums.jpg';
  if (slug.includes('skip')) return '/vatican-sistine-chapel.jpg';
  return '/vatican-museums.jpg';
}

export default function TourCardCompact({ tour }: TourCardCompactProps) {
  const slug = tour.slug?.current || '';
  const imageUrl = tour.mainImage?.asset?.url || getFallbackImage(slug);

  return (
    <Link
      href={`/tour/${slug}`}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/30"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
          {tour.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {tour.duration}
          </span>
          {(tour.rating || tour.reviewCount) && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              {tour.rating || '4.9'}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-heading text-xl font-bold text-foreground">€{tour.price}</span>
          <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            View <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
