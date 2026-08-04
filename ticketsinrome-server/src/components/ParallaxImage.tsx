'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  speed?: number;
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/9]',
  speed = 0.3,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const viewH = window.innerHeight;
        // progress: -1 (above viewport) → 0 (centered) → 1 (below)
        const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
        const offset = progress * speed * 80; // max ~80px shift
        img.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${aspectRatio} ${className}`}
    >
      <div
        ref={imgRef}
        className="relative w-full h-[120%] -top-[10%] will-change-transform"
        style={{ transform: 'translateY(0)' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
