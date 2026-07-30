// Species catalog for the Breed Database.
// Dogs & Cats are live; the rest are staged for future rollout.

export interface Species {
  slug: "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "horse";
  singular: string;
  plural: string;
  description: string;
  icon: string; // lucide icon name
  live: boolean;
  color: "terracotta" | "amber" | "sage" | "sky" | "rose" | "violet" | "lime";
}

export const SPECIES: Species[] = [
  {
    slug: "dog",
    singular: "Dog",
    plural: "Dogs",
    description: "From working shepherds to lap-loving companions — explore every dog breed in depth.",
    icon: "Dog",
    live: true,
    color: "terracotta",
  },
  {
    slug: "cat",
    singular: "Cat",
    plural: "Cats",
    description: "Long-haired royalty, chatty companions, and gentle giants — cat breeds unpacked.",
    icon: "Cat",
    live: true,
    color: "amber",
  },
  {
    slug: "bird",
    singular: "Bird",
    plural: "Birds",
    description: "Parrots, finches, cockatiels, canaries and more — companion bird breeds unpacked.",
    icon: "Bird",
    live: true,
    color: "sky",
  },
  {
    slug: "rabbit",
    singular: "Rabbit",
    plural: "Rabbits",
    description: "Lop, angora, dwarf and beyond — friendly, plain-language rabbit breed profiles.",
    icon: "Rabbit",
    live: true,
    color: "rose",
  },
  {
    slug: "fish",
    singular: "Fish",
    plural: "Fish",
    description: "Freshwater and saltwater fish species — tank size, diet, and care at a glance.",
    icon: "Fish",
    live: true,
    color: "sky",
  },
  {
    slug: "hamster",
    singular: "Hamster",
    plural: "Hamsters",
    description: "Syrian, dwarf, and Roborovski hamsters — housing, handling, and daily care.",
    icon: "Squirrel",
    live: true,
    color: "sage",
  },
  {
    slug: "horse",
    singular: "Horse",
    plural: "Horses",
    description: "From draft breeds to sport horses — temperament, work, and stable-side care.",
    icon: "PawPrint",
    live: true,
    color: "violet",
  },
];

export function getSpecies(slug: string): Species | undefined {
  return SPECIES.find((s) => s.slug === slug);
}
