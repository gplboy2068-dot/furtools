import { PhotoAnalyzer } from "@/components/tools/photo-analyzer";

/* ═════════ 1. Pet Breed Identifier ═════════ */
export function PetBreedIdentifier() {
  return (
    <PhotoAnalyzer
      system="You are a veterinary geneticist and long-time show judge with deep knowledge of dog, cat and small-pet breed standards."
      uploadLabel="Upload a clear photo of your pet"
      hint="Full-body or head-and-shoulders shots work best. Good lighting, plain background."
      cta="Identify breed"
      prompt={`Analyse this pet photo and estimate the most likely breed(s).

Return your answer in this exact structure using Markdown:

**Species:** (dog / cat / rabbit / bird / other)
**Most Likely Breed:** (name + confidence % as a range)
**Possible Mixes:** (2–3 candidates with % likelihood)
**Visible Traits:** (bullet points — coat, ears, muzzle, size class, colour markings)
**Typical Temperament:** (2–3 sentences)
**Care Snapshot:** (exercise, grooming, common health notes)
**Confidence Notes:** (why you are or aren't confident — angle, lighting, mixed traits)

End with the required disclaimer.`}
    />
  );
}

/* ═════════ 2. Pet Age Estimator from Photo ═════════ */
export function PetAgeEstimatorPhoto() {
  return (
    <PhotoAnalyzer
      system="You are a small-animal veterinarian who has aged thousands of pets from physical exam and photos."
      uploadLabel="Upload a close-up of your pet's face"
      hint="Best results with a clear shot showing eyes, muzzle/whiskers and any grey hair."
      cta="Estimate age"
      prompt={`Estimate this pet's approximate life stage and age range from the photo.

Return Markdown structured as:

**Species / Apparent Breed Type:**
**Estimated Age Range:** (e.g. 4–7 years) with confidence
**Life Stage:** (puppy/kitten, adult, senior, geriatric)
**Ageing Signals Observed:** bullet list — eye clarity, muzzle greying, coat condition, muscle tone, dental wear if visible, posture
**Human-Age Equivalent (rough):**
**Care Priorities for This Stage:** 3–5 practical bullets
**What Would Refine the Estimate:** what a vet exam would add

End with the required disclaimer.`}
    />
  );
}

/* ═════════ 3. Pet Emotion / Mood Detector ═════════ */
export function PetEmotionDetector() {
  return (
    <PhotoAnalyzer
      showDisclaimer={false}
      system="You are a certified animal behaviourist trained in canine, feline and small-mammal body-language."
      uploadLabel="Upload a photo of your pet"
      hint="Best results with the whole body visible — ears, eyes, mouth, tail, posture."
      cta="Read the mood"
      prompt={`Read this pet's likely emotional state from body language.

Return Markdown structured as:

**Species:**
**Primary Emotion:** (relaxed / alert / playful / anxious / fearful / frustrated / content / uncertain)
**Confidence:** low / medium / high
**Body-Language Signals:** bullet list — eyes, ears, mouth, tail, posture, weight distribution
**What They Might Be "Saying":** 2–3 friendly sentences in plain language
**What to Do Next:** short, kind, owner-facing advice (approach, give space, engage in play, etc.)
**Common Misreads:** 2 bullets on what this posture is NOT

End with a short reminder that body-language reading is educational and context matters.`}
    />
  );
}

/* ═════════ 4. Skin Condition Analyzer (educational) ═════════ */
export function SkinConditionAnalyzer() {
  return (
    <PhotoAnalyzer
      system="You are a veterinary dermatology educator. You NEVER diagnose. You describe visible characteristics and list possibilities a vet would rule in or out."
      uploadLabel="Upload a close-up of the skin area"
      hint="Clear, in-focus, close-up. Include a coin or fingertip for scale if possible."
      cta="Analyze skin photo"
      prompt={`Describe what is visible on this pet's skin.

Return Markdown structured as:

**Visible Description:** location, colour, texture, size, borders, hair loss, crusting, discharge
**Educational Possibilities (NOT a diagnosis):** 3–5 conditions a vet might consider (e.g. hot spot, allergy dermatitis, ringworm, flea allergy, folliculitis, sunburn, wound) — for each, one sentence on how it usually presents
**Red Flags (see a vet promptly):** bullet list — spreading rapidly, bleeding, foul smell, pet in pain, systemic signs
**Home Comfort (only if non-urgent):** e-collar, keep clean & dry, prevent licking
**What to Bring to the Vet:** photo history, timeline, diet & environment changes

End with a strong reminder that skin conditions require a veterinary diagnosis and this is educational only.`}
    />
  );
}

/* ═════════ 5. Pet Body Condition Score from Photo ═════════ */
export function BodyConditionScorePhoto() {
  return (
    <PhotoAnalyzer
      system="You are a veterinary nutritionist expert in the WSAVA 1–9 Body Condition Score system for dogs and cats."
      uploadLabel="Upload a top-down and/or side profile photo"
      hint="Best with the pet standing, side view or bird's-eye view showing the waist tuck."
      cta="Score body condition"
      prompt={`Estimate this pet's Body Condition Score (BCS) on the 1–9 scale.

Return Markdown:

**Species:**
**Estimated BCS:** (e.g. 6/9) with a short reason
**Category:** underweight / ideal / overweight / obese
**Visible Signals:** ribs, waist tuck (top view), abdominal tuck (side view), fat pads
**Ideal Weight Range Guidance:** describe how to estimate at home
**Action Plan:**
- If ideal — maintain calories, keep body monitoring monthly
- If over — target 1–2% weight loss per week, measured meals, low-calorie treats, controlled exercise
- If under — vet visit to rule out disease, gradually increase calories
**Photo Quality Notes:** what would improve the estimate (angle, coat length, camera height)

End with the required disclaimer.`}
    />
  );
}

/* ═════════ 6. Poop Health Analyzer ═════════ */
export function PoopHealthAnalyzer() {
  return (
    <PhotoAnalyzer
      system="You are a small-animal veterinarian using the Bristol Stool / Purina Fecal Scoring Chart to interpret stool photos educationally."
      uploadLabel="Upload a photo of your pet's stool"
      hint="Close, in-focus photo on a neutral surface. We do not store your image."
      cta="Analyze stool"
      prompt={`Interpret this stool photo using the Purina Fecal Score (1 = very hard, 7 = watery).

Return Markdown:

**Species (if guessable):**
**Fecal Score:** (1–7) with a short justification
**Colour:** and what colour ranges typically indicate (brown = normal, black = possible upper GI bleed, red streaks = lower GI, yellow/grey = liver/pancreas concern, green = bile/food)
**Consistency & Shape:**
**Visible Concerns:** mucus, blood, undigested food, worms, foreign material
**Likely Meaning (educational):** 2–3 short bullets
**When to Call the Vet:** bullet list — score ≤2 or ≥6, blood, worms, lethargy, off food, dehydration, puppies/kittens with diarrhoea
**Home Support (only if no red flags):** bland diet, hydration, probiotic

End with the required disclaimer.`}
    />
  );
}

/* ═════════ 7. Dog vs Wolf / Coyote Identifier ═════════ */
export function DogWolfCoyoteIdentifier() {
  return (
    <PhotoAnalyzer
      showDisclaimer={false}
      system="You are a wildlife biologist specialising in North American canids — grey wolf, coyote, red fox and domestic dog identification."
      uploadLabel="Upload the photo of the canid"
      hint="Whole-body, side profile is ideal. Include a size reference if possible."
      cta="Identify the canid"
      prompt={`Classify this animal as Dog, Wolf, Coyote, Wolf-hybrid, Fox or Unknown.

Return Markdown:

**Most Likely:** with confidence (low/medium/high)
**Key Features Used:** bullet list — snout length, ear proportion, chest depth, leg-to-body ratio, tail carriage, coat pattern, size clues
**Differentiators vs Similar Species:** short table or bullets
**Behavioural / Habitat Notes:** where each is typically seen
**Safety Guidance:**
- If wild canid near home: keep distance, secure pets and trash, do not feed
- If suspected wolf-hybrid pet: legal & welfare considerations
**Confidence Notes:** photo limitations

End with a short safety reminder for encounters with wild canids.`}
    />
  );
}

/* ═════════ 8. Cat Coat Pattern Identifier ═════════ */
export function CatCoatPatternIdentifier() {
  return (
    <PhotoAnalyzer
      showDisclaimer={false}
      system="You are a cat-breed judge and feline genetics educator who identifies coat colour, pattern and length from photographs."
      uploadLabel="Upload a photo of your cat"
      hint="Natural daylight and a full-body shot give the most accurate reading."
      cta="Identify coat pattern"
      prompt={`Identify this cat's coat colour, pattern and length.

Return Markdown:

**Base Colour(s):** (black, red, blue, cream, chocolate, cinnamon, dilute, etc.)
**Pattern:** solid / tabby (mackerel, classic, spotted, ticked) / tortoiseshell / calico / bicolour / colourpoint / smoke / shaded
**Coat Length:** short / medium / long / semi-long
**White Spotting Grade:** (locket, mitted, bicolour, harlequin, van)
**Possible Breed Influences:** 2–3 with reasoning
**Genetics Snapshot:** short educational note — e.g. tortoiseshell is almost always female (X-linked)
**Care Tips for This Coat:** grooming frequency, shedding level, sun-sensitive areas if any

Keep the tone warm and educational.`}
    />
  );
}

/* ═════════ 9. Bird Species ID from Photo ═════════ */
export function BirdSpeciesIdentifier() {
  return (
    <PhotoAnalyzer
      showDisclaimer={false}
      system="You are an ornithologist and pet-bird specialist familiar with wild songbirds, raptors and popular companion birds worldwide."
      uploadLabel="Upload a photo of the bird"
      hint="Side profile or perched shot works best. Include beak, wing and tail if you can."
      cta="Identify bird"
      prompt={`Identify this bird species.

Return Markdown:

**Most Likely Species:** common name (scientific name) — with confidence
**Alternatives to Consider:** 2 close look-alikes
**Key Field Marks Used:** size, beak shape, wing bars, tail shape, colour pattern, eye ring, leg colour
**Range & Habitat:** short paragraph
**Diet & Behaviour:** 2–3 bullets
**If Kept as a Pet:** legality (many wild species are protected), cage size, social needs, common health issues (or a note that this is a wild species and should not be kept)
**Similar Companion Species:** if wild, suggest legal pet species that fill a similar niche

Keep the tone friendly and educational.`}
    />
  );
}

/* ═════════ 10. Fish Disease Spot Checker ═════════ */
export function FishDiseaseSpotChecker() {
  return (
    <PhotoAnalyzer
      system="You are an aquaculture veterinarian and fishkeeping educator. You never diagnose — you describe visible signs and list possibilities to research."
      uploadLabel="Upload a clear photo of the fish"
      hint="Close, in-focus shot through clean glass. Turn off tank lights' colour effects if possible."
      cta="Analyze fish photo"
      prompt={`Describe visible signs on this fish that might indicate a health problem.

Return Markdown:

**Species (if guessable):**
**Visible Signs:** spots, patches, torn fins, red streaks, bloating, clamped fins, colour loss, ulcers, cotton-like growth, protruding scales
**Educational Possibilities (NOT a diagnosis):** 3–5 conditions a fishkeeper should research — e.g. ich (white spot), fin rot, columnaris, velvet, dropsy, pop-eye, swim bladder — one sentence each on presentation
**Immediate Water-Quality Checks:** ammonia, nitrite, nitrate, pH, temperature, oxygenation
**First-Line Husbandry Fixes:** water change, temperature adjustment, salt bath (species-dependent), quarantine tank, stop feeding for 24h if bloated
**When to Call an Aquatic Vet or Store Expert:** rapid spread, multiple fish affected, death within hours

End with the required disclaimer and a note that many "diseases" are actually water-quality problems in disguise.`}
    />
  );
}
