
-- =====================================================
-- FOODS ("Can My Pet Eat This?")
-- =====================================================
CREATE TABLE public.foods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  image_url text,
  species_safety jsonb NOT NULL DEFAULT '{}'::jsonb, -- {"dog":"safe","cat":"unsafe","rabbit":"moderation"}
  short_answer text NOT NULL DEFAULT '',
  benefits text NOT NULL DEFAULT '',
  risks text NOT NULL DEFAULT '',
  symptoms text NOT NULL DEFAULT '',
  vet_advice text NOT NULL DEFAULT '',
  alternatives text[] NOT NULL DEFAULT '{}',
  related_food_slugs text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  keywords text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX foods_category_idx ON public.foods(category);
CREATE INDEX foods_published_idx ON public.foods(published);

GRANT SELECT ON public.foods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.foods TO authenticated;
GRANT ALL ON public.foods TO service_role;

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published foods are public" ON public.foods FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all foods" ON public.foods FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert foods" ON public.foods FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update foods" ON public.foods FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete foods" ON public.foods FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER foods_set_updated_at BEFORE UPDATE ON public.foods FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- PETS (Care Planner)
-- =====================================================
CREATE TABLE public.pets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL DEFAULT 'dog',
  breed text,
  birthdate date,
  weight numeric,
  weight_unit text NOT NULL DEFAULT 'lbs',
  avatar_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pets_user_id_idx ON public.pets(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO authenticated;
GRANT ALL ON public.pets TO service_role;

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own pets" ON public.pets FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pets_set_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- PET REMINDERS
-- =====================================================
CREATE TABLE public.pet_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'other', -- vaccination | medication | feeding | walking | grooming | other
  title text NOT NULL,
  notes text,
  next_at timestamptz,
  recurrence text, -- daily | weekly | monthly | yearly | null
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_reminders_user_id_idx ON public.pet_reminders(user_id);
CREATE INDEX pet_reminders_pet_id_idx ON public.pet_reminders(pet_id);
CREATE INDEX pet_reminders_next_at_idx ON public.pet_reminders(next_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_reminders TO authenticated;
GRANT ALL ON public.pet_reminders TO service_role;

ALTER TABLE public.pet_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own pet reminders" ON public.pet_reminders FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_reminders_set_updated_at BEFORE UPDATE ON public.pet_reminders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- PET WEIGHT LOGS
-- =====================================================
CREATE TABLE public.pet_weight_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  weight numeric NOT NULL,
  weight_unit text NOT NULL DEFAULT 'lbs',
  logged_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_weight_logs_pet_id_idx ON public.pet_weight_logs(pet_id, logged_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_weight_logs TO authenticated;
GRANT ALL ON public.pet_weight_logs TO service_role;

ALTER TABLE public.pet_weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own weight logs" ON public.pet_weight_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PET HEALTH EVENTS
-- =====================================================
CREATE TABLE public.pet_health_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'note', -- vet_visit | vaccination | diagnosis | medication | injury | note
  title text NOT NULL,
  notes text,
  occurred_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_health_events_pet_id_idx ON public.pet_health_events(pet_id, occurred_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_health_events TO authenticated;
GRANT ALL ON public.pet_health_events TO service_role;

ALTER TABLE public.pet_health_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own health events" ON public.pet_health_events FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_health_events_set_updated_at BEFORE UPDATE ON public.pet_health_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
