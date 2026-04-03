'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, ThumbsUp } from 'lucide-react';

const features = [
  {
    Icon: Award,
    title: 'ROME TOUR\nEXPERTS',
    description: 'Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified.',
  },
  {
    Icon: Shield,
    title: 'WORRY-FREE\nBOOKING',
    description: 'Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher.',
  },
  {
    Icon: Clock,
    title: '24 HOUR\nSUPPORT',
    description: 'Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday.',
  },
  {
    Icon: ThumbsUp,
    title: 'EXCELLENT\nCUSTOMER SERVICE',
    description: 'Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable.',
  },
];

export default function TrustBadges() {
  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {features.map(({ Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.12 }}
            className="flex flex-col items-center text-center group"
          >
            {/* Circular Icon Container */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 shadow-sm"
              style={{ backgroundColor: '#F5F0E8', border: '2px solid rgba(201,168,76,0.2)' }}
            >
              <Icon className="w-9 h-9" style={{ color: '#C9A84C' }} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3
              className="font-bold text-sm tracking-widest mb-3 uppercase leading-snug whitespace-pre-line"
              style={{ color: '#1A1210', fontFamily: 'var(--font-sans, sans-serif)' }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-xs leading-relaxed max-w-[180px]"
              style={{ color: '#6B5C45' }}
            >
              {description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Platform trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-10 mt-14 pt-10 flex-wrap opacity-50 hover:opacity-100 transition-opacity duration-500"
        style={{ borderTop: '1px solid rgba(26,18,16,0.1)' }}
      >
        {[['TripAdvisor', '★★★★★'], ['Google', '★★★★★'], ['Viator Elite', ''], ['GetYourGuide', '']].map(([name, stars]) => (
          <div key={name} className="flex items-center gap-2">
            <span className="font-serif text-base font-bold italic" style={{ color: '#1A1210' }}>{name}</span>
            {stars && <span className="text-xs" style={{ color: '#C9A84C' }}>{stars}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
