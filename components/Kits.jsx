import { Board, kitRows } from './keys';
import { kits } from '../content';
import s from './Kits.module.css';

// The base kit large, the add-on kits in a row beneath it.
export default function Kits() {
  const [base, ...rest] = kits.items;
  const Kit = ({ kit }) => (
    <figure className={s.kit}>
      {kit.src ? <img src={kit.src} alt={kit.alt} loading="lazy" decoding="async" /> : <Board rows={kitRows(kit)} label={`${kit.alt}, drawn`} />}
      <figcaption className={s.name}>{kit.name}</figcaption>
    </figure>
  );
  return (
    <section id="kits" className={`wrap ${s.section}`} aria-labelledby="kits-title">
      <h2 id="kits-title" className="head para" style={{ '--p': 1.4 }}>{kits.heading}</h2>
      <div className={`para ${s.base}`} style={{ '--p': 0.4 }} data-reveal><Kit kit={base} /></div>
      <div className={`para ${s.rest}`} style={{ '--p': 0.9 }} data-reveal>{rest.map((kit) => <Kit key={kit.id} kit={kit} />)}</div>
    </section>
  );
}
