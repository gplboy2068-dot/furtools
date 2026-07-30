import { AiNameGenerator } from "@/components/tools/ai-name-generator";

const NAMES: Record<"dog" | "cat", Record<string, string[]>> = {
  dog: {
    cute: ["Biscuit", "Peanut", "Waffle", "Mochi", "Poppy", "Beans", "Honey", "Ollie", "Milo", "Pip", "Noodle", "Muffin"],
    classic: ["Max", "Charlie", "Bella", "Lucy", "Rocky", "Daisy", "Cooper", "Ruby", "Sadie", "Duke"],
    punny: ["Sir Barks-a-Lot", "Chewbarka", "Bark Twain", "Sarah Jessica Barker", "Salvador Dogi", "Winnie the Poodle"],
    tough: ["Titan", "Zeus", "Odin", "Ranger", "Blade", "Diesel", "Kaiser", "Bruno", "Onyx"],
    elegant: ["Winston", "Bianca", "Isabella", "Sebastian", "Aurora", "Beatrix", "August", "Coco"],
  },
  cat: {
    cute: ["Muffin", "Peaches", "Ziggy", "Marshmallow", "Cookie", "Pumpkin", "Toast", "Mochi", "Boba"],
    classic: ["Whiskers", "Simba", "Luna", "Milo", "Oliver", "Chloe", "Felix", "Nala"],
    punny: ["Meowly Cyrus", "Katy Purry", "Cat Sajak", "Anderson Pooper", "Jude Paw", "Fuzz Aldrin"],
    tough: ["Loki", "Thor", "Shadow", "Blade", "Neo", "Rogue", "Nyx"],
    elegant: ["Cleopatra", "Josephine", "Beau", "Ivy", "Odette", "Sable", "Percival"],
  },
};

export function PetNameGenerator({ pet }: { pet: "dog" | "cat" }) {
  const banks = NAMES[pet];
  return <AiNameGenerator species={pet} vibes={Object.keys(banks)} seedNames={banks} />;
}
