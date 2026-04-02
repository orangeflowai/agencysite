'use client';

import Image from 'next/image';

const images = [
  { src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=75&w=600', alt: 'Colosseum, Rome' },
  { src: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=75&w=600', alt: "St Peter's Basilica, Vatican" },
  { src: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=75&w=600', alt: 'Trevi Fountain, Rome' },
  { src: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&q=75&w=600', alt: 'Roman Forum, Rome' },
  { src: 'https://images.unsplash.com/photo-1548585744-4e87b61edba7?auto=format&fit=crop&q=75&w=600', alt: 'Pantheon, Rome' },
  { src: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=75&w=600', alt: 'Spanish Steps, Rome' },
  { src: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&q=75&w=600', alt: "Castel Sant'Angelo, Rome" },
  { src: 'https://images.unsplash.com/photo-1568797629192-789acf8e4df3?auto=format&fit=crop&q=75&w=600', alt: 'Piazza Navona, Rome' },
];

export default function RomeGallery() {
  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Walk where the <span className="text-sky-500">gladiators</span> walked
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Immerse yourself in the eternal beauty of Rome. Every corner tells a story waiting to be discovered.
        </p>
      </div>

      {/* CSS scroll strip — no JS, GPU-accelerated */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 pl-6 w-max animate-gallery-scroll hover:[animation-play-state:paused]">
          {[...images, ...images].map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[300px] h-[400px] md:w-[380px] md:h-[480px] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 hover:scale-[1.03] cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 380px"
                quality={65}
                loading={i < 4 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-bold">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
