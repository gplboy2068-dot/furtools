import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu, PawPrint, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { GlobalSearch } from "./global-search";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const NAV = [
    { to: "/categories", labelKey: "nav.tools" },
    { to: "/ai", labelKey: "nav.ai" },
    { to: "/breeds", labelKey: "nav.breeds" },
    { to: "/foods", labelKey: "nav.foods" },
    { to: "/names", labelKey: "nav.names" },
    { to: "/dashboard", labelKey: "nav.myPets" },
    { to: "/blog", labelKey: "nav.blog" },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </span>
            <span>{SITE.name}</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: false }}
              >
                {t(n.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={t("actions.search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
            <LanguageSwitcher variant="dropdown" />
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label={open ? t("actions.close") : t("actions.filter")}
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            className="border-t border-border/60 bg-background md:hidden"
            aria-label="Mobile"
            onClick={() => setOpen(false)}
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    activeProps={{ className: "bg-accent" }}
                    activeOptions={{ exact: false }}
                  >
                    {t(n.labelKey)}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <LanguageSwitcher variant="select" className="w-full" />
              </li>
            </ul>
          </nav>
        )}
      </header>
      <GlobalSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={(slug) => navigate({ to: "/tools/$slug", params: { slug } })}
      />
    </>
  );
}
