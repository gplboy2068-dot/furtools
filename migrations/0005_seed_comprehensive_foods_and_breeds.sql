-- Migration: 0005_seed_comprehensive_foods_and_breeds.sql

-- 1. POPULATE COMPREHENSIVE FOODS
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_apple', 'apple', 'Apple', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Rich in vitamin C and fiber. Always remove the seeds and core as apple seeds contain amygdalin (cyanide).', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat apple?","answer":"For dogs, this food is rated: SAFE. Rich in vitamin C and fiber. Always remove the seeds and core as apple seeds contain amygdalin (cyanide)."},{"question":"Is apple safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["apple","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_banana', 'banana', 'Banana', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"moderation","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. High in potassium and vitamins, but high in sugar. Feed only as an occasional small treat.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat banana?","answer":"For dogs, this food is rated: SAFE. High in potassium and vitamins, but high in sugar. Feed only as an occasional small treat."},{"question":"Is banana safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["banana","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_blueberries', 'blueberries', 'Blueberries', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Superfood loaded with antioxidants, fiber, and phytochemicals. Excellent low-calorie treat.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat blueberries?","answer":"For dogs, this food is rated: SAFE. Superfood loaded with antioxidants, fiber, and phytochemicals. Excellent low-calorie treat."},{"question":"Is blueberries safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["blueberries","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_strawberries', 'strawberries', 'Strawberries', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Packed with vitamin C and an enzyme (malic acid) that can help whiten pets’ teeth.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat strawberries?","answer":"For dogs, this food is rated: SAFE. Packed with vitamin C and an enzyme (malic acid) that can help whiten pets’ teeth."},{"question":"Is strawberries safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["strawberries","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_watermelon', 'watermelon', 'Watermelon', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. 92% water content makes it wonderful for hot summer days. Remove seeds and tough outer rind.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat watermelon?","answer":"For dogs, this food is rated: SAFE. 92% water content makes it wonderful for hot summer days. Remove seeds and tough outer rind."},{"question":"Is watermelon safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["watermelon","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cantaloupe', 'cantaloupe', 'Cantaloupe', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Rich in beta-carotene and moisture. Slice into small bite-sized pieces; feed moderately.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cantaloupe?","answer":"For dogs, this food is rated: SAFE. Rich in beta-carotene and moisture. Slice into small bite-sized pieces; feed moderately."},{"question":"Is cantaloupe safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cantaloupe","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_mango', 'mango', 'Mango', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Sweet, tropical treat loaded with vitamins A, B6, C, and E. Peel skin and discard large hard pit.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat mango?","answer":"For dogs, this food is rated: SAFE. Sweet, tropical treat loaded with vitamins A, B6, C, and E. Peel skin and discard large hard pit."},{"question":"Is mango safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["mango","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_pineapple', 'pineapple', 'Pineapple', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"moderation","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Contains bromelain enzyme which aids protein breakdown. Remove prickly skin and tough fibrous core.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat pineapple?","answer":"For dogs, this food is rated: SAFE. Contains bromelain enzyme which aids protein breakdown. Remove prickly skin and tough fibrous core."},{"question":"Is pineapple safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["pineapple","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_orange', 'orange', 'Orange', 'fruit', NULL,
    '{"dog":"moderation","cat":"unsafe","rabbit":"unsafe","bird":"safe","hamster":"unsafe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"unknown","fish":"unknown"}', 'Hazardous or toxic for certain pets. Citrus essential oils and psoralens cause severe stomach irritation in cats and hamsters. Small dog treat only.', 'No nutritional benefit; potential health hazard.', 'Citrus essential oils and psoralens cause severe stomach irritation in cats and hamsters. Small dog treat only.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat orange?","answer":"For dogs, this food is rated: MODERATION. Citrus essential oils and psoralens cause severe stomach irritation in cats and hamsters. Small dog treat only."},{"question":"Is orange safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["orange","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_pear', 'pear', 'Pear', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. High in copper and dietary fiber. Remove stem, core, and seeds prior to serving.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat pear?","answer":"For dogs, this food is rated: SAFE. High in copper and dietary fiber. Remove stem, core, and seeds prior to serving."},{"question":"Is pear safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["pear","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_peach', 'peach', 'Peach', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Fresh peach flesh is safe. The pit contains cyanogenic glycosides and is a severe choking/blockage risk.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat peach?","answer":"For dogs, this food is rated: SAFE. Fresh peach flesh is safe. The pit contains cyanogenic glycosides and is a severe choking/blockage risk."},{"question":"Is peach safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["peach","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_plum', 'plum', 'Plum', 'fruit', NULL,
    '{"dog":"moderation","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unknown","fish":"unknown"}', 'Hazardous or toxic for certain pets. Pits contain lethal cyanide. Avoid feeding whole fruit to any pet.', 'No nutritional benefit; potential health hazard.', 'Pits contain lethal cyanide. Avoid feeding whole fruit to any pet.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat plum?","answer":"For dogs, this food is rated: MODERATION. Pits contain lethal cyanide. Avoid feeding whole fruit to any pet."},{"question":"Is plum safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["plum","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cherry', 'cherry', 'Cherry', 'fruit', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Pits, stems, and leaves contain toxic cyanide that blocks cellular oxygen transport.', 'No nutritional benefit; potential health hazard.', 'Pits, stems, and leaves contain toxic cyanide that blocks cellular oxygen transport.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cherry?","answer":"For dogs, this food is rated: UNSAFE. Pits, stems, and leaves contain toxic cyanide that blocks cellular oxygen transport."},{"question":"Is cherry safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cherry","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_avocado', 'avocado', 'Avocado', 'fruit', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Contains persin, a fungicidal toxin lethal to birds, rabbits, rodents, and horses. Pit is a choking hazard.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat avocado?","answer":"For dogs, this food is rated: MODERATION. Contains persin, a fungicidal toxin lethal to birds, rabbits, rodents, and horses. Pit is a choking hazard."},{"question":"Is avocado safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["avocado","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_grapes_raisins', 'grapes-raisins', 'Grapes & Raisins', 'fruit', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"moderation","bird":"safe","hamster":"moderation","guinea_pig":"moderation","ferret":"unsafe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Hazardous or toxic for certain pets. EXTREMELY DANGEROUS to dogs and cats; tartaric acid causes sudden irreversible acute renal failure.', 'No nutritional benefit; potential health hazard.', 'EXTREMELY DANGEROUS to dogs and cats; tartaric acid causes sudden irreversible acute renal failure.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat grapes & raisins?","answer":"For dogs, this food is rated: UNSAFE. EXTREMELY DANGEROUS to dogs and cats; tartaric acid causes sudden irreversible acute renal failure."},{"question":"Is grapes & raisins safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["grapes & raisins","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_raspberries', 'raspberries', 'Raspberries', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Contains natural xylitol in trace amounts; limit to 1/2 cup for medium dogs; great anti-inflammatory.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat raspberries?","answer":"For dogs, this food is rated: SAFE. Contains natural xylitol in trace amounts; limit to 1/2 cup for medium dogs; great anti-inflammatory."},{"question":"Is raspberries safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["raspberries","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_blackberries', 'blackberries', 'Blackberries', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Packed with vitamins C, K, and anthocyanins. Great low-calorie reward.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat blackberries?","answer":"For dogs, this food is rated: SAFE. Packed with vitamins C, K, and anthocyanins. Great low-calorie reward."},{"question":"Is blackberries safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["blackberries","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cranberries', 'cranberries', 'Cranberries', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Supports urinary tract health. Avoid commercial dried cranberries loaded with refined sugar.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cranberries?","answer":"For dogs, this food is rated: SAFE. Supports urinary tract health. Avoid commercial dried cranberries loaded with refined sugar."},{"question":"Is cranberries safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cranberries","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_kiwi', 'kiwi', 'Kiwi', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Peel the fuzzy skin; feed small slices. High in potassium and vitamin C.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat kiwi?","answer":"For dogs, this food is rated: SAFE. Peel the fuzzy skin; feed small slices. High in potassium and vitamin C."},{"question":"Is kiwi safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["kiwi","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_papaya', 'papaya', 'Papaya', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Contains papain, a natural digestive enzyme. Deseed and peel before feeding.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat papaya?","answer":"For dogs, this food is rated: SAFE. Contains papain, a natural digestive enzyme. Deseed and peel before feeding."},{"question":"Is papaya safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["papaya","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_coconut', 'coconut', 'Coconut', 'fruit', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"moderation","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"unknown","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Lauric acid helps coat shine and skin inflammation; feed small amounts due to high saturated fats.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat coconut?","answer":"For dogs, this food is rated: SAFE. Lauric acid helps coat shine and skin inflammation; feed small amounts due to high saturated fats."},{"question":"Is coconut safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["coconut","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_lemon_lime', 'lemon-lime', 'Lemon & Lime', 'fruit', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Citric acid, limonene, and linalool cause central nervous system depression, tremors, and vomiting.', 'No nutritional benefit; potential health hazard.', 'Citric acid, limonene, and linalool cause central nervous system depression, tremors, and vomiting.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat lemon & lime?","answer":"For dogs, this food is rated: UNSAFE. Citric acid, limonene, and linalool cause central nervous system depression, tremors, and vomiting."},{"question":"Is lemon & lime safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["lemon & lime","fruit","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_carrot', 'carrot', 'Carrot', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Superb crunchy treat that helps clean dog teeth and supplies vitamin A / beta-carotene.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat carrot?","answer":"For dogs, this food is rated: SAFE. Superb crunchy treat that helps clean dog teeth and supplies vitamin A / beta-carotene."},{"question":"Is carrot safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["carrot","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_broccoli', 'broccoli', 'Broccoli', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Rich in lutein and vitamin C. Florets contain isothiocyanates; keep under 10% of total diet.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat broccoli?","answer":"For dogs, this food is rated: SAFE. Rich in lutein and vitamin C. Florets contain isothiocyanates; keep under 10% of total diet."},{"question":"Is broccoli safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["broccoli","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_spinach', 'spinach', 'Spinach', 'vegetable', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"moderation","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Contains soluble oxalates. Pets with history of calcium oxalate bladder stones should avoid.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat spinach?","answer":"For dogs, this food is rated: MODERATION. Contains soluble oxalates. Pets with history of calcium oxalate bladder stones should avoid."},{"question":"Is spinach safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["spinach","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cucumber', 'cucumber', 'Cucumber', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. 96% water and almost zero calories. The ultimate treat for overweight or diabetic pets.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cucumber?","answer":"For dogs, this food is rated: SAFE. 96% water and almost zero calories. The ultimate treat for overweight or diabetic pets."},{"question":"Is cucumber safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cucumber","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_green_beans', 'green-beans', 'Green Beans', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. Veterinarian favorite for the "green bean weight loss diet"; feed raw, steamed, or plain canned.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat green beans?","answer":"For dogs, this food is rated: SAFE. Veterinarian favorite for the \"green bean weight loss diet\"; feed raw, steamed, or plain canned."},{"question":"Is green beans safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["green beans","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_sweet_potato', 'sweet-potato', 'Sweet Potato', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Always cook thoroughly; never feed raw sweet potato. Rich in dietary fiber and vitamin B6.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat sweet potato?","answer":"For dogs, this food is rated: SAFE. Always cook thoroughly; never feed raw sweet potato. Rich in dietary fiber and vitamin B6."},{"question":"Is sweet potato safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["sweet potato","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_pumpkin', 'pumpkin', 'Pumpkin', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Gold standard remedy for pet bowel issues. Pure canned puree resolves diarrhea and constipation.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat pumpkin?","answer":"For dogs, this food is rated: SAFE. Gold standard remedy for pet bowel issues. Pure canned puree resolves diarrhea and constipation."},{"question":"Is pumpkin safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["pumpkin","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_zucchini', 'zucchini', 'Zucchini', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. Mild, hydrating vegetable packed with folate, potassium, and vitamin A. Feed raw or steamed.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat zucchini?","answer":"For dogs, this food is rated: SAFE. Mild, hydrating vegetable packed with folate, potassium, and vitamin A. Feed raw or steamed."},{"question":"Is zucchini safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["zucchini","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_celery', 'celery', 'Celery', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Crunchy snack that cleans tartar and freshens breath; slice into small pieces to prevent string choking.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat celery?","answer":"For dogs, this food is rated: SAFE. Crunchy snack that cleans tartar and freshens breath; slice into small pieces to prevent string choking."},{"question":"Is celery safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["celery","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_bell_pepper', 'bell-pepper', 'Bell Pepper', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Red and yellow bell peppers have 3x the vitamin C of oranges; guinea pigs love and need this.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat bell pepper?","answer":"For dogs, this food is rated: SAFE. Red and yellow bell peppers have 3x the vitamin C of oranges; guinea pigs love and need this."},{"question":"Is bell pepper safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["bell pepper","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_asparagus', 'asparagus', 'Asparagus', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Steam lightly to soften the tough stalks. Makes urine smell pungent but completely harmless.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat asparagus?","answer":"For dogs, this food is rated: SAFE. Steam lightly to soften the tough stalks. Makes urine smell pungent but completely harmless."},{"question":"Is asparagus safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["asparagus","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cauliflower', 'cauliflower', 'Cauliflower', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Low calorie and rich in choline; can produce benign gas if fed in large portions.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cauliflower?","answer":"For dogs, this food is rated: SAFE. Low calorie and rich in choline; can produce benign gas if fed in large portions."},{"question":"Is cauliflower safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cauliflower","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cabbage', 'cabbage', 'Cabbage', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"moderation","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Rich in phytonutrients and roughage; feed sparingly to prevent gas and bloating.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cabbage?","answer":"For dogs, this food is rated: SAFE. Rich in phytonutrients and roughage; feed sparingly to prevent gas and bloating."},{"question":"Is cabbage safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cabbage","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_lettuce_romaine', 'lettuce-romaine', 'Lettuce (Romaine)', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"safe","bird":"safe","hamster":"safe","guinea_pig":"safe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. Avoid light iceberg lettuce (water with no nutrients); dark romaine and green leaf are fantastic.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat lettuce (romaine)?","answer":"For dogs, this food is rated: SAFE. Avoid light iceberg lettuce (water with no nutrients); dark romaine and green leaf are fantastic."},{"question":"Is lettuce (romaine) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["lettuce (romaine)","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_peas', 'peas', 'Peas', 'vegetable', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. Garden peas, snow peas, and sugar snap peas are safe; feed fresh or thawed frozen; avoid sodium canned peas.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat peas?","answer":"For dogs, this food is rated: SAFE. Garden peas, snow peas, and sugar snap peas are safe; feed fresh or thawed frozen; avoid sodium canned peas."},{"question":"Is peas safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["peas","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_onion', 'onion', 'Onion', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. ALLIUM TOXIN: N-propyl disulfide causes oxidative breakdown of red blood cells, hemolytic Heinz body anemia, and collapse.', 'No nutritional benefit; potential health hazard.', 'ALLIUM TOXIN: N-propyl disulfide causes oxidative breakdown of red blood cells, hemolytic Heinz body anemia, and collapse.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat onion?","answer":"For dogs, this food is rated: UNSAFE. ALLIUM TOXIN: N-propyl disulfide causes oxidative breakdown of red blood cells, hemolytic Heinz body anemia, and collapse."},{"question":"Is onion safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["onion","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_garlic', 'garlic', 'Garlic', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. 5 TIMES MORE TOXIC than onions. Destroys red blood cells in dogs, cats, and all companion animals.', 'No nutritional benefit; potential health hazard.', '5 TIMES MORE TOXIC than onions. Destroys red blood cells in dogs, cats, and all companion animals.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat garlic?","answer":"For dogs, this food is rated: UNSAFE. 5 TIMES MORE TOXIC than onions. Destroys red blood cells in dogs, cats, and all companion animals."},{"question":"Is garlic safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["garlic","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_leek_shallot', 'leek-shallot', 'Leek & Shallot', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Part of the toxic Allium genus; causes severe gastrointestinal ulcers and fatal red cell destruction.', 'No nutritional benefit; potential health hazard.', 'Part of the toxic Allium genus; causes severe gastrointestinal ulcers and fatal red cell destruction.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat leek & shallot?","answer":"For dogs, this food is rated: UNSAFE. Part of the toxic Allium genus; causes severe gastrointestinal ulcers and fatal red cell destruction."},{"question":"Is leek & shallot safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["leek & shallot","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_mushroom_wild', 'mushroom-wild', 'Mushroom (Wild)', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Wild mushrooms (Amanita, Inocybe) cause rapid liver and renal failure, seizures, and death.', 'No nutritional benefit; potential health hazard.', 'Wild mushrooms (Amanita, Inocybe) cause rapid liver and renal failure, seizures, and death.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat mushroom (wild)?","answer":"For dogs, this food is rated: UNSAFE. Wild mushrooms (Amanita, Inocybe) cause rapid liver and renal failure, seizures, and death."},{"question":"Is mushroom (wild) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["mushroom (wild)","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_corn_cob', 'corn-cob', 'Corn (Cob)', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Corn kernels are digestible, but corncobs are completely indigestible and cause fatal bowel obstructions requiring emergency surgery.', 'No nutritional benefit; potential health hazard.', 'Corn kernels are digestible, but corncobs are completely indigestible and cause fatal bowel obstructions requiring emergency surgery.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat corn (cob)?","answer":"For dogs, this food is rated: UNSAFE. Corn kernels are digestible, but corncobs are completely indigestible and cause fatal bowel obstructions requiring emergency surgery."},{"question":"Is corn (cob) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["corn (cob)","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_potato_raw_green', 'potato-raw-green', 'Potato (Raw/Green)', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Green skins and raw potatoes contain solanine glycoalkaloids. Fully cooked plain white potato is safe.', 'No nutritional benefit; potential health hazard.', 'Green skins and raw potatoes contain solanine glycoalkaloids. Fully cooked plain white potato is safe.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat potato (raw/green)?","answer":"For dogs, this food is rated: UNSAFE. Green skins and raw potatoes contain solanine glycoalkaloids. Fully cooked plain white potato is safe."},{"question":"Is potato (raw/green) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["potato (raw/green)","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_tomato_green_plant', 'tomato-green-plant', 'Tomato (Green/Plant)', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Green unripe tomatoes and vines contain toxic solanine and tomatine. Ripe red tomato flesh is non-toxic.', 'No nutritional benefit; potential health hazard.', 'Green unripe tomatoes and vines contain toxic solanine and tomatine. Ripe red tomato flesh is non-toxic.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat tomato (green/plant)?","answer":"For dogs, this food is rated: UNSAFE. Green unripe tomatoes and vines contain toxic solanine and tomatine. Ripe red tomato flesh is non-toxic."},{"question":"Is tomato (green/plant) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["tomato (green/plant)","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_rhubarb', 'rhubarb', 'Rhubarb', 'vegetable', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unknown"}', 'Hazardous or toxic for certain pets. Leaves and stems contain soluble calcium oxalate crystals that deplete systemic calcium and cause kidney failure.', 'No nutritional benefit; potential health hazard.', 'Leaves and stems contain soluble calcium oxalate crystals that deplete systemic calcium and cause kidney failure.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat rhubarb?","answer":"For dogs, this food is rated: UNSAFE. Leaves and stems contain soluble calcium oxalate crystals that deplete systemic calcium and cause kidney failure."},{"question":"Is rhubarb safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["rhubarb","vegetable","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cooked_chicken', 'cooked-chicken', 'Cooked Chicken', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"moderation","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Lean, highly digestible protein staple. Never feed cooked bones as they splinter and pierce stomach walls.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cooked chicken?","answer":"For dogs, this food is rated: SAFE. Lean, highly digestible protein staple. Never feed cooked bones as they splinter and pierce stomach walls."},{"question":"Is cooked chicken safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cooked chicken","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cooked_turkey', 'cooked-turkey', 'Cooked Turkey', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"moderation","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Plain skinless cooked turkey breast is an outstanding low-fat protein. Avoid seasoned thanksgiving turkey.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cooked turkey?","answer":"For dogs, this food is rated: SAFE. Plain skinless cooked turkey breast is an outstanding low-fat protein. Avoid seasoned thanksgiving turkey."},{"question":"Is cooked turkey safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cooked turkey","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cooked_beef', 'cooked-beef', 'Cooked Beef', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Lean ground beef supports muscle mass, zinc, and iron levels. Drain grease before feeding.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cooked beef?","answer":"For dogs, this food is rated: SAFE. Lean ground beef supports muscle mass, zinc, and iron levels. Drain grease before feeding."},{"question":"Is cooked beef safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cooked beef","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cooked_salmon', 'cooked-salmon', 'Cooked Salmon', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Packed with essential Omega-3 fatty acids (EPA/DHA) for brain, coat, and joints. Must be cooked to kill parasites.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cooked salmon?","answer":"For dogs, this food is rated: SAFE. Packed with essential Omega-3 fatty acids (EPA/DHA) for brain, coat, and joints. Must be cooked to kill parasites."},{"question":"Is cooked salmon safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cooked salmon","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_tuna_in_water', 'tuna-in-water', 'Tuna (in Water)', 'protein', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"unsafe","bird":"unsafe","hamster":"moderation","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Feed canned tuna in water only; limit feeding due to accumulation of heavy metal mercury.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat tuna (in water)?","answer":"For dogs, this food is rated: MODERATION. Feed canned tuna in water only; limit feeding due to accumulation of heavy metal mercury."},{"question":"Is tuna (in water) safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["tuna (in water)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_eggs_cooked', 'eggs-cooked', 'Eggs (Cooked)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Gold standard complete amino acid profile; scrambled or hard-boiled plain without butter or salt.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat eggs (cooked)?","answer":"For dogs, this food is rated: SAFE. Gold standard complete amino acid profile; scrambled or hard-boiled plain without butter or salt."},{"question":"Is eggs (cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["eggs (cooked)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_pork_lean_cooked', 'pork-lean-cooked', 'Pork (Lean, Cooked)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. High in thiamine. Must be thoroughly cooked to eliminate trichinosis parasite; avoid salty ham or bacon.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat pork (lean, cooked)?","answer":"For dogs, this food is rated: SAFE. High in thiamine. Must be thoroughly cooked to eliminate trichinosis parasite; avoid salty ham or bacon."},{"question":"Is pork (lean, cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["pork (lean, cooked)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_lamb_cooked', 'lamb-cooked', 'Lamb (Cooked)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Hypoallergenic novel protein option for dogs with chicken or beef dietary intolerances.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat lamb (cooked)?","answer":"For dogs, this food is rated: SAFE. Hypoallergenic novel protein option for dogs with chicken or beef dietary intolerances."},{"question":"Is lamb (cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["lamb (cooked)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_sardines_in_water', 'sardines-in-water', 'Sardines (in Water)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Small forage fish with tiny edible bones rich in bioavailable calcium, CoQ10, and Omega-3.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat sardines (in water)?","answer":"For dogs, this food is rated: SAFE. Small forage fish with tiny edible bones rich in bioavailable calcium, CoQ10, and Omega-3."},{"question":"Is sardines (in water) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["sardines (in water)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_bacon_sausage', 'bacon-sausage', 'Bacon & Sausage', 'protein', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Extremely high sodium, nitrates, and saturated fat triggers acute severe pancreatitis, a veterinary medical emergency.', 'No nutritional benefit; potential health hazard.', 'Extremely high sodium, nitrates, and saturated fat triggers acute severe pancreatitis, a veterinary medical emergency.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat bacon & sausage?","answer":"For dogs, this food is rated: UNSAFE. Extremely high sodium, nitrates, and saturated fat triggers acute severe pancreatitis, a veterinary medical emergency."},{"question":"Is bacon & sausage safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["bacon & sausage","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cooked_bones', 'cooked-bones', 'Cooked Bones', 'protein', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Cooking makes animal bones brittle and sharp, leading to perforated esophagus, stomach, or bowel.', 'No nutritional benefit; potential health hazard.', 'Cooking makes animal bones brittle and sharp, leading to perforated esophagus, stomach, or bowel.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cooked bones?","answer":"For dogs, this food is rated: UNSAFE. Cooking makes animal bones brittle and sharp, leading to perforated esophagus, stomach, or bowel."},{"question":"Is cooked bones safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cooked bones","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_raw_fish', 'raw-fish', 'Raw Fish', 'protein', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Contains thiaminase enzymes that destroy vitamin B1 (thiamine), causing head tremors, ataxia, and seizures.', 'No nutritional benefit; potential health hazard.', 'Contains thiaminase enzymes that destroy vitamin B1 (thiamine), causing head tremors, ataxia, and seizures.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat raw fish?","answer":"For dogs, this food is rated: UNSAFE. Contains thiaminase enzymes that destroy vitamin B1 (thiamine), causing head tremors, ataxia, and seizures."},{"question":"Is raw fish safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["raw fish","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_shrimp_cooked', 'shrimp-cooked', 'Shrimp (Cooked)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"safe"}', 'Generally safe when prepared plain and fed in moderation. Cook thoroughly, peel shells, and remove vein; high in phosphorus, protein, and B12.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat shrimp (cooked)?","answer":"For dogs, this food is rated: SAFE. Cook thoroughly, peel shells, and remove vein; high in phosphorus, protein, and B12."},{"question":"Is shrimp (cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["shrimp (cooked)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_liver_beef_chicken', 'liver-beef-chicken', 'Liver (Beef/Chicken)', 'protein', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"safe","horse":"unsafe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Powerhouse of vitamin A and iron; feed in moderation as too much liver can cause vitamin A toxicity (hypervitaminosis A).', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat liver (beef/chicken)?","answer":"For dogs, this food is rated: SAFE. Powerhouse of vitamin A and iron; feed in moderation as too much liver can cause vitamin A toxicity (hypervitaminosis A)."},{"question":"Is liver (beef/chicken) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["liver (beef/chicken)","protein","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cheese_cheddar', 'cheese-cheddar', 'Cheese (Cheddar)', 'dairy', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"unsafe","bird":"unsafe","hamster":"moderation","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Generally safe when prepared plain and fed in moderation. Hard cheeses have very low lactose; fantastic for hiding medications and pills.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cheese (cheddar)?","answer":"For dogs, this food is rated: MODERATION. Hard cheeses have very low lactose; fantastic for hiding medications and pills."},{"question":"Is cheese (cheddar) safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["cheese (cheddar)","dairy","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_greek_yogurt_plain', 'greek-yogurt-plain', 'Greek Yogurt (Plain)', 'dairy', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Generally safe when prepared plain and fed in moderation. Contains live active probiotic cultures that populate beneficial gut flora; verify 0% xylitol.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat greek yogurt (plain)?","answer":"For dogs, this food is rated: SAFE. Contains live active probiotic cultures that populate beneficial gut flora; verify 0% xylitol."},{"question":"Is greek yogurt (plain) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["greek yogurt (plain)","dairy","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cottage_cheese', 'cottage-cheese', 'Cottage Cheese', 'dairy', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"unsafe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Generally safe when prepared plain and fed in moderation. Bland, high-protein soft curd that is easy to digest for pets recovering from stomach bug.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cottage cheese?","answer":"For dogs, this food is rated: SAFE. Bland, high-protein soft curd that is easy to digest for pets recovering from stomach bug."},{"question":"Is cottage cheese safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["cottage cheese","dairy","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_cow_milk', 'cow-milk', 'Cow Milk', 'dairy', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Generally safe when prepared plain and fed in moderation. Most adult dogs and adult cats lose lactase enzymes, causing diarrhea, gas, and abdominal cramps.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat cow milk?","answer":"For dogs, this food is rated: MODERATION. Most adult dogs and adult cats lose lactase enzymes, causing diarrhea, gas, and abdominal cramps."},{"question":"Is cow milk safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["cow milk","dairy","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_ice_cream', 'ice-cream', 'Ice Cream', 'dairy', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. High refined dairy sugars, potential xylitol artificial sweetener, and high risk of chocolate ingredients.', 'No nutritional benefit; potential health hazard.', 'High refined dairy sugars, potential xylitol artificial sweetener, and high risk of chocolate ingredients.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat ice cream?","answer":"For dogs, this food is rated: UNSAFE. High refined dairy sugars, potential xylitol artificial sweetener, and high risk of chocolate ingredients."},{"question":"Is ice cream safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["ice cream","dairy","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_white_rice_cooked', 'white-rice-cooked', 'White Rice (Cooked)', 'grain', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. The number-one veterinary dietary choice for calming an upset gastrointestinal tract.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat white rice (cooked)?","answer":"For dogs, this food is rated: SAFE. The number-one veterinary dietary choice for calming an upset gastrointestinal tract."},{"question":"Is white rice (cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["white rice (cooked)","grain","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_oatmeal_plain_cooked', 'oatmeal-plain-cooked', 'Oatmeal (Plain, Cooked)', 'grain', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"moderation","bird":"safe","hamster":"safe","guinea_pig":"moderation","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Soluble dietary fiber soothes irritated bowel and supplies linoleic acid for coat moisture.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat oatmeal (plain, cooked)?","answer":"For dogs, this food is rated: SAFE. Soluble dietary fiber soothes irritated bowel and supplies linoleic acid for coat moisture."},{"question":"Is oatmeal (plain, cooked) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["oatmeal (plain, cooked)","grain","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_peanut_butter_xylitol_free', 'peanut-butter-xylitol-free', 'Peanut Butter (Xylitol-Free)', 'nut', NULL,
    '{"dog":"safe","cat":"moderation","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"unknown","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Top training reward and enrichment filler for Kong toys. Check label: MUST NOT contain xylitol.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat peanut butter (xylitol-free)?","answer":"For dogs, this food is rated: SAFE. Top training reward and enrichment filler for Kong toys. Check label: MUST NOT contain xylitol."},{"question":"Is peanut butter (xylitol-free) safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["peanut butter (xylitol-free)","nut","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_bread_plain_white', 'bread-plain-white', 'Bread (Plain White)', 'grain', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Plain baked bread is safe in tiny bits as an occasional treat; no nutritional benefit.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat bread (plain white)?","answer":"For dogs, this food is rated: SAFE. Plain baked bread is safe in tiny bits as an occasional treat; no nutritional benefit."},{"question":"Is bread (plain white) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["bread (plain white)","grain","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_raw_yeast_dough', 'raw-yeast-dough', 'Raw Yeast Dough', 'grain', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. EXPANDS IN STOMACH cutting off circulation; fermenting yeast produces toxic ethanol poisoning.', 'No nutritional benefit; potential health hazard.', 'EXPANDS IN STOMACH cutting off circulation; fermenting yeast produces toxic ethanol poisoning.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat raw yeast dough?","answer":"For dogs, this food is rated: UNSAFE. EXPANDS IN STOMACH cutting off circulation; fermenting yeast produces toxic ethanol poisoning."},{"question":"Is raw yeast dough safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["raw yeast dough","grain","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_popcorn_air_popped', 'popcorn-air-popped', 'Popcorn (Air-Popped)', 'grain', NULL,
    '{"dog":"safe","cat":"safe","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"safe","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Air-popped plain popcorn with no salt, butter, or hard unpopped kernels is a fun crunchy snack.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat popcorn (air-popped)?","answer":"For dogs, this food is rated: SAFE. Air-popped plain popcorn with no salt, butter, or hard unpopped kernels is a fun crunchy snack."},{"question":"Is popcorn (air-popped) safe for cats?","answer":"For cats, this food is rated: SAFE. Cats are obligate carnivores with different nutritional needs."}]', '["popcorn (air-popped)","grain","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_macadamia_nuts', 'macadamia-nuts', 'Macadamia Nuts', 'nut', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Severely toxic to dogs; causes hind-limb weakness, paralysis, vomiting, hyperthermia, and tremors.', 'No nutritional benefit; potential health hazard.', 'Severely toxic to dogs; causes hind-limb weakness, paralysis, vomiting, hyperthermia, and tremors.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat macadamia nuts?","answer":"For dogs, this food is rated: UNSAFE. Severely toxic to dogs; causes hind-limb weakness, paralysis, vomiting, hyperthermia, and tremors."},{"question":"Is macadamia nuts safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["macadamia nuts","nut","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_walnuts_black', 'walnuts-black', 'Walnuts (Black)', 'nut', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Black walnuts contain juglone toxin and tremorgenic mycotoxins that cause neurotoxicity and seizures.', 'No nutritional benefit; potential health hazard.', 'Black walnuts contain juglone toxin and tremorgenic mycotoxins that cause neurotoxicity and seizures.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat walnuts (black)?","answer":"For dogs, this food is rated: UNSAFE. Black walnuts contain juglone toxin and tremorgenic mycotoxins that cause neurotoxicity and seizures."},{"question":"Is walnuts (black) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["walnuts (black)","nut","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_almonds', 'almonds', 'Almonds', 'nut', NULL,
    '{"dog":"moderation","cat":"moderation","rabbit":"unsafe","bird":"safe","hamster":"safe","guinea_pig":"unsafe","ferret":"unsafe","horse":"safe","turtle":"unknown","fish":"unknown"}', 'Generally safe when prepared plain and fed in moderation. Not inherently toxic but hard to digest; can obstruct small windpipes; high fat causes pancreatitis.', 'Supplies essential vitamins, minerals, and healthy hydration.', 'Digestive upset if fed in excessive portions or prepared with seasonings.',
    'None when fed in appropriate treat portions.', 'Wash thoroughly, peel/deseed if needed, and offer as an occasional treat.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat almonds?","answer":"For dogs, this food is rated: MODERATION. Not inherently toxic but hard to digest; can obstruct small windpipes; high fat causes pancreatitis."},{"question":"Is almonds safe for cats?","answer":"For cats, this food is rated: MODERATION. Cats are obligate carnivores with different nutritional needs."}]', '["almonds","nut","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_chocolate_dark_milk', 'chocolate-dark-milk', 'Chocolate (Dark/Milk)', 'sweets', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. THEOBROMINE TOXICITY: Causes tachycardia, cardiac arrhythmias, muscle spasms, seizures, and death.', 'No nutritional benefit; potential health hazard.', 'THEOBROMINE TOXICITY: Causes tachycardia, cardiac arrhythmias, muscle spasms, seizures, and death.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat chocolate (dark/milk)?","answer":"For dogs, this food is rated: UNSAFE. THEOBROMINE TOXICITY: Causes tachycardia, cardiac arrhythmias, muscle spasms, seizures, and death."},{"question":"Is chocolate (dark/milk) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["chocolate (dark/milk)","sweets","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_xylitol_birch_sugar', 'xylitol-birch-sugar', 'Xylitol (Birch Sugar)', 'sweetener', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. FATAL TO CANINES: Causes extreme insulin release, severe hypoglycemia within 30 min, and acute liver failure.', 'No nutritional benefit; potential health hazard.', 'FATAL TO CANINES: Causes extreme insulin release, severe hypoglycemia within 30 min, and acute liver failure.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat xylitol (birch sugar)?","answer":"For dogs, this food is rated: UNSAFE. FATAL TO CANINES: Causes extreme insulin release, severe hypoglycemia within 30 min, and acute liver failure."},{"question":"Is xylitol (birch sugar) safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["xylitol (birch sugar)","sweetener","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_coffee_caffeine', 'coffee-caffeine', 'Coffee & Caffeine', 'drink', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Methylxanthines stimulate nervous and cardiovascular systems, producing hypertension and hyperthermia.', 'No nutritional benefit; potential health hazard.', 'Methylxanthines stimulate nervous and cardiovascular systems, producing hypertension and hyperthermia.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat coffee & caffeine?","answer":"For dogs, this food is rated: UNSAFE. Methylxanthines stimulate nervous and cardiovascular systems, producing hypertension and hyperthermia."},{"question":"Is coffee & caffeine safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["coffee & caffeine","drink","pet food safety","can my pet eat this"]', 1
  );
INSERT OR REPLACE INTO foods (
    id, slug, name, category, image_url, species_safety, short_answer, benefits, risks, symptoms, vet_advice,
    alternatives, related_food_slugs, faqs, keywords, published
  ) VALUES (
    'food_alcohol_beer', 'alcohol-beer', 'Alcohol & Beer', 'drink', NULL,
    '{"dog":"unsafe","cat":"unsafe","rabbit":"unsafe","bird":"unsafe","hamster":"unsafe","guinea_pig":"unsafe","ferret":"unsafe","horse":"unsafe","turtle":"unsafe","fish":"unsafe"}', 'Hazardous or toxic for certain pets. Ethanol causes severe metabolic acidosis, central nervous system depression, respiratory arrest, and coma.', 'No nutritional benefit; potential health hazard.', 'Ethanol causes severe metabolic acidosis, central nervous system depression, respiratory arrest, and coma.',
    'Vomiting, diarrhea, lethargy, loss of appetite, abdominal pain.', 'Contact your veterinarian or emergency animal poison hotline immediately.', '["Plain baked pumpkin","Carrot coins","Apple wedges (no seeds)"]', '[]',
    '[{"question":"Can my dog eat alcohol & beer?","answer":"For dogs, this food is rated: UNSAFE. Ethanol causes severe metabolic acidosis, central nervous system depression, respiratory arrest, and coma."},{"question":"Is alcohol & beer safe for cats?","answer":"For cats, this food is rated: UNSAFE. Cats are obligate carnivores with different nutritional needs."}]', '["alcohol & beer","drink","pet food safety","can my pet eat this"]', 1
  );

-- 2. POPULATE POPULAR BREEDS
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_golden_retriever', 'golden-retriever', 'dog', 'Golden Retriever', 'Friendly, intelligent, and devoted sporting dog known for its luxurious golden coat and gentle disposition.', 'Developed in the Scottish Highlands by Lord Tweedmouth in the mid-19th century to retrieve waterfowl.',
    '["Friendly","Intelligent","Devoted","Gentle","Playful"]', 'Goldens are famously good-natured and eager to please, making them top family companions.',
    'high', 'Requires 60-90 minutes of daily exercise including walks, fetch, and swimming.', 75,
    55, 75, 21.5, 24, 10, 12,
    '[{"name":"Hip Dysplasia","description":"Improper hip joint development."},{"name":"Cancer","description":"Higher risk of hemangiosarcoma and lymphoma."}]', 'Feed high-quality large-breed food; 2-3 cups daily split into two meals. Monitor weight.', 'Brush 2-3 times per week; daily during shedding seasons.', '2-3 times per week',
    '[{"question":"Are Golden Retrievers good with kids?","answer":"Yes, they are exceptionally patient and gentle with children."}]', '["dog-age-calculator","dog-food-calculator","dog-walking-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"fair","first_time_owners":"excellent"}', 'Scotland', 'Sporting',
    'Double coat, water-repellent', '["Light Golden","Golden","Dark Golden"]', 'large', 'high', 'high', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_labrador_retriever', 'labrador-retriever', 'dog', 'Labrador Retriever', 'America''s long-time favorite dog breed—an outgoing, active, and friendly companion.', 'Originated in Newfoundland assisting fishermen with nets, refined in 19th century Britain.',
    '["Outgoing","Even Tempered","Gentle","Agile","Intelligent"]', 'Labs are enthusiastic and affectionate with a playful puppy energy that lasts for years.',
    'high', 'Needs at least 60 minutes of active exercise and fetching daily.', 60,
    55, 80, 21.5, 24.5, 10, 12,
    '[{"name":"Obesity","description":"Genetic tendency to overeat."},{"name":"Hip Dysplasia","description":"Joint laxity."}]', 'Feed 2.5-3 cups daily; measure portions strictly to prevent weight gain.', 'Weekly brushing; daily during heavy seasonal coat blow.', 'Weekly',
    '[{"question":"What colors do Labs come in?","answer":"Black, Yellow, and Chocolate."}]', '["dog-age-calculator","dog-food-calculator","dog-calorie-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"good","first_time_owners":"excellent"}', 'Canada', 'Sporting',
    'Short, dense, water-resistant', '["Black","Yellow","Chocolate"]', 'large', 'high', 'high', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_german_shepherd', 'german-shepherd', 'dog', 'German Shepherd', 'A noble, large, and muscular working dog celebrated for world-class intelligence and fierce loyalty.', 'Bred in 1899 Germany by Max von Stephanitz as the ultimate herding and utility dog.',
    '["Confident","Courageous","Smart","Loyal","Protective"]', 'Deeply devoted to family with natural protective instincts; aloof with strangers.',
    'high', 'Requires 90+ minutes daily with physical games and mental puzzles.', 90,
    50, 90, 22, 26, 9, 13,
    '[{"name":"Hip Dysplasia","description":"Malformation of hip socket."},{"name":"Bloat","description":"Gastric dilatation volvulus."}]', 'Feed 3-4 cups high quality food daily in two separated meals.', 'Brush 2-3 times per week to control shedding.', '2-3 times per week',
    '[{"question":"Are German Shepherds easy to train?","answer":"Yes, they rank in the top 3 smartest and most trainable breeds."}]', '["dog-age-calculator","dog-food-calculator","dog-walking-calculator"]', '{"children":"good","other_pets":"good","apartments":"poor","first_time_owners":"fair"}', 'Germany', 'Herding',
    'Double coat, medium length', '["Black and Tan","Sable","All Black"]', 'large', 'very high', 'very high', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_french_bulldog', 'french-bulldog', 'dog', 'French Bulldog', 'Charming, compact companion dog with distinct bat ears and playful clownish personality.', 'Bred in 1800s England and brought to Paris where they became the toast of high society.',
    '["Playful","Smart","Adaptable","Affectionate","Quiet"]', 'Frenchies are docile, rarely bark, and make peerless companions for apartment living.',
    'low', 'Short walks (20-30 min) in cool weather; avoid heat overexertion.', 25,
    16, 28, 11, 13, 10, 12,
    '[{"name":"BOAS","description":"Brachycephalic obstructive airway syndrome."}]', 'Feed 1-1.5 cups small-breed kibble; use slow feeder bowl.', 'Weekly brushing; clean facial skin folds daily.', 'Weekly',
    '[{"question":"Can French Bulldogs swim?","answer":"No, their front-heavy body structure prevents swimming; always use a life vest near water."}]', '["dog-age-calculator","dog-food-calculator"]', '{"children":"excellent","other_pets":"good","apartments":"excellent","first_time_owners":"excellent"}', 'France', 'Non-Sporting',
    'Short, smooth single coat', '["Brindle","Fawn","White","Pied"]', 'small', 'low', 'low', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_poodle', 'poodle', 'dog', 'Poodle', 'An elegant, exceptionally smart breed available in Standard, Miniature, and Toy sizes.', 'Originally developed in Germany as duck retrievers (pudel = to splash), standardized in France.',
    '["Intelligent","Active","Alert","Faithful","Trainable"]', 'Poodles learn tricks effortlessly and excel in agility, obedience, and companionship.',
    'high', '45-60 minutes of walks, fetch, and mental stimulation.', 60,
    6, 70, 10, 22, 12, 15,
    '[{"name":"Addison''s Disease","description":"Adrenal insufficiency."}]', 'Feed size-appropriate food; Toys (1/3 cup), Standards (2-3 cups).', 'Daily brushing; professional grooming every 4-6 weeks.', 'Daily',
    '[{"question":"Do Poodles shed?","answer":"They have hair rather than fur and shed minimally, making them popular for allergy sufferers."}]', '["dog-age-calculator","dog-food-calculator","dog-walking-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}', 'Germany / France', 'Non-Sporting',
    'Dense curly single coat (hair)', '["Black","White","Apricot","Silver","Brown"]', 'varies', 'high', 'very low', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_persian_cat', 'persian-cat', 'cat', 'Persian Cat', 'Calm, gentle longhaired feline famed for its round face, short muzzle, and plush coat.', 'Ancient breed brought from Persia (modern Iran) into Europe in the 1600s.',
    '["Quiet","Sweet","Docile","Gentle","Affectionate"]', 'Persians prefer peaceful homes, gentle laps, and serene environments.',
    'low', 'Gentle interactive play 15 minutes twice daily.', 15,
    7, 12, 10, 15, 12, 17,
    '[{"name":"Polycystic Kidney Disease","description":"Genetic kidney cysts."}]', 'Feed high-moisture wet food to support kidney health.', 'Mandatory daily combing to prevent matting.', 'Daily',
    '[{"question":"How often should a Persian be brushed?","answer":"Every day without fail to prevent painful fur mats."}]', '["cat-age-calculator","cat-food-calculator"]', '{"children":"fair","other_pets":"good","apartments":"excellent","first_time_owners":"good"}', 'Iran', 'Long-haired',
    'Long, thick, silky double coat', '["White","Black","Blue","Cream","Silver","Calico"]', 'medium', 'low', 'very high', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_maine_coon', 'maine-coon', 'cat', 'Maine Coon', 'The gentle giant of cat breeds with a bushy tail, tufted ears, and dog-like loving personality.', 'Native to Maine, USA; adapted to harsh northeastern winters with heavy waterproof coat.',
    '["Gentle","Intelligent","Playful","Friendly","Sociable"]', 'Maine Coons love being around family members, greet visitors warmly, and enjoy water.',
    'medium', 'Interactive play, puzzle toys, and tree climbing 30-40 minutes daily.', 40,
    8, 25, 10, 16, 12, 15,
    '[{"name":"Hypertrophic Cardiomyopathy","description":"Heart muscle thickening."}]', 'High-protein diet formulated for large cat breeds.', 'Brush 2-3 times weekly with a stainless steel comb.', '2-3 times per week',
    '[{"question":"How big can a Maine Coon get?","answer":"Males often reach 18 to 25 pounds and can measure over 3 feet long from nose to tail tip."}]', '["cat-age-calculator","cat-food-calculator","cat-weight-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"good","first_time_owners":"excellent"}', 'United States', 'Long-haired',
    'Long, shaggy, water-resistant', '["Brown Tabby","Black","White","Blue","Red"]', 'extra large', 'medium', 'high', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_siamese_cat', 'siamese-cat', 'cat', 'Siamese Cat', 'Vocal, sleek, and strikingly intelligent cat with deep blue almond eyes and colorpoint coat.', 'Royal temple cats hailing from Siam (Thailand), beloved companion of royal dynasties.',
    '["Vocal","Social","Intelligent","Affectionate","Curious"]', 'Siamese cats converse constantly with their owners in loud, expressive tones.',
    'high', 'Very energetic; needs interactive wand toys, climbing shelves, and puzzles.', 45,
    6, 14, 8, 10, 12, 20,
    '[{"name":"Asthma","description":"Feline bronchial disease."}]', 'Calorie-dense, high-protein diet to fuel their high metabolism.', 'Weekly brushing with rubber comb.', 'Weekly',
    '[{"question":"Why do Siamese cats meow so much?","answer":"It is their signature genetic breed trait; they form strong attachments and voice their thoughts."}]', '["cat-age-calculator","cat-food-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"good"}', 'Thailand', 'Short-haired',
    'Short, fine, glossy single coat', '["Seal Point","Chocolate Point","Blue Point","Lilac Point"]', 'medium', 'very high', 'low', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_bulldog', 'bulldog', 'dog', 'Bulldog', 'Medium-sized, muscular dog with a distinctive wrinkled face, pushed-in nose, and docile temperament.', 'Descended from ancient mastiff breeds in England, originally used for bull-baiting until the 1830s.',
    '["Docile","Willful","Friendly","Gregarious","Courageous"]', 'Bulldogs are gentle, patient, and affectionate companions that enjoy a relaxed lifestyle.',
    'low', 'Short walks and light play; strictly avoid heat due to breathing anatomy.', 20,
    40, 50, 14, 15, 8, 10,
    '[{"name":"Brachycephalic Syndrome","description":"Upper airway resistance."},{"name":"Skin Fold Dermatitis","description":"Wrinkle irritation."}]', 'Feed 1.5-2 cups balanced food daily; strictly manage calories.', 'Weekly brushing; clean face folds daily with antiseptic wipe.', 'Weekly',
    '[{"question":"Are Bulldogs good with children?","answer":"Yes, they are famously patient, calm, and loving with young kids."}]', '["dog-age-calculator","dog-food-calculator"]', '{"children":"excellent","other_pets":"good","apartments":"excellent","first_time_owners":"good"}', 'England', 'Non-Sporting',
    'Short, smooth, fine coat', '["White","Fawn","Brindle","Red"]', 'medium', 'low', 'medium', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_beagle', 'beagle', 'dog', 'Beagle', 'Compact, hardy scent hound with gentle floppy ears, inquisitive nose, and cheerful, loving nature.', 'Bred in 1830s England for tracking rabbits and hares on foot hunts.',
    '["Friendly","Curious","Merry","Determined","Gentle"]', 'Beagles love pack life, adore family, and follow scent trails everywhere.',
    'medium', 'Needs 60 minutes of daily exercise and sniffing opportunities.', 60,
    20, 30, 13, 15, 10, 15,
    '[{"name":"Ear Infections","description":"Trapped moisture in long ears."},{"name":"Epilepsy","description":"Seizure disorder."}]', 'Feed 1-1.5 cups; beagles are notorious food scavengers so keep pantries secure.', 'Weekly brushing; clean ears regularly.', 'Weekly',
    '[{"question":"Do Beagles bay or howl?","answer":"Yes, Beagles are vocal hounds with a distinctive three-tone bark and bay."}]', '["dog-age-calculator","dog-food-calculator","dog-walking-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"fair","first_time_owners":"excellent"}', 'England', 'Hound',
    'Short, dense, weatherproof double coat', '["Tri-color","Red and White","Lemon and White"]', 'small', 'high', 'medium', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_siberian_husky', 'siberian-husky', 'dog', 'Siberian Husky', 'Graceful, high-endurance arctic sled dog celebrated for its wolf-like appearance and captivating blue eyes.', 'Bred by the Chukchi people in northeastern Asia as endurance sled pullers and companions.',
    '["Friendly","Gentle","Alert","Outgoing","Mischievous"]', 'Extremely sociable, highly independent, and famous for talking and howling.',
    'very high', 'Needs 90+ minutes of running, pulling, or vigorous outdoor hiking.', 90,
    35, 60, 20, 23.5, 12, 14,
    '[{"name":"Cataracts","description":"Juvenile eye cataracts."},{"name":"Hip Dysplasia","description":"Joint condition."}]', 'Feed 2 cups nutrient-dense food; Huskies have an exceptionally efficient metabolism.', 'Brush 2 times per week; daily during intense semi-annual coat blow.', '2 times per week',
    '[{"question":"Can Huskies live in warm climates?","answer":"They prefer cold weather, but can adapt if provided air conditioning and shaded water access."}]', '["dog-age-calculator","dog-food-calculator","dog-walking-calculator"]', '{"children":"excellent","other_pets":"fair","apartments":"poor","first_time_owners":"fair"}', 'Siberia (Russia)', 'Working',
    'Thick double coat with soft undercoat', '["Black and White","Gray and White","Red and White","Pure White"]', 'medium', 'very high', 'very high', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_ragdoll', 'ragdoll', 'cat', 'Ragdoll', 'Large, plush semi-longhaired cat famous for relaxing completely limp into the arms of loved ones.', 'Developed in 1960s California by Ann Baker for sweet temperament and non-matting silky coat.',
    '["Docile","Affectionate","Gentle","Quiet","Trusting"]', 'Ragdolls follow humans like puppy dogs and greet family members warmly at the door.',
    'low', 'Gentle play sessions 15-20 minutes twice daily.', 20,
    10, 20, 9, 11, 12, 17,
    '[{"name":"HCM","description":"Hypertrophic cardiomyopathy."}]', 'Feed 3/4 to 1 cup balanced food; monitor weight as they grow until 4 years old.', 'Comb twice weekly with wide-tooth comb.', 'Twice weekly',
    '[{"question":"Are Ragdolls safe outdoor cats?","answer":"No, Ragdolls should be strictly indoor cats because they lack defense instincts."}]', '["cat-age-calculator","cat-food-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}', 'United States', 'Long-haired',
    'Semi-long silky single coat', '["Seal","Blue","Chocolate","Lilac","Flame"]', 'large', 'low', 'medium', 'high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_british_shorthair', 'british-shorthair', 'cat', 'British Shorthair', 'Sturdy, teddy-bear-like cat with plush dense coat, round cheeks, and calm, easygoing demeanor.', 'Descended from cats imported into Britain by Roman conquerors; Britain''s oldest native breed.',
    '["Easygoing","Calm","Affectionate","Reserved","Loyal"]', 'Quiet and dignified; loves resting beside you on the sofa without being demanding.',
    'low', 'Moderate play 15 minutes daily with laser or teaser toy.', 15,
    9, 18, 12, 14, 12, 17,
    '[{"name":"HCM","description":"Heart muscle disorder."},{"name":"Obesity","description":"Prone to weight gain."}]', 'Feed controlled portions to maintain optimal body condition score.', 'Weekly brushing with rubber grooming mitt.', 'Weekly',
    '[{"question":"Is the blue British Shorthair the only color?","answer":"No, while \"British Blue\" is famous, they come in over 30 colors and patterns."}]', '["cat-age-calculator","cat-food-calculator"]', '{"children":"excellent","other_pets":"excellent","apartments":"excellent","first_time_owners":"excellent"}', 'United Kingdom', 'Short-haired',
    'Dense, crisp, plush double coat', '["Blue","Black","White","Cream","Silver Tabby"]', 'medium', 'low', 'medium', 'medium', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_holland_lop', 'holland-lop', 'rabbit', 'Holland Lop', 'Adorable miniature lop-eared rabbit recognized as one of the most popular house rabbit breeds in the world.', 'Created in the Netherlands in the 1950s by crossing French Lops with Netherland Dwarfs.',
    '["Sweet","Docile","Playful","Curious","Gentle"]', 'Holland Lops are calm, affectionate, and can easily be litter-trained for free-roaming in pet-proof homes.',
    'medium', 'Needs 2-3 hours of supervised hop-around floor time daily.', 120,
    2, 4, 5, 6, 7, 12,
    '[{"name":"Dental Malocclusion","description":"Overgrown molars requiring trimming."},{"name":"GI Stasis","description":"Digestive slowdown requiring hay."}]', 'Unlimited fresh timothy hay (80% of diet), fresh greens, and 1/8 cup pellets daily.', 'Weekly brushing; daily during shedding periods.', 'Weekly',
    '[{"question":"Can Holland Lops be litter-box trained?","answer":"Yes! Placing hay directly over a litter box with paper bedding makes training very simple."}]', '["rabbit-food-calculator"]', '{"children":"good","other_pets":"good","apartments":"excellent","first_time_owners":"excellent"}', 'Netherlands', 'Lop',
    'Soft, dense rollback fur', '["Tortoise","Broken","Solid Black","Blue","Fawn"]', 'small', 'medium', 'medium', 'high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_cockatiel', 'cockatiel', 'bird', 'Cockatiel', 'Gentle, crested Australian parrot beloved for its whistling talent, orange cheek patches, and sweet nature.', 'Native to the Australian outback, discovered in the 1770s during Captain Cook''s expeditions.',
    '["Gentle","Whistling","Affectionate","Curious","Social"]', 'Cockatiels love head scratches, whistle popular tunes, and bond deeply with caregivers.',
    'medium', 'Needs at least 1-2 hours out-of-cage flying and interaction time daily.', 60,
    0.18, 0.28, 12, 13, 15, 25,
    '[{"name":"Psittacosis","description":"Bacterial avian respiratory disease."},{"name":"Night Frights","description":"Startling in dark rooms."}]', 'Pelleted avian diet (60%), fresh dark leafy vegetables (30%), and seed treats (10%).', 'Provide shallow dish for regular misting and bathing.', 'Weekly bath',
    '[{"question":"Can Cockatiels talk?","answer":"While they mimic a few words, they excel dramatically at whistling tunes, jingles, and melodies."}]', '["bird-wing-clipping-guide"]', '{"children":"excellent","other_pets":"fair","apartments":"good","first_time_owners":"excellent"}', 'Australia', 'Cacatuidae (Cockatoo)',
    'Feathers with movable expressive crest', '["Grey","Lutino","Pied","Pearl","Cinnamon","Whiteface"]', 'small', 'medium', 'low', 'very high', 1
  );
INSERT OR REPLACE INTO breeds (
    id, slug, species, name, overview, history, temperament_traits, temperament_description,
    exercise_level, exercise_description, exercise_minutes_per_day,
    weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
    common_diseases, nutrition, grooming, grooming_frequency,
    faqs, related_tool_slugs, good_with, origin_country, breed_group,
    coat_type, coat_colors, size_category, energy_level, shedding_level, trainability, published
  ) VALUES (
    'breed_quarter_horse', 'quarter-horse', 'horse', 'American Quarter Horse', 'The most popular equine breed in the United States, famous for blinding sprint speed and calm temperament.', 'Bred in colonial America by crossing English thoroughbreds with native Chickasaw horses.',
    '["Gentle","Hardworking","Intelligent","Level-headed","Versatile"]', 'Known for their extraordinary "cow sense," steady nerves, and willingness to work with beginners.',
    'high', 'Requires daily riding, lunging, or open pasture turnout.', 60,
    950, 1200, 56, 64, 25, 33,
    '[{"name":"HYPP","description":"Hyperkalemic periodic paralysis."},{"name":"Navicular Syndrome","description":"Heel pain condition."}]', 'High-quality grass/alfalfa hay (1.5-2% of body weight daily) plus mineral salt lick and clean water.', 'Daily currying, brushing, and hoof picking before and after riding.', 'Daily',
    '[{"question":"Why is it called a Quarter Horse?","answer":"Because of its unmatched ability to outrun all other horse breeds in quarter-mile sprint races."}]', '["horse-farrier-schedule"]', '{"children":"excellent","other_pets":"excellent","apartments":"poor","first_time_owners":"excellent"}', 'United States', 'Stock Horse',
    'Fine, short coat with thick winter coat', '["Sorrel","Chestnut","Bay","Black","Palomino","Buckskin","Dun"]', 'extra large', 'high', 'medium', 'very high', 1
  );
