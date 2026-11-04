// All editable site content lives here. Page colours are CSS tokens in app/globals.css.
// Facts come from the GMK CYL MATERIA WIP deck. PLACEHOLDER = still to be supplied.

export const site = {
  name: 'MATERIA',
  title: 'GMK CYL Materia',
  makers: 'Bowlkeyboards and Aiglatson Studio',
  description: 'GMK CYL Materia, a keycap set made together by Bowlkeyboards and Aiglatson Studio, in five Pantone browns.',
};

export const hero = {
  sentence: 'GMK CYL Materia, a keycap set made together by Bowlkeyboards and Aiglatson Studio.',
  action: { label: 'Find a vendor', href: '#vendors' },
  badge: { src: '/assets/badge.webp', alt: 'Bowlkeyboards and Aiglatson Studio', w: 80, h: 145 },
  // The deck's lockup. Shown dithered in brown; the pointer reveals it in full colour.
  logo: { src: '/assets/logo.webp', alt: 'GMK CYL Materia', w: 1360, h: 492 },
};

export const story = {
  word: 'MATERIA.',
  pronunciation: '[má-te-ri-a]',
  language: 'Latin',
  definition: '(n.) Traced to mater (“mother”), the Romans saw timber not just as raw material, but as the foundational source, the true mother, of everything built.',
};

// The five colours. hex is sampled from the render; replace with the official Pantone values if they differ.
// x / y: where the callout points on the render (% of its width / height). side: where the label sits on desktop.
export const colours = {
  heading: 'The colours',
  render: { src: '/assets/render-1520.webp', small: '/assets/render-900.webp', w: 1520, h: 610, alt: 'GMK CYL Materia on a 60% keyboard: every key one of five Pantone browns, mixed across the board' },
  items: [
    { id: 'p7591', name: 'PANTONE 7591 C', hex: '#95604c', x: 77.9, y: 67, side: 'bottom' },
    { id: 'p7592', name: 'PANTONE 7592 C', hex: '#8b453a', x: 19.5, y: 68, side: 'left' },
    { id: 'p7593', name: 'PANTONE 7593 C', hex: '#673933', x: 4.5, y: 21, side: 'left' },
    { id: 'p7594', name: 'PANTONE 7594 C', hex: '#4f3028', x: 85.5, y: 36, side: 'right' },
    { id: 'p7595', name: 'PANTONE 7595 C', hex: '#47322b', x: 69.7, y: 21, side: 'top' },
  ],
};

// Board rows: keys separated by spaces, `Name:2.25` sets a width in units, `_` is a spacebar.
// Kits are drawn from these rows, each cap in one of the five colours, until kitting renders arrive:
// set src to a kitting image to show it instead.
export const kits = {
  heading: 'Kits',
  items: [ // PLACEHOLDER kit names and contents
    { id: 'base', name: 'Base kit', src: null, alt: 'Base kit', rows: [
      'Esc 1 2 3 4 5 6 7 8 9 0 - = ←:2',
      'Tab:1.5 Q W E R T Y U I O P [ ] \\:1.5',
      "⇩:1.75 A S D F G H J K L ; ' Enter:2.25",
      '⇧:2.25 Z X C V B N M , . / ⇧:1.75 Fn',
      'Control:1.5 Code Alt:1.5 _:7 Alt:1.5 Code Control:1.5',
    ] },
    { id: 'alphas', name: 'Alphas', src: null, alt: 'Alphas kit', rows: ['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M'] },
    { id: 'mods', name: 'Modifiers', src: null, alt: 'Modifiers kit', rows: ['Control:1.25 Alt:1.25 Code:1.25 Fn:1.25 Menu:1.25', 'Tab:1.5 ⇩:1.75 ⇧:2.25 ⇧:2.75', '_:6.25 _:7'] },
    { id: 'novelties', name: 'Novelties', src: null, alt: 'Novelties kit', rows: ['M A T E R I A'] },
  ],
};

// Renders shown in a simple gallery. Leave empty to hide the section.
export const renders = [
  // { src: '/assets/render-desk.webp', alt: '…', w: 1600, h: 1000 },
];

export const footer = {
  vendors: [
    { name: 'Vendor 1', href: '#' }, // PLACEHOLDER vendors
    { name: 'Vendor 2', href: '#' },
    { name: 'Vendor 3', href: '#' },
  ],
  privacy: { label: 'Privacy policy', href: '/privacy/' },
  info: ['PLACEHOLDER: contact address', 'PLACEHOLDER: other site information'],
};

// Wood photo textures for the plank band and the footer blocks (public/assets/wood/).
export const panelTextures = Array.from({ length: 10 }, (_, i) => `/assets/wood/w${i + 1 < 10 ? '0' : ''}${i + 1}.webp`);
// Plank colours, by colour id above.
export const panelColors = ['p7591', 'p7592', 'p7593', 'p7594'];

// Privacy policy page (/privacy/). Checked against the built site: no cookies, no storage, no third-party requests.
// Run by Bowlkeyboards and Aiglatson Studio, hosted on Vercel. PLACEHOLDER: a contact address. Have it read over before launch.
export const privacy = {
  title: 'Privacy policy',
  updated: '4 November 2026',
  sections: [
    { h: 'Who runs this site', p: 'This site is run by Bowlkeyboards and Aiglatson Studio, who make GMK CYL Materia together.' },
    { h: 'What this site collects', p: 'Nothing. There are no accounts, forms, cookies, analytics or advertising on this site, and it does not track you or store anything in your browser.' },
    { h: 'What your browser loads', p: 'Every page, font, image and script comes from this site itself. Nothing is requested from anyone else while you browse it.' },
    { h: 'Hosting', p: 'The site is hosted by Vercel, which may keep ordinary server logs (IP address, browser, the page asked for and the time) to keep it secure and running.', link: { label: 'Vercel’s privacy policy', href: 'https://vercel.com/legal/privacy-policy' } },
    { h: 'Vendors', p: 'Vendor links take you to other shops. Once you follow one, that shop’s own privacy policy applies.' },
    { h: 'Questions', p: 'PLACEHOLDER: contact address for privacy questions.' },
  ],
};
