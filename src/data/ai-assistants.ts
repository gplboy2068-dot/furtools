import {
  Bird,
  Bone,
  Cat,
  Dog,
  HeartPulse,
  Plane,
  Salad,
  Scissors,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface AiAssistantFaq {
  q: string;
  a: string;
}

export interface RelatedToolLink {
  title: string;
  slug: string;
  description: string;
}

export interface AiAssistant {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  keyFeatures?: string[];
  faqs?: AiAssistantFaq[];
  relatedTools?: RelatedToolLink[];
  icon: LucideIcon;
  accent: string; // tailwind color class base
  systemPrompt: string;
  suggestedPrompts: string[];
  showMedicalDisclaimer?: boolean;
}

const BASE_RULES = `
CRITICAL RULES:
- You are a helpful, warm, friendly pet care assistant.
- NEVER diagnose diseases or health conditions. If a pet may be sick or injured, urge the user to consult a licensed veterinarian immediately.
- Always be conservative on health, dosing, or safety questions.
- Use plain, kind language. Use short paragraphs and bullet lists where helpful.
- Format your responses in markdown with clean bolding, bullet points, and tables where structured data is shown.
- If a question is outside your topic, gently redirect the user.
- End medical or safety-related answers with a brief reminder to consult a vet.
`;

export const AI_ASSISTANTS: AiAssistant[] = [
  {
    slug: "care",
    name: "AI Pet Care Assistant",
    tagline: "Everyday care, gently guided.",
    description:
      "Ask anything about feeding, hygiene, enrichment, and daily routines for your pet.",
    longDescription: `### Complete Everyday Companion Animal Care Guide
Caring for a companion animal requires a holistic understanding of their physiological, psychological, and environmental needs. Whether you share your home with an energetic canine, an independent feline, or an inquisitive small mammal, maintaining a consistent daily rhythm is the foundation of lifelong health.

#### 1. Nutritional Precision & Hydration
Balanced nutrition tailored to life stage (puppy/kitten, active adult, or senior) sustains vitality and prevents metabolic strain. Clean, fresh water must be accessible at all times. Cats and certain small pets often prefer circulating water fountains to stimulate adequate fluid intake and protect renal health.

#### 2. Physical Conditioning & Cognitive Enrichment
Physical exercise prevents obesity, supports joint longevity, and alleviates behavioral anxiety. Pairing daily physical activities with mental stimulation—such as snuffle mats, puzzle feeders, and scent exploration games—engages your pet's natural problem-solving instincts.

#### 3. Preventive Hygiene & Environmental Wellness
Routine coat brushing distributes natural skin oils, reduces hairball formation in cats, and allows early detection of parasites or skin abnormalities. Establishing consistent dental hygiene and gentle nail trimming prevents systemic inflammation and orthopedic strain.

> [!NOTE]
> *Educational Guidance:* This assistant provides evidence-based daily wellness frameworks. For acute medical symptoms, sudden lethargy, or medication dosing, consult your licensed veterinarian immediately.`,
    keyFeatures: [
      "Customized daily feeding and hydration schedules by species and age",
      "Interactive mental enrichment and puzzle toy recommendations",
      "Preventive hygiene, coat care, and nail trimming pacing",
      "Senior pet comfort adjustments and mobility adaptations",
    ],
    faqs: [
      { q: "How often should I feed my adult pet?", a: "Most adult dogs thrive on two measured meals per day spaced 10–12 hours apart. Adult cats often benefit from 2–4 smaller portion-controlled meals to match their natural foraging metabolism." },
      { q: "How can I tell if my pet is dehydrated?", a: "Check for sticky or dry gums, sunken eyes, lethargy, and loss of skin elasticity (the skin tent test along the scruff of the neck)." },
      { q: "What should a basic daily pet routine look like?", a: "A balanced routine includes morning elimination/walk, measured breakfast, midday mental enrichment or physical exercise, evening meal, bonding/brushing session, and a quiet sleeping environment." },
      { q: "How much daily mental stimulation do companion animals need?", a: "Most pets need 20–45 minutes of dedicated mental engagement daily through puzzle feeders, scent work, training games, or exploratory play." },
      { q: "When should I contact a veterinarian rather than managing care at home?", a: "Seek immediate veterinary attention if your pet experiences persistent vomiting, diarrhea lasting over 24 hours, refusal to eat or drink, labored breathing, seizures, or acute pain." },
    ],
    relatedTools: [
      { title: "Dog Calorie Calculator", slug: "dog-calorie-calculator", description: "Calculate exact daily Resting Energy Requirements (RER)." },
      { title: "Dog Food Calculator", slug: "dog-food-calculator", description: "Determine optimal daily kibble or wet food gram portions." },
      { title: "Cat Food Calculator", slug: "cat-food-calculator", description: "Calculate species-appropriate feline daily portions." },
    ],
    icon: HeartPulse,
    accent: "primary",
    showMedicalDisclaimer: true,
    systemPrompt: `${BASE_RULES}
You specialize in day-to-day pet care: feeding schedules, hydration, hygiene, enrichment, sleep, exercise, and general well-being. Ask clarifying questions (species, breed, age, weight) when useful before answering.`,
    suggestedPrompts: [
      "How often should I feed my 3-month-old puppy?",
      "My cat isn't drinking enough water — what can I do?",
      "Build a simple daily routine for a senior dog.",
      "Enrichment ideas for a bored indoor cat.",
    ],
  },
  {
    slug: "names",
    name: "AI Pet Name Generator",
    tagline: "Names with meaning and vibe.",
    description:
      "Generate creative, meaningful pet names tailored to species, personality, and style.",
    longDescription: `### The Art of Choosing the Perfect Pet Name
Selecting a name for your new companion is the first step in building a lifelong bond. A great pet name is more than an aesthetic label; it is a primary communication cue that your pet will respond to thousands of times throughout their life.

#### 1. Phonetic Clarity & Cognitive Recognition
Canines and felines process acoustic frequencies and distinct hard consonants (such as *K, T, C, B, D*) much faster than soft vowel combinations. Two-syllable names ending with an upward vowel inflection (e.g., *Milo, Bella, Jasper, Luna*) produce clear, distinguishable pitch changes that make recall training effortless.

#### 2. The 'Public Park Test'
Before finalizing a moniker, consider how it sounds called across a busy dog park or veterinarian waiting room. Avoid names that sound phonetically similar to core obedience cues (e.g., *Bo* sounds like *No*, *Ray* sounds like *Stay*, *Kit* sounds like *Sit*).

#### 3. Thematic Inspiration Categories
- **Mythological & Celestial:** Orion, Freya, Apollo, Nyx, Thor, Athena.
- **Botanical & Nature:** Willow, Cedar, Hazel, Clover, River, Aspen.
- **Culinary & Whimsical:** Mochi, Biscuit, Pepper, Truffle, Waffles, Peanut.
- **Classic & Distinguished:** Winston, Penelope, Oliver, Eleanor, Arthur.

> [!TIP]
> Test your top 3 name choices for 48 hours to observe which one your pet naturally perks their ears to.`,
    keyFeatures: [
      "Generates 15–20 curated names organized in structured markdown tables",
      "Breakdowns of linguistic origin, historical meaning, and energetic vibe",
      "Species-tailored suggestions (dogs, cats, reptiles, birds, small pets)",
      "Phonetic compatibility scoring for puppy and kitten recall training",
    ],
    faqs: [
      { q: "Why are two-syllable pet names recommended by animal behaviorists?", a: "Two-syllable names allow an upward inflection on the second syllable, creating a distinct auditory marker that catches an animal's attention quickly without sounding like a mono-syllabic command." },
      { q: "Can I rename an adopted or adult rescue pet?", a: "Yes. Pets adapt readily to new names within 1 to 2 weeks when paired with positive reinforcement, high-value treats, and joyful vocal tones." },
      { q: "What should I avoid when picking a name?", a: "Avoid names that sound similar to standard training cues (e.g. 'Joe' sounds like 'No', 'Fletcher' sounds like 'Fetch'), names that are overly long, or names that might cause embarrassment in public." },
      { q: "How long does it take for a puppy or kitten to learn their name?", a: "With consistent positive reinforcement (saying the name and immediately rewarding eye contact), most young animals learn their name within 3 to 7 days." },
      { q: "Should male and female pets strictly follow gendered names?", a: "Not at all. Nature-themed (River, Aspen, Sage), food-inspired (Mochi, Peanut), and celestial names (Orion, Nova) make wonderful gender-neutral choices for any pet." },
    ],
    relatedTools: [
      { title: "Dog Name Generator", slug: "dog-name-generator", description: "Browse thousands of curated canine names by breed and vibe." },
      { title: "Cat Name Generator", slug: "cat-name-generator", description: "Explore charming, mysterious, and cute names for felines." },
      { title: "Reptile Name Generator", slug: "reptile-name-generator", description: "Discover mythical and prehistoric names for scaly friends." },
    ],
    icon: Sparkles,
    accent: "secondary",
    systemPrompt: `${BASE_RULES}
You generate creative pet names. When the user gives species, breed, personality, or style preferences, produce 10–20 names in a markdown table with columns: Name, Origin/Meaning, Vibe. Offer to refine by category (mythology, food, movies, unisex, short, etc.).`,
    suggestedPrompts: [
      "20 whimsical names for a golden retriever puppy girl.",
      "Short one-syllable names for a black cat.",
      "Mythology-inspired names for a german shepherd.",
      "Cute food-themed names for a rabbit.",
    ],
  },
  {
    slug: "food",
    name: "AI Food Advisor",
    tagline: "Is it safe? Ask first.",
    description:
      "Check whether foods are safe, toxic, or should be given in moderation for your pet.",
    longDescription: `### Companion Animal Toxicology & Food Safety Blueprint
While humans and domesticated animals share living spaces, our metabolic pathways and digestive enzymes differ radically. Many human culinary staples that are healthy for people contain chemical compounds that cause acute toxicity, organ failure, or systemic shock in pets.

#### 1. High-Hazard Common Human Foods (Strict Blacklist)
- **Chocolate & Cocoa:** Contains *theobromine* and *caffeine*, methylxanthines that overstimulate the cardiac and central nervous systems.
- **Xylitol (Birch Bark Extract / Wood Sugar):** Causes massive, rapid insulin surges leading to fatal hypoglycemia and acute liver necrosis in dogs within 30–60 minutes.
- **Grapes & Raisins:** Induce acute renal failure with unpredictable idiosyncratic toxicity thresholds.
- **Allium Family (Garlic, Onions, Chives, Leeks):** Contain *thiosulfates* that induce oxidative damage to red blood cells, causing hemolytic anemia.
- **Macadamia Nuts & Avocado:** Cause muscular tremors, hyperthermia, and myocardial damage.

#### 2. Nutrient-Dense Safe Treats (10% Daily Calorie Rule)
Unseasoned plain vegetables and fruits can serve as healthy low-calorie rewards:
- **Cooked Pumpkin & Carrots:** Rich in soluble fiber, beta-carotene, and gut-soothing nutrients.
- **Blueberries & Seedless Watermelon:** High in antioxidants, hydration, and vitamins A & C.
- **Boiled Skinless Chicken Breast:** Highly digestible lean protein for training or convalescence.

> [!WARNING]
> *Emergency Protocol:* If you suspect your pet has ingested a toxic substance, do not induce vomiting unless explicitly directed by an emergency veterinarian or animal poison control hotline.`,
    keyFeatures: [
      "Instant safety verdicts: Safe, Moderation, Unsafe, or Toxic",
      "Biological explanations of toxic mechanisms and organ risks",
      "Safe portion sizes complying with the 10% daily treat rule",
      "Clinical symptoms to monitor and emergency triage timelines",
    ],
    faqs: [
      { q: "What should I do immediately if my dog ate chocolate?", a: "Calculate the amount and chocolate type (dark and baker's chocolate are far more toxic than milk chocolate) and contact an emergency vet or Pet Poison Helpline immediately. Have your dog's weight ready." },
      { q: "Why is Xylitol (birch sugar) so dangerous for dogs?", a: "In dogs, xylitol triggers an immediate, massive release of insulin from the pancreas, resulting in life-threatening hypoglycemia (low blood sugar) and acute liver failure." },
      { q: "Can cats safely eat dairy products like milk or cheese?", a: "Most adult cats are lactose intolerant. Ingesting cow's milk causes painful abdominal cramping, gas, and acute diarrhea due to lack of the lactase enzyme." },
      { q: "What percentage of a pet's diet can come from treats or table foods?", a: "Treats, snacks, and fresh table additions should never exceed 10% of your pet's total daily caloric intake to prevent nutritional deficiencies and obesity." },
      { q: "Are cooked animal bones safe for dogs or cats to chew?", a: "Never feed cooked bones. Cooking turns bones brittle, causing them to splinter into sharp shards that pierce the esophagus, stomach lining, or intestines." },
    ],
    relatedTools: [
      { title: "Dog Calorie Calculator", slug: "dog-calorie-calculator", description: "Calculate exact caloric budgets and treat limits." },
      { title: "Bearded Dragon Food Calculator", slug: "bearded-dragon-food-calculator", description: "Inspect safe greens, staple veggies, and toxic reptile foods." },
      { title: "Guinea Pig Food Calculator", slug: "guinea-pig-food-calculator", description: "Check Vitamin C requirements and safe produce portions." },
    ],
    icon: Salad,
    accent: "primary",
    showMedicalDisclaimer: true,
    systemPrompt: `${BASE_RULES}
You are a pet food safety assistant. When the user names a food, respond with: Safety verdict (Safe / Moderation / Unsafe / Toxic), why, safe amount if any, symptoms to watch, and a clear "call your vet" note when relevant. Consider species differences (dog vs cat vs others). Never invent numeric dosages beyond conservative rules of thumb.`,
    suggestedPrompts: [
      "Can my dog eat blueberries?",
      "Is tuna safe for cats to eat daily?",
      "My puppy ate a small piece of chocolate — what should I do?",
      "Safe human foods for a senior dog.",
    ],
  },
  {
    slug: "dog-training",
    name: "AI Dog Trainer",
    tagline: "Kind, science-backed training.",
    description:
      "Positive-reinforcement training plans for puppies, adults, and rescue dogs.",
    longDescription: `### Modern Positive-Reinforcement Canine Behavioral Science
Modern dog training is rooted in operant conditioning and humane behavioral science. By rewarding desired behaviors with high-value reinforcement (treats, toys, praise) rather than employing fear or intimidation, dogs develop confident problem-solving skills and a resilient emotional bond with their handlers.

#### 1. Core Foundations of Reward-Based Learning
- **Marker Timing:** Using a clicker or crisp verbal marker (e.g., *"Yes!"*) marks the exact millisecond a dog performs the correct action, making learning unambiguous.
- **Rate of Reinforcement:** Maintaining a high reward frequency during initial acquisition phases accelerates cue comprehension.
- **Short, Frequent Micro-Sessions:** Three to five 3-minute training sessions spread throughout the day yield far superior results compared to a single exhausting 30-minute block.

#### 2. Essential Behavioral Milestones
- **Loose Leash Walking:** Teaching your dog that tension on the leash means stopping, while walking beside you earns forward movement and sniffing rewards.
- **Reliable Recall:** Building a lightning-fast emergency recall cue by never punishing a dog upon return and rewarding with high-value jackpot treats.
- **Crate & Den Conditioning:** Transforming the crate into a safe, positive sanctuary with lick mats, quiet chew toys, and gradual door-closure increments.

> [!TIP]
> If a dog is struggling to follow a cue, break the exercise down into smaller intermediate steps (shaping) rather than increasing pressure.`,
    keyFeatures: [
      "Step-by-step positive reinforcement training workflows",
      "Humane puppy potty training, crate acclimation, and teething guidance",
      "Troubleshooting leash pulling, jumping, and separation distress",
      "Fear-free desensitization and counter-conditioning protocols",
    ],
    faqs: [
      { q: "Why should aversive training tools (choke, prong, shock) be avoided?", a: "Peer-reviewed veterinary studies show aversive tools increase fear, defensive aggression, cortisol levels, and suppress warning signals without addressing the underlying emotional cause of the behavior." },
      { q: "How long should a puppy training session last?", a: "Puppies have short attention spans. Keep sessions between 2 to 5 minutes, 3 to 4 times a day, always ending on a successful, joyful note." },
      { q: "How do I stop my dog from pulling on the leash?", a: "Use a front-clip Y-harness. The moment the leash becomes taut, stop moving like a tree. Only resume walking when the dog looks back or releases leash tension, rewarding eye contact." },
      { q: "What is crate training and how does it prevent separation anxiety?", a: "Crate training provides a secure den environment that leverages a dog's natural instinct not to soil their sleeping quarters, assisting housebreaking and preventing destructive stress habits." },
      { q: "How do I socialize a puppy safely before full vaccination?", a: "Socialization is about positive exposure, not meeting every dog. Carry your puppy in a sling or wagon to observe novel sights, sounds, surfaces, and traffic from a safe distance without touching unfamiliar ground." },
    ],
    relatedTools: [
      { title: "Dog Crate Size Calculator", slug: "dog-crate-size-calculator", description: "Calculate ergonomic crate dimensions for comfortable resting." },
      { title: "Dog Exercise Needs Calculator", slug: "dog-exercise-needs-calculator", description: "Determine age and breed-appropriate daily exercise minutes." },
      { title: "Dog Calorie Calculator", slug: "dog-calorie-calculator", description: "Account for training treats within daily caloric allowances." },
    ],
    icon: Dog,
    accent: "primary",
    systemPrompt: `${BASE_RULES}
You are a positive-reinforcement dog trainer. Never suggest aversive tools (shock, prong, choke). Give step-by-step training plans, session lengths, reinforcement tips, and troubleshooting for common issues (leash pulling, recall, crate, potty). Ask about age and prior training when helpful.`,
    suggestedPrompts: [
      "Teach my puppy to sit in 5 steps.",
      "How do I stop my dog pulling on the leash?",
      "Crate training plan for a 10-week-old puppy.",
      "My rescue dog is scared of strangers — what do I do?",
    ],
  },
  {
    slug: "cat-training",
    name: "AI Cat Trainer",
    tagline: "Yes, cats can be trained.",
    description:
      "Clicker training, behavior tips, and enrichment for kittens and adult cats.",
    longDescription: `### Feline Behavioral Psychology & Positive Enrichment
Contrary to popular belief, felines are highly trainable, cognitive animals that thrive on structured environmental enrichment and clicker conditioning. Understanding that cat behaviors are driven by territory security, predatory sequences, and sensory boundaries allows owners to solve common issues without conflict.

#### 1. Feline Clicker Training Fundamentals
Cats respond with high enthusiasm to food rewards such as lickable purees, freeze-dried chicken, or gentle chin scratches. Using a soft-sounding clicker or a discreet tongue-click precisely marks desired actions:
- **Target Stick Training:** Directing a cat's nose to touch a target wand facilitates effortless carrier loading and vet examinations.
- **Stationing / Mat Settling:** Teaching a cat to relax on a dedicated blanket during family meals or high-traffic periods.

#### 2. Environmental Territory Optimization (The 'Cat Highway')
Feline stress manifests through scratching furniture, inappropriate urination, or inter-cat aggression when vertical space and territory markers are insufficient:
- **Vertical Territory:** Wall shelves, high cat trees, and window perches expand territorial acreage.
- **Litter Box Golden Rule:** Provide **N + 1** uncovered litter boxes in quiet, separate locations (e.g. 2 cats need 3 boxes).
- **Scratching Redirection:** Place sturdy sisal scratching posts directly adjacent to sleeping zones and doorway transition points.

> [!NOTE]
> Punishment (yelling, water spray bottles) damages trust and causes cats to perform unwanted behaviors in secret. Use redirection and positive reward instead.`,
    keyFeatures: [
      "Reward-based clicker training for cooperative vet care and tricks",
      "Litter box habit troubleshooting and elimination issue resolution",
      "Furniture scratching redirection and claw health care",
      "Multi-cat household tension reduction and slow introduction plans",
    ],
    faqs: [
      { q: "Can adult cats really be trained with clicker training?", a: "Yes. Cats learn rapidly through associative conditioning. Target training, sit, high-five, and entering a travel carrier can all be taught in 2–3 minute sessions using high-value lickable treats." },
      { q: "Why is my cat suddenly peeing outside the litter box?", a: "Sudden litter box avoidance is frequently a medical emergency indicating urinary tract infections, feline idiopathic cystitis, or bladder stones. Always have a vet perform a urinalysis before assuming it is behavioral." },
      { q: "How do I stop my cat from scratching my sofa?", a: "Place a tall, sturdy sisal scratching post directly next to the scratched furniture corner. Apply double-sided deterrent tape to the sofa and reward your cat every time they use the sisal post." },
      { q: "How do I introduce two unfamiliar cats without fighting?", a: "Use the slow scent-swapping method: keep them in separate rooms, exchange bedding, feed them on opposite sides of a closed door, progress to visual contact through a mesh screen, and finally allow supervised short interactions." },
      { q: "Is it safe to harness-train an indoor cat for outdoor walks?", a: "Yes, when done gradually indoors over several weeks using an ergonomic H-style or vest harness. Ensure your cat is microchipped, vaccinated, and protected against fleas and ticks before venturing outside." },
    ],
    relatedTools: [
      { title: "Cat Litter Calculator", slug: "cat-litter-calculator", description: "Calculate monthly litter requirements and optimal box depth." },
      { title: "Cat Calorie Calculator", slug: "cat-calorie-calculator", description: "Maintain ideal body condition score and training treat limits." },
      { title: "Cat Water Intake Calculator", slug: "cat-food-calculator", description: "Optimize urinary tract health through proper hydration." },
    ],
    icon: Cat,
    accent: "secondary",
    systemPrompt: `${BASE_RULES}
You are a cat behavior and clicker-training expert. Give step-by-step, patient, reward-based plans for teaching tricks, litter habits, scratching redirection, harness training, and reducing unwanted behavior. Never suggest punishment.`,
    suggestedPrompts: [
      "How do I clicker-train my kitten to sit?",
      "My cat scratches the sofa — how do I redirect them?",
      "Harness-train my adult indoor cat.",
      "Stop my cat from biting during play.",
    ],
  },
  {
    slug: "breed",
    name: "AI Breed Advisor",
    tagline: "Find your perfect match.",
    description:
      "Compare breeds and get personalized recommendations based on your lifestyle.",
    longDescription: `### Lifestyle Compatibility & Breed Selection Framework
Bringing a new animal into your home is a decade-long commitment. Choosing a pet based solely on physical appearance often leads to lifestyle friction. The most successful adoptions happen when an animal's innate energy drive, biddability, grooming demands, and vocal tendencies match your daily schedule and home environment.

#### 1. Canine Breed Group Characteristics
- **Herding Group (Border Collie, Australian Shepherd, Corgi):** Exceptionally intelligent and high-drive; require 90+ minutes of daily mental and physical tasks to prevent neurotic behaviors.
- **Sporting Group (Golden Retriever, Labrador, Pointer):** Sociable, biddable, and family-oriented; thrive with active outdoor lifestyles and water sports.
- **Companion / Toy Group (Maltese, Cavalier King Charles, French Bulldog):** Lower exercise requirements; prioritize human companionship and adapt well to apartments.
- **Working & Guardian Group (Rottweiler, Great Pyrenees, Boxer):** Strong, loyal protectors requiring early socialization, firm boundaries, and substantial space.

#### 2. Feline Breed Temperaments
- **High Energy & Vocal (Siamese, Bengal, Abyssinian):** Highly curious, demand interactive play, and vocalize frequently.
- **Gentle & Placid (Ragdoll, British Shorthair, Persian):** Low-key, affectionate, and well-suited for calm indoor households.

> [!TIP]
> Mixed-breed shelter rescues frequently display hybrid vigor and wonderful adaptable temperaments. Evaluating individual personality often outweighs purebred expectations.`,
    keyFeatures: [
      "Tailored breed recommendations aligned with living space and schedule",
      "In-depth comparisons of energy levels, exercise, and barking traits",
      "Hypoallergenic coat considerations and shedding index analysis",
      "Genetic health predisposition overviews and preventive screening tips",
    ],
    faqs: [
      { q: "What is the best dog breed for apartment living?", a: "French Bulldogs, Cavalier King Charles Spaniels, Greyhounds (known as 45mph couch potatoes), and Boston Terriers excel in apartments due to moderate exercise needs and low vocalization tendencies." },
      { q: "Are any dog or cat breeds truly 100% hypoallergenic?", a: "No pet is 100% hypoallergenic. Allergies are triggered by the *Can f 1* (dog) or *Fel d 1* (cat) proteins in saliva, dander, and urine. Breeds like Poodles, Bichons, and Siberian cats produce lower dander, reducing allergy triggers." },
      { q: "How much daily exercise does a working or herding breed require?", a: "High-drive working breeds (Border Collies, Belgian Malinois, German Shepherds) require a minimum of 90 to 120 minutes of vigorous physical exercise combined with advanced mental tasks daily." },
      { q: "What should first-time dog owners look for in a breed?", a: "First-time owners should look for high biddability, low dog-directed reactivity, and forgiving temperaments (such as Golden Retrievers, Cavalier King Charles Spaniels, or Bichon Frises)." },
      { q: "What is the lifespan difference between small and giant dog breeds?", a: "Small toy breeds often live 14 to 17 years, medium breeds live 10 to 13 years, while giant breeds (Great Danes, Mastiffs) typically have a shorter lifespan of 7 to 9 years due to rapid somatic growth rates." },
    ],
    relatedTools: [
      { title: "Dog Size & Weight Predictor", slug: "dog-size-predictor", description: "Estimate adult weight and growth milestones for puppies." },
      { title: "Dog Lifespan Calculator", slug: "dog-lifespan-calculator", description: "Explore longevity factors by breed group and genetics." },
      { title: "Dog Exercise Needs Calculator", slug: "dog-exercise-needs-calculator", description: "Check breed-specific daily workout requirements." },
    ],
    icon: Bird,
    accent: "primary",
    systemPrompt: `${BASE_RULES}
You are a breed advisor. Ask about lifestyle (home size, activity level, kids, other pets, time available, allergies, climate) before recommending. Give 3–5 breed suggestions with a short pros/cons and care level for each. Cover dogs, cats, and other companion species when asked.`,
    suggestedPrompts: [
      "Best dog breed for a small apartment and busy work schedule?",
      "Compare Golden Retriever vs Labrador for a family with young kids.",
      "Low-shedding cat breeds good with children.",
      "First-time dog owner in a cold climate — what breeds fit?",
    ],
  },
  {
    slug: "grooming",
    name: "AI Grooming Advisor",
    tagline: "Coat, nails, teeth, ears.",
    description:
      "Personalized grooming routines and product guidance for every coat type.",
    longDescription: `### Complete Dermatological Hygiene & Grooming Manual
Grooming is far more than an aesthetic routine; it is an essential component of preventive animal healthcare. Regular coat maintenance prevents painful hair matting, protects skin barrier integrity, regulates thermoregulation, and provides an opportunity to identify lumps, parasites, and infections early.

#### 1. Coat Types & Maintenance Protocol
- **Double Coats (Huskies, Shepherds, Golden Retrievers):** Never shave a double coat. The outer guard hairs repel water and UV rays, while the dense undercoat insulates against both winter cold and summer heat. Use an undercoat rake and high-velocity dryer during seasonal coat blows.
- **Curly / Non-Shedding Coats (Poodles, Doodles, Bichons):** Continuous hair growth requires line-brushing down to the skin with a slicker brush and greyhound comb 4–5 times weekly to prevent pelted mats. Professional styling is required every 4–6 weeks.
- **Short / Smooth Coats (Boxers, Pointers):** Weekly brushing with a rubber curry mitt removes dead follicles and stimulates natural skin sebum.

#### 2. Nail, Ear, & Oral Care Standards
- **Nail Trimming:** Overgrown nails alter the biomechanics of the paw, causing chronic arthritis and tendon strain. Trim every 2–3 weeks, avoiding the vascular quick.
- **Ear Hygiene:** Inspect weekly. Clean flopped or hairy ears with veterinary-formulated drying solutions to prevent fungal and bacterial otitis.
- **Dental Prophylaxis:** Daily enzymatic toothpaste brushing prevents periodontal disease, which can otherwise introduce oral bacteria into the bloodstream and damage cardiac and kidney valves.

> [!WARNING]
> Never use human shampoos on pets. Human skin has an acidic pH (~5.5), whereas companion animals have a neutral pH (~7.0–7.5). Human products strip the pet's lipid barrier, causing severe dermatitis.`,
    keyFeatures: [
      "Custom grooming cadence based on breed coat genetics",
      "Step-by-step de-shedding, line-brushing, and mat prevention guides",
      "Stress-free nail clipping, ear cleansing, and teeth brushing protocols",
      "Skin health problem identification and professional groomer referrals",
    ],
    faqs: [
      { q: "Why should double-coated dogs never be shaved in summer?", a: "Shaving removes the insulating undercoat and protective guard hairs, leaving the dog vulnerable to severe sunburn, heat stroke, permanent coat damage (post-clipping alopecia), and insect bites." },
      { q: "What should I do if I accidentally cut my pet's nail quick?", a: "Apply styptic powder (or cornstarch/flour in an emergency) with firm pressure for 60 seconds to stop capillary bleeding. Keep your pet calm and off dirt for 30 minutes." },
      { q: "How often should I bathe my dog?", a: "Most indoor dogs only need a bath every 4 to 8 weeks using a gentle, soap-free oatmeal pet shampoo. Over-bathing strips essential oils and causes dry, itchy skin." },
      { q: "How can I prevent mats in a long-haired cat or doodle dog?", a: "Use the 'line brushing' technique: brush small sections from the skin outward with a slicker brush, followed by a metal greyhound comb to ensure no knots remain at the base." },
      { q: "Is daily teeth brushing really necessary for pets?", a: "Yes. Plaque mineralizes into hard tartar within 24–48 hours. Daily brushing with pet-safe enzymatic toothpaste is the gold standard for preventing systemic periodontal disease." },
    ],
    relatedTools: [
      { title: "Dog Bath Frequency Calculator", slug: "dog-bath-frequency-calculator", description: "Calculate optimal bathing schedules by coat and activity." },
      { title: "Dog Food Calculator", slug: "dog-food-calculator", description: "Balance skin and coat omega fatty acid nutrition." },
    ],
    icon: Scissors,
    accent: "secondary",
    systemPrompt: `${BASE_RULES}
You are a pet grooming advisor. Give routines and tips for brushing frequency, bathing, nail trimming, ear cleaning, dental care, and de-shedding by coat type and species. Warn about hazards (matting, hot spots, quick-cutting nails) and when to see a professional groomer or vet.`,
    suggestedPrompts: [
      "Weekly grooming routine for a long-haired golden retriever.",
      "How do I trim my cat's nails without stress?",
      "Best way to brush my dog's teeth?",
      "Deshedding tips for a husky in summer.",
    ],
  },
  {
    slug: "travel",
    name: "AI Travel Advisor",
    tagline: "Adventures, planned safely.",
    description:
      "Plan road trips, flights, and stays with your pet — checklists included.",
    longDescription: `### Companion Animal Travel & Logistics Blueprint
Traveling with companion animals can be an enriching experience when planned with thorough logistical, physiological, and safety measures. Whether embarking on a cross-country road trip, booking pet-friendly lodging, or navigating airline cabin regulations, proactive preparation ensures a stress-free journey.

#### 1. Vehicle Travel & Restraint Safety
Unrestrained pets in motor vehicles pose severe risks during sudden braking and collisions. 
- **Crash-Tested Restraints:** Utilize Center for Pet Safety (CPS) certified harnesses attached to seatbelt anchors, or securely strapped travel crates in the cargo/rear seat area.
- **Hydration & Relief Stops:** Plan mandatory rest stops every 2.5 to 3.5 hours for elimination, leash walking, and fresh water.
- **Thermal Safety:** Never leave an animal unattended in a parked vehicle. Internal cabin temperatures can escalate from 70°F to over 100°F in under 15 minutes, causing fatal heat stroke.

#### 2. Airline Flights & Documentation
- **Cabin vs Cargo Requirements:** Small animals traveling in-cabin must comfortably stand, turn around, and lie down inside an airline-approved soft-sided carrier stowed beneath the seat.
- **Veterinary Health Certificates (CVI):** Most commercial airlines and cross-border customs mandate an accredited veterinarian Certificate of Veterinary Inspection issued within 10 days of departure.
- **Acclimation:** Introduce the travel carrier at home 3–4 weeks prior to travel with positive food rewards to prevent transit distress.

> [!NOTE]
> Sedatives and tranquilizers are discouraged by airlines and veterinarians for air travel, as they impair a pet's ability to regulate body temperature and balance during cabin pressure changes.`,
    keyFeatures: [
      "Comprehensive travel checklists for road trips, flights, and hotel stays",
      "Crash-tested carrier and harness restraint recommendations",
      "Motion sickness mitigation and natural calming protocols",
      "International travel document checklists and USDA health certificate steps",
    ],
    faqs: [
      { q: "How can I help my pet with car sickness and nausea?", a: "Feed a light meal 3–4 hours before departure (never right before), maintain cool air circulation, keep the pet facing forward, and ask your vet about anti-nausea medications like maropitant (Cerenia)." },
      { q: "What carrier dimensions are approved for airline in-cabin travel?", a: "Most airlines permit soft-sided carriers around 17–18″ L × 11″ W × 11″ H, but limits vary. The pet must be able to stand and turn around comfortably inside." },
      { q: "How often should I stop during a long road trip with a dog?", a: "Plan a 15–20 minute rest stop every 2.5 to 3.5 hours for bathroom breaks, light stretching, and fresh water." },
      { q: "Is it safe to give sedatives to a dog or cat before flying?", a: "Veterinary associations advise against sedating animals for air travel because sedatives suppress cardiovascular reflexes, lower blood pressure, and increase respiratory risks at high altitudes." },
      { q: "What essential items should be in a pet travel emergency kit?", a: "Include vaccination records, a digital copy of microchip info, 3 days of extra food/medications, collapsible bowls, bottled water, a leash/harness, pet first-aid kit, and enzymatic cleanup wipes." },
    ],
    relatedTools: [
      { title: "Dog Crate Size Calculator", slug: "dog-crate-size-calculator", description: "Verify IATA airline-compliant carrier dimensions." },
      { title: "Dog Calorie Calculator", slug: "dog-calorie-calculator", description: "Adjust travel nutrition and energy expenditure." },
    ],
    icon: Plane,
    accent: "primary",
    systemPrompt: `${BASE_RULES}
You are a pet travel advisor. Help plan safe road trips, flights, hotel stays, and international travel with pets. Cover carriers, airline rules (general — remind user to confirm with the airline), documents, motion sickness comfort tips, pet-friendly stays, and destination checklists. Do not give veterinary medication doses.`,
    suggestedPrompts: [
      "Prepare my dog for a 10-hour road trip.",
      "Checklist for flying with a cat internationally.",
      "Pet-friendly hotel tips for a weekend getaway.",
      "How do I keep my puppy calm in the car?",
    ],
  },
];

/* ---------- Species-specific care assistants (multi-pet ecosystem) ---------- */

interface SpeciesAiSpec {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  keyFeatures: string[];
  faqs: AiAssistantFaq[];
  relatedTools: RelatedToolLink[];
  species: string;
  focus: string;
  prompts: string[];
}

const SPECIES_AI: SpeciesAiSpec[] = [
  {
    slug: "dog-care",
    name: "AI Dog Care Assistant",
    tagline: "Everyday dog wellness.",
    description: "Feeding, exercise, training, and care routines tailored to dogs of every breed and age.",
    longDescription: `### The Complete Canine Wellness & Husbandry Guide
Canines thrive on structured routines, species-appropriate nutrition, regular cardiovascular exercise, and affectionate companionship. Understanding the biological and behavioral stages of a dog's life allows owners to provide optimal care from playful puppyhood to dignified senior years.

#### 1. Life Stage Nutrition & Portion Control
Caloric requirements change dramatically across life stages. Growing puppies need higher protein and calcium-to-phosphorus ratios for skeletal development, while adult and senior dogs require tailored calorie density to prevent obesity. Measuring food with a digital gram scale prevents common 20-30% overfeeding errors.

#### 2. Exercise, Stimulation, and Joint Care
Daily physical exercise must be matched to breed genetics and growth plate closure stages. Pair brisk walks with scent exploration games to lower cortisol. As dogs age, orthopedic bedding and joint-supporting supplements help maintain pain-free mobility.

#### 3. Preventive Health Cadence
Annual veterinary wellness exams, core vaccinations (Rabies, DHPP), continuous flea/tick/heartworm prevention, and routine dental care form the pillars of long-term vitality.`,
    keyFeatures: [
      "Age-specific portion calculations and feeding schedules",
      "Breed-appropriate physical and mental exercise targets",
      "Puppy housebreaking, teething, and crate acclimation steps",
      "Senior dog comfort, mobility adjustments, and cognitive support",
    ],
    faqs: [
      { q: "How much exercise does an adult dog need daily?", a: "Most healthy adult dogs require 30 to 90 minutes of daily physical exercise, combining brisk walking, fetch, and free off-leash sniffing." },
      { q: "When do a puppy's growth plates close?", a: "Growth plates in small breeds close around 10–12 months, while large and giant breeds continue developing until 16–24 months. Avoid repetitive high-impact jumping during this phase." },
      { q: "How often should I feed my adult dog?", a: "Adult dogs should be fed twice daily, spaced approximately 10–12 hours apart, using measured portions based on target weight." },
      { q: "What are the early warning signs of pain or arthritis in senior dogs?", a: "Signs include hesitation before climbing stairs, difficulty standing after rest, decreased appetite, irritability, and licking at carpal or hock joints." },
      { q: "How often do dogs need their teeth brushed?", a: "Daily brushing with pet-formulated enzymatic toothpaste is the gold standard for preventing periodontal disease." },
    ],
    relatedTools: [
      { title: "Dog Calorie Calculator", slug: "dog-calorie-calculator", description: "Calculate exact daily Resting Energy Requirements (RER)." },
      { title: "Dog Age Calculator", slug: "dog-age-calculator", description: "Convert dog age to biological human years." },
      { title: "Dog Exercise Needs Calculator", slug: "dog-exercise-needs-calculator", description: "Determine optimal workout minutes by breed." },
    ],
    species: "dogs",
    focus: "canine care, nutrition, exercise, socialization, and enrichment",
    prompts: ["Daily routine for a 6-month-old Lab puppy.", "How much exercise does a Border Collie need?", "Signs my senior dog needs more rest.", "Best chew toys for teething puppies."],
  },
  {
    slug: "cat-care",
    name: "AI Cat Care Assistant",
    tagline: "Cat life, decoded.",
    description: "Litter, enrichment, indoor safety, and grooming routines for cats of every temperament.",
    longDescription: `### The Complete Feline Wellness & Environmental Guide
Domestic cats retain strong instinctual drives as both predators and prey animals. Creating a home environment that honors their territorial nature, obligate carnivore metabolism, and subtle communication signals ensures a vibrant, stress-free indoor life.

#### 1. Obligate Carnivore Nutrition & Hydration
Cats require high-protein, meat-based diets rich in pre-formed *taurine*, *arachidonic acid*, and *vitamin A*. Because felines have a naturally low thirst drive derived from desert ancestors, incorporating moisture-rich wet food and circulating water fountains is essential to protect kidney and bladder health.

#### 2. Environmental Territory & Enrichment
Indoor cats require vertical climbing territory, scratching outlets, and daily interactive hunting play (using wand toys in a *stalk-chase-catch-eat* sequence) to prevent boredom, obesity, and stress-induced behavioral issues.

#### 3. Litter Box Hygiene Rules
Maintain the N + 1 box rule (1 box per cat plus 1 extra), placed in quiet, well-ventilated areas. Scoop daily and perform complete cleanings monthly with unscented litter.`,
    keyFeatures: [
      "Obligate carnivore diet guidance and wet vs dry food ratios",
      "Litter box placement, cleanliness protocols, and behavioral tips",
      "Indoor environmental enrichment and vertical territory design",
      "Subtle feline stress identification and urinary health care",
    ],
    faqs: [
      { q: "Why is wet food especially important for domestic cats?", a: "Wet food provides 70–80% moisture, closely mimicking a cat's natural prey diet and preventing chronic dehydration, kidney disease, and urinary tract crystals." },
      { q: "How many litter boxes do I need for my cats?", a: "The gold standard formula is N + 1: one litter box per cat in the household, plus one additional box, distributed across separate rooms." },
      { q: "How much playtime does an indoor cat need daily?", a: "Two 10–15 minute interactive play sessions daily using wand toys (simulating bird or rodent movement) fulfill predatory drives and prevent obesity." },
      { q: "What are the signs of subtle pain or illness in cats?", a: "Cats mask pain instinctively. Watch for hiding, changes in grooming habits, squinting eyes, reluctance to jump, and vocalization during litter box use." },
      { q: "Why do cats need scratching posts?", a: "Scratching sheds the outer claw husk, stretches spinal muscles, and deposits territorial pheromones from scent glands located in their paw pads." },
    ],
    relatedTools: [
      { title: "Cat Calorie Calculator", slug: "cat-calorie-calculator", description: "Calculate target caloric intake for indoor felines." },
      { title: "Cat Litter Calculator", slug: "cat-litter-calculator", description: "Determine monthly litter volume and box depth." },
      { title: "Cat Age Calculator", slug: "cat-age-calculator", description: "Calculate human-equivalent feline biological age." },
    ],
    species: "cats",
    focus: "feline behavior, litter and hygiene, enrichment, indoor safety, coat care",
    prompts: ["Enrichment for a shy indoor cat.", "How often should I change litter?", "Signs of stress in cats.", "Introducing a second cat to my home."],
  },
  {
    slug: "bird-care",
    name: "AI Bird Care Assistant",
    tagline: "Happy, healthy birds.",
    description: "Diet, cage setup, enrichment, molting, and flight care for pet birds.",
    longDescription: `### Companion Avian Care, Nutrition, & Husbandry
Companion birds—from small budgies and cockatiels to large macaws and African greys—possess remarkable intelligence and complex respiratory systems. Ensuring their welfare demands specialized nutrition, expansive flight space, and strict household toxin awareness.

#### 1. Pelleted Nutrition vs All-Seed Dangers
An all-seed diet is dangerously high in lipids and deficient in essential vitamins A and D, leading to fatty liver disease and shortened lifespans. A balanced avian diet consists of 60–70% high-quality formulated pellets, supplemented with 20–30% fresh chopped vegetables (chop), sprouted seeds, and occasional fruit treats.

#### 2. Critical Avian Respiratory Safety
Avian lungs utilize continuous one-way air sacs that are hyper-sensitive to airborne toxins. **Never use Teflon/non-stick PTFE cookware**, aerosol sprays, scented candles, incense, or self-cleaning oven cycles near pet birds, as fumes cause fatal pulmonary hemorrhaging within minutes.

#### 3. Sleep & Photoperiod Requirements
Most pet birds require 10 to 12 hours of uninterrupted, dark, quiet sleep each night to regulate hormonal balances, prevent aggressive territorial behaviors, and curb chronic egg-laying.`,
    keyFeatures: [
      "Formulated pellet conversion protocols and fresh chop diet recipes",
      "Airborne respiratory toxin hazard guides (PTFE/Teflon, aerosols)",
      "Cage sizing, non-toxic natural wood perches, and flight dimensions",
      "Feather molting care, foraging toys, and circadian sleep schedules",
    ],
    faqs: [
      { q: "Why is Teflon / non-stick cookware lethal to pet birds?", a: "When heated, PTFE non-stick coatings release odorless toxic fumes that cause rapid pulmonary congestion, fluid accumulation in the lungs, and fatal asphyxiation in birds." },
      { q: "What should a healthy pet bird eat daily?", a: "A healthy diet consists of 60–70% species-specific formulated pellets, 20–30% fresh vegetables and leafy greens, and only 5–10% healthy seeds or nuts as treats." },
      { q: "How much sleep do parrots and companion birds need?", a: "Most companion birds need 10 to 12 hours of total darkness and silence each night to prevent hormonal distress, feather plucking, and egg binding." },
      { q: "Why are dowel perches bad for bird feet?", a: "Smooth, uniform dowel perches put constant pressure on the exact same spots of the foot, causing bumblefoot (pododermatitis). Use varying-diameter natural branch perches." },
      { q: "What are the symptoms of an egg-bound bird?", a: "An egg-bound female bird shows swollen lower abdomen, straining, tail bobbing, fluffed feathers, and sitting at the bottom of the cage. This is an immediate veterinary emergency." },
    ],
    relatedTools: [
      { title: "Bird Cage Size Calculator", slug: "bird-cage-size-calculator", description: "Calculate minimum flight dimensions by species." },
      { title: "Bird Seed Portion Calculator", slug: "bird-seed-portion-calculator", description: "Measure balanced pellet-to-seed feeding ratios." },
      { title: "Bird Sleep Schedule Calculator", slug: "bird-sleep-schedule-calculator", description: "Calculate optimal circadian dark hours." },
    ],
    species: "pet birds (parrots, finches, cockatiels, budgies)",
    focus: "avian nutrition (pellets vs seeds), cage sizing, wing/beak/nail care, enrichment, molting, egg-binding warning signs (redirect to vet)",
    prompts: ["Ideal cage size for a cockatiel.", "How do I convert my parrot from seeds to pellets?", "My bird is molting — what should I expect?", "Safe fruits and vegetables for budgies."],
  },
  {
    slug: "rabbit-care",
    name: "AI Rabbit Care Assistant",
    tagline: "Hoppy and healthy.",
    description: "Hay-first diets, litter training, dental health, and enrichment for rabbits.",
    longDescription: `### Domestic Rabbit Husbandry, Diet, & Lagomorph Physiology
Domestic rabbits are delicate hindgut fermenters with unique digestive and skeletal biology. Providing proper high-fiber nutrition, expansive exercise space, and rabbit-proofed housing ensures a happy 8–12 year lifespan.

#### 1. The 85% Grass Hay Foundation
A rabbit's digestive tract requires continuous coarse fiber to maintain gut motility and grind down continuously growing open-rooted teeth. **Timothy, orchard grass, or meadow hay must make up at least 85% of their daily diet** and be accessible in unlimited quantities. Alfalfa hay is fed only to growing kits under 6 months due to its high calcium and protein content.

#### 2. GI Stasis Awareness
Gastrointestinal (GI) stasis occurs when gut motility slows or stops completely. If a rabbit stops eating, stops producing fecal pellets, or sits hunched in pain for more than 6–8 hours, immediate emergency veterinary intervention is required.

#### 3. Housing, Litter Training, & Companionship
Rabbits should not be confined to small wire cages. Provide a large exercise pen (minimum 16–24 sq ft) or free-roam bunny-proofed room with soft flooring. Because rabbits are social herd animals, bonded pairs enjoy significantly better emotional health.`,
    keyFeatures: [
      "85%+ unlimited grass hay portioning and safe vegetable lists",
      "Early GI stasis symptom identification and emergency timelines",
      "Litter training setups and bunny-proofing wire/furniture protocols",
      "Dental health monitoring, rabbit bonding steps, and pen sizing",
    ],
    faqs: [
      { q: "Why is unlimited grass hay essential for rabbits?", a: "Grass hay provides coarse indigestible fiber that prevents fatal GI stasis and mechanically grinds down teeth that continuously grow 2–3 mm each week." },
      { q: "What is GI Stasis and why is it an emergency?", a: "GI Stasis is a condition where the rabbit's digestive tract halts. Without prompt veterinary motility drugs and fluid therapy, gut bacteria produce fatal toxins within 12–24 hours." },
      { q: "Can rabbits be litter box trained like cats?", a: "Yes. Rabbits naturally eliminate while grazing. Place fresh hay directly inside or above a litter box lined with paper-based litter (never clay or cedar)." },
      { q: "What vegetables are safe for daily rabbit salads?", a: "Romaine lettuce, cilantro, parsley, dill, bok choy, and basil are great daily staples. Limit high-oxalate greens like spinach and sugary carrots to rare treats." },
      { q: "Why should rabbits never be kept in small wire cages?", a: "Wire cage bottoms cause painful foot sores (pododermatitis) and severe muscle atrophy. Rabbits need at least 16–24 sq ft of flat exercise space." },
    ],
    relatedTools: [
      { title: "Rabbit Cage Size Calculator", slug: "rabbit-cage-size-calculator", description: "Calculate minimum enclosure and run dimensions." },
      { title: "Rabbit Hay Portion Calculator", slug: "rabbit-hay-portion-calculator", description: "Determine daily hay and fresh green requirements." },
      { title: "Rabbit Litter Box Sizer", slug: "rabbit-litter-box-size", description: "Size ergonomic litter boxes by rabbit weight." },
    ],
    species: "domestic rabbits",
    focus: "unlimited hay, safe vegetables, dangers of high-carb treats, dental overgrowth, GI stasis warning signs (redirect to vet), litter training, bonding",
    prompts: ["Safe daily vegetables for my rabbit.", "How much hay per day?", "Signs of GI stasis?", "Litter training a new bunny."],
  },
  {
    slug: "fish-care",
    name: "AI Aquarium Assistant",
    tagline: "Water quality first.",
    description: "Cycling, water chemistry, feeding, and disease prevention for freshwater and saltwater tanks.",
    longDescription: `### Aquatic Ecosystem Management & Water Chemistry
Maintaining an aquarium is the art of cultivating microscopic biological ecosystems. Fish health is entirely dependent on water chemistry, dissolved oxygen, and beneficial bacterial colonies that break down toxic waste.

#### 1. The Biological Nitrogen Cycle
Before introducing fish, every aquarium must undergo the nitrogen cycle (3–6 weeks):
1. **Ammonia ($NH_3$):** Highly toxic waste excreted by fish and rotting food (Target: **0.0 ppm**).
2. **Nitrite ($NO_2^-$):** Toxic byproduct converted by *Nitrosomonas* bacteria (Target: **0.0 ppm**).
3. **Nitrate ($NO_3^-$):** Less toxic compound converted by *Nitrobacter* bacteria, removed via live plants and regular 25% weekly water changes (Target: **< 20 ppm**).

#### 2. Stocking Rules & Filtration Turnover
Avoid the outdated "1 inch of fish per gallon" rule for wide-bodied or messy species. Choose a canister or power filter that turns over the total aquarium water volume at least 4 to 6 times per hour ($GPH \\ge 4\\times \\text{Volume}$).

#### 3. Acclimation & Quarantine
Always float and drip-acclimate new fish over 45–60 minutes to prevent thermal and osmotic shock, and quarantine newcomers for 2–4 weeks to protect your main display tank.`,
    keyFeatures: [
      "Nitrogen cycle step-by-step fishless cycling guides",
      "Target water parameter charts (pH, Ammonia, Nitrite, Nitrate, GH/KH, Temp)",
      "Filtration turnover rate (GPH) and heater wattage calculations",
      "Common disease prevention (Ich, Fin Rot) and quarantine protocols",
    ],
    faqs: [
      { q: "What does cycling an aquarium mean?", a: "Cycling establishes beneficial nitrifying bacteria in your filter media to convert lethal fish ammonia into nitrites, and then into safer nitrates before fish are added." },
      { q: "What should safe aquarium water parameters read?", a: "Ammonia must be 0.0 ppm, Nitrite must be 0.0 ppm, and Nitrate should be kept below 20 ppm through weekly 25% water changes." },
      { q: "How often should I change aquarium water?", a: "Perform a 20–25% partial water change weekly using a gravel siphon vacuum, replacing removed water with temperature-matched, dechlorinated tap water." },
      { q: "Why is tap water conditioner mandatory?", a: "Municipal tap water contains chlorine and chloramines that instantly burn fish gills and destroy beneficial biological filter bacteria. Water conditioner neutralizes these toxins immediately." },
      { q: "How do I calculate heater wattage for my tank size?", a: "Use the rule of thumb: 3 to 5 Watts of heating power per US gallon of tank water to maintain steady tropical temperatures (76–80°F)." },
    ],
    relatedTools: [
      { title: "Aquarium Volume Calculator", slug: "aquarium-volume-calculator", description: "Calculate exact net water gallons and substrate volume." },
      { title: "Aquarium Filter Flow Rate Guide", slug: "aquarium-filter-flow-rate", description: "Determine required filter GPH turnover rates." },
      { title: "Aquarium Heater Wattage Calculator", slug: "aquarium-heater-wattage-calculator", description: "Calculate heater wattage requirements." },
    ],
    species: "aquarium fish",
    focus: "nitrogen cycle, water parameters (pH/ammonia/nitrite/nitrate), stocking density, feeding, disease prevention (ich, fin rot) with vet/aquatic specialist redirect",
    prompts: ["How do I cycle a new freshwater tank?", "Safe stocking for a 20-gallon community tank.", "Water change schedule for a planted tank.", "Signs of ich and next steps."],
  },
  {
    slug: "hamster-care",
    name: "AI Hamster Care Assistant",
    tagline: "Small pet, big care.",
    description: "Cage sizing, wheel choice, bedding, and enrichment for Syrian and dwarf hamsters.",
    longDescription: `### Modern Hamster Husbandry & Burrowing Enrichment
Hamsters are solitary, nocturnal rodents that require significantly more space and deep burrowing substrate than traditional pet store cages provide. In the wild, hamsters travel several miles each night foraging across vast home ranges.

#### 1. Minimum Floor Space & Deep Bedding
Ethical welfare standards require a **minimum unbroken floor area of 600–800+ sq inches** (approx 40 × 20 in / 100 × 50 cm). Wire cages with shallow bases prevent natural burrowing. Provide at least **6 to 10 inches of compressed paper-based bedding** so your hamster can dig complex underground tunnel systems. Never use cedar or pine shavings containing toxic aromatic phenols.

#### 2. Upright Wheel Sizing & Spine Protection
Hamsters run up to 5 miles per night. An undersized wheel forces the hamster to arch its spine backward, causing chronic spinal damage.
- **Syrian Hamsters:** Require a minimum **11 to 12-inch diameter wheel**.
- **Dwarf & Roborovski Hamsters:** Require an **8 to 10-inch diameter wheel**.
- Always choose a solid-surface running track (never wire mesh or rungs that cause foot entrapment).

#### 3. Sand Baths & Nutrition
Hamsters must never be bathed in water. Provide a ceramic dish filled with calcium-free reptile desert sand or heat-sterilized children's play sand for daily coat grooming.`,
    keyFeatures: [
      "Unbroken floor space standards (600–800+ sq in) and enclosure setups",
      "Deep burrowing substrate guidelines (6–10+ inches of paper bedding)",
      "Wheel diameter sizing to prevent spinal curvature",
      "Sand bath grooming requirements and seed mix foraging strategies",
    ],
    faqs: [
      { q: "What is the true minimum cage size for a hamster?", a: "Modern welfare standards mandate a minimum of 600 to 800+ square inches of continuous, unbroken floor space (e.g. a 75-gallon tank or 40×20 inch enclosure)." },
      { q: "Why do hamsters need deep bedding?", a: "Hamsters are natural burrowers. They need at least 6 to 10 inches of compressed paper bedding to construct stable subterranean burrows and sleeping chambers." },
      { q: "What size wheel does my hamster need?", a: "Syrian hamsters require an 11–12 inch wheel, while Dwarf hamsters need an 8–10 inch solid-surface wheel to ensure their spine stays completely flat while running." },
      { q: "Can two hamsters live together in the same cage?", a: "No. Syrian hamsters are strictly solitary and will fight to the death over territory. While some Dwarf species live in colonies in the wild, cohabitation in captivity carries high risk." },
      { q: "Why should hamsters never be bathed in water?", a: "Water strips natural insulating oils from their coat and causes rapid hypothermia. Hamsters clean themselves exclusively in dry sand baths." },
    ],
    relatedTools: [
      { title: "Hamster Cage Size Calculator", slug: "hamster-cage-size-calculator", description: "Verify continuous floor area and bedding depth." },
      { title: "Hamster Wheel Size Calculator", slug: "hamster-wheel-size-calculator", description: "Calculate ergonomic wheel diameters by species." },
      { title: "Hamster Food Calculator", slug: "hamster-food-calculator", description: "Balance seed mixes, pellets, and protein supplements." },
    ],
    species: "hamsters",
    focus: "minimum cage sizes, safe wheel diameter, safe bedding (avoid cedar/pine shavings), diet, wet-tail warning signs (redirect to vet)",
    prompts: ["Minimum cage size for a Syrian hamster.", "Safe bedding options.", "How big should my hamster's wheel be?", "Signs my hamster is stressed."],
  },
  {
    slug: "guinea-pig-care",
    name: "AI Guinea Pig Care Assistant",
    tagline: "Cavies, cared for.",
    description: "Vitamin C, hay, cage size, and companionship for guinea pigs.",
    longDescription: `### Cavy Care, Social Dynamics, & Vitamin C Nutrition
Guinea pigs (cavies) are vocal, gentle herd rodents native to the Andean regions of South America. They have distinct dietary requirements, delicate foot anatomy, and deep social bonding needs.

#### 1. Mandatory Dietary Vitamin C
Like humans, guinea pigs lack the *L-gulonolactone oxidase* enzyme and **cannot synthesize Vitamin C**. Deficiency results in rapid scurvy, joint pain, loose teeth, and internal hemorrhaging. Provide:
- **Daily Vitamin C:** 10–30 mg daily via fresh bell peppers (yellow and red), stabilized cavy pellets, or specialized chewable supplements.
- **Unlimited Grass Hay:** Timothy or orchard grass hay makes up 80%+ of their daily intake.

#### 2. Enclosure Sizing & Flat Flooring
Cavies lack climbing agility and need wide, flat running space. A bonded pair requires a **minimum of 7.5 to 10.5 sq ft of flat floor area** (such as a 2×4 C&C grid cage). Never use wire grid flooring, which causes crippling foot infections (bumblefoot).

#### 3. Companionship
Guinea pigs are herd animals that suffer severe depression and loneliness when housed alone. In Switzerland, it is illegal to keep a solitary guinea pig. Always adopt cavies in bonded pairs or small groups.`,
    keyFeatures: [
      "Daily Vitamin C dosage targets (10–30 mg) and safe fresh produce lists",
      "Flat C&C grid cage sizing guidelines (minimum 7.5–10.5+ sq ft)",
      "Bumblefoot prevention and fleece/paper bedding maintenance",
      "Same-species bonding steps and upper respiratory illness warning signs",
    ],
    faqs: [
      { q: "How much Vitamin C does a guinea pig need daily?", a: "A healthy adult guinea pig requires 10 to 30 mg of Vitamin C daily, while pregnant or recovering cavies need up to 50 mg. Fresh bell peppers are the best natural source." },
      { q: "What is the minimum cage size for two guinea pigs?", a: "Two guinea pigs require a minimum of 7.5 square feet of flat floor space (a 2×4 C&C cage), though 10.5 square feet (2×5 C&C cage) is strongly recommended for exercise." },
      { q: "Can a guinea pig live alone without a companion?", a: "No. Guinea pigs are social herd animals that experience severe chronic stress and lethargy when isolated. Always house them in bonded pairs or trios." },
      { q: "Why should Vitamin C drops not be added to water bottles?", a: "Vitamin C rapidly degrades in light, alters the water taste (causing dangerous dehydration), and does not deliver an accurate therapeutic dose. Feed fresh produce or oral tablets." },
      { q: "What are the warning signs of an Upper Respiratory Infection (URI)?", a: "Crusty eyes, nasal discharge, labored breathing, clicking sounds in the chest, and sudden lethargy are signs of a life-threatening URI requiring emergency antibiotics from an exotic vet." },
    ],
    relatedTools: [
      { title: "Guinea Pig Food Calculator", slug: "guinea-pig-food-calculator", description: "Calculate hay, pellet, and vegetable daily ratios." },
      { title: "Guinea Pig Cage Size Calculator", slug: "guinea-pig-cage-size-calculator", description: "Determine minimum square footage for bonded cavies." },
      { title: "Rabbit Hay Portion Calculator", slug: "rabbit-hay-portion-calculator", description: "Compare coarse grass hay feeding requirements." },
    ],
    species: "guinea pigs",
    focus: "vitamin C requirements, unlimited hay, safe fresh vegetables, minimum cage size, importance of same-species companionship, URI warning signs (redirect to vet)",
    prompts: ["How much vitamin C does my guinea pig need?", "Safe daily vegetables.", "Minimum cage size for two guinea pigs.", "Should I get a second guinea pig?"],
  },
  {
    slug: "ferret-care",
    name: "AI Ferret Care Assistant",
    tagline: "Ferret-first advice.",
    description: "High-protein diets, cage setup, litter, and enrichment for ferrets.",
    longDescription: `### Mustelid Biology, Obligate Carnivore Diets, & Safety
Domestic ferrets are curious, high-energy obligate carnivores with rapid metabolisms and specialized housing needs. Their playful nature requires dedicated supervision and thorough ferret-proofing.

#### 1. Strict Carnivorous Nutrition
Ferrets have a short gastrointestinal tract (digestive transit time of 3–4 hours) and cannot digest plant fiber, fruits, or grains.
- **Dietary Composition:** High animal protein (35–40%) and high fat (20%), with zero complex carbohydrates or sugars.
- **Dangers of Sugar:** Feeding sugary treats or fruits causes *insulinoma* (pancreatic beta-cell tumors).

#### 2. Ferret-Proofing the Home
Ferrets can squeeze through any opening larger than 1 inch (the size of their skull). Block access behind refrigerators, cover heating vents, and eliminate rubber/foam toys that cause fatal foreign body obstructions.

#### 3. Sleep & Photoperiod Regulation
Ferrets sleep 14–18 hours per day. Chronic exposure to artificial light during sleep disrupts melatonin production and triggers *adrenal disease* (alopecia, enlarged prostate/vulva). Ensure their sleeping enclosures are pitch dark.`,
    keyFeatures: [
      "High-protein, grain-free obligate carnivore feeding guidelines",
      "Room ferret-proofing and rubber/foam obstruction prevention",
      "Multi-level wire cage setup and soft hammock sleeping arrangements",
      "Adrenal disease, insulinoma, and lymphoma symptom awareness",
    ],
    faqs: [
      { q: "What should a domestic ferret eat daily?", a: "Ferrets require a high-protein (35–40%), high-animal-fat (20%), zero-grain diet using specialized commercial ferret kibbles or balanced raw meat diets." },
      { q: "Why are fruits, vegetables, and grain treats dangerous for ferrets?", a: "Ferrets cannot digest complex carbohydrates or fiber. Carbohydrates strain the pancreas, leading to hypoglycemia and insulinoma tumors." },
      { q: "How many hours of out-of-cage exercise do ferrets need?", a: "Ferrets require a minimum of 4 hours of supervised out-of-cage exploration, tunnel play, and interaction daily." },
      { q: "What are the common signs of adrenal gland disease in ferrets?", a: "Symmetrical hair loss starting at the tail base, intense skin itching, sexual aggression in neutered males, and enlarged vulva in spayed females." },
      { q: "How small of a hole can a ferret escape through?", a: "A ferret can squeeze through any gap larger than 1 inch in diameter. Seal all gaps under cabinets, vents, and doors." },
    ],
    relatedTools: [
      { title: "Ferret Cage Size Calculator", slug: "cat-litter-calculator", description: "Calculate multi-level vivarium volume and litter needs." },
      { title: "Cat Calorie Calculator", slug: "cat-calorie-calculator", description: "Compare obligate carnivore caloric density standards." },
    ],
    species: "ferrets",
    focus: "obligate-carnivore diet, safe playpen setup, ferret-proofing the home, adrenal/insulinoma warning signs (redirect to vet)",
    prompts: ["Best diet for a young ferret.", "How do I ferret-proof my apartment?", "Litter training a ferret.", "Signs of adrenal disease."],
  },
  {
    slug: "turtle-care",
    name: "AI Turtle Care Assistant",
    tagline: "Shells and habitats.",
    description: "Tank size, UVB lighting, water quality, and diet for aquatic and terrestrial turtles.",
    longDescription: `### Chelonian Husbandry: Aquatic Turtles & Terrestrial Tortoises
Turtles and tortoises are ancient ectothermic reptiles that rely on external heat and ultraviolet radiation to metabolize food and build strong shells. Proper tank sizing, high-powered filtration, and Ferguson Zone UVB lighting are vital for their multi-decade lifespans.

#### 1. Aquatic Sizing & Powerful Filtration
- **The 10-Gallons-per-Inch Rule:** Provide **10 US gallons of water per inch of shell length** (e.g., an 8-inch adult Red-Eared Slider needs an 80–100 gallon tank).
- **Canister Filtration:** Turtles produce significant waste. Use a heavy-duty canister filter rated for **3× to 4× the actual water volume**.

#### 2. The 100% Dry Basking Zone & UVB
Every aquatic setup requires a dry basking dock where the turtle can climb completely out of the water to dry its carapace (top) and plastron (bottom) under **90–95°F basking heat** and **Ferguson Zone 3 linear T5-HO UVB light**. Complete drying prevents fungal shell rot.

#### 3. Terrestrial Tortoise Housing
Tortoises cannot swim and should not be kept in glass tanks. They require open-top wooden tortoise tables with deep digging soil, a shallow soaking dish, and high-fiber weed/grass diets.`,
    keyFeatures: [
      "10-gallons-per-inch tank volume and canister filtration sizing",
      "100% dry basking dock thermal gradients and linear T5-HO UVB setups",
      "Shell rot, vitamin A deficiency, and Metabolic Bone Disease prevention",
      "Aquatic omnivore vs terrestrial herbivore nutritional distinctions",
    ],
    faqs: [
      { q: "What is the tank size rule for aquatic turtles?", a: "Provide 10 US gallons of swimming water for every 1 inch of your turtle's Straight Carapace Length (an 8-inch turtle requires an 80–100 gallon tank)." },
      { q: "Why do aquatic turtles need a completely dry basking dock?", a: "Turtles must dry out completely under heat and UVB rays to shed scutes properly, synthesize Vitamin D3, and prevent fungal shell rot." },
      { q: "Why is a canister filter rated for 3–4x tank volume necessary?", a: "Turtles generate vastly more solid and organic waste than fish. An oversized canister filter maintains safe water parameters and prevents bacterial buildup." },
      { q: "What causes soft shell or Metabolic Bone Disease (MBD) in turtles?", a: "MBD is caused by inadequate linear UVB lighting, low dietary calcium, or low basking temperatures, preventing the body from absorbing calcium into bone and shell." },
      { q: "Why should tortoises not be housed in glass aquariums?", a: "Tortoises do not understand glass transparency and will continuously ram against the walls, causing chronic stress. Use open-top wooden tortoise tables instead." },
    ],
    relatedTools: [
      { title: "Turtle Tank Size Calculator", slug: "turtle-tank-calculator", description: "Calculate exact water gallons and filtration requirements." },
      { title: "Reptile UVB Distance Guide", slug: "reptile-uvb-distance-guide", description: "Calculate safe linear UVB bulb mounting distances." },
      { title: "Reptile Basking Temp Guide", slug: "reptile-basking-temp-guide", description: "Inspect species-specific basking surface temperatures." },
    ],
    species: "pet turtles and tortoises",
    focus: "tank/enclosure sizing, UVB and basking temperatures, water filtration, calcium and vitamin D3, MBD warning signs (redirect to vet)",
    prompts: ["Tank size for a red-eared slider.", "Do I need UVB lighting?", "Basking temperatures for a Russian tortoise.", "Signs of shell rot."],
  },
  {
    slug: "snake-care",
    name: "AI Snake Care Assistant",
    tagline: "Kind, science-based reptile care.",
    description: "Enclosure setup, thermal gradients, humidity, and feeding for common pet snakes.",
    longDescription: `### Colubrid & Python Husbandry: Modern Snake Welfare
Snakes are ectothermic carnivores with specialized thermal, humidity, and prey digestion physiology. Modern welfare standards emphasize enclosures that allow full rectilinear stretching, distinct thermal gradients, and proper humidity microclimates.

#### 1. The 1.0x Body Length Enclosure Standard
Outdated guidelines that allowed small tubs have been replaced by the **1.0× body length rule**: the length of the vivarium must equal or exceed the total length of the snake (e.g., a 4 ft adult Ball Python requires a 48 × 24 × 24 inch / 120-gallon enclosure) to prevent spinal deformities and muscle atrophy.

#### 2. Thermal Gradients & Thermostats
Every snake enclosure requires a distinct thermal gradient:
- **Warm Basking Zone:** 88–92°F (31–33°C) regulated by a pulse/dimming thermostat.
- **Cool Retreat Zone:** 75–80°F (24–27°C).
- Always place two identical hides—one on the warm end and one on the cool end—so the snake never has to choose between feeling secure and thermoregulating.

#### 3. Frozen-Thawed Feeding & Shedding Cycles
Feed pre-killed frozen-thawed rodents warmed to ~100°F. Never handle a snake for 48 hours following a meal to prevent regurgitation. During shedding (ecdysis), maintain species-appropriate humidity (60–75% for Ball Pythons) and provide a damp sphagnum moss humid hide.`,
    keyFeatures: [
      "1.0× snake body length vivarium dimensions and PVC enclosure setups",
      "Warm-to-cool thermal gradient targets and thermostat pairing",
      "Weight-based frozen-thawed feeding schedules and post-meal handling rules",
      "Ecdysis shed phase tracking, humid hide design, and respiratory care",
    ],
    faqs: [
      { q: "What is the minimum enclosure size for an adult Ball Python?", a: "An adult Ball Python requires a minimum 48 × 24 × 24 inch (120-gallon) enclosure allowing the snake to stretch out completely along one wall." },
      { q: "Why should all reptile heat sources be connected to a thermostat?", a: "Unregulated heat lamps and mats easily overheat to lethal temperatures (>120°F), causing severe third-degree burns or fatal heat stroke." },
      { q: "How long should I wait before handling my snake after feeding?", a: "Wait at least 48 hours after feeding before handling your snake to allow proper digestion and prevent dangerous regurgitation." },
      { q: "Why is my snake refusing food?", a: "Common causes include low enclosure temperatures, being in the opaque 'blue' shedding phase, prey not warmed to ~100°F, or stress from excessive handling." },
      { q: "How does a humid hide help during shedding?", a: "A humid hide packed with damp sphagnum moss provides an 80%+ microclimate that hydrates the outer skin layer, ensuring a clean, one-piece shed." },
    ],
    relatedTools: [
      { title: "Snake Tank Size Calculator", slug: "snake-tank-size-calculator", description: "Calculate minimum vivarium dimensions by snake body length." },
      { title: "Snake Feeding Schedule", slug: "snake-feeding-schedule", description: "Determine prey weight and feeding intervals by age." },
      { title: "Reptile Shedding Tracker", slug: "reptile-shedding-tracker", description: "Track biological ecdysis phases and countdowns." },
    ],
    species: "pet snakes (ball python, corn snake, king snake)",
    focus: "enclosure sizing, hot/cool gradients, humidity, feeding schedules, shed cycles, stuck shed and RI warning signs (redirect to vet)",
    prompts: ["Ideal humidity for a ball python.", "Feeding schedule for a young corn snake.", "Signs of a bad shed.", "How to set up a thermal gradient."],
  },
  {
    slug: "lizard-care",
    name: "AI Lizard Care Assistant",
    tagline: "Reptile care, done right.",
    description: "UVB, basking, humidity, and diet for geckos, bearded dragons, and other pet lizards.",
    longDescription: `### Saurian Husbandry: Bearded Dragons, Geckos, & Skinks
Lizards encompass a diverse range of ecological adaptations, from desert baskers (Bearded Dragons, Uromastyx) to tropical arboreal climbers (Crested Geckos, Day Geckos) and crepuscular ground dwellers (Leopard Geckos).

#### 1. Ferguson Zone UVB Lighting
UVB radiation (290–320 nm) enables synthesis of Vitamin D3, essential for dietary calcium absorption. 
- **Arid Baskers (Bearded Dragons):** Require Ferguson Zone 3/4 linear T5-HO 10.0 / 12% tubes mounted over the warm basking zone.
- **Crepuscular Geckos (Leopard & Crested):** Benefit from Ferguson Zone 1 low-output UVB (such as Arcadia ShadeDweller 7%) for immune function and circadian rhythm.
- Replace linear fluorescent UVB bulbs every 10–12 months.

#### 2. Basking Surface Thermoregulation
Measure basking spots with an **infrared temperature gun**, not an ambient air thermometer. Bearded dragons require a surface temperature of **100–110°F** on slate or stone to activate digestive enzymes.

#### 3. Age-Specific Diets & Dusting
- **Young Lizards:** Require high-protein live insect feeders (Dubia roaches, black soldier fly larvae, crickets) dusted with pure calcium.
- **Adult Bearded Dragons:** Transition to 80% daily dark leafy greens (collard, mustard, dandelion) and only 20% live insects.`,
    keyFeatures: [
      "Ferguson Zone UVB matching and linear T5-HO distance calculation",
      "Infrared surface basking temperature matrix for 12+ species",
      "Life-stage diet transition (insectivore to omnivore/herbivore ratios)",
      "Metabolic Bone Disease prevention and calcium/D3 dusting schedules",
    ],
    faqs: [
      { q: "Why do bearded dragons need a linear T5-HO UVB light?", a: "Linear T5-HO bulbs provide uniform, high-intensity UVB radiation necessary for Vitamin D3 synthesis. Coil bulbs create unsafe hotspots and decay quickly." },
      { q: "What should the basking surface temperature be for a bearded dragon?", a: "Measure with an infrared temp gun: adult dragons need 100–105°F, while juveniles need 105–110°F on slate or rock to digest meals." },
      { q: "What is the rule for feeder insect size for lizards?", a: "The feeder insect length must never be wider than the space between the lizard's eyes to prevent choking, impaction, and spinal nerve compression." },
      { q: "Do nocturnal geckos (Leopard, Crested) need UVB lighting?", a: "While they can survive on dietary Vitamin D3 powder, low-level Ferguson Zone 1 UVB significantly improves immune function, coloration, and natural activity." },
      { q: "What is Metabolic Bone Disease (MBD) in lizards?", a: "MBD results from insufficient calcium or UVB, causing the body to leach calcium from bones, leading to rubbery jaws, tremors, curved spines, and paralysis." },
    ],
    relatedTools: [
      { title: "Reptile Enclosure Size Calculator", slug: "reptile-enclosure-size-calculator", description: "Calculate species-specific minimum vivarium sizes." },
      { title: "Reptile UVB Distance Guide", slug: "reptile-uvb-distance-guide", description: "Determine safe UVB fixture mounting distances." },
      { title: "Bearded Dragon Food Calculator", slug: "bearded-dragon-food-calculator", description: "Calculate insect-to-greens feeding ratios by age." },
    ],
    species: "pet lizards (bearded dragon, leopard gecko, crested gecko, blue-tongue skink)",
    focus: "UVB requirements, basking temps, humidity, calcium/D3 supplementation, MBD warning signs (redirect to vet)",
    prompts: ["Basking temps for a bearded dragon.", "Do leopard geckos need UVB?", "Humidity for a crested gecko.", "Signs of metabolic bone disease."],
  },
  {
    slug: "horse-care",
    name: "AI Horse Care Assistant",
    tagline: "Barn-to-pasture care.",
    description: "Feeding, hoof and dental care, exercise, and turnout planning for horses.",
    longDescription: `### Equine Management, Forage Nutrition, & Barn Husbandry
Horses are trickle-feeding herbivores with complex gastrointestinal systems designed for continuous grazing. Sound equine management balances forage nutrition, routine hoof and dental maintenance, and daily turnout.

#### 1. Forage-First Digestive Health
A horse's stomach produces gastric acid 24/7. To buffer acid and prevent ulcers, horses require a **minimum of 1.5% to 2.0% of their body weight in quality forage (hay/pasture) daily** (15–20 lbs for a 1,000 lb horse). Concentrates and grains are supplementary and should only be fed when forage alone cannot meet caloric demands.

#### 2. Routine Farrier & Dental Maintenance
- **Hoof Care:** Hooves grow continuously (~¼ inch per month). Schedule professional farrier trims and re-shoeing every **4 to 6 weeks** to maintain proper balance and prevent laminitis.
- **Dental Floating:** Horses chew with an elliptical motion that creates sharp enamel points. Have an equine dentist float teeth annually.

#### 3. Colic Prevention & Emergency Awareness
Colic (abdominal pain) is a leading cause of equine mortality. Ensure free-choice clean water, make feed changes gradually over 10–14 days, and seek immediate veterinary care at the first sign of pawing, flank watching, or rolling.`,
    keyFeatures: [
      "Forage-to-concentrate daily feed calculations based on body weight",
      "Farrier trimming intervals (4–6 weeks) and hoof balance guidelines",
      "Colic early warning signs and emergency veterinary triage steps",
      "Daily turnout, stall sizing (12×12 ft minimum), and blanketing rules",
    ],
    faqs: [
      { q: "How much hay does an average horse need daily?", a: "A healthy horse requires 1.5% to 2.0% of its body weight in quality hay daily (15 to 20 lbs of forage for a 1,000 lb horse) to maintain gut motility." },
      { q: "How often does a horse need hoof trimming from a farrier?", a: "Horses require professional farrier trims or shoe resetting every 4 to 6 weeks to maintain correct hoof-pastern axis balance." },
      { q: "What are the earliest warning signs of equine colic?", a: "Signs include pawing the ground, looking at the flanks, refusing grain or water, lying down and rolling repeatedly, and absence of gut sounds." },
      { q: "Why do horses need their teeth floated annually?", a: "Horses' teeth continuously erupt and wear unevenly, creating razor-sharp enamel points that cut the cheeks and tongue, causing weight loss and poor chewing." },
      { q: "What is the standard stall size for a full-sized riding horse?", a: "A standard horse stall should measure at least 12 × 12 feet (3.6 × 3.6 meters) with good ventilation and clean, absorbent bedding." },
    ],
    relatedTools: [
      { title: "Horse Feed Calculator", slug: "horse-feed-calculator", description: "Calculate daily hay and concentrate rations by body weight." },
      { title: "Horse Blanket Size Calculator", slug: "horse-blanket-size-calculator", description: "Determine blanket size from chest and body measurements." },
      { title: "Horse Stall Size Calculator", slug: "horse-stall-size-calculator", description: "Size stalls and foaling boxes by horse height." },
    ],
    species: "horses and ponies",
    focus: "forage-first nutrition, farrier and dental intervals, turnout, colic warning signs (redirect to vet immediately)",
    prompts: ["Farrier and dental schedule for a light-work horse.", "Warning signs of colic.", "Feeding an easy keeper.", "Winter turnout tips."],
  },
  {
    slug: "goat-care",
    name: "AI Goat Care Assistant",
    tagline: "Herd health basics.",
    description: "Nutrition, hoof trimming, vaccination, and milking basics for goats.",
    longDescription: `### Caprine Husbandry: Nutrition, Herd Health, & Management
Goats are inquisitive, browsing ruminants that require quality forage, bioavailable loose minerals, routine hoof care, and predator-proof housing to thrive.

#### 1. Browsing Nutrition & Mineral Essentials
Unlike cattle and sheep that graze grass, goats are natural browsers that prefer woody brush, shrubs, and coarse leafy hay.
- **Loose Free-Choice Minerals:** Goats have high **copper requirements**. Never feed sheep mineral mixes to goats, as sheep mixes lack copper and will cause deficiency (faded coat, fishtail, anemia).
- **Rumen Buffering:** Provide clean grass hay to keep the four-chambered rumen functioning and prevent ruminal acidosis.

#### 2. Preventive Herd Protocols
- **Hoof Trimming:** Trim hooves every **4 to 8 weeks** with sharp shears to prevent foot rot and joint deformities.
- **CDT Vaccination:** Administer annual *Clostridium perfringens* types C & D and Tetanus vaccinations.
- **Parasite Monitoring:** Utilize the **FAMACHA eye scoring chart** to check inner eyelid color for *Haemonchus contortus* (barber pole worm) anemia before deworming.`,
    keyFeatures: [
      "Browse-based forage feeding and copper-rich loose mineral standards",
      "FAMACHA anemia eyelid scoring and targeted deworming protocols",
      "Hoof trimming techniques and CDT vaccination schedule",
      "Herd housing, fencing (minimum 4 ft woven wire), and bloat management",
    ],
    faqs: [
      { q: "Why do goats need copper in their mineral mix?", a: "Goats have a high biological requirement for copper to maintain immune defense, coat pigmentation, and fertility. Sheep minerals lack copper and will cause caprine deficiency." },
      { q: "How often do goat hooves need to be trimmed?", a: "Trim goat hooves every 4 to 8 weeks using specialized hoof shears to keep the wall flush with the sole and prevent foot rot." },
      { q: "What is the FAMACHA system for goats?", a: "FAMACHA is a diagnostic chart that grades the color of the lower inner eyelid mucous membrane (1 = red/healthy to 5 = white/severely anemic) to identify barber pole worm load." },
      { q: "What is the annual CDT vaccine for goats?", a: "The CDT vaccine protects against *Clostridium perfringens* Type C & D (enterotoxemia/overeating disease) and *Clostridium tetani* (tetanus)." },
      { q: "What type of fencing is required for goats?", a: "Use at least 4-foot-tall (48 inch) heavy-gauge woven wire or non-climb fencing with sturdy posts, as goats will lean, jump, and test weak spots." },
    ],
    relatedTools: [
      { title: "Goat Feed Calculator", slug: "horse-feed-calculator", description: "Calculate daily browse, hay, and grain requirements." },
      { title: "Goat Hoof Care Guide", slug: "dog-bath-frequency-calculator", description: "Plan routine farm maintenance intervals." },
    ],
    species: "goats (dairy, meat, and pet)",
    focus: "forage-based diet, mineral needs (copper, selenium), hoof trimming, CDT vaccination cadence, bloat/pregnancy toxemia warning signs (redirect to vet)",
    prompts: ["Basic hoof trimming schedule.", "CDT vaccination timing.", "Signs of bloat in goats.", "Feeding a lactating doe."],
  },
  {
    slug: "sheep-care",
    name: "AI Sheep Care Assistant",
    tagline: "Flock care essentials.",
    description: "Shearing, deworming, hoof care, and pasture rotation for sheep.",
    longDescription: `### Ovine Management, Pasture Rotation, & Flock Health
Sheep are gentle, flocking grazing ruminants that excel at converting grass pasture into wool, milk, and meat. Successful sheep husbandry requires strict attention to copper toxicity risks, rotational grazing, and annual shearing.

#### 1. Grazing Nutrition & Copper Toxicity Warning
Sheep have an extremely sensitive metabolic pathway for copper storage in the liver.
- **Copper Toxicity Danger:** Sheep absorb and store copper easily. Standard livestock or goat feeds containing added copper are **lethal to sheep**, causing acute hemolytic crisis. Always feed copper-free ovine specific mineral mixes.
- **Pasture Management:** Rotate pastures every 3–7 days to break internal parasite life cycles and maintain leafy forage stand height.

#### 2. Shearing & Parasite Control
- **Annual Shearing:** Wool breeds must be shorn at least once per year (typically in spring before lambing) to prevent heat stress, flystrike (maggot infestation), and wool blindness.
- **FAMACHA & Foot Rot:** Monitor flock anemia with FAMACHA scoring and maintain dry footing to prevent *Dichelobacter nodosus* foot rot.`,
    keyFeatures: [
      "Strict copper-free mineral feeding and pasture grazing management",
      "Annual spring shearing schedules and flystrike prevention",
      "FAMACHA eyelid scoring and rotational parasite control",
      "Flock hoof trimming, shelter sizing, and predator guard animals",
    ],
    faqs: [
      { q: "Why is copper toxic to sheep?", a: "Sheep accumulate copper in liver cells far more easily than other livestock. Excess copper suddenly lyses red blood cells, causing fatal jaundice and kidney failure." },
      { q: "How often do wool sheep need to be shorn?", a: "Wool sheep must be shorn at least once a year, ideally in early spring, to prevent heat stroke, wool blindness, and severe flystrike infestations." },
      { q: "What is rotational grazing and why is it beneficial for sheep?", a: "Rotational grazing moves sheep between paddocks every few days to let forage regrow and allow parasite larvae on grass to die before sheep return." },
      { q: "What is flystrike in sheep?", a: "Flystrike occurs when blowflies lay eggs in moist, soiled wool (often around the tail). Hatched maggots eat into the sheep's flesh, requiring emergency medical treatment." },
      { q: "How do livestock guardian dogs (LGDs) protect sheep flocks?", a: "Breeds like Great Pyrenees, Anatolian Shepherds, and Maremmas live with the flock 24/7, deterring predators like coyotes, wolves, and stray dogs through scent and vocal warnings." },
    ],
    relatedTools: [
      { title: "Pasture & Hay Feed Calculator", slug: "horse-feed-calculator", description: "Calculate pasture forage and winter hay portions." },
      { title: "Farm Maintenance Planner", slug: "dog-bath-frequency-calculator", description: "Plan flock shearing and farrier cadence." },
    ],
    species: "sheep (wool, meat, and companion)",
    focus: "shearing intervals, parasite control (FAMACHA), hoof trimming, pasture rotation, lambing warning signs (redirect to vet)",
    prompts: ["How often should sheep be shorn?", "Basic FAMACHA scoring.", "Foot rot prevention.", "Lambing warning signs."],
  },
  {
    slug: "chicken-care",
    name: "AI Chicken Care Assistant",
    tagline: "Backyard flock care.",
    description: "Coop setup, feed, egg production, and biosecurity for backyard chickens.",
    longDescription: `### Backyard Poultry Husbandry, Nutrition, & Coop Design
Backyard chickens are productive, social flock birds that provide fresh eggs and natural garden pest control. Providing well-ventilated coops, predator-proof runs, and life-stage nutrition ensures a healthy laying flock.

#### 1. Coop Dimensions & Draft-Free Ventilation
- **Coop Space:** Provide a **minimum of 3 to 4 sq ft of indoor coop floor space** per bird, plus **8 to 10 sq ft in the outdoor run**.
- **Ventilation:** Chicken droppings produce high moisture and ammonia. Coops require continuous high-level ventilation (minimum 1 sq ft per bird near the roofline) that allows warm moist air to escape without blowing drafts directly onto roosting perches.
- **Roosting & Nest Boxes:** Provide 8–10 inches of wooden roosting bar per hen and **1 nesting box per 3–4 hens**.

#### 2. Life-Stage Nutrition, Calcium, & Insoluble Grit
- **Chicks (0–8 wks):** Starter crumbles with 18–20% protein.
- **Laying Hens (18+ wks):** 16% layer feed supplemented with free-choice crushed oyster shell (calcium) in a separate feeder for strong eggshells.
- **Insoluble Granite Grit:** Essential in the gizzard to grind whole grains and forage.

#### 3. Predator-Proofing & Biosecurity
Hardware cloth (½ inch welded wire) must cover all windows, vents, and buried perimeter aprons. Never rely on traditional chicken wire, which raccoons and foxes can easily tear open.`,
    keyFeatures: [
      "Coop space calculations (3-4 sq ft indoor / 8-10 sq ft run per bird)",
      "High-level ventilation and frostbite prevention design",
      "Layer feed, crushed oyster shell calcium, and grit protocols",
      "Predator-proofing with ½ inch hardware cloth and egg-binding triage",
    ],
    faqs: [
      { q: "How much coop and run space does each chicken need?", a: "Each standard-sized hen requires 3 to 4 square feet of space inside the enclosed coop, and 8 to 10 square feet in the predator-proof outdoor run." },
      { q: "Why is chicken wire not safe for predator-proofing?", a: "Chicken wire is only designed to keep chickens in. Raccoons, foxes, and dogs can easily bend, tear, or reach through chicken wire. Use ½-inch welded hardware cloth." },
      { q: "Why do laying hens need crushed oyster shell in a separate dish?", a: "Producing eggshells consumes massive amounts of calcium. Providing free-choice oyster shell allows hens to self-regulate calcium without overdosing roosters or non-layers." },
      { q: "Why is coop ventilation critical in winter?", a: "Chickens exhale moisture and produce damp droppings. Without high-level ventilation, humidity accumulates and freezes on combs and wattles, causing severe frostbite." },
      { q: "What are the symptoms of an egg-bound hen?", a: "An egg-bound hen walks like a penguin, strains repeatedly, has a swollen vent/abdomen, droops her wings, and stays isolated. This requires immediate warm Epsom salt soaks and vet care." },
    ],
    relatedTools: [
      { title: "Chicken Nesting Box Count", slug: "chicken-nesting-box-count", description: "Determine required nesting boxes for flock size." },
      { title: "Bird Sleep Schedule Calculator", slug: "bird-sleep-schedule-calculator", description: "Calculate optimal circadian roosting hours." },
    ],
    species: "backyard chickens",
    focus: "coop size, ventilation, predator-proofing, feed by life stage, grit/oyster shell, avian flu biosecurity, egg-binding warning signs (redirect to vet)",
    prompts: ["Minimum coop and run size per bird.", "Feed for laying hens.", "Predator-proofing my run.", "Signs of egg binding."],
  },
  {
    slug: "duck-care",
    name: "AI Duck Care Assistant",
    tagline: "Ducks, done well.",
    description: "Water access, feed, coop setup, and health basics for domestic ducks.",
    longDescription: `### Domestic Waterfowl Husbandry, Niacin Needs, & Foraging
Domestic ducks (such as Pekins, Rouens, Khaki Campbells, and Indian Runners) are hardy, cheerful waterfowl with distinct physiological differences from chickens. They require open water for bill and eye hygiene, specialized vitamin supplementation, and low-level ground housing.

#### 1. Mandatory Dietary Niacin (Vitamin B3)
Ducklings grow at an astonishing rate during their first 8 weeks. Standard chick starter feeds are formulated for chickens and **lack sufficient niacin for waterfowl**.
- **Niacin Deficiency:** Causes crippling leg deformities, bowed joints, and inability to walk.
- **Supplementation:** Add brewer's yeast (1 tablespoon per cup of feed) or pure veterinary niacin to drinking water (100–150 mg per gallon).

#### 2. Water Access for Eye & Bill Health
While ducks do not strictly need a full pond to survive, they **must have water deep enough to submerge their entire head and eyes daily**. Ducks lack tear ducts in the same manner as mammals and use water to clean their nares (nostrils) and flush debris from their eyes to prevent blindness.

#### 3. Ground Level Housing & Bumblefoot Prevention
Unlike chickens, heavy domestic ducks cannot roost on high perches and sleep on ground-level deep straw bedding. Their flat foot webbings are vulnerable to *bumblefoot* (ulcerative pododermatitis) when walking over rough gravel or wire.`,
    keyFeatures: [
      "Waterfowl niacin (Vitamin B3) dosage for duckling leg development",
      "Head-submersion water station design to prevent crusty eye infections",
      "Ground-level predator-proof housing and deep clean straw bedding",
      "Wet coop moisture management and bumblefoot footbed treatment",
    ],
    faqs: [
      { q: "Why is niacin (Vitamin B3) critical for ducklings?", a: "Ducklings grow much faster than chicks and require higher niacin levels to build strong leg bones and tendons. Deficiency causes bowed legs, slipped tendons, and permanent lameness." },
      { q: "Do ducks need a swimming pond to stay healthy?", a: "Ducks do not need a pond, but they must have a water container deep enough to submerge their entire head and bill to clean their nares and eyes daily." },
      { q: "Can ducks eat standard chicken feed?", a: "Ducks can eat unmedicated chicken feed if supplemented with brewer's yeast for extra niacin. Never feed medicated chick starter containing Amprolium to waterfowl." },
      { q: "How do duck housing requirements differ from chickens?", a: "Ducks do not roost on high perches. They sleep on clean straw bedding at ground level and require wider, ramp-free doorways due to their heavy, wide bodies." },
      { q: "What is bumblefoot in ducks and how is it prevented?", a: "Bumblefoot is a bacterial footpad infection caused by cuts from rough ground or wire. Prevent it by providing soft straw bedding, smooth ground, and clean swimming water." },
    ],
    relatedTools: [
      { title: "Chicken Nesting Box Count", slug: "chicken-nesting-box-count", description: "Size ground nesting boxes for waterfowl." },
      { title: "Bird Seed Portion Calculator", slug: "bird-seed-portion-calculator", description: "Balance waterfowl grains and mineral rations." },
    ],
    species: "domestic ducks",
    focus: "water for bathing and eating, waterfowl-appropriate feed and niacin, predator-proofing, wet coop hazards, bumblefoot warning signs (redirect to vet)",
    prompts: ["Do ducks need a pond?", "Niacin requirements for ducklings.", "Coop setup for ducks vs chickens.", "Signs of bumblefoot."],
  },
];

const speciesAssistants: AiAssistant[] = SPECIES_AI.map((s) => ({
  slug: s.slug,
  name: s.name,
  tagline: s.tagline,
  description: s.description,
  longDescription: s.longDescription,
  keyFeatures: s.keyFeatures,
  faqs: s.faqs,
  relatedTools: s.relatedTools,
  icon: HeartPulse,
  accent: "primary",
  showMedicalDisclaimer: true,
  systemPrompt: `${BASE_RULES}
You are ${s.name}, a warm, knowledgeable helper focused on ${s.species}. Your expertise: ${s.focus}. Ask clarifying questions (age, weight, environment, diet) when helpful. Never diagnose disease — for any concerning symptom, urge the user to contact a licensed veterinarian promptly. End medical or safety-related answers with a brief reminder to consult a vet.`,
  suggestedPrompts: s.prompts,
}));

AI_ASSISTANTS.push(...speciesAssistants);

export function getAssistant(slug: string): AiAssistant | undefined {
  return AI_ASSISTANTS.find((a) => a.slug === slug);
}

// icons re-export helper for hub
export const _iconMap = { Bird, Bone, Cat, Dog, HeartPulse, Plane, Salad, Scissors, Sparkles, Stethoscope };

