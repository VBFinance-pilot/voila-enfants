import { useEffect, useRef, useState } from 'react';
import { DEFAULT_FRAME, ratioOf } from '../../site/siteImages';

// « Recadrer » : drag the photo to choose what stays in view, zoom with the
// slider, the +/− buttons or the mouse wheel. The preview uses exactly the
// same CSS as the site (object-position + scale around the focal point).
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

function Preview({ src, aspect, frame, label, frameRef, onPointerDown, dragging }) {
  return (
    <figure className="adm-frame-fig">
      <div
        ref={frameRef}
        className={`adm-frame${dragging ? ' is-dragging' : ''}${onPointerDown ? ' is-live' : ''}`}
        style={{ aspectRatio: aspect, maxWidth: `calc(62vh * ${ratioOf(aspect)})` }}
        onPointerDown={onPointerDown}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ objectPosition: `${frame.x}% ${frame.y}%`, transformOrigin: `${frame.x}% ${frame.y}%`, transform: `scale(${frame.z})` }}
        />
        {onPointerDown && <span className="adm-frame-grid" aria-hidden="true" />}
      </div>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

export default function FrameEditor({ src, aspect, mobileAspect, initial, onSave, onCancel, saving }) {
  const [frame, setFrame] = useState(initial || DEFAULT_FRAME);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef(null);
  const drag = useRef(null);

  const zoomBy = (d) => setFrame((f) => ({ ...f, z: round(clamp(f.z + d, 1, 3), 2) }));

  // Mouse wheel / trackpad zoom (needs a non-passive listener to stop page scroll).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      setFrame((f) => ({ ...f, z: round(clamp(f.z - e.deltaY * 0.002, 1, 3), 2) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      const step = e.shiftKey ? 10 : 2;
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (moves[e.key]) {
        e.preventDefault();
        const [dx, dy] = moves[e.key];
        setFrame((f) => ({ ...f, x: clamp(f.x + dx, 0, 100), y: clamp(f.y + dy, 0, 100) }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const onPointerDown = (e) => {
    const rect = frameRef.current.getBoundingClientRect();
    drag.current = { x: e.clientX, y: e.clientY, start: frame, w: rect.width, h: rect.height };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    // Moving the photo right shows more of its left side → focal point moves left.
    const dx = ((e.clientX - d.x) / d.w) * 100 / d.start.z;
    const dy = ((e.clientY - d.y) / d.h) * 100 / d.start.z;
    setFrame({ ...d.start, x: round(clamp(d.start.x - dx, 0, 100)), y: round(clamp(d.start.y - dy, 0, 100)) });
  };
  const onPointerUp = () => { drag.current = null; setDragging(false); };

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Recadrer la photo" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="adm-modal-card">
        <div className="adm-modal-head">
          <div>
            <div className="adm-eyebrow">RECADRER</div>
            <h3>Choisissez ce qui reste visible</h3>
            <p className="adm-meta">Faites glisser la photo pour la recentrer, zoomez avec le curseur, les boutons ou la molette. Flèches du clavier : réglage fin.</p>
          </div>
          <button type="button" className="adm-btn-edit" onClick={onCancel} aria-label="Fermer">✕</button>
        </div>

        <div className="adm-frame-previews">
          <Preview src={src} aspect={aspect} frame={frame} label={mobileAspect ? 'Ordinateur' : null} frameRef={frameRef} onPointerDown={onPointerDown} dragging={dragging} />
          {mobileAspect && <Preview src={src} aspect={mobileAspect} frame={frame} label="Téléphone (aperçu)" />}
        </div>

        <div className="adm-zoom">
          <button type="button" className="adm-zoom-btn" onClick={() => zoomBy(-0.1)} aria-label="Dézoomer" disabled={frame.z <= 1}>−</button>
          <input type="range" min="1" max="3" step="0.01" value={frame.z} onChange={(e) => setFrame((f) => ({ ...f, z: +e.target.value }))} aria-label="Zoom" />
          <button type="button" className="adm-zoom-btn" onClick={() => zoomBy(0.1)} aria-label="Zoomer" disabled={frame.z >= 3}>+</button>
          <span className="adm-zoom-val">{Math.round(frame.z * 100)} %</span>
        </div>

        <div className="adm-form-actions" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="adm-btn-cancel" onClick={() => setFrame(DEFAULT_FRAME)}>Réinitialiser</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="adm-btn-cancel" onClick={onCancel}>Annuler</button>
            <button type="button" className="adm-btn-save" disabled={saving} onClick={() => onSave(frame)}>{saving ? 'Enregistrement…' : 'Enregistrer le cadrage'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
