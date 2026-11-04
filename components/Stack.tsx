'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Full-screen pages stacked: each sticks and the next slides up over it.
// A page taller than the viewport sticks at (viewport - height) so its bottom is still reachable.
export default function Stack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pages = Array.from(ref.current?.children ?? []) as HTMLElement[];
    // Use the small viewport height (address bar shown) and ignore height-only resizes,
    // so pages don't jump when a phone's address bar slides in and out.
    let vw = innerWidth;
    let vh = innerHeight;
    const fit = () => pages.forEach((p) => (p.style.top = `${Math.min(0, vh - p.offsetHeight)}px`));
    const onResize = () => { if (innerWidth !== vw) { vw = innerWidth; vh = innerHeight; fit(); } };
    const ro = new ResizeObserver(fit);
    pages.forEach((p) => ro.observe(p));
    addEventListener('resize', onResize);
    return () => { ro.disconnect(); removeEventListener('resize', onResize); };
  }, []);
  return <div ref={ref} className="stack">{children}</div>;
}
