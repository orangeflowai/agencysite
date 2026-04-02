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
      className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-100"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Eye className="w-4 h-4 text-sky-600" />
      </motion.div>
      <div className="flex items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-semibold text-gray-900"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm text-gray-600">people viewing now</span>
      </div>
    </motion.div>
  );
}
