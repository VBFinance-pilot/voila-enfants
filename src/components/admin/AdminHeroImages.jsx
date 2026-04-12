import { useState, useEffect } from 'react';
import { supabase, uploadImage, logAction } from '../../lib/supabase';

const SECTIONS = [
  { name: 'activities_hero', label: 'Activities (circular image)', hasText: false },
  { name: 'oyako_hero', label: 'Oyako Hiroba', hasText: true },
  { name: 'main_hero', label: 'Main Hero', hasText: true },
];

export default function AdminHeroImages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hero_images').select('*');
      const merged = SECTIONS.map(s => {
        const existing = (data || []).find(r => r.section_name === s.name);
        return existing || { section_name: s.name, image_url: '', alt_text: '', title: '', description: '' };
      });
      setRows(merged);
      setLoading(false);
    })();
  }, []);

  const updateLocal = (sectionName, updates) => {
    setRows(prev => prev.map(r => r.section_name === sectionName ? { ...r, ...updates } : r));
  };

  const handleUpload = async (sectionName, file) => {
    if (!file) return;
    setUploading(sectionName);
    try {
      const url = await uploadImage(file, 'hero');
      await upsertRow(sectionName, { image_url: url });
      updateLocal(sectionName, { image_url: url });
      await logAction('upload', 'hero_images', sectionName);
      flashSaved(sectionName);
    } catch (err) { alert('Upload failed: ' + (err.message || err)); }
    setUploading(null);
  };

  const handleSave = async (sectionName) => {
    const row = rows.find(r => r.section_name === sectionName);
    if (!row) return;
    setSaving(sectionName);
    try {
      await upsertRow(sectionName, {
        alt_text: row.alt_text || '',
        title: row.title || '',
        description: row.description || '',
      });
      await logAction('update', 'hero_images', sectionName);
      flashSaved(sectionName);
    } catch (err) { alert('Save failed: ' + (err.message || err)); }
    setSaving(null);
  };

  const handleDelete = async (sectionName) => {
    if (!confirm(`Remove image for "${sectionName}"?`)) return;
    try {
      await upsertRow(sectionName, { image_url: '' });
      updateLocal(sectionName, { image_url: '' });
      await logAction('delete_image', 'hero_images', sectionName);
    } catch (err) { alert('Delete failed: ' + (err.message || err)); }
  };

  const flashSaved = (sectionName) => {
    setSaved(sectionName);
    setTimeout(() => setSaved(null), 3000);
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div className="adm-form-section">
      <h3>Hero / Section Images</h3>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 16 }}>
        Manage images, titles and descriptions for each section.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rows.map(row => {
          const section = SECTIONS.find(s => s.name === row.section_name);
          const label = section ? section.label : row.section_name;
          const hasText = section?.hasText;
          return (
            <div key={row.section_name} className="adm-inline-form" style={{ margin: 0 }}>
              <h4 style={{ margin: '0 0 12px', color: '#8B1A4A' }}>{label}</h4>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 160px' }}>
                  {row.image_url ? (
                    <img src={row.image_url} alt={row.alt_text || ''} style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee' }} />
                  ) : (
                    <div style={{ width: 160, height: 120, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 14, border: '2px dashed #ddd' }}>
                      No image
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="adm-field">
                    <label>Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleUpload(row.section_name, e.target.files?.[0])}
                      disabled={uploading === row.section_name}
                    />
                    {uploading === row.section_name && <span style={{ color: '#999', fontSize: 13 }}>Uploading...</span>}
                  </div>
                  <div className="adm-field">
                    <label>Alt Text</label>
                    <input
                      value={row.alt_text || ''}
                      onChange={e => updateLocal(row.section_name, { alt_text: e.target.value })}
                      placeholder="Image description"
                    />
                  </div>
                </div>
              </div>

              {hasText && (
                <div style={{ marginTop: 12 }}>
                  <div className="adm-field">
                    <label>Title</label>
                    <input
                      value={row.title || ''}
                      onChange={e => updateLocal(row.section_name, { title: e.target.value })}
                      placeholder="Section title"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Description (HTML ok)</label>
                    <textarea
                      value={row.description || ''}
                      onChange={e => updateLocal(row.section_name, { description: e.target.value })}
                      rows={4}
                      placeholder="Section description..."
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <button
                  onClick={() => handleSave(row.section_name)}
                  disabled={saving === row.section_name}
                  className="adm-btn-save"
                  style={{ fontSize: '0.85rem' }}
                >
                  {saving === row.section_name ? 'Saving...' : 'Save'}
                </button>
                {row.image_url && (
                  <button onClick={() => handleDelete(row.section_name)} className="adm-btn-cancel" style={{ fontSize: '0.85rem' }}>
                    Remove Image
                  </button>
                )}
                {saved === row.section_name && <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>Saved!</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function upsertRow(sectionName, updates) {
  const { data: existing } = await supabase
    .from('hero_images')
    .select('id')
    .eq('section_name', sectionName)
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('hero_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('section_name', sectionName);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('hero_images')
      .insert({ section_name: sectionName, image_url: '', alt_text: '', title: '', description: '', ...updates });
    if (error) throw error;
  }
}
