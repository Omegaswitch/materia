# MATERIA

Static Next.js marketing site for the MATERIA keycap set.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Where to replace things

Almost everything lives in **`content.js`**. Any asset with `src: null` shows a labeled placeholder; put the file in `public/assets/` and set `src: '/assets/<file>'`.

| What | Where |
|---|---|
| Logo | `content.js` → `logo.src` |
| Keyboard render | `content.js` → `keyboard.image.src` (blank-keycap render) |
| Colour names, descriptions, callout positions | `content.js` → `keyboard.colors` (`x`/`y` = % position on the image, `side` = label above/below on desktop) |
| Kitting images | `content.js` → `kitting.items` (one slide each in the horizontal slider; add/remove/reorder freely, `ratio` = aspect ratio) |
| Renders | `content.js` → `renders.items` (same as kitting, slides follow kitting) |
| Story copy | `content.js` → `story` (currently placeholder) |
| Footer vendors, privacy link, contact info | `content.js` → `footer` |
| Fonts | `app/layout.jsx` (currently IM Fell English as a stand-in; swap for another `next/font/google` font or `next/font/local` with your files in `public/fonts/`) |
| Wood textures for the blocks | put files in `public/assets/wood/`, list them in `content.js` → `panelTextures`; tune `panelTextureOpacity` / `panelBlockOpacity` |
| Colours | `app/globals.css` `:root` tokens (and `content.js` → `palette`/`panelColors`) |

Motion respects `prefers-reduced-motion`: panels start open and nothing animates.
