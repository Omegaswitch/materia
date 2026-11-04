import Grow from '../../components/Grow';
import { privacy, site } from '../../content';
import s from './privacy.module.css';

export const metadata = { title: `${privacy.title} · ${site.title}`, description: `How ${site.title}'s site handles your data.` };

export default function Privacy() {
  return (
    <main className={`wrap ${s.page}`}>
      <a href="/" className={s.back}>{site.title}</a>
      <Grow as="h1" className={s.title}>{privacy.title}</Grow>
      <p className={s.updated}>Last updated {privacy.updated}</p>
      {privacy.sections.map((x) => (
        <section key={x.h} className={s.section}>
          <h2 className={s.h}>{x.h}</h2>
          <p>{x.p}{x.link && <> See <a href={x.link.href}>{x.link.label}</a>.</>}</p>
        </section>
      ))}
    </main>
  );
}
