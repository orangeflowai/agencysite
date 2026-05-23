"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer L.",
    location: "Boston, USA",
    quote: "The Vatican skip-the-line tour was phenomenal. Our art historian guide revealed details about the Sistine Chapel I never would have noticed. Worth every euro!",
    rating: 5,
  },
  {
    name: "David & Claire",
    location: "Sydney, Australia",
    quote: "We booked both Vatican tours - skip-the-line and guided. The guided tour with an expert was absolutely transformative. Michelangelo's work came alive!",
    rating: 5,
  },
  {
    name: "Maria G.",
    location: "Barcelona, Spain",
    quote: "No waiting, no stress. Direct entry to the Vatican Museums and St. Peter's Basilica. The small group size made it feel like a private tour.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Exclusive Vatican access with certified art historians. 
          Skip 3-hour queues and experience Michelangelo's masterpieces with expert insights. 
          Two carefully curated tours for the discerning traveler.
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
          src="/images/5.jpg"
          alt="Vatican Museums interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}
