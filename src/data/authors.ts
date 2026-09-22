export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  bio: string[];
  avatar: string;
  website?: string;
  socials: {
    linkedin: string;
    instagram: string;
    twitter?: string;
    github?: string;
  };
  areasOfInterest: string[];
  toolsManaged?: {
    name: string;
    url: string;
    description: string;
  }[];
  active: boolean;
}

export const PRIMARY_AUTHOR_ID = "firoz-khan";

export const DEFAULT_AUTHOR: Author = {
  id: "firoz-khan",
  slug: "firoz-khan",
  name: "Firoz Khan",
  role: "Founder / Content Creator",
  shortBio:
    "Firoz Khan is a technology-focused content creator and developer who works on practical online tools and digital resources. He is the founder/creator behind FurTools, a pet-focused platform designed to make everyday pet care information, calculations, planning, and educational resources easier to access.",
  bio: [
    "Firoz Khan is a technology-focused content creator and developer who works on practical online tools and digital resources. He is the founder/creator behind FurTools, a pet-focused platform designed to make everyday pet care information, calculations, planning, and educational resources easier to access.",
    "With a background in software engineering, digital product design, and interactive tools development, Firoz focuses on translating complex formulas and animal wellness guidelines into clear, intuitive, and accessible web experiences. FurTools was built to provide pet guardians with reliable baseline calculators, cost planning tools, and well-researched educational articles without paywalls or intrusive barriers.",
    "Firoz oversees the technical architecture, interactive calculator engines, user experience, and ongoing platform expansion across canine, feline, equine, avian, and exotic pet care modules.",
  ],
  avatar: "/authors/firoz-khan.webp",
  website: "https://www.furtools.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/firoz-khan-1153358a/",
    instagram: "https://www.instagram.com/rtibyfiroz/",
  },
  areasOfInterest: [
    "Pet Care Software & Calculators",
    "Companion Animal Nutrition Models",
    "Preventative Pet Wellness Data",
    "Digital Husbandry Resources",
    "Accessible Educational Tools",
  ],
  toolsManaged: [
    {
      name: "Dog Food Portion & Calorie Calculator",
      url: "/tools/dog-food-calculator",
      description: "Interactive RER/MER calorie intake calculator for puppies, adult dogs, and seniors.",
    },
    {
      name: "Cat Calorie & Feeding Calculator",
      url: "/tools/cat-calorie-calculator",
      description: "Daily caloric and wet/dry portioning estimator for optimal feline wellness.",
    },
    {
      name: "Pet Lifetime Budget & Cost Planner",
      url: "/cost-planner",
      description: "Comprehensive actuarial financial planning tool for lifetime companion animal care.",
    },
    {
      name: "Pet Food Safety & Toxicity Database",
      url: "/foods",
      description: "Searchable toxicity and safe food database covering ingredients for dogs, cats, and small pets.",
    },
    {
      name: "Equine Hoof & Feed Management Suite",
      url: "/categories/horse-tools",
      description: "Specialized forage ratios, farrier schedules, and horse body condition scoring calculators.",
    },
  ],
  active: true,
};

export const AUTHORS: Record<string, Author> = {
  "firoz-khan": DEFAULT_AUTHOR,
};

const STORAGE_KEY = "furtools_custom_authors_v1";

export function getCustomAuthors(): Record<string, Author> {
  if (typeof window === "undefined") return AUTHORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return AUTHORS;
    const parsed = JSON.parse(raw);
    return { ...AUTHORS, ...parsed };
  } catch {
    return AUTHORS;
  }
}

export function saveCustomAuthor(author: Author): void {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomAuthors();
    current[author.slug || author.id] = author;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn("Failed to save author to localStorage:", err);
  }
}

export function getAuthor(idOrSlug?: string | null): Author {
  const allAuthors = getCustomAuthors();
  if (!idOrSlug) return allAuthors[PRIMARY_AUTHOR_ID] ?? DEFAULT_AUTHOR;
  const normalized = idOrSlug.toLowerCase().trim().replace(/\s+/g, "-");
  if (allAuthors[normalized]) return allAuthors[normalized];
  if (allAuthors[idOrSlug]) return allAuthors[idOrSlug];
  return allAuthors[PRIMARY_AUTHOR_ID] ?? DEFAULT_AUTHOR;
}
