import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Activities.css';

export default function Activities() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="activities" ref={ref}>
      <div className="container">
        <div className="activities-layout">
          <div>
            <span className="tag">{t('activities.tag')}</span>
            <h2 className="sec-title">{t('activities.title')}</h2>
            <div className="bar" />
            <div
              className="activities-body reveal"
              dangerouslySetInnerHTML={{ __html: t('activities.body') }}
            />
            <div className="programs-heading reveal reveal-d1">
              {t('activities.programsHeading')}
            </div>
            <div className="reveal reveal-d1">
              {t('activities.programs').map((prog, i) => (
                <div className="program-item" key={i}>
                  <strong>{prog.icon} {prog.title}</strong>
                  <p>{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="activities-photo-wrap reveal reveal-d2">
            <div className="round-photo">
              <img src="/hero-bg.png" alt="Activities" />
            </div>
          </div>
        </div>
        <div
          className="activities-footer reveal"
          dangerouslySetInnerHTML={{ __html: t('activities.footer') }}
        />
      </div>
    </section>
  );
}
