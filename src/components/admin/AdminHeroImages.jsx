import { useState, useEffect } from 'react';
import { supabase, uploadImage, logAction } from '../../lib/supabase';

const SECTIONS = [
  { name: 'activities_hero', label: 'Activities (circular image)' },
  { name: 'oyako_hero', label: 'Oyako Hiroba' },
  { name: 'main_hero', label: 'Main Hero' },
];

export default function AdminHeroImages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hero_images').select('*');
      // Merge DB rows with section definitions so all sections always show
      const merged = SECTIONS.map(s => {
        const existing = (data || []).find(r => r.section_name === s.name);
        return existing || { section_name: s.name, image_url: '', alt_text: '' };
      });
      setRows(merged);
      setLoading(false);
    })();
  }, []);

  const handleUpload = async (sectionName, file) => {
    if (!file) return;
    setUploading(sectionName);
    try {
      const url = await uploadImage(file, 'hero');
      await upsertRow(sectionName, { image_url: url });
      setRows(prev => prev.map(r => r.section_name === sectionName ? { ...r, image_url: url } : r));
      await logAction('upload', 'hero_images', sectionName);
      setSaved(sectionName);
      setTimeout(() => setSaved(null), 3000);
    } catch (err) { alert('Upload failed: ' + (err.message || err)); }
    setUploading(null);
  };

  const handleAltChange = async (sectionName, alt_text) => {
    setRows(prev => prev.map(r => r.section_name === sectionName ? { ...r, alt_text } : r));
  };

  const handleAltSave = async (sectionName) => {
    const row = rows.find(r => r.section_name === sectionName);
    if (!row) return;
    try {
      await upsertRow(sectionName, { alt_text: row.alt_text || '' });
      await logAction('update_alt', 'hero_images', sectionName);
      setSaved(sectionName);
      setTimeout(() => setSaved(null), 3000);
    } catch (err) { alert('Save failed: ' + (err.message || err)); }
  };

  const handleDelete = async (sectionName) => {
    if (!confirm(`Remove image for "${sectionName}"?`)) return;
    try {
      await upsertRow(sectionName, { image_url: '' });
      setRows(prev => prev.map(r => r.section_name === sectionName ? { ...r, image_url: '' } : r));
      await logAction('delete_image', 'hero_images', sectionName);
    } catch (err) { alert('Delete failed: ' + (err.message || err)); }
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div className="adm-form-section">
      <h3>Hero / Section Images</h3>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 16 }}>
        Upload images for each section. Changes are saved automatically.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rows.map(row => {
          const section = SECTIONS.find(s => s.name === row.section_name);
          const label = section ? section.label : row.section_name;
          return (
            <div key={row.section_name} className="adm-inline-form" style={{ margin: 0 }}>
              <h4 style={{ margin: '0 0 8px', color: '#8B1A4A' }}>{label}</h4>
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
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={row.alt_text || ''}
                        onChange={e => handleAltChange(row.section_name, e.target.value)}
                        placeholder="Image description"
                        style={{ flex: 1 }}
                      />
                      <button onClick={() => handleAltSave(row.section_name)} className="adm-btn-save" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Save</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {row.image_url && (
                      <button onClick={() => handleDelete(row.section_name)} className="adm-btn-cancel" style={{ fontSize: '0.85rem' }}>
                        Remove Image
                      </button>
                    )}
                    {saved === row.section_name && <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>Saved!</span>}
                  </div>
                </div>
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
      .insert({ section_name: sectionName, image_url: '', alt_text: '', ...updates });
    if (error) throw error;
  }
}
