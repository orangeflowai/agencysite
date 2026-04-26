'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HighlightSectionProps {
  eyebrow?: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl: string;
  imageAlt?: string;
  flip?: boolean;
}

export default function HighlightSection({
  eyebrow = 'What We Do',
  title,
  body,
  ctaText = 'Explore Tours',
  ctaHref = '/',
  imageUrl,
  imageAlt = 'Rome Experience',
  flip = false,
}: HighlightSectionProps) {
  return (
    <section className="w-full overflow-hidden">
      <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[480px]`}>

        {/* Text block */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-24 bg-[#0f172a]">
          {eyebrow && (
            <p className="eyebrow mb-5">{eyebrow}</p>
          )}
          <h2
            className="font-heading font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
          >
            {title}
          </h2>
          <p className="font-body text-base text-white/55 leading-relaxed mb-8 max-w-md">
            {body}
          </p>
          <Link
            href={ctaHref}
            className="self-start inline-flex items-center gap-2 font-heading font-semibold text-sm px-6 py-3 rounded-xl bg-[#d4af37] text-[#0f172a] hover:bg-[#e8c84a] transition-all hover:shadow-lg hover:shadow-[#d4af37]/25 active:scale-95"
          >
            {ctaText}
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Image block */}
        <div
          className="flex-1 relative flex items-center justify-center py-12 px-8 lg:p-0 min-h-[360px] lg:min-h-0 overflow-hidden"
          style={{
            backgroundColor: '#f8f7f4',
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        >
          <div
            className="relative w-full max-w-sm aspect-[4/5] overflow-hidden shadow-2xl"
            style={{ borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%' }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Floating stat */}
          <div className="absolute top-8 right-8 lg:top-12 lg:right-12 w-20 h-20 rounded-2xl bg-[#0f172a] flex flex-col items-center justify-center text-center shadow-xl">
            <span className="font-heading font-bold text-xl text-[#d4af37] leading-none">50K</span>
            <span className="font-mono text-[0.5625rem] text-white/50 uppercase tracking-[0.08em] mt-1">Guests</span>
          </div>
        </div>
      </div>
    </section>
  );
}
