import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

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
}

interface FeaturedProductsSectionProps {
  tours: Tour[];
}

export function FeaturedProductsSection({ tours }: FeaturedProductsSectionProps) {
  // Display exactly 2 Vatican tours (skip-the-line and guided)
  const featuredTours = tours.slice(0, 2);

  if (featuredTours.length === 0) {
    return (
      <section id="vatican" className="bg-background">
        <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vatican Museums & Sistine Chapel
            <br />
            Official Access
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
            No tours available at the moment
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="vatican" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Vatican Museums & Sistine Chapel
          <br />
          Official Access
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
          Choose between our two exclusive Vatican experiences
        </p>
      </div>

      {/* Tours Dropdown - Vertical Stack */}
      <div className="max-w-4xl mx-auto px-6 pb-20 md:px-12 lg:px-20 space-y-6">
        {featuredTours.map((tour) => (
          <Link 
            key={tour.id} 
            href={`/tour/${tour.slug}`}
            className="group cursor-pointer block"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image - 2 columns */}
                <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 overflow-hidden">
                  <Image
                    src={tour.image || "/images/1.jpg"}
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
                </div>

                {/* Content - 3 columns */}
                <div className="md:col-span-3 p-8">
                  {/* Rating */}
                  {(tour.rating || tour.reviews) && (
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-foreground text-foreground" />
                      <span className="text-sm font-medium">{tour.rating || "4.9"}</span>
                      <span className="text-sm text-muted-foreground">
                        ({tour.reviews || "0"} reviews)
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-foreground text-2xl font-semibold leading-tight group-hover:text-primary transition-colors mb-3">
                    {tour.title}
                  </h3>
                  
                  {/* Description */}
                  {tour.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {tour.description}
                    </p>
                  )}
                  
                  {/* Details & Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{tour.duration}</span>
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
        ))}
      </div>
    </section>
  );
}
