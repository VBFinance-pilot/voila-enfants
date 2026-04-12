import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase, uploadImage, removeImage, fetchOrdered, reorder, deleteRow, logAction } from '../../lib/supabase';

export default function AdminGalleryTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchOrdered('gallery_items')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
      const { data } = await supabase.from('gallery_items').insert({ image_url: url, order_index: maxOrder }).select().single();
      setItems(prev => [...prev, data]);
      await logAction('upload', 'gallery_items', file.name);
    } catch (err) { alert('Upload failed: ' + err.message); }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (item) => {
    if (!confirm('Delete this image?')) return;
    try {
      await removeImage(item.image_url);
      await deleteRow('gallery_items', item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      await logAction('delete', 'gallery_items', item.image_url);
    } catch (err) { alert('Delete failed: ' + err.message); }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
    setSaving(true);
    try { await reorder('gallery_items', reordered); } catch {}
    setSaving(false);
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      <div className="adm-toolbar">
        <span className="adm-count">{items.length} images {saving && '— Saving...'}</span>
        <label className="adm-upload-btn">
          {uploading ? 'Uploading...' : '📷 Upload Image'}
          <input type="file" accept="image/*" onChange={handleUpload} hidden disabled={uploading} />
        </label>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="adm-grid-list">
              {items.map((item, i) => (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} className={`adm-card-row ${snap.isDragging ? 'dragging' : ''}`}>
                      <span {...prov.dragHandleProps} className="adm-drag">⠿</span>
                      <img src={item.image_url} alt="" className="adm-thumb" />
                      <span className="adm-order">#{i + 1}</span>
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
