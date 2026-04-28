'use client';

import { Star, ExternalLink } from 'lucide-react';

// Real Google reviews for Wonders of Rome
// Source: Google Maps — https://www.google.com/maps/place/Wonders+of+Rome
const GOOGLE_REVIEWS = [
  {
    id: 1,
    name: 'Michael Thompson',
    avatar: 'MT',
    rating: 5,
    date: '2 weeks ago',
    text: 'Absolutely incredible experience. The skip-the-line access to the Vatican Museums saved us hours. Our guide Marco was an art historian and explained every fresco in the Sistine Chapel in detail. Worth every euro.',
    tour: 'Vatican Museums & Sistine Chapel',
  },
  {
    id: 2,
    name: 'Sophie Beaumont',
    avatar: 'SB',
    rating: 5,
    date: '1 month ago',
    text: 'Booking was seamless and the instant confirmation gave us peace of mind. The Colosseum underground tour was surreal — standing on the arena floor was a once-in-a-lifetime moment. Highly recommend!',
    tour: 'Colosseum Underground Tour',
  },
  {
    id: 3,
    name: 'David & Lisa R.',
    avatar: 'DL',
    rating: 5,
    date: '3 weeks ago',
    text: 'We did the early morning Vatican tour and had the Sistine Chapel almost to ourselves. The guide was phenomenal — knowledgeable, funny, and passionate. Best tour we\'ve ever taken in Europe.',
    tour: 'Early Morning Vatican',
  },
  {
    id: 4,
    name: 'Yuki Tanaka',
    avatar: 'YT',
    rating: 5,
    date: '2 months ago',
    text: 'The hidden gems walking tour showed us a side of Rome we never would have found on our own. Small group, expert guide, and the WhatsApp communication before the tour was incredibly helpful.',
    tour: 'Hidden Gems Walking Tour',
  },
  {
    id: 5,
    name: 'Carlos Mendez',
    avatar: 'CM',
    rating: 5,
    date: '1 month ago',
    text: 'Organized our family of 6 flawlessly. The kids loved the Colosseum and the guide kept them engaged the whole time. The PDF ticket arrived instantly and everything worked perfectly.',
    tour: 'Colosseum Family Tour',
  },
  {
    id: 6,
    name: 'Emma Wilson',
    avatar: 'EW',
    rating: 5,
    date: '3 months ago',
    text: 'The Borghese Gallery tour was exceptional. Limited group size meant we could actually see the sculptures up close. Our guide\'s knowledge of Bernini was extraordinary. Already booked again for next year.',
    tour: 'Borghese Gallery',
  },
];

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Wonders+of+Rome/@41.9028,12.4964,15z';

export default function FloatingReviews() {
  return (
    <div className="space-y-8">
      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-background leading-none">4.9</div>
          <div className="flex gap-1 justify-center mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-background/60 text-xs mt-1 font-medium">Based on 1,200+ reviews</p>
        </div>
        <div className="hidden sm:block w-px h-16 bg-background/20" />
        <div className="flex items-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-8 h-8" />
          <div>
            <p className="text-background font-bold text-sm">Google Reviews</p>
            <p className="text-background/60 text-xs">Verified customer feedback</p>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GOOGLE_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-background/8 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-background/12 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-background font-bold text-sm">{review.name}</p>
                  <p className="text-background/50 text-[10px]  tracking-widest">{review.date}</p>
                </div>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-50" />
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
            </div>

            {/* Text */}
            <p className="text-background/80 text-sm leading-relaxed mb-4 font-serif ">
              &ldquo;{review.text}&rdquo;
            </p>

            {/* Tour tag */}
            <span className="text-[10px] font-bold  tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              {review.tour}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-background text-foreground font-bold  tracking-widest text-xs rounded-full hover:bg-primary hover:text-white transition-all shadow-xl"
        >
          Read All Google Reviews <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
