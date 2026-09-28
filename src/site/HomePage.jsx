import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from '../components/useReveal';
import Seo from '../components/Seo';
import Layout from './Layout';
import { home, common, form as formCopy, CONTACT, topicHref } from './copy';
import { ContactForm, GoogleReviewsBlock, MapBlock, UpcomingEvents, MomentsSection } from './widgets';
import { useSiteImages } from './siteImages';

function Hero() {
  const { tx } = useLang();
  const h = home.hero;
  const img = useSiteImages();
  return (
    <section className="vs-hero" id="top">
      <img src={img('home_hero')} alt="" fetchPriority="high" />
      <div className="vs-wrap vs-hero-inner">
        <div className="vs-hero-copy">
          <h1 className="sr-only">{tx(h.h1seo)}</h1>
          <div className="vs-label">{tx(h.eyebrow)}</div>
          <p className="vs-display" aria-hidden="true">{tx(h.title1)}<br />{tx(h.title2)}</p>
          <p>{tx(h.sub)}</p>
          <div className="vs-hero-ctas">
            <Link to={topicHref('trial')} className="vs-btn vs-btn-light">{tx(common.bookTrial60)}</Link>
            <a href="#universes" className="vs-btn vs-btn-ghost-light">{tx(h.ctaAll)}</a>
          </div>
        </div>
        <div className="vs-scroll" aria-hidden="true">{tx(h.scroll)}<span /></div>
      </div>
    </section>
  );
}

function Philosophy() {
  const { tx } = useLang();
  const p = home.philosophy;
  return (
    <section className="vs-philo">
      <div className="vs-wrap">
        <div className="vs-label reveal">{tx(p.label)}</div>
        <p className="vs-motto reveal">{tx(p.motto)}</p>
        <p className="vs-philo-sub reveal">{tx(p.sub)}</p>
        <p className="vs-lead reveal">{tx(p.body)}</p>
        <div className="vs-values reveal">{p.values.map((v) => <span key={v.en}>{tx(v)}</span>)}</div>
      </div>
      <div className="vs-wrap" style={{ marginTop: 'clamp(56px, 7vw, 100px)' }}>
        <div className="vs-facts reveal">
          {home.facts.map((f) => (
            <div key={f.value}>
              <div className="vs-fact-num">{f.value}</div>
              <div className="vs-fact-txt">{tx(f.label)}<br />{tx(f.sub)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ROMAN = ['I', 'II', 'III'];

function Universes() {
  const { tx } = useLang();
  const u = home.universes;
  const img = useSiteImages();
  return (
    <section id="universes" className="vs-block" style={{ paddingTop: 0 }}>
      <div className="vs-wrap">
        <div className="vs-head reveal">
          <div>
            <div className="vs-label">{tx(u.label)}</div>
            <h2 className="vs-h2">{tx(u.title1)}<br />{tx(u.title2)}</h2>
          </div>
        </div>
        <div className="vs-universes">
          {u.items.map((it, i) => (
            <Link key={it.key} to={it.href} className="vs-universe reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <img src={img(it.slot)} alt="" loading="lazy" />
              <div className="vs-universe-body">
                <div className="vs-universe-num">{ROMAN[i]}</div>
                <h3 className="vs-universe-name">
                  <span className="vs-universe-brand">{tx(it.name).split(' ')[0]}</span>
                  <span className="vs-universe-word">{tx(it.name).split(' ').slice(1).join(' ')}</span>
                </h3>
                <p>{tx(it.line)}</p>
                <ul>{it.list.map((l) => <li key={l.en}>{tx(l)}</li>)}</ul>
                <span className="vs-more">{tx(u.discover)} ›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATIC_FOUNDERS = [
  { name: 'Victor', photo: '/victor.jpg' },
  { name: 'Maria', photo: '/maria.jpg' },
];

function Hosts() {
  const { tx } = useLang();
  const h = home.hosts;
  const [founders, setFounders] = useState(STATIC_FOUNDERS);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('founders_items').select('*').order('order_index');
      if (data?.length) setFounders(data.map((f) => ({ name: f.name, photo: f.image_url || '' })));
    })();
  }, []);
  const [a, b] = founders;
  return (
    <section id="hosts" className="vs-block">
      <div className="vs-wrap">
        <div className="vs-hosts">
          <div className="vs-hosts-photos reveal">
            {a?.photo && <img src={a.photo} alt={a.name} loading="lazy" />}
            {b?.photo && <img src={b.photo} alt={b.name} loading="lazy" />}
          </div>
          <div className="vs-hosts-copy reveal">
            <div className="vs-label">{tx(h.label)}</div>
            <h2 className="vs-hosts-name"><em>{a?.name || 'Victor'}</em> &amp; <em>{b?.name || 'Maria'}</em></h2>
            <p className="vs-hosts-lead">{tx(h.lead)}</p>
            <p className="vs-lead">{tx(h.body)}</p>
          </div>
        </div>
        <GoogleReviewsBlock />
      </div>
    </section>
  );
}

function Upcoming() {
  const { tx } = useLang();
  const u = home.upcoming;
  return (
    <section id="events" className="vs-block">
      <div className="vs-wrap" style={{ gap: 36 }}>
        <div className="vs-head">
          <div>
            <div className="vs-label">{tx(u.label)}</div>
            <h2 className="vs-h3">{tx(u.title)}</h2>
          </div>
        </div>
        <UpcomingEvents />
      </div>
    </section>
  );
}

function Contact() {
  const { tx } = useLang();
  const c = home.contact;
  return (
    <section id="contact" className="vs-contact">
      <div className="vs-wrap">
        <div className="vs-head">
          <div>
            <div className="vs-label">{tx(c.label)}</div>
            <h2 className="vs-contact-title">{tx(c.title)}</h2>
          </div>
          <p className="vs-lead">{tx(c.sub)}</p>
        </div>
        <div className="vs-grid-2">
          <div className="vs-box vs-info">
            <div className="vs-info-row"><div className="vs-info-k">{tx(c.addressL)}</div><div className="vs-info-v">{tx(common.address)}</div></div>
            <div className="vs-info-row"><div className="vs-info-k">{tx(c.phoneL)}</div><div className="vs-info-v"><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div></div>
            <div className="vs-info-row"><div className="vs-info-k">{tx(c.emailL)}</div><div className="vs-info-v"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div></div>
            <div className="vs-info-row">
              <div className="vs-info-k">LINE</div>
              <div className="vs-line-row">
                <img src="/qr-line.png" alt={tx(c.qrAlt)} loading="lazy" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span className="vs-lead" style={{ fontSize: 14 }}>{tx(c.lineSub)}</span>
                  <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line" style={{ minHeight: 46 }}>{tx(c.lineBtn)}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="vs-box">
            <ContactForm title={tx(formCopy.title)} subject="Contact" />
          </div>
        </div>
        <div id="map"><MapBlock /></div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const ref = useReveal();
  return (
    <Layout>
      <Seo page="home" path="/" />
      <div ref={ref}>
        <Hero />
        <Philosophy />
        <Universes />
        <Hosts />
        <MomentsSection />
        <Upcoming />
        <Contact />
      </div>
    </Layout>
  );
}
