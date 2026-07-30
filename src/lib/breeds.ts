// Breed database types + query helpers. Data lives in Supabase (public.breeds).
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BreedDisease {
  name: string;
  description: string;
}

export interface BreedFaq {
  question: string;
  answer: string;
}

export interface BreedGoodWith {
  children?: string;
  other_pets?: string;
  apartments?: string;
  first_time_owners?: string;
}

export interface BreedRow {
  id: string;
  slug: string;
  species: string;
  name: string;
  hero_image: string | null;
  overview: string;
  history: string;
  temperament_traits: string[];
  temperament_description: string;
  exercise_level: string;
  exercise_description: string;
  exercise_minutes_per_day: number | null;
  weight_min: number | null;
  weight_max: number | null;
  weight_unit: string;
  height_min: number | null;
  height_max: number | null;
  height_unit: string;
  lifespan_min: number | null;
  lifespan_max: number | null;
  common_diseases: BreedDisease[];
  nutrition: string;
  grooming: string;
  grooming_frequency: string | null;
  images: string[];
  faqs: BreedFaq[];
  related_tool_slugs: string[];
  related_article_slugs: string[];
  good_with: BreedGoodWith;
  origin_country: string | null;
  breed_group: string | null;
  coat_type: string | null;
  coat_colors: string[];
  size_category: string | null;
  energy_level: string | null;
  shedding_level: string | null;
  trainability: string | null;
  published: boolean;
  updated_at: string;
}

const BREED_COLUMNS =
  "id,slug,species,name,hero_image,overview,history,temperament_traits,temperament_description,exercise_level,exercise_description,exercise_minutes_per_day,weight_min,weight_max,weight_unit,height_min,height_max,height_unit,lifespan_min,lifespan_max,common_diseases,nutrition,grooming,grooming_frequency,images,faqs,related_tool_slugs,related_article_slugs,good_with,origin_country,breed_group,coat_type,coat_colors,size_category,energy_level,shedding_level,trainability,published,updated_at";

export const breedsListQuery = queryOptions({
  queryKey: ["breeds", "list"],
  queryFn: async (): Promise<BreedRow[]> => {
    const { data, error } = await supabase
      .from("breeds")
      .select(BREED_COLUMNS)
      .eq("published", true)
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as BreedRow[];
  },
});

export const breedDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["breeds", "detail", slug],
    queryFn: async (): Promise<BreedRow | null> => {
      const { data, error } = await supabase
        .from("breeds")
        .select(BREED_COLUMNS)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as BreedRow) ?? null;
    },
  });

export function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  unit: string,
): string {
  if (min == null && max == null) return "—";
  if (min != null && max != null && min !== max) return `${min}–${max} ${unit}`;
  return `${min ?? max} ${unit}`;
}

export function levelBadge(level: unknown): {
  label: string;
  className: string;
} {
  const raw =
    typeof level === "string"
      ? level
      : typeof level === "boolean"
        ? level
          ? "good"
          : "low"
        : level == null
          ? ""
          : String(level);
  const l = raw.toLowerCase();

  if (l.includes("very high"))
    return { label: "Very High", className: "bg-red-500/15 text-red-700 dark:text-red-300" };
  if (l.includes("high"))
    return { label: "High", className: "bg-orange-500/15 text-orange-700 dark:text-orange-300" };
  if (l.includes("very low"))
    return { label: "Very Low", className: "bg-sky-500/15 text-sky-700 dark:text-sky-300" };
  if (l.includes("low"))
    return { label: "Low", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" };
  if (l.includes("medium") || l.includes("fair") || l.includes("good") || l.includes("excellent"))
    return { label: raw || "Medium", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" };
  return { label: raw || "—", className: "bg-muted text-muted-foreground" };

}
