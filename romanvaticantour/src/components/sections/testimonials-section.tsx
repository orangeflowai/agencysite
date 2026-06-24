"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "New York, USA",
    quote: "The skip-the-line access saved us hours. Our guide Marco brought ancient Rome to life in ways no guidebook could.",
    rating: 5,
  },
  {
    name: "James & Emily",
    location: "London, UK",
    quote: "Absolutely worth every penny. The Colosseum underground tour was the highlight of our entire trip to Italy.",
    rating: 5,
  },
  {
    name: "Hans K.",
    location: "Munich, Germany",
    quote: "Professional, punctual, and incredibly knowledgeable. The Vatican tour exceeded all our expectations.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Official entry protocols for Vatican Museums, Colosseum, and all major Rome attractions.
          Curated experiences by accredited art historians for travelers who refuse to wait in line.
        </p>
      </div>

      {/* Testimonials */}
      <div className="px-6 pb-16 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="border border-border rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Image */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src="https://images.unsplash.com/photo-1525874683057-6e1cef3d3e85?w=1600&q=80"
          alt="Roman Forum at sunset"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}
