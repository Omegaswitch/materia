import Grow from './Grow';
import { colours } from '../content';
import s from './Colours.module.css';

// The render with a callout to each Pantone, as in the deck. On a phone the callouts become a list.
export default function Colours() {
  const r = colours.render;
  return (
    <section id="colours" className={`wrap ${s.section}`} aria-labelledby="colours-title">
      <Grow as="h2" id="colours-title" className="head" p={1.3}>{colours.heading}</Grow>
      <figure className={`para ${s.figure}`} style={{ '--p': 0.4 }} data-reveal>
        <Grow p={0} duration={3000}>
          <img src={r.src} srcSet={`${r.small} 900w, ${r.src} 1520w`} sizes="(max-width: 899px) 100vw, 70vw" width={r.w} height={r.h} alt={r.alt} loading="lazy" decoding="async" />
        </Grow>
        <ul className={s.callouts} role="list">
          {colours.items.map((c) => {
            const [num, ...rest] = c.name.replace('PANTONE ', '').split(' ');
            return (
              <li key={c.id} className={`${s.callout} ${s[c.side]}`} style={{ '--x': `${c.x}%`, '--y': `${c.y}%`, '--c': c.hex }}>
                <span className={s.line} aria-hidden="true" />
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
