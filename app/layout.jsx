import { IM_Fell_English } from 'next/font/google';
import { site } from '../content';
import './globals.css';

// Stand-in for the reference face. Swap here (next/font/google, or next/font/local with files in public/fonts/).
const text = IM_Fell_English({ weight: '400', subsets: ['latin'], variable: '--f-text' });

// Link previews (Discord, iMessage, Slack, X): Open Graph tags plus app/opengraph-image.jpg.
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time, so the preview image always points at the live domain.
const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(origin),
  title: site.title,
  description: site.description,
  openGraph: { type: 'website', siteName: site.title, title: site.title, description: site.description, url: '/', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};
// Discord colours the embed's side bar with theme-color: Pantone 7592 C.
export const viewport = { themeColor: '#8b453a' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={text.variable}>
      <head>
        {/* A refresh always lands at the top of the page (no restored scroll, no #anchor jump); a shared #link still works on first visit.
            Entrance states only apply while JS runs. If the app has not started within 4 s (blocked or failed chunks), they are dropped so nothing stays hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__live)d.classList.remove('js')},4000);"
          + "history.scrollRestoration='manual';var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];"
          + "if(n&&n.type==='reload'){if(location.hash)history.replaceState(null,'',location.pathname+location.search);scrollTo(0,0)}" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
