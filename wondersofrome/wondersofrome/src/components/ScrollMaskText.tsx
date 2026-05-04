'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollMaskTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}

export default function ScrollMaskText({
  children,
  className = '',
  as: Tag = 'h2',
  delay = 0,
}: ScrollMaskTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      textRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [delay]);

  return (
    <div ref={containerRef} className={`mask-reveal ${className}`}>
      <Tag ref={textRef} className="mask-reveal-inner block">
        {children}
      </Tag>
    </div>
  );
}
