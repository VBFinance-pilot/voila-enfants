import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import './AdminGallery.css';

const ADMIN_PASSWORD = '061219Vmalvf!';

export default function AdminGallery() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchItems();
  }, [authed, fetchItems]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setItems(reordered);

    setSaving(true);
    const updates = reordered.map((item, i) => ({
      id: item.id,
      title: item.title,
      image_url: item.image_url,
      order_index: i,
      created_at: item.created_at,
    }));

    const { error } = await supabase
      .from('gallery_items')
      .upsert(updates, { onConflict: 'id' });

    if (error) alert('Failed to save order: ' + error.message);
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete this image?`)) return;

    const urlObj = new URL(item.image_url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/gallery\/(.+)/);
    if (pathMatch) {
      await supabase.storage.from('gallery').remove([pathMatch[1]]);
    }

    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', item.id);

    if (error) {
      alert('Delete failed: ' + error.message);
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleTitleUpdate = async (id, title) => {
    await supabase
      .from('gallery_items')
      .update({ title })
      .eq('id', id);

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, title } : i))
    );
  };

  if (!authed) {
    return (
      <div className="admin-login-page">
        <form onSubmit={handleLogin} className="admin-login-form">
          <img src="/logo.png" alt="Logo" className="admin-login-logo" />
          <h1>Gallery Admin</h1>
          <p>Enter the admin password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {pwError && <div className="admin-login-error">Wrong password</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Gallery Admin</h1>
          <p>{items.length} images {saving && '— Saving...'}</p>
        </div>
        <a href="/" className="admin-back">← Back to site</a>
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <h2>Upload New Image</h2>
          <ImageUpload onUploaded={fetchItems} />
        </div>

        <div className="admin-main">
          <h2>Gallery Order <span className="admin-hint">(drag to reorder)</span></h2>
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : items.length === 0 ? (
            <div className="admin-empty">No images yet. Upload your first one!</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="gallery-list">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="admin-list"
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`admin-item ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="admin-item-handle"
                            >
                              ⠿
                            </div>
                            <img
                              src={item.image_url}
                              alt={item.title || ''}
                              className="admin-item-thumb"
                            />
                            <div className="admin-item-info">
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) =>
                                  handleTitleUpdate(item.id, e.target.value)
                                }
                                placeholder="Title (optional)"
                                className="admin-item-title-input"
                              />
                              <span className="admin-item-order">#{index + 1}</span>
                            </div>
                            <button
                              onClick={() => handleDelete(item)}
                              className="admin-item-delete"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}
