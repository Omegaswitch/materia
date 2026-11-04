import { colours } from '../content';

export const byId = Object.fromEntries(colours.items.map((c) => [c.id, c]));

// 'Esc 1 ←:2' → [{ k, w }]
const parse = (row) => row.split(' ').map((t) => { const [k, w] = t.split(':'); return { k, w: +w || 1 }; });

// A kit's rows as caps, each in one of the five colours, mixed like the render (seeded, so server and client agree).
export function kitRows(kit, seed = 7) {
  let x = seed;
  const next = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  return kit.rows.map((row) => parse(row).map((cap) => ({ ...cap, c: colours.items[Math.floor(next() * colours.items.length)] })));
}

// A legend is part of the drawing, so it is drawn (SVG), not set as page text.
export const Legend = ({ ch }) => (
  <svg className="legend" viewBox="0 0 100 100" aria-hidden="true"><text y="76" fontSize="100">{ch}</text></svg>
);

export function Cap({ k, w = 1, c, className = '' }) {
  return (
    <span className={`cap ${className}`} style={{ '--w': w, '--c': c.hex }}>
      <span className="cap-top">{k && k !== '_' && <Legend ch={k} />}</span>
    </span>
  );
}

export function Board({ rows, label }) {
  const units = Math.max(...rows.map((r) => r.reduce((n, cap) => n + cap.w, 0)));
  return (
    <div className="board" role="img" aria-label={label} style={{ '--n': Math.max(units, 10) }}>
      {rows.map((row, i) => (
        <div className="board-row" key={i}>
          {row.map((cap, j) => <Cap key={j} {...cap} />)}
        </div>
      ))}
    </div>
  );
}
