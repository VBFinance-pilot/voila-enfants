import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Hiroba.css';

export default function Hiroba() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="hiroba" ref={ref}>
      <div className="container">
        <div className="hiroba-layout">
          <div className="reveal reveal-d1">
            <span className="tag">{t('hiroba.tag')}</span>
            <h2 className="hiroba-title">{t('hiroba.title')}</h2>
            <div className="coin-badge">{t('hiroba.coin')}</div>
            <div
              className="hiroba-body"
              dangerouslySetInnerHTML={{ __html: t('hiroba.body') }}
            />
            <a href="#contact" className="btn-primary">{t('hiroba.cta')}</a>
          </div>
          <div className="hiroba-img reveal reveal-d2">
            <img src="/hero-bg.png" alt="Oyako Hiroba" />
          </div>
        </div>
      </div>
    </section>
  );
}
