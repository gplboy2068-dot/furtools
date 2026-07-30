export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: "terracotta" | "sage" | "amber" | "sky" | "rose" | "violet" | "lime";
}

export const CATEGORIES: Category[] = [
  {
    slug: "dogs",
    name: "Dogs",
    description: "Calculators, planners, and name generators for dogs of every breed, size, and age.",
    icon: "Dog",
    color: "terracotta",
  },
  {
    slug: "cats",
    name: "Cats",
    description: "Age converters, food calculators, kitten growth trackers, and more for felines.",
    icon: "Cat",
    color: "amber",
  },
  {
    slug: "birds",
    name: "Birds",
    description: "Cage-size, diet, and care planners for parrots, cockatiels, canaries, and finches.",
    icon: "Bird",
    color: "sky",
  },
  {
    slug: "fish",
    name: "Fish & Aquarium",
    description: "Tank volume, stocking, cycling, water changes, and equipment calculators.",
    icon: "Fish",
    color: "sky",
  },
  {
    slug: "small-pets",
    name: "Small Pets",
    description: "Rabbits, hamsters, guinea pigs, and ferrets — cage sizes, diet, and enrichment.",
    icon: "Rabbit",
    color: "rose",
  },
  {
    slug: "reptiles",
    name: "Reptiles",
    description: "Enclosure sizing, UVB distance, feeder sizing, and care schedules for reptiles.",
    icon: "Turtle",
    color: "lime",
  },
  {
    slug: "horses",
    name: "Horses",
    description: "Feeding rations, water needs, body condition, and equine care planners.",
    icon: "PawPrint",
    color: "violet",
  },
  {
    slug: "farm",
    name: "Farm Animals",
    description: "Chickens, ducks, goats, and other homestead animals — coops, feed, and production.",
    icon: "Egg",
    color: "amber",
  },
  {
    slug: "general",
    name: "General Pets",
    description: "Pet-agnostic tools — expense trackers, checklists, medication calculators, and planners.",
    icon: "PawPrint",
    color: "sage",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
