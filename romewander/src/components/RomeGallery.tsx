'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// High-quality Vatican & Rome images from Pexels / Unsplash with correct IDs
const images = [
  {
    src: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    alt: 'St. Peter\'s Basilica, Vatican City',
    label: "St. Peter's Basilica",
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    alt: 'Vatican Museums Grand Gallery',
    label: 'Vatican Museums',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    alt: 'Sistine Chapel ceiling detail',
    label: 'Sistine Chapel',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    alt: 'Colosseum at sunset, Rome',
    label: 'The Colosseum',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.pexels.com/photos/356966/pexels-photo-356966.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    alt: 'Trevi Fountain, Rome',
    label: 'Trevi Fountain',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    alt: 'Roman Forum ancient ruins',
    label: 'Roman Forum',
    span: 'col-span-1 row-span-1',
  },
];

export default function RomeGallery() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ backgroundColor: '#1A1210' }}
    >
      <div className="container mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-nav text-[10px] tracking-[0.35em] uppercase font-bold mb-4"
            style={{ color: '#C9A84C' }}
          >
            ✦ SACRED DESTINATIONS ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif font-bold text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
          >
            Relics of the{' '}
            <span className="font-accent italic" style={{ color: '#C9A84C' }}>
              Eternal City
            </span>
          </motion.h2>
          <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
          <p
            className="font-serif italic text-lg max-w-xl mx-auto"
            style={{ color: 'rgba(245,240,232,0.55)' }}
          >
            Sacred architecture and timeless history, experienced through the lens of absolute luxury.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridAutoRows: '220px' }}>

          {/* Large hero image — spans 2 cols × 2 rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden group col-span-2 row-span-2 cursor-pointer"
            style={{ borderRadius: '2px' }}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(26,18,16,0.85) 30%, transparent)' }} />
            <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="font-nav text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: '#C9A84C' }}>Sacred Site</p>
              <p className="font-serif font-bold text-xl text-white">{images[0].label}</p>
            </div>
            {/* Always visible gold tag */}
            <div
              className="absolute top-4 left-4 font-nav text-[9px] uppercase tracking-[0.2em] px-3 py-1.5"
              style={{ backgroundColor: 'rgba(201,168,76,0.9)', color: '#1A1210', borderRadius: '999px' }}
            >
              Featured
            </div>
          </motion.div>

          {/* 4 smaller images — 1 col × 1 row each */}
          {images.slice(1, 5).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative overflow-hidden group cursor-pointer"
              style={{ borderRadius: '2px' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(26,18,16,0.55)' }} />
              <p className="absolute bottom-3 left-3 right-3 font-nav text-[9px] uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                {img.label}
              </p>
            </motion.div>
          ))}

          {/* Bottom wide image — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative overflow-hidden group cursor-pointer col-span-2"
            style={{ borderRadius: '2px' }}
          >
            <Image
              src={images[5].src}
              alt={images[5].alt}
              fill
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(26,18,16,0.55)' }} />
            <p className="absolute bottom-3 left-4 font-nav text-[9px] uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images[5].label}
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/category/vatican"
            className="inline-block font-nav font-bold uppercase tracking-[0.2em] text-sm py-4 px-12 transition-all hover:scale-105"
            style={{ border: '1px solid rgba(201,168,76,0.5)', color: '#C9A84C', borderRadius: '2px', backgroundColor: 'transparent' }}
          >
            View All Experiences →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
