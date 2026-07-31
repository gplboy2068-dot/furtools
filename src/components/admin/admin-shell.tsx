import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getActiveUser, clearCustomSession } from "@/lib/custom-google-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  FolderTree,
  FileText,
  Dog,
  Apple,
  HelpCircle,
  Search,
  Link2,
  ImageIcon,
  Users,
  BarChart3,
  Globe,
  Megaphone,
  DollarSign,
  Mail,
  MailPlus,
  Settings,
  LogOut,
  Menu,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Bell,
  Plus,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  User as UserIcon,
} from "lucide-react";

type NavItem = {
  to: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
};

type NavSection = {
  labelKey: string;
  items: NavItem[];
};

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    labelKey: "nav.overview",
    items: [
      { to: "/admin", labelKey: "nav.dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/analytics", labelKey: "nav.analytics", icon: BarChart3 },
    ],
  },
  {
    labelKey: "nav.content",
    items: [
      { to: "/admin/tools", labelKey: "nav.tools", icon: Wrench },
      { to: "/admin/categories", labelKey: "nav.categories", icon: FolderTree },
      { to: "/admin/blog", labelKey: "nav.blog", icon: FileText },
      { to: "/admin/breeds", labelKey: "nav.breeds", icon: Dog },
      { to: "/admin/foods", labelKey: "nav.foods", icon: Apple },
      { to: "/admin/faqs", labelKey: "nav.faqs", icon: HelpCircle },
      { to: "/admin/media", labelKey: "nav.media", icon: ImageIcon },
    ],
  },
  {
    labelKey: "nav.growth",
    items: [
      { to: "/admin/seo", labelKey: "nav.seo", icon: Search },
      { to: "/admin/links", labelKey: "nav.internalLinks", icon: Link2 },
      { to: "/admin/search-console", labelKey: "nav.searchConsole", icon: Globe },
      { to: "/admin/ads", labelKey: "nav.ads", icon: Megaphone },
      { to: "/admin/affiliates", labelKey: "nav.affiliates", icon: DollarSign },
    ],
  },
  {
    labelKey: "nav.engagement",
    items: [
      { to: "/admin/newsletter", labelKey: "nav.newsletter", icon: Mail },
      { to: "/admin/email-templates", labelKey: "nav.emailTemplates", icon: MailPlus },
    ],
  },
  {
    labelKey: "nav.administration",
    items: [
      { to: "/admin/translations", labelKey: "nav.translations", icon: Globe },
      { to: "/admin/users", labelKey: "nav.users", icon: Users },
      { to: "/admin/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];

const ALL_NAV_ITEMS = ADMIN_NAV_SECTIONS.flatMap((s) => s.items);
const SIDEBAR_COLLAPSE_KEY = "furtools-admin-sidebar-collapsed";

function useCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {
      /* noop */
    }
  }, []);
  const set = (v: boolean) => {
    setCollapsed(v);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, v ? "1" : "0");
    } catch {
      /* noop */
    }
  };
  return [collapsed, set] as const;
}

function SidebarNav({
  collapsed,
  onNavigate,
  filter,
  setFilter,
  pathname,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  filter: string;
  setFilter: (v: string) => void;
  pathname: string;
}) {
  const { t } = useTranslation("admin");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return ADMIN_NAV_SECTIONS;
    return ADMIN_NAV_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((i) => t(i.labelKey).toLowerCase().includes(q)),
    })).filter((s) => s.items.length > 0);
  }, [filter, t]);

  return (
    <>
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="h-8 rounded-md border-border/60 bg-muted/40 pl-8 text-xs"
            />
          </div>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {filtered.map((section) => (
          <div key={section.labelKey} className="mb-4">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {t(section.labelKey)}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                const label = t(item.labelKey);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        collapsed && "justify-center px-2",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 h-[calc(100%-12px)] w-0.5 rounded-r bg-primary" />
                      )}
                      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation("admin");
  return (
    <Link
      to="/admin"
      className={cn(
        "flex h-14 items-center gap-2 border-b border-border/60 px-4",
        collapsed && "justify-center px-0",
      )}
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <span className="font-display text-sm font-bold">F</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold">FurTools</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("title")}
          </span>
        </div>
      )}
    </Link>
  );
}

function SidebarFooter({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t } = useTranslation("admin");
  return (
    <div className="border-t border-border/60 p-2">
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center",
        )}
        aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
      >
        {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        {!collapsed && <span>{t("nav.collapse")}</span>}
      </button>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("admin");
  const [user, setUser] = useState<{ id: string; email: string; name?: string; avatarUrl?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useCollapsed();
  const [navFilter, setNavFilter] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const activeUser = await getActiveUser();
        if (!mounted) return;
        if (!activeUser) {
          navigate({ to: "/auth" });
          return;
        }
        setUser(activeUser);

        // Super-admin email bypass
        if (activeUser.email && activeUser.email.toLowerCase() === "gplboy2068@gmail.com") {
          setIsAdmin(true);
          return;
        }

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", activeUser.id);

        const hasAdminRole = (roles ?? []).some((r) => r.role === "admin");
        setIsAdmin(hasAdminRole || activeUser.isCustomGoogle || false);
      } catch (err) {
        console.error("Admin auth check error:", err);
        if (mounted) setIsAdmin(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function signOut() {
    clearCustomSession();
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return (
      <div className="grid h-dvh place-items-center bg-muted/30 text-sm text-muted-foreground">
        {t("crud.loading")}
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="grid h-dvh place-items-center bg-muted/30 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {user?.email} doesn't have admin access.
          </p>
          <Button onClick={signOut} variant="outline" className="mt-6 rounded-full">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const userInitial = (user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-muted/30 text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "relative hidden shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 lg:flex",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <SidebarBrand collapsed={collapsed} />
        <SidebarNav
          collapsed={collapsed}
          filter={navFilter}
          setFilter={setNavFilter}
          pathname={location.pathname}
        />
        <SidebarFooter collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <SidebarBrand collapsed={false} />
            <SidebarNav
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
              filter={navFilter}
              setFilter={setNavFilter}
              pathname={location.pathname}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <div className="ml-auto flex items-center gap-1.5">
            <LanguageSwitcher variant="dropdown" />

            {/* Quick actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-1 rounded-md sm:flex">
                  <Plus className="size-4" />
                  <span className="hidden lg:inline">{t("nav.create")}</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t("nav.create")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/blog">{t("nav.newBlogPost")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/breeds">{t("nav.newBreed")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/foods">{t("nav.newFood")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/faqs">{t("nav.newFaq")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Profile menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted"
                  aria-label="Profile menu"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {userInitial}
                  </span>
                  <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-xs font-normal text-muted-foreground">{t("nav.signedInAs")}</div>
                  <div className="truncate text-sm">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 size-4" /> {t("nav.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users">
                    <UserIcon className="mr-2 size-4" /> {t("nav.users")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 size-4" /> {t("nav.viewPublicSite")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
          <AdminFooter />
        </main>
      </div>
    </div>
  );
}

function AdminFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 pb-6 pt-2 text-[11px] text-muted-foreground sm:px-6">
      <div>© {year} FurTools Admin</div>
      <div className="flex items-center gap-3">
        <span>v1.0.0</span>
      </div>
    </footer>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export const ADMIN_NAV = ALL_NAV_ITEMS;
