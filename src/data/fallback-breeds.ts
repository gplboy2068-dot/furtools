import type { BreedRow } from "@/lib/breeds";

export const FALLBACK_BREEDS: BreedRow[] = [
  {
    "id": "breed_golden_retriever",
    "slug": "golden-retriever",
    "species": "dog",
    "name": "Golden Retriever",
    "hero_image": null,
    "overview": "Friendly, intelligent, and devoted sporting dog known for its luxurious golden coat and gentle disposition.",
    "history": "Developed in the Scottish Highlands by Lord Tweedmouth in the mid-19th century to retrieve waterfowl.",
    "temperament_traits": [
      "Friendly",
      "Intelligent",
      "Devoted",
      "Gentle",
      "Playful"
    ],
    "temperament_description": "Goldens are famously good-natured and eager to please, making them top family companions.",
    "exercise_level": "high",
    "exercise_description": "Requires 60-90 minutes of daily exercise including walks, fetch, and swimming.",
    "exercise_minutes_per_day": 75,
    "weight_min": 55,
    "weight_max": 75,
    "weight_unit": "lbs",
    "height_min": 21.5,
    "height_max": 24,
    "height_unit": "inches",
    "lifespan_min": 10,
    "lifespan_max": 12,
    "common_diseases": [
      {
        "name": "Hip Dysplasia",
        "description": "Improper hip joint development."
      },
      {
        "name": "Cancer",
        "description": "Higher risk of hemangiosarcoma and lymphoma."
      }
    ],
    "nutrition": "Feed high-quality large-breed food; 2-3 cups daily split into two meals. Monitor weight.",
    "grooming": "Brush 2-3 times per week; daily during shedding seasons.",
    "grooming_frequency": "2-3 times per week",
    "images": [],
    "faqs": [
      {
        "question": "Are Golden Retrievers good with kids?",
        "answer": "Yes, they are exceptionally patient and gentle with children."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-walking-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "fair",
      "first_time_owners": "excellent"
    },
    "origin_country": "Scotland",
    "breed_group": "Sporting",
    "coat_type": "Double coat, water-repellent",
    "coat_colors": [
      "Light Golden",
      "Golden",
      "Dark Golden"
    ],
    "size_category": "large",
    "energy_level": "high",
    "shedding_level": "high",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_labrador_retriever",
    "slug": "labrador-retriever",
    "species": "dog",
    "name": "Labrador Retriever",
    "hero_image": null,
    "overview": "America's long-time favorite dog breed—an outgoing, active, and friendly companion.",
    "history": "Originated in Newfoundland assisting fishermen with nets, refined in 19th century Britain.",
    "temperament_traits": [
      "Outgoing",
      "Even Tempered",
      "Gentle",
      "Agile",
      "Intelligent"
    ],
    "temperament_description": "Labs are enthusiastic and affectionate with a playful puppy energy that lasts for years.",
    "exercise_level": "high",
    "exercise_description": "Needs at least 60 minutes of active exercise and fetching daily.",
    "exercise_minutes_per_day": 60,
    "weight_min": 55,
    "weight_max": 80,
    "weight_unit": "lbs",
    "height_min": 21.5,
    "height_max": 24.5,
    "height_unit": "inches",
    "lifespan_min": 10,
    "lifespan_max": 12,
    "common_diseases": [
      {
        "name": "Obesity",
        "description": "Genetic tendency to overeat."
      },
      {
        "name": "Hip Dysplasia",
        "description": "Joint laxity."
      }
    ],
    "nutrition": "Feed 2.5-3 cups daily; measure portions strictly to prevent weight gain.",
    "grooming": "Weekly brushing; daily during heavy seasonal coat blow.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "What colors do Labs come in?",
        "answer": "Black, Yellow, and Chocolate."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-calorie-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "good",
      "first_time_owners": "excellent"
    },
    "origin_country": "Canada",
    "breed_group": "Sporting",
    "coat_type": "Short, dense, water-resistant",
    "coat_colors": [
      "Black",
      "Yellow",
      "Chocolate"
    ],
    "size_category": "large",
    "energy_level": "high",
    "shedding_level": "high",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_german_shepherd",
    "slug": "german-shepherd",
    "species": "dog",
    "name": "German Shepherd",
    "hero_image": null,
    "overview": "A noble, large, and muscular working dog celebrated for world-class intelligence and fierce loyalty.",
    "history": "Bred in 1899 Germany by Max von Stephanitz as the ultimate herding and utility dog.",
    "temperament_traits": [
      "Confident",
      "Courageous",
      "Smart",
      "Loyal",
      "Protective"
    ],
    "temperament_description": "Deeply devoted to family with natural protective instincts; aloof with strangers.",
    "exercise_level": "high",
    "exercise_description": "Requires 90+ minutes daily with physical games and mental puzzles.",
    "exercise_minutes_per_day": 90,
    "weight_min": 50,
    "weight_max": 90,
    "weight_unit": "lbs",
    "height_min": 22,
    "height_max": 26,
    "height_unit": "inches",
    "lifespan_min": 9,
    "lifespan_max": 13,
    "common_diseases": [
      {
        "name": "Hip Dysplasia",
        "description": "Malformation of hip socket."
      },
      {
        "name": "Bloat",
        "description": "Gastric dilatation volvulus."
      }
    ],
    "nutrition": "Feed 3-4 cups high quality food daily in two separated meals.",
    "grooming": "Brush 2-3 times per week to control shedding.",
    "grooming_frequency": "2-3 times per week",
    "images": [],
    "faqs": [
      {
        "question": "Are German Shepherds easy to train?",
        "answer": "Yes, they rank in the top 3 smartest and most trainable breeds."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-walking-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "good",
      "other_pets": "good",
      "apartments": "poor",
      "first_time_owners": "fair"
    },
    "origin_country": "Germany",
    "breed_group": "Herding",
    "coat_type": "Double coat, medium length",
    "coat_colors": [
      "Black and Tan",
      "Sable",
      "All Black"
    ],
    "size_category": "large",
    "energy_level": "very high",
    "shedding_level": "very high",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_french_bulldog",
    "slug": "french-bulldog",
    "species": "dog",
    "name": "French Bulldog",
    "hero_image": null,
    "overview": "Charming, compact companion dog with distinct bat ears and playful clownish personality.",
    "history": "Bred in 1800s England and brought to Paris where they became the toast of high society.",
    "temperament_traits": [
      "Playful",
      "Smart",
      "Adaptable",
      "Affectionate",
      "Quiet"
    ],
    "temperament_description": "Frenchies are docile, rarely bark, and make peerless companions for apartment living.",
    "exercise_level": "low",
    "exercise_description": "Short walks (20-30 min) in cool weather; avoid heat overexertion.",
    "exercise_minutes_per_day": 25,
    "weight_min": 16,
    "weight_max": 28,
    "weight_unit": "lbs",
    "height_min": 11,
    "height_max": 13,
    "height_unit": "inches",
    "lifespan_min": 10,
    "lifespan_max": 12,
    "common_diseases": [
      {
        "name": "BOAS",
        "description": "Brachycephalic obstructive airway syndrome."
      }
    ],
    "nutrition": "Feed 1-1.5 cups small-breed kibble; use slow feeder bowl.",
    "grooming": "Weekly brushing; clean facial skin folds daily.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Can French Bulldogs swim?",
        "answer": "No, their front-heavy body structure prevents swimming; always use a life vest near water."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "good",
      "apartments": "excellent",
      "first_time_owners": "excellent"
    },
    "origin_country": "France",
    "breed_group": "Non-Sporting",
    "coat_type": "Short, smooth single coat",
    "coat_colors": [
      "Brindle",
      "Fawn",
      "White",
      "Pied"
    ],
    "size_category": "small",
    "energy_level": "low",
    "shedding_level": "low",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_poodle",
    "slug": "poodle",
    "species": "dog",
    "name": "Poodle",
    "hero_image": null,
    "overview": "An elegant, exceptionally smart breed available in Standard, Miniature, and Toy sizes.",
    "history": "Originally developed in Germany as duck retrievers (pudel = to splash), standardized in France.",
    "temperament_traits": [
      "Intelligent",
      "Active",
      "Alert",
      "Faithful",
      "Trainable"
    ],
    "temperament_description": "Poodles learn tricks effortlessly and excel in agility, obedience, and companionship.",
    "exercise_level": "high",
    "exercise_description": "45-60 minutes of walks, fetch, and mental stimulation.",
    "exercise_minutes_per_day": 60,
    "weight_min": 6,
    "weight_max": 70,
    "weight_unit": "lbs",
    "height_min": 10,
    "height_max": 22,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 15,
    "common_diseases": [
      {
        "name": "Addison's Disease",
        "description": "Adrenal insufficiency."
      }
    ],
    "nutrition": "Feed size-appropriate food; Toys (1/3 cup), Standards (2-3 cups).",
    "grooming": "Daily brushing; professional grooming every 4-6 weeks.",
    "grooming_frequency": "Daily",
    "images": [],
    "faqs": [
      {
        "question": "Do Poodles shed?",
        "answer": "They have hair rather than fur and shed minimally, making them popular for allergy sufferers."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-walking-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "excellent",
      "first_time_owners": "excellent"
    },
    "origin_country": "Germany / France",
    "breed_group": "Non-Sporting",
    "coat_type": "Dense curly single coat (hair)",
    "coat_colors": [
      "Black",
      "White",
      "Apricot",
      "Silver",
      "Brown"
    ],
    "size_category": "varies",
    "energy_level": "high",
    "shedding_level": "very low",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_persian_cat",
    "slug": "persian-cat",
    "species": "cat",
    "name": "Persian Cat",
    "hero_image": null,
    "overview": "Calm, gentle longhaired feline famed for its round face, short muzzle, and plush coat.",
    "history": "Ancient breed brought from Persia (modern Iran) into Europe in the 1600s.",
    "temperament_traits": [
      "Quiet",
      "Sweet",
      "Docile",
      "Gentle",
      "Affectionate"
    ],
    "temperament_description": "Persians prefer peaceful homes, gentle laps, and serene environments.",
    "exercise_level": "low",
    "exercise_description": "Gentle interactive play 15 minutes twice daily.",
    "exercise_minutes_per_day": 15,
    "weight_min": 7,
    "weight_max": 12,
    "weight_unit": "lbs",
    "height_min": 10,
    "height_max": 15,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 17,
    "common_diseases": [
      {
        "name": "Polycystic Kidney Disease",
        "description": "Genetic kidney cysts."
      }
    ],
    "nutrition": "Feed high-moisture wet food to support kidney health.",
    "grooming": "Mandatory daily combing to prevent matting.",
    "grooming_frequency": "Daily",
    "images": [],
    "faqs": [
      {
        "question": "How often should a Persian be brushed?",
        "answer": "Every day without fail to prevent painful fur mats."
      }
    ],
    "related_tool_slugs": [
      "cat-age-calculator",
      "cat-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "fair",
      "other_pets": "good",
      "apartments": "excellent",
      "first_time_owners": "good"
    },
    "origin_country": "Iran",
    "breed_group": "Long-haired",
    "coat_type": "Long, thick, silky double coat",
    "coat_colors": [
      "White",
      "Black",
      "Blue",
      "Cream",
      "Silver",
      "Calico"
    ],
    "size_category": "medium",
    "energy_level": "low",
    "shedding_level": "very high",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_maine_coon",
    "slug": "maine-coon",
    "species": "cat",
    "name": "Maine Coon",
    "hero_image": null,
    "overview": "The gentle giant of cat breeds with a bushy tail, tufted ears, and dog-like loving personality.",
    "history": "Native to Maine, USA; adapted to harsh northeastern winters with heavy waterproof coat.",
    "temperament_traits": [
      "Gentle",
      "Intelligent",
      "Playful",
      "Friendly",
      "Sociable"
    ],
    "temperament_description": "Maine Coons love being around family members, greet visitors warmly, and enjoy water.",
    "exercise_level": "medium",
    "exercise_description": "Interactive play, puzzle toys, and tree climbing 30-40 minutes daily.",
    "exercise_minutes_per_day": 40,
    "weight_min": 8,
    "weight_max": 25,
    "weight_unit": "lbs",
    "height_min": 10,
    "height_max": 16,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 15,
    "common_diseases": [
      {
        "name": "Hypertrophic Cardiomyopathy",
        "description": "Heart muscle thickening."
      }
    ],
    "nutrition": "High-protein diet formulated for large cat breeds.",
    "grooming": "Brush 2-3 times weekly with a stainless steel comb.",
    "grooming_frequency": "2-3 times per week",
    "images": [],
    "faqs": [
      {
        "question": "How big can a Maine Coon get?",
        "answer": "Males often reach 18 to 25 pounds and can measure over 3 feet long from nose to tail tip."
      }
    ],
    "related_tool_slugs": [
      "cat-age-calculator",
      "cat-food-calculator",
      "cat-weight-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "good",
      "first_time_owners": "excellent"
    },
    "origin_country": "United States",
    "breed_group": "Long-haired",
    "coat_type": "Long, shaggy, water-resistant",
    "coat_colors": [
      "Brown Tabby",
      "Black",
      "White",
      "Blue",
      "Red"
    ],
    "size_category": "extra large",
    "energy_level": "medium",
    "shedding_level": "high",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_siamese_cat",
    "slug": "siamese-cat",
    "species": "cat",
    "name": "Siamese Cat",
    "hero_image": null,
    "overview": "Vocal, sleek, and strikingly intelligent cat with deep blue almond eyes and colorpoint coat.",
    "history": "Royal temple cats hailing from Siam (Thailand), beloved companion of royal dynasties.",
    "temperament_traits": [
      "Vocal",
      "Social",
      "Intelligent",
      "Affectionate",
      "Curious"
    ],
    "temperament_description": "Siamese cats converse constantly with their owners in loud, expressive tones.",
    "exercise_level": "high",
    "exercise_description": "Very energetic; needs interactive wand toys, climbing shelves, and puzzles.",
    "exercise_minutes_per_day": 45,
    "weight_min": 6,
    "weight_max": 14,
    "weight_unit": "lbs",
    "height_min": 8,
    "height_max": 10,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 20,
    "common_diseases": [
      {
        "name": "Asthma",
        "description": "Feline bronchial disease."
      }
    ],
    "nutrition": "Calorie-dense, high-protein diet to fuel their high metabolism.",
    "grooming": "Weekly brushing with rubber comb.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Why do Siamese cats meow so much?",
        "answer": "It is their signature genetic breed trait; they form strong attachments and voice their thoughts."
      }
    ],
    "related_tool_slugs": [
      "cat-age-calculator",
      "cat-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "excellent",
      "first_time_owners": "good"
    },
    "origin_country": "Thailand",
    "breed_group": "Short-haired",
    "coat_type": "Short, fine, glossy single coat",
    "coat_colors": [
      "Seal Point",
      "Chocolate Point",
      "Blue Point",
      "Lilac Point"
    ],
    "size_category": "medium",
    "energy_level": "very high",
    "shedding_level": "low",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_bulldog",
    "slug": "bulldog",
    "species": "dog",
    "name": "Bulldog",
    "hero_image": null,
    "overview": "Medium-sized, muscular dog with a distinctive wrinkled face, pushed-in nose, and docile temperament.",
    "history": "Descended from ancient mastiff breeds in England, originally used for bull-baiting until the 1830s.",
    "temperament_traits": [
      "Docile",
      "Willful",
      "Friendly",
      "Gregarious",
      "Courageous"
    ],
    "temperament_description": "Bulldogs are gentle, patient, and affectionate companions that enjoy a relaxed lifestyle.",
    "exercise_level": "low",
    "exercise_description": "Short walks and light play; strictly avoid heat due to breathing anatomy.",
    "exercise_minutes_per_day": 20,
    "weight_min": 40,
    "weight_max": 50,
    "weight_unit": "lbs",
    "height_min": 14,
    "height_max": 15,
    "height_unit": "inches",
    "lifespan_min": 8,
    "lifespan_max": 10,
    "common_diseases": [
      {
        "name": "Brachycephalic Syndrome",
        "description": "Upper airway resistance."
      },
      {
        "name": "Skin Fold Dermatitis",
        "description": "Wrinkle irritation."
      }
    ],
    "nutrition": "Feed 1.5-2 cups balanced food daily; strictly manage calories.",
    "grooming": "Weekly brushing; clean face folds daily with antiseptic wipe.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Are Bulldogs good with children?",
        "answer": "Yes, they are famously patient, calm, and loving with young kids."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "good",
      "apartments": "excellent",
      "first_time_owners": "good"
    },
    "origin_country": "England",
    "breed_group": "Non-Sporting",
    "coat_type": "Short, smooth, fine coat",
    "coat_colors": [
      "White",
      "Fawn",
      "Brindle",
      "Red"
    ],
    "size_category": "medium",
    "energy_level": "low",
    "shedding_level": "medium",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_beagle",
    "slug": "beagle",
    "species": "dog",
    "name": "Beagle",
    "hero_image": null,
    "overview": "Compact, hardy scent hound with gentle floppy ears, inquisitive nose, and cheerful, loving nature.",
    "history": "Bred in 1830s England for tracking rabbits and hares on foot hunts.",
    "temperament_traits": [
      "Friendly",
      "Curious",
      "Merry",
      "Determined",
      "Gentle"
    ],
    "temperament_description": "Beagles love pack life, adore family, and follow scent trails everywhere.",
    "exercise_level": "medium",
    "exercise_description": "Needs 60 minutes of daily exercise and sniffing opportunities.",
    "exercise_minutes_per_day": 60,
    "weight_min": 20,
    "weight_max": 30,
    "weight_unit": "lbs",
    "height_min": 13,
    "height_max": 15,
    "height_unit": "inches",
    "lifespan_min": 10,
    "lifespan_max": 15,
    "common_diseases": [
      {
        "name": "Ear Infections",
        "description": "Trapped moisture in long ears."
      },
      {
        "name": "Epilepsy",
        "description": "Seizure disorder."
      }
    ],
    "nutrition": "Feed 1-1.5 cups; beagles are notorious food scavengers so keep pantries secure.",
    "grooming": "Weekly brushing; clean ears regularly.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Do Beagles bay or howl?",
        "answer": "Yes, Beagles are vocal hounds with a distinctive three-tone bark and bay."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-walking-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "fair",
      "first_time_owners": "excellent"
    },
    "origin_country": "England",
    "breed_group": "Hound",
    "coat_type": "Short, dense, weatherproof double coat",
    "coat_colors": [
      "Tri-color",
      "Red and White",
      "Lemon and White"
    ],
    "size_category": "small",
    "energy_level": "high",
    "shedding_level": "medium",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_siberian_husky",
    "slug": "siberian-husky",
    "species": "dog",
    "name": "Siberian Husky",
    "hero_image": null,
    "overview": "Graceful, high-endurance arctic sled dog celebrated for its wolf-like appearance and captivating blue eyes.",
    "history": "Bred by the Chukchi people in northeastern Asia as endurance sled pullers and companions.",
    "temperament_traits": [
      "Friendly",
      "Gentle",
      "Alert",
      "Outgoing",
      "Mischievous"
    ],
    "temperament_description": "Extremely sociable, highly independent, and famous for talking and howling.",
    "exercise_level": "very high",
    "exercise_description": "Needs 90+ minutes of running, pulling, or vigorous outdoor hiking.",
    "exercise_minutes_per_day": 90,
    "weight_min": 35,
    "weight_max": 60,
    "weight_unit": "lbs",
    "height_min": 20,
    "height_max": 23.5,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 14,
    "common_diseases": [
      {
        "name": "Cataracts",
        "description": "Juvenile eye cataracts."
      },
      {
        "name": "Hip Dysplasia",
        "description": "Joint condition."
      }
    ],
    "nutrition": "Feed 2 cups nutrient-dense food; Huskies have an exceptionally efficient metabolism.",
    "grooming": "Brush 2 times per week; daily during intense semi-annual coat blow.",
    "grooming_frequency": "2 times per week",
    "images": [],
    "faqs": [
      {
        "question": "Can Huskies live in warm climates?",
        "answer": "They prefer cold weather, but can adapt if provided air conditioning and shaded water access."
      }
    ],
    "related_tool_slugs": [
      "dog-age-calculator",
      "dog-food-calculator",
      "dog-walking-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "fair",
      "apartments": "poor",
      "first_time_owners": "fair"
    },
    "origin_country": "Siberia (Russia)",
    "breed_group": "Working",
    "coat_type": "Thick double coat with soft undercoat",
    "coat_colors": [
      "Black and White",
      "Gray and White",
      "Red and White",
      "Pure White"
    ],
    "size_category": "medium",
    "energy_level": "very high",
    "shedding_level": "very high",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_ragdoll",
    "slug": "ragdoll",
    "species": "cat",
    "name": "Ragdoll",
    "hero_image": null,
    "overview": "Large, plush semi-longhaired cat famous for relaxing completely limp into the arms of loved ones.",
    "history": "Developed in 1960s California by Ann Baker for sweet temperament and non-matting silky coat.",
    "temperament_traits": [
      "Docile",
      "Affectionate",
      "Gentle",
      "Quiet",
      "Trusting"
    ],
    "temperament_description": "Ragdolls follow humans like puppy dogs and greet family members warmly at the door.",
    "exercise_level": "low",
    "exercise_description": "Gentle play sessions 15-20 minutes twice daily.",
    "exercise_minutes_per_day": 20,
    "weight_min": 10,
    "weight_max": 20,
    "weight_unit": "lbs",
    "height_min": 9,
    "height_max": 11,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 17,
    "common_diseases": [
      {
        "name": "HCM",
        "description": "Hypertrophic cardiomyopathy."
      }
    ],
    "nutrition": "Feed 3/4 to 1 cup balanced food; monitor weight as they grow until 4 years old.",
    "grooming": "Comb twice weekly with wide-tooth comb.",
    "grooming_frequency": "Twice weekly",
    "images": [],
    "faqs": [
      {
        "question": "Are Ragdolls safe outdoor cats?",
        "answer": "No, Ragdolls should be strictly indoor cats because they lack defense instincts."
      }
    ],
    "related_tool_slugs": [
      "cat-age-calculator",
      "cat-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "excellent",
      "first_time_owners": "excellent"
    },
    "origin_country": "United States",
    "breed_group": "Long-haired",
    "coat_type": "Semi-long silky single coat",
    "coat_colors": [
      "Seal",
      "Blue",
      "Chocolate",
      "Lilac",
      "Flame"
    ],
    "size_category": "large",
    "energy_level": "low",
    "shedding_level": "medium",
    "trainability": "high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_british_shorthair",
    "slug": "british-shorthair",
    "species": "cat",
    "name": "British Shorthair",
    "hero_image": null,
    "overview": "Sturdy, teddy-bear-like cat with plush dense coat, round cheeks, and calm, easygoing demeanor.",
    "history": "Descended from cats imported into Britain by Roman conquerors; Britain's oldest native breed.",
    "temperament_traits": [
      "Easygoing",
      "Calm",
      "Affectionate",
      "Reserved",
      "Loyal"
    ],
    "temperament_description": "Quiet and dignified; loves resting beside you on the sofa without being demanding.",
    "exercise_level": "low",
    "exercise_description": "Moderate play 15 minutes daily with laser or teaser toy.",
    "exercise_minutes_per_day": 15,
    "weight_min": 9,
    "weight_max": 18,
    "weight_unit": "lbs",
    "height_min": 12,
    "height_max": 14,
    "height_unit": "inches",
    "lifespan_min": 12,
    "lifespan_max": 17,
    "common_diseases": [
      {
        "name": "HCM",
        "description": "Heart muscle disorder."
      },
      {
        "name": "Obesity",
        "description": "Prone to weight gain."
      }
    ],
    "nutrition": "Feed controlled portions to maintain optimal body condition score.",
    "grooming": "Weekly brushing with rubber grooming mitt.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Is the blue British Shorthair the only color?",
        "answer": "No, while \"British Blue\" is famous, they come in over 30 colors and patterns."
      }
    ],
    "related_tool_slugs": [
      "cat-age-calculator",
      "cat-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "excellent",
      "first_time_owners": "excellent"
    },
    "origin_country": "United Kingdom",
    "breed_group": "Short-haired",
    "coat_type": "Dense, crisp, plush double coat",
    "coat_colors": [
      "Blue",
      "Black",
      "White",
      "Cream",
      "Silver Tabby"
    ],
    "size_category": "medium",
    "energy_level": "low",
    "shedding_level": "medium",
    "trainability": "medium",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_holland_lop",
    "slug": "holland-lop",
    "species": "rabbit",
    "name": "Holland Lop",
    "hero_image": null,
    "overview": "Adorable miniature lop-eared rabbit recognized as one of the most popular house rabbit breeds in the world.",
    "history": "Created in the Netherlands in the 1950s by crossing French Lops with Netherland Dwarfs.",
    "temperament_traits": [
      "Sweet",
      "Docile",
      "Playful",
      "Curious",
      "Gentle"
    ],
    "temperament_description": "Holland Lops are calm, affectionate, and can easily be litter-trained for free-roaming in pet-proof homes.",
    "exercise_level": "medium",
    "exercise_description": "Needs 2-3 hours of supervised hop-around floor time daily.",
    "exercise_minutes_per_day": 120,
    "weight_min": 2,
    "weight_max": 4,
    "weight_unit": "lbs",
    "height_min": 5,
    "height_max": 6,
    "height_unit": "inches",
    "lifespan_min": 7,
    "lifespan_max": 12,
    "common_diseases": [
      {
        "name": "Dental Malocclusion",
        "description": "Overgrown molars requiring trimming."
      },
      {
        "name": "GI Stasis",
        "description": "Digestive slowdown requiring hay."
      }
    ],
    "nutrition": "Unlimited fresh timothy hay (80% of diet), fresh greens, and 1/8 cup pellets daily.",
    "grooming": "Weekly brushing; daily during shedding periods.",
    "grooming_frequency": "Weekly",
    "images": [],
    "faqs": [
      {
        "question": "Can Holland Lops be litter-box trained?",
        "answer": "Yes! Placing hay directly over a litter box with paper bedding makes training very simple."
      }
    ],
    "related_tool_slugs": [
      "rabbit-food-calculator"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "good",
      "other_pets": "good",
      "apartments": "excellent",
      "first_time_owners": "excellent"
    },
    "origin_country": "Netherlands",
    "breed_group": "Lop",
    "coat_type": "Soft, dense rollback fur",
    "coat_colors": [
      "Tortoise",
      "Broken",
      "Solid Black",
      "Blue",
      "Fawn"
    ],
    "size_category": "small",
    "energy_level": "medium",
    "shedding_level": "medium",
    "trainability": "high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_cockatiel",
    "slug": "cockatiel",
    "species": "bird",
    "name": "Cockatiel",
    "hero_image": null,
    "overview": "Gentle, crested Australian parrot beloved for its whistling talent, orange cheek patches, and sweet nature.",
    "history": "Native to the Australian outback, discovered in the 1770s during Captain Cook's expeditions.",
    "temperament_traits": [
      "Gentle",
      "Whistling",
      "Affectionate",
      "Curious",
      "Social"
    ],
    "temperament_description": "Cockatiels love head scratches, whistle popular tunes, and bond deeply with caregivers.",
    "exercise_level": "medium",
    "exercise_description": "Needs at least 1-2 hours out-of-cage flying and interaction time daily.",
    "exercise_minutes_per_day": 60,
    "weight_min": 0.18,
    "weight_max": 0.28,
    "weight_unit": "lbs",
    "height_min": 12,
    "height_max": 13,
    "height_unit": "inches",
    "lifespan_min": 15,
    "lifespan_max": 25,
    "common_diseases": [
      {
        "name": "Psittacosis",
        "description": "Bacterial avian respiratory disease."
      },
      {
        "name": "Night Frights",
        "description": "Startling in dark rooms."
      }
    ],
    "nutrition": "Pelleted avian diet (60%), fresh dark leafy vegetables (30%), and seed treats (10%).",
    "grooming": "Provide shallow dish for regular misting and bathing.",
    "grooming_frequency": "Weekly bath",
    "images": [],
    "faqs": [
      {
        "question": "Can Cockatiels talk?",
        "answer": "While they mimic a few words, they excel dramatically at whistling tunes, jingles, and melodies."
      }
    ],
    "related_tool_slugs": [
      "bird-wing-clipping-guide"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "fair",
      "apartments": "good",
      "first_time_owners": "excellent"
    },
    "origin_country": "Australia",
    "breed_group": "Cacatuidae (Cockatoo)",
    "coat_type": "Feathers with movable expressive crest",
    "coat_colors": [
      "Grey",
      "Lutino",
      "Pied",
      "Pearl",
      "Cinnamon",
      "Whiteface"
    ],
    "size_category": "small",
    "energy_level": "medium",
    "shedding_level": "low",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  },
  {
    "id": "breed_quarter_horse",
    "slug": "quarter-horse",
    "species": "horse",
    "name": "American Quarter Horse",
    "hero_image": null,
    "overview": "The most popular equine breed in the United States, famous for blinding sprint speed and calm temperament.",
    "history": "Bred in colonial America by crossing English thoroughbreds with native Chickasaw horses.",
    "temperament_traits": [
      "Gentle",
      "Hardworking",
      "Intelligent",
      "Level-headed",
      "Versatile"
    ],
    "temperament_description": "Known for their extraordinary \"cow sense,\" steady nerves, and willingness to work with beginners.",
    "exercise_level": "high",
    "exercise_description": "Requires daily riding, lunging, or open pasture turnout.",
    "exercise_minutes_per_day": 60,
    "weight_min": 950,
    "weight_max": 1200,
    "weight_unit": "lbs",
    "height_min": 56,
    "height_max": 64,
    "height_unit": "inches",
    "lifespan_min": 25,
    "lifespan_max": 33,
    "common_diseases": [
      {
        "name": "HYPP",
        "description": "Hyperkalemic periodic paralysis."
      },
      {
        "name": "Navicular Syndrome",
        "description": "Heel pain condition."
      }
    ],
    "nutrition": "High-quality grass/alfalfa hay (1.5-2% of body weight daily) plus mineral salt lick and clean water.",
    "grooming": "Daily currying, brushing, and hoof picking before and after riding.",
    "grooming_frequency": "Daily",
    "images": [],
    "faqs": [
      {
        "question": "Why is it called a Quarter Horse?",
        "answer": "Because of its unmatched ability to outrun all other horse breeds in quarter-mile sprint races."
      }
    ],
    "related_tool_slugs": [
      "horse-farrier-schedule"
    ],
    "related_article_slugs": [],
    "good_with": {
      "children": "excellent",
      "other_pets": "excellent",
      "apartments": "poor",
      "first_time_owners": "excellent"
    },
    "origin_country": "United States",
    "breed_group": "Stock Horse",
    "coat_type": "Fine, short coat with thick winter coat",
    "coat_colors": [
      "Sorrel",
      "Chestnut",
      "Bay",
      "Black",
      "Palomino",
      "Buckskin",
      "Dun"
    ],
    "size_category": "extra large",
    "energy_level": "high",
    "shedding_level": "medium",
    "trainability": "very high",
    "published": true,
    "updated_at": "2026-09-28T14:07:41.748Z"
  }
];
