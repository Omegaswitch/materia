'use client';
import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from '@/components/hooks';

// Lenis smooth scrolling site-wide; plain native scroll when reduced motion is on.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return reduced ? <>{children}</> : <ReactLenis root>{children}</ReactLenis>;
}
