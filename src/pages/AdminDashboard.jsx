import { useState } from 'react';
import AdminGalleryTab from '../components/admin/AdminGalleryTab';
import AdminOyako from '../components/admin/AdminOyako';
import AdminEvents from '../components/admin/AdminEvents';
import AdminServices from '../components/admin/AdminServices';
import AdminFounders from '../components/admin/AdminFounders';
import AdminVideos from '../components/admin/AdminVideos';
import AdminSettings from '../components/admin/AdminSettings';
import AdminHeroImages from '../components/admin/AdminHeroImages';
import './AdminDashboard.css';

const TABS = [
  { id: 'gallery', label: '📷 Gallery', component: AdminGalleryTab },
  { id: 'hero', label: '🖼️ Hero Images', component: AdminHeroImages },
  { id: 'oyako', label: '🏠 Oyako', component: AdminOyako },
  { id: 'events', label: '📅 Events', component: AdminEvents },
  { id: 'services', label: '📚 Services', component: AdminServices },
  { id: 'founders', label: '👥 Founders', component: AdminFounders },
  { id: 'videos', label: '🎬 Videos', component: AdminVideos },
  { id: 'settings', label: '⚙️ Settings', component: AdminSettings },
];

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');

  if (!authed) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <h2>Admin Panel</h2>
          <p>Voila les enfants</p>
          <form onSubmit={e => { e.preventDefault(); if (pass === '061219Vmalvf!') setAuthed(true); else alert('Wrong password'); }}>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" autoFocus />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component;

  return (
    <div className="adm-dashboard">
      <header className="adm-header">
        <h1>Voila Admin</h1>
        <a href="/" className="adm-back-link">← Back to site</a>
      </header>
      <nav className="adm-tabs">
        {TABS.map(tab => (
          <button key={tab.id} className={`adm-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="adm-main">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}
