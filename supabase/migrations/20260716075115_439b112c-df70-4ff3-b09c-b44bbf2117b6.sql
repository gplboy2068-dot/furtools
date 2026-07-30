CREATE TABLE public.generated_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species text NOT NULL,
  vibe text NOT NULL,
  name text NOT NULL,
  name_key text GENERATED ALWAYS AS (lower(name)) STORED,
  meaning text,
  source text NOT NULL DEFAULT 'ai',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (species, vibe, name_key)
);

CREATE INDEX generated_names_species_vibe_idx ON public.generated_names (species, vibe, created_at DESC);

GRANT SELECT ON public.generated_names TO anon, authenticated;
GRANT ALL ON public.generated_names TO service_role;

ALTER TABLE public.generated_names ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read generated names"
  ON public.generated_names FOR SELECT
  USING (true);