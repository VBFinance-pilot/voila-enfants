import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Activities.css';

export default function Activities() {
  const { t } = useLang();
  const ref = useReveal();
  const [heroImg, setHeroImg] = useState('/hero-bg.png');
  const [heroAlt, setHeroAlt] = useState('Activities');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('hero_images')
        .select('image_url, alt_text')
        .eq('section_name', 'activities_hero')
        .limit(1)
        .single();
      if (data?.image_url) {
        setHeroImg(data.image_url);
        if (data.alt_text) setHeroAlt(data.alt_text);
      }
    })();
  }, []);

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
              <img src={heroImg} alt={heroAlt} />
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
