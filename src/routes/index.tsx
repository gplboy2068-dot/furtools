import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
import { FeaturedTools, PopularTools } from "@/components/tool-sections";
import { Faq } from "@/components/faq";
import { CATEGORIES } from "@/data/categories";
import { TOOLS } from "@/data/tools";
import { AI_ASSISTANTS } from "@/data/ai-assistants";
import { SPECIES } from "@/data/species";
import { SPECIES_CONFIG } from "@/data/species-config";
import { SITE } from "@/lib/site";
import { buildHead } from "@/lib/seo";
import { faqSchema, itemListSchema } from "@/lib/schema";
import heroImg from "@/assets/hero-pets.jpg";

const HOME_FAQS = [
  {
    q: `How many free tools does ${SITE.name} offer?`,
    a: `${SITE.name} currently offers ${TOOLS.length}+ free calculators, generators, and planners for dogs, cats, birds, fish, small pets, reptiles, horses, and farm animals — with new tools shipping every week.`,
  },
  {
    q: "Do I need an account to use the tools?",
    a: "No. Every calculator, generator, and guide is free and works instantly with no signup. You only need an account if you want to save pet profiles, health records, or reminders in the My Pets dashboard.",
  },
  {
    q: "Are the AI assistants safe to use for medical questions?",
    a: `Our ${AI_ASSISTANTS.length} AI assistants are educational only — they never diagnose disease or replace a licensed veterinarian. For anything concerning, contact your vet immediately.`,
  },
  {
    q: "Which pets are supported?",
    a: "16 species: dogs, cats, birds, rabbits, fish, hamsters, guinea pigs, ferrets, turtles, snakes, lizards, horses, goats, sheep, chickens, and ducks.",
  },
  {
    q: "Can I check if a food is safe for my pet?",
    a: `Yes — use the free Food Safety Database or the "Can My Pet Eat This?" AI assistant to check whether a food is safe, needs moderation, or is toxic for your species.`,
  },
];

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: `${SITE.name} — ${TOOLS.length}+ Free Pet Tools, Calculators & AI Guides`,
      description: `${TOOLS.length}+ free pet calculators, name generators, breed database, food safety checker, and ${AI_ASSISTANTS.length} AI care assistants for dogs, cats, birds, fish, reptiles, horses & farm animals. No signup.`,
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
        faqSchema(HOME_FAQS),
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
  const { t } = useTranslation(["home", "common"]);
  const toolCount = TOOLS.length;
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
              <Sparkles className="size-3.5" /> {toolCount}+ {t("common:nav.tools")} · {aiCount} AI · {speciesCount} {t("home:featuredBreeds")}
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {t("home:heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t("home:heroDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/categories">
                  {t("home:browseAllTools", "Browse all {{count}}+ tools", { count: toolCount })} <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/ai">
                  <Sparkles className="mr-1 size-4" /> {t("home:askAi", "Ask AI")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full">
                <Link to="/search">
                  <Search className="mr-1 size-4" /> {t("home:searchTools", "Search tools")}
                </Link>
              </Button>
            </div>
            {/* Quick jump links (internal linking for crawl depth) */}
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {[
                { to: "/breeds", label: t("common:nav.breeds", "Breed Database") },
                { to: "/foods", label: t("common:nav.foods", "Food Safety") },
                { to: "/names", label: t("common:nav.names", "Name Finder") },
                { to: "/compare", label: t("common:nav.compare", "Breed Compare") },
                { to: "/cost-planner", label: t("common:nav.costPlanner", "Cost Planner") },
                { to: "/care", label: t("common:nav.carePlanner", "Care Planner") },
                { to: "/dashboard", label: t("common:nav.myPets", "My Pets") },
                { to: "/blog", label: t("common:nav.blog", "Blog") },
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
            <img
              src={heroImg}
              alt={`${SITE.name} — free calculators and AI tools for dogs, cats, and more`}
              width={1600}
              height={1000}
              className="w-full rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section aria-label="Platform stats" className="border-y border-border/60 bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { n: `${toolCount}+`, l: t("home:stats.freeTools", "Free tools"), to: "/categories" },
            { n: `${aiCount}`, l: t("home:stats.aiAssistants", "AI assistants"), to: "/ai" },
            { n: `${speciesCount}`, l: t("home:stats.speciesCovered", "Species covered"), to: "/breeds" },
            { n: "500+", l: t("home:stats.breedProfiles", "Breed profiles"), to: "/breeds" },
          ].map((s) => (
            <Link key={s.to + s.l} to={s.to} className="group text-center">
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
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("common:nav.categories", "Categories")}</div>
            <h2 id="categories-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("home:categoriesHeading", "Find the right tool for your pet")}
            </h2>
          </div>
          <Link to="/categories" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
            {t("home:seeAll", "See all →")}
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
                className="group rounded-2xl border border-border/70 bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{t(`categories:${c.slug}.name`, c.name)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(`categories:${c.slug}.description`, c.description)}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("home:explore", "Explore")} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
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
          <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("home:everythingOnFurTools", "Everything on FurTools")}</div>
          <h2 id="hubs-heading" className="mt-1 font-display text-3xl font-semibold">{t("home:exploreEveryHub", "Explore every hub")}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("home:hubDescription", "One platform for calculators, AI advice, breed research, food safety, name inspiration, cost planning, and end-to-end pet health records.")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/categories", icon: Calculator, title: t("common:nav.tools", "All Tools"), desc: `${toolCount}+ free calculators, generators and planners across every category.` },
            { to: "/ai", icon: Sparkles, title: t("common:nav.ai", "AI Assistants"), desc: `${aiCount} species- and topic-specific AI helpers for care, training, food and travel.` },
            { to: "/breeds", icon: Dog, title: t("common:nav.breeds", "Breed Database"), desc: "500+ breed profiles for dogs, cats, birds, rabbits, fish and horses." },
            { to: "/foods", icon: Salad, title: t("common:nav.foods", "Food Safety"), desc: "Is it safe? Look up any food and see safe / moderation / unsafe / toxic verdicts." },
            { to: "/names", icon: Sparkles, title: t("common:nav.names", "Name Finder"), desc: "AI + curated database — 10,000+ pet names filtered by species, style and vibe." },
            { to: "/compare", icon: Bone, title: t("common:nav.compare", "Breed Comparison"), desc: "Side-by-side breed comparison for size, temperament, care and cost." },
            { to: "/cost-planner", icon: Wallet, title: t("common:nav.costPlanner", "Cost Planner"), desc: "Estimate first-year and lifetime costs of owning a pet, itemized." },
            { to: "/care", icon: HeartPulse, title: t("common:nav.carePlanner", "Care Planner"), desc: "Reminders, weight logs and health events for every pet in your home." },
            { to: "/dashboard", icon: Stethoscope, title: t("common:nav.myPets", "My Pets Dashboard"), desc: "Multi-pet profiles, vaccines, medications, vet visits, expenses & AI insights." },
            { to: "/blog", icon: Bone, title: t("common:nav.blog", "Blog & Guides"), desc: "Long-form guides written for pet parents — SEO-first, vet-informed." },
            { to: "/search", icon: Search, title: t("common:actions.search", "Global Search"), desc: "Instantly search every tool, breed, food and article on the platform." },
            { to: "/contact", icon: Scissors, title: t("common:nav.contact", "Contact"), desc: "Suggest a tool, request a breed, or send feedback — we read every message." },
          ].map((h) => (
            <Link
              key={h.to}
              to={h.to}
              className="group flex gap-4 rounded-2xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <h.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{h.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("home:open", "Open")} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
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
              <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("common:nav.ai", "AI Assistants")}</div>
              <h2 id="ai-heading" className="mt-1 font-display text-3xl font-semibold">
                {t("home:aiSubheading", "{{count}} AI helpers — never diagnostic, always kind", { count: aiCount })}
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {t("home:aiDescription", "Ask about care, training, grooming, food safety, travel, or species-specific husbandry.")}
              </p>
            </div>
            <Link to="/ai" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
              {t("home:seeAll", "See all →")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAi.map((a) => (
              <Link
                key={a.slug}
                to="/ai/$slug"
                params={{ slug: a.slug }}
                className="group rounded-2xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
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
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("common:nav.breeds", "Breed Database")}</div>
            <h2 id="breeds-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("home:breedHeading", "500+ breed profiles across every species")}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Deep, plain-language breed pages with size, temperament, grooming, common health issues, and cost.
            </p>
          </div>
          <Link to="/breeds" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
            {t("home:browseAllBreeds", "Browse all breeds →")}
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
            <div className="text-xs font-medium uppercase tracking-wider text-primary">{t("home:ecosystemTitle", "Multi-pet ecosystem")}</div>
            <h2 id="species-heading" className="mt-1 font-display text-3xl font-semibold">
              {t("home:ecosystemHeading", "16 species, one dashboard")}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              From ball pythons to backyard chickens, every species gets its own care fields, AI assistant, and toolset.
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
                {t("home:ctaTitle", "Track every pet in your home — vaccines, meds, vet visits & expenses.")}
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/85">
                {t("home:ctaDescription", "My Pets is a free health dashboard with AI insights (never diagnostic). Add unlimited pets across 16 species.")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link to="/dashboard">{t("common:nav.myPets", "Open My Pets")} <ArrowRight className="ml-1 size-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/care">{t("common:nav.carePlanner", "Care Planner")}</Link>
                </Button>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {[
                { to: "/cost-planner", label: t("common:nav.costPlanner", "Cost Planner") },
                { to: "/compare", label: t("common:nav.compare", "Breed Compare") },
                { to: "/names", label: t("common:nav.names", "Name Finder") },
                { to: "/foods", label: t("common:nav.foods", "Food Safety") },
                { to: "/breeds", label: t("common:nav.breeds", "Breed Database") },
                { to: "/ai", label: t("common:nav.ai", "AI Assistants") },
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
        <Faq items={HOME_FAQS} title={t("common:faq.title", "Frequently asked questions")} />
      </section>
    </>
  );
}
