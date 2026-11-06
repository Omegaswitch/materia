'use client';
import { useEffect, useId, useRef } from 'react';

// Text that grows out of the page like a spore colony on bark, then stays alive at its own edges.
//
// Entrance (once): each block gets a growth map drawn in a small canvas: a few colonies spread outward from where
// their spores landed, a scatter of specks lands first. The map is thresholded while the threshold sweeps.
// Alive, as wet ink: the letters are displaced by a slow noise field, then softly blurred and re-cut at a threshold,
// so their edges creep, thin strokes swell and corners pool like ink still settling into the paper; the threshold
// rises and falls slowly, so the ink breathes. The amounts are set from the type size (with a visible minimum),
// and the noise field's contrast is restored first, so every heading moves, not only the biggest.
// (Earlier note:) the letters are displaced by a slow noise field. Inside a solid letter a displacement changes nothing, so
// only the outlines move: the letters seem to shift inside their own shell. Two smooth one-octave noise fields
// drift gently in opposite directions and slowly cross-fade into each other, so the outlines morph in place (no
// field visibly travels across the letters), updated every frame. Was: one field slid in a loop
// (feOffset) rather than re-rolled, so the motion is continuous, not jumpy. It runs at 30 fps, only for text on
// screen while the tab is visible. Edge size and speed scale with the type.
// WebKit (Safari, every iOS browser) gets a soft fade and still text; reduced motion, plain text.
// Every block also drifts at its own parallax rate (p, 0 = none).
const SHARP = 16; // crispness of the growing edge

// Small seeded PRNG
const prng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// The growth map: a grey image, bright where life arrives first.
function sporeMap(w, h, rnd) {
  const mw = Math.max(48, Math.min(240, Math.round(w / 3)));
  const mh = Math.max(16, Math.round((mw * h) / w));
  const diag = Math.hypot(mw, mh);
  const colonies = Array.from({ length: Math.max(2, Math.min(7, Math.round(w / 150))) }, () => ({
    x: rnd() * mw, y: (0.15 + rnd() * 0.7) * mh, speed: 0.55 + rnd() * 0.8, delay: rnd() * 0.3,
  }));
  const specks = Array.from({ length: Math.round((mw * mh) / 110) }, () => ({
    x: rnd() * mw, y: rnd() * mh, r: 0.6 + rnd() * 1.2, delay: 0.04 + rnd() * 0.4,
  }));
  const G = 7;
  const grid = Array.from({ length: (2 * G + 2) ** 2 }, rnd);
  const vn = (x, y, n) => { // value noise on an n×n grid
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, k = 2 * G + 2;
    const at = (i, j) => grid[((j % k) * k + (i % k)) % grid.length];
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return (at(xi, yi) * (1 - sx) + at(xi + 1, yi) * sx) * (1 - sy) + (at(xi, yi + 1) * (1 - sx) + at(xi + 1, yi + 1) * sx) * sy;
  };
  const canvas = document.createElement('canvas');
  canvas.width = mw; canvas.height = mh;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(mw, mh);
  const times = new Float32Array(mw * mh);
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      let t = Infinity;
      for (const c of colonies) t = Math.min(t, c.delay + Math.hypot(x - c.x, y - c.y) / (diag * 0.5 * c.speed));
      const u = (x / mw) * G, v = (y / mh) * G * (mh / mw) * 3;
      times[y * mw + x] = t + 0.28 * (0.65 * vn(u, v) + 0.35 * vn(u * 2.3 + 5, v * 2.3 + 3) - 0.5);
    }
  }
  for (const s of specks) { // each speck stamps only its own few pixels
    for (let y = Math.max(0, Math.floor(s.y - s.r)); y <= Math.min(mh - 1, Math.ceil(s.y + s.r)); y++) {
      for (let x = Math.max(0, Math.floor(s.x - s.r)); x <= Math.min(mw - 1, Math.ceil(s.x + s.r)); x++) {
        if (Math.hypot(x - s.x, y - s.y) < s.r) times[y * mw + x] = Math.min(times[y * mw + x], s.delay);
      }
    }
  }
  for (let k = 0; k < times.length; k++) {
    const g = Math.round(255 * Math.min(1, Math.max(0, 1 - times[k] / 1.2)));
    img.data[4 * k] = img.data[4 * k + 1] = img.data[4 * k + 2] = g;
    img.data[4 * k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export default function Grow({ as: Tag = 'div', children, className = '', style, duration = 2600, delay = 0, p, ...rest }) {
  const ref = useRef(null);
  const image = useRef(null);
  const matrix = useRef(null);
  const noise = useRef(null);
  const slide = useRef(null);
  const noise2 = useRef(null);
  const slide2 = useRef(null);
  const mix = useRef(null);
  const soak = useRef(null);
  const ink = useRef(null);
  const warp = useRef(null);
  const id = 'g' + useId().replace(/[^a-z0-9]/gi, '');
  // 0–1 from the id: stable on server and client
  const h = ([...id].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7) % 1000) / 1000;
  const drift = p ?? +(0.3 + h * 0.6).toFixed(2);
  const time = duration * (0.85 + h * 0.3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    window.__live = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('grown', 'still'); return undefined; }
    const fade = 'GestureEvent' in window;
    if (fade) el.classList.add('fade');
    const rnd = prng(1 + Math.floor(h * 2147483000));
    const set = (q) => matrix.current?.setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP + q * (SHARP + 1)}`);

    // the edge's character follows the type: broad slow swells on the big words, a fine shiver on body text
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    const freq = Math.min(0.07, Math.max(0.009, 1.1 / fs));
    // headings creep visibly (at least 1.6px); small text only a touch, so it stays crisp
    const amp = fs >= 24 ? Math.min(4.5, Math.max(1.6, fs * 0.04)) : Math.max(0.35, fs * 0.028); // creep, px
    const wet = fs >= 24 ? Math.min(1.1, Math.max(0.45, fs * 0.0085)) : 0.32;                 // ink pooling, px
    soak.current?.setAttribute('stdDeviation', wet.toFixed(2));
    const INK = 16; // crispness of the re-cut ink edge: steep, so the letters stay sharp
    const loop = 0.22 / freq; // each field drifts about a fifth of a cell: a sway, not a journey
    let w = 0, hgt = 0;
    const size = () => {
      w = el.offsetWidth; hgt = el.offsetHeight;
      image.current?.setAttribute('width', w); image.current?.setAttribute('height', hgt);
      // noise drawn larger than the block, so sliding it never shows an edge
      const m = Math.ceil(loop + amp * 2);
      for (const n of [noise.current, noise2.current]) {
        n?.setAttribute('x', -m); n?.setAttribute('y', -m);
        n?.setAttribute('width', w + 2 * m); n?.setAttribute('height', hgt + 2 * m);
      }
    };
    noise.current?.setAttribute('baseFrequency', freq.toFixed(4));
    noise2.current?.setAttribute('baseFrequency', (freq * 1.13).toFixed(4));
    warp.current?.setAttribute('scale', amp.toFixed(2));

    let raf = 0, start = 0, grown = false, visible = false, live = 0, lastLive = 0;
    const phase = h * Math.PI * 2, speed = 0.35 + h * 0.25; // radians per second: slow, different per block
    const breathe = (now) => {
      live = 0;
      lastLive = now;
      const a = phase + (now / 1000) * speed;
      slide.current?.setAttribute('dx', (Math.cos(a) * loop).toFixed(2));
      slide.current?.setAttribute('dy', (Math.sin(a * 0.8) * loop * 0.7).toFixed(2));
      slide2.current?.setAttribute('dx', (-Math.cos(a * 0.9 + 1.3) * loop).toFixed(2));
      slide2.current?.setAttribute('dy', (-Math.sin(a * 0.7 + 0.4) * loop * 0.7).toFixed(2));
      const k = 0.5 + 0.5 * Math.sin(a * 0.6); // the slow cross-fade between the two fields
      mix.current?.setAttribute('k2', k.toFixed(3));
      mix.current?.setAttribute('k3', (1 - k).toFixed(3));
      // the ink breathes: its threshold rises and falls, out of step with the creep
      const swell = 0.47 + 0.035 * Math.sin(a * 1.7 + 0.8);
      ink.current?.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${INK} ${(-INK * swell).toFixed(3)}`);
      if ((alive || !grown) && visible && document.visibilityState === 'visible') live = requestAnimationFrame(breathe);
    };
    const alive = fs >= 24; // only larger type stays alive: on small text the motion is invisible but not free
    const wake = () => { if (alive && grown && !fade && visible && !live && document.visibilityState === 'visible') live = requestAnimationFrame(breathe); };
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / time));
      set(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      breathe(now); // the edges are alive while it grows too
      if (t < 1) { raf = requestAnimationFrame(tick); return; }
      grown = true;
      el.classList.add('grown');
      // small text keeps its filter, frozen on its last frame: nothing switches, so nothing snaps
      wake();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !start && !el.classList.contains('grown')) {
        if (fade) { setTimeout(() => el.classList.add('grown'), delay); return; }
        size();
        image.current?.setAttribute('href', sporeMap(w, hgt, rnd));
        start = -1; // claimed; tick sets the real start
        raf = requestAnimationFrame((n) => { start = 0; tick(n); });
        return;
      }
      wake();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => { if (start) size(); });
    ro.observe(el);
    document.addEventListener('visibilitychange', wake);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(live); document.removeEventListener('visibilitychange', wake); };
  }, [delay, time, h]);

  return (
    // class 'seep', not 'grow': Tailwind would read 'grow' as flex-grow: 1
    <Tag ref={ref} className={`seep${drift ? ' para' : ''} ${className}`} style={{ ...style, '--grow': `url(#${id})`, ...(drift ? { '--p': drift } : null) }} {...rest}>
      <svg className="seep-defs" aria-hidden="true" focusable="false">
        <filter id={id} x="-6%" y="-20%" width="112%" height="140%" colorInterpolationFilters="sRGB">
          {/* entrance: where life arrives first (see sporeMap) */}
          <feImage ref={image} x="0" y="0" width="0" height="0" preserveAspectRatio="none" result="map" />
          <feColorMatrix ref={matrix} in="map" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP}`} result="mask" />
          {/* alive: a slow noise field, slid around a small loop, displaces the letters; only their outlines show it */}
          <feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed={Math.round(h * 997)} result="fieldA" />
          <feOffset ref={slide} in="fieldA" dx="0" dy="0" result="a" />
          <feTurbulence ref={noise2} type="fractalNoise" baseFrequency="0.023" numOctaves="1" seed={Math.round(h * 997) + 31} result="fieldB" />
          <feOffset ref={slide2} in="fieldB" dx="0" dy="0" result="b" />
          <feComposite ref={mix} in="a" in2="b" operator="arithmetic" k1="0" k2="0.5" k3="0.5" k4="0" result="blend" />
          <feGaussianBlur in="blend" stdDeviation="1.2" result="smooth" />
          {/* restore the field's contrast (blurring and cross-fading flatten it), so the creep is the size we set */}
          <feComponentTransfer in="smooth" result="field">
            <feFuncR type="linear" slope="4" intercept="-1.5" />
            <feFuncG type="linear" slope="4" intercept="-1.5" />
          </feComponentTransfer>
          <feDisplacementMap ref={warp} in="SourceGraphic" in2="field" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="crept" />
          {/* wet ink: soften, then re-cut, so corners pool and thin strokes swell */}
          <feGaussianBlur ref={soak} in="crept" stdDeviation="0.8" result="soaked" />
          <feColorMatrix ref={ink} in="soaked" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -7.5" result="alive" />
          <feComposite in="alive" in2="mask" operator="in" />
        </filter>
      </svg>
      {children}
    </Tag>
  );
}
