// Foods database types + queries (Supabase-backed "Can My Pet Eat This?").
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SafetyLevel = "safe" | "moderation" | "unsafe" | "unknown";

export interface FoodFaq {
  question: string;
  answer: string;
}

export interface FoodRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  image_url: string | null;
  species_safety: Record<string, SafetyLevel>;
  short_answer: string;
  benefits: string;
  risks: string;
  symptoms: string;
  vet_advice: string;
  alternatives: string[];
  related_food_slugs: string[];
  faqs: FoodFaq[];
  keywords: string[];
  updated_at: string;
}

const COLS =
  "id,slug,name,category,image_url,species_safety,short_answer,benefits,risks,symptoms,vet_advice,alternatives,related_food_slugs,faqs,keywords,updated_at";

import { FALLBACK_FOODS } from "@/data/fallback-foods";

export const foodsListQuery = queryOptions({
  queryKey: ["foods", "list"],
  queryFn: async (): Promise<FoodRow[]> => {
    // 1. Client-side browser fetch
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/foods");
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list as FoodRow[];
          }
        }
      } catch (err) {
        console.warn("Client fetch /api/foods failed, using fallback:", err);
      }
      return FALLBACK_FOODS;
    }

    // 2. Server-side D1 query
    try {
      const { getDbFoods } = await import("@/lib/d1");
      const d1Foods = await getDbFoods();
      if (d1Foods && d1Foods.length > 0) {
        return d1Foods as unknown as FoodRow[];
      }
    } catch (d1Err) {
      console.warn("D1 foods query error:", d1Err);
    }

    // 3. Fallback data
    return FALLBACK_FOODS;
  },
});

export const foodDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["foods", "detail", slug],
    queryFn: async (): Promise<FoodRow | null> => {
      // 1. Client-side browser lookup
      if (typeof window !== "undefined") {
        try {
          const res = await fetch("/api/foods");
          if (res.ok) {
            const list = (await res.json()) as FoodRow[];
            const found = list.find((f) => f.slug === slug);
            if (found) return found;
          }
        } catch {
          // ignore
        }
        return FALLBACK_FOODS.find((f) => f.slug === slug) ?? null;
      }

      // 2. Server-side D1 query
      try {
        const { getDbFoodBySlug } = await import("@/lib/d1");
        const d1Food = await getDbFoodBySlug(slug);
        if (d1Food) {
          return d1Food as unknown as FoodRow;
        }
      } catch (d1Err) {
        console.warn(`D1 food detail query error (${slug}):`, d1Err);
      }

      return FALLBACK_FOODS.find((f) => f.slug === slug) ?? null;
    },
  });

export const FOOD_CATEGORIES = [
  { slug: "fruit", label: "Fruits" },
  { slug: "vegetable", label: "Vegetables" },
  { slug: "protein", label: "Meat & Protein" },
  { slug: "dairy", label: "Dairy" },
  { slug: "grain", label: "Grains" },
  { slug: "nut", label: "Nuts" },
  { slug: "seed", label: "Seeds" },
  { slug: "herb", label: "Herbs" },
  { slug: "sweets", label: "Sweets" },
  { slug: "sweetener", label: "Sweeteners" },
  { slug: "spice", label: "Spices" },
  { slug: "drink", label: "Drinks" },
  { slug: "snack", label: "Snacks" },
  { slug: "other", label: "Other" },
];

export interface FoodSpecies {
  slug: string;
  label: string;
  plural: string;
  emoji: string;
}

export const FOOD_SPECIES: FoodSpecies[] = [
  { slug: "dog", label: "Dog", plural: "Dogs", emoji: "🐶" },
  { slug: "cat", label: "Cat", plural: "Cats", emoji: "🐱" },
  { slug: "rabbit", label: "Rabbit", plural: "Rabbits", emoji: "🐰" },
  { slug: "bird", label: "Bird", plural: "Birds", emoji: "🦜" },
  { slug: "hamster", label: "Hamster", plural: "Hamsters", emoji: "🐹" },
  { slug: "guinea_pig", label: "Guinea Pig", plural: "Guinea Pigs", emoji: "🐹" },
  { slug: "ferret", label: "Ferret", plural: "Ferrets", emoji: "🦡" },
  { slug: "horse", label: "Horse", plural: "Horses", emoji: "🐴" },
  { slug: "turtle", label: "Turtle", plural: "Turtles", emoji: "🐢" },
  { slug: "fish", label: "Fish", plural: "Fish", emoji: "🐟" },
];

export function safetyMeta(level: SafetyLevel | undefined): {
  label: string;
  color: string;
  bg: string;
  ring: string;
} {
  switch (level) {
    case "safe":
      return {
        label: "Safe",
        color: "text-emerald-700 dark:text-emerald-300",
        bg: "bg-emerald-500/15",
        ring: "ring-emerald-500/30",
      };
    case "moderation":
      return {
        label: "In moderation",
        color: "text-amber-700 dark:text-amber-300",
        bg: "bg-amber-500/15",
        ring: "ring-amber-500/30",
      };
    case "unsafe":
      return {
        label: "Unsafe",
        color: "text-red-700 dark:text-red-300",
        bg: "bg-red-500/15",
        ring: "ring-red-500/30",
      };
    default:
      return {
        label: "Unknown",
        color: "text-muted-foreground",
        bg: "bg-muted",
        ring: "ring-border",
      };
  }
}
