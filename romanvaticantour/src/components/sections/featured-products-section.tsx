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
  groupSize?: string;
  features?: string[];
  includes?: string[];
}

interface FeaturedProductsSectionProps {
  tours: Tour[];
}

export function FeaturedProductsSection({ tours }: FeaturedProductsSectionProps) {
  // Take first 6 tours for featured section
  const featuredTours = tours.slice(0, 6);

  if (featuredTours.length === 0) {
    return (
      <section id="tours" className="bg-background">
        <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Curated Experiences.
            <br />
            Unforgettable Memories.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">
            We&apos;re preparing our exclusive collection of skip-the-line Vatican, Colosseum, and Rome tours.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/category/vatican" className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Vatican Tours
            </Link>
            <Link href="/category/colosseum" className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Colosseum Tours
            </Link>
            <Link href="/category/city" className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              City Tours
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Curated Experiences.
          <br />
          Unforgettable Memories.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Skip-the-Line Tours
        </p>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {featuredTours.map((tour) => (
          <Link 
            key={tour.id} 
            href={`/tour/${tour.slug}`}
            className="group cursor-pointer block"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={tour.image || "/placeholder.jpg"}
                alt={tour.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 animate-fade-in"
              />
              {tour.category && (
                <div className="absolute top-4 left-4">
                  <span className="bg-foreground text-background px-3 py-1 text-xs font-medium rounded-full">
                    {tour.category}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="py-6">
              {(tour.rating || tour.reviews) && (
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span className="text-sm font-medium">{tour.rating || "4.8"}</span>
                  <span className="text-sm text-muted-foreground">
                    ({tour.reviews || "0"} reviews)
                  </span>
                </div>
              )}
              <h3 className="text-foreground text-xl font-semibold leading-tight">
                {tour.title}
              </h3>
              {tour.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {tour.description}
                </p>
              )}
              {tour.features && tour.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tour.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {f}
                    </span>
                  ))}
                  {tour.features.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{tour.features.length - 3} more</span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-sm text-muted-foreground">{tour.duration}</span>
                  {tour.groupSize && (
                    <span className="text-xs text-muted-foreground block">{tour.groupSize}</span>
                  )}
                </div>
                <span className="text-lg font-medium">From €{tour.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
