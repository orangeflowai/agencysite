'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function LiveVisitorCounter() {
  const [count, setCount] = useState(0);
  const baseCount = 847;

  useEffect(() => {
    const randomStart = baseCount + Math.floor(Math.random() * 50);
    setCount(randomStart);

    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3;
      setCount((prev) => Math.max(baseCount, Math.min(baseCount + 100, prev + change)));
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 bg-muted px-6 py-2.5 border border-border shadow-md rounded-full">
      <div className="animate-pulse">
        <Eye className="w-3.5 h-3.5 text-accent" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-foreground">{count}</span>
        <span className="text-xs text-muted-foreground">viewing now</span>
      </div>
    </div>
  );
}
