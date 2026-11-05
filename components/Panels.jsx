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

// A full-width band of planks, each column a vertical carousel: its planks glide up or down at their own
// steady speed and loop without a seam (two copies of the column, moved by half), clipped to the band.
export default function Planks({ columns = 7, seed = 5 }) {
  const rnd = rng(seed);
  let n = 0;
  return (
    <div className={`page ${s.page}`} aria-hidden="true" data-lazy>
      <div className={s.band}>
        {Array.from({ length: columns }, (_, i) => {
          const grow = (0.6 + rnd()).toFixed(2);
          const sizes = Array.from({ length: 3 + Math.floor(rnd() * 3) }, () => 0.5 + rnd() * 2);
          const total = sizes.reduce((a, b) => a + b, 0);
          const planks = sizes.map((size) => ({ h: (size / total) * 50, style: woodStyle(panelColors[Math.floor(rnd() * panelColors.length)], n++) }));
          const time = (38 + rnd() * 34).toFixed(1); // seconds per full loop: slow, and different per column
          return (
            <div key={i} className={s.col} style={{ flexGrow: grow }}>
              <div className={s.track} style={{ '--t': `${time}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}>
                {[0, 1].map((copy) => planks.map((pl, j) => (
                  <div key={`${copy}-${j}`} className={s.slot} style={{ height: `${pl.h}%` }}>
                    <div className={`wood ${s.plank}`} style={pl.style} />
                  </div>
                )))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
