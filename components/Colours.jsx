import Grow from './Grow';
import { colours } from '../content';
import s from './Colours.module.css';

// On a phone the labels sit in a row above or below the board (by which half the key is in), spread evenly,
// each joined to its key by an elbow line: the deck's callouts, folded to fit a narrow screen.
const rows = { top: colours.items.filter((c) => c.y < 50), bottom: colours.items.filter((c) => c.y >= 50) };
const slot = Object.fromEntries(Object.values(rows).flatMap((list) =>
  [...list].sort((a, b) => a.x - b.x).map((c, k) => [c.id, ((k + 0.5) / list.length) * 100])));

// The render with a callout to each Pantone, as in the deck.
export default function Colours() {
  const r = colours.render;
  return (
    <section id="colours" className={`wrap page ${s.section}`} aria-labelledby="colours-title">
      <Grow as="h2" id="colours-title" className="head" p={0.6}>{colours.heading}</Grow>
      <figure className={`para ${s.figure}`} style={{ '--p': 0.4 }} data-reveal>
        <img src={r.src} srcSet={`${r.small} 900w, ${r.src} 1520w`} sizes="(max-width: 899px) 100vw, 70vw" width={r.w} height={r.h} alt={r.alt} loading="lazy" decoding="async" />
        <ul className={s.callouts} role="list">
          {colours.items.map((c) => {
            const [num, ...rest] = c.name.replace('PANTONE ', '').split(' ');
            return (
              <li key={c.id} className={`${s.callout} ${s[c.side]} ${c.y < 50 ? s.mTop : s.mBottom}`}
                style={{ '--x': `${c.x}%`, '--y': `${c.y}%`, '--slot': `${slot[c.id]}%`, '--from-x': `${Math.min(c.x, slot[c.id])}%`, '--run': `${Math.abs(c.x - slot[c.id])}%` }}>
                <span className={s.line} aria-hidden="true" />
                <span className={`${s.elbow} ${s.e1}`} aria-hidden="true" />
                <span className={`${s.elbow} ${s.e2}`} aria-hidden="true" />
                <span className={`${s.elbow} ${s.e3}`} aria-hidden="true" />
                <Grow as="span" className={s.label} delay={1400} p={0}>
                  <span className={s.swatch} aria-hidden="true" />
                  PANTONE <span className={s.num}>{num}{rest.join(' ')}</span>
                </Grow>
              </li>
            );
          })}
        </ul>
      </figure>
    </section>
  );
}
