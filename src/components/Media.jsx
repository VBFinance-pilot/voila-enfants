import { useState, useEffect } from 'react';
import BeholdWidget from '@behold/react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Media.css';

const DEFAULT_IG_URL = 'https://www.instagram.com/voila_les_enfants/';

export default function Media() {
  const { t } = useLang();
  const ref = useReveal();
  const [igUrl, setIgUrl] = useState(DEFAULT_IG_URL);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'instagram_url')
        .maybeSingle();
      if (data?.value) setIgUrl(data.value);
    })();
  }, []);

  return (
    <section id="media" ref={ref}>
      <div className="container">
        {igUrl ? (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tag tag-link"
            aria-label="Instagram"
          >
            {t('media.tag')}
          </a>
        ) : (
          <span className="tag">{t('media.tag')}</span>
        )}
        <h2 className="sec-title">{t('media.title')}</h2>
        <div className="bar" />
        <p className="media-sub">{t('media.sub')}</p>
        <div className="media-feed reveal">
          <BeholdWidget feedId="Xe8UQ4p51BeYWRRGQ9N6" />
        </div>
      </div>
    </section>
  );
}
