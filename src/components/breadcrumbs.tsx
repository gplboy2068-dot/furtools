import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useTranslation("common");

  const getLocalizedLabel = (label: string) => {
    const keyMap: Record<string, string> = {
      Breeds: t("nav.breeds", "Breeds"),
      Foods: t("nav.foods", "Foods"),
      Tools: t("nav.tools", "Tools"),
      Blog: t("nav.blog", "Blog"),
      "My Pets": t("nav.myPets", "My Pets"),
      Dashboard: t("nav.dashboard", "Dashboard"),
      Admin: t("nav.admin", "Admin"),
    };
    return keyMap[label] || t(label, label);
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-foreground">
            <Home className="size-3.5" aria-hidden />
            <span className="sr-only">{t("nav.home", "Home")}</span>
          </Link>
        </li>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const displayLabel = getLocalizedLabel(c.label);
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
              {last || !c.to ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {displayLabel}
                </span>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Link to={c.to as any} params={c.params as any} className="hover:text-foreground">
                  {displayLabel}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
