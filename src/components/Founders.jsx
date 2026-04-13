import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Founders.css';

const staticFounders = [
  { name: 'Victor', lang: '🇫🇷 English / French', photo: '/victor.jpg' },
  { name: 'Maria', lang: '🇯🇵 English / Japanese', photo: '/maria.jpg' },
];

export default function Founders() {
  const { t } = useLang();
  const ref = useReveal();
  const [founders, setFounders] = useState(staticFounders);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('founders_items')
        .select('*')
        .order('order_index');
      if (data && data.length > 0) {
        setFounders(data.map(f => ({
          name: f.name,
          lang: f.lang_label || '',
          photo: f.image_url || '',
          title: f.title,
          bio: f.bio,
        })));
      }
    })();
  }, []);

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
                {f.photo && <img src={f.photo} alt={`${f.name} – founder of Voilà les enfants English school Kyoto`} />}
              </div>
              <div className="founder-name">{f.name}</div>
              <div className="founder-role">{f.title || t('founders.role')}</div>
              <div className="founder-lang">{f.lang}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
