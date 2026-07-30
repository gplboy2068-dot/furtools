
-- pet_deworming
CREATE TABLE public.pet_deworming (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  medicine text NOT NULL,
  dose text,
  administered_on date NOT NULL DEFAULT CURRENT_DATE,
  next_due_date date,
  notes text,
  document_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_deworming_pet_idx ON public.pet_deworming(pet_id);
CREATE INDEX pet_deworming_user_idx ON public.pet_deworming(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_deworming TO authenticated;
GRANT ALL ON public.pet_deworming TO service_role;
ALTER TABLE public.pet_deworming ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own deworming" ON public.pet_deworming FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pet_deworming_updated BEFORE UPDATE ON public.pet_deworming FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pet_grooming
CREATE TABLE public.pet_grooming (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  service_type text NOT NULL,
  performed_on date NOT NULL DEFAULT CURRENT_DATE,
  next_due_date date,
  groomer text,
  cost numeric,
  currency text DEFAULT 'USD',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_grooming_pet_idx ON public.pet_grooming(pet_id);
CREATE INDEX pet_grooming_user_idx ON public.pet_grooming(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_grooming TO authenticated;
GRANT ALL ON public.pet_grooming TO service_role;
ALTER TABLE public.pet_grooming ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own grooming" ON public.pet_grooming FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pet_grooming_updated BEFORE UPDATE ON public.pet_grooming FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pet_expenses
CREATE TABLE public.pet_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  spent_on date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  notes text,
  receipt_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_expenses_pet_idx ON public.pet_expenses(pet_id);
CREATE INDEX pet_expenses_user_idx ON public.pet_expenses(user_id);
CREATE INDEX pet_expenses_date_idx ON public.pet_expenses(spent_on DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_expenses TO authenticated;
GRANT ALL ON public.pet_expenses TO service_role;
ALTER TABLE public.pet_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own expenses" ON public.pet_expenses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pet_expenses_updated BEFORE UPDATE ON public.pet_expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pet_travel
CREATE TABLE public.pet_travel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  transport text,
  vaccination_checked boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_travel_pet_idx ON public.pet_travel(pet_id);
CREATE INDEX pet_travel_user_idx ON public.pet_travel(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_travel TO authenticated;
GRANT ALL ON public.pet_travel TO service_role;
ALTER TABLE public.pet_travel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own travel" ON public.pet_travel FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pet_travel_updated BEFORE UPDATE ON public.pet_travel FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pet_journal
CREATE TABLE public.pet_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  mood text,
  entry text NOT NULL,
  tags text[],
  photo_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_journal_pet_idx ON public.pet_journal(pet_id);
CREATE INDEX pet_journal_user_idx ON public.pet_journal(user_id);
CREATE INDEX pet_journal_date_idx ON public.pet_journal(entry_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_journal TO authenticated;
GRANT ALL ON public.pet_journal TO service_role;
ALTER TABLE public.pet_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own journal" ON public.pet_journal FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pet_journal_updated BEFORE UPDATE ON public.pet_journal FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
