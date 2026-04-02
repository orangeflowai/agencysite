'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
  delay: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Emily R.',
    rating: 5,
    text: 'The hop-on hop-off bus was perfect for exploring!',
    verified: true,
    delay: 0,
  },
  {
    id: 2,
    name: 'David K.',
    rating: 5,
    text: 'Audio guide was informative and entertaining.',
    verified: true,
    delay: 2,
  },
  {
    id: 3,
    name: 'Sophie B.',
    rating: 5,
    text: 'Saw all the major sights in one day!',
    verified: true,
    delay: 4,
  },
];

export default function FloatingReviews() {
  return (
    <div className="relative w-full py-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: review.delay,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 8,
            }}
            className="bg-cream p-6 shadow-2xl max-w-xs border border-forest/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-forest text-cream flex items-center justify-center font-serif text-xl font-bold italic">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-serif font-bold italic text-forest">{review.name}</p>
                  {review.verified && (
                    <span className="text-[8px] font-black uppercase tracking-widest bg-forest/5 text-forest/40 px-2 py-1 border border-forest/10">
                      Authentic
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 fill-gold text-gold"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-forest/70 italic">"{review.text}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
