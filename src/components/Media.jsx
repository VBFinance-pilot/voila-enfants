import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import mediaData from '../data/media.json';
import { useReveal } from './useReveal';
import './Media.css';

export default function Media() {
  const { t } = useLang();
  const ref = useReveal();
  const [dbVideos, setDbVideos] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('videos_items')
        .select('*')
        .order('order_index');
      if (data && data.length > 0) setDbVideos(data);
    })();
  }, []);

  return (
    <section id="media" ref={ref}>
      <div className="container">
        <span className="tag">{t('media.tag')}</span>
        <h2 className="sec-title">{t('media.title')}</h2>
        <div className="bar" />
        <p className="media-sub">{t('media.sub')}</p>

        {dbVideos ? (
          <div className="media-row">
            {dbVideos.map((vid, i) => (
              <div key={vid.id} className={`media-card reveal ${i > 0 ? `reveal-d${i}` : ''}`}>
                {vid.youtube_id ? (
                  <div className="media-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.youtube_id}`}
                      title={vid.title}
                      allowFullScreen
                      style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 8 }}
                    />
                  </div>
                ) : vid.video_url ? (
                  <div className="media-video">
                    <video src={vid.video_url} controls style={{ width: '100%', borderRadius: 8 }} />
                  </div>
                ) : null}
                <div className="media-ep">{vid.title}</div>
                {vid.description && <div className="media-en">{vid.description}</div>}
                <div className="media-footer">{t('media.brand')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="media-row">
            {mediaData.map((item, i) => (
              <div key={i} className={`media-card reveal ${i > 0 ? `reveal-d${i}` : ''}`}>
                <div className="media-ep">{item.ep}</div>
                <div className="media-en">{item.en}</div>
                <div className="media-ja">{item.ja}</div>
                <div className="media-footer">{t('media.brand')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
