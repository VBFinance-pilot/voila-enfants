import { useLang } from '../contexts/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer>
      <div className="foot-logo">
        <img src="/logo.png" alt="Voilà les enfants" className="foot-logo-img" />
      </div>
      <p className="foot-tag">{t('footer.tagline')}</p>
      <nav className="foot-nav">
        <a href="#activities">Activities</a>
        <a href="#services">Services</a>
        <a href="#pricing">{t('nav.pricing')}</a>
        <a href="#hiroba">{t('nav.hiroba')}</a>
        <a href="#about">About</a>
        <a href="#founders">Founders</a>
        <a href="#gallery">Gallery</a>
        <a href="#media">1-Min English</a>
        <a href="#contact">{t('nav.contact')}</a>
      </nav>
      <p className="foot-copy">
        {t('footer.copyright')}<br />
        <a href="mailto:contact-voilaJP@protonmail.com" className="foot-email">
          contact-voilaJP@protonmail.com
        </a>
      </p>
    </footer>
  );
}
