'use client';

import { motion } from 'framer-motion';
import { CSSProperties, ReactNode } from 'react';

export default function SplitText({ children, className, style }: { children: ReactNode, className?: string, style?: CSSProperties }) {
  if (typeof children !== 'string') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  const words = children.split(" ");

  return (
    <div className={`overflow-hidden flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: i * 0.05,
              ease: [0.33, 1, 0.68, 1] as any
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
