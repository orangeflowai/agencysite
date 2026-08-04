import { Header } from '@/components/header';
import { FooterSection } from '@/components/sections/footer-section';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { getTours } from '@/lib/sanityService';

export const revalidate = 0;

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              All Tours
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Skip-the-line access to Rome's greatest landmarks — Vatican, Colosseum, and beyond.
            </p>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => {
                const imageUrl = tour.mainImage?.asset?.url || '/placeholder.jpg';
                const slug = tour.slug?.current || '';
                const price = tour.price || 0;
                const rating = tour.rating ?? 4.8;
                const reviewCount = tour.reviewCount ?? 0;

                return (
                  <div
                    key={tour._id}
                    className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
                      <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      {tour.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-foreground text-background px-3 py-1 text-xs font-semibold rounded-full">
                            {tour.badge}
                          </span>
                        </div>
                      )}
                      {tour.category && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs font-medium rounded-full capitalize border border-border">
                            {tour.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Rating */}
                      {reviewCount > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold">{rating}</span>
                          <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-semibold text-foreground leading-snug mb-3 flex-1">
                        {tour.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        {tour.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {tour.duration}
                          </span>
                        )}
                        {tour.groupSize && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {tour.groupSize}
                          </span>
                        )}
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">From</p>
                          <p className="text-xl font-bold text-foreground">€{price}</p>
                        </div>
                        <Link
                          href={`/tours/${slug}`}
                          className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted rounded-2xl border border-border">
              <p className="text-lg font-medium text-muted-foreground">No tours available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
