'use client';
import { useEffect, useId, useRef } from 'react';

// Text that grows out of the page like a spore colony on bark, then stays a little alive.
//
// Growth: each block gets its own growth map, drawn once in a small canvas: a few colonies spread outward from
// where their spores landed (distance from each spore, roughened with noise), and a scatter of tiny specks lands
// first. The map is thresholded while the threshold sweeps, so specks appear, colonies swell and merge, and the
// letters fill in. The map itself is displaced by noise, so the growing fronts wobble.
// Shake: the noise is re-rolled every ~80 ms (a "line boil", as in hand-drawn animation): the letters tremble while
// they grow and keep a faint tremble once grown.
// Live: once grown, a few tiny flecks blink out and back every second or two.
// Cost: the live loop runs at ~9 fps, only while the block is on screen and the tab is visible. WebKit (Safari,
// every iOS browser) runs SVG filters on the CPU, so it gets a soft fade instead; reduced motion gets plain text.
// Every block also drifts at its own parallax rate (p, 0 = none).
const SHARP = 16; // crispness of the growing edge: colonies have crisp, ragged borders
const BOIL = 80; // ms between re-rolls of the tremble while growing
const LIVE = 110; // ms between re-rolls once grown

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

// vanishBefore: a selector; as this block scrolls up toward that element it dissolves back into the page, gone before it touches.
export default function Grow({ as: Tag = 'div', children, className = '', style, duration = 2600, delay = 0, p, vanishBefore, ...rest }) {
  const ref = useRef(null);
  const image = useRef(null);
  const boil = useRef(null);
  const matrix = useRef(null);
  const warp = useRef(null);
  const fleckNoise = useRef(null);
  const fleck = useRef(null);
  const id = 'g' + useId().replace(/[^a-z0-9]/gi, '');
  // 0–1 from the id: stable on server and client
  const h = ([...id].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7) % 1000) / 1000;
  const drift = p ?? +(0.3 + h * 0.6).toFixed(2);
  const time = duration * (0.85 + h * 0.3);
  const grain = (0.022 + h * 0.014).toFixed(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    window.__live = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('grown'); return undefined; }
    const fade = 'GestureEvent' in window;
    if (fade) el.classList.add('fade');
    const rnd = prng(1 + Math.floor(h * 2147483000));

    const set = (q) => { // q: 0 nothing, 1 fully grown
      matrix.current?.setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP + q * (SHARP + 1)}`);
    };
    const reroll = (scale) => { // the line boil: new noise, same character
      boil.current?.setAttribute('seed', String(Math.floor(rnd() * 9999)));
      warp.current?.setAttribute('scale', scale.toFixed(2));
    };
    const flecks = (on) => { // a few tiny specks blink out: only the brightest 1–2% of a fine noise
      fleckNoise.current?.setAttribute('seed', String(Math.floor(rnd() * 9999)));
      fleck.current?.setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  26 0 0 0 ${on ? -26 * 0.715 : -40}`);
    };
    const size = () => { image.current?.setAttribute('width', el.offsetWidth); image.current?.setAttribute('height', el.offsetHeight); };

    let raf = 0, live = 0, visible = false, grown = false, built = false, lastBoil = 0, ticks = 0, start = 0;
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / time));
      set(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // slow start, spreading, slow finish
      if (now - lastBoil > BOIL) { lastBoil = now; reroll(0.7 + (1 - t) * 2.4); }
      if (t < 1) { raf = requestAnimationFrame(tick); return; }
      grown = true;
      el.classList.add('grown');
      toggleLive();
    };
    const liveTick = () => {
      ticks++;
      reroll(0.55 + rnd() * 0.5);
      if (ticks % (10 + Math.floor(rnd() * 12)) === 0) flecks(rnd() < 0.8);
    };
    const toggleLive = () => {
      const run = grown && visible && document.visibilityState === 'visible' && !fade;
      if (run && !live) live = setInterval(liveTick, LIVE);
      if (!run && live) { clearInterval(live); live = 0; }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !built) {
        built = true;
        if (fade) { setTimeout(() => el.classList.add('grown'), delay); return; }
        size();
        image.current?.setAttribute('href', sporeMap(el.offsetWidth, el.offsetHeight, rnd));
        raf = requestAnimationFrame(tick);
      }
      toggleLive();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => { if (built) size(); });
    ro.observe(el);
    document.addEventListener('visibilitychange', toggleLive);

    // Dissolve as it nears vanishBefore: by the gap left, as a share of the gap at rest (layout positions, no transforms)
    const target = vanishBefore && document.querySelector(vanishBefore);
    let frame = 0;
    const top = (n) => { let y = 0; for (; n; n = n.offsetParent) y += n.offsetTop; return y; };
    const check = () => {
      frame = 0;
      if (!target || !grown) return;
      const rest = Math.max(40, (top(el) - top(target) - target.offsetHeight) * 0.9);
      const now = el.getBoundingClientRect().top;
      const gap = now - target.getBoundingClientRect().bottom;
      // and fully gone by the time it reaches the top 30% of the screen, even once the logo stops drifting
      const line = innerHeight * 0.3;
      const travel = Math.max(1, top(el) - line);
      const q = Math.min(1, Math.max(0, Math.min(gap / rest, ((now - line) / travel) * 1.6)));
      if (fade) { el.style.opacity = q >= 1 ? '' : String(q); return; }
      set(q);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    if (target) addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(frame); clearInterval(live);
      removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', toggleLive);
    };
  }, [delay, time, vanishBefore, h]);

  return (
    // class 'seep', not 'grow': Tailwind would read 'grow' as flex-grow: 1
    <Tag ref={ref} className={`seep${drift ? ' para' : ''} ${className}`} style={{ ...style, '--grow': `url(#${id})`, ...(drift ? { '--p': drift } : null) }} {...rest}>
      <svg className="seep-defs" aria-hidden="true" focusable="false">
        <filter id={id} x="-4%" y="-15%" width="108%" height="130%" colorInterpolationFilters="sRGB">
          {/* where life arrives first (see sporeMap), its fronts wobbled by the boiling noise */}
          <feImage ref={image} x="0" y="0" width="0" height="0" preserveAspectRatio="none" result="map" />
          <feTurbulence ref={boil} type="fractalNoise" baseFrequency={grain} numOctaves="2" seed={Math.round(h * 997)} result="noise" />
          <feDisplacementMap in="map" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="ragged" />
          <feColorMatrix ref={matrix} in="ragged" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${SHARP} 0 0 0 ${-SHARP}`} result="mask" />
          {/* the tremble */}
          <feDisplacementMap ref={warp} in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="shaken" />
          <feComposite in="shaken" in2="mask" operator="in" result="grown" />
          {/* tiny flecks that blink out and back once grown */}
          <feTurbulence ref={fleckNoise} type="fractalNoise" baseFrequency="0.17" numOctaves="1" seed="3" result="fine" />
          <feColorMatrix ref={fleck} in="fine" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  26 0 0 0 -40" result="specks" />
          <feComposite in="grown" in2="specks" operator="out" />
        </filter>
      </svg>
      {children}
    </Tag>
  );
}
