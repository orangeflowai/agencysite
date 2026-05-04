'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import GradientProductSlider from './GradientProductSlider';

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const galleryImages = [
  `${R2}/pexels-alex-250137-757239.jpg`,
  `${R2}/pexels-c1superstar-27096007.jpg`,
  `${R2}/pexels-efrem-efre-2786187-17282659.jpg`,
  `${R2}/pexels-filiamariss-30785778.jpg`,
  `${R2}/pexels-gaborbalazs97-34279960.jpg`,
  `${R2}/pexels-holodna-29692553.jpg`,
  `${R2}/pexels-imagenesclau-35046617.jpg`,
  `${R2}/pexels-matteobasilephoto-11200578.jpg`,
  `${R2}/pexels-nastiz-12604242.jpg`,
];

interface RomeGalleryProps {
  vaticanTours: any[];
}

export default function RomeGallery({ vaticanTours }: RomeGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Grid Transforms
  const gridScale = useTransform(scrollYProgress, [0, 0.7], [1, 3]);
  const gridOpacity = useTransform(scrollYProgress, [0.6, 0.8], [1, 0]);
  
  // Column Transforms (moving apart)
  const leftColX = useTransform(scrollYProgress, [0, 0.7], ["0%", "-50%"]);
  const rightColX = useTransform(scrollYProgress, [0, 0.7], ["0%", "50%"]);
  const centerColY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-20%"]);

  // Product Slider Transforms
  const sliderOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const sliderScale = useTransform(scrollYProgress, [0.6, 0.9], [0.8, 1]);
  const sliderY = useTransform(scrollYProgress, [0.6, 0.8], [100, 0]);

  // Group images into 3 columns
  const col1 = galleryImages.slice(0, 3);
  const col2 = galleryImages.slice(3, 6);
  const col3 = galleryImages.slice(6, 9);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* The "Sink-In" Grid */}
        <motion.div 
          style={{ 
            scale: gridScale, 
            opacity: gridOpacity,
          }}
          className="absolute inset-0 z-10 flex justify-center items-center gap-4 md:gap-8 px-4"
        >
          {/* Column 1 */}
          <motion.div style={{ x: leftColX }} className="flex flex-col gap-4 md:gap-8 w-1/3">
            {col1.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image src={src} alt="Rome" fill className="object-cover" />
              </div>
            ))}
          </motion.div>

          {/* Column 2 (Center) */}
          <motion.div style={{ y: centerColY }} className="flex flex-col gap-4 md:gap-8 w-1/3 mt-20">
            {col2.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <Image src={src} alt="Rome" fill className="object-cover" />
              </div>
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div style={{ x: rightColX }} className="flex flex-col gap-4 md:gap-8 w-1/3">
            {col3.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image src={src} alt="Rome" fill className="object-cover" />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* The Text that stays until zoom hits */}
        <motion.div 
          initial={{ opacity: 1 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
          className="absolute z-20 text-center pointer-events-none"
        >
          <h2 className="text-5xl md:text-8xl font-serif font-bold text-white drop-shadow-2xl tracking-tighter leading-none">
            UNFOLD THE<br/><span className="text-primary">ETERNAL</span>
          </h2>
          <p className="text-white/60 font-mono text-xs tracking-[0.5em] mt-8 uppercase">Scroll to enter the archive</p>
        </motion.div>

        {/* The revealed Product Slider */}
        <motion.div 
          style={{ 
            opacity: sliderOpacity,
            scale: sliderScale,
            y: sliderY
          }}
          className="absolute inset-0 z-30 flex flex-col justify-center"
        >
          <GradientProductSlider 
            title="Vatican Collection" 
            subtitle="SKIP THE LINE: SISTINE CHAPEL, MUSEUMS, GARDENS." 
            tours={vaticanTours} 
            link="/category/vatican" 
          />
        </motion.div>

      </div>
    </div>
  );
}
