import Grow from './Grow';
import HeroLogo from './HeroLogo';
import { hero } from '../content';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <header className={`wrap ${s.hero}`} id="top">
      <HeroLogo />
      <div className={s.foot}>
        <Grow p={0} vanishBefore="#top h1"><img src={hero.badge.src} alt={hero.badge.alt} width={hero.badge.w} height={hero.badge.h} className={s.badge} /></Grow>
        <Grow as="p" className={s.sentence} delay={400} p={0} vanishBefore="#top h1">{hero.sentence}</Grow>
        <Grow delay={900} p={0} vanishBefore="#top h1"><a className="btn" href={hero.action.href}>{hero.action.label}</a></Grow>
      </div>
    </header>
  );
}
