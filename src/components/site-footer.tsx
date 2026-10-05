import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SITE } from "@/lib/site";
import { useTranslatedCategories } from "@/lib/use-translated-categories";

export function SiteFooter() {
  const { t } = useTranslation("common");
  const categories = useTranslatedCategories();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { to: "/", key: "footer.home" },
    { to: "/categories", key: "footer.allCategories" },
    { to: "/breeds", key: "footer.breedDatabase" },
    { to: "/foods", key: "footer.foodSafetyGuide" },
    { to: "/ai", key: "footer.aiAssistants" },
    { to: "/compare", key: "footer.compareBreeds" },
    { to: "/cost-planner", key: "footer.costPlanner" },
    { to: "/names", key: "footer.nameFinder" },
    { to: "/care", key: "footer.careReminders" },
    { to: "/blog", key: "footer.blogGuides" },
    { to: "/search", key: "footer.searchTools" },
  ] as const;

  const legalLinks = [
    { to: "/about", key: "footer.about" },
    { to: "/contact", key: "footer.contact" },
    { to: "/privacy", key: "footer.privacy" },
    { to: "/terms", key: "footer.terms" },
    { to: "/disclaimer", key: "footer.disclaimer" },
  ] as const;

  return (
    <footer className="mt-24 border-t border-border/60 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </span>
            <span>{SITE.name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("footer.explore")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">{t(l.key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("footer.categories")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("footer.legal")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">{t(l.key)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {year} {SITE.name}. {t("footer.madeWith")}</p>
          <p>{t("footer.disclaimerText")}</p>
        </div>
      </div>
    </footer>
  );
}
