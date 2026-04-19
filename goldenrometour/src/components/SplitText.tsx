'use client';

import { motion } from 'framer-motion';

export default function SplitText({ children, className }: { children: string, className?: string }) {
  const words = children.split(" ");

  return (
    <div className={`overflow-hidden flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: i * 0.05,
              ease: [0.33, 1, 0.68, 1]
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
