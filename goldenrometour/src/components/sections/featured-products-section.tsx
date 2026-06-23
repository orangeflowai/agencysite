import Image from "next/image";
import { Star, Clock, Users, Check, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

// Fallback Pexels images by category so cards never appear blank
const CATEGORY_FALLBACKS: Record<string, string> = {
  vatican:
    "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=800",
  colosseum:
    "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800",
  city: "https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=800",
  "hidden-gems":
    "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800",
};
const DEFAULT_FALLBACK =
  "https://images.pexels.com/photos/1174136/pexels-photo-1174136.jpeg?auto=compress&cs=tinysrgb&w=800";

function getImage(tour: Tour): string {
  if (tour.image && tour.image.startsWith("http")) return tour.image;
  return CATEGORY_FALLBACKS[tour.category || ""] || DEFAULT_FALLBACK;
}

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

const tourHighlights: Record<string, string[]> = {
  "vatican-museums-and-sistine-chapel-guided-tour": [
    "Expert art historian guide",
    "Skip-the-line entry included",
    "Raphael's Rooms & Gallery of Maps",
    "Small group (max 24)",
  ],
  "vatican-museums-sistine-chapel-skip-the-line": [
    "Priority skip-the-line entry",
    "Explore at your own pace",
    "Instant mobile voucher",
    "Flexible duration",
  ],
};

export function FeaturedProductsSection({ tours }: FeaturedProductsSectionProps) {
  const featuredTours = tours.slice(0, 2);

  if (featuredTours.length === 0) {
    return (
      <section id="tours" className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-medium tracking-tight text-foreground md:text-4xl">
            Vatican Museums &amp; Sistine Chapel
          </h2>
          <p className="mt-6 text-base text-muted-foreground">No tours available at the moment.</p>
        </div>
      </section>
    );
  }

  // Only 2 tours — render as side-by-side feature cards
  const hasTwoTours = featuredTours.length === 2;

  return (
    <section id="tours" className="bg-background py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">
            Official Vatican Access
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6">
            Vatican Museums
            <br />
            <span className="text-muted-foreground font-normal">&amp; Sistine Chapel</span>
          </h2>
          <p className="max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
            Choose your ideal Vatican experience — expert-guided or fully self-guided, both with
            official skip-the-line access.
          </p>
        </div>

        {/* Tour cards grid */}
        <div className={`grid gap-8 ${hasTwoTours ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
          {featuredTours.map((tour, index) => {
            const highlights = tourHighlights[tour.slug] || [];
            const isGuided = index === 0;

            return (
              <div
                key={tour.id}
                className={`group relative bg-card rounded-3xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 ${
                  isGuided ? "border-accent/30" : "border-border"
                }`}
              >
                {/* Featured badge for guided tour */}
                {isGuided && (
                  <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                    <div className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-[0.25em] px-6 py-1.5 rounded-b-xl">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                  <Image
                    src={getImage(tour)}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

                  {/* Tour type pill */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    {isGuided ? (
                      <span className="flex items-center gap-1.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                        <Users className="w-3 h-3" />
                        Guided Tour
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                        <Zap className="w-3 h-3" />
                        Skip-the-Line
                      </span>
                    )}
                    {tour.badge && !isGuided && (
                      <span className="bg-accent/90 text-accent-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                        {tour.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {tour.rating || "4.9"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({Number(tour.reviews || 0).toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground leading-tight mb-3 group-hover:text-accent transition-colors">
                    {tour.title}
                  </h3>

                  {/* Description */}
                  {tour.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                      {tour.description}
                    </p>
                  )}

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {isGuided ? "Up to 24 guests" : "Self-guided"}
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">€{tour.price}</span>
                        <span className="text-xs text-muted-foreground">/ person</span>
                      </div>
                    </div>
                    <Link
                      href={`/tour/${tour.slug}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all shadow-md active:scale-95 ${
                        isGuided
                          ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
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

        {/* Trust row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {[
            { value: "50,000+", label: "Happy Travelers" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "24h", label: "Free Cancellation" },
            { value: "Instant", label: "Ticket Delivery" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-serif font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
