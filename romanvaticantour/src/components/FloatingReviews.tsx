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
            className="bg-card backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-serif font-bold text-[#5c4b3e]">{review.name}</p>
                  {review.verified && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans  font-bold tracking-widest">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-accent text-accent"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#85766a] font-sans">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
