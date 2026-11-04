'use client';
import { useEffect, useRef } from 'react';
import Panels from '@/components/Panels';
import { useReducedMotion } from '@/components/hooks';

// Fixed wood layer over the whole site. Near every page boundary the blocks close in and part again,
// so each page change happens through the wood. Off with reduced motion.
// BAND: how far (in viewport heights) from a boundary the wood starts closing. Pages and slides are ~1 viewport apart,
// so the wood covers the screen for about 2 × BAND of every page/slide change.
const BAND = 0.16;

export default function WoodScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    let edges: number[] = [];
    // Stable viewport: only re-measure on width change (phone address bars change height constantly).
    let vw = innerWidth;
    let vh = innerHeight;
    const measure = () => {
      // Pages sit one after another, so boundaries are cumulative heights (sticky pages make rects unreliable).
      const pages = document.querySelectorAll<HTMLElement>('.stack > *, [data-slides], footer');
      edges = [];
      let top = 0;
      pages.forEach((p, i) => {
        if (i) edges.push(top);
        const n = Number(p.dataset.slides || 0);
        // Inside the horizontal slider: a boundary between every pair of slides.
        const step = n > 1 ? (p.offsetHeight - vh) / (n - 1) : 0;
        for (let k = 0; k < n - 1; k++) edges.push(top + (k + 0.5) * step + vh / 2);
        top += p.offsetHeight;
      });
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = scrollY + vh / 2;
      const d = Math.min(...edges.map((e) => Math.abs(mid - e) / vh), Infinity);
      el.style.setProperty('--amt', String(Math.min(1, Math.max(0, d / BAND))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { if (innerWidth !== vw) { vw = innerWidth; vh = innerHeight; } measure(); update(); };
    measure(); update();
    addEventListener('scroll', onScroll, { passive: true });
    // Content height changes (fonts, images) re-measure; window resizes go through the width check.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => { removeEventListener('scroll', onScroll); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-50" style={{ ['--amt' as string]: 1 }} aria-hidden="true">
      <Panels scrub columns={6} seed={11} />
    </div>
  );
}
