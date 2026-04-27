'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const romeFacts = [
  'The Colosseum could hold up to 50,000 spectators',
  'Vatican City is the smallest country in the world at 0.17 square miles',
  'Rome has more fountains than any other city in the world',
  'The Trevi Fountain collects about €3,000 in coins every day',
  'Ancient Romans used urine as mouthwash',
  'The Pantheon has the world\'s largest unreinforced concrete dome',
  'Rome was founded in 753 BC by Romulus',
  'The Roman Forum was the center of ancient Roman life',
  'St. Peter\'s Basilica took 120 years to build',
  'The Spanish Steps have 135 steps',
  'Rome has over 900 churches',
  'The Sistine Chapel ceiling took Michelangelo 4 years to paint',
  'Ancient Rome had a population of over 1 million people',
  'The Mouth of Truth was an ancient lie detector',
  'Rome\'s nickname is "The Eternal City"',
  'Cats in Rome are protected by law',
  'The Vatican has its own post office and stamps',
  'Rome has more than 280 fountains and 900 churches',
  'The Colosseum was originally called the Flavian Amphitheatre',
  'Romans invented concrete that could set underwater',
];

export default function LoadingWithFacts() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    // Set initial random fact
    setFact(romeFacts[Math.floor(Math.random() * romeFacts.length)]);

    // Change fact every 4 seconds
    const interval = setInterval(() => {
      setFact(romeFacts[Math.floor(Math.random() * romeFacts.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      {/* Animated spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Fact display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={fact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <p className="text-sm text-muted-foreground mb-2">Did you know?</p>
          <p className="text-base text-gray-800 font-medium">{fact}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
