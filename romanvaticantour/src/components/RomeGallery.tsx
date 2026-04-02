'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const images = [
  { src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=75&w=600', alt: 'Colosseum, Rome' },
  { src: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=75&w=600', alt: "St Peter's Basilica, Vatican" },
  { src: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=75&w=600', alt: 'Trevi Fountain, Rome' },
  { src: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&q=75&w=600', alt: 'Roman Forum, Rome' },
  { src: 'https://images.unsplash.com/photo-1548585744-4e87b61edba7?auto=format&fit=crop&q=75&w=600', alt: 'Pantheon, Rome' },
  { src: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=75&w=600', alt: 'Spanish Steps, Rome' },
];

export default function RomeGallery() {
  return (
    <section className="py-24 bg-soft-blue overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-sky-100 text-sky-600 px-4 py-1.5 rounded-full inline-block text-[10px] font-black uppercase tracking-widest mb-6"
        >
          Visual Exploration
        </motion.div>
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-stone-950 mb-6 tracking-tight leading-none"
        >
          Capture the <span className="text-sky-500 italic">Magic of Rome.</span>
        </motion.h2>
        <p className="text-stone-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          From the Colosseum floor to the Vatican dome, every experience is documented by our team to guarantee quality.
        </p>
      </div>

      {/* Dynamic Scroll Grid - Modern SaaS Style */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-8 px-6 lg:px-[8vw] w-max animate-gallery-scroll hover:[animation-play-state:paused]">
          {[...images, ...images].map((img, i) => (
            <motion.div
              key={i}
              className="relative w-[300px] h-[400px] md:w-[420px] md:h-[540px] rounded-[3rem] overflow-hidden shadow-saas hover:shadow-saas-xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-white text-xl font-black uppercase tracking-widest">{img.alt}</p>
                <p className="text-sky-200 text-sm font-bold mt-2">Verified Destination</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Row */}
      <div className="container mx-auto px-6 mt-20 flex flex-wrap justify-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all">
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Google_2015_logo.svg" className="h-6" alt="Google" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Tripadvisor_Logo.svg" className="h-6" alt="TripAdvisor" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Viator_logo.svg" className="h-6" alt="Viator" />
      </div>
    </section>
  );
}
