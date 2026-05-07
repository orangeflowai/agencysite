"use client"

import { Clock, Users, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
            <span className="text-xs font-medium text-foreground uppercase tracking-wider">
              50K+ Guests
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Best Selling <span className="italic">Archives</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Curated selection of our most popular Vatican and Rome experiences
          </p>
        </motion.div>

        {/* Tour Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tours.map((tour) => {
            if (!tour || !tour.slug?.current) return null;
            return (
              <motion.div 
                key={tour._id}
                variants={cardVariants}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all hover:shadow-xl"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img 
                    src={typeof tour.mainImage === 'string' ? tour.mainImage : (tour.mainImage?.asset?.url || "/placeholder.jpg")} 
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {tour.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      {tour.badge}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                    {tour.category || "Tour"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-foreground">{tour.rating || 4.9}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({(tour.reviews || 850).toLocaleString()} reviews)
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-3 group-hover:text-accent transition-colors">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tour.duration || "3 hours"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(tour.features || ["Skip the Line", "Professional Guide"]).map((feature: any, i: number) => {
                      // Handle both string and object formats
                      const featureText = typeof feature === 'string' ? feature : (feature?.item || feature?.name || '');
                      if (!featureText) return null;
                      return (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                        >
                          {featureText}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-sm text-muted-foreground">From</span>
                      <p className="text-2xl font-semibold text-foreground">
                        €{tour.price}
                        <span className="text-sm font-normal text-muted-foreground">/person</span>
                      </p>
                    </div>
                    <Link href={`/tour/${tour.slug.current}`} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                      Book Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors"
          >
            View All Tours
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
