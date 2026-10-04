-- Migration 0007: fix breed weight/height units.
--
-- Migration 0005 seeded 16 breeds with IMPERIAL values (lbs / inches) but did
-- not set weight_unit / height_unit, so they fell back to the schema defaults
-- ('kg' / 'cm'). This made every breed page show e.g. "55–80 kg" for a
-- Labrador that actually weighs 55–80 lbs.
--
-- This corrects the unit labels to match the stored imperial values.

UPDATE breeds
SET weight_unit = 'lbs', height_unit = 'inches'
WHERE slug IN (
  'golden-retriever',
  'labrador-retriever',
  'german-shepherd',
  'french-bulldog',
  'poodle',
  'persian-cat',
  'maine-coon',
  'siamese-cat',
  'bulldog',
  'beagle',
  'siberian-husky',
  'ragdoll',
  'british-shorthair',
  'holland-lop',
  'cockatiel',
  'quarter-horse'
);
