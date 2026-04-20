'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  type?: 'fade' | 'slide-up' | 'split-text';
}

export default function AnimatedSection({
  children,
  delay = 0,
  className = '',
  id,
  type = 'slide-up',
}: AnimatedSectionProps) {
  if (type === 'split-text' && typeof children === 'string') {
    const words = children.split(' ');
    
    return (
      <div id={id} className={`flex flex-wrap ${className}`}>
        {words.map((word, i) => (
          <div key={i} className="overflow-hidden mr-[0.25em]">
            <motion.span
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: delay + (i * 0.05),
                ease: [0.33, 1, 0.68, 1],
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

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.div
      id={id}
      initial={variants[type === 'fade' ? 'fade' : 'slide-up'].initial}
      whileInView={variants[type === 'fade' ? 'fade' : 'slide-up'].animate}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
