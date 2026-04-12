import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import servicesData from '../data/services.json';
import './Services.css';

export default function Services() {
  const { lang } = useLang();
  const [openId, setOpenId] = useState(null);
  const [services, setServices] = useState(null);

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

  const toggle = (id) => {
    setOpenId(prev => prev === id ? null : id);
  };

  if (!services) return null;

  return (
    <section id="services">
      <div className="container">
        <span className="tag">PROGRAMS</span>
        <h2 className="sec-title">Our Services</h2>
        <div className="bar" />
        <div className="services-grid">
          {services.map((srv) => {
            const isOpen = openId === srv.id;
            const body = srv.fromDb ? null : srv.body?.[lang];

            return (
              <div
                key={srv.id}
                className={`srv-card ${isOpen ? 'open' : ''} ${!srv.fromDb && srv.fullWidth ? 'full-width' : ''}`}
              >
                <div className="srv-head" onClick={() => toggle(srv.id)}>
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
