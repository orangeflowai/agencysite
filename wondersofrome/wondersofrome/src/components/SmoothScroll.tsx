'use client';
import { ReactNode } from 'react';

// Native CSS smooth scroll only — no JS library
// All scroll behavior is handled by CSS in globals.css
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
