'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, Star } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secure Booking',
    subtitle: 'SSL Encrypted',
    color: 'emerald',
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
];

const colorClasses = {
  emerald: 'from-emerald-400 to-emerald-600',
  yellow: 'from-yellow-400 to-yellow-600',
  blue: 'from-blue-400 to-blue-600',
  orange: 'from-orange-400 to-orange-600',
};

export default function TrustBadges() {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 text-center cursor-pointer"
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${
                  colorClasses[badge.color as keyof typeof colorClasses]
                } flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-600">{badge.subtitle}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
