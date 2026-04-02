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
    <section className="py-24 bg-theme-light border-t border-theme-primary/10 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/marble-clean.png")' }} />
      
      {/* Vatican Header */}
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold text-theme-dark mb-4 leading-tight"
        >
          Relics of the <span className="text-theme-primary italic">Eternal City</span>
        </motion.h2>
        <div className="w-24 h-1 bg-theme-primary mx-auto mb-8" />
        <p className="text-theme-dark/60 text-lg md:text-xl font-serif max-w-2xl mx-auto italic">
          Experience the sacred architecture and historical depth of Rome through our lens of absolute luxury.
        </p>
      </div>

      {/* Asymmetric "Altarpiece" Layout */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Large Centerpiece */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 relative aspect-[16/10] overflow-hidden shadow-2xl border-8 border-white"
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
                <p className="text-white font-serif text-2xl font-bold italic">{images[1].alt}</p>
            </div>
          </motion.div>

          {/* Side Stack */}
          <div className="md:col-span-4 flex flex-col gap-6">
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 relative min-h-[250px] overflow-hidden shadow-xl border-4 border-white"
             >
                <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
             </motion.div>
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 relative min-h-[250px] overflow-hidden shadow-xl border-4 border-white"
             >
                <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
             </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {images.slice(3, 6).map((img, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="relative aspect-square overflow-hidden shadow-lg border-4 border-white group"
                >
                    <Image src={img.src} alt={img.alt} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-theme-primary/10 group-hover:bg-transparent transition-colors" />
                </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
