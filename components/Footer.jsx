import { Legend } from './keys';
import { footer, site, hero } from '../content';
import s from './Footer.module.css';

const HEIGHTS = [100, 72, 88, 64, 94, 70, 82];

// The name closes the page, each letter cut into its own single piece of wood (public/assets/wood/letters/).
export default function Footer() {
  return (
    <footer id="vendors" className={`wrap ${s.footer}`}>
      <h2 className={s.mark}>
        {[...site.name].map((ch, i) => (
          <span key={i} aria-hidden="true" className={s.block} style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%`, '--i': i }}>
            <img src={`/assets/wood/letters/l${i + 1}.webp`} alt="" width="520" height="780" loading="lazy" decoding="async" />
            <Legend ch={ch} />
          </span>
        ))}
        <span className="sr">Vendors and information</span>
      </h2>
      <div className={s.info}>
        <div className={s.makers}>
          <img src={hero.badge.src} alt="" width={hero.badge.w} height={hero.badge.h} />
          <p>{site.title}, by {site.makers}.</p>
        </div>
        <div>
          <h3 className={s.h}>Vendors</h3>
          <ul role="list">{footer.vendors.map((v) => <li key={v.name}><a href={v.href}>{v.name}</a>{v.region && `, ${v.region}`}</li>)}</ul>
        </div>
        <div>
          <h3 className={s.h}>Information</h3>
          {footer.info.map((line) => <p key={line}>{line}</p>)}
          <p><a href={footer.privacy.href}>{footer.privacy.label}</a></p>
        </div>
      </div>
      <p className={s.last}>© {new Date().getFullYear()} {site.makers} · <a href="#top">Back to top</a></p>
    </footer>
  );
}
