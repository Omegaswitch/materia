import { origin } from '../content';

// /robots.txt: everything may be crawled; points search engines at the sitemap.
export const dynamic = 'force-static';
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${origin}/sitemap.xml` };
}
