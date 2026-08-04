'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  type?: 'fade' | 'slide-up' | 'split-text';
}

export default function AnimatedSection({
  children,
  delay = 0,
  className = '',
  id,
  type = 'slide-up',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFade = type === 'fade';
    el.style.opacity = '0';
    el.style.transform = isFade ? 'none' : 'translateY(30px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.25,0.1,0.25,1) ${delay}s${isFade ? '' : `, transform 0.8s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, type]);

  // split-text variant
  if (type === 'split-text' && typeof children === 'string') {
    const words = (children as string).split(' ');
    return (
      <div id={id} className={`flex flex-wrap ${className}`}>
        {words.map((word, i) => (
          <SplitWord key={i} word={word} delay={delay + i * 0.05} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}

function SplitWord({ word, delay }: { word: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translateY(100%)';
    el.style.transition = `transform 0.8s cubic-bezier(0.33,1,0.68,1) ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div className="overflow-hidden mr-[0.25em]">
      <span ref={ref} className="inline-block will-change-transform">{word}</span>
    </div>
  );
}
