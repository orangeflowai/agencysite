"use client"

import { useEffect, useRef } from "react"
import { Star, Shield, Clock, Users } from "lucide-react"

interface HeroProps {
  title?: string
  subtitle?: string
  heroImage?: string
}

export default function VaticanHeroSection({ title, subtitle, heroImage }: HeroProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const animate = () => {
      if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
        marquee.scrollLeft = 0
      } else {
        marquee.scrollLeft += 0.5
      }
    }

    const interval = setInterval(animate, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Trust Banner - Marquee */}
      <div className="bg-primary text-primary-foreground py-2.5 overflow-hidden">
        <div 
          ref={marqueeRef}
          className="flex gap-8 whitespace-nowrap overflow-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <span className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-current" />
                Official Vatican Partner
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                Skip the Line Priority Access
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Curator-Led Historian Routes
              </span>
              <span className="text-sm opacity-60">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="flex-1 relative pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage || "/vatican-sistine-chapel.jpg"} 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm">
              <div className="flex items-center -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">50,000+ Verified Reviews</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-medium">
              Official Vatican Partner
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6">
              {title || "Rome's Greatest Archives, Reopened."}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {subtitle || "Bypass the 3-hour queues with confirmed priority entry. Curated small group experiences led by accredited art historians."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#tours" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Explore the Archive
              </a>
              <a 
                href="#colosseum" 
                className="w-full sm:w-auto px-8 py-4 bg-card text-foreground font-medium rounded-full border border-border hover:bg-secondary transition-all"
              >
                Colosseum Access
              </a>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: "TripAdvisor", rating: "5.0" },
              { icon: Star, label: "Google", rating: "4.9" },
              { icon: Users, label: "Viator", value: "Elite" },
              { icon: Clock, label: "GetYourGuide", value: "Certified" },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex flex-col items-center p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50"
              >
                <item.icon className="w-5 h-5 text-accent mb-2" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">
                  {item.rating ? (
                    <span className="flex items-center gap-1">
                      {item.rating}
                      <Star className="w-3 h-3 fill-accent text-accent" />
                    </span>
                  ) : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
