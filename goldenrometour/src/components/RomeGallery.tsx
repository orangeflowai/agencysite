'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const images = [
  { src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=75&w=800', alt: 'Colosseum, Rome', size: 'large' },
  { src: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=75&w=800', alt: "St Peter's Basilica, Vatican", size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=75&w=800', alt: 'Trevi Fountain, Rome', size: 'small' },
  { src: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&q=75&w=800', alt: 'Roman Forum, Rome', size: 'small' },
  { src: 'https://images.unsplash.com/photo-1548585744-4e87b61edba7?auto=format&fit=crop&q=75&w=800', alt: 'Pantheon, Rome', size: 'medium' },
  { src: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=75&w=800', alt: 'Spanish Steps, Rome', size: 'medium' },
];

export default function RomeGallery() {
  return (
    <section className="py-32 bg-forest overflow-hidden relative">
      {/* Editorial Header */}
      <div className="container mx-auto px-8 md:px-16 mb-24 relative z-10">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-gold/30"></div>
            <span className="font-sans text-[10px] uppercase font-black tracking-[0.5em] text-gold/60">
               Visual Documentation
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-8xl text-cream font-bold leading-tight"
          >
            A Study of the <br />
            <span className="italic text-gold">Eternal Archive.</span>
          </motion.h2>
        </div>
      </div>

      {/* Masonry Glass Gallery */}
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[200px]">
          
          {/* Main Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-3 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover sepia-[0.1] contrast-[1.1] grayscale-[0.1] group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-10 left-10 z-20">
                <span className="font-sans text-[10px] font-black uppercase tracking-widest text-gold mb-2 block">Plate 01</span>
                <p className="font-serif text-3xl text-cream font-bold italic">{images[0].alt}</p>
            </div>
          </motion.div>

          {/* Vertical Accent */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-4 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover sepia-[0.1] group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors" />
            <div className="absolute top-10 right-10 z-20">
                 <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center backdrop-blur-md">
                    <span className="text-[10px] text-cream font-bold">02</span>
                 </div>
            </div>
          </motion.div>

          {/* Sub Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 md:row-span-2 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-forest/20 group-hover:bg-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 md:row-span-2 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-forest/20 group-hover:bg-transparent" />
          </motion.div>

          {/* Final Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-6 md:row-span-2 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-6 right-6">
                <p className="font-sans text-[8px] font-black uppercase tracking-[0.4em] text-gold/80">Archival Series III</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="md:col-span-6 md:row-span-2 relative overflow-hidden group rounded-[2rem] glass-dark border border-gold/10"
          >
            <Image src={images[5].src} alt={images[5].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
