'use client';
import { useEffect } from 'react';

// Adds .in to each [data-reveal] block the first time it scrolls into view (CSS does the rest).
export default function Reveal() {
  useEffect(() => {
    window.__live = true;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    // [data-lazy]: mark it a screen early, so its CSS background pictures load just before they are seen
    const early = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); early.unobserve(e.target); }
    }), { rootMargin: '100% 0px' });
    document.querySelectorAll('[data-lazy]').forEach((el) => early.observe(el));
    return () => { io.disconnect(); early.disconnect(); };
  }, []);
  return null;
}
