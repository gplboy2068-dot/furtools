import { useTranslation } from "react-i18next";
import {
  FOOD_CATEGORIES,
  FOOD_SPECIES,
  safetyMeta,
  type FoodRow,
  type SafetyLevel,
} from "@/lib/foods";

/**
 * Translated food-safety labels (categories, species, safety levels)
 * via the "foods" namespace. Falls back to English source strings.
 */
export function useTranslatedFoodLabels() {
  const { t } = useTranslation("foods");
  return {
    categories: FOOD_CATEGORIES.map((c) => ({
      ...c,
      label: t(`categories.${c.slug}`, { defaultValue: c.label }),
    })),
    species: FOOD_SPECIES.map((s) => ({
      ...s,
      label: t(`species.${s.slug}.label`, { defaultValue: s.label }),
      plural: t(`species.${s.slug}.plural`, { defaultValue: s.plural }),
    })),
    safetyLabel: (level: SafetyLevel | undefined): string => {
      const key = level ?? "unknown";
      const fallback = safetyMeta(level).label;
      return t(`safety.${key}`, { defaultValue: fallback });
    },
  };
}

/**
 * Returns a food row with name/content translated via the "foods" namespace.
 * Falls back to the English source strings when a key is missing.
 */
export function useTranslatedFood(food: FoodRow): FoodRow {
  const { t } = useTranslation("foods");
  const p = `foods.${food.slug}`;
  return {
    ...food,
    name: t(`${p}.name`, { defaultValue: food.name }),
    short_answer: t(`${p}.short_answer`, { defaultValue: food.short_answer }),
    benefits: t(`${p}.benefits`, { defaultValue: food.benefits }),
    risks: t(`${p}.risks`, { defaultValue: food.risks }),
    symptoms: t(`${p}.symptoms`, { defaultValue: food.symptoms }),
    vet_advice: t(`${p}.vet_advice`, { defaultValue: food.vet_advice }),
    alternatives: food.alternatives.map((a, i) =>
      t(`${p}.alternatives.${i}`, { defaultValue: a }),
    ),
    faqs: food.faqs.map((f, i) => ({
      question: t(`${p}.faqs.${i}.question`, { defaultValue: f.question }),
      answer: t(`${p}.faqs.${i}.answer`, { defaultValue: f.answer }),
    })),
  };
}
