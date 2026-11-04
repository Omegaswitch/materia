import Landing from '../components/Landing';
import Story from '../components/Story';
import Keyboard from '../components/Keyboard';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import { kitting, renders } from '../content';

export default function Page() {
  return (
    <>
      <main>
        <Landing />
        <Story />
        <Keyboard />
        <Gallery id="kitting" {...kitting} />
        <Gallery id="renders" {...renders} />
      </main>
      <Footer />
    </>
  );
}
