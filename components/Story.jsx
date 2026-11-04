'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from './hooks';
import { story } from '../content';
import s from './Story.module.css';

export default function Story() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return el.style.setProperty('--p', 1);
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters the viewport bottom, 1 when it reaches ~15% from the top.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      el.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section id="story" ref={ref} className={`${s.story}${reduced ? ` ${s.still}` : ''}`} aria-labelledby="story-word">
      <div className={`paper ${s.sheet}`}>
        <article className={s.entry}>
          <h2 id="story-word" className={s.word}>{story.word}</h2>
          <p className={s.pron}>{story.pronunciation}</p>
          {story.paragraphs.map((t, i) => <p key={i} className={s.body}>{t}</p>)}
        </article>
      </div>
      <div className={s.roll} aria-hidden="true" />
    </section>
  );
}
