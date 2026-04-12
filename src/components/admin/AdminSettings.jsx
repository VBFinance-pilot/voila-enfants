import { useState, useEffect } from 'react';
import { supabase, logAction } from '../../lib/supabase';

const DEFAULT_KEYS = [
  { key: 'site_title', label: 'Site Title' },
  { key: 'site_subtitle', label: 'Site Subtitle' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'contact_phone', label: 'Contact Phone' },
  { key: 'address', label: 'Address' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'line_url', label: 'LINE URL' },
  { key: 'google_maps_embed', label: 'Google Maps Embed URL' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*');
      const map = {};
      (data || []).forEach(r => { map[r.key] = r.value; });
      setSettings(map);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
      await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
      await logAction('update', 'site_settings', `${rows.length} settings saved`);
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleAddCustom = () => {
    if (!customKey.trim()) return;
    setSettings(prev => ({ ...prev, [customKey.trim()]: customValue }));
    setCustomKey('');
    setCustomValue('');
  };

  const handleDeleteKey = async (key) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    await supabase.from('site_settings').delete().eq('key', key);
    setSettings(prev => { const n = { ...prev }; delete n[key]; return n; });
    await logAction('delete', 'site_settings', key);
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  const allKeys = [...new Set([...DEFAULT_KEYS.map(d => d.key), ...Object.keys(settings)])];

  return (
    <div className="adm-form-section">
      <h3>Site Settings</h3>
      <div className="adm-settings-grid">
        {allKeys.map(key => {
          const def = DEFAULT_KEYS.find(d => d.key === key);
          const label = def ? def.label : key;
          const isCustom = !def;
          return (
            <div key={key} className="adm-setting-row">
              <label>{label}</label>
              <div className="adm-setting-input">
                {key === 'google_maps_embed' ? (
                  <textarea value={settings[key] || ''} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} rows={2} />
                ) : (
                  <input value={settings[key] || ''} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} />
                )}
                {isCustom && <button onClick={() => handleDeleteKey(key)} className="adm-btn-del" title="Remove">🗑️</button>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="adm-add-custom">
        <h4>Add Custom Setting</h4>
        <div className="adm-row">
          <input value={customKey} onChange={e => setCustomKey(e.target.value)} placeholder="Key" />
          <input value={customValue} onChange={e => setCustomValue(e.target.value)} placeholder="Value" />
          <button onClick={handleAddCustom} className="adm-btn-save" type="button">Add</button>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="adm-btn-save" style={{ marginTop: 16 }}>
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
}
