-- ============================================================
-- Voilà les enfants — Admin Panel migration v2
-- Run this in Supabase Dashboard > SQL Editor
-- (Run AFTER migration.sql if not already done)
-- ============================================================

-- 1. oyako_section (single-row config for Oyako Hiroba)
CREATE TABLE IF NOT EXISTS oyako_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE oyako_section ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oyako_section public read" ON oyako_section FOR SELECT USING (true);
CREATE POLICY "oyako_section anon insert" ON oyako_section FOR INSERT WITH CHECK (true);
CREATE POLICY "oyako_section anon update" ON oyako_section FOR UPDATE USING (true);
CREATE POLICY "oyako_section anon delete" ON oyako_section FOR DELETE USING (true);

-- 2. events_items
CREATE TABLE IF NOT EXISTS events_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE events_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_items public read" ON events_items FOR SELECT USING (true);
CREATE POLICY "events_items anon insert" ON events_items FOR INSERT WITH CHECK (true);
CREATE POLICY "events_items anon update" ON events_items FOR UPDATE USING (true);
CREATE POLICY "events_items anon delete" ON events_items FOR DELETE USING (true);

-- 3. services_items
CREATE TABLE IF NOT EXISTS services_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT DEFAULT '📚',
  icon_bg TEXT DEFAULT '#FFF0F5',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE services_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_items public read" ON services_items FOR SELECT USING (true);
CREATE POLICY "services_items anon insert" ON services_items FOR INSERT WITH CHECK (true);
CREATE POLICY "services_items anon update" ON services_items FOR UPDATE USING (true);
CREATE POLICY "services_items anon delete" ON services_items FOR DELETE USING (true);

-- 4. founders_items
CREATE TABLE IF NOT EXISTS founders_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  lang_label TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE founders_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders_items public read" ON founders_items FOR SELECT USING (true);
CREATE POLICY "founders_items anon insert" ON founders_items FOR INSERT WITH CHECK (true);
CREATE POLICY "founders_items anon update" ON founders_items FOR UPDATE USING (true);
CREATE POLICY "founders_items anon delete" ON founders_items FOR DELETE USING (true);

-- 5. videos_items
CREATE TABLE IF NOT EXISTS videos_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_id TEXT,
  video_url TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE videos_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_items public read" ON videos_items FOR SELECT USING (true);
CREATE POLICY "videos_items anon insert" ON videos_items FOR INSERT WITH CHECK (true);
CREATE POLICY "videos_items anon update" ON videos_items FOR UPDATE USING (true);
CREATE POLICY "videos_items anon delete" ON videos_items FOR DELETE USING (true);

-- 6. site_settings (key/value store)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings anon insert" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "site_settings anon update" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "site_settings anon delete" ON site_settings FOR DELETE USING (true);

-- 7. admin_logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_logs public read" ON admin_logs FOR SELECT USING (true);
CREATE POLICY "admin_logs anon insert" ON admin_logs FOR INSERT WITH CHECK (true);
