'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

const faqs = [
  {
    q: 'Do I need to book Vatican tickets in advance?',
    a: 'Yes, absolutely. Vatican Museums tickets sell out days or weeks in advance, especially April–October. We recommend booking at least 48 hours ahead to secure your preferred date and time.',
  },
  {
    q: 'What\'s the dress code for the Vatican?',
    a: 'Shoulders and knees must be covered for both men and women. Sleeveless tops, shorts above the knee, and miniskirts are not permitted. Bring a light scarf or shawl just in case.',
  },
  {
    q: 'Can I cancel or change my booking?',
    a: 'Yes! Free cancellation up to 24 hours before your scheduled start time. You\'ll receive a full refund. Changes are subject to availability — contact us and we\'ll do our best.',
  },
];

export default function FaqPreview() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-accent-text text-accent text-2xl md:text-3xl text-center mb-2">Help &amp; Answers</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-muted-foreground shrink-0 transition-transform',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-8">
          <Link href="/faq" className="text-primary hover:underline font-semibold text-sm">
            View all FAQs →
          </Link>
        </p>
      </div>
    </section>
  );
}
