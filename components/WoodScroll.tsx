'use client';
import { useEffect, useRef } from 'react';
import Panels from '@/components/Panels';
import { useReducedMotion } from '@/components/hooks';

// Fixed wood layer over the whole site. Near every page boundary the blocks close in and part again,
// so each page change happens through the wood. Off with reduced motion.
// BAND: how far (in viewport heights) from a boundary the wood starts closing.
const BAND = 0.45;

export default function WoodScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    let edges: number[] = [];
    const measure = () => {
      // Pages sit one after another, so boundaries are cumulative heights (sticky pages make rects unreliable).
      const pages = document.querySelectorAll<HTMLElement>('.stack > *, [data-slides], footer');
      edges = [];
      let top = 0;
      pages.forEach((p, i) => {
        if (i) edges.push(top);
        const n = Number(p.dataset.slides || 0);
        // Inside the horizontal slider: a boundary between every pair of slides.
        const step = n > 1 ? (p.offsetHeight - innerHeight) / (n - 1) : 0;
        for (let k = 0; k < n - 1; k++) edges.push(top + (k + 0.5) * step + innerHeight / 2);
        top += p.offsetHeight;
      });
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = scrollY + innerHeight / 2;
      const d = Math.min(...edges.map((e) => Math.abs(mid - e) / innerHeight), Infinity);
      el.style.setProperty('--amt', String(Math.min(1, Math.max(0, d / BAND))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); update(); };
    measure(); update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-50" style={{ ['--amt' as string]: 1 }} aria-hidden="true">
      <Panels scrub columns={6} seed={11} />
    </div>
  );
}
