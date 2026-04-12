import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, uploadImage, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', image_url: '', active: true });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('events_items')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    setSuccess(false);
    try {
      if (editId) {
        const { error } = await supabase.from('events_items').update({
          title: form.title, description: form.description, date: form.date,
          image_url: form.image_url, active: form.active,
        }).eq('id', editId);
        if (error) throw error;
        await logAction('update', 'events_items', form.title);
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
        const { error } = await supabase.from('events_items').insert({
          title: form.title, description: form.description, date: form.date,
          image_url: form.image_url, active: form.active, order_index: maxOrder,
        });
        if (error) throw error;
        await logAction('create', 'events_items', form.title);
      }
      setForm({ title: '', description: '', date: '', image_url: '', active: true });
      setEditId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await load();
    } catch (err) {
      console.error('AdminEvents save error:', err);
      alert('Save failed: ' + (err.message || JSON.stringify(err)));
    }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, description: item.description || '', date: item.date || '', image_url: item.image_url || '', active: item.active });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteRow('events_items', item.id);
      await logAction('delete', 'events_items', item.title);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('AdminEvents delete error:', err);
      alert('Delete failed: ' + (err.message || JSON.stringify(err)));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, 'events');
      setForm(f => ({ ...f, image_url: url }));
    } catch (err) { alert('Upload failed: ' + err.message); }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);
    try { await reorder('events_items', arr); } catch (err) { console.error('Reorder error:', err); }
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="adm-inline-form">
        <h3>{editId ? 'Edit Event' : 'Add Event'}</h3>
        <div className="adm-field"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
        <div className="adm-field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
        <div className="adm-row">
          <div className="adm-field"><label>Date</label><input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. April 2026" /></div>
          <div className="adm-field">
            <label>Active</label>
            <select value={form.active ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="adm-field"><label>Image</label>{form.image_url && <img src={form.image_url} alt="" className="adm-preview-img" />}<input type="file" accept="image/*" onChange={handleImageUpload} /></div>
        <div className="adm-form-actions">
          <button type="submit" disabled={saving} className="adm-btn-save">{saving ? 'Saving...' : editId ? 'Update' : 'Add Event'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', date: '', image_url: '', active: true }); setSuccess(false); }} className="adm-btn-cancel">Cancel</button>}
          {success && <span style={{ color: '#2e7d32', fontWeight: 600, marginLeft: 8 }}>Saved!</span>}
        </div>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="events">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      {item.image_url && <img src={item.image_url} alt="" className="adm-thumb" />}
                      <div className="adm-card-info">
                        <strong>{item.title}</strong>
                        <span className="adm-meta">{item.date} {item.active ? '🟢' : '⚪'}</span>
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
