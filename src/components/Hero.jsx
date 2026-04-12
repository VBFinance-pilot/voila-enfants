import { useLang } from '../contexts/LanguageContext';
import './Hero.css';

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-logo-mark">
          <img src="/logo.png" alt="Voilà les enfants" className="hero-logo-hero-img" />
        </div>
        <p className="hero-welcome">
          {t('hero.welcome')} <em>{t('hero.brand')}</em>！
        </p>
        <p className="hero-sub-ja">{t('hero.sub')}</p>
        <p className="hero-big">{t('hero.big')}</p>
        <p className="hero-tagline">{t('hero.tagline')}</p>
        <div className="hero-actions">
          <a href="#activities" className="btn-primary">
            <span>{t('hero.btnPrograms')}</span>
          </a>
          <a href="#contact" className="btn-secondary">
            <span>{t('hero.btnTrial')}</span>
          </a>
        </div>
      </div>
      <div className="scroll-hint">
        <div className="scroll-chevron" />
        <span>scroll</span>
      </div>
    </section>
  );
}
