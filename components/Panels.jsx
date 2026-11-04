import { panelColors } from '../content';

// Deterministic block layout so server and client render the same thing.
function columnsFor(count, seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: count }, () =>
    Array.from({ length: 3 + Math.floor(rnd() * 3) }, () => ({
      grow: 0.4 + rnd() * 2,
      color: panelColors[Math.floor(rnd() * panelColors.length)],
    }))
  );
}

/**
 * Field of drifting wood-like panels. Absolutely fills its positioned parent.
 * open: columns slide away vertically (alternating up/down) to reveal what is behind.
 */
export default function Panels({ open = false, columns = 5, seed = 1 }) {
  return (
    <div className={`panels${open ? ' is-open' : ''}`} aria-hidden="true">
      {columnsFor(columns, seed).map((blocks, i) => (
        <div className="panel-col" key={i} style={{ '--i': i, '--dir': i % 2 ? 1 : -1 }}>
          <div
            className="panel-drift"
            style={{ '--dur': `${8 + ((i * 3 + seed) % 6)}s`, '--delay': `-${(i * 1.9 + seed) % 6}s` }}
          >
            {blocks.map((b, j) => (
              <div key={j} className="panel-block" style={{ flexGrow: b.grow, background: `var(--${b.color})` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
