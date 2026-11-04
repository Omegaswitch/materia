import { renders } from '../content';
import s from './Gallery.module.css';

// Renders, large, one after another. Hidden until content.js lists some.
export default function Gallery() {
  if (!renders.length) return null;
  return (
    <section id="renders" className={`wrap page ${s.section}`} aria-labelledby="renders-title">
      <h2 id="renders-title" className="head">Renders</h2>
      {renders.map((r) => (
        <img key={r.src} src={r.src} alt={r.alt} width={r.w} height={r.h} loading="lazy" decoding="async" className={s.img} />
      ))}
    </section>
  );
}
