'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, Clock, MapPin, ThumbsUp } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secure Booking',
    subtitle: 'SSL Encrypted',
  },
  {
    icon: Award,
    title: 'Top Rated',
    subtitle: '4.9 / 5 Stars',
  },
  {
    icon: CheckCircle,
    title: 'Certified Guides',
    subtitle: 'Vatican Licensed',
  },
  {
    icon: MapPin,
    title: 'Best Price',
    subtitle: 'Guaranteed',
  },
  {
    icon: Clock,
    title: 'Free Cancel',
    subtitle: '24h Before Tour',
  },
  {
    icon: ThumbsUp,
    title: '50,000+',
    subtitle: 'Happy Pilgrims',
  },
];

export default function TrustBadges() {
  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto px-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              <div
                className="w-14 h-14 mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.35)',
                  borderRadius: '2px',
                  color: '#C9A84C',
                }}
              >
                <Icon size={22} />
              </div>
              <h3
                className="font-nav font-bold text-[11px] uppercase tracking-widest mb-1"
                style={{ color: '#1A1210' }}
              >
                {badge.title}
              </h3>
              <p className="text-[10px] font-sans" style={{ color: '#3D1A6E' }}>
                {badge.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Review platforms row */}
      <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-sans" style={{ color: '#1A1210' }}>
          <span className="font-black text-lg" style={{ color: '#00AA6C' }}>●</span>
          <span>TripAdvisor</span>
          <span style={{ color: '#C9A84C' }}>★★★★★</span>
        </div>
        <div className="h-4 w-px" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
        <div className="flex items-center gap-2 text-sm font-sans" style={{ color: '#1A1210' }}>
          <span className="font-black text-lg" style={{ color: '#4285F4' }}>G</span>
          <span>Google Reviews</span>
          <span style={{ color: '#C9A84C' }}>★★★★★</span>
        </div>
        <div className="h-4 w-px" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
        <div className="flex items-center gap-2 text-sm font-sans" style={{ color: '#1A1210' }}>
          <span className="font-black text-lg" style={{ color: '#F46036' }}>V</span>
          <span>Viator</span>
          <span style={{ color: '#C9A84C' }}>★★★★★</span>
        </div>
      </div>
    </div>
  );
}
