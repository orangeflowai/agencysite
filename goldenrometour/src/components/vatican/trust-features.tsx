"use client"

import { Shield, CheckCircle, Headphones, Users } from "lucide-react"
import { useEffect, useRef } from "react"

const features = [
  {
    icon: Shield,
    title: "Rome Tour Experts",
    description: "Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified."
  },
  {
    icon: CheckCircle,
    title: "Worry-Free Booking",
    description: "Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher."
  },
  {
    icon: Headphones,
    title: "24 Hour Support",
    description: "Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday."
  },
  {
    icon: Users,
    title: "Excellent Service",
    description: "Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable."
  }
]

export default function TrustFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('trust-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '-100px' }
    )

    const items = sectionRef.current?.querySelectorAll('.trust-item')
    items?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/50 border-y border-border">
      <style>{`
        .trust-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .trust-item.trust-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .trust-item:nth-child(1) { transition-delay: 0s; }
        .trust-item:nth-child(2) { transition-delay: 0.1s; }
        .trust-item:nth-child(3) { transition-delay: 0.2s; }
        .trust-item:nth-child(4) { transition-delay: 0.3s; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="trust-item text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Trusted by 50,000+ Travelers
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground">
            Why Choose <span className="italic">Golden Rome</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="trust-item p-6 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
