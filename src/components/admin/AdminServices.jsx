import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', icon_emoji: '📚', icon_bg: '#FFF0F5' });
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('services_items')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await supabase.from('services_items').update(form).eq('id', editId);
        await logAction('update', 'services_items', form.title);
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
        await supabase.from('services_items').insert({ ...form, order_index: maxOrder });
        await logAction('create', 'services_items', form.title);
      }
      setForm({ title: '', description: '', icon_emoji: '📚', icon_bg: '#FFF0F5' });
      setEditId(null);
      await load();
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, description: item.description || '', icon_emoji: item.icon_emoji || '📚', icon_bg: item.icon_bg || '#FFF0F5' });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await deleteRow('services_items', item.id);
    await logAction('delete', 'services_items', item.title);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);
    try { await reorder('services_items', arr); } catch {}
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="adm-inline-form">
        <h3>{editId ? 'Edit Service' : 'Add Service'}</h3>
        <div className="adm-field"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
        <div className="adm-field"><label>Description (HTML ok)</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} /></div>
        <div className="adm-row">
          <div className="adm-field"><label>Icon Emoji</label><input value={form.icon_emoji} onChange={e => setForm(f => ({ ...f, icon_emoji: e.target.value }))} placeholder="📚" /></div>
          <div className="adm-field"><label>Icon BG Color</label><input type="color" value={form.icon_bg} onChange={e => setForm(f => ({ ...f, icon_bg: e.target.value }))} /></div>
        </div>
        <div className="adm-form-actions">
          <button type="submit" disabled={saving} className="adm-btn-save">{saving ? 'Saving...' : editId ? 'Update' : 'Add Service'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', icon_emoji: '📚', icon_bg: '#FFF0F5' }); }} className="adm-btn-cancel">Cancel</button>}
        </div>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="services">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      <span className="adm-icon" style={{ background: item.icon_bg }}>{item.icon_emoji}</span>
                      <div className="adm-card-info"><strong>{item.title}</strong></div>
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
