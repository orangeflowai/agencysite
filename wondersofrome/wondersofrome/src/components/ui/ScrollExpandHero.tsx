'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export default function ScrollExpandHero({
  mediaSrc,
  bgImageSrc,
  title = 'THE ETERNAL CITY',
  subtitle = 'UNLOCKED.',
  scrollToExpand = 'Scroll to explore',
  children,
}: ScrollExpandHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intercept scroll/touch until fully expanded
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        return;
      }
      if (!expanded) {
        e.preventDefault();
        const delta = e.deltaY * 0.001;
        setScrollProgress(prev => {
          const next = Math.min(Math.max(prev + delta, 0), 1);
          if (next >= 1) setExpanded(true);
          return next;
        });
      }
    };

    const onTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (expanded && dy < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        return;
      }
      if (!expanded) {
        e.preventDefault();
        const factor = dy < 0 ? 0.008 : 0.005;
        setScrollProgress(prev => {
          const next = Math.min(Math.max(prev + dy * factor, 0), 1);
          if (next >= 1) setExpanded(true);
          return next;
        });
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => setTouchStartY(0);
    const onScroll = () => { if (!expanded) window.scrollTo(0, 0); };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [scrollProgress, expanded, touchStartY]);

  // Derived values
  const baseW  = isMobile ? 280 : 360;
  const baseH  = isMobile ? 380 : 460;
  const maxW   = isMobile ? 900 : 1500;
  const maxH   = isMobile ? 580 : 860;
  const mediaW = baseW + scrollProgress * (maxW - baseW);
  const mediaH = baseH + scrollProgress * (maxH - baseH);
  const textShift = scrollProgress * (isMobile ? 160 : 140); // vw units → px via inline style

  return (
    <div ref={sectionRef} className="transition-colors duration-700 overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* ── Background image fades out as media expands ── */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt="Rome background"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* ── Main content ── */}
          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* ── Expanding media card ── */}
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{
                  width: `${mediaW}px`,
                  height: `${mediaH}px`,
                  maxWidth: '95vw',
                  maxHeight: '88vh',
                  boxShadow: `0 0 ${60 * scrollProgress}px rgba(0,0,0,0.4)`,
                  transition: 'box-shadow 0.1s',
                }}
              >
                <Image
                  src={mediaSrc}
                  alt="Rome"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 95vw, 1500px"
                />
                {/* Overlay fades as it expands */}
                <motion.div
                  className="absolute inset-0 bg-black/50 rounded-2xl"
                  animate={{ opacity: 0.5 - scrollProgress * 0.4 }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* ── Date / scroll hint — slide apart ── */}
              <div className="flex flex-col items-center text-center relative z-10 mt-4 pointer-events-none">
                <p
                  className="text-white/70 text-xs font-bold uppercase tracking-[0.3em] mb-2"
                  style={{ transform: `translateX(-${textShift}px)` }}
                >
                  Rome, Italy
                </p>
                {scrollProgress < 0.85 && (
                  <p
                    className="text-white/60 text-xs font-medium tracking-widest"
                    style={{ transform: `translateX(${textShift}px)` }}
                  >
                    {scrollToExpand}
                  </p>
                )}
              </div>

              {/* ── Split title — slides apart as image expands ── */}
              <div className="flex items-center justify-center text-center gap-3 w-full relative z-10 pointer-events-none flex-col">
                <h1
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-none"
                  style={{ transform: `translateX(-${textShift}px)` }}
                >
                  {title}
                </h1>
                <h1
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200 tracking-tighter drop-shadow-2xl leading-none italic"
                  style={{ transform: `translateX(${textShift}px)` }}
                >
                  {subtitle}
                </h1>
              </div>

            </div>

            {/* ── Content revealed after full expansion ── */}
            <motion.section
              className="flex flex-col w-full px-6 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
}
