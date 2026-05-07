"use client"

import { useEffect, useRef } from "react"
import { Star, Quote, CheckCircle } from "lucide-react"

const testimonials = [
  {
    name: "James H.",
    location: "USA",
    text: "We did the Sistine Chapel after-hours tour and it was absolutely transcendent. Standing alone in that space was something I'll never forget.",
    avatar: "J"
  },
  {
    name: "Maria G.",
    location: "UK",
    text: "Francesca made the Vatican Museums come alive. The skip-the-line access was a lifesaver — we saw three times more than friends!",
    avatar: "M"
  },
  {
    name: "Robert D.",
    location: "Australia",
    text: "The Colosseum and Forum tour exceeded every expectation. Our guide knew exactly where to stand and turned chaos into pure magic.",
    avatar: "R"
  },
  {
    name: "Sophie B.",
    location: "France",
    text: "As a Catholic, visiting the Vatican had been a lifelong dream. Golden Rome turned it into reality. The personal guide was extraordinary.",
    avatar: "S"
  },
  {
    name: "Alessandro R.",
    location: "Italy",
    text: "Even as a Roman, I learned things I never knew. The private Vatican Gardens walk at sunset is a completely different world.",
    avatar: "A"
  },
  {
    name: "Chen W.",
    location: "Singapore",
    text: "Totally worth it for the early morning access to the Sistine Chapel alone. Absolute silence, golden light — magical.",
    avatar: "C"
  }
]

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const animate = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 0.5
      }
    }

    const interval = setInterval(animate, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Verified Feedback
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Guest Log <span className="italic">Archives</span>
          </h2>
        </div>
      </div>

      {/* Scrolling Testimonials */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-hidden px-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {[...testimonials, ...testimonials].map((testimonial, i) => (
          <div 
            key={i}
            className="flex-shrink-0 w-[350px] md:w-[400px] p-6 bg-card rounded-2xl border border-border"
          >
            <Quote className="w-8 h-8 text-accent/30 mb-4" />
            <p className="text-foreground leading-relaxed mb-6">
              &quot;{testimonial.text}&quot;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
