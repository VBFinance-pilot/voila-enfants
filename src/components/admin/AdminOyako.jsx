import { useState, useEffect } from 'react';
import { supabase, uploadImage, logAction } from '../../lib/supabase';

export default function AdminOyako() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from('oyako_section').select('*').limit(1);
      setData(rows?.[0] || { title: '', description: '', image_url: '' });
      setLoading(false);
    })();
  }, []);

  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const payload = { title: data.title || '', description: data.description || '', image_url: data.image_url || '' };
      if (data.id) {
        const { error } = await supabase.from('oyako_section').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { data: row, error } = await supabase.from('oyako_section').insert(payload).select().single();
        if (error) throw error;
        if (row) setData(row);
      }
      await logAction('update', 'oyako_section', payload.title);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { alert('Save failed: ' + (err.message || err)); }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, 'oyako');
      setData(prev => ({ ...prev, image_url: url }));
    } catch (err) { alert('Upload failed: ' + err.message); }
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div className="adm-form-section">
      <div className="adm-field">
        <label>Title</label>
        <input value={data.title || ''} onChange={e => setData(d => ({ ...d, title: e.target.value }))} placeholder="Section title" />
      </div>
      <div className="adm-field">
        <label>Description (HTML ok)</label>
        <textarea value={data.description || ''} onChange={e => setData(d => ({ ...d, description: e.target.value }))} rows={6} placeholder="Section description..." />
      </div>
      <div className="adm-field">
        <label>Image</label>
        {data.image_url && <img src={data.image_url} alt="" className="adm-preview-img" />}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <button onClick={handleSave} disabled={saving} className="adm-btn-save">
        {saving ? 'Saving...' : 'Save Oyako Section'}
      </button>
      {success && <span style={{ color: '#2e7d32', marginLeft: 12, fontWeight: 600 }}>Saved!</span>}
    </div>
  );
}
