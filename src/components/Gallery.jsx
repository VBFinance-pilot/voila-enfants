import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Gallery.css';

const galleryImages = Array.from({ length: 61 }, (_, i) => {
  const num = i + 1;
  return `/gallery/Photo ${num}.jpeg`;
});

export default function Gallery() {
  const { t } = useLang();
  const ref = useReveal();
  const [lightbox, setLightbox] = useState(null);

  const closeLB = (e) => {
    if (e && e.target.tagName === 'IMG') return;
    setLightbox(null);
  };

  return (
    <section id="gallery" ref={ref}>
      <div className="container">
        <span className="tag">{t('gallery.tag')}</span>
        <h2 className="sec-title">{t('gallery.title')}</h2>
        <div className="bar" />
        <div className="gallery-grid">
          {galleryImages.map((src, i) => (
            <div key={i} className="g-item" onClick={() => setLightbox(src)}>
              <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
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
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Gallery" />
        </div>
      )}
    </section>
  );
}
