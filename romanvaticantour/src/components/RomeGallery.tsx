'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const images = [
  { src: `${R2}/pexels-axp-photography-500641970-18991563.jpg`,  alt: 'Colosseum' },
  { src: `${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`, alt: "St Peter's" },
  { src: `${R2}/pexels-alex-250137-757239.jpg`,                  alt: 'Trevi Fountain' },
  { src: `${R2}/pexels-efrem-efre-2786187-17282659.jpg`,         alt: 'Roman Forum' },
  { src: `${R2}/pexels-filiamariss-30785778.jpg`,                alt: 'Pantheon' },
  { src: `${R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg`,  alt: 'Spanish Steps' },
];

export default function RomeGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      triggerRef.current,
      { translateX: 0 },
      {
        translateX: "-200vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      pin.kill();
    };
  }, []);

  return (
    <section className="bg-background overflow-hidden relative" ref={sectionRef}>
      <div className="h-[2000px] relative">
        <div ref={triggerRef} className="h-screen flex flex-row items-center w-[300vw] px-[10vw]">
          <div className="w-[80vw] shrink-0 mr-[10vw] flex flex-col justify-center">
             <p className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6">Archive_Visuals</p>
             <h2 className="text-7xl md:text-9xl font-serif font-bold text-foreground leading-[0.85] tracking-tighter italic uppercase">
                Capture<br/><span className="text-primary italic">The magic.</span>
             </h2>
             <p className="text-xl text-muted-foreground mt-12 max-w-lg font-medium leading-relaxed">
                Scroll horizontally to explore our high-fidelity photo archives of the Eternal City.
             </p>
          </div>
          
          <div className="flex flex-row gap-12 items-center">
            {images.map((img, i) => (
              <div key={i} className="relative w-[600px] h-[750px] rounded-[3rem] overflow-hidden border border-border shadow-2xl group shrink-0">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                  sizes="600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-12 flex flex-col justify-end">
                   <span className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2 block">V_ENTRY: {i+1}</span>
                   <h3 className="text-white text-5xl font-serif font-bold italic tracking-tighter">{img.alt}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
