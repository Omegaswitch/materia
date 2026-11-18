# MATERIA

Static Next.js site for GMK CYL Materia (Bowlkeyboards × Aiglatson Studio).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Where to change things

Everything editable is in **`content.js`**.

| What | Where |
|---|---|
| Name, makers, page description | `site` |
| Hero line, button, collab badge | `hero` |
| Dictionary entry | `story` |
| The five Pantones and their callouts | `colours.items` (`hex` is sampled from the render; `x`/`y` = % position of the key on the render, `side` = where the label sits on desktop) |
| Colour render | `colours.render` (`public/assets/render-*.webp`) |
| Kits | `kits.items`: drawn from `rows` until you set `src` to a kitting image |
| Renders gallery | `renders` (hidden while empty) |
| Vendors, privacy link, contact info | `footer` |
| Wood textures | `public/assets/wood/`, colours in `panelColors` |
| Page colours, type scale | `app/globals.css` `:root` |
| Font | `app/layout.jsx` (IM Fell English as a stand-in) |

## How it is built

Every section is a server component; the only client script adds a class when a section scrolls into view.
The wood drifts and the footer blocks rise on CSS scroll timelines (compositor only, no JS); browsers without them show the still page.
Motion is off under `prefers-reduced-motion`, and nothing is hidden when JavaScript is off.
