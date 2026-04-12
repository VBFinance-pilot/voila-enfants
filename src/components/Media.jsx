import { useLang } from '../contexts/LanguageContext';
import mediaData from '../data/media.json';
import { useReveal } from './useReveal';
import './Media.css';

export default function Media() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="media" ref={ref}>
      <div className="container">
        <span className="tag">{t('media.tag')}</span>
        <h2 className="sec-title">{t('media.title')}</h2>
        <div className="bar" />
        <p className="media-sub">{t('media.sub')}</p>
        <div className="media-row">
          {mediaData.map((item, i) => (
            <div key={i} className={`media-card reveal ${i > 0 ? `reveal-d${i}` : ''}`}>
              <div className="media-ep">{item.ep}</div>
              <div className="media-en">{item.en}</div>
              <div className="media-ja">{item.ja}</div>
              <div className="media-footer">{t('media.brand')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
