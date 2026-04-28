'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// ── Rome-specific testimonials ────────────────────────────────────────────────
export const romeTestimonials = [
  {
    text: "We arrived to an empty Sistine Chapel — something I never thought was possible. Worth every cent.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    name: "Megan K.",
    role: "Vatican Early Access · USA",
    rating: 5,
  },
  {
    text: "Marco was incredible — funny, knowledgeable, and genuinely passionate. The underground Colosseum blew our minds.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "David T.",
    role: "Colosseum Underground · UK",
    rating: 5,
  },
  {
    text: "Booked 2 days before visiting. Got instant confirmation for 3 tours. Everything worked perfectly — no queues, no stress.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    name: "Fatima S.",
    role: "3-Tour Bundle · UAE",
    rating: 5,
  },
  {
    text: "The private tour was worth every euro. Our guide knew every hidden corner of the Forum. Absolutely magical.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    name: "James H.",
    role: "Rome in a Day · Australia",
    rating: 5,
  },
  {
    text: "Even as a local, I learned so much from Roberta. The hidden gems tour is a must for anyone who thinks they know Rome.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    name: "Alessandro R.",
    role: "Hidden Gems Tour · Italy",
    rating: 5,
  },
  {
    text: "Totally worth it for the early morning access to the Sistine Chapel. We had the whole room to ourselves for 20 minutes.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    name: "Chen Wei",
    role: "Vatican Early Access · Singapore",
    rating: 5,
  },
  {
    text: "Francesca made the Vatican Museums come alive. Skip-the-line access was a lifesaver — the queue outside was enormous.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    name: "Maria G.",
    role: "Vatican Museums · France",
    rating: 5,
  },
  {
    text: "Efficient, fun, and so informative. We saw everything we wanted without the stress. Will book again next trip.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face",
    name: "Sophie B.",
    role: "Rome City Tour · Germany",
    rating: 5,
  },
  {
    text: "The golf cart tour was the highlight of our whole Italy trip. Covered so much ground without getting tired.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    name: "Robert D.",
    role: "Golf Cart Tour · Canada",
    rating: 5,
  },
];

// ── Single column ─────────────────────────────────────────────────────────────
export const TestimonialsColumn = ({
  testimonials,
  duration = 12,
  className = '',
}: {
  testimonials: typeof romeTestimonials;
  duration?: number;
  className?: string;
}) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      animate={{ translateY: '-50%' }}
      transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      className="flex flex-col gap-4 pb-4"
    >
      {[...Array(2)].fill(0).map((_, idx) => (
        <React.Fragment key={idx}>
          {testimonials.map(({ text, image, name, role, rating }, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-xs w-full"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(rating)].map((_, s) => (
                  <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-4">{text}</p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-foreground text-sm leading-tight">{name}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);
