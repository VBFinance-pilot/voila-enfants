import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from '../components/useReveal';
import Seo from '../components/Seo';
import Layout from './Layout';
import { common, CONTACT } from './copy';
import { homestay as H, franchise as F, careers as C } from './copy-pages';
import { ContactForm } from './widgets';
import { useSiteImages } from './siteImages';

const home = { ja: 'ホーム', en: 'Home', fr: 'Accueil' };

function PageHero({ img, crumb, eyebrow, lines, sub, children }) {
  const { tx } = useLang();
  return (
    <section className="vs-page-hero">
      <img src={img} alt="" fetchPriority="high" />
      <div className="vs-wrap">
        <div className="vs-crumb"><Link to="/">{tx(home)}</Link>{'\u3000›\u3000'}{tx(crumb)}</div>
        <div className="vs-label">{tx(eyebrow)}</div>
        <h1 className="vs-display" style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.18 }}>
          {lines.map((l, i) => <span key={i}>{tx(l)}{i < lines.length - 1 && <br />}</span>)}
        </h1>
        <p>{tx(sub)}</p>
        <div className="vs-hero-ctas">{children}</div>
      </div>
    </section>
  );
}

function Label({ children }) {
  return <div className="vs-label">{children}</div>;
}

/* ───────────── Homestay ───────────── */
export function HomestayPage() {
  const { tx } = useLang();
  const ref = useReveal();
  const img = useSiteImages();
  return (
    <Layout>
      <Seo page="homestay" path="/homestay" />
      <div ref={ref}>
        <PageHero img={img('homestay_hero')} crumb={H.crumb} eyebrow={H.eyebrow} lines={[H.title1, H.title2]} sub={H.sub}>
          <a href="#apply" className="vs-btn vs-btn-light">{tx(H.ctaBook)}</a>
          <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-ghost-light">{tx(H.ctaLine)}</a>
        </PageHero>
        <nav className="vs-subnav" aria-label="Homestay">
          <div className="vs-wrap">
            <strong>{tx(H.crumb)}</strong>
            {H.subnav.map((s) => <a key={s.href} href={s.href}>{tx(s.l)}</a>)}
          </div>
        </nav>

        <section id="glance" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-split reveal">
              <div>
                <Label>{tx(H.glance.label)}</Label>
                <h2 className="vs-h3">{tx(H.glance.title1)}<br />{tx(H.glance.title2)}</h2>
                <p className="vs-lead">{tx(H.glance.body)}</p>
              </div>
              <div className="vs-rows" style={{ alignSelf: 'center' }}>
                {H.glance.rows.map((r) => <div key={r.l.en}><span style={{ color: 'var(--muted)' }}>{tx(r.l)}</span><strong>{tx(r.v)}</strong></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="kyoto" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-chapter reveal"><b>I</b><Label>{tx(H.kyoto.label)}</Label></div>
            <div className="vs-split">
              <div className="vs-mosaic reveal" style={{ width: 'min(720px, 52%)' }}>
                <img src={img('homestay_room')} alt={tx({ ja: '和室', en: 'Tatami room', fr: 'Chambre en tatami' })} loading="lazy" />
                <img src={img('homestay_meal1')} alt={tx({ ja: 'みんなで料理とおやつの時間', en: 'Cooking and snack time together', fr: 'Cuisine et goûter ensemble' })} loading="lazy" />
                <img src={img('homestay_meal2')} alt={tx({ ja: '家族で囲む食卓', en: 'Family dinner table', fr: 'Repas en famille' })} loading="lazy" />
              </div>
              <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="vs-h3">{tx(H.kyoto.title1)}<br />{tx(H.kyoto.title2)}</h2>
                <p className="vs-lead">{tx(H.kyoto.body)}</p>
                <div className="vs-numbered">
                  {H.kyoto.items.map((it, i) => (
                    <div key={it.t.en}><em>{String(i + 1).padStart(2, '0')}</em><div><strong>{tx(it.t)}</strong><span>{tx(it.d)}</span></div></div>
                  ))}
                </div>
                <div className="vs-plans">
                  {H.plans.map((p) => <div key={p.name} className="vs-plan"><b>{p.name}</b><strong>{tx(p.price)}</strong><span>{tx(p.d)}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="travel" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-chapter reveal"><b>II</b><Label>{tx(H.travel.label)}</Label></div>
            <div className="vs-head reveal">
              <div><h2 className="vs-h3">{tx(H.travel.title1)}<br />{tx(H.travel.title2)}</h2></div>
              <p className="vs-lead" style={{ maxWidth: 520 }}>{tx(H.travel.body)}</p>
            </div>
            <div className="vs-places">
              {H.travel.places.map((p) => {
                const src = img(`travel_${p.name.toLowerCase()}`);
                return (
                <div key={p.name} className="vs-place reveal">
                  <div className="vs-place-img">{src ? <img src={src} alt={p.name} loading="lazy" /> : <span>{p.name}</span>}</div>
                  <b>{p.name}</b><small>{tx(p.sub)}</small>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="care" className="vs-dark vs-live">
          <div className="vs-wrap">
            <div className="vs-head vs-center reveal" style={{ justifyContent: 'center' }}>
              <div className="vs-center">
                <Label>{tx(H.care.label)}</Label>
                <h2 className="vs-h2">{tx(H.care.title1)}<br />{tx(H.care.title2)}</h2>
              </div>
            </div>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {H.care.items.map((it, i) => (
                <div key={it.t.en}><b>{['I', 'II', 'III', 'IV'][i]}</b><strong>{tx(it.t)}</strong><p>{tx(it.d)}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="vs-block">
          <div className="vs-wrap">
            <h2 className="vs-h3 reveal">{tx(H.moments)}</h2>
            <div className="vs-grid-4">
              {['camp', 'dinner', 'kitchen', 'sunset'].map((n) => (
                <img key={n} src={`/img/${n}.jpg`} alt="" loading="lazy" className="reveal" style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 28 }} />
              ))}
            </div>
          </div>
        </section>

        <section id="steps" className="vs-block">
          <div className="vs-wrap">
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Label>{tx(H.steps.label)}</Label>
              <h2 className="vs-h3">{tx(H.steps.title)}</h2>
            </div>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {H.steps.items.map((s, i) => <div key={s.t.en}><b>{String(i + 1).padStart(2, '0')}</b><strong>{tx(s.t)}</strong><p>{tx(s.d)}</p></div>)}
            </div>
          </div>
        </section>

        <section id="faq" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-split">
              <div><h2 className="vs-h3">{tx(H.faq.title)}</h2></div>
              <div className="vs-faq">
                {H.faq.items.map((f) => (
                  <details key={f.q.en}><summary>{tx(f.q)}</summary><p>{tx(f.a)}</p></details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="apply" className="vs-contact">
          <div className="vs-wrap">
            <div className="vs-split">
              <div>
                <Label>{tx(H.cta.label)}</Label>
                <h2 className="vs-h3">{tx(H.cta.title1)}<br />{tx(H.cta.title2)}</h2>
                <p className="vs-lead">{tx(H.cta.body)}</p>
                <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line" style={{ alignSelf: 'flex-start' }}>{tx(H.ctaLine)}</a>
              </div>
              <div className="vs-box">
                <ContactForm
                  subject="Homestay"
                  defaultTopic="homestay"
                  extra={[
                    { name: 'plan', label: { ja: 'プラン', en: 'Plan', fr: 'Formule' }, options: [{ ja: 'Family Stay', en: 'Family Stay', fr: 'Family Stay' }, { ja: 'Full Immersion', en: 'Full Immersion', fr: 'Full Immersion' }, { ja: '旅するホームステイ', en: 'Travelling Homestay', fr: 'Homestay en voyage' }, { ja: '未定', en: 'Not sure yet', fr: 'Je ne sais pas encore' }] },
                    { name: 'dates', label: { ja: 'ご希望の時期・期間', en: 'Preferred dates / length', fr: 'Dates / durée souhaitées' } },
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

/* ───────────── Franchise ───────────── */
export function FranchisePage() {
  const { tx } = useLang();
  const ref = useReveal();
  const img = useSiteImages();
  return (
    <Layout>
      <Seo page="franchise" path="/franchise" />
      <div ref={ref}>
        <PageHero img={img('franchise_hero')} crumb={F.crumb} eyebrow={F.eyebrow} lines={[F.title1, F.title2]} sub={F.sub}>
          <a href="#contact" className="vs-btn vs-btn-light">{tx(F.ctaContact)}</a>
          <a href="#journey" className="vs-btn vs-btn-ghost-light">{tx(F.ctaJourney)}</a>
        </PageHero>

        <section className="vs-block">
          <div className="vs-wrap">
            <div className="vs-head reveal">
              <div><Label>{tx(F.why.label)}</Label><h2 className="vs-h2">{tx(F.why.title1)}<br />{tx(F.why.title2)}</h2></div>
              <p className="vs-lead">{tx(F.why.body)}</p>
            </div>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {F.why.items.map((it, i) => <div key={it.t.en}><b>{['I', 'II', 'III', 'IV'][i]}</b><strong>{tx(it.t)}</strong><p>{tx(it.d)}</p></div>)}
            </div>
          </div>
        </section>

        <section className="vs-block">
          <div className="vs-wrap">
            <div className="vs-admit reveal">
              <div style={{ width: 'min(440px, 100%)', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
                <Label>{tx(F.provide.label)}</Label>
                <h2 className="vs-h3">{tx(F.provide.title1)}<br />{tx(F.provide.title2)}</h2>
                <p className="vs-lead">{tx(F.provide.body)}</p>
              </div>
              <div className="vs-grid-2" style={{ flex: 1, gap: '0 40px' }}>
                {F.provide.items.map((it) => (
                  <div key={it.t.en} style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
                    <strong>{tx(it.t)}</strong><div style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{tx(it.d)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="vs-dark vs-live">
          <div className="vs-wrap">
            <div className="vs-head vs-center reveal" style={{ justifyContent: 'center' }}>
              <div className="vs-center"><Label>{tx(F.journey.label)}</Label><h2 className="vs-h2">{tx(F.journey.title1)}<br />{tx(F.journey.title2)}</h2></div>
            </div>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
              {F.journey.steps.map((s, i) => <div key={s.t.en} style={{ paddingLeft: i ? 20 : 0, paddingRight: 20 }}><b>{String(i + 1).padStart(2, '0')}</b><strong style={{ fontFamily: 'var(--sans)', fontSize: 17 }}>{tx(s.t)}</strong><p>{tx(s.d)}</p></div>)}
            </div>
          </div>
        </section>

        <section className="vs-block">
          <div className="vs-wrap">
            <div className="vs-split">
              <div className="reveal">
                <Label>{tx(F.terms.label)}</Label>
                <h2 className="vs-h3">{tx(F.terms.title)}</h2>
                <div className="vs-rows">
                  {F.terms.rows.map((r) => <div key={r.en}><span style={{ color: 'var(--muted)' }}>{tx(r)}</span><strong style={{ color: 'var(--brass)', fontWeight: 600 }}>{tx(F.terms.value)}</strong></div>)}
                </div>
              </div>
              <div className="reveal" style={{ background: 'var(--stone)', borderRadius: 36, padding: 'clamp(28px, 4vw, 56px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Label>{tx(F.profile.label)}</Label>
                <h2 className="vs-card-title" style={{ fontSize: 30 }}>{tx(F.profile.title)}</h2>
                <div className="vs-rows">{F.profile.items.map((p) => <div key={p.en}><span>{tx(p)}</span></div>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="vs-contact">
          <div className="vs-wrap">
            <div className="vs-box vs-split">
              <div>
                <Label>{tx(F.contact.label)}</Label>
                <h2 className="vs-h3">{tx(F.contact.title1)}<br />{tx(F.contact.title2)}</h2>
                <p className="vs-lead">{tx(F.contact.body)}</p>
                <a href={CONTACT.line} target="_blank" rel="noopener noreferrer" className="vs-btn vs-btn-line" style={{ alignSelf: 'flex-start' }}>{tx(common.chatLine)}</a>
              </div>
              <ContactForm
                subject={F.contact.subject}
                defaultTopic="franchise"
                extra={[
                  { name: 'country', label: F.contact.fields.country },
                  { name: 'city', label: F.contact.fields.city },
                  { name: 'language', label: F.contact.fields.language, placeholder: F.contact.fields.languagePh, wide: true },
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

/* ───────────── Careers ───────────── */
export function CareersPage() {
  const { tx } = useLang();
  const ref = useReveal();
  const img = useSiteImages();
  return (
    <Layout>
      <Seo page="careers" path="/careers" />
      <div ref={ref}>
        <PageHero img={img('careers_hero')} crumb={C.crumb} eyebrow={C.eyebrow} lines={[C.title1, C.title2, C.title3]} sub={C.sub}>
          <a href="#roles" className="vs-btn vs-btn-light">{tx(C.ctaRoles)}</a>
          <a href="#apply" className="vs-btn vs-btn-ghost-light">{tx(C.ctaApply)}</a>
        </PageHero>

        <section className="vs-block">
          <div className="vs-wrap">
            <Label>{tx(C.values.label)}</Label>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              {C.values.items.map((v) => (
                <div key={v.t}><span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 34 }}>{v.t}</span><p>{tx(v.d)}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="vs-block">
          <div className="vs-wrap">
            <div className="vs-head reveal">
              <div><Label>{tx(C.roles.label)}</Label><h2 className="vs-h3">{tx(C.roles.title)}</h2></div>
              <p className="vs-lead" style={{ fontSize: 14 }}>{tx(C.roles.location)}</p>
            </div>
            <div className="vs-roles">
              {C.roles.items.map((r) => (
                <a key={r.t.en} href="#apply" className="vs-role reveal">
                  <b>{tx(r.t)}</b><span>{tx(r.d)}</span><em>{tx(r.c)}</em><i>{tx(C.roles.apply)} ›</i>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="vs-dark vs-live">
          <div className="vs-wrap">
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Label>{tx(C.process.label)}</Label>
              <h2 className="vs-h3">{tx(C.process.title)}</h2>
            </div>
            <div className="vs-cols reveal" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {C.process.steps.map((s, i) => <div key={s.t.en}><b>{String(i + 1).padStart(2, '0')}</b><strong style={{ fontFamily: 'var(--sans)', fontSize: 18 }}>{tx(s.t)}</strong><p>{tx(s.d)}</p></div>)}
            </div>
          </div>
        </section>

        <section id="apply" className="vs-contact">
          <div className="vs-wrap">
            <div className="vs-box vs-split">
              <div>
                <Label>{tx(C.apply.label)}</Label>
                <h2 className="vs-h3">{tx(C.apply.title1)}<br />{tx(C.apply.title2)}</h2>
                <p className="vs-lead">{tx(C.apply.body)}</p>
              </div>
              <ContactForm
                subject={C.apply.subject}
                defaultTopic="careers"
                extra={[
                  { name: 'position', label: C.apply.fields.position, options: C.roles.items.map((r) => r.t) },
                  { name: 'languages', label: C.apply.fields.languages, placeholder: C.apply.fields.languagesPh },
                  { name: 'start', label: C.apply.fields.start },
                  { name: 'cv', label: C.apply.fields.cv, type: 'url' },
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
