"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Search, CheckCircle2 } from "lucide-react";
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

interface HeroStickyGridProps {
  settings: any;
  tours: any[];
}

// Safely resolve an image URL from any Sanity/Supabase tour shape
function resolveTourImage(tour: any): string {
  const FALLBACK = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';
  if (!tour) return FALLBACK;
  // Direct string URL (Supabase / toursData fallback)
  if (typeof tour.mainImage === 'string' && tour.mainImage.startsWith('http')) return tour.mainImage;
  // Sanity shape: mainImage.asset.url
  if (tour.mainImage?.asset?.url) return tour.mainImage.asset.url;
  // Sanity shape: already a resolved URL from urlFor
  if (typeof tour.imageUrl === 'string' && tour.imageUrl.startsWith('http')) return tour.imageUrl;
  return FALLBACK;
}

// Static fallback grid images (Vatican themed, always work)
const GRID_FALLBACKS = [
  'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=75',
  'https://images.unsplash.com/photo-1541185933-710f50b90c28?w=600&q=75',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=75',
  'https://images.unsplash.com/photo-1576939764066-6949e0b43e0c?w=600&q=75',
  'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=75',
  'https://images.unsplash.com/photo-1520556157077-f27357c37c22?w=600&q=75',
  'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=600&q=75',
  'https://images.unsplash.com/photo-1542027432438-ef349e0efd5e?w=600&q=75',
  'https://images.unsplash.com/photo-1543429766-99173822d54e?w=600&q=75',
  'https://images.unsplash.com/photo-1579606038588-6e7a0f5d8363?w=600&q=75',
  'https://images.unsplash.com/photo-1515542622106-78bda8baa0b1?w=600&q=75',
  'https://images.unsplash.com/photo-1529180979161-06b8b6d6f2be?w=600&q=75',
];

export default function HeroStickyGrid({ settings, tours }: HeroStickyGridProps) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (date) params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

  // Build 12 grid images — use tour images when available, fall back to static collection
  const gridImages: string[] = Array.from({ length: 12 }, (_, i) => {
    const tour = tours[i % Math.max(tours.length, 1)];
    const fromTour = tour ? resolveTourImage(tour) : null;
    return fromTour || GRID_FALLBACKS[i % GRID_FALLBACKS.length];
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const detailBoxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const titleOffsetY = useRef(0);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current || !titleBoxRef.current) return;

    gsap.set([detailBoxRef.current], { opacity: 0, pointerEvents: "none" });

    if (contentRef.current && titleBoxRef.current) {
      const dy = (contentRef.current.offsetHeight - titleBoxRef.current.offsetHeight) / 2;
      titleOffsetY.current = (dy / contentRef.current.offsetHeight) * 100;
      gsap.set(titleBoxRef.current, { yPercent: titleOffsetY.current });
    }

    const numColumns = 3;
    const columns: Array<HTMLLIElement[]> = Array.from({ length: numColumns }, () => []);
    itemRefs.current.forEach((item, index) => {
      if (item) columns[index % numColumns].push(item);
    });

    gsap.from(wrapperRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    gsap.from(titleBoxRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power1.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 57%",
        toggleActions: "play none none reset",
      },
    });

    const gridRevealTimeline = () => {
      const timeline = gsap.timeline();
      const dy = window.innerHeight;
      columns.forEach((column, colIndex) => {
        const fromTop = colIndex % 2 === 0;
        timeline.from(column, {
          y: dy * (fromTop ? -1 : 1),
          stagger: { each: 0.06, from: fromTop ? "end" : "start" },
          ease: "power1.inOut",
        }, "grid-reveal");
      });
      return timeline;
    };

    const gridZoomTimeline = () => {
      const timeline = gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } });
      timeline.to(gridRef.current, { scale: 3.5 });
      timeline.to(columns[0], { xPercent: -50 }, "<");
      timeline.to(columns[2], { xPercent: 50 }, "<");
      timeline.to(
        columns[1],
        {
          yPercent: (index) => (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 70,
          duration: 0.5,
          ease: "power1.inOut",
        },
        "-=0.5"
      );
      return timeline;
    };

    const toggleContent = (isVisible: boolean) => {
      gsap.timeline({ defaults: { overwrite: true } })
        .to(titleBoxRef.current, {
          yPercent: isVisible ? 0 : titleOffsetY.current,
          duration: 0.7,
          ease: "power2.inOut",
        })
        .to([detailBoxRef.current], {
          opacity: isVisible ? 1 : 0,
          duration: 0.4,
          ease: `power1.${isVisible ? "inOut" : "out"}`,
          pointerEvents: isVisible ? "all" : "none",
        }, isVisible ? "-=90%" : "<");
    };

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "=200%",
        scrub: true,
        pin: true,
      },
    });

    mainTimeline
      .add(gridRevealTimeline())
      .add(gridZoomTimeline(), "-=0.6")
      .add(() => {
        toggleContent(mainTimeline.scrollTrigger?.direction === 1);
      }, "-=0.32");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-10 w-full bg-card" aria-label="Immersive Hero">
      <div
        ref={wrapperRef}
        className="w-full h-[100vh] overflow-hidden bg-black text-white relative"
        style={{ borderRadius: "0 0 2rem 2rem" }}
      >
        <div ref={contentRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 pointer-events-none">

          <div ref={titleBoxRef} className="flex flex-col items-center text-center w-full max-w-4xl pointer-events-auto">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 mb-8 text-xs font-semibold tracking-widest  text-white"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              New VIP Access Routes Added
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] drop-shadow-xl font-serif">
              The Vatican. <br />
              <span className="text-sky-400">Skipping the line</span> is just the start.
            </h1>
          </div>

          <div ref={detailBoxRef} className="flex flex-col items-center mt-12 w-full max-w-2xl pointer-events-auto">
            <p className="text-lg mb-8 text-center text-gray-200 font-sans drop-shadow-md px-4">
              {settings?.heroSubtitle || "Join over 50,000 travelers who have unlocked Rome through exclusive access, expert storytelling, and zero waiting."}
            </p>

            {/* Glassmorphism Search */}
            <div
              className="w-full rounded-2xl p-5 shadow-2xl border border-white/25 text-left"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={15} className="text-accent" />
                <span className="text-white font-semibold text-sm">Find Your Tour</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-[2] bg-card rounded-xl flex items-center px-4 py-3 gap-2">
                  <Search size={14} className="text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-800 placeholder:text-neutral-400"
                    placeholder="Vatican, Sistine Chapel..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-[1.5] bg-card rounded-xl flex items-center px-4 py-3">
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-700"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="flex-none px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The Grid Layer - now uses properly resolved image URLs */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-50 z-10">
          <ul
            ref={gridRef}
            className="grid grid-cols-3 gap-6 w-[120vw] sm:w-[100vw] h-[150vh] ml-[-10vw] sm:ml-0"
            style={{ transformOrigin: "center center" }}
          >
            {gridImages.map((imgUrl, i) => (
              <li
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative w-full aspect-[3/4] overflow-hidden rounded-xl will-change-transform shadow-2xl"
                style={{ gridColumn: i === 0 ? "1" : "auto", gridRow: i === 0 ? "2" : "auto" }}
              >
                {/* Using img tag here since these are background grid items - Next/Image inside GSAP-pinned sections can cause layout issues */}
                <img
                  src={imgUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-[-10%] w-[120%] h-[120%] object-cover will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-neutral-950 -z-10" />
      </div>
    </section>
  );
}
