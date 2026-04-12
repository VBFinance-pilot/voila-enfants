import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------- helpers ----------

export async function logAction(action, table_name, details) {
  await supabase.from('admin_logs').insert({ action, table_name, details });
}

// Upload to gallery bucket, return public URL
export async function uploadImage(file, folder = 'photos') {
  const ext = file.name.split('.').pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('gallery').upload(name, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return supabase.storage.from('gallery').getPublicUrl(name).data.publicUrl;
}

// Remove file from gallery bucket by its public URL
export async function removeImage(publicUrl) {
  const m = new URL(publicUrl).pathname.match(/\/storage\/v1\/object\/public\/gallery\/(.+)/);
  if (m) await supabase.storage.from('gallery').remove([m[1]]);
}

// Generic ordered-list helpers
export async function fetchOrdered(table) {
  const { data, error } = await supabase.from(table).select('*').order('order_index');
  if (error) throw error;
  return data ?? [];
}

export async function reorder(table, items) {
  const updates = items.map((item, i) => ({ ...item, order_index: i }));
  const { error } = await supabase.from(table).upsert(updates, { onConflict: 'id' });
  if (error) throw error;
}

export async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateRow(table, id, updates) {
  const { error } = await supabase.from(table).update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
