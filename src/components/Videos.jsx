import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Videos.css';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useReveal([videos]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('videos_items')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data) setVideos(data);
      setLoaded(true);
    })();
  }, []);

  if (!loaded || videos.length === 0) return null;

  return (
    <section id="videos" ref={ref}>
      <div className="container">
        <span className="tag">VIDEOS</span>
        <h2 className="sec-title">Our Videos</h2>
        <div className="bar" />
        <div className="videos-grid">
          {videos.map((vid, i) => (
            <div
              key={vid.id}
              className={`video-card reveal ${i > 0 ? `reveal-d${Math.min(i, 3)}` : ''}`}
            >
              <div className="video-frame">
                {vid.youtube_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${vid.youtube_id}`}
                    title={vid.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : vid.video_url ? (
                  <video src={vid.video_url} controls preload="metadata" />
                ) : null}
              </div>
              <div className="video-body">
                <h3 className="video-title">{vid.title}</h3>
                {vid.description && (
                  <p className="video-desc">{vid.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
