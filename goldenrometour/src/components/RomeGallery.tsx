'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const images = [
  { src: `${R2}/pexels-axp-photography-500641970-18991563.jpg`,          alt: 'Colosseum, Rome',           size: 'large' },
  { src: `${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`,         alt: "St Peter's Basilica",       size: 'tall' },
  { src: `${R2}/pexels-alex-250137-757239.jpg`,                          alt: 'Trevi Fountain, Rome',      size: 'small' },
  { src: `${R2}/pexels-efrem-efre-2786187-17282659.jpg`,                 alt: 'Roman Forum, Rome',         size: 'small' },
  { src: `${R2}/pexels-filiamariss-30785778.jpg`,                        alt: 'Pantheon, Rome',            size: 'medium' },
  { src: `${R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg`,          alt: 'Spanish Steps, Rome',       size: 'medium' },
];

export default function RomeGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gallery-item').forEach((item: any, i) => {
        gsap.to(item.querySelector('img'), {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-secondary overflow-hidden relative border-y border-primary/20">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-0"></div>

      {/* Editorial Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20 relative z-10">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-primary/30"></div>
            <span className="font-heading text-[10px] font-bold tracking-tighter text-primary/60 uppercase">
               Visual Documentation
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-6xl md:text-8xl text-white font-bold leading-tight tracking-tighter uppercase"
          >
            A Study of the <br />
            <span className="text-primary italic lowercase">Eternal Archive.</span>
          </motion.h2>
        </div>
      </div>

      {/* Masonry Glass Gallery */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[200px]">
          
          {/* Main Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gallery-item md:col-span-8 md:row-span-3 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-cover sepia-[0.1] contrast-[1.1] group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-10 left-10 z-20">
                <span className="font-heading text-[10px] font-bold tracking-tight text-primary mb-2 block uppercase">Plate 01</span>
                <p className="font-heading text-3xl text-secondary font-bold uppercase">{images[0].alt}</p>
            </div>
          </motion.div>

          {/* Vertical Accent */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="gallery-item md:col-span-4 md:row-span-4 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image
                src={images[1].src}
                alt={images[1].alt}
                fill
                className="object-cover sepia-[0.1] group-hover:scale-105 transition-transform duration-1000"
                />
            </div>
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
            <div className="absolute top-10 right-10 z-20">
                 <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="text-[10px] text-secondary font-bold">02</span>
                 </div>
            </div>
          </motion.div>

          {/* Sub Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="gallery-item md:col-span-4 md:row-span-2 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="gallery-item md:col-span-4 md:row-span-2 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent" />
          </motion.div>

          {/* Final Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="gallery-item md:col-span-6 md:row-span-2 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute bottom-6 right-6">
                <p className="font-heading text-[8px] font-bold tracking-tight text-primary/80 uppercase">Archival Series III</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="gallery-item md:col-span-6 md:row-span-2 relative overflow-hidden group rounded-[2rem] border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 scale-[1.2]">
                <Image src={images[5].src} alt={images[5].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute inset-0 border-[20px] border-primary/10 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
