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
        {/* Entrance states only apply while JS runs. If the app has not started within 4 s (blocked or failed chunks), they are dropped so nothing stays hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__live)d.classList.remove('js')},4000)" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
