import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BeholdWidget from '@behold/react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import eventsStatic from '../data/events.json';
import { home, form as formCopy, CONTACT, TOPICS } from './copy';

/* ───────────── Contact form (posts to /api/contact) ───────────── */
// `extra` = [{ name, label, placeholder, type, options, wide }] rendered after
// name/email and folded into the message body, so the existing API is reused.
// `defaultTopic` = TOPICS key shown when the URL has no ?topic=.
export function ContactForm({ subject, extra = [], messageLabel, title, defaultTopic }) {
  const { tx } = useLang();
  const [status, setStatus] = useState('idle');
  const [params] = useSearchParams();
  const urlTopic = params.get('topic');
  const wanted = TOPICS[urlTopic] ? urlTopic : defaultTopic || null;
  const [topicKey, setTopicKey] = useState(wanted);
  const [prevWanted, setPrevWanted] = useState(wanted);
  if (wanted !== prevWanted) { setPrevWanted(wanted); setTopicKey(wanted); }
  const topic = topicKey ? TOPICS[topicKey] : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (f.website?.value) return; // honeypot
    setStatus('loading');
    const lines = extra
      .map((x) => {
        const v = f[x.name]?.value?.trim();
        return v ? `${tx(x.label)}: ${v}` : null;
      })
      .filter(Boolean);
    const topicText = topic ? `${topic.fr} / ${topic.ja}` : '';
    const message = [subject ? `[${subject}]` : null, topic ? `Sujet : ${topicText}` : null, ...lines, lines.length || topic ? '' : null, f.message.value]
      .filter((l) => l !== null)
      .join('\n');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_name: f.name.value.trim(), from_email: f.email.value.trim(), message, topic: topic ? topic.fr : subject || '' }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.success) {
        setStatus('ok');
        f.reset();
      } else {
        setStatus('err');
      }
    } catch {
      setStatus('err');
    }
  };

  return (
    <form className="vs-form" onSubmit={onSubmit}>
      {title && <div className="vs-form-title">{title}</div>}
      {topic && (
        <div className="vs-form-topic" role="status">
          <span className="vs-form-topic-k">{tx(formCopy.topic)}</span>
          <strong>{tx(topic)}</strong>
          <button type="button" aria-label={tx(formCopy.topicRemove)} title={tx(formCopy.topicRemove)} onClick={() => setTopicKey(null)}>×</button>
        </div>
      )}
      <div className="vs-form-grid">
        <label>{tx(formCopy.name)}<input name="name" type="text" autoComplete="name" required /></label>
        <label>{tx(formCopy.email)}<input name="email" type="email" autoComplete="email" required /></label>
        {extra.map((x) => (
          <label key={x.name} className={x.wide ? 'is-wide' : undefined}>
            {tx(x.label)}
            {x.options ? (
              <select name={x.name} defaultValue="">
                <option value="" disabled>—</option>
                {x.options.map((o) => <option key={tx(o)} value={tx(o)}>{tx(o)}</option>)}
              </select>
            ) : (
              <input name={x.name} type={x.type || 'text'} placeholder={x.placeholder ? tx(x.placeholder) : undefined} />
            )}
          </label>
        ))}
        <label className="is-wide">
          {messageLabel ? tx(messageLabel) : tx(formCopy.message)}
          <textarea name="message" required placeholder={tx(formCopy.messagePh)} />
        </label>
        <label className="vs-hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? tx(formCopy.sending) : tx(formCopy.send)}
      </button>
      <div className={`vs-form-status ${status === 'ok' ? 'is-ok' : status === 'err' ? 'is-err' : ''}`} role="status" aria-live="polite">
        {status === 'ok' && tx(formCopy.sent)}
        {status === 'err' && tx(formCopy.failed)}
      </div>
    </form>
  );
}

/* ───────────── Google reviews (Places API New, live) ───────────── */
const PLACE_ID = 'ChIJy-pi_S4BAWARPK1FK5naw7g';
const PLACES_ENDPOINT = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews,googleMapsUri';

function Stars({ rating }) {
  const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return <span className="vs-stars" aria-label={`${rating} / 5`}>{'★★★★★'.slice(0, n)}<span style={{ opacity: 0.3 }}>{'★★★★★'.slice(n)}</span></span>;
}

function Avatar({ name, photo }) {
  const [ok, setOk] = useState(Boolean(photo));
  if (!ok) return <div className="vs-review-avatar" aria-hidden="true">{(name || '?').trim().charAt(0).toUpperCase()}</div>;
  return <img src={photo} alt="" referrerPolicy="no-referrer" onError={() => setOk(false)} />;
}

export function GoogleReviewsBlock() {
  const { lang, tx } = useLang();
  const [data, setData] = useState(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!key) {
      console.error('[GoogleReviews] VITE_GOOGLE_PLACES_API_KEY is not set');
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${PLACES_ENDPOINT}?languageCode=${lang}`, {
          headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELD_MASK },
        });
        if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.error('[GoogleReviews] fetch failed', err);
      }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  if (!data) return null;
  const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 3) : [];
  const t = home.reviews;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 24 }}>
      <div className="vs-reviews-head">
        <h3 className="vs-h3">{tx(t.title)}</h3>
        {data.rating != null && (
          <div className="vs-rating">
            <b>{data.rating.toFixed(1)}</b>
            <Stars rating={data.rating} />
            <span>{tx(t.onGoogle)} · {data.userRatingCount} {tx(t.count)}</span>
          </div>
        )}
      </div>
      {reviews.length > 0 && (
        <div className="vs-grid-3">
          {reviews.map((r, i) => {
            const a = r.authorAttribution || {};
            return (
              <article key={`${a.displayName || 'anon'}-${i}`} className="vs-review">
                <header>
                  <Avatar name={a.displayName} photo={a.photoUri} />
                  <div>
                    <div className="vs-review-name">
                      {a.uri ? <a href={a.uri} target="_blank" rel="noopener noreferrer">{a.displayName || '—'}</a> : (a.displayName || '—')}
                    </div>
                    <div className="vs-review-date">{r.relativePublishTimeDescription}</div>
                  </div>
                </header>
                <Stars rating={r.rating} />
                {r.text?.text && <p>{r.text.text}</p>}
              </article>
            );
          })}
        </div>
      )}
      <div className="vs-review-foot">
        <span>Powered by Google</span>
        {data.googleMapsUri && (
          <a className="vs-btn vs-btn-outline" href={data.googleMapsUri} target="_blank" rel="noopener noreferrer">{tx(t.all)} ›</a>
        )}
      </div>
    </div>
  );
}

/* ───────────── Google map (embed URL from Supabase) ───────────── */
const DEFAULT_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d667.7026456815657!2d135.66460691877944!3d34.97627562419339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001012efd62eacb%3A0xb8c3da992b45ad3c!2zVm9pbMOgIGxlcyBlbmZhbnRzIOiLseiqnuOBp0Hjgq_jg4bjgqPjg5Pjg4bjgqNT4p2j77iP!5e0!3m2!1sfr!2sjp!4v1779884209109!5m2!1sfr!2sjp';

export function MapBlock() {
  const { tx } = useLang();
  const [src, setSrc] = useState(DEFAULT_MAPS_EMBED);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'google_maps_embed_src').maybeSingle();
      if (data?.value) setSrc(data.value);
    })();
  }, []);
  const c = home.contact;
  return (
    <div className="vs-map">
      <iframe src={src} title="Voilà les enfants — Google Maps" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      <div className="vs-map-card">
        <div className="vs-card-label">{tx(c.mapTitle)}</div>
        <div>{tx({ ja: '〒610-1106 京都府京都市西京区大枝沓掛町10-122', en: '10-122 Oeda Kutsukake-cho, Nishikyo-ku, Kyoto 610-1106', fr: '10-122 Oeda Kutsukake-cho, Nishikyo-ku, Kyoto 610-1106' })}</div>
        <div className="vs-btns">
          <a className="vs-btn vs-btn-ink" href="https://www.google.com/maps/search/?api=1&query=Voil%C3%A0+les+enfants&query_place_id=ChIJy-pi_S4BAWARPK1FK5naw7g" target="_blank" rel="noopener noreferrer">{tx(c.mapOpen)}</a>
          <a className="vs-btn vs-btn-outline" href="https://www.google.com/maps/dir/?api=1&destination=Voil%C3%A0+les+enfants&destination_place_id=ChIJy-pi_S4BAWARPK1FK5naw7g" target="_blank" rel="noopener noreferrer">{tx(c.route)}</a>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Upcoming events (Supabase events_items) ───────────── */
function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function UpcomingEvents() {
  const { lang, tx } = useLang();
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('events_items').select('*').eq('active', true).order('order_index').limit(3);
        if (error) throw error;
        if (data?.length) {
          setItems(data.map((e) => ({ id: e.id, title: e.title, desc: e.description, when: e.event_date || e.date || '' })));
          return;
        }
      } catch (err) {
        console.error('[Events] Supabase fetch failed', err);
      }
      setItems(eventsStatic.filter((e) => e.active).map((e) => ({ id: e.id, title: tx(e.title), desc: tx(e.body), when: '' })));
    })();
  }, [tx]);

  const t = home.upcoming;
  const locale = { ja: 'ja-JP', en: 'en-GB', fr: 'fr-FR' }[lang];
  if (items === null) return null;

  return (
    <div className="vs-grid-3">
      {items.length === 0 && <p className="vs-lead">{tx(t.empty)}</p>}
      {items.map((e) => {
        const d = parseDate(e.when);
        return (
          <div key={e.id} className="vs-event">
            <div className="vs-event-date" aria-hidden={!d}>
              <small>{d ? d.toLocaleDateString(locale, { month: 'short' }) : '—'}</small>
              <b>{d ? d.getDate() : '✦'}</b>
            </div>
            <div className="vs-event-body">
              <strong>{e.title}</strong>
              {(e.desc || (!d && e.when)) && <span>{!d && e.when ? `${e.when} · ` : ''}{e.desc}</span>}
              <a href={CONTACT.line} target="_blank" rel="noopener noreferrer">{tx(t.signup)} ›</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── Instagram (Behold feed, edge to edge — hotel style) ───────────── */
const IG_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export function InstagramSection() {
  const { tx } = useLang();
  // Official account: @voilaenglish. The old site_settings.instagram_url is
  // ignored on purpose so a stale admin value can't break the link.
  const url = CONTACT.instagram;
  const t = home.instagram;
  return (
    <section id="instagram" className="vs-insta">
      <div className="vs-insta-head">
        <div className="vs-label">{tx(t.label)}</div>
        <h2 className="vs-insta-title">{tx(t.title)}</h2>
        <a className="vs-insta-handle" href={url} target="_blank" rel="noopener noreferrer">{CONTACT.instagramHandle}</a>
        <p className="vs-lead" style={{ maxWidth: 620 }}>{tx(t.sub)}</p>
      </div>
      <div className="vs-insta-feed"><BeholdWidget feedId="Xe8UQ4p51BeYWRRGQ9N6" /></div>
      <a className="vs-btn vs-btn-outline" style={{ borderColor: 'var(--ink)' }} href={url} target="_blank" rel="noopener noreferrer">{IG_ICON}{tx(t.follow)}</a>
    </section>
  );
}

/* ───────────── Gallery (Supabase gallery_items, managed in /admin) ───────────── */
const STATIC_GALLERY = Array.from({ length: 24 }, (_, i) => ({ id: `s-${i}`, image_url: `/gallery/Photo ${i + 1}.jpeg`, title: null }));

export function GallerySection() {
  const { tx } = useLang();
  const [items, setItems] = useState(null);
  const [open, setOpen] = useState(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('gallery_items').select('*').order('order_index', { ascending: true });
        if (error) throw error;
        setItems(data?.length ? data : STATIC_GALLERY);
      } catch (err) {
        console.error('[Gallery] fetch failed', err);
        setItems(STATIC_GALLERY);
      }
    })();
  }, []);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + items.length) % items.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, items]);

  if (!items?.length) return null;
  const t = home.gallery;
  const shown = all ? items : items.slice(0, 8);

  return (
    <section id="gallery" className="vs-block">
      <div className="vs-wrap" style={{ gap: 36 }}>
        <div className="vs-head">
          <div><div className="vs-label">{tx(t.label)}</div><h2 className="vs-h3">{tx(t.title)}</h2></div>
        </div>
        <div className="vs-gallery">
          {shown.map((g, i) => (
            <button key={g.id} type="button" className="vs-gallery-item" onClick={() => setOpen(i)} aria-label={g.title || `Photo ${i + 1}`}>
              <img src={g.image_url} alt={g.title || ''} loading="lazy" />
            </button>
          ))}
        </div>
        {items.length > 8 && (
          <button type="button" className="vs-btn vs-btn-outline-btn" onClick={() => setAll((v) => !v)}>
            {all ? tx(t.less) : `${tx(t.more)} (${items.length})`}
          </button>
        )}
      </div>
      {open !== null && (
        <div className="vs-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button type="button" className="vs-lb-btn vs-lb-close" aria-label="Close" onClick={() => setOpen(null)}>✕</button>
          <button type="button" className="vs-lb-btn vs-lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length); }}>‹</button>
          <img src={items[open].image_url} alt={items[open].title || ''} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="vs-lb-btn vs-lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length); }}>›</button>
        </div>
      )}
    </section>
  );
}

/* ───────────── Videos (Supabase videos_items, managed in /admin) ───────────── */
export function VideosSection() {
  const { tx } = useLang();
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('videos_items').select('*').order('order_index', { ascending: true });
        if (error) throw error;
        setVideos(data || []);
      } catch (err) {
        console.error('[Videos] fetch failed', err);
      }
    })();
  }, []);
  if (!videos.length) return null;
  const t = home.videos;
  return (
    <section id="videos" className="vs-block">
      <div className="vs-wrap" style={{ gap: 36 }}>
        <div className="vs-head"><div><div className="vs-label">{tx(t.label)}</div><h2 className="vs-h3">{tx(t.title)}</h2></div></div>
        <div className="vs-grid-3">
          {videos.map((v) => (
            <div key={v.id} className="vs-video">
              <div className="vs-video-frame">
                {v.youtube_id ? (
                  <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.title || 'Video'} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : v.video_url ? (
                  <video src={v.video_url} controls preload="metadata" playsInline />
                ) : null}
              </div>
              {v.title && <strong>{v.title}</strong>}
              {v.description && <span>{v.description}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
