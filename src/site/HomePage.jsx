import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useReveal } from '../components/useReveal';
import Seo from '../components/Seo';
import Layout, { SmartLink } from './Layout';
import { home, common, form as formCopy, CONTACT } from './copy';
import { ContactForm, GoogleReviewsBlock, MapBlock, UpcomingEvents, InstagramSection, GallerySection, VideosSection } from './widgets';
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
            <Link to="/#contact" className="vs-btn vs-btn-light">{tx(common.bookTrial60)}</Link>
            <Link to="/#learn" className="vs-btn vs-btn-ghost-light">{tx(h.ctaAll)}</Link>
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

function Learn() {
  const { tx } = useLang();
  const l = home.learn;
  const img = useSiteImages();
  return (
    <section id="learn" className="vs-block" style={{ paddingTop: 0 }}>
      <div className="vs-wrap">
        <div className="vs-head reveal">
          <div>
            <div className="vs-label">{tx(l.label)}</div>
            <h2 className="vs-h2">{tx(l.title1)}<br />{tx(l.title2)}</h2>
          </div>
          <p className="vs-lead">{tx(l.intro)}</p>
        </div>
        <div className="vs-grid-4">
          {l.cards.map((c, i) => (
            <Link key={c.img} to="/#contact" className={`vs-card reveal`} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="vs-card-img"><img src={img(c.slot)} alt={tx(c.alt)} loading="lazy" /></div>
              <div className="vs-card-body">
                <div className="vs-card-label">{tx(c.label)}</div>
                <h3 className="vs-card-title">{tx(c.title)}</h3>
                <p className="vs-card-desc">{tx(c.desc)}</p>
                <div className="vs-card-foot"><span>{tx(c.price)}</span><span>{tx(common.learnMore)} ›</span></div>
              </div>
            </Link>
          ))}
        </div>
        <div className="vs-chips reveal">
          <span>{tx(l.alsoLabel)}</span>
          {l.also.map((a) => <Link key={a.en} to="/#contact" className="vs-chip">{tx(a)}</Link>)}
        </div>
      </div>
    </section>
  );
}

function Live() {
  const { tx } = useLang();
  const l = home.live;
  const img = useSiteImages();
  return (
    <section id="live" className="vs-dark vs-live">
      <div className="vs-wrap">
        <div className="vs-head vs-center reveal" style={{ justifyContent: 'center' }}>
          <div className="vs-center">
            <div className="vs-label">{tx(l.label)}</div>
            <h2 className="vs-h2">{tx(l.title1)}<br />{tx(l.title2)}</h2>
            <p className="vs-lead">{tx(l.intro)}</p>
          </div>
        </div>
        <div className="vs-grid-3">
          {l.cards.map((c, i) => (
            <SmartLink key={c.title.en} to={c.href} className="vs-photo-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <img src={img(c.slot)} alt={tx(c.alt)} loading="lazy" />
              <div className="vs-photo-card-body">
                <div className="vs-card-label">{tx(c.label)}</div>
                <h3 className="vs-card-title">{tx(c.title)}</h3>
                <p>{tx(c.desc)}</p>
                <span className="vs-more">{tx(common.learnMore)} ›</span>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function Celebrate() {
  const { tx } = useLang();
  const c = home.celebrate;
  const img = useSiteImages();
  return (
    <section id="celebrate" className="vs-block">
      <div className="vs-wrap">
        <div className="vs-head reveal">
          <div>
            <div className="vs-label">{tx(c.label)}</div>
            <h2 className="vs-h2">{tx(c.title1)}<br />{tx(c.title2)}</h2>
          </div>
          <p className="vs-lead">{tx(c.intro)}</p>
        </div>
        <div className="vs-grid-2">
          <Link to="/#contact" className="vs-duo reveal">
            <img src={img(c.events.slot)} alt={tx(c.events.alt)} loading="lazy" />
            <div className="vs-duo-body">
              <div className="vs-card-label">{tx(c.events.label)}</div>
              <h3 className="vs-card-title" style={{ fontSize: 28 }}>{tx(c.events.title)}</h3>
              <p>{tx(c.events.desc)}</p>
              <span className="vs-more">{tx(c.quote)} ›</span>
            </div>
          </Link>
          <Link to="/#contact" className="vs-duo vs-dark reveal" style={{ transitionDelay: '100ms' }}>
            <img src={img(c.apero.slot)} alt={tx(c.apero.alt)} loading="lazy" />
            <div className="vs-duo-body">
              <div className="vs-card-label">{tx(c.apero.label)}</div>
              <h3 className="vs-apero-title">L’Apéro</h3>
              <p>{tx(c.apero.desc)}</p>
              <span className="vs-more">{tx(c.quote)} ›</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FranchiseTeaser() {
  const { tx } = useLang();
  const f = home.franchise;
  return (
    <section id="franchise" className="vs-block">
      <div className="vs-wrap">
        <div className="vs-panel reveal">
          <div className="vs-panel-main">
            <div className="vs-label">{tx(f.label)}</div>
            <h2 className="vs-h3">{tx(f.title1)}<br />{tx(f.title2)}</h2>
            <p className="vs-lead" style={{ maxWidth: 640 }}>{tx(f.body)}</p>
          </div>
          <div className="vs-panel-side">
            <Link to="/franchise" className="vs-btn vs-btn-ink">{tx(f.cta1)}</Link>
            <Link to="/franchise#contact" className="vs-btn vs-btn-outline">{tx(f.cta2)}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Admissions() {
  const { tx } = useLang();
  const a = home.admissions;
  return (
    <section id="admissions" className="vs-block">
      <div className="vs-wrap">
        <div className="vs-admit reveal">
          <div className="vs-admit-main">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="vs-label">{tx(a.label)}</div>
              <h2 className="vs-h3">{tx(a.title)}</h2>
            </div>
            <ol className="vs-steps">
              {a.steps.map((s, i) => (
                <li key={s.t.en}>
                  <span className="vs-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <div><div className="vs-step-t">{tx(s.t)}</div><div className="vs-step-d">{tx(s.d)}</div></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="vs-tuition">
            <div className="vs-label">{tx(a.tuitionLabel)}</div>
            <div className="vs-rows">
              {a.tuition.map((r) => (
                <div key={r.l.en} className={r.accent ? 'is-accent' : undefined}><span>{tx(r.l)}</span><strong>{tx(r.v)}</strong></div>
              ))}
            </div>
            <Link to="/#contact" className="vs-btn vs-btn-wine">{tx(a.cta)}</Link>
          </div>
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

function Visit() {
  const { tx } = useLang();
  const v = home.visit;
  const img = useSiteImages();
  return (
    <section className="vs-visit">
      <img src={img('visit_band')} alt="" loading="lazy" />
      <div className="vs-visit-inner">
        <div className="vs-label">{tx(v.label)}</div>
        <h2 className="vs-h2" style={{ fontSize: 'clamp(38px, 4.8vw, 64px)' }}>{tx(v.title1)}<br />{tx(v.title2)}</h2>
        <p>{tx(common.address)}{'\u3000·\u3000'}{CONTACT.phone}</p>
        <div className="vs-hero-ctas" style={{ justifyContent: 'center' }}>
          <a href="#contact" className="vs-btn vs-btn-light">{tx(home.admissions.cta)}</a>
          <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line">{tx(common.chatLine)}</a>
          <a href="#map" className="vs-btn vs-btn-ghost-light">{tx(v.map)}</a>
        </div>
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
        <GoogleReviewsBlock />
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
        <Learn />
        <Live />
        <Celebrate />
        <FranchiseTeaser />
        <Admissions />
        <Hosts />
        <Upcoming />
        <GallerySection />
        <VideosSection />
        <InstagramSection />
        <Visit />
        <Contact />
      </div>
    </Layout>
  );
}
