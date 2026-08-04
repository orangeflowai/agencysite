'use client';

import React from 'react';

interface WordHighlightProps {
  children: string;
  keywords: string[];
  highlightClassName?: string;
}

export default function WordHighlight({
  children,
  keywords,
  highlightClassName = 'text-primary font-bold italic',
}: WordHighlightProps) {
  if (!keywords || keywords.length === 0) return <>{children}</>;

  // Create a regex to match all keywords (case-insensitive)
  const escapedKeywords = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

  const parts = children.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(
          kw => kw.toLowerCase() === part.toLowerCase()
        );
        return isKeyword ? (
          <span key={i} className={highlightClassName}>
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
}
