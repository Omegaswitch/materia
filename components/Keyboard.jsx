'use client';
import { useEffect, useRef, useState } from 'react';
import { keyboard } from '../content';
import Panels from './Panels';
import Asset from './Asset';
import { useInView, useReducedMotion } from './hooks';
import s from './Keyboard.module.css';

const GAP = 56; // px height of the connector band between image and label rows
const numbered = keyboard.colors.map((c, i) => ({ ...c, n: i + 1 }));
const rows = ['top', 'bottom'].map((side) => {
  const list = numbered.filter((c) => c.side === side).sort((a, b) => a.x - b.x);
  return { side, list: list.map((c, k) => ({ ...c, slot: ((k + 0.5) / list.length) * 100, k })) };
});

function Connectors({ side, list, shown, order }) {
  const near = side === 'top' ? GAP : 0, far = side === 'top' ? 0 : GAP, mid = GAP / 2;
  return (
    <svg className={s.band} viewBox={`0 0 100 ${GAP}`} preserveAspectRatio="none" aria-hidden="true">
      {list.map((c) => (
        <path key={c.id} pathLength="1" vectorEffect="non-scaling-stroke"
          className={`${s.line} ${shown ? s.on : ''}`} style={{ '--d': order(c) }}
          d={`M${c.x} ${near} V${mid} H${c.slot} V${far}`} />
      ))}
    </svg>
  );
}

function Labels({ list, shown, order, side }) {
  return (
    <ul className={`${s.labels} ${s[side]}`} role="presentation">
      {list.map((c) => (
        <li key={c.id} className={`${s.label} ${shown ? s.on : ''}`} style={{ left: `${c.slot}%`, '--d': order(c), width: `${90 / list.length}%` }} aria-hidden="true">
          <span className={s.swatch} style={{ background: c.swatch }} />
          <span className={s.num}>{c.n}</span> <strong className={s.name}>{c.name}</strong>
          <span className={s.desc}>{c.description}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Keyboard() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref);
  const opened = reduced || inView;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced) return setShown(true);
    if (!inView) return;
    const t = setTimeout(() => setShown(true), 1200);
    return () => clearTimeout(t);
  }, [inView, reduced]);
  const order = (c) => c.n - 1;

  return (
    <section id="colours" aria-labelledby="colours-title" className={`${s.section} ${reduced ? s.still : ''}`}>
      <h2 id="colours-title" className="section-title">{keyboard.heading}</h2>
      <div ref={ref} className={`${s.stage} paper`}>
        <div className={s.frame}>
          {rows.map(({ side, list }) => list.length > 0 && (
            <div key={side} className={`${s.side} ${s[side]}`}>
              <Labels list={list} shown={shown} order={order} side={side} />
              <Connectors side={side} list={list} shown={shown} order={order} />
            </div>
          ))}
          <div className={s.image}>
            <Asset {...keyboard.image} />
            <svg className={s.overlay} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {numbered.map((c) => (
                <path key={c.id} pathLength="1" vectorEffect="non-scaling-stroke"
                  className={`${s.line} ${shown ? s.on : ''}`} style={{ '--d': order(c) }}
                  d={`M${c.x} ${c.y} V${c.side === 'top' ? 0 : 100}`} />
              ))}
            </svg>
            {numbered.map((c) => (
              <span key={c.id} className={`${s.marker} ${shown ? s.on : ''}`} aria-hidden="true"
                style={{ left: `${c.x}%`, top: `${c.y}%`, '--d': order(c) }}>{c.n}</span>
            ))}
          </div>
        </div>
        <Panels columns={6} seed={3} open={opened} />
      </div>
      <ol className={s.legend}>
        {numbered.map((c) => (
          <li key={c.id} className={s.item}>
            <span className={s.swatch} style={{ background: c.swatch }} aria-hidden="true" />
            <span className={s.num} aria-hidden="true">{c.n}</span>
            <span><strong className={s.name}>{c.name}</strong> <span className={s.desc}>{c.description}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
