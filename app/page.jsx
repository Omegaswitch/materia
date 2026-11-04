import Hero from '../components/Hero';
import Story from '../components/Story';
import Colours from '../components/Colours';
import Planks from '../components/Panels';
import Kits from '../components/Kits';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Hold from '../components/Hold';

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Hold><Story /></Hold>
        <Hold><Colours /></Hold>
        <Planks />
        <Hold><Kits /></Hold>
        <Gallery />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
