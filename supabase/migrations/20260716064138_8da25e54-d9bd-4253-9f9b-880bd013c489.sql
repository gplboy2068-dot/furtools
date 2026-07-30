
-- Add species_data JSONB to pets for species-specific fields
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS species_data jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Species catalog table (admin-manageable)
CREATE TABLE IF NOT EXISTS public.species_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  singular text NOT NULL,
  plural text NOT NULL,
  icon text,
  color text,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  live boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.species_catalog TO anon;
GRANT SELECT ON public.species_catalog TO authenticated;
GRANT ALL ON public.species_catalog TO service_role;

ALTER TABLE public.species_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "species_catalog public read" ON public.species_catalog FOR SELECT USING (true);
CREATE POLICY "species_catalog admin write" ON public.species_catalog FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER species_catalog_set_updated_at BEFORE UPDATE ON public.species_catalog
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed all supported species
INSERT INTO public.species_catalog (slug, singular, plural, icon, color, description, sort_order) VALUES
  ('dog','Dog','Dogs','Dog','terracotta','From working shepherds to lap-loving companions.',1),
  ('cat','Cat','Cats','Cat','amber','Long-haired royalty, chatty companions, and gentle giants.',2),
  ('bird','Bird','Birds','Bird','sky','Parrots, finches, cockatiels and more.',3),
  ('rabbit','Rabbit','Rabbits','Rabbit','rose','Lop, angora, dwarf and beyond.',4),
  ('fish','Fish','Fish','Fish','sky','Freshwater and saltwater species.',5),
  ('hamster','Hamster','Hamsters','Squirrel','sage','Syrian, dwarf, and Roborovski.',6),
  ('guinea-pig','Guinea Pig','Guinea Pigs','PawPrint','amber','Sweet, social cavies.',7),
  ('ferret','Ferret','Ferrets','PawPrint','violet','Playful, curious mustelids.',8),
  ('turtle','Turtle','Turtles','PawPrint','sage','Aquatic and terrestrial chelonians.',9),
  ('snake','Snake','Snakes','PawPrint','lime','Ball pythons, corn snakes, and more.',10),
  ('lizard','Lizard','Lizards','PawPrint','lime','Geckos, bearded dragons, and beyond.',11),
  ('horse','Horse','Horses','PawPrint','violet','Draft, sport, and companion horses.',12),
  ('goat','Goat','Goats','PawPrint','sage','Dairy, meat, and pet goats.',13),
  ('sheep','Sheep','Sheep','PawPrint','sage','Wool and companion sheep.',14),
  ('chicken','Chicken','Chickens','PawPrint','amber','Layers, meat, and heritage breeds.',15),
  ('duck','Duck','Ducks','PawPrint','sky','Domestic ducks for eggs and companionship.',16)
ON CONFLICT (slug) DO NOTHING;
