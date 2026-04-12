import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Founders.css';

const founders = [
  { name: 'Victor', lang: '🇫🇷 English / French', photo: '/victor.jpg' },
  { name: 'Maria', lang: '🇯🇵 English / Japanese', photo: '/maria.jpg' },
];

export default function Founders() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="founders" ref={ref}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal">
          <h2 className="sec-title">{t('founders.title')}</h2>
          <div className="bar center" />
        </div>
        <div className="founders-wrap">
          {founders.map((f, i) => (
            <div key={f.name} className={`founder-card reveal ${i > 0 ? 'reveal-d1' : ''}`}>
              <div className="founder-avatar">
                <img src={f.photo} alt={f.name} />
              </div>
              <div className="founder-name">{f.name}</div>
              <div className="founder-role">{t('founders.role')}</div>
              <div className="founder-lang">{f.lang}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
