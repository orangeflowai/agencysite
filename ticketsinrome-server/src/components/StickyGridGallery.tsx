'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StickyGridGalleryProps {
  title: string;
  description?: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  ctaText?: string;
  ctaLink?: string;
}

export default function StickyGridGallery({
  title,
  description,
  images,
  ctaText = 'Explore Tours',
  ctaLink = '/search'
}: StickyGridGalleryProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the section (0 to 1)
      const start = rect.top;
      const end = rect.bottom - viewportHeight;
      const progress = Math.max(0, Math.min(1, 1 - (start / (sectionHeight - viewportHeight))));
      
      setScrollProgress(progress);
      setIsVisible(rect.top < viewportHeight * 0.75 && rect.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform values based on scroll progress
  const gridScale = 1 + scrollProgress * 1.05; // Scale from 1 to 2.05
  const contentOpacity = scrollProgress > 0.7 ? 1 : 0;
  const titleY = scrollProgress > 0.7 ? 0 : 50;

  // Distribute images into 3 columns
  const columns = [[], [], []] as Array<Array<typeof images[0]>>;
  images.forEach((img, i) => {
    columns[i % 3].push(img);
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-background border-b border-border"
      style={{ height: '425vh' }}
    >
      <div
        ref={wrapperRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          transform: `translateY(${-100 + scrollProgress * 100}%)`,
        }}
      >
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center pointer-events-none">
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter leading-none text-foreground mb-6 transition-all duration-700"
            style={{
              transform: `translateY(${titleY}%)`,
              opacity: scrollProgress < 0.1 ? 1 : scrollProgress > 0.7 ? 1 : 0,
            }}
          >
            {title}
          </h2>
          
          <div
            className="max-w-md transition-all duration-500"
            style={{
              opacity: contentOpacity,
              pointerEvents: contentOpacity > 0 ? 'auto' : 'none',
            }}
          >
            {description && (
              <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8">
                {description}
              </p>
            )}
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              {ctaText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Grid Gallery */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div
            className="grid grid-cols-3 gap-8 w-full max-w-4xl transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${gridScale})`,
            }}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-10"
                style={{
                  transform: `
                    translateY(${isVisible ? 0 : (colIndex % 2 === 0 ? -100 : 100)}%)
                    translateX(${scrollProgress > 0.5 ? (colIndex === 0 ? -40 : colIndex === 2 ? 40 : 0) : 0}%)
                  `,
                  opacity: isVisible ? 1 : 0,
                  transition: `transform 800ms cubic-bezier(0.4, 0, 0.2, 1) ${colIndex * 60}ms, opacity 700ms ease-out ${colIndex * 60}ms`,
                }}
              >
                {column.map((image, imgIndex) => {
                  const isMiddleColumn = colIndex === 1;
                  const isMidpoint = imgIndex < Math.floor(column.length / 2);
                  const verticalOffset = isMiddleColumn && scrollProgress > 0.5
                    ? (isMidpoint ? -40 : 40)
                    : 0;

                  return (
                    <div
                      key={imgIndex}
                      className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
                      style={{
                        transform: `translateY(${verticalOffset}%)`,
                        transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
