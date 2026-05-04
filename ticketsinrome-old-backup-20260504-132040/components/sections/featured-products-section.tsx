"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FadeImage } from "@/components/fade-image";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Tour {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  price: number;
  duration?: string;
  category?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  rating?: number;
  reviewCount?: number;
}

export function FeaturedProductsSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true);
        const response = await fetch("/api/tours?featured=true&limit=6");
        
        if (!response.ok) {
          throw new Error("Failed to load tours");
        }
        
        const data = await response.json();
        setTours(data);
        setError(null);
      } catch (err) {
        console.error("Error loading tours:", err);
        setError("Failed to load tours. Please try again later.");
        setTours([]);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  return (
    <section id="vatican" className="bg-background">
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

      {/* Error State */}
      {error && (
        <div className="px-6 py-4 mb-8 text-center text-red-600 bg-red-50 rounded-lg md:px-12 lg:px-20">
          {error}
        </div>
      )}

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : tours.length > 0 ? (
          // Tours list
          tours.map((tour) => (
            <Link
              key={tour.id || tour._id}
              href={`/tour/${tour.slug}`}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <FadeImage
                  src={tour.mainImage?.url || "/placeholder.jpg"}
                  alt={tour.mainImage?.alt || tour.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-foreground text-background px-3 py-1 text-xs font-medium rounded-full">
                    {tour.category || "Tour"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span className="text-sm font-medium">
                    {tour.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({tour.reviewCount || 0} reviews)
                  </span>
                </div>
                <h3 className="text-foreground text-xl font-semibold line-clamp-2">
                  {tour.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-muted-foreground">
                    {tour.duration || "3 hours"}
                  </span>
                  <span className="text-lg font-medium">
                    From €{tour.price || "0"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No tours available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
