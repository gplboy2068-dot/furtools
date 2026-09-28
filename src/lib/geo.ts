/**
 * Generative Engine Optimization (GEO) & AI Search Direct Answer Engine
 *
 * Designed for Google AI Overviews, Perplexity, Bing Copilot, and ChatGPT Search.
 * Provides high-density, factual, 38–62 word answer definitions for all 233 pet tools,
 * clinical toxicity/dosage registry, and rich SoftwareApplication schema.
 */

import type { Tool } from "@/data/tools";
import { toAbsoluteUrl } from "@/lib/seo";

export const DIRECT_ANSWERS_REGISTRY: Record<string, string> = {
  "dog-chocolate-toxicity-calculator":
    "The Dog Chocolate Toxicity Calculator evaluates methylxanthine toxicity (theobromine and caffeine) based on canine body weight and chocolate type. It provides immediate risk levels for milk, dark, baker's chocolate, and cocoa powder, alerting pet parents when emergency veterinary decontamination or fluid therapy is necessary.",

  "canine-fluid-therapy-calculator":
    "The Canine Fluid Therapy Calculator computes veterinary intravenous fluid requirements using AAHA/WSAVA clinical guidelines. It factors in dehydration deficits, maintenance fluid needs, and ongoing losses, providing exact daily volumes, hourly infusion pump rates, and gravity drip speeds for canine medical and surgical care.",

  "cat-age-calculator":
    "The Cat Age Calculator converts feline chronological age into equivalent human biological years using veterinary epigenetic aging curves. It models rapid kitten development—evaluating year one as 15 human years and year two as 24—followed by steady adult aging of approximately four human years per calendar year.",

  "dog-age-calculator":
    "The Dog Age Calculator translates canine years into human years using veterinary epigenetic models based on weight and adult breed size. Because giant breeds experience accelerated biological senescence compared to small dogs, it provides precise life-stage milestones across small, medium, large, and giant breeds.",

  "dog-benadryl-dose-calculator":
    "The Dog Benadryl Dose Calculator computes safe diphenhydramine dosages for dogs based on body weight. Using standard veterinary protocols (1 mg per pound or 2-4 mg per kg), it outputs exact milligram targets and liquid or tablet portions for allergies, insect stings, and travel anxiety.",

  "dog-food-calculator":
    "The Dog Food Calculator calculates optimal daily caloric needs and portion sizes for dogs using veterinary Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) equations. It customizes daily rations according to body weight, body condition score, life stage, and physical activity level.",

  "cat-calorie-calculator":
    "The Cat Calorie Calculator establishes daily caloric targets for cats using clinical Resting Energy Requirement formulas (70 × body weight in kg^0.75) and life-stage factors. It determines accurate feeding portions for indoor cats, weight management, neutered adults, and growing kittens.",

  "dog-water-calculator":
    "The Dog Water Calculator determines baseline daily hydration requirements for canines based on weight, diet composition (kibble vs. canned), temperature, and exercise. It helps pet owners identify normal fluid targets and spot abnormal water intake associated with diabetes or renal disease.",

  "cat-water-calculator":
    "The Cat Water Calculator calculates healthy daily water intake for felines based on body weight and moisture content of wet versus dry foods. It promotes urinary tract and kidney health by identifying hydration deficits and encouraging appropriate water consumption.",

  "aquarium-volume-calculator":
    "The Aquarium Volume Calculator computes true usable water capacity for rectangular, bowfront, cylinder, and custom aquatic tanks. It accounts for glass thickness, substrate depth, and decorative displacement, ensuring exact water conditioner dosing and safe livestock bioload stocking.",

  "aquarium-nitrate-calculator":
    "The Aquarium Nitrate Calculator estimates nitrate accumulation rates in freshwater and saltwater systems based on tank volume, fish bioload, feeding volume, and plant uptake. It generates customized water change volumes and schedules to prevent toxic algae blooms and fish stress.",

  "reptile-uvb-schedule":
    "The Reptile UVB Schedule calculates ultraviolet light requirements and Ferguson Zone photoperiod targets for captive reptiles. It determines appropriate bulb wattages, safe basking distances, and seasonal lighting cycles tailored to desert, tropical, and crepuscular reptile species.",

  "reptile-uvb-distance-guide":
    "The Reptile UVB Distance Guide determines optimal lamp mounting distances and Ferguson Zone UV index levels for terrariums. It ensures reptiles receive necessary Vitamin D3 synthesis radiation without incurring harmful photokeratitis or thermal burn risks from improper bulb placement.",

  "dog-pregnancy-calculator":
    "The Dog Pregnancy Calculator estimates canine whelping due dates and gestational development milestones based on breeding dates. It provides a complete day-by-day fetal growth timeline, ultrasound and radiograph detection windows, and essential whelping prep milestones for dog owners and breeders.",

  "cat-pregnancy-calculator":
    "The Cat Pregnancy Calculator computes expected queening dates and embryonic developmental milestones based on feline mating dates. It outlines the 63-to-67 day gestation period, indicating critical stages for veterinary palpation, fetal skeletal calcification, and nesting box preparation.",

  "pet-poison-lookup":
    "The Pet Poison Lookup is an emergency toxicological guide indexing toxic foods, human medications, plants, and household chemicals dangerous to pets. It provides rapid toxicity ratings, onset symptoms, and immediate first-aid protocols prior to reaching an emergency veterinary clinic.",

  "fish-medication-dose":
    "The Fish Medication Dose Calculator determines accurate pharmaceutical treatments for ornamental fish based on true tank volume and water chemistry. It prevents lethal accidental overdoses when administering antibiotics, antiparasitics, and antifungal water treatments in freshwater and marine aquariums.",

  "dog-calorie-calculator":
    "The Dog Calorie Calculator calculates exact daily energy requirements for canines using clinical resting and maintenance metabolic equations. It adjusts calorie targets for neuter status, working activity, weight loss protocols, and life stages to prevent canine obesity and nutritional deficiencies.",

  "horse-age-calculator":
    "The Horse Age Calculator converts equine age into human equivalent years based on dental wear patterns, physical maturity, and life-stage milestones. It highlights senior equine transitional care, nutritional requirements, and work capacity across every stage of a horse's lifespan.",

  "rabbit-age-calculator":
    "The Rabbit Age Calculator translates lagomorph years into human biological age based on veterinary lifespan markers. It delineates infant, adolescent, adult, and senior life stages, guiding owners on age-appropriate diet transitions from alfalfa to timothy hay and preventative veterinary care."
};

function getConciseCoreSummary(desc: string): string {
  const firstSentence = desc.split(/(?<=[.?!])\s+/)[0] || desc;
  const words = firstSentence.split(/\s+/);
  if (words.length > 25) {
    return words.slice(0, 24).join(" ").replace(/[,;:]$/, "") + "...";
  }
  return firstSentence.replace(/[.?!]+$/, "");
}

/**
 * Generates an authoritative 38–62 word direct answer snippet for any tool.
 */
export function getDirectAnswer(slug: string, tool?: Partial<Tool>): string {
  if (DIRECT_ANSWERS_REGISTRY[slug]) {
    return DIRECT_ANSWERS_REGISTRY[slug];
  }

  if (!tool || !tool.name || !tool.description) {
    return "This interactive pet calculator provides evidence-based biological formulas and species-specific parameters for pet owners and animal care professionals.";
  }

  const catMap: Record<string, string> = {
    dogs: "canine health and nutrition",
    cats: "feline health and care",
    birds: "avian care and husbandry",
    fish: "aquarium chemistry and aquatic management",
    "small-pets": "small animal care and husbandry",
    reptiles: "herpetological care and reptile habitat management",
    horses: "equine care and stable management",
    farm: "livestock management and homestead animal care",
    general: "pet wellness and veterinary health",
  };

  const domain = (tool.category && catMap[tool.category]) || "pet wellness and veterinary care";
  const core = getConciseCoreSummary(tool.description);
  const cleanCore = core.charAt(0).toLowerCase() + core.slice(1);

  return `The ${tool.name} is an interactive ${domain} tool created to ${cleanCore}. It applies validated species guidelines and mathematical models to provide immediate, scientifically referenced calculations for pet owners and animal care professionals.`;
}

/**
 * Builds an enhanced SoftwareApplication / WebApplication JSON-LD schema
 * enriched for Google AI Overviews and generative search features.
 */
export function buildEnhancedSoftwareSchema(options: {
  tool: {
    slug: string;
    name: string;
    description: string;
    category: string;
    keywords?: string[];
  };
  canonicalUrl: string;
  imageUrl?: string;
  directAnswer?: string;
}) {
  const { tool, canonicalUrl, imageUrl, directAnswer } = options;
  const description = directAnswer || getDirectAnswer(tool.slug, tool);

  const categoryMap: Record<string, string> = {
    dogs: "HealthApplication",
    cats: "HealthApplication",
    birds: "UtilitiesApplication",
    fish: "UtilitiesApplication",
    "small-pets": "HealthApplication",
    reptiles: "UtilitiesApplication",
    horses: "HealthApplication",
    farm: "UtilitiesApplication",
    general: "HealthApplication",
  };

  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: tool.name,
    description,
    url: toAbsoluteUrl(canonicalUrl),
    applicationCategory: categoryMap[tool.category] || "HealthApplication",
    applicationSubCategory: "Veterinary & Pet Care Calculators",
    operatingSystem: "Web Browser, iOS, Android, macOS, Windows, Linux",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "2026.1",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    image: toAbsoluteUrl(imageUrl || "/og-image.png"),
    featureList: [
      "Instant veterinary and biological calculation",
      "Evidence-based clinical formulas and species models",
      "Interactive responsive inputs with real-time feedback",
      "100% free with zero registration or account required",
      "Client-side privacy — all calculations performed locally in browser",
    ],
    keywords: (tool.keywords || []).join(", "),
  };
}
