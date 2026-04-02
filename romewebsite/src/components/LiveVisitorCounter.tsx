'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';

export default function LiveVisitorCounter() {
  const [count, setCount] = useState(0);
  const baseCount = 847; // Base number of viewers

  useEffect(() => {
    // Generate a random starting count
    const randomStart = baseCount + Math.floor(Math.random() * 50);
    setCount(randomStart);

    // Update count every 5-10 seconds
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
      setCount((prev) => Math.max(baseCount, Math.min(baseCount + 100, prev + change)));
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-3 bg-cream px-6 py-2.5 border border-forest/10 shadow-2xl"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Eye className="w-3.5 h-3.5 text-gold" />
      </motion.div>
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-serif text-lg font-bold italic text-forest"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="font-sans text-[9px] font-black uppercase tracking-[0.2em] text-forest/40">Observing now</span>
      </div>
    </motion.div>
  );
}
