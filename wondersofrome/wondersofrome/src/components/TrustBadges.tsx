'use client';

import { Shield, Award, CheckCircle, Star } from 'lucide-react';

const badges = [
  { icon: Shield,       title: 'Secure Booking',   subtitle: 'SSL Encrypted',    color: 'from-emerald-400 to-emerald-600' },
  { icon: Award,        title: 'Top Rated',         subtitle: '4.9/5 Stars',      color: 'from-yellow-400 to-yellow-600' },
  { icon: CheckCircle,  title: 'Verified Tours',    subtitle: 'Licensed Guides',  color: 'from-blue-400 to-blue-600' },
  { icon: Star,         title: 'Best Price',        subtitle: 'Guaranteed',       color: 'from-orange-400 to-orange-600' },
];

export default function TrustBadges() {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 text-center hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-gray-600">{badge.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
