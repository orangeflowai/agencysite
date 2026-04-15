'use client';

import { useScreenSize } from "@/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { motion } from "framer-motion";

export default function GooeyHero() {
  const screenSize = useScreenSize();

  return (
    <div className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden bg-neutral-950">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1920&q=80"
        alt="Vatican City"
        className="w-full h-full object-cover absolute inset-0 opacity-40 mix-blend-luminosity"
      />

      {/* Gooey Effect Layer */}
      <GooeyFilter id="hero-pixel-trail" strength={8} />

      <div
        className="absolute inset-0 z-10 pointer-events-auto"
        style={{ filter: "url(#hero-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan('md') ? 20 : 28}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-sky-400"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 max-w-4xl px-6 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-[10px] uppercase tracking-[0.3em] font-bold text-sky-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Limited VIP Access Available
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tight text-white leading-[0.9] font-serif italic">
            Rome is <br />
            <span className="text-sky-400 not-italic">Infinite.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto font-sans font-light leading-relaxed">
            Experience the Eternal City through architectural precision and exclusive paths. 
            Interaction is just the beginning of your journey.
          </p>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-10" />
    </div>
  );
}
