import Grow from './Grow';
import { story } from '../content';
import s from './Story.module.css';

// The deck's dictionary entry.
export default function Story() {
  return (
    <section id="story" className={`wrap ${s.story}`} aria-labelledby="story-title">
      <div className={s.entry}>
        <Grow as="h2" id="story-title" className={s.word} duration={3200}>{story.word}</Grow>
        <Grow as="p" className={s.pron} delay={500}>{story.pronunciation} <span>{story.language}</span></Grow>
        <Grow as="p" className={s.def} delay={900} duration={3000}>{story.definition}</Grow>
      </div>
    </section>
  );
}
