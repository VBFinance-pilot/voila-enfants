import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang, LANGS } from '../contexts/LanguageContext';
import { nav, common, footer, home, CONTACT, topicHref } from './copy';
import { learnPage, homestay } from './copy-pages';
import './site.css';

const LANG_LABEL = { ja: 'JA', en: 'EN', fr: 'FR' };

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="vs-langs" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

// Internal link that understands "/#anchor" targets.
export function SmartLink({ to, children, ...rest }) {
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    const external = to.startsWith('http');
    return (
      <a href={to} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return <Link to={to} {...rest}>{children}</Link>;
}

function Header() {
  const { tx } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="vs-util">
        <div className="vs-wrap">
          <div className="vs-addr">{tx(common.addressShort)}{'\u3000·\u3000'}<a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div>
          <div className="vs-util-links">
            {nav.util.map((i) => <SmartLink key={i.href} to={i.href}>{tx(i.label)}</SmartLink>)}
            <a href={CONTACT.line} target="_blank" rel="noopener noreferrer">LINE</a>
            <LangSwitch />
          </div>
        </div>
      </div>
      <header className="vs-header">
        <div className="vs-wrap">
          <Link to="/" className="vs-brand" aria-label="Voilà les enfants — home">
            <img src="/brand/logo.png" alt="Voilà les enfants" width="120" height="68" />
            <span className="vs-brand-sep" aria-hidden="true" />
            <span className="vs-brand-tag">ACTIVITY LANGUAGE<br />SCHOOL · KYOTO</span>
          </Link>
          <nav className="vs-nav" aria-label="Main">
            {nav.main.map((i) => (
              <SmartLink key={i.href} to={i.href} aria-current={pathname !== '/' && pathname === i.href ? 'page' : undefined}>
                {tx(i.label)}
              </SmartLink>
            ))}
          </nav>
          <Link to={topicHref('trial')} className="vs-btn vs-btn-wine vs-header-cta">{tx(common.bookTrial)}</Link>
          <button type="button" className="vs-burger" aria-label={tx(common.menu)} aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 9h16M4 15h16" /></svg>
          </button>
        </div>
      </header>
      {open && (
        <div className="vs vs-drawer" role="dialog" aria-modal="true" aria-label={tx(common.menu)}>
          <div className="vs-drawer-top">
            <img src="/brand/logo.png" alt="Voilà les enfants" />
            <button type="button" className="vs-burger" style={{ display: 'inline-flex' }} aria-label={tx(common.close)} onClick={() => setOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {[...nav.main, ...nav.util.filter((u) => !nav.main.some((m) => m.href === u.href))].map((i) => (
            <SmartLink key={i.href} to={i.href} className="vs-drawer-link" onClick={() => setOpen(false)}>{tx(i.label)}</SmartLink>
          ))}
          <LangSwitch />
          <Link to={topicHref('trial')} className="vs-btn vs-btn-wine" onClick={() => setOpen(false)}>{tx(common.bookTrial)}</Link>
          <a href={CONTACT.line} className="vs-btn vs-btn-line" target="_blank" rel="noopener noreferrer">{tx(common.chatLine)}</a>
        </div>
      )}
    </>
  );
}

function Footer() {
  const { tx } = useLang();
  return (
    <footer className="vs-footer">
      <div className="vs-wrap">
        <div className="vs-footer-grid">
          <div className="vs-footer-col">
            <div className="vs-footer-brand">
              <img src="/brand/logo-white.png" alt="Voilà les enfants" />
              <span>ACTIVITY LANGUAGE<br />SCHOOL · KYOTO</span>
            </div>
            <div>{tx(common.address)}</div>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <div style={{ display: 'flex', gap: 18 }}>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={CONTACT.line} target="_blank" rel="noopener noreferrer">LINE</a>
            </div>
          </div>
          <div className="vs-footer-col">
            <h4><Link to="/learn">{tx(footer.learn)}</Link></h4>
            {learnPage.subnav.map((s) => <Link key={s.href} to={`/learn${s.href}`}>{tx(s.l)}</Link>)}
          </div>
          <div className="vs-footer-col">
            <h4>{tx(footer.live)}</h4>
            {homestay.subnav.filter((s) => ['#kyoto', '#travel', '#camp'].includes(s.href)).map((s) => <Link key={s.href} to={`/live${s.href}`}>{tx(s.l)}</Link>)}
            <Link to="/celebrate#events">{tx(home.celebrate.events.title)}</Link>
            <Link to="/celebrate#apero">L’Apéro</Link>
          </div>
          <div className="vs-footer-col">
            <h4>{tx(footer.school)}</h4>
            <Link to="/#hosts">{tx(nav.main[3].label)}</Link>
            <Link to="/franchise">{tx(nav.util[1].label)}</Link>
            <Link to="/careers">{tx(nav.util[2].label)}</Link>
            <Link to="/#contact">{tx(footer.contact)}</Link>
          </div>
        </div>
        <div className="vs-footer-bottom">
          <div>© {new Date().getFullYear()} Voilà les enfants</div>
          <nav aria-label="Legal">
            <Link to="/privacy">{tx(footer.privacy)}</Link>
            <Link to="/terms">{tx(footer.terms)}</Link>
            <Link to="/legal">{tx(footer.legal)}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="vs">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
