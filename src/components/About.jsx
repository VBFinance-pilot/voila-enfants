import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './About.css';

export default function About() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <div className="about-inner reveal">
          <span className="tag">{t('about.tag')}</span>
          <h2 className="sec-title">{t('about.title')}</h2>
          <div className="bar" />
          <div dangerouslySetInnerHTML={{ __html: t('about.body') }} />
          <div className="about-services-box">
            <h3>{t('about.servicesTitle')}</h3>
            <ul>
              {t('about.servicesList').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <p><strong dangerouslySetInnerHTML={{ __html: t('about.closing') }} /></p>
        </div>
      </div>
    </section>
  );
}
