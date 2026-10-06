import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Photo slots editable from /admin → "Hero / Section Images".
// key = hero_images.section_name, label shown in the admin.
export const IMAGE_SLOTS = [
  { name: 'home_hero', label: 'Accueil — grande photo d’ouverture', fallback: '/img/hero.jpg', aspect: '16 / 9' },
  { name: 'home_learn', label: 'Accueil — carte « Voilà Experience » (I)', fallback: '/img/slime.jpg', aspect: '3 / 4' },
  { name: 'home_live', label: 'Accueil — carte « Voilà Homestay » (II)', fallback: '/img/tatami2.jpg', aspect: '3 / 4' },
  { name: 'home_celebrate', label: 'Accueil — carte « Voilà Moments » (III)', fallback: '/img/crowns.jpg', aspect: '3 / 4' },
  { name: 'learn_hero', label: 'Page Apprendre (Voilà Experience) — grande photo', fallback: '/img/classroom.jpg', aspect: '16 / 7' },
  { name: 'learn_kids', label: 'Page Apprendre — cours « Activités enfants »', fallback: '/img/slime.jpg', aspect: '4 / 3' },
  { name: 'learn_secondary', label: 'Page Apprendre — cours « Collège, lycée & université »', fallback: '/img/tatami2.jpg', aspect: '4 / 3' },
  { name: 'learn_online', label: 'Page Apprendre — cours « En ligne & examens »', fallback: '/img/classroom.jpg', aspect: '4 / 3' },
  { name: 'learn_adults', label: 'Page Apprendre — cours « Langues pour adultes »', fallback: '/img/bordeaux.jpg', aspect: '4 / 3' },
  { name: 'homestay_hero', label: 'Page Homestay (Voilà Homestay) — grande photo', fallback: '/img/tatami2.jpg', aspect: '16 / 7' },
  { name: 'homestay_room', label: 'Page Homestay — chambre tatami', fallback: '/img/tatami2.jpg', aspect: '12 / 7' },
  { name: 'homestay_meal1', label: 'Page Homestay — repas / cuisine 1', fallback: '/img/kitchen.jpg', aspect: '4 / 3' },
  { name: 'homestay_meal2', label: 'Page Homestay — repas / cuisine 2', fallback: '/img/dinner.jpg', aspect: '4 / 3' },
  { name: 'travel_france', label: 'Page Homestay — voyage France', fallback: '/img/bordeaux.jpg', aspect: '3 / 4' },
  { name: 'travel_bali', label: 'Page Homestay — voyage Bali', fallback: '/img/balipool.jpg', aspect: '3 / 4' },
  { name: 'travel_vietnam', label: 'Page Homestay — voyage Vietnam', fallback: '', aspect: '3 / 4' },
  { name: 'travel_okinawa', label: 'Page Homestay — voyage Okinawa', fallback: '', aspect: '3 / 4' },
  { name: 'travel_tokyo', label: 'Page Homestay — voyage Tokyo', fallback: '', aspect: '3 / 4' },
  { name: 'live_camp', label: 'Page Homestay — chapitre III « English Camp »', fallback: '/img/bbq.jpg', aspect: '4 / 3' },
  { name: 'celebrate_hero', label: 'Page Célébrer (Voilà Moments) — grande photo', fallback: '/img/party.jpg', aspect: '16 / 7' },
  { name: 'celebrate_events', label: 'Page Célébrer — « Anniversaires & événements »', fallback: '/img/crowns.jpg', aspect: '4 / 3' },
  { name: 'celebrate_apero', label: 'Page Célébrer — « L’Apéro »', fallback: '/img/apero.jpg', aspect: '4 / 3' },
  { name: 'franchise_hero', label: 'Page Franchise — grande photo', fallback: '/img/ronde.jpg', aspect: '16 / 7' },
  { name: 'careers_hero', label: 'Page Recrutement — grande photo', fallback: '/img/hero.jpg', aspect: '16 / 7' },
];

const FALLBACK = Object.fromEntries(IMAGE_SLOTS.map((s) => [s.name, s.fallback]));

// Framing (focal point + zoom) chosen in /admin → « Recadrer ».
// Stored as JSON in hero_images.description: {"frame":{"x":50,"y":50,"z":1}}.
export const DEFAULT_FRAME = { x: 50, y: 50, z: 1 };
export const ratioOf = (aspect) => { const [w, h] = String(aspect).split('/').map(Number); return w && h ? w / h : 4 / 3; };
export function parseFrame(description) {
  try {
    const f = JSON.parse(description || '')?.frame;
    if (!f) return null;
    const clamp = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
    return { x: clamp(f.x, 0, 100, 50), y: clamp(f.y, 0, 100, 50), z: clamp(f.z, 1, 3, 1) };
  } catch {
    return null;
  }
}
// Props to spread on an <img>: CSS variables read by `.vs img[data-framed]`.
export function frameProps(frame) {
  if (!frame) return {};
  return { 'data-framed': '', style: { '--ox': `${frame.x}%`, '--oy': `${frame.y}%`, '--z': frame.z } };
}

let cache = null;
let pending = null;

function load() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = (async () => {
      const map = {};
      try {
        const { data, error } = await supabase.from('hero_images').select('section_name, image_url, alt_text, description');
        if (error) throw error;
        (data || []).forEach((r) => { map[r.section_name] = { url: r.image_url || '', frame: parseFrame(r.description) }; });
      } catch (err) {
        console.error('[SiteImages] fetch failed', err);
      }
      cache = map;
      return map;
    })();
  }
  return pending;
}

// img(slot) → URL from the admin if set, otherwise the built-in photo.
// img.props(slot) → framing props for that <img> (empty when not reframed).
export function useSiteImages() {
  const [map, setMap] = useState(cache || {});
  useEffect(() => {
    let alive = true;
    load().then((m) => { if (alive) setMap(m); });
    return () => { alive = false; };
  }, []);
  return Object.assign((slot) => map[slot]?.url || FALLBACK[slot] || '', {
    props: (slot) => frameProps(map[slot]?.frame),
  });
}
