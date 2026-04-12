import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import legalData from '../data/legal.json';
import './LegalPage.css';

const legalLinks = [
  { key: 'privacy', path: '/privacy', ja: 'Privacy Policy', en: 'Privacy Policy' },
  { key: 'terms', path: '/terms', ja: 'Terms of Service', en: 'Terms of Service' },
  { key: 'legal', path: '/legal', ja: '法的表示', en: 'Legal Notice' },
];

export default function LegalLayout({ title, subtitle, currentPage, children }) {
  const { lang, setLang } = useLang();
  const d = legalData[lang];

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-nav">
          <Link to="/" className="legal-back">{d.backToHome}</Link>
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
        </div>

        <div className="legal-header">
          <h1>{title}</h1>
          <div className="legal-subtitle">{subtitle}</div>
          <div className="legal-updated">{d.lastUpdated}</div>
        </div>

        {children}

        <div className="legal-footer-links">
          {legalLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={currentPage === link.key ? 'active' : ''}
            >
              {link[lang]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
