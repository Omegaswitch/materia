import { IM_Fell_English } from 'next/font/google';
import './globals.css';

// Fonts: closest stand-ins for the references. Replace here (next/font/google or next/font/local).
const display = IM_Fell_English({ weight: '400', subsets: ['latin'], variable: '--f-display' });
const text = IM_Fell_English({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--f-text' });

export const metadata = {
  title: 'MATERIA',
  description: 'PLACEHOLDER — MATERIA keycap set.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
