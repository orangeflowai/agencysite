'use client';
import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';

// Global lenis instance so modals can pause/resume it
let globalLenis: Lenis | null = null;

export function stopLenis() {
  if (globalLenis) globalLenis.stop();
}

export function startLenis() {
  if (globalLenis) globalLenis.start();
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    globalLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Watch for body overflow changes (set by modals)
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      lenis.destroy();
      observer.disconnect();
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
}
