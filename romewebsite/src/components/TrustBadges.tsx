'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, Star, Clock, ThumbsUp } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secure Booking',
    subtitle: 'SSL Encrypted',
    color: 'sky',
  },
  {
    icon: Award,
    title: 'Top Rated',
    subtitle: '4.9/5 Stars',
    color: 'yellow',
  },
  {
    icon: CheckCircle,
    title: 'Verified Tours',
    subtitle: 'Licensed Guides',
    color: 'blue',
  },
  {
    icon: Star,
    title: 'Best Price',
    subtitle: 'Guaranteed',
    color: 'orange',
  },
  {
    icon: Clock,
    title: 'Free Cancel',
    subtitle: '24h Before',
    color: 'emerald',
  },
  {
    icon: ThumbsUp,
    title: '50,000+',
    subtitle: 'Happy Travelers',
    color: 'rose',
  },
];

const colorClasses: Record<string, string> = {
  sky: 'bg-forest/5 text-forest',
  yellow: 'bg-forest/5 text-forest',
  blue: 'bg-forest/5 text-forest',
  orange: 'bg-forest/5 text-forest',
  emerald: 'bg-forest/5 text-forest',
  rose: 'bg-forest/5 text-forest',
};

export default function TrustBadges() {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
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
              className="bg-cream border border-forest p-4 text-center cursor-pointer group"
            >
              <div className={`w-12 h-12 mx-auto mb-3 flex items-center justify-center ${colorClasses[badge.color]} transition-colors group-hover:bg-forest group-hover:text-cream`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-forest text-sm mb-1">{badge.title}</h3>
              <p className="font-sans text-[10px] uppercase font-black tracking-widest text-forest/40">{badge.subtitle}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Editorial Platform Strip */}
      <div className="flex items-center justify-center gap-12 mt-12 flex-wrap border-t border-forest/10 pt-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold italic">TripAdvisor</span>
            <div className="flex text-forest">{'•••••'}</div>
        </div>
        <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold italic">Google</span>
            <div className="flex text-forest">{'•••••'}</div>
        </div>
        <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold italic">Viator Elite</span>
        </div>
      </div>
    </div>
  );
}
