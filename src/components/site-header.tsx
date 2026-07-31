import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu, PawPrint, Search, User, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { GlobalSearch } from "./global-search";
import { SITE } from "@/lib/site";
import { getActiveUser, ActiveUser } from "@/lib/custom-google-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  useEffect(() => {
    getActiveUser().then(setActiveUser);
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      getActiveUser().then(setActiveUser);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
          <div className="ml-auto flex items-center gap-1.5">
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

            {activeUser ? (
              <Link to="/dashboard" className="ml-1">
                <Button variant="outline" size="sm" className="rounded-full gap-1.5 font-medium border-primary/30">
                  {activeUser.avatarUrl ? (
                    <img src={activeUser.avatarUrl} alt="" className="size-4.5 rounded-full object-cover" />
                  ) : (
                    <User className="size-4 text-primary" />
                  )}
                  <span className="max-w-[80px] sm:max-w-[110px] truncate text-xs sm:text-sm">
                    {activeUser.name || "Account"}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth" className="ml-1">
                <Button size="sm" className="rounded-full gap-1.5 font-medium shadow-xs text-xs sm:text-sm px-3.5">
                  <LogIn className="size-4" />
                  <span>Sign in</span>
                </Button>
              </Link>
            )}

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
              <li className="pt-2 border-t border-border/60 mt-2">
                {activeUser ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
                  >
                    <span className="flex items-center gap-2">
                      {activeUser.avatarUrl ? (
                        <img src={activeUser.avatarUrl} alt="" className="size-5 rounded-full object-cover" />
                      ) : (
                        <User className="size-4" />
                      )}
                      {activeUser.name || "My Dashboard"}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm"
                  >
                    <LogIn className="size-4" />
                    <span>Sign in / Create Account</span>
                  </Link>
                )}
              </li>
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
