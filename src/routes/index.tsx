import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bird,
  Bone,
  Calculator,
  Cat,
  Dog,
  Egg,
  Fish,
  HeartPulse,
  PawPrint,
  Rabbit,
  Salad,
  Scissors,
  Search,
  Sparkles,
  Squirrel,
  Stethoscope,
  Turtle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FeaturedTools, PopularTools } from "@/components/tool-sections";
import { Faq } from "@/components/faq";
import { CATEGORIES } from "@/data/categories";
import { TOTAL_TOOLS_COUNT } from "@/data/tools-summary";
import { AI_ASSISTANTS } from "@/data/ai-assistants";
import { SPECIES } from "@/data/species";
import { SPECIES_CONFIG } from "@/data/species-config";
import { SITE } from "@/lib/site";
import { buildHead } from "@/lib/seo";
import { faqSchema, itemListSchema } from "@/lib/schema";
import heroImgWebp from "@/assets/hero-pets.webp";
import heroImgMobileWebp from "@/assets/hero-pets-mobile.webp";

function useHomeFaqs(t: (k: string, o?: any) => string, toolCount: number, aiCount: number) {
  return [0, 1, 2, 3, 4].map((i) => ({
    q: t(`faqs.${i}.q`, { count: toolCount, aiCount }),
    a: t(`faqs.${i}.a`, { count: toolCount, aiCount }),
  }));
}

const HOME_FAQ_SCHEMA = [
  { q: "How many free tools does FurTools offer?", a: "FurTools currently offers 233+ free calculators, generators, and planners for dogs, cats, birds, fish, small pets, reptiles, horses, and farm animals — with new tools shipping every week." },
  { q: "Do I need an account to use the tools?", a: "No. Every calculator, generator, and guide is free and works instantly with no signup." },
  { q: "Are the AI assistants safe to use for medical questions?", a: "Our AI assistants are educational only — they never diagnose disease or replace a licensed veterinarian." },
  { q: "Which pets are supported?", a: "16 species: dogs, cats, birds, rabbits, fish, hamsters, guinea pigs, ferrets, turtles, snakes, lizards, horses, goats, sheep, chickens, and ducks." },
  { q: "Can I check if a food is safe for my pet?", a: "Yes — use the free Food Safety Database to check whether a food is safe, needs moderation, or is toxic for your species." },
];

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: `${SITE.name} — ${TOTAL_TOOLS_COUNT}+ Free Pet Tools, Calculators & AI Guides`,
      description: `${TOTAL_TOOLS_COUNT}+ free pet calculators, name generators, breed database, food safety checker, and ${AI_ASSISTANTS.length} AI care assistants for dogs, cats, birds, fish, reptiles, horses & farm animals. No signup.`,
      path: "/",
      type: "website",
      keywords: [
        "pet tools",
        "pet calculators",
        "dog age calculator",
        "cat age calculator",
        "pet name generator",
        "breed database",
        "pet food safety",
        "AI pet assistant",
        "pet care app",
        "free pet tools",
      ],
      schemas: [
        faqSchema(HOME_FAQ_SCHEMA),
        itemListSchema([
          { name: "All Pet Tools", url: "/categories" },
          { name: "Breed Database", url: "/breeds" },
          { name: "Food Safety Database", url: "/foods" },
          { name: "AI Pet Assistants", url: "/ai" },
          { name: "Pet Name Finder", url: "/names" },
          { name: "Breed Comparison", url: "/compare" },
          { name: "Pet Cost Planner", url: "/cost-planner" },
          { name: "Pet Care Planner", url: "/care" },
          { name: "My Pets Dashboard", url: "/dashboard" },
          { name: "Blog", url: "/blog" },
        ]),
      ],
    }),
  component: Home,
});

const ICONS: Record<string, LucideIcon> = {
  Dog, Cat, Bird, Fish, Rabbit, Turtle, PawPrint, Egg, Bone, Squirrel,
  HeartPulse, Salad, Scissors, Sparkles, Stethoscope,
};

function Home() {
  const { t } = useTranslation("home");
  const toolCount = TOTAL_TOOLS_COUNT;
  const aiCount = AI_ASSISTANTS.length;
  const speciesCount = Object.keys(SPECIES_CONFIG).length;
  const featuredAi = AI_ASSISTANTS.slice(0, 8);
  const liveSpecies = SPECIES.filter((s) => s.live);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="size-3.5" /> {t("heroBadge", { toolCount, aiCount, speciesCount })}
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {t("heroTitlePrefix")} <span className="text-primary">{t("heroTitleHighlight")}</span> {t("heroTitleSuffix")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t("heroDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/categories">
                  {t("browseAllTools", { count: toolCount })} <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/ai">
                  <Sparkles className="mr-1 size-4" /> {t("askAi")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full">
                <Link to="/search">
                  <Search className="mr-1 size-4" /> {t("searchTools")}
                </Link>
              </Button>
            </div>
            {/* Quick jump links (internal linking for crawl depth) */}
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {[
                { to: "/breeds", label: t("quickLinks.breedDatabase") },
                { to: "/foods", label: t("quickLinks.foodSafety") },
                { to: "/names", label: t("quickLinks.nameFinder") },
                { to: "/compare", label: t("quickLinks.breedCompare") },
                { to: "/cost-planner", label: t("quickLinks.costPlanner") },
                { to: "/care", label: t("quickLinks.carePlanner") },
                { to: "/dashboard", label: t("quickLinks.myPets") },
                { to: "/blog", label: t("quickLinks.blog") },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="underline-offset-4 hover:text-primary hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <picture>
              <source
                type="image/webp"
                media="(max-width: 640px)"
                srcSet={heroImgMobileWebp}
                width={640}
                height={400}
              />
              <img
                src={heroImgWebp}
                alt={`${SITE.name} — free calculators and AI tools for dogs, cats, and more`}
                width={1600}
                height={1000}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="w-full rounded-3xl aspect-[16/10] object-cover"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section aria-label="Platform stats" className="border-y border-border/60 bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { n: `${toolCount}+`, l: t("stats.freeTools"), to: "/categories" },
            { n: `${aiCount}`, l: t("stats.aiAssistants"), to: "/ai" },
            { n: `${speciesCount}`, l: t("stats.speciesCovered"), to: "/breeds" },
            { n: "500+", l: t("stats.breedProfiles"), to: "/breeds" },
          ].map((s) => (
            <Link key={s.l} to={s.to} className="group text-center">
              <div className="font-display text-3xl font-semibold text-primary sm:text-4xl">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">{s.l}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="categories-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("categoriesEyebrow")}</div>
            <h2 id="categories-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("categoriesHeading")}
            </h2>
          </div>
          <Link to="/categories" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
            {t("seeAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon] ?? PawPrint;
            return (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border/70 bg-card p-6 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("explore")} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FeaturedTools />
      </section>

      {/* Popular Tools */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <PopularTools />
      </section>

      {/* Feature Hubs (all major sections of the platform) */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="hubs-heading">
        <div className="mb-8">
          <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("hubsEyebrow")}</div>
          <h2 id="hubs-heading" className="mt-1 font-display text-3xl font-semibold">{t("hubsHeading")}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("hubDescription")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/categories", icon: Calculator, tkey: "tools", tcount: toolCount },
            { to: "/ai", icon: Sparkles, tkey: "ai", tcount: aiCount },
            { to: "/breeds", icon: Dog, tkey: "breeds" },
            { to: "/foods", icon: Salad, tkey: "foods" },
            { to: "/names", icon: Sparkles, tkey: "names" },
            { to: "/compare", icon: Bone, tkey: "compare" },
            { to: "/cost-planner", icon: Wallet, tkey: "costPlanner" },
            { to: "/care", icon: HeartPulse, tkey: "care" },
            { to: "/dashboard", icon: Stethoscope, tkey: "dashboard" },
            { to: "/blog", icon: Bone, tkey: "blog" },
            { to: "/search", icon: Search, tkey: "search" },
            { to: "/contact", icon: Scissors, tkey: "contact" },
          ].map((h) => (
            <Link
              key={h.to}
              to={h.to}
              className="group flex gap-4 rounded-2xl border border-border/70 bg-card p-5 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <h.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{t(`hubs.${h.tkey}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`hubs.${h.tkey}.desc`, { count: h.tcount ?? toolCount })}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("open")} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI assistants */}
      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="ai-heading">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("aiEyebrow")}</div>
              <h2 id="ai-heading" className="mt-1 font-display text-3xl font-semibold">
                {t("aiHeading", { count: aiCount })}
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {t("aiDescription")}
              </p>
            </div>
            <Link to="/ai" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
              See all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAi.map((a) => (
              <Link
                key={a.slug}
                to="/ai/$slug"
                params={{ slug: a.slug }}
                className="group rounded-2xl border border-border/70 bg-card p-5 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <a.icon className="size-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Breed Database */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="breeds-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("breedEyebrow")}</div>
            <h2 id="breeds-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("breedHeading")}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {t("breedDescription")}
            </p>
          </div>
          <Link to="/breeds" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
            {t("browseAllBreeds")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveSpecies.map((s) => {
            const Icon = ICONS[s.icon] ?? PawPrint;
            return (
              <Link
                key={s.slug}
                to="/breeds"
                className="group rounded-2xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">{s.plural}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Species ecosystem */}
      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="species-heading">
          <div className="mb-8">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("speciesEyebrow")}</div>
            <h2 id="species-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("speciesHeading")}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {t("speciesDescription")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(SPECIES_CONFIG).map((s) => {
              const Icon = ICONS[s.icon] ?? PawPrint;
              return (
                <Link
                  key={s.slug}
                  to="/ai/$slug"
                  params={{ slug: s.aiSlug }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm transition hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                  {s.plural}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/85">
                {t("ctaDescription")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link to="/dashboard">{t("openMyPets")} <ArrowRight className="ml-1 size-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/care">{t("carePlanner")}</Link>
                </Button>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {[
                { to: "/cost-planner", label: t("quickLinks.costPlanner") },
                { to: "/compare", label: t("quickLinks.breedCompare") },
                { to: "/names", label: t("quickLinks.nameFinder") },
                { to: "/foods", label: t("quickLinks.foodSafety") },
                { to: "/breeds", label: t("quickLinks.breedDatabase") },
                { to: "/ai", label: t("quickLinks.aiAssistants") },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center justify-between rounded-xl bg-primary-foreground/10 px-4 py-3 hover:bg-primary-foreground/20"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Faq items={useHomeFaqs(t, toolCount, aiCount)} title={t("faqTitle")} />
      </section>
    </>
  );
}
