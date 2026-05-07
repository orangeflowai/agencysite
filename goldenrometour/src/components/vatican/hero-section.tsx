"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Shield, Clock, Users } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroProps {
  title?: string
  subtitle?: string
  heroImage?: string
}

export default function VaticanHeroSection({ title, subtitle, heroImage }: HeroProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

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
    <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
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
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <img 
            src={heroImage || "/vatican-sistine-chapel.jpg"} 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background/95" />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto"
          style={{ opacity }}
        >
          {/* Badge */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 shadow-sm">
              <div className="flex items-center -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm font-medium text-white">50,000+ Verified Reviews</span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.p 
              className="text-sm uppercase tracking-widest text-white/80 mb-4 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Official Vatican Partner
            </motion.p>
            <motion.h1 
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {title || "Rome's Greatest Archives, Reopened."}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {subtitle || "Bypass the 3-hour queues with confirmed priority entry. Curated small group experiences led by accredited art historians."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a 
                href="#tours" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-white hover:text-foreground transition-all shadow-lg hover:shadow-xl"
              >
                Explore the Archive
              </a>
              <a 
                href="/tour/vip-vatican-museum-sistine-chapel-st-basilica" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 hover:bg-white hover:text-foreground transition-all"
              >
                VIP Tour
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
