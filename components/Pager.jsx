'use client';
import { useEffect, useRef, useState } from 'react';

// Every .page is a stage: one at a time fills the screen, and a gesture turns to the next or previous one.
// There is no free scrolling between pages, so a page always sits exactly in the screen.
// - Wheel / trackpad: one gesture turns one page. A trackpad swipe keeps sending decaying "momentum" wheel
//   events for a second or more; they are ignored until the wheel has been quiet for QUIET ms.
// - Touch: one vertical swipe turns one page; sideways swipes are left to carousels.
// - Keys: arrows, Page Up/Down, Space (Shift+Space back), Home, End. In-page #links turn to their page.
// - A page taller than the screen scrolls inside itself first, then turns.
// Without JS the site keeps its normal scrolling (html never gets .paged). Reduced motion: pages switch at once.
const NAMES = { top: 'Start', story: 'Materia', colours: 'The colours', wood: 'Wood', kits: 'Kits', renders: 'Renders', vendors: 'Vendors' };
const DARK = new Set(['wood']); // pages under which the indicator turns paper-coloured
const QUIET = 170;
const TURN = 1150; // the length of one page turn, in ms

export default function Pager() {
  const [names, setNames] = useState([]);
  const [ids, setIds] = useState([]);
  const [at, setAt] = useState(0);
  const [dist, setDist] = useState(1); // how many pages the last move covered: longer moves flow a little longer
  const go = useRef(() => {});

  useEffect(() => {
    const pages = [...document.querySelectorAll('.page')];
    if (pages.length < 2) return undefined;
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pageOf = (el) => pages.findIndex((p) => p.contains(el));

    // A shared #link opens on its page; anything else, including a refresh, opens on the first.
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    let cur = Math.max(0, target ? pageOf(target) : 0);
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    root.classList.add('paged');
    pages.forEach((p, i) => p.classList.toggle('on', i === cur));
    setNames(pages.map((p, i) => NAMES[p.id] ?? `Page ${i + 1}`));
    setIds(pages.map((p) => p.id));
    setAt(cur);

    let busy = false;
    go.current = (next) => {
      const i = Math.max(0, Math.min(pages.length - 1, next));
      if (i === cur || busy) return;
      const from = pages[cur];
      const to = pages[i];
      const d = i > cur ? 1 : -1;
      setDist(Math.abs(i - cur));
      cur = i;
      setAt(i);
      to.scrollTop = d > 0 ? 0 : to.scrollHeight;
      if (reduce) { from.classList.remove('on'); to.classList.add('on'); return; }
      busy = true;
      from.classList.replace('on', 'leaving');
      to.classList.add('on');
      const out = from.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translate3d(0, ${-4 * d}vh, 0)` }],
        { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.7, 1)', fill: 'forwards' },
      );
      out.finished.then(() => { from.classList.remove('leaving'); out.cancel(); });
      to.animate(
        [{ opacity: 0, transform: `translate3d(0, ${7 * d}vh, 0)` }, { opacity: 1, transform: 'none' }],
        { duration: 900, delay: TURN - 900, easing: 'cubic-bezier(0.2, 0.7, 0.1, 1)', fill: 'backwards' },
      ).finished.then(() => { busy = false; });
    };

    // Can this element (or an ancestor inside the page) still scroll in direction dy?
    const scrolls = (el, dy, axis = 'y') => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (axis === 'y' && /(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1) {
          if (dy > 0 ? n.scrollTop + n.clientHeight < n.scrollHeight - 1 : n.scrollTop > 0) return true;
        }
        if (n.classList?.contains('page')) break;
      }
      return false;
    };

    let last = 0;
    let quietUntil = 0;
    let sum = 0;
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // pinch-zoom, sideways carousels
      if (scrolls(e.target, e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - last;
      last = now;
      if (busy || now < quietUntil) { quietUntil = Math.max(quietUntil, now + QUIET); return; } // momentum tail
      if (gap > QUIET) sum = 0;
      sum += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(sum) >= 24) {
        go.current(cur + Math.sign(sum));
        sum = 0;
        quietUntil = now + TURN;
      }
    };

    let sx = 0, sy = 0, st = null;
    const onTouchStart = (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = e.target; };
    const onTouchMove = (e) => {
      const t = e.touches[0];
      const dx = sx - t.clientX, dy = sy - t.clientY;
      if (Math.abs(dy) > Math.abs(dx) && !scrolls(st, dy)) e.preventDefault(); // no rubber band, no pull-to-refresh
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = sx - t.clientX, dy = sy - t.clientY;
      if (Math.abs(dy) > 44 && Math.abs(dy) > Math.abs(dx) * 1.2 && !scrolls(st, dy)) go.current(cur + Math.sign(dy));
    };

    const onKey = (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const step = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': e.shiftKey ? -1 : 1 }[e.key];
      if (e.key === 'Home') go.current(0);
      else if (e.key === 'End') go.current(pages.length - 1);
      else if (step && !scrolls(e.target, step)) go.current(cur + step);
      else return;
      e.preventDefault();
    };

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      const i = el ? pageOf(el) : -1;
      if (i < 0) return;
      e.preventDefault();
      go.current(i);
    };

    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: false });
    addEventListener('touchend', onTouchEnd, { passive: true });
    addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
      removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      root.classList.remove('paged');
    };
  }, []);

  if (!names.length) return null;
  // The indicator is liquid: a "goo" filter (blur, then a hard alpha threshold) melts shapes that come close.
  // The current page is a drop of two blobs, a head that leaves first and a tail that follows, so on the way it
  // stretches, pulls away from the dot it leaves and merges into the one it lands on.
  return (
    <nav className={`pager${DARK.has(ids[at]) ? ' pager--light' : ''}`} aria-label="Pages" style={{ '--at': at, '--dist': dist }}>
      <svg className="pager-defs" aria-hidden="true" focusable="false">
        <filter id="pager-goo" x="-100%" y="-10%" width="300%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="soft" />
          <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div className="pager-dots" aria-hidden="true">
        {names.map((name, i) => <span key={name} className="pager-dot" style={{ '--i': i }} />)}
      </div>
      <div className="pager-goo" aria-hidden="true">
        {/* anchors: too small to show on their own, they bridge to the drop as it leaves and arrives */}
        {names.map((name, i) => <span key={name} className="pager-anchor" style={{ '--i': i }} />)}
        <span className="pager-drop pager-head" />
        <span className="pager-drop pager-body" />
        <span className="pager-drop pager-tail" />
      </div>
      {names.map((name, i) => (
        <button key={name} type="button" aria-label={name} aria-current={i === at ? 'page' : undefined} onClick={() => go.current(i)} />
      ))}
    </nav>
  );
}
