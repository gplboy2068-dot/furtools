import { useTranslation } from "react-i18next";
import { CATEGORIES, type Category } from "@/data/categories";

/**
 * Returns the category list with name/description translated
 * via the "categories" key in the common namespace.
 * Falls back to the English source strings when a key is missing.
 */
export function useTranslatedCategories(): Category[] {
  const { t } = useTranslation("common");
  return CATEGORIES.map((c) => ({
    ...c,
    name: t(`categories.${c.slug}.name`, { defaultValue: c.name }),
    description: t(`categories.${c.slug}.description`, { defaultValue: c.description }),
  }));
}
