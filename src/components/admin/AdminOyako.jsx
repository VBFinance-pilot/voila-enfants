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

  const handleSave = async () => {
    setSaving(true);
    try {
      if (data.id) {
        await supabase.from('oyako_section').update({ title: data.title, description: data.description, image_url: data.image_url, updated_at: new Date().toISOString() }).eq('id', data.id);
      } else {
        const { data: row } = await supabase.from('oyako_section').insert({ title: data.title, description: data.description, image_url: data.image_url }).select().single();
        setData(row);
      }
      await logAction('update', 'oyako_section', data.title);
    } catch (err) { alert('Save failed: ' + err.message); }
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
    </div>
  );
}
