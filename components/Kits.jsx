import Grow from './Grow';
import { Board, kitRows } from './keys';
import { kits } from '../content';
import s from './Kits.module.css';

// The base kit large, the add-on kits in a row beneath it. Only kits with a kitting image are shown.
export default function Kits() {
  const shown = kits.items.filter((k) => k.src);
  if (!shown.length) return null;
  const [base, ...rest] = shown;
  const Kit = ({ kit }) => (
    <figure className={s.kit}>
      {kit.src ? <img src={kit.src} alt={kit.alt} loading="lazy" decoding="async" /> : <Board rows={kitRows(kit)} label={`${kit.alt}, drawn`} />}
      <Grow as="figcaption" className={s.name} delay={300} p={0}>{kit.name}</Grow>
    </figure>
  );
  return (
    <section id="kits" className={`wrap page ${s.section}`} aria-labelledby="kits-title">
      <Grow as="h2" id="kits-title" className="head" p={0.6}>{kits.heading}</Grow>
      <div className={`para ${s.base}`} style={{ '--p': 0.25 }} data-reveal><Kit kit={base} /></div>
      {rest.length > 0 && <div className={`para ${s.rest}`} style={{ '--p': 0.4 }} data-reveal>{rest.map((kit) => <Kit key={kit.id} kit={kit} />)}</div>}
    </section>
  );
}
