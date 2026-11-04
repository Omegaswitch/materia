'use client';
import { useEffect, useId, useRef } from 'react';

// Text that grows out of the page: fractal noise is thresholded while the threshold sweeps, so the letters
// seep in from scattered seeds like something spreading through paper, edges wobbling until they settle.
// Runs once when the text enters the screen, then the filter is dropped. No JS or reduced motion: plain text.
const SHARP = 9; // how crisp the growing edge is

export default function Grow({ as: Tag = 'div', children, className = '', style, duration = 2200, delay = 0, ...rest }) {
  const ref = useRef(null);
  const matrix = useRef(null);
  const warp = useRef(null);
  const id = 'g' + useId().replace(/[^a-z0-9]/gi, '');
  const seed = id.length * 7 + id.charCodeAt(id.length - 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('grown'); return undefined; }
    let raf = 0;
    let start = 0;
    const set = (p) => {
      // alpha = SHARP * noise + offset; offset sweeps from fully hidden to fully grown
      const o = -SHARP * 0.8 + p * (SHARP * 0.8 + 1); // first seeds at p = 0, solid at p = 1
      matrix.current?.setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${o}`);
      warp.current?.setAttribute('scale', String((1 - p) * 7));
    };
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      set(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // ease in-out: it spreads, then fills
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.classList.add('grown');
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [delay, duration]);

  return (
    <Tag ref={ref} className={`grow ${className}`} style={{ ...style, '--grow': `url(#${id})` }} {...rest}>
      <svg className="grow-defs" aria-hidden="true" focusable="false">
        <filter id={id} x="-5%" y="-20%" width="110%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed={seed} result="noise" />
          <feColorMatrix ref={matrix} in="noise" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP * 0.8}`} result="mask" />
          <feDisplacementMap ref={warp} in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feComposite in="warped" in2="mask" operator="in" />
        </filter>
      </svg>
      {children}
    </Tag>
  );
}
