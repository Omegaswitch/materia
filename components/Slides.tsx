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
    // Width capped so the image keeps its ratio within 62% of the screen height.
    content: (
      <div style={{ margin: "0 auto", width: `min(100%, calc(62svh * (${item.ratio || "4 / 3"})))` }}>
        <Asset {...item} ratio={item.ratio} />
      </div>
    ),
  }));

export default function Slides() {
  const slides = [...toSlides(kitting.heading, kitting.items), ...toSlides(renders.heading, renders.items)];
  return <HorizontalScroll label="Kitting and renders" slides={slides} />;
}
