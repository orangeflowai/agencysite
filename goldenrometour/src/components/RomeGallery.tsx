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
    <section className="py-24 bg-cream border-t border-forest overflow-hidden relative">
      {/* Editorial Header */}
      <div className="container mx-auto px-8 md:px-16 mb-24 text-left">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] uppercase font-black tracking-[0.5em] text-forest/40"
          >
             Visual Documentation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl text-forest mt-6 font-bold"
          >
            A Study of the <span className="italic">Eternal.</span>
          </motion.h2>
        </div>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="container mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 aspect-[16/9] relative overflow-hidden group"
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover sepia-[0.2] contrast-[1.1] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 border-[20px] border-cream/10 z-10 pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-20">
                <p className="font-serif text-xl text-cream font-bold italic">{images[0].alt}</p>
            </div>
          </motion.div>

          {/* Vertical Smaller Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 aspect-[3/4] relative overflow-hidden group"
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover sepia-[0.2] contrast-[1.1] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-forest/5 group-hover:bg-transparent transition-colors" />
          </motion.div>

          {/* Bottom Grid */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {images.slice(2).map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="aspect-square relative overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-forest/10" />
                <div className="absolute bottom-4 left-4">
                    <p className="font-sans text-[8px] font-black uppercase tracking-widest text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.alt}
                    </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
