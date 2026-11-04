'use client';
import dynamic from 'next/dynamic';
import { hero } from '../content';
import s from './Hero.module.css';

// WebGL veil loads in its own chunk; the plain logo underneath is the title until then (and without JS or WebGL).
const DitherVeil = dynamic(() => import('./DitherVeil'), { ssr: false });

export default function HeroLogo() {
  const { logo } = hero;
  return (
    <h1 className={s.logo} style={{ aspectRatio: `${logo.w} / ${logo.h}` }}>
      <img src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} fetchPriority="high" className={s.fallback} />
      <DitherVeil
        src={logo.src}
        pattern="floyd"
        pixelSize={2}
        inkColor="#3b2219"
        paperColor="#ece4ce"
        revealRadius={200}
        softness={0.6}
        linger={1}
        fit="contain"
        rimColor="#a0624c"
        palette="duotone"
        levels={2}
        contrast={1.15}
        brightness={0.06}
        rim={0}
        reverse={false}
        wander={false}
        clickBurst
        style={{ position: 'absolute', inset: 0 }}
      />
    </h1>
  );
}
