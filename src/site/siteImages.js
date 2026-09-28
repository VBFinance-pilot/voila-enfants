import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Photo slots editable from /admin → "Hero / Section Images".
// key = hero_images.section_name, label shown in the admin.
export const IMAGE_SLOTS = [
  { name: 'home_hero', label: 'Accueil — grande photo d’ouverture', fallback: '/img/hero.jpg' },
  { name: 'home_learn', label: 'Accueil — carte « Apprendre »', fallback: '/img/slime.jpg' },
  { name: 'home_live', label: 'Accueil — carte « Homestay »', fallback: '/img/tatami2.jpg' },
  { name: 'home_celebrate', label: 'Accueil — carte « Célébrer »', fallback: '/img/crowns.jpg' },
  { name: 'learn_hero', label: 'Page Apprendre — grande photo', fallback: '/img/classroom.jpg' },
  { name: 'learn_kids', label: 'Page Apprendre — Activités enfants', fallback: '/img/slime.jpg' },
  { name: 'learn_secondary', label: 'Page Apprendre — Collège / lycée / université', fallback: '/img/tatami2.jpg' },
  { name: 'learn_online', label: 'Page Apprendre — En ligne & examens', fallback: '/img/classroom.jpg' },
  { name: 'learn_adults', label: 'Page Apprendre — Adultes', fallback: '/img/bordeaux.jpg' },
  { name: 'homestay_hero', label: 'Page Homestay — grande photo', fallback: '/img/tatami2.jpg' },
  { name: 'homestay_room', label: 'Page Homestay — chambre tatami', fallback: '/img/tatami2.jpg' },
  { name: 'homestay_meal1', label: 'Page Homestay — repas / cuisine 1', fallback: '/img/kitchen.jpg' },
  { name: 'homestay_meal2', label: 'Page Homestay — repas / cuisine 2', fallback: '/img/dinner.jpg' },
  { name: 'travel_france', label: 'Page Homestay — voyage France', fallback: '/img/bordeaux.jpg' },
  { name: 'travel_bali', label: 'Page Homestay — voyage Bali', fallback: '/img/balipool.jpg' },
  { name: 'travel_vietnam', label: 'Page Homestay — voyage Vietnam', fallback: '' },
  { name: 'travel_okinawa', label: 'Page Homestay — voyage Okinawa', fallback: '' },
  { name: 'travel_tokyo', label: 'Page Homestay — voyage Tokyo', fallback: '' },
  { name: 'live_camp', label: 'Page Homestay — English Camp', fallback: '/img/bbq.jpg' },
  { name: 'celebrate_hero', label: 'Page Célébrer — grande photo', fallback: '/img/party.jpg' },
  { name: 'celebrate_events', label: 'Page Célébrer — Anniversaires & événements', fallback: '/img/crowns.jpg' },
  { name: 'celebrate_apero', label: 'Page Célébrer — L’Apéro', fallback: '/img/apero.jpg' },
  { name: 'franchise_hero', label: 'Page Franchise — grande photo', fallback: '/img/ronde.jpg' },
  { name: 'careers_hero', label: 'Page Recrutement — grande photo', fallback: '/img/hero.jpg' },
];

const FALLBACK = Object.fromEntries(IMAGE_SLOTS.map((s) => [s.name, s.fallback]));

let cache = null;
let pending = null;

function load() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = (async () => {
      const map = {};
      try {
        const { data, error } = await supabase.from('hero_images').select('section_name, image_url, alt_text');
        if (error) throw error;
        (data || []).forEach((r) => { if (r.image_url) map[r.section_name] = r; });
      } catch (err) {
        console.error('[SiteImages] fetch failed', err);
      }
      cache = map;
      return map;
    })();
  }
  return pending;
}

// Returns img(slot) → URL from the admin if set, otherwise the built-in photo.
export function useSiteImages() {
  const [map, setMap] = useState(cache || {});
  useEffect(() => {
    let alive = true;
    load().then((m) => { if (alive) setMap(m); });
    return () => { alive = false; };
  }, []);
  return (slot) => map[slot]?.image_url || FALLBACK[slot] || '';
}
