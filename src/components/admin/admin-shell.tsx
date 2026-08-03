import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/tools", label: "Tools", icon: Wrench },
      { to: "/admin/categories", label: "Categories", icon: FolderTree },
      { to: "/admin/blog", label: "Blog", icon: FileText },
      { to: "/admin/breeds", label: "Breeds", icon: Dog },
      { to: "/admin/foods", label: "Foods", icon: Apple },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/admin/media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/admin/seo", label: "SEO", icon: Search },
      { to: "/admin/links", label: "Internal Links", icon: Link2 },
      { to: "/admin/search-console", label: "Search Console", icon: Globe },
      { to: "/admin/ads", label: "Ads", icon: Megaphone },
      { to: "/admin/affiliates", label: "Affiliates", icon: DollarSign },
    ],
  },
  {
    label: "Engagement",
    items: [
      { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { to: "/admin/email-templates", label: "Email Templates", icon: MailPlus },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/settings", label: "Settings", icon: Settings },
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

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean); // e.g. ['admin','tools']
  const crumbs: { label: string; to: string }[] = [];
  let path = "";
  for (const p of parts) {
    path += `/${p}`;
    const item = ALL_NAV_ITEMS.find((i) => i.to === path);
    const label =
      item?.label ??
      p
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, to: path });
  }
  return crumbs;
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
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return ADMIN_NAV_SECTIONS;
    return ADMIN_NAV_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
    })).filter((s) => s.items.length > 0);
  }, [filter]);

  return (
    <>
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search menu…"
              className="h-8 rounded-md border-border/60 bg-muted/40 pl-8 text-xs"
            />
          </div>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {filtered.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {section.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
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
                          <span className="flex-1 truncate">{item.label}</span>
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
        {filtered.length === 0 && !collapsed && (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">No matches</div>
        )}
      </nav>
    </>
  );
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
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
            Admin
          </span>
        </div>
      )}
    </Link>
  );
}

function SidebarFooter({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-border/60 p-2">
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center",
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useCollapsed();
  const [navFilter, setNavFilter] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    let mounted = true;
    async function run() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUser(data.user);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
    }
    run();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return (
      <div className="grid h-dvh place-items-center bg-muted/30 text-sm text-muted-foreground">
        Loading admin…
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

  const crumbs = buildBreadcrumbs(location.pathname);
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

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <div key={c.to} className="flex min-w-0 items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                  )}
                  {isLast ? (
                    <span className="truncate font-medium">{c.label}</span>
                  ) : (
                    <Link
                      to={c.to}
                      className="truncate text-muted-foreground hover:text-foreground"
                    >
                      {c.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Global search */}
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search…"
                className="h-9 w-56 rounded-md border-border/60 bg-muted/40 pl-8 text-sm lg:w-72"
                onChange={(e) => setNavFilter(e.target.value)}
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
                /
              </kbd>
            </div>

            {/* Quick actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-1 rounded-md sm:flex">
                  <Plus className="size-4" />
                  <span className="hidden lg:inline">New</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/blog">New blog post</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/breeds">New breed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/foods">New food</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/faqs">New FAQ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </Button>

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
                  <div className="text-xs font-normal text-muted-foreground">Signed in as</div>
                  <div className="truncate text-sm">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 size-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users">
                    <UserIcon className="mr-2 size-4" /> Users
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 size-4" /> View public site
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" /> Sign out
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
  const env =
    typeof import.meta !== "undefined" && import.meta.env?.DEV ? "development" : "production";
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 pb-6 pt-2 text-[11px] text-muted-foreground sm:px-6">
      <div>© {year} FurTools Admin</div>
      <div className="flex items-center gap-3">
        <span>v1.0.0</span>
        <span className="hidden sm:inline">·</span>
        <span className="capitalize">{env}</span>
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

// Backwards-compat export for any code importing ADMIN_NAV
export const ADMIN_NAV: NavItem[] = ALL_NAV_ITEMS;
