import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BeholdWidget from '@behold/react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import eventsStatic from '../data/events.json';
import { home, form as formCopy, CONTACT, TOPICS, TOPIC_GROUPS } from './copy';

/* ───────────── Contact form (posts to /api/contact) ───────────── */
// `extra` = [{ name, label, placeholder, type, options, wide }] rendered after
// name/email and folded into the message body, so the existing API is reused.
// `defaultTopic` = TOPICS key shown when the URL has no ?topic=.
export function ContactForm({ subject, extra = [], messageLabel, title, defaultTopic, placeholder }) {
  const { tx, lang } = useLang();
  const [status, setStatus] = useState('idle');
  const [params] = useSearchParams();
  const urlTopic = params.get('topic');
  // 'homestay' (generic) maps to the Kyoto homestay entry of the subject menu.
  const norm = (k) => (k === 'homestay' ? 'live_homestay' : k);
  const wanted = TOPICS[urlTopic] ? norm(urlTopic) : norm(defaultTopic) || null;
  const [topicKey, setTopicKey] = useState(wanted);
  const [prevWanted, setPrevWanted] = useState(wanted);
  if (wanted !== prevWanted) { setPrevWanted(wanted); setTopicKey(wanted); }
  const topic = topicKey ? TOPICS[topicKey] : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (f.website?.value) return; // honeypot
    setStatus('loading');
    // Structured payload: the email template lays each part out on its own.
    const details = extra
      .map((x) => {
        const v = f[x.name]?.value?.trim();
        return v ? { k: x.label.fr || tx(x.label), v } : null;
      })
      .filter(Boolean);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: f.name.value.trim(),
          from_email: f.email.value.trim(),
          message: f.message.value,
          topic: topic ? topic.fr : subject || '',
          topic_ja: topic ? topic.ja : '',
          form: subject || '',
          details,
          lang,
        }),
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
      <div className="vs-form-grid">
        <label className="is-wide">
          {tx(formCopy.topic)}
          <select name="topic" required value={topicKey || ''} onChange={(e) => setTopicKey(e.target.value || null)} className={topicKey ? 'is-set' : undefined}>
            <option value="" disabled>{tx(formCopy.topicPick)}</option>
            {TOPIC_GROUPS.map((g) => (
              <optgroup key={g.label.en} label={tx(g.label)}>
                {g.keys.map((k) => <option key={k} value={k}>{tx(TOPICS[k])}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
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
          <textarea name="message" required placeholder={tx(placeholder || formCopy.messagePh)} />
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
const MONTHS = {
  jan: 0, january: 0, janvier: 0, feb: 1, february: 1, fevrier: 1, février: 1, mar: 2, march: 2, mars: 2,
  apr: 3, april: 3, avril: 3, may: 4, mai: 4, jun: 5, june: 5, juin: 5, jul: 6, july: 6, juillet: 6,
  aug: 7, august: 7, aout: 7, août: 7, sep: 8, sept: 8, september: 8, septembre: 8, oct: 9, october: 9, octobre: 9,
  nov: 10, november: 10, novembre: 10, dec: 11, december: 11, decembre: 11, décembre: 11,
};

// Reads the admin's free-text date: "2026-10-31" → a day; "September 2026",
// "2026-09" or "2026年9月" → a month. Anything else stays as plain text.
function parseWhen(v) {
  const t = String(v || '').trim();
  if (!t) return null;
  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return { date: new Date(+m[1], +m[2] - 1, +m[3]), day: true };
  m = t.match(/^(\d{4})年\s*(\d{1,2})月(?:\s*(\d{1,2})日)?/);
  if (m) return { date: new Date(+m[1], +m[2] - 1, +(m[3] || 1)), day: !!m[3] };
  m = t.match(/^(\d{4})[-/.](\d{1,2})$/);
  if (m) return { date: new Date(+m[1], +m[2] - 1, 1), day: false };
  m = t.toLowerCase().match(/^(?:(\d{1,2})\s+)?([a-zéû]+)\.?\s+(?:(\d{1,2}),?\s+)?(\d{4})$/);
  if (m && MONTHS[m[2]] !== undefined) {
    const dd = +(m[1] || m[3] || 0);
    return { date: new Date(+m[4], MONTHS[m[2]], dd || 1), day: !!dd };
  }
  return null;
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
        const w = parseWhen(e.when);
        const d = w?.date;
        const extra = [!w && e.when, e.desc].filter(Boolean).join(' · ');
        return (
          <div key={e.id} className="vs-event">
            <div className="vs-event-date" aria-hidden={!d}>
              <small>{d ? d.toLocaleDateString(locale, { month: 'short' }) : '—'}</small>
              <b className={w && !w.day ? 'is-year' : undefined}>{d ? (w.day ? d.getDate() : d.getFullYear()) : '✦'}</b>
            </div>
            <div className="vs-event-body">
              <strong>{e.title}</strong>
              {d && <span>{d.toLocaleDateString(locale, w.day ? { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' })}</span>}
              {extra && <span>{extra}</span>}
              <a href={CONTACT.line} target="_blank" rel="noopener noreferrer">{tx(t.signup)} ›</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── Moments: photos · films · Instagram in one section ───────────── */
// Photos = gallery_items, films = videos_items (both managed in /admin),
// Instagram = Behold feed of @voilaenglish. One header, a segmented control.
const IG_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const STATIC_GALLERY = Array.from({ length: 24 }, (_, i) => ({ id: `s-${i}`, image_url: `/gallery/Photo ${i + 1}.jpeg`, title: null }));

function useTable(table, fallback) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from(table).select('*').order('order_index', { ascending: true });
        if (error) throw error;
        setRows(data?.length ? data : fallback);
      } catch (err) {
        console.error(`[Moments] ${table} fetch failed`, err);
        setRows(fallback);
      }
    })();
  }, [table, fallback]);
  return rows;
}

const NO_VIDEOS = [];

function PhotoGrid({ items }) {
  const { tx } = useLang();
  const [open, setOpen] = useState(null);
  const [all, setAll] = useState(false);

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

  const t = home.gallery;
  const shown = all ? items : items.slice(0, 8);
  return (
    <>
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
      {open !== null && (
        <div className="vs-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button type="button" className="vs-lb-btn vs-lb-close" aria-label="Close" onClick={() => setOpen(null)}>✕</button>
          <button type="button" className="vs-lb-btn vs-lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length); }}>‹</button>
          <img src={items[open].image_url} alt={items[open].title || ''} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="vs-lb-btn vs-lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length); }}>›</button>
        </div>
      )}
    </>
  );
}

function FilmGrid({ videos }) {
  return (
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
  );
}

function InstagramFeed() {
  const { tx } = useLang();
  // Official account: @voilaenglish. site_settings.instagram_url is ignored on purpose.
  const t = home.instagram;
  return (
    <div className="vs-moments-ig">
      <p className="vs-lead" style={{ maxWidth: 620, textAlign: 'center' }}>{tx(t.sub)}</p>
      <div className="vs-insta-feed"><BeholdWidget feedId="Xe8UQ4p51BeYWRRGQ9N6" /></div>
      <a className="vs-btn vs-btn-outline" style={{ borderColor: 'var(--ink)' }} href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">{IG_ICON}{tx(t.follow)}</a>
    </div>
  );
}

export function MomentsSection() {
  const { tx } = useLang();
  const photos = useTable('gallery_items', STATIC_GALLERY);
  const videos = useTable('videos_items', NO_VIDEOS) || NO_VIDEOS;
  const [tab, setTab] = useState('instagram');
  const t = home.moments;
  const tabs = [
    { k: 'instagram', show: true },
    { k: 'photos', show: photos === null || photos.length > 0 },
    { k: 'films', show: videos.length > 0 },
  ].filter((x) => x.show);
  const active = tabs.some((x) => x.k === tab) ? tab : tabs[0].k;

  return (
    <section id="moments" className="vs-block">
      <div className="vs-wrap" style={{ gap: 36 }}>
        <div className="vs-moments-head">
          <div>
            <div className="vs-label">{tx(t.label)}</div>
            <h2 className="vs-h3">{tx(t.title)}</h2>
          </div>
          <div className="vs-segment" role="tablist" aria-label={tx(t.title)}>
            {tabs.map((x) => (
              <button key={x.k} type="button" role="tab" aria-selected={active === x.k} onClick={() => setTab(x.k)}>
                {tx(t.tabs[x.k])}
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel">
          {active === 'photos' && photos && <PhotoGrid items={photos} />}
          {active === 'films' && <FilmGrid videos={videos} />}
          {active === 'instagram' && <InstagramFeed />}
        </div>
      </div>
    </section>
  );
}
