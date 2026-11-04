'use client';
import { useEffect, useId, useRef } from 'react';

// Text that grows out of the page: fractal noise is thresholded while the threshold sweeps, so the letters
// seep in from scattered seeds like something spreading through paper, edges wobbling until they settle.
// Runs once when the text enters the screen, then the filter is dropped. No JS or reduced motion: plain text.
// Every block also drifts at its own parallax rate (p, 0 = none). Speed, grain and drift come from a seed,
// so nothing on the page moves in lockstep.
const SHARP = 7; // how crisp the growing edge is

export default function Grow({ as: Tag = 'div', children, className = '', style, duration = 2400, delay = 0, p, ...rest }) {
  const ref = useRef(null);
  const matrix = useRef(null);
  const warp = useRef(null);
  const id = 'g' + useId().replace(/[^a-z0-9]/gi, '');
  // 0–1 from the id: stable on server and client
  const h = ([...id].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7) % 1000) / 1000;
  const drift = p ?? +(0.35 + h * 0.9).toFixed(2);
  const time = duration * (0.85 + h * 0.3);
  const grain = (0.018 + h * 0.016).toFixed(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    window.__live = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('grown'); return undefined; }
    // WebKit (Safari, every iOS browser) runs SVG filters on the CPU: a soft fade there instead of the growth.
    const fade = 'GestureEvent' in window;
    if (fade) el.classList.add('fade');
    let raf = 0;
    let start = 0;
    const set = (q) => {
      // alpha = SHARP * noise + offset; offset sweeps from no seeds (q = 0) to solid (q = 1)
      const o = -SHARP * 0.8 + q * (SHARP * 0.8 + 1);
      matrix.current?.setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${o}`);
      warp.current?.setAttribute('scale', String((1 - q) * 9));
    };
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / time));
      set(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // ease in-out: it spreads, then fills
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.classList.add('grown');
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (fade) setTimeout(() => el.classList.add('grown'), delay);
      else raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [delay, time]);

  return (
    <Tag ref={ref} className={`grow${drift ? ' para' : ''} ${className}`} style={{ ...style, '--grow': `url(#${id})`, ...(drift ? { '--p': drift } : null) }} {...rest}>
      <svg className="grow-defs" aria-hidden="true" focusable="false">
        <filter id={id} x="-5%" y="-20%" width="110%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={grain} numOctaves="2" seed={Math.round(h * 997)} result="noise" />
          <feColorMatrix ref={matrix} in="noise" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP * 0.8}`} result="mask" />
          <feDisplacementMap ref={warp} in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feComposite in="warped" in2="mask" operator="in" />
        </filter>
      </svg>
      {children}
    </Tag>
  );
}
