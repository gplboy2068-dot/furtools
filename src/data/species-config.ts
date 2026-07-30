// Central config driving the multi-pet ecosystem.
// Each species reuses the shared dashboard (timeline, weight, vet visits,
// medicines, expenses, documents, reminders, AI) and layers species-specific
// fields stored in pets.species_data (JSONB).

export type SpeciesSlug =
  | "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "guinea-pig"
  | "ferret" | "turtle" | "snake" | "lizard" | "horse" | "goat" | "sheep"
  | "chicken" | "duck";

export type FieldType = "text" | "number" | "select" | "textarea" | "date" | "checkbox";

export interface SpeciesField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  unit?: string;
  placeholder?: string;
  help?: string;
}

export interface SpeciesConfig {
  slug: SpeciesSlug;
  singular: string;
  plural: string;
  icon: string;         // lucide name
  color: string;
  aiSlug: string;       // ai assistant route slug
  aiName: string;
  weightUnit: "lbs" | "kg" | "g";
  showsBmi: boolean;
  showsGrooming: boolean;
  showsDeworming: boolean;
  showsVaccinations: boolean;
  showsAllergies: boolean;
  showsTravel: boolean;
  extraTabs?: string[]; // labels for species-specific extras (informational)
  fields: SpeciesField[];
}

const common = {
  weightUnit: "lbs" as const,
  showsBmi: true, showsGrooming: true, showsDeworming: true,
  showsVaccinations: true, showsAllergies: true, showsTravel: true,
};

export const SPECIES_CONFIG: Record<SpeciesSlug, SpeciesConfig> = {
  "dog": {
    slug: "dog", singular: "Dog", plural: "Dogs", icon: "Dog", color: "terracotta",
    aiSlug: "dog-training", aiName: "AI Dog Care Assistant",
    ...common,
    fields: [
      { key: "energy_level", label: "Energy level", type: "select", options: ["Low","Moderate","High","Working"] },
      { key: "coat_type", label: "Coat type", type: "select", options: ["Short","Medium","Long","Double","Curly","Hairless"] },
      { key: "training_level", label: "Training level", type: "select", options: ["None","Basic","Intermediate","Advanced"] },
    ],
  },
  "cat": {
    slug: "cat", singular: "Cat", plural: "Cats", icon: "Cat", color: "amber",
    aiSlug: "cat-training", aiName: "AI Cat Care Assistant",
    ...common,
    fields: [
      { key: "indoor_outdoor", label: "Indoor / Outdoor", type: "select", options: ["Indoor","Outdoor","Both"] },
      { key: "coat_type", label: "Coat type", type: "select", options: ["Short","Medium","Long","Hairless"] },
      { key: "litter_type", label: "Litter type", type: "text" },
    ],
  },
  "bird": {
    slug: "bird", singular: "Bird", plural: "Birds", icon: "Bird", color: "sky",
    aiSlug: "bird-care", aiName: "AI Bird Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false, showsDeworming: true,
    extraTabs: ["Egg Log","Molting Log"],
    fields: [
      { key: "wing_span", label: "Wing span", type: "number", unit: "cm" },
      { key: "ring_number", label: "Ring / band number", type: "text" },
      { key: "flying_ability", label: "Flying ability", type: "select", options: ["Full flight","Clipped","Non-flying"] },
      { key: "cage_size", label: "Cage size (L×W×H cm)", type: "text" },
      { key: "diet_type", label: "Diet type", type: "select", options: ["Pellet","Seed","Fruit/veg","Mixed"] },
      { key: "favorite_foods", label: "Favorite foods", type: "textarea" },
    ],
  },
  "rabbit": {
    slug: "rabbit", singular: "Rabbit", plural: "Rabbits", icon: "Rabbit", color: "rose",
    aiSlug: "rabbit-care", aiName: "AI Rabbit Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false,
    fields: [
      { key: "indoor_outdoor", label: "Indoor / Outdoor", type: "select", options: ["Indoor","Outdoor","Both"] },
      { key: "hay_type", label: "Primary hay", type: "select", options: ["Timothy","Orchard","Meadow","Alfalfa"] },
      { key: "hay_intake_g", label: "Hay per day", type: "number", unit: "g" },
      { key: "dental_check", label: "Last dental check", type: "date" },
    ],
  },
  "fish": {
    slug: "fish", singular: "Fish", plural: "Fish", icon: "Fish", color: "sky",
    aiSlug: "fish-care", aiName: "AI Aquarium Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false,
    showsDeworming: false, showsVaccinations: false, showsAllergies: false, showsTravel: false,
    extraTabs: ["Water Log","Tank Maintenance"],
    fields: [
      { key: "water_type", label: "Water type", type: "select", options: ["Freshwater","Saltwater","Brackish"] },
      { key: "tank_size_l", label: "Tank size", type: "number", unit: "L" },
      { key: "temperature_c", label: "Temperature", type: "number", unit: "°C" },
      { key: "ph", label: "pH", type: "number" },
      { key: "ammonia_ppm", label: "Ammonia", type: "number", unit: "ppm" },
      { key: "nitrite_ppm", label: "Nitrite", type: "number", unit: "ppm" },
      { key: "nitrate_ppm", label: "Nitrate", type: "number", unit: "ppm" },
      { key: "last_water_change", label: "Last water change", type: "date" },
    ],
  },
  "hamster": {
    slug: "hamster", singular: "Hamster", plural: "Hamsters", icon: "Squirrel", color: "sage",
    aiSlug: "hamster-care", aiName: "AI Hamster Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false, showsTravel: false,
    fields: [
      { key: "sub_species", label: "Species", type: "select", options: ["Syrian","Dwarf Campbell","Winter White","Roborovski","Chinese"] },
      { key: "cage_size", label: "Cage size (L×W cm)", type: "text" },
      { key: "wheel_diameter_cm", label: "Wheel diameter", type: "number", unit: "cm" },
      { key: "bedding_type", label: "Bedding", type: "text" },
    ],
  },
  "guinea-pig": {
    slug: "guinea-pig", singular: "Guinea Pig", plural: "Guinea Pigs", icon: "PawPrint", color: "amber",
    aiSlug: "guinea-pig-care", aiName: "AI Guinea Pig Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false,
    fields: [
      { key: "vitamin_c_mg", label: "Vitamin C dose", type: "number", unit: "mg/day" },
      { key: "cage_size", label: "Cage size (L×W cm)", type: "text" },
      { key: "hay_type", label: "Primary hay", type: "select", options: ["Timothy","Orchard","Meadow"] },
      { key: "companions", label: "Companions", type: "number" },
    ],
  },
  "ferret": {
    slug: "ferret", singular: "Ferret", plural: "Ferrets", icon: "PawPrint", color: "violet",
    aiSlug: "ferret-care", aiName: "AI Ferret Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false,
    fields: [
      { key: "descented", label: "Descented", type: "checkbox" },
      { key: "diet_type", label: "Diet type", type: "select", options: ["Raw","Kibble","Mixed"] },
    ],
  },
  "turtle": {
    slug: "turtle", singular: "Turtle", plural: "Turtles", icon: "PawPrint", color: "sage",
    aiSlug: "turtle-care", aiName: "AI Turtle Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false, showsDeworming: false,
    showsVaccinations: false, showsTravel: false,
    fields: [
      { key: "type", label: "Type", type: "select", options: ["Aquatic","Semi-aquatic","Terrestrial"] },
      { key: "shell_length_cm", label: "Shell length", type: "number", unit: "cm" },
      { key: "tank_size_l", label: "Tank size", type: "number", unit: "L" },
      { key: "uv_lighting", label: "UVB bulb", type: "text" },
      { key: "water_temperature_c", label: "Water temp", type: "number", unit: "°C" },
      { key: "basking_temperature_c", label: "Basking temp", type: "number", unit: "°C" },
    ],
  },
  "snake": {
    slug: "snake", singular: "Snake", plural: "Snakes", icon: "PawPrint", color: "lime",
    aiSlug: "snake-care", aiName: "AI Snake Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false, showsDeworming: false,
    showsVaccinations: false, showsAllergies: false, showsTravel: false,
    extraTabs: ["Shed Log","Feeding Schedule"],
    fields: [
      { key: "sub_species", label: "Species", type: "text" },
      { key: "enclosure_size", label: "Enclosure size (L×W×H cm)", type: "text" },
      { key: "hot_side_c", label: "Hot side temp", type: "number", unit: "°C" },
      { key: "cool_side_c", label: "Cool side temp", type: "number", unit: "°C" },
      { key: "humidity_pct", label: "Humidity", type: "number", unit: "%" },
      { key: "feeding_interval_days", label: "Feeding interval", type: "number", unit: "days" },
      { key: "last_shed", label: "Last shed", type: "date" },
    ],
  },
  "lizard": {
    slug: "lizard", singular: "Lizard", plural: "Lizards", icon: "PawPrint", color: "lime",
    aiSlug: "lizard-care", aiName: "AI Lizard Care Assistant",
    ...common, weightUnit: "g", showsBmi: false, showsGrooming: false, showsDeworming: false,
    showsVaccinations: false, showsTravel: false,
    fields: [
      { key: "sub_species", label: "Species", type: "text" },
      { key: "enclosure_size", label: "Enclosure size (L×W×H cm)", type: "text" },
      { key: "basking_temperature_c", label: "Basking temp", type: "number", unit: "°C" },
      { key: "cool_side_c", label: "Cool side temp", type: "number", unit: "°C" },
      { key: "humidity_pct", label: "Humidity", type: "number", unit: "%" },
      { key: "uv_lighting", label: "UVB bulb", type: "text" },
      { key: "last_shed", label: "Last shed", type: "date" },
    ],
  },
  "horse": {
    slug: "horse", singular: "Horse", plural: "Horses", icon: "PawPrint", color: "violet",
    aiSlug: "horse-care", aiName: "AI Horse Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false,
    extraTabs: ["Shoeing","Competitions"],
    fields: [
      { key: "discipline", label: "Discipline", type: "select", options: ["Dressage","Jumping","Eventing","Western","Trail","Racing","Companion","Other"] },
      { key: "stable_name", label: "Stable / boarding", type: "text" },
      { key: "trainer_name", label: "Trainer", type: "text" },
      { key: "last_farrier_visit", label: "Last farrier visit", type: "date" },
      { key: "farrier_interval_weeks", label: "Farrier interval", type: "number", unit: "weeks" },
      { key: "last_dental", label: "Last dental", type: "date" },
      { key: "insurance_policy", label: "Insurance policy #", type: "text" },
    ],
  },
  "goat": {
    slug: "goat", singular: "Goat", plural: "Goats", icon: "PawPrint", color: "sage",
    aiSlug: "goat-care", aiName: "AI Goat Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false, showsGrooming: false,
    extraTabs: ["Milk Records","Breeding"],
    fields: [
      { key: "purpose", label: "Purpose", type: "select", options: ["Dairy","Meat","Fiber","Pet"] },
      { key: "milking", label: "Currently milking", type: "checkbox" },
      { key: "daily_milk_l", label: "Daily milk", type: "number", unit: "L" },
    ],
  },
  "sheep": {
    slug: "sheep", singular: "Sheep", plural: "Sheep", icon: "PawPrint", color: "sage",
    aiSlug: "sheep-care", aiName: "AI Sheep Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false, showsGrooming: false,
    extraTabs: ["Wool Records"],
    fields: [
      { key: "purpose", label: "Purpose", type: "select", options: ["Wool","Meat","Dairy","Pet"] },
      { key: "last_shearing", label: "Last shearing", type: "date" },
      { key: "fleece_weight_kg", label: "Last fleece weight", type: "number", unit: "kg" },
    ],
  },
  "chicken": {
    slug: "chicken", singular: "Chicken", plural: "Chickens", icon: "PawPrint", color: "amber",
    aiSlug: "chicken-care", aiName: "AI Chicken Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false, showsGrooming: false, showsTravel: false,
    extraTabs: ["Egg Production"],
    fields: [
      { key: "purpose", label: "Purpose", type: "select", options: ["Layer","Meat","Dual","Ornamental"] },
      { key: "eggs_per_week", label: "Eggs per week", type: "number" },
      { key: "coop_size", label: "Coop size (m²)", type: "number" },
    ],
  },
  "duck": {
    slug: "duck", singular: "Duck", plural: "Ducks", icon: "PawPrint", color: "sky",
    aiSlug: "duck-care", aiName: "AI Duck Care Assistant",
    ...common, weightUnit: "kg", showsBmi: false, showsGrooming: false, showsTravel: false,
    extraTabs: ["Egg Production"],
    fields: [
      { key: "purpose", label: "Purpose", type: "select", options: ["Layer","Meat","Dual","Pet"] },
      { key: "eggs_per_week", label: "Eggs per week", type: "number" },
      { key: "water_access", label: "Water access", type: "select", options: ["Pond","Pool","Basin","None"] },
    ],
  },
};

export const SPECIES_LIST: SpeciesConfig[] = Object.values(SPECIES_CONFIG);

export function getSpeciesConfig(slug: string): SpeciesConfig | undefined {
  return SPECIES_CONFIG[slug as SpeciesSlug];
}

export const SPECIES_SELECT_OPTIONS: [string, string][] =
  SPECIES_LIST.map((s) => [s.slug, s.singular]);
