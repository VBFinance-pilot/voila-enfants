import { useState, useEffect, useRef } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import servicesData from '../data/services.json';
import './Services.css';

export default function Services() {
  const { lang } = useLang();
  const [openId, setOpenId] = useState(null);
  const [services, setServices] = useState(null);
  const sectionRef = useRef(null);

  // Fetch from Supabase, fallback to static JSON if table empty
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('services_items')
          .select('*')
          .order('order_index');
        console.log('Services: Supabase response', { data, error });
        if (!error && data && data.length > 0) {
          console.log('Services: using', data.length, 'items from Supabase');
          setServices(data.map(srv => ({ ...srv, fromDb: true })));
          return;
        }
        if (error) console.error('Services: Supabase error', error);
        else console.log('Services: table empty (0 rows), using static fallback');
      } catch (err) {
        console.error('Services: fetch exception', err);
      }
      setServices(servicesData.map(srv => ({ ...srv, fromDb: false })));
    })();
  }, []);

  // Reveal animation — add srv-visible after DOM paint
  useEffect(() => {
    if (!services) return;
    const el = sectionRef.current;
    if (!el) return;

    // requestAnimationFrame ensures DOM is painted before we start observing
    const raf = requestAnimationFrame(() => {
      const cards = el.querySelectorAll('.srv-card:not(.srv-visible)');
      if (cards.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('srv-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      cards.forEach((c) => observer.observe(c));
    });
    return () => cancelAnimationFrame(raf);
  }, [services]);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  if (!services) return null;

  console.log('Services: rendering', services.length, 'items, source:', services[0]?.fromDb ? 'Supabase' : 'static');

  return (
    <section id="services" ref={sectionRef}>
      <div className="container">
        <span className="tag">PROGRAMS</span>
        <h2 className="sec-title">Our Services</h2>
        <div className="bar" />
        <div className="services-grid">
          {services.map((srv, i) => {
            const isOpen = openId === (srv.id || srv.id);
            const body = srv.fromDb ? null : srv.body?.[lang];

            return (
              <div
                key={srv.id}
                className={`srv-card srv-enter ${isOpen ? 'open' : ''} ${!srv.fromDb && srv.fullWidth ? 'full-width' : ''}`}
                style={{ transitionDelay: `${i * 0.07}s` }}
                onClick={() => toggle(srv.id)}
              >
                <div className="srv-head">
                  <div className="srv-head-left">
                    <div className="srv-icon" style={{ background: srv.fromDb ? (srv.icon_bg || '#FFF0F5') : srv.iconBg }}>
                      {srv.fromDb ? (srv.icon_emoji || '📚') : srv.icon}
                    </div>
                    <span className="srv-title">{srv.title}</span>
                  </div>
                  <div className="srv-toggle">+</div>
                </div>
                <div className="srv-body">
                  {srv.fromDb ? (
                    srv.description && <p dangerouslySetInnerHTML={{ __html: srv.description }} />
                  ) : body && (
                    <>
                      <p dangerouslySetInnerHTML={{ __html: body.description }} />
                      {body.highlights && (
                        <ul className="srv-list">
                          {body.highlights.map((h, j) => (
                            <li key={j}>
                              <span className="ic">{h.icon}</span>
                              <span dangerouslySetInnerHTML={{ __html: h.text }} />
                            </li>
                          ))}
                        </ul>
                      )}
                      {body.extra && (
                        <p style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: body.extra }} />
                      )}
                      {body.quote && (
                        <p style={{ marginTop: 10, fontStyle: 'italic', color: 'var(--primary)' }}>
                          {body.quote}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
