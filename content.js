// All editable site content, colours and asset paths live here.
// Asset `src: null` renders a labeled placeholder. Set a path (e.g. '/assets/logo.svg') to use a real file.

export const palette = {
  bark: '#5b3a31',   // darkest panel brown
  rust: '#974f42',
  clay: '#99644e',   // muted terracotta
  paper: '#ece3cf',
  paperDeep: '#e2d6bc',
  ink: '#2b1b15',
  inkSoft: '#7a3f30', // rust-ink used for story body text
};

// Panel colours used by every moving block field, in palette keys.
export const panelColors = ['bark', 'rust', 'clay'];

// Wood photo textures for the blocks: put files in public/assets/wood/ and list them here.
// Each block picks one (by seed) and layers it semi-transparently over its palette colour.
export const panelTextures = [
  '/assets/wood/w01.webp',
  '/assets/wood/w02.webp',
  '/assets/wood/w03.webp',
  '/assets/wood/w04.webp',
  '/assets/wood/w05.webp',
  '/assets/wood/w06.webp',
  '/assets/wood/w07.webp',
  '/assets/wood/w08.webp',
  '/assets/wood/w09.webp',
  '/assets/wood/w10.webp',
];
// How strongly the texture shows (0–1), and how see-through the blocks are where they overlap (0–1).
export const panelTextureOpacity = 0.55;
export const panelBlockOpacity = 0.94;

export const logo = {
  src: null,
  alt: 'MATERIA logo',
  label: 'Logo goes here — MATERIA wordmark (SVG preferred)',
};

export const story = {
  word: 'MATERIA.',
  pronunciation: '[PLACEHOLDER: pronunciation]',
  // Placeholder: replace with the final story copy. No etymology claims until supplied.
  paragraphs: [
    'PLACEHOLDER — What the name MATERIA means to this set. Replace with final copy.',
    'PLACEHOLDER — The idea behind the colours and materials. Replace with final copy.',
  ],
};

export const keyboard = {
  heading: 'The colours',
  image: {
    src: null,
    alt: 'PLACEHOLDER alt: MATERIA keycap set on a keyboard, blank keycaps',
    label: 'Keyboard render goes here — blank keycaps, front-on, ~2.6:1',
    ratio: '2.6 / 1',
  },
  // x / y: callout target as % of the keyboard image. side: where the label sits on desktop.
  colors: [
    { id: 'c1', name: 'PLACEHOLDER Colour 1', description: 'PLACEHOLDER — one line about this colour.', swatch: '#5b3a31', x: 22, y: 30, side: 'top' },
    { id: 'c2', name: 'PLACEHOLDER Colour 2', description: 'PLACEHOLDER — one line about this colour.', swatch: '#974f42', x: 48, y: 52, side: 'top' },
    { id: 'c3', name: 'PLACEHOLDER Colour 3', description: 'PLACEHOLDER — one line about this colour.', swatch: '#99644e', x: 78, y: 28, side: 'top' },
    { id: 'c4', name: 'PLACEHOLDER Colour 4', description: 'PLACEHOLDER — one line about this colour.', swatch: '#b07a5c', x: 12, y: 74, side: 'bottom' },
    { id: 'c5', name: 'PLACEHOLDER Colour 5', description: 'PLACEHOLDER — one line about this colour.', swatch: '#6e4637', x: 62, y: 82, side: 'bottom' },
  ],
};

// span: grid columns out of 6 on desktop. ratio: CSS aspect-ratio. Add, remove or reorder freely.
export const kitting = {
  heading: 'Kitting',
  items: [
    { src: null, alt: 'PLACEHOLDER alt: base kit', label: 'Kitting image — Base kit', span: 4, ratio: '4 / 3' },
    { src: null, alt: 'PLACEHOLDER alt: alphas kit', label: 'Kitting image — Alphas', span: 2, ratio: '3 / 4' },
    { src: null, alt: 'PLACEHOLDER alt: modifiers kit', label: 'Kitting image — Modifiers', span: 3, ratio: '3 / 2' },
    { src: null, alt: 'PLACEHOLDER alt: novelties kit', label: 'Kitting image — Novelties', span: 3, ratio: '3 / 2' },
  ],
};

export const renders = {
  heading: 'Renders',
  items: [
    { src: null, alt: 'PLACEHOLDER alt: render 1', label: 'Render 1 — full board', span: 6, ratio: '21 / 9' },
    { src: null, alt: 'PLACEHOLDER alt: render 2', label: 'Render 2 — detail', span: 2, ratio: '1 / 1' },
    { src: null, alt: 'PLACEHOLDER alt: render 3', label: 'Render 3 — detail', span: 2, ratio: '1 / 1' },
    { src: null, alt: 'PLACEHOLDER alt: render 4', label: 'Render 4 — detail', span: 2, ratio: '1 / 1' },
  ],
};

export const footer = {
  vendors: [
    { name: 'Vendor 1 (placeholder)', href: '#', logo: null },
    { name: 'Vendor 2 (placeholder)', href: '#', logo: null },
    { name: 'Vendor 3 (placeholder)', href: '#', logo: null },
  ],
  privacy: { label: 'Privacy policy', href: '#' },
  info: ['PLACEHOLDER — contact address', 'PLACEHOLDER — other site information'],
};
