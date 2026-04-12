-- Migration v3b: add title + description columns to hero_images
-- Allows Hero Images tab to also manage section text (replaces Oyako tab)

ALTER TABLE hero_images ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE hero_images ADD COLUMN IF NOT EXISTS description text;
