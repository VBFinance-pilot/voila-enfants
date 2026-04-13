import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from './useReveal';
import './Gallery.css';

// Static fallback images (used when Supabase has no data yet)
const staticImages = Array.from({ length: 61 }, (_, i) => ({
  id: `static-${i}`,
  image_url: `/gallery/Photo ${i + 1}.jpeg`,
  title: null,
}));

export default function Gallery() {
  const { t } = useLang();
  const ref = useReveal();
  const [lightbox, setLightbox] = useState(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        setImages(data);
      } else {
        setImages(staticImages);
      }
      setLoaded(true);
    }
    fetchGallery();
  }, []);

  const closeLB = (e) => {
    if (e && e.target.tagName === 'IMG') return;
    setLightbox(null);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    if (lightbox) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (!loaded) return null;

  return (
    <section id="gallery" ref={ref}>
      <div className="container">
        <span className="tag">{t('gallery.tag')}</span>
        <h2 className="sec-title">{t('gallery.title')}</h2>
        <div className="bar" />
        <div className="gallery-grid">
          {images.map((img) => (
            <div
              key={img.id}
              className="g-item"
              onClick={() => setLightbox(img.image_url)}
            >
              <img src={img.image_url} alt={img.title || 'Voilà les enfants English school Kyoto – classroom activities'} loading="lazy" />
              <div className="g-overlay">
                <span className="g-overlay-icon">🔍</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <span className="gallery-note">{t('gallery.note')}</span>
        </div>
      </div>

      {lightbox && (
        <div className="lb open" onClick={closeLB}>
          <button className="lb-close" onClick={() => setLightbox(null)}>
            ✕
          </button>
          <img src={lightbox} alt="Voilà les enfants English school Kyoto – photo" />
        </div>
      )}
    </section>
  );
}
