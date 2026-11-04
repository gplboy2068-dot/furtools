import { useTranslation } from "react-i18next";
import { PhotoAnalyzer } from "@/components/tools/photo-analyzer";
import { PetBodyConditionPhotoAnalyzer } from "@/components/tools/pet-body-condition-photo-analyzer";

/* ═════════ 1. Pet Breed Identifier ═════════ */
export function PetBreedIdentifier() {
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="pet-breed-identifier"
      system="You are a veterinary geneticist and long-time show judge with deep knowledge of dog, cat and small-pet breed standards."
      uploadLabel={t("pet-breed-identifier.ui.uploadLabel")}
      hint={t("pet-breed-identifier.ui.hint")}
      cta={t("pet-breed-identifier.ui.cta")}
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
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="pet-age-estimator-photo"
      system="You are a small-animal veterinarian who has aged thousands of pets from physical exam and photos."
      uploadLabel={t("pet-age-estimator-photo.ui.uploadLabel")}
      hint={t("pet-age-estimator-photo.ui.hint")}
      cta={t("pet-age-estimator-photo.ui.cta")}
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
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="pet-emotion-detector"
      showDisclaimer={false}
      system="You are a certified animal behaviourist trained in canine, feline and small-mammal body-language."
      uploadLabel={t("pet-emotion-detector.ui.uploadLabel")}
      hint={t("pet-emotion-detector.ui.hint")}
      cta={t("pet-emotion-detector.ui.cta")}
      prompt={`Read this pet's likely emotional state from body language in this photo.

Ground rules:
- Describe ONLY signals that are actually visible in this photo. If a body part is not visible (for example the tail is out of frame), write "not visible" for it — never guess its position or movement.
- A single still photo freezes one moment; say so when the read is uncertain.

Return Markdown structured as:

**Species:**
**Primary Emotion:** (relaxed / alert / playful / anxious / fearful / frustrated / content / uncertain)
**Confidence:** low / medium / high
**Body-Language Signals:** bullet list — eyes, ears, mouth, tail, posture, weight distribution (only what is visible; mark the rest "not visible")
**Signal Agreement:** do the visible signals point to one consistent emotion, or are they mixed/conflicting? One short line.
**What They Might Be "Saying":** 2–3 friendly sentences in plain language
**Safety First:** ONLY if fear, anxiety or aggression signals dominate — advise giving the pet space, not reaching for or cornering them, keeping children back, and consulting a certified behaviourist or vet if the behaviour recurs. Omit this section entirely for calm or happy reads.
**What to Do Next:** short, kind, owner-facing advice (approach, give space, engage in play, etc.)
**Common Misreads:** 2 bullets on what this posture is NOT

End with a short reminder that body-language reading is educational and context matters.`}
    />
  );
}

/* ═════════ 4. Skin Condition Analyzer (educational) ═════════ */
export function SkinConditionAnalyzer() {
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="skin-condition-analyzer"
      system="You are a veterinary dermatology educator. You NEVER diagnose. You describe visible characteristics and list possibilities a vet would rule in or out."
      uploadLabel={t("skin-condition-analyzer.ui.uploadLabel")}
      hint={t("skin-condition-analyzer.ui.hint")}
      cta={t("skin-condition-analyzer.ui.cta")}
      prompt={`Describe what is visible on this pet's skin. Describe only what the photo actually shows — never invent lesions, discharge or parasites that are not visible.

Return Markdown structured as:

**Photo Quality & Limits:** one line — is the area close and clear enough to assess? Note if a wider shot plus a close-up would help.
**Visible Description:** location and distribution (one spot vs widespread, one side vs both sides), colour, texture, size, borders, hair loss, crusting, scaling, discharge, and any signs of self-trauma (lick staining, scratch marks)
**Educational Possibilities (NOT a diagnosis):** 4–6 conditions a vet might consider, each with one sentence on how it usually presents and where on the body it typically appears. Always weigh parasitic and infectious causes alongside allergic ones when the picture fits — e.g. sarcoptic mange (mite; intensely itchy, ear edges, elbows, hocks, belly), demodicosis (mange mite; patchy hair loss, often face and paws), flea allergy dermatitis (tail base, lower back, hind legs), ringworm / dermatophytosis (circular patches, broken hairs), allergy dermatitis (environmental/food), bacterial folliculitis / pyoderma, Malassezia (yeast) dermatitis, hot spot (acute moist dermatitis), acral lick granuloma.
**Contagion & Household Note:** ONLY when a parasitic or fungal possibility is listed (mange, ringworm, fleas): note that these can spread to other pets, that sarcoptic mange and ringworm can cause temporary itching in people, and advise keeping the pet's bedding separate, washing hands after handling, and booking the vet promptly. Omit this section if no contagious possibility fits.
**Red Flags (see a vet promptly):** bullet list — spreading rapidly, bleeding or open sores, foul smell, pet in pain, intense itching that disturbs sleep, systemic signs (lethargy, off food, fever), or a puppy/kitten or elderly pet affected
**Home Comfort (only if non-urgent):** e-collar, keep clean & dry, prevent licking; do NOT suggest medicated shampoos, creams or any medication or doses
**What to Bring to the Vet:** photo history, timeline, itch level, diet & environment changes, flea-prevention history

End with a strong reminder that skin conditions require a veterinary diagnosis and this is educational only.`}
    />
  );
}

/* ═════════ 5. Pet Body Condition Score from Photo ═════════ */
export function BodyConditionScorePhoto() {
  return <PetBodyConditionPhotoAnalyzer />;
}

/* ═════════ 7. Dog vs Wolf / Coyote Identifier ═════════ */
export function DogWolfCoyoteIdentifier() {
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="dog-wolf-coyote-identifier"
      showDisclaimer={false}
      system="You are a wildlife biologist specialising in North American canids — grey wolf, coyote, red fox and domestic dog identification."
      uploadLabel={t("dog-wolf-coyote-identifier.ui.uploadLabel")}
      hint={t("dog-wolf-coyote-identifier.ui.hint")}
      cta={t("dog-wolf-coyote-identifier.ui.cta")}
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
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="cat-coat-pattern-identifier"
      showDisclaimer={false}
      system="You are a cat-breed judge and feline genetics educator who identifies coat colour, pattern and length from photographs."
      uploadLabel={t("cat-coat-pattern-identifier.ui.uploadLabel")}
      hint={t("cat-coat-pattern-identifier.ui.hint")}
      cta={t("cat-coat-pattern-identifier.ui.cta")}
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
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="bird-species-identifier"
      showDisclaimer={false}
      system="You are an ornithologist and pet-bird specialist familiar with wild songbirds, raptors and popular companion birds worldwide."
      uploadLabel={t("bird-species-identifier.ui.uploadLabel")}
      hint={t("bird-species-identifier.ui.hint")}
      cta={t("bird-species-identifier.ui.cta")}
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
  const { t } = useTranslation("tools");
  return (
    <PhotoAnalyzer
      slug="fish-disease-spot-checker"
      system="You are an aquaculture veterinarian and fishkeeping educator. You never diagnose — you describe visible signs and list possibilities to research."
      uploadLabel={t("fish-disease-spot-checker.ui.uploadLabel")}
      hint={t("fish-disease-spot-checker.ui.hint")}
      cta={t("fish-disease-spot-checker.ui.cta")}
      prompt={`Describe visible signs on this fish that might indicate a health problem.

Calibration rules — follow them strictly:
- Report a sign ONLY if it is clearly visible in this photo. Do not report borderline or imagined signs.
- Normal anatomy is NOT a sign: a goldfish's naturally prominent eyes, fancy-variety body shapes (round bodies, head growths / wen, long flowing fins), natural colour patterns, and reflections or glare through tank glass must not be reported as problems.
- If nothing abnormal is clearly visible, say so plainly — a healthy result is a valid and useful answer.

Return Markdown:

**Species (if guessable):**
**Photo Limits:** one line — glass glare, water distortion, only part of the fish visible, etc.
**Visible Signs:** only signs clearly visible (spots, patches, torn fins, red streaks, bloating, clamped fins, colour loss, ulcers, cotton-like growth, protruding scales). Label each sign "clearly visible" or "possible but uncertain". If there are none, state "No clear signs of disease visible in this photo."
**Overall Impression:** one of — no clear signs of disease / mild signs worth monitoring / clear signs needing prompt action
**Educational Possibilities (NOT a diagnosis):** ONLY conditions consistent with the signs actually reported — e.g. ich (white spot), fin rot, columnaris, velvet, dropsy, pop-eye, swim bladder — one sentence each on presentation. If no clear signs were found, replace this list with 2–3 early warning signs to watch for in the coming days instead of a disease list.
**Immediate Water-Quality Checks:** ammonia, nitrite, nitrate, pH, temperature, oxygenation
**First-Line Husbandry Fixes:** water change, temperature adjustment, salt bath (species-dependent), quarantine tank, stop feeding for 24h if bloated — list only fixes relevant to the signs reported; if the fish looks healthy, say no fixes are needed beyond routine maintenance
**When to Call an Aquatic Vet or Store Expert:** rapid spread, multiple fish affected, death within hours, or any clear sign worsening despite corrected water quality

End with the required disclaimer and a note that many "diseases" are actually water-quality problems in disguise.`}
    />
  );
}
