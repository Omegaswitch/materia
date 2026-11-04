'use client';
// Adapted from the HorizontalScroll demo (Matt Perry pattern): pinned section, slides move sideways on vertical scroll.
// Changes: takes slides as props, scoped refs instead of document.querySelectorAll, labeled placeholders instead of
// stock images, linear progress instead of spring, vertical stacked fallback for reduced motion.
import { useEffect, useRef, type ReactNode } from 'react';
import { animate, scroll } from 'motion';
import { useReducedMotion } from '@/components/hooks';
import { cn } from '@/lib/utils';

export type Slide = { key: string; title: string; content: ReactNode; className?: string };

export default function HorizontalScroll({ slides, label }: { slides: Slide[]; label: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const ul = ulRef.current;
    if (reduced || !section || !ul) return;
    const n = slides.length;
    const stops = [
      scroll(animate(ul, { transform: ['none', `translateX(-${(n - 1) * 100}vw)`] }, { ease: 'linear' }), { target: section }),
    ];
    ul.querySelectorAll('h2').forEach((h, i) => {
      stops.push(
        scroll(animate(h, { x: [300, -300] }, { ease: 'linear' }), {
          target: section,
          offset: [[i / n, 1], [(i + 1) / n, 0]] as never,
        })
      );
    });
    return () => stops.forEach((stop) => stop());
  }, [reduced, slides.length]);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      data-slides={reduced ? undefined : slides.length}
      className="relative overflow-x-clip"
      style={reduced ? undefined : { height: `${slides.length * 100}vh` }}
    >
      <ul ref={ulRef} className={cn('m-0 list-none p-0', reduced ? 'flex flex-col' : 'sticky top-0 flex will-change-transform')}>
        {slides.map((s) => (
          <li
            key={s.key}
            className={cn('paper relative flex h-svh w-screen shrink-0 flex-col items-center justify-center gap-6 overflow-hidden px-[var(--gutter)]', s.className)}
          >
            <h2 className="section-title whitespace-nowrap">{s.title}</h2>
            <div className="w-full max-w-[min(1100px,100%)]">{s.content}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
