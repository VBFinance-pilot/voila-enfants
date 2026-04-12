import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

export default function AdminVideos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', youtube_id: '', video_url: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('videos_items')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await supabase.from('videos_items').update(form).eq('id', editId);
        await logAction('update', 'videos_items', form.title);
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
        await supabase.from('videos_items').insert({ ...form, order_index: maxOrder });
        await logAction('create', 'videos_items', form.title);
      }
      setForm({ title: '', youtube_id: '', video_url: '', description: '' });
      setEditId(null);
      await load();
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, youtube_id: item.youtube_id || '', video_url: item.video_url || '', description: item.description || '' });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await deleteRow('videos_items', item.id);
    await logAction('delete', 'videos_items', item.title);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);
    try { await reorder('videos_items', arr); } catch {}
  };

  // Extract YouTube ID from various URL formats
  const extractYouTubeId = (input) => {
    if (!input) return '';
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="adm-inline-form">
        <h3>{editId ? 'Edit Video' : 'Add Video'}</h3>
        <div className="adm-field"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
        <div className="adm-field">
          <label>YouTube ID or URL</label>
          <input value={form.youtube_id} onChange={e => setForm(f => ({ ...f, youtube_id: extractYouTubeId(e.target.value) }))} placeholder="e.g. dQw4w9WgXcQ or full YouTube URL" />
          {form.youtube_id && <img src={`https://img.youtube.com/vi/${form.youtube_id}/mqdefault.jpg`} alt="" className="adm-preview-img" style={{ marginTop: 8 }} />}
        </div>
        <div className="adm-field"><label>Video URL (alternative)</label><input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Direct video URL if not YouTube" /></div>
        <div className="adm-field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
        <div className="adm-form-actions">
          <button type="submit" disabled={saving} className="adm-btn-save">{saving ? 'Saving...' : editId ? 'Update' : 'Add Video'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', youtube_id: '', video_url: '', description: '' }); }} className="adm-btn-cancel">Cancel</button>}
        </div>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      {item.youtube_id && <img src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} alt="" className="adm-thumb" />}
                      <div className="adm-card-info">
                        <strong>{item.title}</strong>
                        <span className="adm-meta">{item.youtube_id ? `YT: ${item.youtube_id}` : item.video_url || 'No source'}</span>
                      </div>
                      <button onClick={() => handleEdit(item)} className="adm-btn-edit">✏️</button>
                      <button onClick={() => handleDelete(item)} className="adm-btn-del">🗑️</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
