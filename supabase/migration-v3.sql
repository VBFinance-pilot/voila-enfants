-- Migration v3: hero_images table
-- Manages section hero/background images from admin panel

CREATE TABLE IF NOT EXISTS hero_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name text UNIQUE NOT NULL,
  image_url text NOT NULL DEFAULT '',
  alt_text text,
  updated_at timestamptz DEFAULT now()
);

-- Seed default sections
INSERT INTO hero_images (section_name, image_url, alt_text) VALUES
  ('activities_hero', '', 'Activities'),
  ('oyako_hero', '', 'Oyako Hiroba'),
  ('main_hero', '', 'Voilà les enfants')
ON CONFLICT (section_name) DO NOTHING;

-- RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_images_public_read"  ON hero_images FOR SELECT USING (true);
CREATE POLICY "hero_images_anon_insert"  ON hero_images FOR INSERT WITH CHECK (true);
CREATE POLICY "hero_images_anon_update"  ON hero_images FOR UPDATE USING (true);
CREATE POLICY "hero_images_anon_delete"  ON hero_images FOR DELETE USING (true);
