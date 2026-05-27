-- Migration v5: tear down the manual reviews table.
-- The curated parent-reviews block on Contact has been removed in
-- preparation for a Google Places API integration. Run this manually
-- after the merge to drop the now-unused table.

DROP TABLE IF EXISTS reviews CASCADE;
