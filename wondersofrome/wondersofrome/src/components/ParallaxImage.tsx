'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  speed = 0.5,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    gsap.to(img, {
      y: (i, target) => {
        return (el.offsetHeight - img.offsetHeight) * 1;
      },
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`parallax-img-container ${aspectRatio} ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="parallax-img"
      />
    </div>
  );
}
