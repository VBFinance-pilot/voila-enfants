-- ============================================================
-- Voilà les enfants — Gallery migration
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (anyone can view gallery)
CREATE POLICY "Gallery items are publicly readable"
  ON gallery_items FOR SELECT
  USING (true);

-- 4. Allow inserts with anon key (admin page uses client-side auth)
CREATE POLICY "Allow insert gallery items"
  ON gallery_items FOR INSERT
  WITH CHECK (true);

-- 5. Allow updates with anon key
CREATE POLICY "Allow update gallery items"
  ON gallery_items FOR UPDATE
  USING (true);

-- 6. Allow deletes with anon key
CREATE POLICY "Allow delete gallery items"
  ON gallery_items FOR DELETE
  USING (true);

-- 7. Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Allow public read access to gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- 9. Allow upload to gallery bucket
CREATE POLICY "Allow upload to gallery bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery');

-- 10. Allow delete from gallery bucket
CREATE POLICY "Allow delete from gallery bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery');
