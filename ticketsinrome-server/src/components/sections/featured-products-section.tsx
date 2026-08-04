import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration: string;
  image?: string;
  slug: string;
  category?: string;
  rating?: string;
  reviews?: string;
  badge?: string;
}

interface FeaturedProductsSectionProps {
  tours: Tour[];
}

export function FeaturedProductsSection({ tours }: FeaturedProductsSectionProps) {
  const featuredTours = tours.slice(0, 6);

  if (featuredTours.length === 0) {
    return (
      <section className="bg-background py-24 px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Curated Experiences.<br />Unforgettable Memories.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">No tours available at the moment.</p>
      </section>
    );
  }

  return (
    <section id="featured" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-16">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Curated Experiences.<br />Unforgettable Memories.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Skip-the-line tours — Vatican, Colosseum & beyond.
        </p>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-6 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {featuredTours.map((tour) => (
          <div
            key={tour.id}
            className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
              <Image
                src={tour.image || "/placeholder.jpg"}
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
              {(tour.rating || tour.reviews) && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{tour.rating || "4.8"}</span>
                  <span className="text-sm text-muted-foreground">({tour.reviews || "0"} reviews)</span>
                </div>
              )}
              <h3 className="font-semibold text-foreground leading-snug mb-3 flex-1">
                {tour.title}
              </h3>
              {tour.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  {tour.duration}
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">From</p>
                  <p className="text-xl font-bold text-foreground">€{tour.price}</p>
                </div>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="text-center pb-20 -mt-8">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          View All Tours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
