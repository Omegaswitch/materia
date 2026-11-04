'use client';
import { useRef } from 'react';
import Panels from './Panels';
import Asset from './Asset';
import { useInView, useReducedMotion } from './hooks';
import { footer } from '../content';
import s from './Footer.module.css';

export default function Footer() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.3);
  const reduced = useReducedMotion();
  return (
    <footer ref={ref} className={`paper ${s.footer}`}>
      <div className={s.inner}>
        <nav aria-label="Vendors">
          <ul className={s.vendors}>
            {footer.vendors.map((v) => (
              <li key={v.name}>
                <a href={v.href}>
                  {v.logo ? <Asset src={v.logo} alt={v.name} label={v.name} ratio="3 / 1" /> : (
                    <Asset src={null} label={`Vendor logo — ${v.name}`} ratio="3 / 1" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.meta}>
          <a href={footer.privacy.href}>{footer.privacy.label}</a>
          {footer.info.map((line) => <p key={line}>{line}</p>)}
        </div>
      </div>
      <Panels open={seen || reduced} columns={5} seed={7} />
    </footer>
  );
}
