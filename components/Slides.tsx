'use client';
import HorizontalScroll, { type Slide } from '@/components/ui/horizontal-scroll';
import Asset from '@/components/Asset';
import { kitting, renders } from '@/content';

type Item = { src: string | null; alt: string; label: string; ratio?: string };

// Kitting + Renders as one horizontal slider; one slide per image, edit the arrays in content.js.
const toSlides = (group: string, items: Item[]): Slide[] =>
  items.map((item, i) => ({
    key: `${group}-${i}`,
    title: group,
    content: <Asset {...item} ratio={item.ratio} className="max-h-[62svh] mx-auto" />,
  }));

export default function Slides() {
  const slides = [...toSlides(kitting.heading, kitting.items), ...toSlides(renders.heading, renders.items)];
  return <HorizontalScroll label="Kitting and renders" slides={slides} />;
}
