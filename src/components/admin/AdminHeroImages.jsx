import { useState, useEffect } from 'react';
import { supabase, uploadImage, logAction } from '../../lib/supabase';
import { IMAGE_SLOTS, parseFrame, DEFAULT_FRAME, ratioOf } from '../../site/siteImages';
import FrameEditor from './FrameEditor';

// One entry per photo on the new site. Removing an uploaded photo brings back
// the built-in default photo. The framing (focal point + zoom) is stored as
// JSON in hero_images.description — see siteImages.js.
const MOBILE_ASPECT = (name) => (name.endsWith('_hero') ? '2 / 3' : name.startsWith('home_') ? '8 / 9' : null);

function Thumb({ src, aspect, frame, dashed }) {
  const f = frame || DEFAULT_FRAME;
  return (
    <div className={`adm-thumb-frame${dashed ? ' is-default' : ''}`} style={{ aspectRatio: aspect, maxWidth: `calc(300px * ${ratioOf(aspect)})` }}>
      {src ? (
        <img src={src} alt="" style={{ objectPosition: `${f.x}% ${f.y}%`, transformOrigin: `${f.x}% ${f.y}%`, transform: `scale(${f.z})` }} />
      ) : <span>Aucune photo</span>}
    </div>
  );
}

export default function AdminHeroImages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hero_images').select('*');
      const merged = IMAGE_SLOTS.map(s => {
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

  const flashSaved = (sectionName) => {
    setSaved(sectionName);
    setTimeout(() => setSaved(null), 3000);
  };

  const handleUpload = async (sectionName, file) => {
    if (!file) return;
    setUploading(sectionName);
    try {
      const url = await uploadImage(file, 'hero');
      // A new photo starts centred, without zoom.
      await upsertRow(sectionName, { image_url: url, description: '' });
      updateLocal(sectionName, { image_url: url, description: '' });
      await logAction('upload', 'hero_images', sectionName);
      flashSaved(sectionName);
    } catch (err) { alert('Échec de l’envoi : ' + (err.message || err)); }
    setUploading(null);
  };

  const handleSaveAlt = async (sectionName) => {
    const row = rows.find(r => r.section_name === sectionName);
    if (!row) return;
    setSaving(sectionName);
    try {
      await upsertRow(sectionName, { alt_text: row.alt_text || '' });
      await logAction('update', 'hero_images', sectionName);
      flashSaved(sectionName);
    } catch (err) { alert('Échec de l’enregistrement : ' + (err.message || err)); }
    setSaving(null);
  };

  const handleSaveFrame = async (sectionName, frame) => {
    const description = JSON.stringify({ frame });
    setSaving(sectionName);
    try {
      await upsertRow(sectionName, { description });
      updateLocal(sectionName, { description });
      await logAction('reframe', 'hero_images', sectionName);
      setEditing(null);
      flashSaved(sectionName);
    } catch (err) { alert('Échec de l’enregistrement : ' + (err.message || err)); }
    setSaving(null);
  };

  const handleDelete = async (sectionName) => {
    if (!confirm('Retirer cette photo et remettre la photo d’origine ?')) return;
    try {
      await upsertRow(sectionName, { image_url: '', description: '' });
      updateLocal(sectionName, { image_url: '', description: '' });
      await logAction('delete_image', 'hero_images', sectionName);
    } catch (err) { alert('Échec de la suppression : ' + (err.message || err)); }
  };

  if (loading) return <div className="adm-loading">Chargement…</div>;

  const editRow = editing && rows.find(r => r.section_name === editing);
  const editSlot = editing && IMAGE_SLOTS.find(s => s.name === editing);

  return (
    <div className="adm-slots">
      {rows.map(row => {
        const slot = IMAGE_SLOTS.find(s => s.name === row.section_name);
        const src = row.image_url || slot?.fallback || '';
        const frame = parseFrame(row.description);
        return (
          <div key={row.section_name} className="adm-inline-form adm-slot">
            <h4>{slot?.label || row.section_name}</h4>
            <div className="adm-slot-body">
              <div className="adm-slot-preview">
                <Thumb src={src} aspect={slot?.aspect || '4 / 3'} frame={frame} dashed={!row.image_url} />
                <div className="adm-meta">
                  {row.image_url ? 'Votre photo' : 'Photo par défaut'}
                  {frame && (frame.z !== 1 || frame.x !== 50 || frame.y !== 50) ? ` · recadrée${frame.z > 1 ? ` (${Math.round(frame.z * 100)} %)` : ''}` : ''}
                </div>
                {src && (
                  <button type="button" className="adm-btn-cancel adm-btn-sm" onClick={() => setEditing(row.section_name)}>
                    Recadrer / zoomer
                  </button>
                )}
              </div>
              <div className="adm-slot-fields">
                <div className="adm-field">
                  <label>Nouvelle photo</label>
                  <input type="file" accept="image/*" onChange={e => handleUpload(row.section_name, e.target.files?.[0])} disabled={uploading === row.section_name} />
                  {uploading === row.section_name && <span className="adm-meta">Envoi…</span>}
                </div>
                <div className="adm-field">
                  <label>Description de la photo (accessibilité)</label>
                  <input value={row.alt_text || ''} onChange={e => updateLocal(row.section_name, { alt_text: e.target.value })} placeholder="ex. Enfants qui cuisinent au studio" />
                </div>
                <div className="adm-form-actions">
                  <button onClick={() => handleSaveAlt(row.section_name)} disabled={saving === row.section_name} className="adm-btn-save">
                    {saving === row.section_name ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  {row.image_url && <button onClick={() => handleDelete(row.section_name)} className="adm-btn-cancel">Retirer</button>}
                  {saved === row.section_name && <span className="adm-saved">Enregistré ✓</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {editRow && (
        <FrameEditor
          src={editRow.image_url || editSlot?.fallback}
          aspect={editSlot?.aspect || '4 / 3'}
          mobileAspect={MOBILE_ASPECT(editRow.section_name)}
          initial={parseFrame(editRow.description)}
          saving={saving === editRow.section_name}
          onCancel={() => setEditing(null)}
          onSave={(f) => handleSaveFrame(editRow.section_name, f)}
        />
      )}
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
