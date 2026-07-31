import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PawPrint } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/data/categories";
import { LanguageSwitcher } from "./language-switcher";

export function SiteFooter() {
  const { t } = useTranslation(["common", "home"]);

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
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("common:tagline")}</p>
          <div className="mt-4">
            <LanguageSwitcher variant="select" className="w-full max-w-[200px]" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("common:nav.tools")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary">{t("common:nav.tools")}</Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-primary">{t("common:nav.tools")}</Link>
            </li>
            <li>
              <Link to="/breeds" className="hover:text-primary">{t("common:nav.breeds")}</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary">{t("common:nav.blog")}</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-primary">{t("common:actions.search")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("common:nav.tools")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
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
            Legal
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">{t("common:nav.about")}</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">{t("common:nav.contact")}</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">{t("common:nav.privacy")}</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">{t("common:nav.terms")}</Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-primary">{t("common:nav.disclaimer")}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. {t("common:rights")}</p>
          <p>{t("common:rights")}</p>
        </div>
      </div>
    </footer>
  );
}
