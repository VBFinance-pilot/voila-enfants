import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Lightbox.css';

// Shared full-screen image zoom (News « Our Events » + « What's next » cards).
// Closes on ✕, backdrop click or Escape; locks body scroll while open.
// Rendered in a portal so a transformed ancestor (.reveal) can't trap it.
export default function Lightbox({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [src, onClose]);

  if (!src) return null;
  return createPortal(
    <div className="news-lb" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button type="button" className="news-lb-close" aria-label="Fermer" onClick={onClose}>✕</button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>,
    document.body,
  );
}
