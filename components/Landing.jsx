'use client';
import { useEffect, useState } from 'react';
import Panels from './Panels';
import Asset from './Asset';
import { useReducedMotion } from './hooks';
import { logo } from '../content';
import s from './Landing.module.css';

export default function Landing() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduced) return setOpen(true);
    const t = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <section className={`paper ${s.landing}`} aria-label="MATERIA">
      <h1 className={s.srOnly}>MATERIA</h1>
      <div className={`${s.logo}${open ? ` ${s.shown}` : ''}`}>
        <Asset {...logo} ratio="4 / 1" eager />
      </div>
      <Panels columns={5} seed={1} open={open} />
      <a href="#story" className={s.cue} aria-label="Scroll to story">↓</a>
    </section>
  );
}
