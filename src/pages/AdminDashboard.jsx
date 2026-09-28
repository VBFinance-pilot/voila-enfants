import { useEffect, useState } from 'react';
import AdminGalleryTab from '../components/admin/AdminGalleryTab';
import AdminEvents from '../components/admin/AdminEvents';
import AdminFounders from '../components/admin/AdminFounders';
import AdminVideos from '../components/admin/AdminVideos';
import AdminSettings from '../components/admin/AdminSettings';
import AdminHeroImages from '../components/admin/AdminHeroImages';
import { NAV_ICONS } from '../components/admin/icons';
import './AdminDashboard.css';

// Sections of « Voilà Management », grouped like the site.
const GROUPS = [
  {
    label: 'Photos & médias',
    items: [
      { id: 'hero', label: 'Photos du site', component: AdminHeroImages, eyebrow: 'SITE PHOTOS', desc: 'Chaque emplacement correspond à une photo du site. Téléversez une image pour la remplacer ; « Retirer » remet la photo d’origine.' },
      { id: 'gallery', label: 'Galerie', component: AdminGalleryTab, eyebrow: 'MOMENTS · PHOTOS', desc: 'Les photos de l’onglet « Photos » de la section Moments. Glissez-déposez pour changer l’ordre.' },
      { id: 'videos', label: 'Vidéos', component: AdminVideos, eyebrow: 'MOMENTS · FILMS', desc: 'Les vidéos de l’onglet « Films ». Collez un lien YouTube ; l’onglet apparaît dès qu’il y a une vidéo.' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { id: 'events', label: 'Événements', component: AdminEvents, eyebrow: 'UPCOMING', desc: 'Les prochains rendez-vous affichés sur l’accueil (les 3 premiers actifs). Date conseillée : 2026-10-31.' },
      { id: 'founders', label: 'Vos hôtes', component: AdminFounders, eyebrow: 'YOUR HOSTS', desc: 'Les photos de Victor & Maria dans la section « Vos hôtes ».' },
    ],
  },
  {
    label: 'Réglages',
    items: [
      { id: 'settings', label: 'Paramètres', component: AdminSettings, eyebrow: 'SETTINGS', desc: 'Réglages techniques utilisés par le site (carte Google Maps).' },
    ],
  },
];
const ITEMS = GROUPS.flatMap((g) => g.items);
const SESSION_KEY = 'voila-admin';

function readHash() {
  const id = window.location.hash.replace('#', '');
  return ITEMS.some((i) => i.id === id) ? id : 'hero';
}

function Login({ onSuccess }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <img src="/brand/logo.png" alt="Voilà les enfants" className="adm-login-logo" />
        <div className="adm-eyebrow">MANAGEMENT</div>
        <h1>Bon retour parmi nous</h1>
        <p>Espace de gestion du site Voilà les enfants.</p>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (pass === '061219Vmalvf!') onSuccess();
          else setError(true);
        }}>
          <input type="password" value={pass} onChange={(e) => { setPass(e.target.value); setError(false); }} placeholder="Mot de passe" autoFocus aria-invalid={error} />
          {error && <div className="adm-login-error">Mot de passe incorrect.</div>}
          <button type="submit">Se connecter</button>
        </form>
        <a href="/" className="adm-login-back">← Retour au site</a>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
  });
  const [activeTab, setActiveTab] = useState(readHash);

  useEffect(() => {
    const onHash = () => setActiveTab(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = 'Voilà Management';
  }, []);

  const login = () => {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
    setAuthed(true);
  };
  const logout = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* private mode */ }
    setAuthed(false);
  };
  const go = (id) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo(0, 0);
  };

  if (!authed) return <Login onSuccess={login} />;

  const active = ITEMS.find((t) => t.id === activeTab) || ITEMS[0];
  const ActiveComponent = active.component;

  return (
    <div className="adm-app">
      <aside className="adm-side">
        <div className="adm-brand">
          <img src="/brand/logo.png" alt="Voilà les enfants" />
          <span>MANAGEMENT</span>
        </div>
        <nav className="adm-nav" aria-label="Sections">
          {GROUPS.map((g) => (
            <div key={g.label} className="adm-nav-group">
              <div className="adm-nav-label">{g.label}</div>
              {g.items.map((t) => (
                <button key={t.id} type="button" className={`adm-nav-item${active.id === t.id ? ' is-active' : ''}`} aria-current={active.id === t.id ? 'page' : undefined} onClick={() => go(t.id)}>
                  {NAV_ICONS[t.id]}<span>{t.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-nav-item">{NAV_ICONS.external}<span>Voir le site</span></a>
          <button type="button" className="adm-nav-item" onClick={logout}>{NAV_ICONS.logout}<span>Se déconnecter</span></button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-page-head">
          <div className="adm-eyebrow">{active.eyebrow}</div>
          <h1>{active.label}</h1>
          <p>{active.desc}</p>
        </header>
        <div className="adm-content">
          <ActiveComponent key={active.id} />
        </div>
      </main>
    </div>
  );
}
