
-- Extend pets table
ALTER TABLE public.pets
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS is_mixed_breed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS secondary_breed text,
  ADD COLUMN IF NOT EXISTS height numeric,
  ADD COLUMN IF NOT EXISTS height_unit text NOT NULL DEFAULT 'in',
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS microchip_number text,
  ADD COLUMN IF NOT EXISTS neutered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS adoption_date date,
  ADD COLUMN IF NOT EXISTS breeder_shelter text,
  ADD COLUMN IF NOT EXISTS favorite_toy text,
  ADD COLUMN IF NOT EXISTS favorite_food text,
  ADD COLUMN IF NOT EXISTS medical_notes text;

-- Vaccinations
CREATE TABLE IF NOT EXISTS public.pet_vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  given_at date,
  next_due_at date,
  veterinarian text,
  clinic text,
  notes text,
  certificate_path text,
  completed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_vaccinations_pet_idx ON public.pet_vaccinations(pet_id, next_due_at);
CREATE INDEX IF NOT EXISTS pet_vaccinations_user_idx ON public.pet_vaccinations(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_vaccinations TO authenticated;
GRANT ALL ON public.pet_vaccinations TO service_role;
ALTER TABLE public.pet_vaccinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own vaccinations" ON public.pet_vaccinations
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_vaccinations_set_updated_at BEFORE UPDATE ON public.pet_vaccinations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Medications
CREATE TABLE IF NOT EXISTS public.pet_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  purpose text,
  dosage text,
  frequency text,
  morning boolean NOT NULL DEFAULT false,
  afternoon boolean NOT NULL DEFAULT false,
  night boolean NOT NULL DEFAULT false,
  start_date date,
  end_date date,
  prescription_path text,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_medications_pet_idx ON public.pet_medications(pet_id, active);
CREATE INDEX IF NOT EXISTS pet_medications_user_idx ON public.pet_medications(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_medications TO authenticated;
GRANT ALL ON public.pet_medications TO service_role;
ALTER TABLE public.pet_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own medications" ON public.pet_medications
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_medications_set_updated_at BEFORE UPDATE ON public.pet_medications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Allergies
CREATE TABLE IF NOT EXISTS public.pet_allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  allergen text NOT NULL,
  allergen_type text NOT NULL DEFAULT 'food',
  severity text NOT NULL DEFAULT 'mild',
  symptoms text,
  emergency_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_allergies_pet_idx ON public.pet_allergies(pet_id);
CREATE INDEX IF NOT EXISTS pet_allergies_user_idx ON public.pet_allergies(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_allergies TO authenticated;
GRANT ALL ON public.pet_allergies TO service_role;
ALTER TABLE public.pet_allergies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own allergies" ON public.pet_allergies
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_allergies_set_updated_at BEFORE UPDATE ON public.pet_allergies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Vet visits
CREATE TABLE IF NOT EXISTS public.pet_vet_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  visited_at date NOT NULL DEFAULT CURRENT_DATE,
  clinic text,
  doctor text,
  reason text,
  diagnosis text,
  treatment text,
  prescription_path text,
  invoice_path text,
  notes text,
  follow_up_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_vet_visits_pet_idx ON public.pet_vet_visits(pet_id, visited_at DESC);
CREATE INDEX IF NOT EXISTS pet_vet_visits_user_idx ON public.pet_vet_visits(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_vet_visits TO authenticated;
GRANT ALL ON public.pet_vet_visits TO service_role;
ALTER TABLE public.pet_vet_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own vet visits" ON public.pet_vet_visits
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_vet_visits_set_updated_at BEFORE UPDATE ON public.pet_vet_visits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Documents
CREATE TABLE IF NOT EXISTS public.pet_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title text NOT NULL,
  doc_type text NOT NULL DEFAULT 'other',
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_documents_pet_idx ON public.pet_documents(pet_id);
CREATE INDEX IF NOT EXISTS pet_documents_user_idx ON public.pet_documents(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_documents TO authenticated;
GRANT ALL ON public.pet_documents TO service_role;
ALTER TABLE public.pet_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own pet documents" ON public.pet_documents
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pet_documents_set_updated_at BEFORE UPDATE ON public.pet_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
