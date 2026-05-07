"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Users, Star, ChevronDown } from "lucide-react"
import Image from "next/image"
import { urlFor } from "@/lib/dataAdapter"

interface TourHeroProps {
  title: string
  mainImage: any
  category?: string
  duration?: string
  groupSize?: string
  rating?: number
  reviewCount?: number
}

export default function VaticanTourHeroFull({ 
  title, 
  mainImage, 
  category, 
  duration, 
  groupSize, 
  rating, 
  reviewCount 
}: TourHeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const opacity = Math.max(0, 1 - scrollY / 500)
  const scale = 1 + scrollY / 2000
  const blur = Math.min(10, scrollY / 50)

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image with Parallax and Scale */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale }}
      >
        <img 
          src={urlFor(mainImage).width(1920).quality(90).url()} 
          alt={title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
      </motion.div>

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
            {category || "Vatican Archives"}
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] tracking-tight">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 2 ? "italic block" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80 font-sans font-semibold uppercase tracking-widest text-[10px] pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>{duration} Duration</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>{groupSize || 'Private / Small Group'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{rating || '5.0'} / {reviewCount || 100} Reviews</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50 flex flex-col items-center gap-2"
        style={{ opacity }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Explore Dossier</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Side Label */}
      <div className="absolute left-10 bottom-20 hidden lg:block overflow-hidden h-32">
        <div className="rotate-90 origin-left text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">
          Official Vatican Partner • 2024 Protocol
        </div>
      </div>
    </section>
  )
}
