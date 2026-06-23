'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

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

  // Stagger-reveal cards on scroll — no GSAP
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.gallery-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="text-primary font-bold tracking-[0.4em] text-xs mb-6 uppercase">Archive Visuals</p>
          <h2 className="text-7xl md:text-9xl font-serif font-bold text-foreground leading-[0.85] tracking-tighter">
            Capture<br /><span className="text-primary">The magic.</span>
          </h2>
          <p className="text-xl text-muted-foreground mt-8 max-w-lg font-medium leading-relaxed">
            Explore our high-fidelity photo archives of the Eternal City.
          </p>
        </div>

        {/* Scrollable row on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide">
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery-card relative w-[280px] md:w-auto shrink-0 md:shrink aspect-[3/4] rounded-3xl overflow-hidden border border-border shadow-2xl group snap-center will-change-transform"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 280px, 33vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-8 flex flex-col justify-end">
                <span className="text-primary text-xs font-bold tracking-[0.3em] mb-2 block uppercase">
                  Entry {i + 1}
                </span>
                <h3 className="text-white text-4xl font-serif font-bold tracking-tighter">{img.alt}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
