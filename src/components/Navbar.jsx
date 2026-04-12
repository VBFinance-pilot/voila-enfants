import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNav = () => setMobileOpen(false);

  const navItems = [
    { href: '#activities', key: 'activities' },
    { href: '#services', key: 'services' },
    { href: '#pricing', key: 'pricing' },
    { href: '#hiroba', key: 'hiroba' },
    { href: '#about', key: 'about' },
    { href: '#gallery', key: 'gallery' },
  ];

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <img src="/logo.png" alt="Voilà les enfants" className="nav-logo-img" />
          </a>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(`nav.${item.key}`)}</a>
              </li>
            ))}
            <li>
              <a href="#contact" className="nav-cta">{t('nav.contact')}</a>
            </li>
          </ul>
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === 'ja' ? 'active' : ''}`}
              onClick={() => setLang('ja')}
            >
              <span className="lang-flag">🇯🇵</span> JP
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              <span className="lang-flag">🇬🇧</span> EN
            </button>
          </div>
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {Object.entries(t('mobileNav')).map(([key, label]) => (
          <a key={key} href={`#${key}`} onClick={closeNav}>{label}</a>
        ))}
      </div>
    </>
  );
}
