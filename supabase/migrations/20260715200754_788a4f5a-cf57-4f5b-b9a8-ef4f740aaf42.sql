
CREATE TABLE public.breeds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  species text NOT NULL,
  name text NOT NULL,
  hero_image text,
  overview text NOT NULL DEFAULT '',
  history text NOT NULL DEFAULT '',
  temperament_traits text[] NOT NULL DEFAULT '{}',
  temperament_description text NOT NULL DEFAULT '',
  exercise_level text NOT NULL DEFAULT 'medium',
  exercise_description text NOT NULL DEFAULT '',
  exercise_minutes_per_day int,
  weight_min numeric,
  weight_max numeric,
  weight_unit text NOT NULL DEFAULT 'lbs',
  height_min numeric,
  height_max numeric,
  height_unit text NOT NULL DEFAULT 'in',
  lifespan_min int,
  lifespan_max int,
  common_diseases jsonb NOT NULL DEFAULT '[]'::jsonb,
  nutrition text NOT NULL DEFAULT '',
  grooming text NOT NULL DEFAULT '',
  grooming_frequency text,
  images text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_tool_slugs text[] NOT NULL DEFAULT '{}',
  related_article_slugs text[] NOT NULL DEFAULT '{}',
  good_with jsonb NOT NULL DEFAULT '{}'::jsonb,
  origin_country text,
  breed_group text,
  coat_type text,
  coat_colors text[] NOT NULL DEFAULT '{}',
  size_category text,
  energy_level text,
  shedding_level text,
  trainability text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX breeds_species_idx ON public.breeds(species);
CREATE INDEX breeds_published_idx ON public.breeds(published);

GRANT SELECT ON public.breeds TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.breeds TO authenticated;
GRANT ALL ON public.breeds TO service_role;

ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published breeds are public"
  ON public.breeds FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all breeds"
  ON public.breeds FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert breeds"
  ON public.breeds FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update breeds"
  ON public.breeds FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete breeds"
  ON public.breeds FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER breeds_set_updated_at
  BEFORE UPDATE ON public.breeds
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed with representative breeds across dog and cat species
INSERT INTO public.breeds (
  slug, species, name, overview, history, temperament_traits, temperament_description,
  exercise_level, exercise_description, exercise_minutes_per_day,
  weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
  common_diseases, nutrition, grooming, grooming_frequency,
  faqs, related_tool_slugs, good_with, origin_country, breed_group,
  coat_type, coat_colors, size_category, energy_level, shedding_level, trainability
) VALUES
(
  'golden-retriever', 'dog', 'Golden Retriever',
  'The Golden Retriever is a friendly, intelligent, and devoted sporting dog known for its luxurious golden coat and gentle disposition. They rank among the most popular family dogs worldwide.',
  'Developed in the Scottish Highlands in the mid-19th century by Lord Tweedmouth, the Golden Retriever was bred to retrieve waterfowl for hunters. The breed combines Tweed Water Spaniel, Yellow Retriever, Irish Setter, and Bloodhound lineage.',
  ARRAY['Friendly','Intelligent','Devoted','Gentle','Playful'],
  'Goldens are famously good-natured and eager to please, making them excellent family companions, service dogs, and therapy animals. They thrive on human interaction and can become anxious when left alone for long periods.',
  'high', 'Requires 60-90 minutes of daily exercise including walks, swimming, fetch, and mental stimulation. They excel at agility, obedience, and retrieving games.', 75,
  55, 75, 21.5, 24, 10, 12,
  '[{"name":"Hip Dysplasia","description":"A hereditary condition where the hip joint doesn''t develop properly."},{"name":"Elbow Dysplasia","description":"Abnormal development of the elbow joint causing lameness."},{"name":"Cancer","description":"Goldens have a higher-than-average risk of lymphoma and hemangiosarcoma."},{"name":"Progressive Retinal Atrophy","description":"A degenerative eye condition that can lead to blindness."}]'::jsonb,
  'Feed high-quality large-breed dog food, 2-3 cups daily split into two meals. Watch portion sizes—Goldens are prone to obesity. Include omega-3 fatty acids for coat and joint health.',
  'Brush 2-3 times per week to manage their double coat, daily during shedding season (spring and fall). Bathe every 6-8 weeks. Regular ear cleaning is essential due to floppy ears.',
  '2-3 times per week',
  '[{"question":"Are Golden Retrievers good with children?","answer":"Yes, Goldens are famously patient and gentle with kids of all ages, making them one of the top family dog choices."},{"question":"How much do Golden Retrievers shed?","answer":"They shed moderately year-round and heavily twice a year during coat blowing season."},{"question":"Are Golden Retrievers easy to train?","answer":"Extremely. Their intelligence and eagerness to please rank them among the top 5 most trainable breeds."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-weight-calculator','dog-walking-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"fair","first_time_owners":"excellent"}'::jsonb,
  'Scotland', 'Sporting',
  'Double coat, water-repellent', ARRAY['Light Golden','Golden','Dark Golden'],
  'large', 'high', 'high', 'very high'
),
(
  'labrador-retriever', 'dog', 'Labrador Retriever',
  'The Labrador Retriever is America''s most popular dog breed—an outgoing, active, and friendly companion known for its versatility as a family dog, service dog, and sporting partner.',
  'Originating in Newfoundland (not Labrador) in the 1500s, these dogs helped fishermen retrieve nets and fish. English nobles refined the breed in the 1800s, and it was recognized by the AKC in 1917.',
  ARRAY['Outgoing','Even Tempered','Gentle','Agile','Intelligent'],
  'Labs are enthusiastic and affectionate, with a puppy-like energy that often lasts into their senior years. They form strong bonds with all family members and adapt well to various living situations.',
  'high', 'Needs at least 60 minutes of vigorous exercise daily. Labs love swimming, fetching, and running. Without adequate exercise, they may become destructive.', 60,
  55, 80, 21.5, 24.5, 10, 12,
  '[{"name":"Hip and Elbow Dysplasia","description":"Common joint conditions in large breeds."},{"name":"Obesity","description":"Labs have a genetic predisposition to overeating and weight gain."},{"name":"Exercise-Induced Collapse","description":"A genetic condition causing loss of muscle control after intense exercise."},{"name":"Progressive Retinal Atrophy","description":"Inherited eye disease affecting vision."}]'::jsonb,
  'Feed 2.5-3 cups of high-quality dog food daily, split into two meals. Measure carefully—Labs will overeat given the chance. Consider joint supplements as they age.',
  'Brush weekly with a slicker brush; increase to daily during heavy shedding seasons. Bathe every 2 months. Their water-resistant double coat needs minimal maintenance otherwise.',
  'Weekly',
  '[{"question":"What are the three Labrador colors?","answer":"Yellow, black, and chocolate—all can appear in the same litter."},{"question":"How long do Labradors live?","answer":"Typically 10-12 years, though many live longer with proper care and weight management."},{"question":"Are Labs good apartment dogs?","answer":"They can adapt if given sufficient daily exercise, but they truly thrive in homes with yards."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-calorie-calculator','dog-bmi-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"good","first_time_owners":"excellent"}'::jsonb,
  'Canada (Newfoundland)', 'Sporting',
  'Short, dense, water-resistant double coat', ARRAY['Black','Yellow','Chocolate'],
  'large', 'high', 'high', 'very high'
),
(
  'german-shepherd', 'dog', 'German Shepherd',
  'The German Shepherd is a large, agile, and muscular breed of noble character and high intelligence. Loyal, confident, and courageous, they are the world''s premier working dog.',
  'Developed in Germany in 1899 by Captain Max von Stephanitz, who sought to create the ideal herding and working dog. The breed quickly proved its versatility in military, police, and service roles.',
  ARRAY['Confident','Courageous','Smart','Loyal','Protective'],
  'German Shepherds are aloof with strangers but deeply devoted to their families. Their intelligence and work ethic make them exceptional at almost any task, but they need clear leadership and socialization.',
  'high', 'Requires 90+ minutes of exercise daily, including both physical activity and mental challenges like obedience training or scent work.', 90,
  50, 90, 22, 26, 9, 13,
  '[{"name":"Hip Dysplasia","description":"Common in the breed due to their size and structure."},{"name":"Degenerative Myelopathy","description":"A progressive spinal cord disease affecting older dogs."},{"name":"Bloat","description":"Life-threatening stomach twisting condition common in deep-chested breeds."},{"name":"Exocrine Pancreatic Insufficiency","description":"Digestive disorder more common in GSDs."}]'::jsonb,
  'Feed 3-4 cups of high-quality large-breed food daily in two meals. Avoid vigorous exercise around mealtimes to reduce bloat risk. Include glucosamine for joint health.',
  'Brush 2-3 times weekly, daily during shedding seasons (they "blow" their coat twice a year). Bathe only when necessary to preserve natural oils.',
  '2-3 times per week',
  '[{"question":"Are German Shepherds good family dogs?","answer":"Yes, when properly socialized from puppyhood. They are protective and loyal to their families."},{"question":"Do German Shepherds shed a lot?","answer":"Yes, they are heavy shedders year-round with two major shedding seasons."},{"question":"Are German Shepherds aggressive?","answer":"Not inherently. They are protective but well-bred, well-socialized GSDs are stable and confident, not aggressive."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-walking-calculator','dog-vaccination-schedule'],
  '{"children":"good","other_pets":"good","apartments":"poor","first_time_owners":"fair"}'::jsonb,
  'Germany', 'Herding',
  'Double coat, medium length', ARRAY['Black and Tan','Sable','Black','All Black','White'],
  'large', 'very high', 'very high', 'very high'
),
(
  'french-bulldog', 'dog', 'French Bulldog',
  'The French Bulldog is a small, muscular companion breed with distinctive bat ears and a smushed face. They''re playful, adaptable, and excellent city dogs.',
  'Bred in 1800s England as miniature bulldogs, they traveled with lace workers to France during the Industrial Revolution, where they became beloved by Parisian society and earned their name.',
  ARRAY['Playful','Smart','Adaptable','Affectionate','Alert'],
  'Frenchies are charming clowns who adore their people. They''re relatively quiet, don''t require much exercise, and get along well with other pets.',
  'low', 'Short walks (20-30 minutes total) and indoor play. Avoid heat and strenuous exercise—their flat faces make breathing difficult.', 25,
  16, 28, 11, 13, 10, 12,
  '[{"name":"Brachycephalic Obstructive Airway Syndrome","description":"Breathing difficulties due to their flat facial structure."},{"name":"Hip Dysplasia","description":"Joint condition affecting mobility."},{"name":"Intervertebral Disc Disease","description":"Spinal problems common in the breed."},{"name":"Heat Sensitivity","description":"Cannot regulate body temperature well; prone to heatstroke."}]'::jsonb,
  'Feed 1-1.5 cups of high-quality small-breed food daily. Use slow-feed bowls to prevent gulping and gas. Watch calories closely—they gain weight easily.',
  'Brush weekly with a soft brush. Clean facial folds daily to prevent infection. Bathe monthly. Regular nail trims are essential.',
  'Weekly',
  '[{"question":"Can French Bulldogs swim?","answer":"No—their heavy front-heavy build and flat faces make swimming dangerous. Always supervise near water."},{"question":"Do French Bulldogs bark a lot?","answer":"No, they are relatively quiet dogs, making them great apartment companions."},{"question":"Why are French Bulldogs so expensive?","answer":"They require artificial insemination and C-section deliveries due to their body structure, driving up breeding costs."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-weight-calculator'],
  '{"children":"excellent","other_pets":"good","apartments":"excellent","first_time_owners":"excellent"}'::jsonb,
  'France/England', 'Non-Sporting',
  'Short, smooth, single coat', ARRAY['Brindle','Fawn','White','Cream','Pied'],
  'small', 'low', 'low', 'medium'
),
(
  'poodle', 'dog', 'Poodle',
  'The Poodle is an elegant, intelligent breed available in three sizes (Standard, Miniature, and Toy). Despite their fancy appearance, they are athletic, versatile, and highly trainable.',
  'Originally bred in Germany as water retrievers (the name comes from "pudel" meaning "to splash"), Poodles were refined in France where they became the national breed.',
  ARRAY['Intelligent','Active','Alert','Faithful','Trainable'],
  'Poodles are one of the most intelligent breeds, quick learners who excel at obedience and agility. They form strong bonds with their families and can be aloof with strangers.',
  'high', 'Standard Poodles need 60+ minutes daily; smaller varieties need 30-45 minutes. All sizes benefit from mental stimulation and swimming.', 60,
  6, 70, 10, 22, 12, 15,
  '[{"name":"Hip Dysplasia","description":"More common in Standard Poodles."},{"name":"Addison''s Disease","description":"Adrenal gland disorder affecting hormone production."},{"name":"Progressive Retinal Atrophy","description":"Degenerative eye condition."},{"name":"Bloat","description":"Life-threatening condition in Standard Poodles."}]'::jsonb,
  'Feed high-quality food appropriate to size: 1/4-1/2 cup for Toys, 3/4-1 cup for Miniatures, 1.5-3 cups for Standards. Divide into two meals.',
  'Poodles have hair, not fur, and require professional grooming every 4-6 weeks. Brush daily to prevent matting. They shed minimally.',
  'Daily brushing, professional groom every 4-6 weeks',
  '[{"question":"Are Poodles hypoallergenic?","answer":"No dog is truly hypoallergenic, but Poodles produce less dander and are often tolerated by allergy sufferers."},{"question":"What are the three Poodle sizes?","answer":"Standard (over 15 inches), Miniature (10-15 inches), and Toy (under 10 inches)."},{"question":"Are Poodles good family dogs?","answer":"Yes, especially Standards. They''re gentle, trainable, and playful with children."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-walking-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}'::jsonb,
  'Germany/France', 'Non-Sporting',
  'Curly, dense, single coat (hair)', ARRAY['Black','White','Apricot','Silver','Brown','Cream','Blue'],
  'varies', 'high', 'very low', 'very high'
),
(
  'bulldog', 'dog', 'Bulldog',
  'The English Bulldog is a medium-sized, muscular dog with a distinctive wrinkled face and pushed-in nose. Despite their sour appearance, they''re affectionate, docile, and courageous companions.',
  'Descended from ancient mastiff-type dogs, Bulldogs were originally bred for bull-baiting in 13th-century England. After the sport was banned in 1835, breeders transformed them into gentle companions.',
  ARRAY['Docile','Willful','Friendly','Gregarious','Courageous'],
  'Bulldogs are gentle, patient, and love human company. They can be stubborn but are rarely aggressive. They''re content with a relaxed lifestyle.',
  'low', 'Short, gentle walks and light play. Avoid heat and overexertion due to their brachycephalic structure.', 20,
  40, 50, 14, 15, 8, 10,
  '[{"name":"Brachycephalic Syndrome","description":"Breathing problems from flat face structure."},{"name":"Hip Dysplasia","description":"Common joint issue in the breed."},{"name":"Skin Fold Dermatitis","description":"Infections in facial and tail folds."},{"name":"Cherry Eye","description":"Prolapse of the third eyelid gland."}]'::jsonb,
  'Feed 1.5-2 cups of quality food daily. Bulldogs gain weight easily—strict portion control is essential.',
  'Brush weekly. Clean facial wrinkles daily with a damp cloth. Check tail pocket regularly. Bathe monthly.',
  'Weekly, with daily wrinkle cleaning',
  '[{"question":"How long do Bulldogs live?","answer":"Typically 8-10 years, shorter than many breeds due to their genetic health issues."},{"question":"Can Bulldogs give birth naturally?","answer":"Most require C-sections due to the puppies'' large heads and mothers'' narrow hips."},{"question":"Are Bulldogs good with kids?","answer":"Yes, they are famously patient and gentle with children."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-weight-calculator'],
  '{"children":"excellent","other_pets":"good","apartments":"excellent","first_time_owners":"good"}'::jsonb,
  'England', 'Non-Sporting',
  'Short, smooth, fine coat', ARRAY['White','Fawn','Brindle','Red','Piebald'],
  'medium', 'low', 'medium', 'medium'
),
(
  'beagle', 'dog', 'Beagle',
  'The Beagle is a small to medium-sized hound with a keen sense of smell, cheerful disposition, and boundless curiosity. They''re one of the most popular family dogs in America.',
  'Modern Beagles were developed in England during the 1830s as scent hounds for hunting rabbits and hares. Their name may derive from the French "be''geule" (open throat) referring to their distinctive baying.',
  ARRAY['Friendly','Curious','Merry','Determined','Gentle'],
  'Beagles are pack animals who thrive on companionship. They''re playful, energetic, and follow their noses everywhere—which means they need secure fences.',
  'medium', 'Needs 60 minutes of exercise daily. Beagles love sniffing walks and scent games. Off-leash time only in secure areas.', 60,
  20, 30, 13, 15, 10, 15,
  '[{"name":"Epilepsy","description":"Seizure disorder relatively common in Beagles."},{"name":"Hypothyroidism","description":"Underactive thyroid causing weight gain and lethargy."},{"name":"Ear Infections","description":"Long, floppy ears trap moisture."},{"name":"Cherry Eye","description":"Prolapsed third eyelid gland."}]'::jsonb,
  'Feed 3/4 to 1.5 cups of quality food daily. Beagles are notorious food thieves—secure the trash and food containers.',
  'Brush weekly with a medium-bristle brush. Clean ears weekly to prevent infection. Bathe every 4-6 weeks.',
  'Weekly',
  '[{"question":"Do Beagles bark a lot?","answer":"Yes, Beagles are vocal dogs with a distinctive bay. They may not suit apartment living without training."},{"question":"Are Beagles easy to train?","answer":"They''re intelligent but stubborn, driven by their nose. Patient, food-motivated training works best."},{"question":"How much do Beagles shed?","answer":"Moderately year-round, with heavier shedding in spring."}]'::jsonb,
  ARRAY['dog-age-calculator','dog-food-calculator','dog-walking-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"fair","first_time_owners":"excellent"}'::jsonb,
  'England', 'Hound',
  'Short, dense, weatherproof double coat', ARRAY['Tri-color','Red and White','Lemon and White'],
  'small', 'high', 'medium', 'medium'
),
(
  'persian-cat', 'cat', 'Persian Cat',
  'The Persian is a long-haired breed characterized by its round face, short muzzle, and luxurious coat. Known for their calm, gentle nature, they''re one of the most beloved cat breeds worldwide.',
  'One of the oldest cat breeds, Persians were brought to Europe from Persia (modern Iran) in the 1600s. Selective breeding in Victorian England refined their distinctive appearance.',
  ARRAY['Quiet','Sweet','Docile','Gentle','Affectionate'],
  'Persians are the epitome of calm elegance—they prefer serene environments and gentle handling. They form deep bonds with their people but are selective about attention.',
  'low', 'Persians are low-energy cats. Short interactive play sessions of 10-15 minutes twice daily are sufficient.', 15,
  7, 12, 10, 15, 12, 17,
  '[{"name":"Polycystic Kidney Disease","description":"Genetic condition causing kidney cysts; affects ~40% of Persians."},{"name":"Brachycephalic Airway Syndrome","description":"Breathing difficulties from flat face."},{"name":"Progressive Retinal Atrophy","description":"Inherited eye disease."},{"name":"Dental Malocclusion","description":"Misaligned teeth due to shortened jaw."}]'::jsonb,
  'Feed high-quality cat food formulated for long-haired breeds. Wet food helps kidney health. 1/4 to 1/3 cup dry food daily plus wet food.',
  'Daily brushing is mandatory to prevent painful mats. Bathe monthly. Wipe face daily to prevent tear staining. Regular grooming appointments recommended.',
  'Daily',
  '[{"question":"How often should you groom a Persian cat?","answer":"Daily brushing is essential—their long coat mats quickly without regular care."},{"question":"Are Persian cats good with children?","answer":"They prefer calm, older children who understand gentle handling."},{"question":"Do Persian cats have health problems?","answer":"Yes, they''re prone to breathing issues, kidney disease, and dental problems due to their flat face structure."}]'::jsonb,
  ARRAY['cat-age-calculator','cat-food-calculator','cat-weight-calculator'],
  '{"children":"fair","other_pets":"good","apartments":"excellent","first_time_owners":"good"}'::jsonb,
  'Iran (Persia)', 'Long-haired',
  'Long, thick, silky double coat', ARRAY['White','Black','Blue','Cream','Red','Silver','Golden','Tortoiseshell','Calico'],
  'medium', 'low', 'very high', 'medium'
),
(
  'maine-coon', 'cat', 'Maine Coon',
  'The Maine Coon is one of the largest domestic cat breeds—a gentle giant with a shaggy coat, tufted ears, and bushy tail. Known as "gentle giants," they''re friendly, playful, and dog-like in personality.',
  'Native to Maine, USA, where they''re the official state cat. Legends attribute their origin to everything from Marie Antoinette''s cats to raccoon-cat hybrids (biologically impossible). They likely descend from long-haired cats brought by seafarers.',
  ARRAY['Gentle','Intelligent','Playful','Friendly','Sociable'],
  'Maine Coons are famously friendly with everyone—family, strangers, kids, dogs. They''re vocal (chirping and trilling more than meowing) and playful well into adulthood.',
  'medium', 'Interactive play 30-45 minutes daily. They love puzzle toys, fetching, and even leash walks.', 40,
  8, 25, 10, 16, 12, 15,
  '[{"name":"Hypertrophic Cardiomyopathy","description":"Heart disease common in the breed; genetic testing available."},{"name":"Hip Dysplasia","description":"Uncommon in cats but occurs in large breeds like Maine Coons."},{"name":"Spinal Muscular Atrophy","description":"Genetic muscle disorder."},{"name":"Polycystic Kidney Disease","description":"Inherited kidney condition."}]'::jsonb,
  'Feed high-quality cat food to support their large size. Adults need 3/4 to 1 cup daily. Growing kittens need more frequent meals.',
  'Brush 2-3 times weekly with a stainless steel comb. Their coat is less prone to matting than Persians. Bathe every 2-3 months.',
  '2-3 times per week',
  '[{"question":"How big do Maine Coons get?","answer":"Males weigh 13-25 lbs, females 8-18 lbs. They can reach 40 inches long including tail."},{"question":"Are Maine Coons hypoallergenic?","answer":"No, but some produce less Fel d 1 protein than other breeds."},{"question":"How long do Maine Coons live?","answer":"12-15 years on average with proper care and health monitoring."}]'::jsonb,
  ARRAY['cat-age-calculator','cat-food-calculator','cat-weight-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"good","first_time_owners":"excellent"}'::jsonb,
  'United States (Maine)', 'Long-haired',
  'Long, shaggy, water-resistant double coat', ARRAY['Brown Tabby','Black','White','Blue','Cream','Red','Silver','Tortoiseshell'],
  'extra large', 'medium', 'high', 'very high'
),
(
  'siamese-cat', 'cat', 'Siamese Cat',
  'The Siamese is an elegant, athletic cat with striking blue almond-shaped eyes and distinctive color-point coat. They''re one of the most recognizable and vocal cat breeds.',
  'One of the oldest recognized breeds, originating in Siam (modern Thailand). Depicted in ancient Thai manuscripts, they were prized as royal companions and temple cats.',
  ARRAY['Vocal','Social','Intelligent','Affectionate','Playful'],
  'Siamese cats are extremely social and demand attention. They''re known for their loud, distinctive voice and will "talk" to their humans constantly. Not for those who want a quiet cat.',
  'high', 'Very active—need 45-60 minutes of interactive play daily plus climbing opportunities and puzzle toys.', 45,
  6, 14, 8, 10, 12, 20,
  '[{"name":"Progressive Retinal Atrophy","description":"Inherited eye disease leading to blindness."},{"name":"Amyloidosis","description":"Protein deposits affecting organs, particularly the liver."},{"name":"Asthma","description":"Respiratory condition more common in Siamese."},{"name":"Dental Disease","description":"Prone to gingivitis and tooth resorption."}]'::jsonb,
  'Feed high-quality protein-rich cat food. Their high metabolism means they need calorie-dense meals. 1/3 to 1/2 cup daily.',
  'Minimal grooming needed—brush weekly with a rubber brush. Their short coat sheds moderately. Bathe every 2-3 months.',
  'Weekly',
  '[{"question":"Why are Siamese cats so vocal?","answer":"It''s a breed trait—they use their voice to communicate with humans and demand attention."},{"question":"Do Siamese cats need a companion?","answer":"They thrive with another Siamese or active cat, as they hate being alone."},{"question":"What are the color points on a Siamese?","answer":"Seal, chocolate, blue, and lilac are the traditional four points—darker coloring on ears, face, paws, and tail."}]'::jsonb,
  ARRAY['cat-age-calculator','cat-food-calculator','cat-play-time-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"good"}'::jsonb,
  'Thailand (Siam)', 'Short-haired',
  'Short, fine, glossy single coat', ARRAY['Seal Point','Chocolate Point','Blue Point','Lilac Point'],
  'medium', 'very high', 'low', 'very high'
),
(
  'ragdoll', 'cat', 'Ragdoll',
  'The Ragdoll is a large, laid-back cat known for going limp when picked up—hence the name. With blue eyes and semi-long silky coats, they''re among the most affectionate cat breeds.',
  'Developed in California in the 1960s by Ann Baker, who bred a white long-haired cat named Josephine with several other cats to create the breed''s distinctive docile temperament.',
  ARRAY['Docile','Affectionate','Gentle','Quiet','Trusting'],
  'Ragdolls are famously calm and love being held. They follow their humans room to room, greet visitors at the door, and get along with everyone. Best kept as indoor cats due to their trusting nature.',
  'low', 'Gentle play sessions of 15-20 minutes twice daily. They''re not big climbers or jumpers.', 20,
  10, 20, 9, 11, 12, 17,
  '[{"name":"Hypertrophic Cardiomyopathy","description":"Heart disease with a specific genetic mutation in Ragdolls."},{"name":"Polycystic Kidney Disease","description":"Inherited kidney condition."},{"name":"Bladder Stones","description":"Urinary tract issues."},{"name":"Feline Infectious Peritonitis","description":"Higher susceptibility than some breeds."}]'::jsonb,
  'Feed high-quality food formulated for large breeds. 3/4 to 1 cup daily. Monitor weight—they can become obese if overfed.',
  'Brush 2-3 times per week with a stainless steel comb. Their coat is less prone to matting than Persians. Bathe every 6-8 weeks.',
  '2-3 times per week',
  '[{"question":"Why do Ragdolls go limp when picked up?","answer":"It''s a genetic trait selected for by early breeders. They completely relax in your arms."},{"question":"How big do Ragdolls get?","answer":"Males reach 15-20 lbs, females 10-15 lbs. They mature slowly, reaching full size at 4 years."},{"question":"Are Ragdolls good indoor cats?","answer":"Yes—they should be kept indoors as their trusting nature makes them vulnerable outside."}]'::jsonb,
  ARRAY['cat-age-calculator','cat-food-calculator','cat-weight-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}'::jsonb,
  'United States', 'Long-haired',
  'Semi-long, silky, single coat', ARRAY['Seal','Blue','Chocolate','Lilac','Red','Cream'],
  'large', 'low', 'medium', 'high'
),
(
  'british-shorthair', 'cat', 'British Shorthair',
  'The British Shorthair is a sturdy, plush cat with a round face, chubby cheeks, and dense coat. They''re calm, easygoing companions that adapt well to various households.',
  'Descended from cats brought to Britain by Roman invaders. Formalized as a breed in Victorian England, they''re the country''s oldest native cat breed.',
  ARRAY['Easygoing','Calm','Affectionate','Reserved','Loyal'],
  'British Shorthairs are dignified and independent—they show affection on their terms. Not lap cats, but they enjoy being near their humans. Great for busy households.',
  'low', 'Moderate play sessions of 15-20 minutes daily. They enjoy puzzle feeders and interactive toys.', 20,
  9, 18, 12, 14, 12, 17,
  '[{"name":"Hypertrophic Cardiomyopathy","description":"Heart disease genetic testing recommended."},{"name":"Polycystic Kidney Disease","description":"Inherited kidney cysts."},{"name":"Hemophilia B","description":"Blood clotting disorder specific to the breed."},{"name":"Obesity","description":"Their laid-back nature makes them prone to weight gain."}]'::jsonb,
  'Feed high-quality cat food with controlled portions. 1/3 to 1/2 cup daily. Their sedentary nature requires careful weight management.',
  'Brush weekly with a rubber brush; increase during spring shedding. Their dense coat is easier to maintain than long-haired breeds.',
  'Weekly',
  '[{"question":"Are British Shorthairs lap cats?","answer":"Generally no—they prefer to sit near you rather than on you. They show affection through proximity."},{"question":"What color is the classic British Shorthair?","answer":"The blue (gray) color is most iconic, though they come in many colors and patterns."},{"question":"How long do British Shorthairs live?","answer":"12-17 years with proper care. They mature slowly, reaching adulthood at 3-5 years."}]'::jsonb,
  ARRAY['cat-age-calculator','cat-food-calculator','cat-weight-calculator'],
  '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}'::jsonb,
  'United Kingdom', 'Short-haired',
  'Short, dense, plush double coat', ARRAY['Blue','Black','White','Cream','Red','Silver','Tabby','Colorpoint'],
  'medium', 'low', 'medium', 'medium'
);
