import { byId } from './keys';
import { panelColors, panelTextures } from '../content';
import s from './Planks.module.css';

// Seeded PRNG: the same planks on server and client.
function rng(seed) {
  let x = seed;
  return () => (x = (x * 9301 + 49297) % 233280) / 233280;
}

// Wood texture style for a block: palette colour with one photo multiplied in.
export const woodStyle = (id, n, hex) => ({
  '--c': hex ?? byId[id].hex,
  '--tex': `url(${panelTextures[n % panelTextures.length]})`,
});

// A full-width band of planks. Columns drift at their own rate as the band scrolls past (CSS scroll timeline).
export default function Planks({ columns = 7, seed = 5 }) {
  const rnd = rng(seed);
  let n = 0;
  return (
    <div className={`page ${s.page}`} aria-hidden="true" data-lazy>
      <div className={s.band}>
      {Array.from({ length: columns }, (_, i) => {
        const style = { '--k': (rnd() * 2 - 1).toFixed(2), flexGrow: (0.6 + rnd()).toFixed(2) };
        const count = 2 + Math.floor(rnd() * 3);
        return (
        <div key={i} className={s.col} style={style}>
          {Array.from({ length: count }, (_, j) => (
            <div key={j} className={`wood ${s.plank}`} style={{
              flexGrow: (0.5 + rnd() * 2).toFixed(2),
              // the planks at the band's edges run well past the overscan and drift, so no thin slivers show; varied so seams stay staggered
              minHeight: j === 0 || j === count - 1 ? `${(28 + rnd() * 18).toFixed(1)}svh` : 0,
              ...woodStyle(panelColors[Math.floor(rnd() * panelColors.length)], n++),
            }} />
          ))}
        </div>
        );
      })}
      </div>
    </div>
  );
}
