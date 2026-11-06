import Grow from './Grow';
import HeroLogo from './HeroLogo';
import { hero } from '../content';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <header className={`wrap page ${s.hero}`} id="top">
      <HeroLogo />
      <div className={s.foot}>
        <img src={hero.badge.src} alt={hero.badge.alt} width={hero.badge.w} height={hero.badge.h} className={s.badge} />
        <Grow as="p" className={s.sentence} delay={400} p={0}>{hero.sentence}</Grow>
        <a className="btn" href={hero.action.href}>{hero.action.label}</a>
      </div>
    </header>
  );
}
