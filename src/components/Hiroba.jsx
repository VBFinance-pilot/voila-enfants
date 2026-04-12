import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Hiroba.css';

export default function Hiroba() {
  const { t } = useLang();
  const ref = useReveal();
  const [db, setDb] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('oyako_section')
        .select('*')
        .limit(1)
        .single();
      if (data) setDb(data);
    })();
  }, []);

  const title = db?.title || t('hiroba.title');
  const body = db?.description || t('hiroba.body');
  const image = db?.image_url || '/hero-bg.png';

  return (
    <section id="hiroba" ref={ref}>
      <div className="container">
        <div className="hiroba-layout">
          <div className="reveal reveal-d1">
            <span className="tag">{t('hiroba.tag')}</span>
            <h2 className="hiroba-title">{title}</h2>
            <div className="coin-badge">{t('hiroba.coin')}</div>
            <div
              className="hiroba-body"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            <a href="#contact" className="btn-primary">{t('hiroba.cta')}</a>
          </div>
          <div className="hiroba-img reveal reveal-d2">
            <img src={image} alt="Oyako Hiroba" />
          </div>
        </div>
      </div>
    </section>
  );
}
