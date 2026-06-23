"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, Shield, Clock, Users } from "lucide-react"

interface HeroProps {
  title?: string
  subtitle?: string
  heroImage?: string
}

const marqueeItems = [
  "✦ Official Vatican Partner",
  "✦ Skip-the-Line Access",
  "✦ Licensed Art Historians",
  "✦ 50,000+ Travelers",
  "✦ Free Cancellation",
  "✦ Instant Confirmation",
]

export default function VaticanHeroSection({
  title = "Vatican Museums & Sistine Chapel",
  subtitle = "Skip the queue. Experience the masterpieces.",
  heroImage,
}: HeroProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    // Seamless CSS marquee using animation
    const el = marqueeRef.current
    if (!el) return
    // nothing needed — pure CSS animation handles it
  }, [])

  const trustItems = [
    { icon: Star, label: "4.9 Rating", sublabel: "3,000+ reviews" },
    { icon: Shield, label: "Free Cancellation", sublabel: "Up to 24h before" },
    { icon: Clock, label: "Skip the Line", sublabel: "Priority access" },
    { icon: Users, label: "Small Groups", sublabel: "Max 24 per guide" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage || "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1920"}
          alt="Vatican Museums — Sistine Chapel"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
        <div
          className="transition-all duration-700"
          style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-6">
            Official Vatican Access Partner
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-8 max-w-5xl mx-auto">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#tours"
              className="px-8 py-4 bg-accent text-foreground font-bold rounded-full text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors shadow-xl shadow-accent/20"
            >
              Book Skip-the-Line
            </a>
            <a
              href="/tour/vatican-museums-and-sistine-chapel-guided-tour"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full text-sm uppercase tracking-widest hover:bg-white/20 transition-colors border border-white/20"
            >
              View Guided Tours
            </a>
          </div>
        </div>

        {/* Trust Items */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full transition-all duration-700 delay-300"
          style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(16px)' }}
        >
          {trustItems.map(({ icon: Icon, label, sublabel }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
            >
              <Icon className="w-5 h-5 text-accent" />
              <span className="text-white font-bold text-sm">{label}</span>
              <span className="text-white/60 text-xs">{sublabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-3 overflow-hidden">
        <div
          ref={marqueeRef}
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'marqueeScroll 30s linear infinite' }}
        >
          {[...Array(3)].flatMap(() =>
            marqueeItems.map((item, i) => (
              <span key={`${item}-${i}`} className="text-xs font-bold uppercase tracking-widest text-white/60">
                {item}
              </span>
            ))
          )}
        </div>
        <style>{`
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </section>
  )
}
