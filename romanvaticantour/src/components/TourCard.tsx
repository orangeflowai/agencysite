'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Clock, Star, Users, ArrowRight, MapPin, Zap } from 'lucide-react'
import { urlFor } from '@/lib/dataAdapter'
import type { Tour } from '@/lib/dataAdapter'

const FALLBACK = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'

interface TourCardProps {
  tour: Tour
  dark?: boolean
}

export default function TourCard({ tour, dark = false }: TourCardProps) {
  const [imgErr, setImgErr] = useState(false)

  const img = imgErr ? FALLBACK
    : tour.mainImage?.asset?.url ? tour.mainImage.asset.url
    : typeof tour.mainImage === 'string' ? tour.mainImage
    : tour.mainImage ? urlFor(tour.mainImage).width(800).height(560).url()
    : FALLBACK

  const rating = tour.rating ?? 4.9
  const reviews = (tour as any).reviewCount ?? 0
  const badge = (tour as any).badge as string | undefined

  return (
    <Link
      href={`/tour/${tour.slug.current}`}
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden border h-full transition-all duration-300 hover:-translate-y-1",
        dark
          ? "bg-[#413c33] border-white/10 hover:shadow-[0_24px_48px_rgba(141,157,79,0.2)]"
          : "bg-card border-border hover:shadow-[0_24px_48px_rgba(141,157,79,0.12)]",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={img}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => setImgErr(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#5c4b3e] text-[10px] font-sans font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
            {tour.category || 'Rome'}
          </span>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-sans font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
              <Zap className="w-2.5 h-2.5" />{badge}
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-white text-xs font-bold">{rating}</span>
          {reviews > 0 && <span className="text-white/60 text-[10px]">({reviews})</span>}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 z-10 text-right">
          <span className="text-white/70 text-[9px] font-sans font-black uppercase tracking-widest block leading-none mb-0.5">From</span>
          <span className="text-white font-serif font-black text-xl leading-none italic">€{tour.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-3 text-muted-foreground font-sans">
          {tour.duration && (
            <span className={["flex items-center gap-1 text-xs font-medium", dark ? "text-white/50" : ""].join(" ")}>
              <Clock className="w-3.5 h-3.5 shrink-0 text-primary" />{tour.duration}
            </span>
          )}
          {(tour as any).groupSize && (
            <span className={["flex items-center gap-1 text-xs font-medium", dark ? "text-white/50" : ""].join(" ")}>
              <Users className="w-3.5 h-3.5 shrink-0 text-primary" />{(tour as any).groupSize}
            </span>
          )}
        </div>

        <h3 className={["font-serif font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 italic", dark ? "text-white" : "text-[#5c4b3e]"].join(" ")}>
          {tour.title}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {['Skip the Line', 'Expert Guide', 'Small Group'].map(tag => (
            <span key={tag} className={["text-[10px] px-2 py-0.5 rounded-full font-sans font-black uppercase tracking-widest", dark ? "bg-white/10 text-white/60" : "bg-muted text-[#85766a]"].join(" ")}>
              {tag}
            </span>
          ))}
        </div>

        <div className={["mt-auto pt-3 border-t flex items-center justify-between", dark ? "border-white/10" : "border-border"].join(" ")}>
          <span className="text-[10px] font-sans font-black text-primary uppercase tracking-[0.2em]">Book Now</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-200 shrink-0">
            <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-200" />
          </div>
        </div>
      </div>
    </Link>
  )
}
