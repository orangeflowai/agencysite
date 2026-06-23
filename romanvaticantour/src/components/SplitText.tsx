'use client';

import { CSSProperties } from 'react';

export default function SplitText({ children, className, style }: { children: string, className?: string, style?: CSSProperties }) {
  const words = children.split(" ");

  return (
    <div className={`overflow-hidden flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em]">
          <span
            className="inline-block"
          >
            {word}
          </span>
        </div>
      ))}
    </div>
  );
}
