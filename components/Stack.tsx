'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Full-screen pages stacked: each sticks and the next slides up over it.
// A page taller than the viewport sticks at (viewport - height) so its bottom is still reachable.
export default function Stack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pages = Array.from(ref.current?.children ?? []) as HTMLElement[];
    const fit = () => pages.forEach((p) => (p.style.top = `${Math.min(0, innerHeight - p.offsetHeight)}px`));
    const ro = new ResizeObserver(fit);
    pages.forEach((p) => ro.observe(p));
    addEventListener('resize', fit);
    return () => { ro.disconnect(); removeEventListener('resize', fit); };
  }, []);
  return <div ref={ref} className="stack">{children}</div>;
}
