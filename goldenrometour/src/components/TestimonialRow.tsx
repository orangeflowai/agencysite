'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'London, UK',
    text: 'Our guide was an art historian who made the Sistine Chapel come alive. We learned more in 3 hours than we would have in days on our own. Worth every euro.',
    rating: 5,
    tour: 'Guided Tour',
  },
  {
    name: 'Michael & Lisa K.',
    location: 'New York, USA',
    text: 'The skip-the-line ticket saved us at least 2 hours in the queue. Got in before the crowds and had the Raphael Rooms almost to ourselves. Incredible.',
    rating: 5,
    tour: 'Skip-the-Line',
  },
  {
    name: 'Jean-Pierre D.',
    location: 'Paris, France',
    text: "The organisation was flawless — instant mobile tickets, clear meeting point, and the guide was waiting for us with a sign. Couldn't have been easier.",
    rating: 5,
    tour: 'Guided Tour',
  },
  {
    name: 'Elena R.',
    location: 'Barcelona, Spain',
    text: 'Took the skip-the-line option and loved the flexibility. The included map was surprisingly detailed and made navigating the museums a breeze.',
    rating: 5,
    tour: 'Skip-the-Line',
  },
];

export default function TestimonialRow() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-accent-text text-accent text-2xl md:text-3xl mb-2">What Travelers Say</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">
          Trusted by Thousands
        </h2>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-md border border-border min-h-[200px] flex flex-col justify-center">
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl text-foreground font-heading italic leading-relaxed mb-6">
              &ldquo;{testimonials[current].text}&rdquo;
            </blockquote>
            <cite className="not-italic">
              <span className="font-semibold text-foreground">{testimonials[current].name}</span>
              <span className="text-muted-foreground"> — {testimonials[current].location}</span>
              <span className="block text-xs text-primary mt-1 font-medium">{testimonials[current].tour}</span>
            </cite>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all',
                    i === current ? 'bg-primary w-6' : 'bg-border hover:bg-muted-foreground/30'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
