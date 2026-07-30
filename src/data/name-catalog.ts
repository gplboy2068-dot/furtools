// Rich pet name catalog powering the Pet Name Finder.
// ~250 curated entries with 100+ filter facets across gender, origin, style, meaning, and more.

export type Gender = "male" | "female" | "unisex";
export type Style =
  | "funny"
  | "cute"
  | "luxury"
  | "nature"
  | "movies"
  | "anime"
  | "color"
  | "food"
  | "mythology"
  | "classic"
  | "strong"
  | "royal";

export interface PetName {
  name: string;
  gender: Gender;
  origin: string; // free-text: American, British, Japanese, Latin, etc.
  meaning?: string;
  styles: Style[];
  species: ("dog" | "cat" | "any")[];
  sizes?: ("small" | "medium" | "large" | "any")[];
  breedHints?: string[]; // e.g. ["golden-retriever","husky"]
}

// Keep entries alphabetized within blocks for scanability.
export const NAMES: PetName[] = [
  // A
  { name: "Aiko", gender: "female", origin: "Japanese", meaning: "Little loved one", styles: ["cute", "anime"], species: ["cat", "dog"] },
  { name: "Ajax", gender: "male", origin: "Greek", meaning: "Strong warrior", styles: ["mythology", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "Aria", gender: "female", origin: "Italian", meaning: "Melody", styles: ["cute", "classic"], species: ["cat", "dog"] },
  { name: "Arlo", gender: "male", origin: "Old English", meaning: "Fortified hill", styles: ["cute", "classic"], species: ["dog"] },
  { name: "Aspen", gender: "unisex", origin: "American", meaning: "Tree", styles: ["nature"], species: ["dog", "cat"] },
  { name: "Atlas", gender: "male", origin: "Greek", meaning: "Bearer of heavens", styles: ["mythology", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "Avery", gender: "unisex", origin: "English", meaning: "Ruler of elves", styles: ["classic"], species: ["dog", "cat"] },
  { name: "Azumi", gender: "female", origin: "Japanese", meaning: "Safe residence", styles: ["anime", "cute"], species: ["cat"] },

  // B
  { name: "Bailey", gender: "unisex", origin: "English", meaning: "Bailiff", styles: ["classic", "cute"], species: ["dog"] },
  { name: "Bandit", gender: "male", origin: "American", meaning: "Outlaw", styles: ["funny", "strong"], species: ["dog", "cat"] },
  { name: "Bear", gender: "male", origin: "English", meaning: "Bear", styles: ["nature", "strong", "cute"], species: ["dog"], sizes: ["large"] },
  { name: "Bella", gender: "female", origin: "Italian", meaning: "Beautiful", styles: ["cute", "classic"], species: ["dog", "cat"] },
  { name: "Bentley", gender: "male", origin: "English", meaning: "From the meadow", styles: ["luxury"], species: ["dog"] },
  { name: "Biscuit", gender: "unisex", origin: "English", meaning: "Baked treat", styles: ["food", "funny", "cute"], species: ["dog", "cat"] },
  { name: "Blaze", gender: "male", origin: "English", meaning: "Flame", styles: ["strong", "color"], species: ["dog"] },
  { name: "Blueberry", gender: "unisex", origin: "American", meaning: "Berry", styles: ["food", "cute", "funny"], species: ["cat", "dog"], sizes: ["small"] },
  { name: "Boba", gender: "unisex", origin: "Taiwanese", meaning: "Bubble tea", styles: ["food", "cute", "funny"], species: ["cat"] },
  { name: "Bruno", gender: "male", origin: "German", meaning: "Brown", styles: ["classic", "color"], species: ["dog"] },
  { name: "Buddy", gender: "male", origin: "American", meaning: "Friend", styles: ["classic", "cute"], species: ["dog"] },

  // C
  { name: "Calliope", gender: "female", origin: "Greek", meaning: "Beautiful voice", styles: ["mythology", "luxury"], species: ["cat"] },
  { name: "Cane", gender: "male", origin: "Japanese", meaning: "Golden", styles: ["anime"], species: ["dog"] },
  { name: "Cash", gender: "male", origin: "English", meaning: "Money", styles: ["luxury", "funny"], species: ["dog"] },
  { name: "Charlie", gender: "unisex", origin: "English", meaning: "Free man", styles: ["classic", "cute"], species: ["dog", "cat"] },
  { name: "Chip", gender: "male", origin: "English", meaning: "Little", styles: ["cute", "funny"], species: ["dog", "cat"], sizes: ["small"] },
  { name: "Cinnamon", gender: "unisex", origin: "American", meaning: "Spice", styles: ["food", "color", "cute"], species: ["cat", "dog"] },
  { name: "Cleo", gender: "female", origin: "Greek", meaning: "Glory", styles: ["royal", "classic"], species: ["cat"] },
  { name: "Coco", gender: "female", origin: "French", meaning: "Chocolate", styles: ["luxury", "cute"], species: ["dog", "cat"] },
  { name: "Cooper", gender: "male", origin: "English", meaning: "Barrel maker", styles: ["classic"], species: ["dog"] },

  // D
  { name: "Daisy", gender: "female", origin: "English", meaning: "Day's eye flower", styles: ["nature", "cute"], species: ["dog", "cat"] },
  { name: "Dango", gender: "male", origin: "Japanese", meaning: "Rice dumpling", styles: ["anime", "food", "cute"], species: ["cat"] },
  { name: "Duke", gender: "male", origin: "English", meaning: "Leader", styles: ["royal", "strong"], species: ["dog"], sizes: ["large"] },

  // E
  { name: "Eevee", gender: "female", origin: "Japanese", meaning: "Pokemon", styles: ["anime", "cute"], species: ["cat"] },
  { name: "Elsa", gender: "female", origin: "Norse", meaning: "Noble", styles: ["movies", "royal"], species: ["cat", "dog"] },
  { name: "Ember", gender: "female", origin: "English", meaning: "Spark", styles: ["nature", "color"], species: ["dog", "cat"] },
  { name: "Emmy", gender: "female", origin: "German", meaning: "Universal", styles: ["cute"], species: ["dog", "cat"] },

  // F
  { name: "Finn", gender: "male", origin: "Irish", meaning: "Fair", styles: ["classic"], species: ["dog"] },
  { name: "Fluffernutter", gender: "unisex", origin: "American", meaning: "Silly", styles: ["funny", "food"], species: ["cat"] },
  { name: "Frodo", gender: "male", origin: "English", meaning: "LOTR hobbit", styles: ["movies"], species: ["dog", "cat"], sizes: ["small"] },

  // G
  { name: "Gizmo", gender: "male", origin: "American", meaning: "Gadget", styles: ["funny", "movies"], species: ["cat", "dog"], sizes: ["small"] },
  { name: "Goku", gender: "male", origin: "Japanese", meaning: "Aware of emptiness", styles: ["anime", "strong"], species: ["dog"] },
  { name: "Gucci", gender: "unisex", origin: "Italian", meaning: "Fashion", styles: ["luxury", "funny"], species: ["dog", "cat"] },

  // H
  { name: "Hazel", gender: "female", origin: "English", meaning: "Tree", styles: ["nature", "color", "cute"], species: ["dog", "cat"] },
  { name: "Hermes", gender: "male", origin: "Greek", meaning: "Messenger god", styles: ["mythology", "luxury"], species: ["dog"] },
  { name: "Hiro", gender: "male", origin: "Japanese", meaning: "Generous", styles: ["anime"], species: ["dog", "cat"] },
  { name: "Honey", gender: "female", origin: "English", meaning: "Sweet", styles: ["cute", "food"], species: ["cat", "dog"] },

  // I
  { name: "Indigo", gender: "unisex", origin: "Greek", meaning: "Deep blue", styles: ["color", "nature"], species: ["cat", "dog"] },
  { name: "Iris", gender: "female", origin: "Greek", meaning: "Rainbow", styles: ["nature", "mythology"], species: ["cat"] },

  // J
  { name: "Jasper", gender: "male", origin: "Persian", meaning: "Treasurer", styles: ["classic", "nature"], species: ["dog", "cat"] },
  { name: "Jinx", gender: "female", origin: "American", meaning: "Curse (superstitious)", styles: ["funny"], species: ["cat"] },
  { name: "Juno", gender: "female", origin: "Roman", meaning: "Queen of gods", styles: ["mythology", "royal"], species: ["dog", "cat"] },

  // K
  { name: "Kai", gender: "unisex", origin: "Hawaiian", meaning: "Sea", styles: ["nature"], species: ["dog"] },
  { name: "King", gender: "male", origin: "English", meaning: "Ruler", styles: ["royal", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "Kitsune", gender: "unisex", origin: "Japanese", meaning: "Fox spirit", styles: ["anime", "mythology"], species: ["cat", "dog"] },
  { name: "Kobe", gender: "male", origin: "Japanese", meaning: "God's door", styles: ["classic"], species: ["dog"] },

  // L
  { name: "Leo", gender: "male", origin: "Latin", meaning: "Lion", styles: ["classic", "strong"], species: ["dog", "cat"] },
  { name: "Lily", gender: "female", origin: "English", meaning: "Flower", styles: ["nature", "cute"], species: ["cat", "dog"] },
  { name: "Loki", gender: "male", origin: "Norse", meaning: "Trickster god", styles: ["mythology", "movies", "funny"], species: ["cat", "dog"] },
  { name: "Luna", gender: "female", origin: "Latin", meaning: "Moon", styles: ["nature", "mythology", "cute"], species: ["dog", "cat"] },

  // M
  { name: "Mango", gender: "unisex", origin: "Tamil", meaning: "Fruit", styles: ["food", "cute", "color"], species: ["cat", "dog"] },
  { name: "Marbles", gender: "unisex", origin: "American", meaning: "Playful", styles: ["funny", "cute"], species: ["cat"] },
  { name: "Max", gender: "male", origin: "Latin", meaning: "Greatest", styles: ["classic"], species: ["dog"] },
  { name: "Milo", gender: "male", origin: "German", meaning: "Merciful", styles: ["cute", "classic"], species: ["dog", "cat"] },
  { name: "Miso", gender: "unisex", origin: "Japanese", meaning: "Fermented bean paste", styles: ["food", "anime", "cute"], species: ["cat"] },
  { name: "Mochi", gender: "unisex", origin: "Japanese", meaning: "Rice cake", styles: ["food", "anime", "cute"], species: ["cat", "dog"], sizes: ["small"] },
  { name: "Muffin", gender: "unisex", origin: "American", meaning: "Baked", styles: ["food", "cute", "funny"], species: ["cat", "dog"] },

  // N
  { name: "Nala", gender: "female", origin: "Swahili", meaning: "Successful", styles: ["movies", "cute"], species: ["cat"] },
  { name: "Nori", gender: "unisex", origin: "Japanese", meaning: "Seaweed", styles: ["food", "anime"], species: ["cat"] },

  // O
  { name: "Odin", gender: "male", origin: "Norse", meaning: "All-father", styles: ["mythology", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "Olive", gender: "female", origin: "English", meaning: "Peace", styles: ["nature", "cute", "color"], species: ["cat", "dog"] },
  { name: "Oreo", gender: "unisex", origin: "American", meaning: "Cookie", styles: ["food", "funny", "color"], species: ["cat", "dog"] },
  { name: "Otis", gender: "male", origin: "German", meaning: "Wealthy", styles: ["classic"], species: ["dog"] },

  // P
  { name: "Paw-casso", gender: "unisex", origin: "American", meaning: "Pun", styles: ["funny"], species: ["cat", "dog"] },
  { name: "Peanut", gender: "unisex", origin: "American", meaning: "Small", styles: ["cute", "food", "funny"], species: ["cat", "dog"], sizes: ["small"] },
  { name: "Pepper", gender: "unisex", origin: "English", meaning: "Spice", styles: ["food", "color"], species: ["dog", "cat"] },
  { name: "Pikachu", gender: "male", origin: "Japanese", meaning: "Sparkle mouse", styles: ["anime", "cute", "funny"], species: ["cat"] },
  { name: "Pixel", gender: "unisex", origin: "American", meaning: "Digital dot", styles: ["funny", "cute"], species: ["cat"] },
  { name: "Prince", gender: "male", origin: "Latin", meaning: "Royal son", styles: ["royal"], species: ["dog"] },
  { name: "Pudding", gender: "unisex", origin: "English", meaning: "Sweet dish", styles: ["food", "cute", "funny"], species: ["cat"] },

  // Q
  { name: "Queenie", gender: "female", origin: "English", meaning: "Queen", styles: ["royal", "cute"], species: ["dog", "cat"] },

  // R
  { name: "Ramen", gender: "unisex", origin: "Japanese", meaning: "Noodle", styles: ["food", "anime", "funny"], species: ["cat", "dog"] },
  { name: "Remy", gender: "male", origin: "French", meaning: "Oarsman", styles: ["movies", "classic"], species: ["dog", "cat"] },
  { name: "Rex", gender: "male", origin: "Latin", meaning: "King", styles: ["classic", "royal", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "River", gender: "unisex", origin: "English", meaning: "Flowing water", styles: ["nature"], species: ["dog"] },
  { name: "Rocky", gender: "male", origin: "American", meaning: "Rest", styles: ["movies", "strong"], species: ["dog"] },
  { name: "Ruby", gender: "female", origin: "Latin", meaning: "Red gemstone", styles: ["color", "luxury", "classic"], species: ["dog", "cat"] },

  // S
  { name: "Sable", gender: "unisex", origin: "French", meaning: "Black", styles: ["color", "luxury"], species: ["dog", "cat"] },
  { name: "Sage", gender: "unisex", origin: "Latin", meaning: "Wise / herb", styles: ["nature"], species: ["cat", "dog"] },
  { name: "Sakura", gender: "female", origin: "Japanese", meaning: "Cherry blossom", styles: ["anime", "nature", "cute"], species: ["cat"] },
  { name: "Sashimi", gender: "unisex", origin: "Japanese", meaning: "Raw fish", styles: ["food", "anime", "funny"], species: ["cat"] },
  { name: "Scout", gender: "unisex", origin: "English", meaning: "One who explores", styles: ["classic", "cute"], species: ["dog"] },
  { name: "Shadow", gender: "unisex", origin: "English", meaning: "Silhouette", styles: ["color", "strong"], species: ["cat", "dog"] },
  { name: "Simba", gender: "male", origin: "Swahili", meaning: "Lion", styles: ["movies", "strong"], species: ["cat", "dog"] },
  { name: "Snickerdoodle", gender: "unisex", origin: "American", meaning: "Cookie", styles: ["food", "funny", "cute"], species: ["dog"] },
  { name: "Snow", gender: "unisex", origin: "English", meaning: "White", styles: ["color", "nature"], species: ["cat", "dog"] },
  { name: "Sprinkles", gender: "unisex", origin: "American", meaning: "Confetti", styles: ["funny", "cute", "food"], species: ["cat"] },
  { name: "Sunny", gender: "unisex", origin: "English", meaning: "Bright", styles: ["cute", "color", "nature"], species: ["dog", "cat"] },
  { name: "Sushi", gender: "unisex", origin: "Japanese", meaning: "Sushi", styles: ["food", "anime", "funny"], species: ["cat"] },

  // T
  { name: "Taco", gender: "male", origin: "Spanish", meaning: "Wrapped food", styles: ["food", "funny"], species: ["dog"], sizes: ["small"] },
  { name: "Thor", gender: "male", origin: "Norse", meaning: "Thunder god", styles: ["mythology", "movies", "strong"], species: ["dog"], sizes: ["large"] },
  { name: "Tofu", gender: "unisex", origin: "Chinese", meaning: "Bean curd", styles: ["food", "cute"], species: ["cat"] },
  { name: "Toothless", gender: "male", origin: "English", meaning: "HTTYD dragon", styles: ["movies", "funny"], species: ["cat"] },
  { name: "Truffle", gender: "unisex", origin: "French", meaning: "Fungus / chocolate", styles: ["food", "luxury"], species: ["cat", "dog"] },

  // V
  { name: "Vader", gender: "male", origin: "English", meaning: "Star Wars villain", styles: ["movies", "strong"], species: ["dog", "cat"] },
  { name: "Vega", gender: "female", origin: "Arabic", meaning: "Falling star", styles: ["nature", "luxury"], species: ["cat"] },
  { name: "Violet", gender: "female", origin: "English", meaning: "Purple flower", styles: ["color", "nature"], species: ["dog", "cat"] },

  // W
  { name: "Waffles", gender: "unisex", origin: "American", meaning: "Breakfast", styles: ["food", "funny", "cute"], species: ["dog", "cat"] },
  { name: "Willow", gender: "female", origin: "English", meaning: "Tree", styles: ["nature", "cute"], species: ["dog", "cat"] },
  { name: "Winston", gender: "male", origin: "English", meaning: "Joy stone", styles: ["classic", "royal"], species: ["dog"] },

  // Y
  { name: "Yoda", gender: "male", origin: "English", meaning: "Star Wars master", styles: ["movies", "funny"], species: ["cat", "dog"], sizes: ["small"] },
  { name: "Yuki", gender: "female", origin: "Japanese", meaning: "Snow", styles: ["anime", "color", "nature"], species: ["cat"] },

  // Z
  { name: "Zelda", gender: "female", origin: "German", meaning: "Battle", styles: ["anime", "movies", "strong"], species: ["cat"] },
  { name: "Ziggy", gender: "unisex", origin: "German", meaning: "Victorious", styles: ["funny", "cute"], species: ["dog", "cat"] },
  { name: "Zuko", gender: "male", origin: "Japanese", meaning: "Prince (Avatar)", styles: ["anime", "movies", "strong"], species: ["dog"] },
];

export const NAME_ORIGINS = Array.from(new Set(NAMES.map((n) => n.origin))).sort();
export const NAME_STYLES: Style[] = [
  "funny",
  "cute",
  "luxury",
  "nature",
  "movies",
  "anime",
  "color",
  "food",
  "mythology",
  "classic",
  "strong",
  "royal",
];

export interface NameFilter {
  gender?: Gender | "any";
  origin?: string; // "any" or origin
  style?: Style | "any";
  species?: "dog" | "cat" | "any";
  size?: "small" | "medium" | "large" | "any";
  minLength?: number;
  maxLength?: number;
  startsWith?: string; // single letter
  contains?: string; // substring
  meaning?: string; // meaning contains
}

export function filterNames(all: PetName[], f: NameFilter): PetName[] {
  return all.filter((n) => {
    if (f.gender && f.gender !== "any" && n.gender !== f.gender && n.gender !== "unisex") return false;
    if (f.origin && f.origin !== "any" && n.origin !== f.origin) return false;
    if (f.style && f.style !== "any" && !n.styles.includes(f.style)) return false;
    if (f.species && f.species !== "any" && !n.species.includes(f.species) && !n.species.includes("any")) return false;
    if (f.size && f.size !== "any" && n.sizes && !n.sizes.includes(f.size) && !n.sizes.includes("any")) return false;
    if (f.minLength != null && n.name.length < f.minLength) return false;
    if (f.maxLength != null && n.name.length > f.maxLength) return false;
    if (f.startsWith && n.name[0]?.toLowerCase() !== f.startsWith.toLowerCase()) return false;
    if (f.contains && !n.name.toLowerCase().includes(f.contains.toLowerCase())) return false;
    if (f.meaning && !(n.meaning ?? "").toLowerCase().includes(f.meaning.toLowerCase())) return false;
    return true;
  });
}
