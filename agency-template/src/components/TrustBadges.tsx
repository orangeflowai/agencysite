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
  sky: 'from-sky-400 to-sky-600',
  yellow: 'from-yellow-400 to-yellow-600',
  blue: 'from-blue-400 to-blue-600',
  orange: 'from-orange-400 to-orange-600',
  emerald: 'from-emerald-400 to-emerald-600',
  rose: 'from-rose-400 to-rose-600',
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
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 text-center cursor-pointer"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${colorClasses[badge.color]} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-gray-500">{badge.subtitle}</p>
            </motion.div>
          );
        })}
      </div>

      {/* TripAdvisor + Review platforms row */}
      <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-green-600 font-black text-lg">●</span>
          <span>TripAdvisor</span>
          <div className="flex text-yellow-400">{'★★★★★'}</div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-blue-600 font-black text-lg">G</span>
          <span>Google Reviews</span>
          <div className="flex text-yellow-400">{'★★★★★'}</div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-orange-500 font-black text-lg">V</span>
          <span>Viator</span>
          <div className="flex text-yellow-400">{'★★★★★'}</div>
        </div>
      </div>
    </div>
  );
}
