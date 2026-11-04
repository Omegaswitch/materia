import { story } from '../content';
import s from './Story.module.css';

// The deck's dictionary entry.
export default function Story() {
  return (
    <section id="story" className={`wrap ${s.story}`} aria-labelledby="story-title">
      <div className={s.entry} data-reveal>
        <h2 id="story-title" className={s.word}>{story.word}</h2>
        <p className={s.pron}>{story.pronunciation} <span>{story.language}</span></p>
        <p className={s.def}>{story.definition}</p>
      </div>
    </section>
  );
}
