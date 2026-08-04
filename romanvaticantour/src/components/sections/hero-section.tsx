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
      {/* Image Mosaic Grid */}
      <div className="px-4 pt-40 pb-8 md:px-8 md:pt-44 lg:px-16 lg:pt-48">
        <div className="flex gap-3 md:gap-4 lg:gap-5 h-[50vh] md:h-[60vh] lg:h-[70vh] max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 w-[22%]">
            {sideImages.filter(img => img.position === "left").map((img, idx) => (
              <div key={idx} className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
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
          <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
            <Image
              src="/images/rome-hero.jpg"
              alt="The Vatican at Night"
              fill
              className="object-cover"
              priority
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-white drop-shadow-2xl text-center leading-none">
                ROMAN<br />VATICAN
              </h1>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 w-[22%]">
            {sideImages.filter(img => img.position === "right").map((img, idx) => (
              <div key={idx} className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
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
      </div>
    </section>
  );
}
