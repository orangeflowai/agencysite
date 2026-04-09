"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MoveRight, Search, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

interface HeroStickyGridProps {
  settings: any;
  tours: any[];
}

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

  // We need around 9-12 images for the grid. If tours are limited, we repeat them.
  const displayTours = tours.length > 0 
    ? [...tours, ...tours, ...tours].slice(0, 12) 
    : [];

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

    // 1. Init Content
    gsap.set([detailBoxRef.current], { opacity: 0, pointerEvents: "none" });

    if (contentRef.current && titleBoxRef.current) {
        const dy = (contentRef.current.offsetHeight - titleBoxRef.current.offsetHeight) / 2;
        titleOffsetY.current = (dy / contentRef.current.offsetHeight) * 100;
        gsap.set(titleBoxRef.current, { yPercent: titleOffsetY.current });
    }

    // 2. Group By Columns
    const numColumns = 3;
    const columns: Array<HTMLLIElement[]> = Array.from({ length: numColumns }, () => []);
    itemRefs.current.forEach((item, index) => {
        if (item) columns[index % numColumns].push(item);
    });

    // 3. Add Parallax on Scroll to the wrapper
    gsap.from(wrapperRef.current, {
        yPercent: -20, // Reduced from -100 for a Hero to appear visible immediately on load!
        ease: "none",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
        },
    });

    // 4. Animate title opacity
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

    // Generate Timelines
    const gridRevealTimeline = () => {
        const timeline = gsap.timeline();
        const dy = window.innerHeight;
        columns.forEach((column, colIndex) => {
            const fromTop = colIndex % 2 === 0;
            timeline.from(column, {
                y: dy * (fromTop ? -1 : 1),
                stagger: {
                    each: 0.06,
                    from: fromTop ? "end" : "start",
                },
                ease: "power1.inOut",
            }, "grid-reveal");
        });
        return timeline;
    };

    const gridZoomTimeline = () => {
        const timeline = gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } });
        timeline.to(gridRef.current, { scale: 3.5 }); // Huge zoom for hero out effect
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

    // 5. Main animate grid
    const mainTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", // Change start to top top for Hero!
            end: "=200%", // End after scrolling 200vh
            scrub: true,
            pin: true, // Pin the Hero to complete its massive zoom
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
    <section ref={containerRef} className="relative z-10 w-full bg-white" aria-label="Immersive Hero">
      <div 
        ref={wrapperRef} 
        className="w-full h-[100vh] overflow-hidden bg-black text-white relative"
        style={{ borderRadius: "0 0 2rem 2rem" }}
      >
        <div ref={contentRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 pointer-events-none">
          
          <div ref={titleBoxRef} className="flex flex-col items-center text-center w-full max-w-4xl pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-white/20 mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold tracking-wide uppercase">New VIP Access Routes Added</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] drop-shadow-xl font-serif">
               The Vatican. <br />
               <span className="text-amber-400">Skipping the line</span> is just the start.
            </h1>
          </div>

          <div ref={detailBoxRef} className="flex flex-col items-center mt-12 w-full max-w-2xl pointer-events-auto">
            <p className="text-[clamp(1rem,1.5vw,1.25rem)] mb-8 text-center text-gray-200 font-sans drop-shadow-md bg-black/30 p-4 rounded-xl backdrop-blur-sm">
               {settings?.heroSubtitle || "Join over 50,000 travelers who have unlocked Rome through exclusive access, expert storytelling, and zero waiting."}
            </p>

            {/* SaaS style interactive search widget */}
            <div className="w-full glass-white bg-white/10 backdrop-blur-3xl rounded-2xl p-4 shadow-2xl border border-white/30 text-left">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Availability Check
                    </h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-[2] bg-white rounded-xl border border-neutral-200 p-1 flex items-center overflow-hidden">
                       <input 
                         type="text" 
                         className="w-full bg-transparent border-none text-sm px-3 py-2 outline-none font-medium text-neutral-900 placeholder:text-neutral-500" 
                         placeholder="Destination or Tour..."
                         value={destination}
                         onChange={(e) => setDestination(e.target.value)}
                       />
                    </div>
                    <div className="flex-[1.5] bg-white rounded-xl border border-neutral-200 p-1 flex items-center overflow-hidden">
                       <input 
                         type="date" 
                         className="w-full bg-transparent border-none text-sm px-3 py-2 outline-none font-medium text-neutral-900" 
                         value={date}
                         onChange={(e) => setDate(e.target.value)}
                       />
                    </div>
                    <button onClick={handleSearch} className="flex-[0.5] flex items-center justify-center bg-amber-500 text-white p-3 rounded-xl hover:bg-amber-600 transition-colors">
                        <Search className="w-5 h-5 font-bold" />
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* The Grid Layer */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-50 z-10">
          <ul 
            ref={gridRef} 
            className="grid grid-cols-3 gap-6 w-[120vw] sm:w-[100vw] h-[150vh] ml-[-10vw] sm:ml-0"
            style={{ transformOrigin: "center center" }}
          >
            {displayTours.map((t, i) => (
              <li 
                key={i} 
                ref={(el) => { itemRefs.current[i] = el; }} 
                className="relative w-full aspect-[3/4] overflow-hidden rounded-xl will-change-transform shadow-2xl"
                style={{
                  gridColumn: i === 0 ? "1" : "auto", 
                  gridRow: i === 0 ? "2" : "auto",
                }}
              >
                <div className="absolute inset-[-10%] bg-cover bg-center will-change-transform" style={{ backgroundImage: `url(${t.mainImage})` }} />
                
                {/* Optional dark gradient to make hero text pop more */}
                <div className="absolute inset-0 bg-black/20" />
              </li>
            ))}
          </ul>
        </div>

        {/* Background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-neutral-950 -z-10" />

      </div>
    </section>
  );
}
