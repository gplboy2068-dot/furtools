import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, PawPrint, Search, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { GlobalSearch } from "./global-search";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { clearCustomSession, getActiveUser, type ActiveUser } from "@/lib/custom-google-auth";

const NAV = [
  { to: "/categories", label: "Tools" },
  { to: "/ai", label: "AI" },
  { to: "/breeds", label: "Breeds" },
  { to: "/foods", label: "Foods" },
  { to: "/names", label: "Names" },
  { to: "/dashboard", label: "My Pets" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
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
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: false }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Search tools"
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
                    <span className="max-w-[100px] truncate">{activeUser.name || "Account"}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-1 text-xs">
                  <LogOut className="size-3.5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-full gap-1.5 font-medium">
                <Link to="/auth">
                  <LogIn className="size-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
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
                    {n.label}
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
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-accent"
                  >
                    <LogIn className="size-4" />
                    <span>Login</span>
                  </Link>
                )}
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


