"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const defaultImages = [
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop", // Rome colosseum
  "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=600&auto=format&fit=crop", // Trevi 
  "https://images.unsplash.com/photo-1510333337682-fefaee8542cd?q=80&w=600&auto=format&fit=crop", // Pantheon
  "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=600&auto=format&fit=crop", // Vatican
  "https://images.unsplash.com/photo-1515542622106-78b28af81b5b?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523531294919-4cb7b5d15eb0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533418264835-9871c7c23f0e?q=80&w=600&auto=format&fit=crop",
];

export default function StickyGridScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  
  const titleOffsetY = useRef(0);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current || !titleRef.current) return;

    // 1. Init Content
    gsap.set([descriptionRef.current, buttonRef.current], { opacity: 0, pointerEvents: "none" });

    if (contentRef.current && titleRef.current) {
        const dy = (contentRef.current.offsetHeight - titleRef.current.offsetHeight) / 2;
        titleOffsetY.current = (dy / contentRef.current.offsetHeight) * 100;
        gsap.set(titleRef.current, { yPercent: titleOffsetY.current });
    }

    // 2. Group By Columns
    const numColumns = 3;
    const columns: Array<HTMLLIElement[]> = Array.from({ length: numColumns }, () => []);
    itemRefs.current.forEach((item, index) => {
        if (item) columns[index % numColumns].push(item);
    });

    // 3. Add Parallax on Scroll to the wrapper
    gsap.from(wrapperRef.current, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
        },
    });

    // 4. Animate title opacity
    gsap.from(titleRef.current, {
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
        timeline.to(gridRef.current, { scale: 2.05 });
        timeline.to(columns[0], { xPercent: -40 }, "<");
        timeline.to(columns[2], { xPercent: 40 }, "<");
        timeline.to(
            columns[1],
            {
                yPercent: (index) => (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 60,
                duration: 0.5,
                ease: "power1.inOut",
            },
            "-=0.5"
        );
        return timeline;
    };

    const toggleContent = (isVisible: boolean) => {
        gsap.timeline({ defaults: { overwrite: true } })
            .to(titleRef.current, {
                yPercent: isVisible ? 0 : titleOffsetY.current,
                duration: 0.7,
                ease: "power2.inOut",
            })
            .to([descriptionRef.current, buttonRef.current], {
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
            start: "top 25%",
            end: "bottom bottom",
            scrub: true,
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
    <section ref={containerRef} className="relative z-10 h-[300vh] mt-24 mb-[20vh]" aria-label="Immersive Gallery">
      <div 
        ref={wrapperRef} 
        className="sticky top-0 w-full h-[100vh] overflow-hidden bg-black text-white"
        style={{ borderRadius: "0 0 2rem 2rem" }}
      >
        <div ref={contentRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 pointer-events-none md:p-[8vh]">
          <h2 ref={titleRef} className="text-[clamp(1.5rem,5.5vw,4.5rem)] font-serif font-light text-center m-0 leading-[1.1] pointer-events-auto">
            Experience Rome
          </h2>
          <p ref={descriptionRef} className="text-[clamp(1rem,1.5vw,1.5rem)] mt-4 max-w-lg text-center text-muted-foreground font-sans pointer-events-auto">
            A structured scroll-driven image grid where movement unfolds progressively within a sticky layout.
          </p>
          <a ref={buttonRef} href="#tours" className="mt-[2vh]  tracking-[2px] border border-[rgba(255,255,255,0.4)] px-6 py-3 rounded-[3rem] hover:bg-card hover:text-foreground transition-colors pointer-events-auto text-[10px] sm:text-xs">
            Discover Tours
          </a>
        </div>

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-60">
          <ul 
            ref={gridRef} 
            className="grid grid-cols-[var(--grid-cols-mobile)] sm:grid-cols-[var(--grid-cols-desktop)] gap-4 sm:gap-6 w-[120vw] sm:w-[100vw] h-[150vh] ml-[-10vw] sm:ml-0"
            style={{ 
              "--grid-cols-desktop": "repeat(3, 1fr)",
              "--grid-cols-mobile": "repeat(3, 1fr)",
              transformOrigin: "center center"
            } as any}
          >
            {defaultImages.map((src, i) => (
              <li 
                key={i} 
                ref={(el) => { itemRefs.current[i] = el; }} 
                className="relative w-full aspect-[3/4] overflow-hidden rounded-xl will-change-transform"
                style={{
                  gridColumn: i === 0 ? "1" : "auto", 
                  gridRow: i === 0 ? "2" : "auto",
                }}
              >
                <div className="absolute inset-[-10%] bg-cover bg-center will-change-transform" style={{ backgroundImage: `url(${src})` }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
