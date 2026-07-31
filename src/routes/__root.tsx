import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/lib/i18n";
import { generateHreflangTags } from "@/lib/i18n-routes";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";

function NotFoundComponent() {
  const { t } = useTranslation(["errors", "common"]);
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="font-display text-7xl font-semibold text-primary">404</div>
      <h1 className="mt-4 font-display text-2xl font-semibold">{t("errors:notFoundTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("errors:notFoundDesc")}
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        {t("errors:goHome")}
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation(["errors", "common"]);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">{t("errors:somethingWentWrong")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("errors:errorDesc")}
      </p>
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("common:actions.retry")}
        </button>
        <a
          href="/"
          className="rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
        >
          {t("errors:goHome")}
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.author },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#c2694a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;500;600;700&display=swap",
      },
      { rel: "alternate", type: "application/rss+xml", title: `${SITE.name} Blog`, href: "/rss.xml" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap-index.xml" },
      ...generateHreflangTags("/"),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationSchema()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema()),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(i18n.language || 'en');
  const [dir, setDir] = useState(i18n.dir() || 'ltr');

  useEffect(() => {
    const handleLangChange = (newLang: string) => {
      setLang(newLang);
      setDir(i18n.dir(newLang));
    };
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  return (
    <html lang={lang} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChromeless = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {isChromeless ? (
          <Outlet />
        ) : (
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
          </div>
        )}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
