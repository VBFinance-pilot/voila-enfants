import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import eventsStatic from '../data/events.json';
import { useReveal } from './useReveal';
import './News.css';

export default function News() {
  const { lang } = useLang();
  const [event, setEvent] = useState(null);
  const [ready, setReady] = useState(false);
  const ref = useReveal([ready]);

  useEffect(() => {
    (async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('events_items')
          .select('*')
          .eq('active', true)
          .order('order_index')
          .limit(1);

        if (error) {
          console.error('News: Supabase fetch error', error);
        }

        console.log('News: Supabase response', { data, error });

        if (data && data.length > 0) {
          const db = data[0];
          console.log('News: loaded event from Supabase', db);
          setEvent({ title: db.title, description: db.description, date: db.date, image_url: db.image_url, fromDb: true });
          setReady(true);
          return;
        }
      } catch (err) {
        console.error('News: Supabase exception', err);
      }

      // Fallback to static JSON
      console.log('News: falling back to static events.json');
      const active = eventsStatic.find((e) => e.active);
      if (active) setEvent({ ...active, fromDb: false });
      setReady(true);
    })();
  }, []);

  if (!ready || !event) return null;

  // DB events use flat fields; static events use lang-keyed objects
  if (event.fromDb) {
    return (
      <section id="news" ref={ref}>
        <div className="container">
          <div className="news-inner reveal">
            <div className="news-badge">{event.date || 'NEW'}</div>
            <div className="news-text">
              <h3>{event.title}</h3>
              {event.description && <p>{event.description}</p>}
            </div>
            {event.image_url && <div className="news-visual"><img src={event.image_url} alt="" style={{ maxHeight: 80, borderRadius: 8 }} /></div>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" ref={ref}>
      <div className="container">
        <div className="news-inner reveal">
          <div className="news-badge">{event.badge[lang]}</div>
          <div className="news-text">
            <h3>{event.title[lang]}</h3>
            <p>{event.body[lang]}</p>
          </div>
          <div className="news-visual">{event.visual}</div>
        </div>
      </div>
    </section>
  );
}
