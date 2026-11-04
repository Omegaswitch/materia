import Landing from '../components/Landing';
import Story from '../components/Story';
import Keyboard from '../components/Keyboard';
import Slides from '../components/Slides';
import Footer from '../components/Footer';
import Stack from '../components/Stack';
import SmoothScroll from '../components/SmoothScroll';
import WoodScroll from '../components/WoodScroll';

export default function Page() {
  return (
    <SmoothScroll>
      <main>
        <Stack>
          <Landing />
          <Story />
          <Keyboard />
        </Stack>
        <Slides />
      </main>
      <Footer />
      <WoodScroll />
    </SmoothScroll>
  );
}
