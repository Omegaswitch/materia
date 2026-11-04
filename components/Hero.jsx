import { woodStyle } from './Panels';
import { hero, site } from '../content';
import s from './Hero.module.css';

// The deck's lockup: GM, then MATERIA on a block of wood, then K.
export default function Hero() {
  return (
    <header className={`wrap ${s.hero}`} id="top">
      <h1 className={s.lockup}>
        <span aria-hidden="true">GM</span>
        <span aria-hidden="true" className={`wood ${s.block}`} style={woodStyle('p7591', 4, '#a8664f')}>MATERIA</span>
        <span aria-hidden="true">K</span>
        <span className="sr">{site.title}</span>
      </h1>
      <div className={s.foot}>
        <img src={hero.badge.src} alt={hero.badge.alt} width={hero.badge.w} height={hero.badge.h} className={s.badge} />
        <p className={s.sentence}>{hero.sentence}</p>
        <a className="btn" href={hero.action.href}>{hero.action.label}</a>
      </div>
    </header>
  );
}
