-- ==========================================
-- FurTools Platform - Complete Database Schema
-- Paste and run this entire file in Supabase SQL Editor
-- ==========================================

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated, service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Profiles full access" ON public.profiles;
CREATE POLICY "Profiles full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO anon, authenticated, service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Roles access" ON public.user_roles;
DROP POLICY IF EXISTS "User roles full access" ON public.user_roles;
CREATE POLICY "User roles full access" ON public.user_roles FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon, authenticated, service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts access" ON public.blog_posts;
CREATE POLICY "Blog posts access" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts(published, published_at DESC);

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Breeds
CREATE TABLE IF NOT EXISTS public.breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  species TEXT NOT NULL,
  origin TEXT,
  temperament TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.breeds TO anon, authenticated, service_role;
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Breeds access" ON public.breeds;
CREATE POLICY "Breeds access" ON public.breeds FOR ALL USING (true) WITH CHECK (true);

-- Foods
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  safety_status TEXT NOT NULL DEFAULT 'safe',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.foods TO anon, authenticated, service_role;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Foods access" ON public.foods;
CREATE POLICY "Foods access" ON public.foods FOR ALL USING (true) WITH CHECK (true);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO anon, authenticated, service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "FAQs access" ON public.faqs;
CREATE POLICY "FAQs access" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'subscribed',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO anon, authenticated, service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Newsletter access" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter access" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  category TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated, service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings access" ON public.site_settings;
CREATE POLICY "Site settings access" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Pets & Care Logs
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  weight NUMERIC,
  birthdate DATE,
  weight_unit TEXT DEFAULT 'lbs',
  avatar_url TEXT,
  gender TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO anon, authenticated, service_role;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Pets access" ON public.pets;
CREATE POLICY "Pets access" ON public.pets FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.pet_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  log_type TEXT NOT NULL,
  notes TEXT,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_health_logs TO anon, authenticated, service_role;
ALTER TABLE public.pet_health_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Pet logs access" ON public.pet_health_logs;
CREATE POLICY "Pet logs access" ON public.pet_health_logs FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.pet_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_reminders TO anon, authenticated, service_role;
ALTER TABLE public.pet_reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Pet reminders access" ON public.pet_reminders;
CREATE POLICY "Pet reminders access" ON public.pet_reminders FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  target_url TEXT NOT NULL,
  title TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_links TO anon, authenticated, service_role;
ALTER TABLE public.internal_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Internal links access" ON public.internal_links;
CREATE POLICY "Internal links access" ON public.internal_links FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.ads_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads_placements TO anon, authenticated, service_role;
ALTER TABLE public.ads_placements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ads placements access" ON public.ads_placements;
CREATE POLICY "Ads placements access" ON public.ads_placements FOR ALL USING (true) WITH CHECK (true);

-- Tool Overrides & Category Overrides
CREATE TABLE IF NOT EXISTS public.tool_overrides (
  slug TEXT PRIMARY KEY,
  title_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  disabled BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_overrides TO anon, authenticated, service_role;
ALTER TABLE public.tool_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tool overrides access" ON public.tool_overrides;
CREATE POLICY "Tool overrides access" ON public.tool_overrides FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.category_overrides (
  slug TEXT PRIMARY KEY,
  name_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  disabled BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_overrides TO anon, authenticated, service_role;
ALTER TABLE public.category_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Category overrides access" ON public.category_overrides;
CREATE POLICY "Category overrides access" ON public.category_overrides FOR ALL USING (true) WITH CHECK (true);

-- Helper Function to Grant Admin Access by Email
CREATE OR REPLACE FUNCTION public.make_user_admin(target_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;
