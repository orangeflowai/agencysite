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
          Choose between our two exclusive Vatican experiences: Skip-the-Line for independent exploration or Guided Tour for expert insights
        </p>
      </div>

      {/* Tours Grid - 2 Column Layout for Premium Display */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 px-6 pb-20 md:grid-cols-2 md:px-12 lg:px-20">
        {featuredTours.map((tour) => (
          <Link 
            key={tour.id} 
            href={`/tour/${tour.slug}`}
            className="group cursor-pointer block"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={tour.image || "/images/1.jpg"}
                alt={tour.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 animate-fade-in"
              />
              {tour.category && (
                <div className="absolute top-4 left-4">
                  <span className="bg-foreground text-background px-4 py-2 text-xs font-medium rounded-full uppercase tracking-wide">
                    {tour.category}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="py-6">
              {(tour.rating || tour.reviews) && (
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span className="text-sm font-medium">{tour.rating || "4.9"}</span>
                  <span className="text-sm text-muted-foreground">
                    ({tour.reviews || "0"} reviews)
                  </span>
                </div>
              )}
              <h3 className="text-foreground text-2xl font-semibold leading-tight group-hover:text-primary transition-colors">
                {tour.title}
              </h3>
              {tour.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {tour.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">{tour.duration}</span>
                <span className="text-xl font-semibold text-foreground">From €{tour.price}</span>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium group-hover:bg-foreground transition-colors">
                  Book Now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
