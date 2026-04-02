'use client';

import { Shield, Award, CheckCircle, Star, Clock, ThumbsUp } from 'lucide-react';

const badges = [
  { icon: Shield,       title: 'Secure Booking',   subtitle: 'SSL Encrypted',     color: 'bg-sky-50    text-sky-600',     span: '' },
  { icon: Award,        title: 'Top Rated',         subtitle: '4.9 / 5 Stars',     color: 'bg-amber-50  text-amber-600',   span: '' },
  { icon: CheckCircle,  title: 'Verified Guides',   subtitle: 'Licensed & Vetted', color: 'bg-blue-50   text-blue-600',    span: '' },
  { icon: Star,         title: 'Best Price',        subtitle: 'Guaranteed',        color: 'bg-orange-50 text-orange-600',  span: '' },
  { icon: Clock,        title: 'Free Cancellation', subtitle: 'Up to 24h Before',  color: 'bg-emerald-50 text-emerald-600', span: 'md:col-span-1' },
  { icon: ThumbsUp,     title: '50,000+ Travelers', subtitle: 'Trust Us Every Year', color: 'bg-rose-50  text-rose-600',   span: '' },
];

export default function TrustBadges() {
  return (
    <div className="w-full">
      {/* Bento grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className={`${b.span} ${b.color} rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-current/10`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{b.title}</p>
              <p className="text-xs text-gray-500 leading-tight">{b.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Platform row — Google + Viator only, no TripAdvisor */}
      <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-blue-600 font-black text-lg leading-none">G</span>
          <span>Google Reviews</span>
          <span className="text-yellow-400 text-sm">★★★★★</span>
        </div>
        <div className="w-px h-4 bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-orange-500 font-black text-lg leading-none">V</span>
          <span>Viator</span>
          <span className="text-yellow-400 text-sm">★★★★★</span>
        </div>
        <div className="w-px h-4 bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="text-sky-600 font-black text-lg leading-none">G</span>
          <span>GetYourGuide</span>
          <span className="text-yellow-400 text-sm">★★★★★</span>
        </div>
      </div>
    </div>
  );
}
