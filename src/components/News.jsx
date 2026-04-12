import { useLang } from '../contexts/LanguageContext';
import events from '../data/events.json';
import { useReveal } from './useReveal';
import './News.css';

export default function News() {
  const { lang } = useLang();
  const ref = useReveal();
  const active = events.find((e) => e.active);
  if (!active) return null;

  return (
    <section id="news" ref={ref}>
      <div className="container">
        <div className="news-inner reveal">
          <div className="news-badge">{active.badge[lang]}</div>
          <div className="news-text">
            <h3>{active.title[lang]}</h3>
            <p>{active.body[lang]}</p>
          </div>
          <div className="news-visual">{active.visual}</div>
        </div>
      </div>
    </section>
  );
}
