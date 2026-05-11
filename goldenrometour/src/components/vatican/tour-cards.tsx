"use client"

import { Clock, Users, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface Tour {
  _id: string
  title: string
  category?: string
  price: number
  duration: string
  mainImage?: any
  features?: string[]
  rating?: number
  reviews?: number
  badge?: string
  slug: { current: string }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0
  }
}

export default function TourCards({ tours }: { tours: Tour[] }) {
  // Limit to only 2 tours
  const displayTours = tours.slice(0, 2);
  
  // Smart fallback image function
  const getFallbackImage = (tour: Tour) => {
    const title = tour.title.toLowerCase();
    if (title.includes('sistine') || title.includes('skip') || title.includes('line')) {
      return 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=90';
    } else if (title.includes('vip') || title.includes('peter') || title.includes('basilica')) {
      return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=90';
    }
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=90';
  };

  return (
    <section id="tours" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 rounded-full mb-6 border border-accent/20">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              50,000+ Verified Guests
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Vatican <span className="italic text-accent">Essentials</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Two exclusive experiences curated for the discerning traveler. Skip-the-line access and expert guidance to the world's most sacred art collection.
          </p>
        </motion.div>

        {/* Tour Grid - Only 2 Tours */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayTours.map((tour) => {
            if (!tour || !tour.slug?.current) return null;
            
            // Ensure we have all the data
            const tourRating = tour.rating || 4.9;
            const tourReviews = tour.reviews || 216;
            const tourDuration = tour.duration || "3 hours";
            const tourPrice = tour.price || 45;
            const tourBadge = tour.badge || "Popular";
            const tourCategory = tour.category || "Vatican";
            
            // Get features with fallbacks
            const tourFeatures = tour.features && tour.features.length > 0 
              ? tour.features 
              : ["Skip the Line Access", "Expert Guide", "Small Group"];
            
            return (
              <motion.div 
                key={tour._id}
                variants={cardVariants}
                className="group bg-card rounded-[2rem] overflow-hidden border-2 border-border hover:border-accent/50 transition-all hover:shadow-2xl shadow-lg"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Image */}
                <div className="relative h-72 md:h-80 overflow-hidden bg-muted">
                  <Image 
                    src={
                      typeof tour.mainImage === 'string' 
                        ? tour.mainImage 
                        : (tour.mainImage?.asset?.url || getFallbackImage(tour))
                    }
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    priority
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  {tourBadge && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-xl backdrop-blur-sm uppercase tracking-wider">
                      {tourBadge}
                    </div>
                  )}
                  
                  {/* Category */}
                  <div className="absolute top-6 right-6 px-4 py-2 bg-card backdrop-blur-sm rounded-full text-xs font-bold text-foreground shadow-xl uppercase tracking-wider border border-border">
                    {tourCategory}
                  </div>
                  
                  {/* Rating on Image */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-bold text-foreground">{tourRating}</span>
                    <span className="text-xs text-muted-foreground">({tourReviews.toLocaleString()})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors leading-tight">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="font-medium">{tourDuration}</span>
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tourFeatures.slice(0, 3).map((feature: any, i: number) => {
                      const featureText = typeof feature === 'string' ? feature : (feature?.item || feature?.name || '');
                      if (!featureText) return null;
                      return (
                        <span 
                          key={i}
                          className="px-4 py-2 bg-accent/10 text-accent-foreground text-xs rounded-full font-bold border border-accent/30 uppercase tracking-wide"
                        >
                          {featureText}
                        </span>
                      );
                    })}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-border">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-1">From</span>
                      <p className="text-3xl font-bold text-foreground">
                        €{tourPrice}
                        <span className="text-base font-normal text-muted-foreground ml-1">/person</span>
                      </p>
                    </div>
                    <Link 
                      href={`/tour/${tour.slug.current}`} 
                      className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide text-sm"
                    >
                      Book Now
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No "View All" link - only 2 tours available */}
      </div>
    </section>
  )
}
