import { origin } from '../content';

// /sitemap.xml: every page of the site. Add a line here when a page is added.
export const dynamic = 'force-static';
export default function sitemap() {
  return [
    { url: `${origin}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/privacy/`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
