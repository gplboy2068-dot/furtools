import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, PawPrint, Search, User as UserIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { clearCustomSession, getActiveUser, type ActiveUser } from "@/lib/custom-google-auth";

const GlobalSearch = lazy(() =>
  import("./global-search").then((m) => ({ default: m.GlobalSearch }))
);

const NAV_KEYS = [
  { to: "/categories", key: "nav.tools" },
  { to: "/ai", key: "nav.ai" },
  { to: "/breeds", key: "nav.breeds" },
  { to: "/foods", key: "nav.foods" },
  { to: "/names", key: "nav.names" },
  { to: "/dashboard", key: "nav.myPets" },
  { to: "/blog", key: "nav.blog" },
] as const;

export function SiteHeader() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveUser().then(setActiveUser);

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      getActiveUser().then(setActiveUser);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    clearCustomSession();
    await supabase.auth.signOut();
    setActiveUser(null);
    navigate({ to: "/" });
  };

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
            {NAV_KEYS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: false }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={t("header.searchTools")}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
            <LanguageSwitcher variant="dropdown" />
            <ThemeSwitcher />

            {activeUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="rounded-full gap-2">
                  <Link to="/dashboard">
                    {activeUser.avatarUrl ? (
                      <img src={activeUser.avatarUrl} alt={activeUser.name} className="size-5 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="size-4" />
                    )}
                    <span className="max-w-[100px] truncate">{activeUser.name || t("header.account")}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-1 text-xs">
                  <LogOut className="size-3.5" />
                  <span>{t("header.logout")}</span>
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-full gap-1.5 font-medium">
                <Link to="/auth">
                  <LogIn className="size-4" />
                  <span>{t("header.login")}</span>
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
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
              {NAV_KEYS.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    activeProps={{ className: "bg-accent" }}
                    activeOptions={{ exact: false }}
                  >
                    {t(n.key)}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-border/60">
                {activeUser ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <UserIcon className="size-4" />
                      <span>{activeUser.name || activeUser.email}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-accent"
                    >
                      <LogOut className="size-4" />
                      <span>{t("header.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
                  >
                    <LogIn className="size-4" />
                    <span>{t("header.login")}</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>
      {searchOpen && (
        <Suspense fallback={null}>
          <GlobalSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            onSelect={(slug) => navigate({ to: "/tools/$slug", params: { slug } })}
          />
        </Suspense>
      )}
    </>
  );
}


