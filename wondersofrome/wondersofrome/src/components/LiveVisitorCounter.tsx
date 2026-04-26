'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function LiveVisitorCounter() {
  const BASE = 923;
  const [count, setCount] = useState(BASE);

  useEffect(() => {
    setCount(BASE + Math.floor(Math.random() * 50));
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3;
      setCount(prev => Math.max(BASE, Math.min(BASE + 100, prev + change)));
    }, Math.random() * 5000 + 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-100">
      <Eye className="w-4 h-4 text-emerald-600 animate-pulse" />
      <div className="flex items-center gap-1">
        <span className="font-semibold text-gray-900 tabular-nums">{count}</span>
        <span className="text-sm text-gray-600">people viewing now</span>
      </div>
    </div>
  );
}
