import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import { useTranslatedCategories } from "@/lib/use-translated-categories";
import {
  TOOLS_SUMMARY,
  TOTAL_TOOLS_COUNT,
  getToolSummary,
  searchToolsSummary,
  type ToolSummary,
} from "@/data/tools-summary";
import { breadcrumbSchema } from "@/lib/schema";
import { buildHead } from "@/lib/seo";
import { ChevronRight, Search as SearchIcon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/tools/")({
  head: () =>
    buildHead({
      title: `Pet Tools Directory — All ${TOTAL_TOOLS_COUNT} Free Tools | FurTools`,
      description: `The complete FurTools directory: every free pet calculator, planner, identifier and checker in one A–Z list. Filter by pet type or search all ${TOTAL_TOOLS_COUNT} tools instantly.`,
      path: "/tools",
      schemas: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]),
      ],
    }),
  component: ToolsIndex,
});

// Curated flagship tools for the "Popular right now" strip. Resolved through
// getToolSummary below, so a renamed/removed slug simply drops out.
const POPULAR_SLUGS = [
  "dog-age-calculator",
  "cat-age-calculator",
  "dog-food-calculator",
  "dog-water-calculator",
  "dog-calorie-calculator",
  "cat-food-calculator",
  "pet-body-condition-photo",
  "poop-health-analyzer",
];

const byName = (a: ToolSummary, b: ToolSummary) => a.name.localeCompare(b.name);

function ToolsIndex() {
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const categories = useTranslatedCategories();

  const popular = useMemo(
    () =>
      POPULAR_SLUGS.map((s) => getToolSummary(s)).filter(
        (t): t is ToolSummary => Boolean(t),
      ),
    [],
  );

  // Filter chips: every real category with its tool count. The "horse-tools"
  // category is an alias of "horses", so it is skipped to avoid double counts.
  const chips = useMemo(
    () =>
      categories
        .filter((c) => c.slug !== "horse-tools")
        .map((c) => ({
          slug: c.slug,
          name: c.name,
          count: TOOLS_SUMMARY.filter((t) => t.category === c.slug).length,
        }))
        .filter((c) => c.count > 0),
    [categories],
  );

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.slug, c.name]));
    return (slug: string) => map.get(slug) ?? slug;
  }, [categories]);

  const filtered = useMemo(() => {
    let list = q.trim() ? searchToolsSummary(q.trim()) : [...TOOLS_SUMMARY];
    if (activeCat) list = list.filter((t) => t.category === activeCat);
    return list.sort(byName);
  }, [q, activeCat]);

  // Default view (no search, "All" chip): group the directory A–Z.
  // Any filter/search state switches to a single flat list.
  const grouped = useMemo(() => {
    if (q.trim() || activeCat) return null;
    const map = new Map<string, ToolSummary[]>();
    for (const t of filtered) {
      const first = t.name.charAt(0).toUpperCase();
      const letter = first >= "A" && first <= "Z" ? first : "#";
      const bucket = map.get(letter);
      if (bucket) bucket.push(t);
      else map.set(letter, [t]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, q, activeCat]);

  const chipClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm transition ${
      active
        ? "bg-primary font-medium text-primary-foreground"
        : "border border-border bg-card hover:border-primary hover:text-primary"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Tools" }]} />

      {/* Slim header — deliberately unlike the big browse hero on /categories */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">Tools Directory</h1>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {TOTAL_TOOLS_COUNT} free tools
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Every FurTools tool in a single A–Z index. Start from a popular pick, narrow the
        list by pet, or search the directory directly.
      </p>

      {/* Popular tools strip */}
      <div className="mt-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="size-3.5" /> Popular right now
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {popular.map((t) => (
            <Link
              key={t.slug}
              to="/tools/$slug"
              params={{ slug: t.slug }}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky filter toolbar (site header occupies the top 4rem) */}
      <div className="sticky top-16 z-30 -mx-4 mt-8 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1 sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search the directory — try 'dog food' or 'aquarium'`}
              className="h-10 pl-9"
              aria-label="Search tools"
            />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {TOTAL_TOOLS_COUNT} tools
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCat(null)}
            className={chipClass(activeCat === null)}
            aria-pressed={activeCat === null}
          >
            All · {TOTAL_TOOLS_COUNT}
          </button>
          {chips.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActiveCat(activeCat === c.slug ? null : c.slug)}
              className={chipClass(activeCat === c.slug)}
              aria-pressed={activeCat === c.slug}
            >
              {c.name} · {c.count}
            </button>
          ))}
        </div>
      </div>

      {/* Compact directory list */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No tools match that combination. Try a broader search term or a different
          category.
        </div>
      ) : grouped ? (
        grouped.map(([letter, tools]) => (
          <section key={letter} className="mt-8 first:mt-6">
            <h2 className="border-b-2 border-primary/25 pb-1 font-display text-xl font-semibold">
              {letter}
            </h2>
            <DirectoryRows tools={tools} categoryName={categoryName} />
          </section>
        ))
      ) : (
        <div className="mt-4">
          <DirectoryRows tools={filtered} categoryName={categoryName} />
        </div>
      )}
    </div>
  );
}

function DirectoryRows({
  tools,
  categoryName,
}: {
  tools: ToolSummary[];
  categoryName: (slug: string) => string;
}) {
  return (
    <ul className="divide-y divide-border/60">
      {tools.map((t) => (
        <li key={t.slug}>
          <Link
            to="/tools/$slug"
            params={{ slug: t.slug }}
            className="group flex items-center gap-3 px-2 py-2.5 transition hover:bg-muted/60 sm:px-3"
          >
            <span className="min-w-0 flex-1">
              <span className="font-medium group-hover:text-primary">{t.name}</span>
              <span className="block truncate text-sm text-muted-foreground">
                {t.tagline}
              </span>
            </span>
            <span className="hidden shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground sm:inline-flex">
              {categoryName(t.category)}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
