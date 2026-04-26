'use client';

import Image from 'next/image';

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

// Real Rome photos from Cloudflare R2
const images = [
  `${R2}/pexels-alex-250137-757239.jpg`,
  `${R2}/pexels-c1superstar-27096007.jpg`,
  `${R2}/pexels-efrem-efre-2786187-17282659.jpg`,
  `${R2}/pexels-filiamariss-30785778.jpg`,
  `${R2}/pexels-gaborbalazs97-34279960.jpg`,
  `${R2}/pexels-holodna-29692553.jpg`,
  `${R2}/pexels-imagenesclau-35046617.jpg`,
  `${R2}/pexels-matteobasilephoto-11200578.jpg`,
  `${R2}/pexels-nastiz-12604242.jpg`,
  `${R2}/pexels-mypointviews-34789638.jpg`,
];

export default function RomeGallery() {
  return (
    <section className="py-24 bg-neutral-900 border-t border-neutral-800 overflow-hidden relative">
      {/* Header */}
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          Walk where the <span className="text-emerald-500">gladiators</span> walked
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Immerse yourself in the eternal beauty of Rome. Every corner tells a story waiting to be discovered.
        </p>
      </div>

      {/* Marquee */}
      <div className="flex relative w-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-900 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-900 to-transparent z-10" />

        <div className="flex gap-6 animate-gallery-scroll" style={{ width: 'max-content' }}>
          {[...images, ...images, ...images].map((src, i) => (
            <div
              key={i}
              className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
            >
              <Image
                src={src}
                alt={`Rome Gallery ${i}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 400px"
                quality={60}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
