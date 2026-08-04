'use client';

import { useEffect, useRef } from 'react';

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
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Initial hidden state
    text.style.transform = 'translateY(100%)';
    text.style.transition = `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            text.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Tag ref={textRef as React.Ref<any>} className="block will-change-transform">
        {children}
      </Tag>
    </div>
  );
}
