
-- Site-wide key/value settings (SEO defaults, ads config, affiliate config, general)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general',
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Global FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  scope text NOT NULL DEFAULT 'global', -- global, tool, breed, food, page
  scope_ref text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published faqs" ON public.faqs FOR SELECT USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Internal linking rules
CREATE TABLE public.internal_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  title text,
  enabled boolean NOT NULL DEFAULT true,
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.internal_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_links TO authenticated;
GRANT ALL ON public.internal_links TO service_role;
ALTER TABLE public.internal_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads enabled links" ON public.internal_links FOR SELECT USING (enabled OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage links" ON public.internal_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER internal_links_updated BEFORE UPDATE ON public.internal_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ad placements
CREATE TABLE public.ads_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot text NOT NULL, -- header, sidebar, in-article, footer, tool-top, tool-bottom
  name text NOT NULL,
  provider text NOT NULL DEFAULT 'adsense', -- adsense, custom, direct
  code text, -- HTML/JS snippet or ad unit id
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ads_placements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads_placements TO authenticated;
GRANT ALL ON public.ads_placements TO service_role;
ALTER TABLE public.ads_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads enabled ads" ON public.ads_placements FOR SELECT USING (enabled OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ads" ON public.ads_placements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER ads_placements_updated BEFORE UPDATE ON public.ads_placements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Affiliate links
CREATE TABLE public.affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  merchant text NOT NULL,
  product_type text, -- food, toy, grooming, insurance, other
  target_url text NOT NULL,
  short_slug text UNIQUE,
  commission_rate numeric,
  clicks int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.affiliate_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_links TO authenticated;
GRANT ALL ON public.affiliate_links TO service_role;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads enabled affiliates" ON public.affiliate_links FOR SELECT USING (enabled OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage affiliates" ON public.affiliate_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER affiliate_links_updated BEFORE UPDATE ON public.affiliate_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  status text NOT NULL DEFAULT 'subscribed', -- subscribed, unsubscribed, bounced
  source text,
  tags text[] DEFAULT '{}',
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Email templates
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage templates" ON public.email_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER email_templates_updated BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Tool overrides (metadata layered on top of code registry)
CREATE TABLE public.tool_overrides (
  slug text PRIMARY KEY,
  title_override text,
  description_override text,
  seo_title text,
  seo_description text,
  featured boolean NOT NULL DEFAULT false,
  disabled boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tool_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_overrides TO authenticated;
GRANT ALL ON public.tool_overrides TO service_role;
ALTER TABLE public.tool_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads tool overrides" ON public.tool_overrides FOR SELECT USING (true);
CREATE POLICY "Admins manage tool overrides" ON public.tool_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tool_overrides_updated BEFORE UPDATE ON public.tool_overrides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Category overrides
CREATE TABLE public.category_overrides (
  slug text PRIMARY KEY,
  title_override text,
  description_override text,
  seo_title text,
  seo_description text,
  featured boolean NOT NULL DEFAULT false,
  disabled boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.category_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_overrides TO authenticated;
GRANT ALL ON public.category_overrides TO service_role;
ALTER TABLE public.category_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads category overrides" ON public.category_overrides FOR SELECT USING (true);
CREATE POLICY "Admins manage category overrides" ON public.category_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER category_overrides_updated BEFORE UPDATE ON public.category_overrides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Media library (records; can store external URLs or Supabase storage paths)
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  storage_path text,
  mime_type text,
  width int,
  height int,
  size_bytes int,
  alt_text text,
  tags text[] DEFAULT '{}',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins manage media" ON public.media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Analytics events (simple pageview log)
CREATE TABLE public.analytics_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL DEFAULT 'pageview',
  path text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read events" ON public.analytics_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default settings rows
INSERT INTO public.site_settings (key, value, category, description) VALUES
  ('seo.defaults', '{"title":"FurTools — Free Pet Care Calculators & Tools","description":"300+ free tools for dog and cat parents. Calculators, generators, guides.","og_image":""}'::jsonb, 'seo', 'Default SEO meta'),
  ('site.general', '{"site_name":"FurTools","tagline":"Warm tools for happy pets","support_email":"hello@furtools.app"}'::jsonb, 'general', 'General site info'),
  ('search_console.property', '{"site_url":""}'::jsonb, 'integrations', 'Google Search Console property'),
  ('ads.global', '{"enabled":false,"adsense_client":""}'::jsonb, 'ads', 'Global ads config'),
  ('affiliate.global', '{"disclosure":"As an affiliate, we may earn from qualifying purchases."}'::jsonb, 'affiliate', 'Global affiliate settings'),
  ('newsletter.settings', '{"provider":"internal","from_email":"hello@furtools.app","welcome_template":"welcome"}'::jsonb, 'newsletter', 'Newsletter config')
ON CONFLICT (key) DO NOTHING;
