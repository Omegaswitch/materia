import { IM_Fell_English } from 'next/font/google';
import { site } from '../content';
import './globals.css';

// Stand-in for the reference face. Swap here (next/font/google, or next/font/local with files in public/fonts/).
const text = IM_Fell_English({ weight: '400', subsets: ['latin'], variable: '--f-text' });

export const metadata = { title: site.title, description: site.description };
export const viewport = { themeColor: '#ece4ce' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={text.variable}>
      <head>
        {/* Entrance animations only apply when JS runs, so content is never stuck hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
