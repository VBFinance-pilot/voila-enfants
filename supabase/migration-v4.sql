-- Migration v4: reviews table + Google business settings
-- Curated parent reviews displayed on the Contact section, plus Google
-- rating / review count / Maps URLs surfaced from site_settings.

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  review_date text,
  language text,
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews anon insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews anon update" ON reviews FOR UPDATE USING (true);
CREATE POLICY "reviews anon delete" ON reviews FOR DELETE USING (true);

-- Pre-fill Google business settings (idempotent).
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('google_rating', '4.9', now()),
  ('google_review_count', '13', now()),
  ('google_maps_url', 'https://maps.app.goo.gl/bs3uAzJ829STXSN48', now()),
  ('google_maps_embed_src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d667.7026456815657!2d135.66460691877944!3d34.97627562419339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001012efd62eacb%3A0xb8c3da992b45ad3c!2zVm9pbMOgIGxlcyBlbmZhbnRzIOiLseiqnuOBp0Hjgq_jg4bjgqPjg5Pjg4bjgqNT4p2j77iP!5e0!3m2!1sfr!2sjp!4v1779884209109!5m2!1sfr!2sjp', now())
ON CONFLICT (key) DO NOTHING;
