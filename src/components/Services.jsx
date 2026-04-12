import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import servicesData from '../data/services.json';
import { useReveal } from './useReveal';
import './Services.css';

export default function Services() {
  const { lang, t } = useLang();
  const [openId, setOpenId] = useState(null);
  const ref = useReveal();

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section id="services" ref={ref}>
      <div className="container">
        <span className="tag">{t('activities.tag') === 'OUR APPROACH' ? 'PROGRAMS' : 'PROGRAMS'}</span>
        <h2 className="sec-title">Our Services</h2>
        <div className="bar" />
        <div className="services-grid">
          {servicesData.map((srv, i) => {
            const body = srv.body[lang];
            const isOpen = openId === srv.id;
            return (
              <div
                key={srv.id}
                className={`srv-card ${isOpen ? 'open' : ''} ${srv.fullWidth ? 'full-width' : ''} reveal ${i % 2 === 1 ? 'reveal-d1' : ''}`}
                onClick={() => toggle(srv.id)}
              >
                <div className="srv-head">
                  <div className="srv-head-left">
                    <div className="srv-icon" style={{ background: srv.iconBg }}>
                      {srv.icon}
                    </div>
                    <span className="srv-title">{srv.title}</span>
                  </div>
                  <div className="srv-toggle">+</div>
                </div>
                <div className="srv-body">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
