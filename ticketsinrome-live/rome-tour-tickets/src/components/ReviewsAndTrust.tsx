'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, Clock, ThumbsUp } from 'lucide-react';
import {
  TestimonialsColumn,
  romeTestimonials,
} from '@/components/ui/TestimonialsColumns';

const col1 = romeTestimonials.slice(0, 3);
const col2 = romeTestimonials.slice(3, 6);
const col3 = romeTestimonials.slice(6, 9);

const trustItems = [
  { icon: Shield,      title: 'Secure Booking',    sub: 'SSL Encrypted',       bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: Award,       title: 'Top Rated',         sub: '4.9 / 5 Stars',       bg: 'bg-amber-50',   text: 'text-amber-600' },
  { icon: CheckCircle, title: 'Verified Guides',   sub: 'Licensed & Vetted',   bg: 'bg-blue-50',    text: 'text-blue-600' },
  { icon: Clock,       title: 'Free Cancellation', sub: 'Up to 24h Before',    bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: ThumbsUp,    title: '50,000+ Travelers', sub: 'Trust Us Every Year', bg: 'bg-rose-50',    text: 'text-rose-600' },
];

export default function ReviewsAndTrust() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-xl mx-auto mb-12"
        >
          <span className="inline-block border border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Verified Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-3">
            What our travelers say
          </h2>
          <p className="text-gray-500 text-base">
            Over 50,000 happy travelers. 4.9/5 average rating across Google, Viator and GetYourGuide.
          </p>
          {/* Platform row */}
          <div className="flex items-center gap-5 mt-5 flex-wrap justify-center">
            {[
              { letter: 'G', label: 'Google',       color: 'text-blue-600' },
              { letter: 'V', label: 'Viator',        color: 'text-orange-500' },
              { letter: 'G', label: 'GetYourGuide',  color: 'text-red-500' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className={`${p.color} font-black text-base leading-none`}>{p.letter}</span>
                <span>{p.label}</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial columns — fade mask top/bottom */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={16} />
          <TestimonialsColumn testimonials={col2} duration={20} className="hidden md:block" />
          <TestimonialsColumn testimonials={col3} duration={18} className="hidden lg:block" />
        </div>

        {/* Trust bento */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            Book with confidence
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`${item.bg} rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-gray-100`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icon className={`w-5 h-5 ${item.text}`} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-tight">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
