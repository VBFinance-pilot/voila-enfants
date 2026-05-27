import BeholdWidget from '@behold/react';
import { useLang } from '../contexts/LanguageContext';
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
        <div className="media-feed reveal">
          <BeholdWidget feedId="Xe8UQ4p51BeYWRRGQ9N6" />
        </div>
      </div>
    </section>
  );
}
