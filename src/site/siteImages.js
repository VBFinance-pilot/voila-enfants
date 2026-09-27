import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Photo slots editable from /admin → "Hero / Section Images".
// key = hero_images.section_name, label shown in the admin.
export const IMAGE_SLOTS = [
  { name: 'home_hero', label: 'Accueil — grande photo d’ouverture', fallback: '/img/hero.jpg' },
  { name: 'learn_kids', label: 'Accueil — carte « Activités enfants »', fallback: '/img/slime.jpg' },
  { name: 'learn_secondary', label: 'Accueil — carte « Collège / lycée / université »', fallback: '/img/tatami2.jpg' },
  { name: 'learn_online', label: 'Accueil — carte « En ligne & examens »', fallback: '/img/classroom.jpg' },
  { name: 'learn_adults', label: 'Accueil — carte « Adultes »', fallback: '/img/bordeaux.jpg' },
  { name: 'live_homestay', label: 'Accueil — carte « Homestay à Kyoto »', fallback: '/img/tatami2.jpg' },
  { name: 'live_travel', label: 'Accueil — carte « Homestay en voyage »', fallback: '/img/balipool.jpg' },
  { name: 'live_camp', label: 'Accueil — carte « English Camp »', fallback: '/img/bbq.jpg' },
  { name: 'celebrate_events', label: 'Accueil — « Anniversaires & événements »', fallback: '/img/crowns.jpg' },
  { name: 'celebrate_apero', label: 'Accueil — « L’Apéro »', fallback: '/img/apero.jpg' },
  { name: 'visit_band', label: 'Accueil — bandeau « Venez nous voir »', fallback: '/img/ronde.jpg' },
  { name: 'homestay_hero', label: 'Page Homestay — grande photo', fallback: '/img/tatami2.jpg' },
  { name: 'homestay_room', label: 'Page Homestay — chambre tatami', fallback: '/img/tatami2.jpg' },
  { name: 'homestay_meal1', label: 'Page Homestay — repas / cuisine 1', fallback: '/img/kitchen.jpg' },
  { name: 'homestay_meal2', label: 'Page Homestay — repas / cuisine 2', fallback: '/img/dinner.jpg' },
  { name: 'travel_france', label: 'Page Homestay — France', fallback: '/img/bordeaux.jpg' },
  { name: 'travel_bali', label: 'Page Homestay — Bali', fallback: '/img/balipool.jpg' },
  { name: 'travel_vietnam', label: 'Page Homestay — Vietnam', fallback: '' },
  { name: 'travel_okinawa', label: 'Page Homestay — Okinawa', fallback: '' },
  { name: 'travel_tokyo', label: 'Page Homestay — Tokyo', fallback: '' },
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
