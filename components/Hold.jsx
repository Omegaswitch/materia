'use client';
import { useEffect, useRef } from 'react';

// A section that holds still for a short stretch of scroll (extra), then carries on.
// Taller than the screen: it holds once its bottom is in view, so nothing is cut off.
export default function Hold({ children, extra = '25svh' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fit = () => { el.style.top = `${Math.min(0, innerHeight - el.offsetHeight)}px`; };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    addEventListener('resize', fit);
    return () => { ro.disconnect(); removeEventListener('resize', fit); };
  }, []);
  return (
    // the room to hold in must be content, not padding: a sticky box only moves within its parent's content box
    <div>
      <div ref={ref} style={{ position: 'sticky', top: 0 }}>{children}</div>
      <div style={{ height: extra }} aria-hidden="true" />
    </div>
  );
}
