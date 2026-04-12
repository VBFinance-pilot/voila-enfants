import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, uploadImage, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

export default function AdminFounders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', bio: '', lang_label: '', image_url: '' });
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('founders_items')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await supabase.from('founders_items').update(form).eq('id', editId);
        await logAction('update', 'founders_items', form.name);
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
        await supabase.from('founders_items').insert({ ...form, order_index: maxOrder });
        await logAction('create', 'founders_items', form.name);
      }
      setForm({ name: '', title: '', bio: '', lang_label: '', image_url: '' });
      setEditId(null);
      await load();
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, title: item.title || '', bio: item.bio || '', lang_label: item.lang_label || '', image_url: item.image_url || '' });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteRow('founders_items', item.id);
    await logAction('delete', 'founders_items', item.name);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, 'founders');
      setForm(f => ({ ...f, image_url: url }));
    } catch (err) { alert('Upload failed: ' + err.message); }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);
    try { await reorder('founders_items', arr); } catch {}
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="adm-inline-form">
        <h3>{editId ? 'Edit Founder' : 'Add Founder'}</h3>
        <div className="adm-field"><label>Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
        <div className="adm-field"><label>Title / Role</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Co-founder" /></div>
        <div className="adm-field"><label>Bio (HTML ok)</label><textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} /></div>
        <div className="adm-row">
          <div className="adm-field"><label>Language Label</label><input value={form.lang_label} onChange={e => setForm(f => ({ ...f, lang_label: e.target.value }))} placeholder="e.g. 🇫🇷 French" /></div>
        </div>
        <div className="adm-field">
          <label>Photo</label>
          {form.image_url && <img src={form.image_url} alt="" className="adm-preview-img" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="adm-form-actions">
          <button type="submit" disabled={saving} className="adm-btn-save">{saving ? 'Saving...' : editId ? 'Update' : 'Add Founder'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', title: '', bio: '', lang_label: '', image_url: '' }); }} className="adm-btn-cancel">Cancel</button>}
        </div>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="founders">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      {item.image_url && <img src={item.image_url} alt="" className="adm-thumb" />}
                      <div className="adm-card-info">
                        <strong>{item.name}</strong>
                        <span className="adm-meta">{item.title} {item.lang_label}</span>
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
