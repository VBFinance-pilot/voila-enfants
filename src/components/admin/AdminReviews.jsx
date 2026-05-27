import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

const EMPTY_FORM = { author_name: '', rating: 5, text: '', review_date: '', language: 'EN', active: true };

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('reviews')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editId) {
        await supabase.from('reviews').update(payload).eq('id', editId);
        await logAction('update', 'reviews', form.author_name);
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
        await supabase.from('reviews').insert({ ...payload, order_index: maxOrder });
        await logAction('create', 'reviews', form.author_name);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      await load();
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      author_name: item.author_name,
      rating: item.rating,
      text: item.text,
      review_date: item.review_date || '',
      language: item.language || 'EN',
      active: item.active !== false,
    });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete review by "${item.author_name}"?`)) return;
    await deleteRow('reviews', item.id);
    await logAction('delete', 'reviews', item.author_name);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);
    try { await reorder('reviews', arr); } catch {}
  };

  const toggleActive = async (item) => {
    const next = !item.active;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, active: next } : i));
    try {
      await supabase.from('reviews').update({ active: next }).eq('id', item.id);
      await logAction('update', 'reviews', `${item.author_name} active=${next}`);
    } catch (err) { alert('Update failed: ' + err.message); }
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="adm-inline-form">
        <h3>{editId ? 'Edit Review' : 'Add Review'}</h3>
        <div className="adm-field"><label>Author Name *</label><input value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} required /></div>
        <div className="adm-field">
          <label>Rating *</label>
          <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} required>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
          </select>
        </div>
        <div className="adm-field"><label>Text *</label><textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} required /></div>
        <div className="adm-field"><label>Review Date</label><input value={form.review_date} onChange={e => setForm(f => ({ ...f, review_date: e.target.value }))} placeholder="e.g. March 2026" /></div>
        <div className="adm-field">
          <label>Language</label>
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
            <option value="EN">EN</option>
            <option value="JP">JP</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="adm-field">
          <label><input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} /> Active (visible on site)</label>
        </div>
        <div className="adm-form-actions">
          <button type="submit" disabled={saving} className="adm-btn-save">{saving ? 'Saving...' : editId ? 'Update' : 'Add Review'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }} className="adm-btn-cancel">Cancel</button>}
        </div>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="reviews">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`} style={{ opacity: item.active === false ? 0.45 : 1 }}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      <div className="adm-card-info">
                        <strong>{item.author_name} · {'★'.repeat(item.rating)}</strong>
                        <span className="adm-meta">{item.review_date || '—'} · {item.language || '—'} · {item.text.slice(0, 80)}{item.text.length > 80 ? '…' : ''}</span>
                      </div>
                      <button onClick={() => toggleActive(item)} className="adm-btn-edit" title={item.active === false ? 'Activate' : 'Deactivate'}>{item.active === false ? '🙈' : '👁️'}</button>
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
