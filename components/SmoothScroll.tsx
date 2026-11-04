'use client';
import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/components/hooks';

// Lenis smooth scrolling for mouse/trackpad only; phones and reduced motion keep native scrolling.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(matchMedia('(pointer: fine)').matches), []);
  return reduced || !fine ? <>{children}</> : <ReactLenis root>{children}</ReactLenis>;
}
