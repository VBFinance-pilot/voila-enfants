import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from '../components/useReveal';
import Seo from '../components/Seo';
import Layout from './Layout';
import { home, common, CONTACT, VOILA_CHEF_URL, topicHref } from './copy';
import { learnPage as L, celebratePage as P } from './copy-pages';
import { ContactForm } from './widgets';
import { useSiteImages } from './siteImages';
import { PageHero, Label } from './SubPages';

function Steps({ label, title, items, dark }) {
  const { tx } = useLang();
  return (
    <section className={dark ? 'vs-dark vs-live' : 'vs-block'}>
      <div className="vs-wrap">
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Label>{tx(label)}</Label>
          <h2 className="vs-h3">{tx(title)}</h2>
        </div>
        <div className="vs-cols reveal" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((s, i) => <div key={s.t.en}><b>{String(i + 1).padStart(2, '0')}</b><strong style={{ fontFamily: 'var(--sans)', fontSize: 18 }}>{tx(s.t)}</strong><p>{tx(s.d)}</p></div>)}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Learn ───────────── */
export function LearnPage() {
  const { tx } = useLang();
  const ref = useReveal();
  const img = useSiteImages();
  const l = home.learn;
  const a = home.admissions;
  return (
    <Layout>
      <Seo page="learn" path="/learn" />
      <div ref={ref}>
        <PageHero img={img('learn_hero')} imgProps={img.props('learn_hero')} crumb={L.crumb} eyebrow={L.eyebrow} lines={[l.title1, l.title2]} sub={l.intro}>
          <Link to={topicHref('trial', '/learn', 'apply')} className="vs-btn vs-btn-light">{tx(common.bookTrial60)}</Link>
          <a href="#tuition" className="vs-btn vs-btn-ghost-light">{tx(L.ctaPrices)}</a>
        </PageHero>
        <nav className="vs-subnav" aria-label={tx(L.crumb)}>
          <div className="vs-wrap">
            <strong>{tx(L.crumb)}</strong>
            {L.subnav.map((s) => <a key={s.href} href={s.href}>{tx(s.l)}</a>)}
          </div>
        </nav>

        <section className="vs-block">
          <div className="vs-wrap">
            <div className="vs-prog-list">
              {l.cards.map((c) => {
                const p = L.programmes[c.slot];
                return (
                  <article key={c.slot} id={p.id} className="vs-prog">
                    <div className="vs-prog-img reveal"><img src={img(c.slot)} alt={tx(c.alt)} loading="lazy" {...img.props(c.slot)} /></div>
                    <div className="vs-prog-copy reveal">
                      <Label>{tx(c.label)}</Label>
                      <h2 className="vs-h3">{tx(c.title)}</h2>
                      <p className="vs-lead">{tx(c.desc)}</p>
                      <ul>{p.points.map((pt) => <li key={pt.en}>{tx(pt)}</li>)}</ul>
                      <div className="vs-prog-price">{tx(c.price)}</div>
                      <Link to={topicHref(c.slot, '/learn', 'apply')} className="vs-btn vs-btn-wine" style={{ alignSelf: 'flex-start' }}>{tx(L.ask)}</Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="vs-chips reveal">
              <span>{tx(l.alsoLabel)}</span>
              {l.also.map((x, i) => <Link key={x.en} to={topicHref(`also_${i}`, '/learn', 'apply')} className="vs-chip">{tx(x)}</Link>)}
            </div>
          </div>
        </section>

        <section id="tuition" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-admit reveal">
              <div className="vs-admit-main">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Label>{tx(a.label)}</Label>
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
                <Label>{tx(a.tuitionLabel)}</Label>
                <div className="vs-rows">
                  {a.tuition.filter((r) => !['Homestay', 'Events · L’Apéro'].includes(r.l.en)).map((r) => (
                    <div key={r.l.en} className={r.accent ? 'is-accent' : undefined}><span>{tx(r.l)}</span><strong>{tx(r.v)}</strong></div>
                  ))}
                </div>
                <Link to={topicHref('trial', '/learn', 'apply')} className="vs-btn vs-btn-wine">{tx(a.cta)}</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="apply" className="vs-contact">
          <div className="vs-wrap">
            <div className="vs-split">
              <div>
                <Label>{tx(L.apply.label)}</Label>
                <h2 className="vs-h3">{tx(L.apply.title1)}<br />{tx(L.apply.title2)}</h2>
                <p className="vs-lead">{tx(L.apply.body)}</p>
                <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line" style={{ alignSelf: 'flex-start' }}>{tx(common.chatLine)}</a>
              </div>
              <div className="vs-box">
                <ContactForm
                  subject="Learn"
                  defaultTopic="trial"
                  extra={[{ name: 'age', label: L.apply.fields.age }]}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

/* ───────────── Celebrate ───────────── */
export function CelebratePage() {
  const { tx } = useLang();
  const ref = useReveal();
  const img = useSiteImages();
  const c = home.celebrate;
  return (
    <Layout>
      <Seo page="celebrate" path="/celebrate" />
      <div ref={ref}>
        <PageHero img={img('celebrate_hero')} imgProps={img.props('celebrate_hero')} crumb={P.crumb} eyebrow={P.eyebrow} lines={[c.title1, c.title2]} sub={c.intro}>
          <Link to={topicHref('celebrate_events', '/celebrate', 'apply')} className="vs-btn vs-btn-light">{tx(P.ctaQuote)}</Link>
          <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-ghost-light">{tx(common.chatLine)}</a>
        </PageHero>

        <section id="events" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-chapter reveal"><b>I</b><Label>{tx(P.events.label)}</Label></div>
            <div className="vs-prog">
              <div className="vs-prog-img reveal"><img src={img('celebrate_events')} alt={tx(c.events.alt)} loading="lazy" {...img.props('celebrate_events')} /></div>
              <div className="vs-prog-copy reveal">
                <h2 className="vs-h3">{tx(c.events.title)}</h2>
                <p className="vs-lead">{tx(c.events.desc)}</p>
                <div className="vs-numbered">
                  {P.events.items.map((it, i) => (
                    <div key={it.t.en}><em>{String(i + 1).padStart(2, '0')}</em><div><strong>{tx(it.t)}</strong><span>{tx(it.d)}</span></div></div>
                  ))}
                </div>
                <Link to={topicHref('celebrate_events', '/celebrate', 'apply')} className="vs-btn vs-btn-wine" style={{ alignSelf: 'flex-start' }}>{tx(c.quote)}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Voilà chef is a separate site: short card + outbound link, no internal page. */}
        <section id="voila-chef" className="vs-dark vs-live">
          <div className="vs-wrap">
            <div className="vs-chapter reveal"><b>II</b><Label>{tx(P.chef.label)}</Label></div>
            <div className="vs-prog">
              <div className="vs-prog-img reveal"><img src={img(c.chef.slot)} alt={tx(c.chef.alt)} loading="lazy" {...img.props(c.chef.slot)} /></div>
              <div className="vs-prog-copy reveal">
                <h2 className="vs-chef-title">Voilà chef</h2>
                <p className="vs-lead">{tx(c.chef.desc)}</p>
                <a href={VOILA_CHEF_URL} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-light" style={{ alignSelf: 'flex-start' }}>{tx(c.chef.cta)}</a>
              </div>
            </div>
          </div>
        </section>

        <Steps label={P.steps.label} title={P.steps.title} items={P.steps.items} />

        <section id="apply" className="vs-contact">
          <div className="vs-wrap">
            <div className="vs-split">
              <div>
                <Label>{tx(P.apply.label)}</Label>
                <h2 className="vs-h3">{tx(P.apply.title1)}<br />{tx(P.apply.title2)}</h2>
                <p className="vs-lead">{tx(P.apply.body)}</p>
                <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line" style={{ alignSelf: 'flex-start' }}>{tx(common.chatLine)}</a>
              </div>
              <div className="vs-box">
                <ContactForm
                  subject="Celebrate"
                  placeholder={P.apply.placeholder}
                  extra={[
                    { name: 'date', label: P.apply.fields.date },
                    { name: 'guests', label: P.apply.fields.guests },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
