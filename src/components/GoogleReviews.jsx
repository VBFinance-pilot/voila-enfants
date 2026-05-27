import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './GoogleReviews.css';

const PLACE_ID = 'ChIJy-pi_S4BAWARPK1FK5naw7g';
const ENDPOINT = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews,googleMapsUri';

function Stars({ rating }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <span className="gr-stars" aria-label={`${rating} out of 5 stars`}>
      <span className="gr-stars-filled">{'★★★★★'.slice(0, filled)}</span>
      <span className="gr-stars-empty">{'★★★★★'.slice(filled)}</span>
    </span>
  );
}

function AuthorAvatar({ name, photoUri }) {
  const [loaded, setLoaded] = useState(true);
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  if (!photoUri || !loaded) {
    return <div className="gr-avatar gr-avatar-fallback" aria-hidden="true">{initial}</div>;
  }
  return (
    <img
      src={photoUri}
      alt=""
      className="gr-avatar"
      referrerPolicy="no-referrer"
      onError={() => setLoaded(false)}
    />
  );
}

export default function GoogleReviews() {
  const { t } = useLang();
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useReveal([placeData]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('[GoogleReviews] VITE_GOOGLE_PLACES_API_KEY is not set');
      setError('missing-key');
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'GET',
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': FIELD_MASK,
          },
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Places API ${res.status}: ${body}`);
        }
        const data = await res.json();
        if (!cancelled) setPlaceData(data);
      } catch (err) {
        console.error('[GoogleReviews] fetch failed', err);
        if (!cancelled) setError(err.message || 'fetch-failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading || error || !placeData) return null;

  const reviews = Array.isArray(placeData.reviews) ? placeData.reviews : [];
  const { rating, userRatingCount, googleMapsUri } = placeData;

  return (
    <div className="gr-section" ref={ref}>
      <h3 className="gr-title reveal">{t('contact.reviews_title')}</h3>
      <div className="bar reveal" />
      {googleMapsUri && (
        <a
          href={googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="gr-badge reveal"
          aria-label={t('contact.see_all_reviews')}
        >
          <span className="gr-badge-rating">{rating?.toFixed(1)}</span>
          <Stars rating={rating} />
          <span className="gr-badge-meta">
            {t('contact.reviews_on_google')} · {userRatingCount} {t('contact.reviews_count')}
          </span>
        </a>
      )}
      {reviews.length > 0 && (
        <div className="gr-grid">
          {reviews.map((r, i) => {
            const author = r.authorAttribution || {};
            const body = r.text?.text || '';
            return (
              <article
                key={`${author.displayName || 'anon'}-${i}`}
                className={`gr-card reveal ${i > 0 ? `reveal-d${Math.min(i, 3)}` : ''}`}
              >
                <header className="gr-card-head">
                  <AuthorAvatar name={author.displayName} photoUri={author.photoUri} />
                  <div className="gr-card-author">
                    <div className="gr-card-name">
                      {author.uri ? (
                        <a href={author.uri} target="_blank" rel="noopener noreferrer">
                          {author.displayName || '—'}
                        </a>
                      ) : (
                        author.displayName || '—'
                      )}
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                </header>
                {body && <p className="gr-card-text">{body}</p>}
                {r.relativePublishTimeDescription && (
                  <footer className="gr-card-date">{r.relativePublishTimeDescription}</footer>
                )}
              </article>
            );
          })}
        </div>
      )}
      <footer className="gr-footer reveal">
        <span className="gr-attribution">
          <span className="gr-g-mark" aria-hidden="true">G</span>
          Powered by Google
        </span>
        {googleMapsUri && (
          <a
            href={googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="gr-see-all"
          >
            {t('contact.see_all_reviews')} →
          </a>
        )}
      </footer>
    </div>
  );
}
