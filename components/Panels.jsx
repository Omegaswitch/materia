import { panelColors } from '../content';
import styles from './Panels.module.css';

// Seeded PRNG: identical output on server and client (no Math.random at render).
function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

// Each column is a stack of tall planks and square tiles (a square slot may be split in two).
function layout(count, seed) {
  const rnd = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const n = 3 + Math.floor(rnd() * 3);
    const blocks = Array.from({ length: n }, (_, j) => {
      const square = rnd() < 0.34;
      const pick = () => panelColors[Math.floor(rnd() * panelColors.length)];
      return {
        square,
        split: square && rnd() < 0.4,
        grow: 0.6 + rnd() * 1.8,
        color: pick(),
        color2: pick(),
        across: square ? rnd() < 0.5 : rnd() < 0.22, // horizontal grain
        gx: Math.floor(rnd() * 400),
        gy: Math.floor(rnd() * 400),
        dur: (6 + rnd() * 7).toFixed(2),
        delay: (-rnd() * 10).toFixed(2),
        amp: Math.round(8 + rnd() * 18),
        nudge: Math.round((rnd() - 0.5) * 10),
        z: j % 2,
      };
    });
    return { shift: Math.round(-4 - rnd() * 10), blocks, i };
  });
}

function Wood({ color, across, gx, gy, className = '' }) {
  return (
    <div
      className={`${styles.wood} ${across ? styles.across : ''} ${className}`}
      style={{ '--wood': `var(--${color})`, '--gx': `${gx}px`, '--gy': `${gy}px` }}
    />
  );
}

/**
 * Field of drifting wood panels and tiles. Absolutely fills its positioned parent.
 * open: blocks part (staggered, alternating up/down; squares tilt away) to reveal what is behind.
 */
export default function Panels({ open = false, columns = 5, seed = 1 }) {
  return (
    <div className={`${styles.panels}${open ? ` ${styles.open}` : ''}`} aria-hidden="true">
      {layout(columns, seed).map(({ shift, blocks, i }) => (
        <div className={styles.col} key={i} style={{ '--shift': `${shift}%` }}>
          {blocks.map((b, j) => {
            const dir = (i + j) % 2 ? 1 : -1;
            return (
              <div
                key={j}
                className={`${styles.slot} ${b.square ? styles.square : ''}`}
                style={{
                  flexGrow: b.square ? 0 : b.grow,
                  zIndex: b.z + 1,
                  '--dir': dir,
                  '--nudge': `${b.nudge}px`,
                  '--stag': `${(i * 70 + j * 110 + (b.square ? 160 : 0))}ms`,
                }}
              >
                <div
                  className={styles.bob}
                  style={{ '--dur': `${b.dur}s`, '--delay': `${b.delay}s`, '--amp': `${b.amp}px` }}
                >
                  {b.split ? (
                    <>
                      <Wood {...b} className={styles.half} />
                      <Wood {...b} color={b.color2} across={!b.across} gx={b.gy} gy={b.gx} className={styles.half} />
                    </>
                  ) : (
                    <Wood {...b} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
