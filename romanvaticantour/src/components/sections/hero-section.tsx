"use client";

import Image from "next/image";

const sideImages = [
  {
    src: "/images/vatican-sistine.jpg",
    alt: "Sistine Chapel",
    position: "left",
  },
  {
    src: "/images/st-peters.jpg",
    alt: "St. Peter's Dome",
    position: "left",
  },
  {
    src: "/images/colosseum-night.jpg",
    alt: "Colosseum Underground",
    position: "right",
  },
  {
    src: "/images/rome-hero.jpg",
    alt: "Arena Floor",
    position: "right",
  },
];

export function HeroSection() {
  return (
    <section className="relative bg-background">
      {/* Full-Width Image Mosaic Grid */}
      <div className="flex gap-0 h-[60vh] md:h-[70vh] lg:h-[80vh] w-full pt-20 md:pt-24">
        {/* Left Column */}
        <div className="flex flex-col gap-0 w-1/5">
          {sideImages.filter(img => img.position === "left").map((img, idx) => (
            <div key={idx} className="relative flex-1 overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>

        {/* Center Image with Text Overlay */}
        <div className="relative w-3/5 overflow-hidden">
          <Image
            src="/images/rome-hero.jpg"
            alt="The Vatican at Night"
            fill
            className="object-cover"
            priority
          />
          {/* Text Overlay */}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <h1 className="text-[14vw] md:text-[9vw] font-black tracking-tighter text-white drop-shadow-2xl text-center leading-none">
              ROMAN<br />VATICAN
            </h1>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-0 w-1/5">
          {sideImages.filter(img => img.position === "right").map((img, idx) => (
            <div key={idx} className="relative flex-1 overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
