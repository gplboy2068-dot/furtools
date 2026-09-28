-- Migration: 0001_initial.sql
-- FurTools Platform D1 Initial SQLite Schema

-- 1. Profiles & Roles (Users & Admins)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- 2. Content & Site Overrides
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  updated_by TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tool_overrides (
  slug TEXT PRIMARY KEY,
  title_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured INTEGER DEFAULT 0,
  disabled INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS category_overrides (
  slug TEXT PRIMARY KEY,
  title_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured INTEGER DEFAULT 0,
  disabled INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS species_catalog (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  singular TEXT NOT NULL,
  plural TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  enabled INTEGER DEFAULT 1,
  live INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  config TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_species_catalog_slug ON species_catalog(slug);

-- 3. Breeds & Foods Databases
CREATE TABLE IF NOT EXISTS breeds (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  species TEXT NOT NULL,
  name TEXT NOT NULL,
  hero_image TEXT,
  overview TEXT,
  history TEXT,
  temperament_traits TEXT, -- JSON array
  temperament_description TEXT,
  exercise_level TEXT,
  exercise_description TEXT,
  exercise_minutes_per_day INTEGER,
  weight_min REAL,
  weight_max REAL,
  weight_unit TEXT DEFAULT 'kg',
  height_min REAL,
  height_max REAL,
  height_unit TEXT DEFAULT 'cm',
  lifespan_min REAL,
  lifespan_max REAL,
  common_diseases TEXT, -- JSON array
  nutrition TEXT,
  grooming TEXT,
  grooming_frequency TEXT,
  images TEXT, -- JSON array
  faqs TEXT, -- JSON array
  related_tool_slugs TEXT, -- JSON array
  related_article_slugs TEXT, -- JSON array
  good_with TEXT, -- JSON object
  origin_country TEXT,
  breed_group TEXT,
  coat_type TEXT,
  coat_colors TEXT, -- JSON array
  size_category TEXT,
  energy_level TEXT,
  shedding_level TEXT,
  trainability TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_breeds_slug ON breeds(slug);
CREATE INDEX IF NOT EXISTS idx_breeds_species ON breeds(species);
CREATE INDEX IF NOT EXISTS idx_breeds_published ON breeds(published);

CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  species_safety TEXT, -- JSON object
  short_answer TEXT,
  benefits TEXT,
  risks TEXT,
  symptoms TEXT,
  vet_advice TEXT,
  alternatives TEXT, -- JSON array
  related_food_slugs TEXT, -- JSON array
  faqs TEXT, -- JSON array
  keywords TEXT, -- JSON array
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_foods_slug ON foods(slug);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_published ON foods(published);

-- 4. Blog Posts & FAQs
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  author_id TEXT DEFAULT 'firoz-khan',
  tags TEXT, -- JSON array
  published INTEGER DEFAULT 1,
  published_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  scope TEXT DEFAULT 'global',
  scope_ref TEXT,
  sort_order INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 5. Marketing, SEO & Monetization
CREATE TABLE IF NOT EXISTS ads_placements (
  id TEXT PRIMARY KEY,
  slot TEXT NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'custom',
  code TEXT,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS affiliate_links (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  merchant TEXT NOT NULL,
  target_url TEXT NOT NULL,
  short_slug TEXT UNIQUE,
  product_type TEXT,
  commission_rate REAL,
  notes TEXT,
  clicks INTEGER DEFAULT 0,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS internal_links (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  target_url TEXT NOT NULL,
  title TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'subscribed',
  source TEXT DEFAULT 'website',
  tags TEXT, -- JSON array
  subscribed_at TEXT DEFAULT (datetime('now')),
  unsubscribed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables TEXT, -- JSON array
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  metadata TEXT, -- JSON object
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path ON analytics_events(path);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  tags TEXT, -- JSON array
  uploaded_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS generated_names (
  id TEXT PRIMARY KEY,
  species TEXT NOT NULL,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL,
  vibe TEXT,
  meaning TEXT,
  source TEXT DEFAULT 'generator',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_generated_names_species ON generated_names(species);

-- 6. User Pet Management (My Pets Dashboard)
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  secondary_breed TEXT,
  is_mixed_breed INTEGER DEFAULT 0,
  gender TEXT,
  birthdate TEXT,
  adoption_date TEXT,
  color TEXT,
  weight REAL,
  weight_unit TEXT DEFAULT 'kg',
  height REAL,
  height_unit TEXT DEFAULT 'cm',
  microchip_number TEXT,
  neutered INTEGER DEFAULT 0,
  avatar_url TEXT,
  favorite_food TEXT,
  favorite_toy TEXT,
  breeder_shelter TEXT,
  medical_notes TEXT,
  notes TEXT,
  species_data TEXT, -- JSON object
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

CREATE TABLE IF NOT EXISTS pet_health_events (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  occurred_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_health_events_pet_id ON pet_health_events(pet_id);

CREATE TABLE IF NOT EXISTS pet_vaccinations (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  vaccine_name TEXT NOT NULL,
  given_at TEXT NOT NULL,
  next_due_at TEXT,
  clinic TEXT,
  veterinarian TEXT,
  certificate_path TEXT,
  notes TEXT,
  completed INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_vaccinations_pet_id ON pet_vaccinations(pet_id);

CREATE TABLE IF NOT EXISTS pet_medications (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  medicine_name TEXT NOT NULL,
  purpose TEXT,
  dosage TEXT,
  frequency TEXT,
  morning INTEGER DEFAULT 0,
  afternoon INTEGER DEFAULT 0,
  night INTEGER DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT,
  prescription_path TEXT,
  notes TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_medications_pet_id ON pet_medications(pet_id);

CREATE TABLE IF NOT EXISTS pet_weight_logs (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  weight REAL NOT NULL,
  weight_unit TEXT DEFAULT 'kg',
  logged_at TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_weight_logs_pet_id ON pet_weight_logs(pet_id);

CREATE TABLE IF NOT EXISTS pet_vet_visits (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  visited_at TEXT NOT NULL,
  clinic TEXT,
  doctor TEXT,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  follow_up_at TEXT,
  invoice_path TEXT,
  prescription_path TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_vet_visits_pet_id ON pet_vet_visits(pet_id);

CREATE TABLE IF NOT EXISTS pet_reminders (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'general',
  next_at TEXT NOT NULL,
  recurrence TEXT DEFAULT 'none',
  completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_reminders_user_id ON pet_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_reminders_pet_id ON pet_reminders(pet_id);

CREATE TABLE IF NOT EXISTS pet_allergies (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  allergen TEXT NOT NULL,
  allergen_type TEXT,
  severity TEXT,
  symptoms TEXT,
  emergency_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pet_allergies_pet_id ON pet_allergies(pet_id);

CREATE TABLE IF NOT EXISTS pet_documents (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  doc_type TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_expenses (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  user_id TEXT NOT NULL,
  spent_on TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  vendor TEXT,
  receipt_path TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_grooming (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  performed_on TEXT NOT NULL,
  service_type TEXT NOT NULL,
  groomer TEXT,
  cost REAL,
  currency TEXT DEFAULT 'USD',
  next_due_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_deworming (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  administered_on TEXT NOT NULL,
  medicine TEXT NOT NULL,
  dose TEXT,
  next_due_date TEXT,
  document_path TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_journal (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  entry_date TEXT NOT NULL,
  entry TEXT NOT NULL,
  mood TEXT,
  photo_path TEXT,
  tags TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_travel (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  transport TEXT,
  vaccination_checked INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
