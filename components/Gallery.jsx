import Asset from './Asset';
import s from './Gallery.module.css';

// Used for Kitting and Renders. Items come from content.js; span is columns out of 6.
export default function Gallery({ id, heading, items }) {
  return (
    <section id={id} className={`paper ${s.section}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-title">{heading}</h2>
      <div className={s.grid}>
        {items.map((item, i) => (
          <figure key={i} className={s.cell} style={{ '--span': item.span || 3 }}>
            <Asset {...item} />
          </figure>
        ))}
      </div>
    </section>
  );
}
