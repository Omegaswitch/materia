'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { hero } from '../content';
import s from './Hero.module.css';

// WebGL veil loads in its own chunk; the plain logo underneath is the title until then (and without JS or WebGL).
const DitherVeil = dynamic(() => import('./DitherVeil'), { ssr: false });

export default function HeroLogo() {
  const { logo } = hero;
  // finer dots on small screens, where the lockup is small
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    const on = () => setFine(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    // The h1 is the lockup's own size; the picture and its veil spill past it on every side.
    <h1 className={s.logo} style={{ aspectRatio: `${logo.frame[0]} / ${logo.frame[1]}` }}>
      <img src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} srcSet={`${logo.small} 900w, ${logo.src} ${logo.w}w`} sizes="(max-width: 700px) 100vw, 1500px" fetchPriority="high" className={s.spill} />
      <DitherVeil
        src={logo.src}
        pattern="floyd"
        pixelSize={fine ? 1 : 2}
        inkColor="#3b2219"
        paperColor="#ece4ce"
        revealRadius={200}
        softness={0.6}
        linger={1}
        fit="contain"
        rimColor="#a0624c"
        palette="duotone"
        levels={2}
        contrast={fine ? 1.3 : 1.15}
        brightness={fine ? 0.28 : 0.06}
        rim={0}
        reverse={false}
        wander={false}
        clickBurst
        className={s.spill}
      />
    </h1>
  );
}
